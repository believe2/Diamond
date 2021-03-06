var EventQueueHandler = function() {
	this.eventQueue = new Array();
	this.threadEventHandler = null;
};

EventQueueHandler.prototype.initialObj = function(mapFactory, objFactory, soundEffectFactory, mainPanel, scoreboard) {
	this.map = mapFactory;
	this.objFactory = objFactory;
	this.soundEffectFactory = soundEffectFactory;
	this.mainPanel = mainPanel;
	this.scoreboard = scoreboard;
};
//start thread to listen eventQueue
EventQueueHandler.prototype.start = function() {  
	this.threadEventHandler = setInterval(this.handleEvent.bind(this), 1);
};
//stop running action
EventQueueHandler.prototype.stop = function(id) {
	clearInterval(this.threadEventHandler);
	this.threadEventHandler = null;
};
//interface for other game object sending action event
EventQueueHandler.prototype.throwEvent = function(eventType, obj, action, parms) {
	this.eventQueue.push({'type': eventType, 'obj': obj, 'action': action, 'parms': parms});
};
//handling all type of event of every game object
EventQueueHandler.prototype.handleEvent = function() {  
	var index = 0;
	while(index < this.eventQueue.length) {
		var eventType = this.eventQueue[index].type;
		var obj = this.eventQueue[index].obj;
		var action = this.eventQueue[index].action;
		var parms = this.eventQueue[index].parms;
		this.selectProcessEvent(eventType, obj, action, parms);
		this.eventQueue.splice(0, 1);
	}
};
EventQueueHandler.prototype.selectProcessEvent = function(eventType, obj, action, parms) {
	if(obj != null && obj.getIsDelObj()) {
		return;
	}
	switch(eventType) {
		case 'EVENT_GAME_OBJ_MOVE' :
			this.move(obj, action, parms);
			break;
		case 'EVENT_GAME_OBJ_TRANSFORM_IMG' :
			this.transformObjImg(obj);
			break;
		case 'EVENT_GAME_OBJ_CREATION' :
			switch(parms.createType) {
				case 'SINGLE' :
					this.createSingleObj(parms);
					break;
				case 'MULTI' :
					this.createMultiObj(parms);
					break;
			}
			break;
		case 'EVENT_GAME_OBJ_DESTROY' :
			this.destroyObj(parms.pos);
			break;
		case 'EVENT_PLAY_EFFECT_SOUND' :
			this.playEffectSound(parms.soundId);
			break;
		case 'EVENT_MASTER_PUSH_OBJECT' :
			this.push(obj, parms.objNextPos, parms.targetObj, parms.targetNextPos)
			break;
		case 'EVENT_MASTER_EAT_OBJECT' :
			this.eat(obj, parms.targetObj);
			break;
		case 'EVENT_MASTER_ARRIVE_OBJECT' :
			this.arriveOtherObj(obj, parms.targetObj);
			break;
		case 'EVENT_PANEL_ON_OBJECT_MOVE' :
			this.changePanelStartPos(obj);
			break;
		default :
			console.log('can not handle ' + eventType);
			break;
	}
};
//Let game object move from beforePos -> nextPos
EventQueueHandler.prototype.move = function(obj, action) {
	//get current position and next position current game object will move in
	var beforePos = obj.getCurPos();
	var	nextPos = action.nextPos();
	//set game object to next position
	this.map.setEle(nextPos, obj);
	//set refer object before position
	if(nextPos != null){
		var newObj = this.objFactory.create(obj.getGenObjBeforeAreaInMove());
		this.map.setEle(beforePos, newObj);
		newObj.startAction('ALL');
		this.scoreboard.processEvent({mainObj: obj, action: "MOVE_ON_FLOOR", target: this.map.getEle(nextPos.getZDownPos())});
	}
};

EventQueueHandler.prototype.push = function(objMaster, posMaster, objTarget, posTarget) {
	this.map.setEle(posTarget, objTarget);
	var beforePos = objMaster.getCurPos();
	this.map.setEle(posMaster, objMaster);

	var newObj = this.objFactory.create(objMaster.getGenObjBeforeAreaInMove());
	this.map.setEle(beforePos, newObj);
	newObj.startAction('ALL');

	this.scoreboard.processEvent({mainObj: objMaster, action: "PUSH", target: objTarget});
	this.scoreboard.processEvent({mainObj: objMaster, action: "MOVE_ON_FLOOR", target: this.map.getEle(posMaster.getZDownPos())});
	this.scoreboard.processEvent({mainObj: objTarget, action: "MOVE_ON_FLOOR", target: this.map.getEle(posTarget.getZDownPos())});
};

EventQueueHandler.prototype.eat = function(objMaster, objTarget) {
	var masterNextPos = objTarget.getCurPos();
	var beforePos = objMaster.getCurPos();
	
	this.scoreboard.processEvent({mainObj: objMaster, action: "EAT", target: objTarget});

	this.destroyObj(masterNextPos);
	this.map.setEle(masterNextPos, objMaster);
	
	var newObj = this.objFactory.create(objMaster.getGenObjBeforeAreaInMove());
	this.map.setEle(beforePos, newObj);
	newObj.startAction('ALL');
};

EventQueueHandler.prototype.arriveOtherObj = function(objMaster, objExit) {
	this.scoreboard.processEvent({mainObj: objMaster, action: "ARRIVE", target: objExit});
};

EventQueueHandler.prototype.transformObjImg = function(obj) {
	obj.setNextImg();
};

EventQueueHandler.prototype.createSingleObj = function(parms) {
	var objTypeNew = parms.objType;
	var pos = parms.pos;
	var isStartAction = parms.isStartAction;
	var initObjFunc = parms.initObjFunc;

	var oldObj = this.map.getEle(pos);
	if(oldObj != null) {
		this.destroyObj(pos);
	}
	var objNew = this.objFactory.create(objTypeNew);
	if(objNew != null) {
		objNew.setGenWay(objNew.GEN_WAY_FROM_OBJECT);
		this.map.setEle(pos, objNew);

		this.scoreboard.processEvent({mainObj: objNew, action: "CREATE"});

		if(isStartAction == null || isStartAction == true) {
			objNew.startAction('ALL');
		}
		if(initObjFunc != null) {
			initObjFunc(objNew);
		}
	}
	else {
		this.map.setEle(pos, null);
	}
	return objNew;
};

EventQueueHandler.prototype.createMultiObj = function(parms) {
	var objTypeNew = parms.objType;
	var listPos = parms.pos;
	var isCheckPassby = parms.isCheckPassby;
	var tempObj = this.createSingleObj({objType: objTypeNew, isStartAction: false});
	var index = 0;
	while(index < listPos.length) {
		if(isCheckPassby == false || (tempObj != null && tempObj.isPassby(listPos[index]))) {
			this.createSingleObj({objType: objTypeNew, pos: listPos[index], initObjFunc: parms.initObjFunc});
		}
		index = index + 1;
	}
};

EventQueueHandler.prototype.destroyObj = function(pos) {
	this.scoreboard.processEvent({mainObj: this.map.getEle(pos), action: "DIED"});
	this.map.destroyEle(pos);
};

EventQueueHandler.prototype.playEffectSound = function(soundId) {
	this.soundEffectFactory.playSound(soundId);
};

EventQueueHandler.prototype.changePanelStartPos = function(obj) {
	var objPos = obj.getCurPos();
	this.mainPanel.changeStartPosOnObjectMove(objPos);
};