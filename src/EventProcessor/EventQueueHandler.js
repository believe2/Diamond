var EventQueueHandler = function(map, objFactory, soundEffectFactory, temp) {
	this.eventQueue = new Array();
	this.map = map;
	this.temp = temp;
	this.objFactory = objFactory;
	this.soundEffectFactory = soundEffectFactory;
	this.threadEventHandler = null;
};
//start thread to listen eventQueue
EventQueueHandler.prototype.start = function() {  
	this.threadEventHandler = setInterval(this.handleEvent.bind(this), 1);
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
		switch(eventType) {
			case 'EVENT_GAME_OBJ_MOVE' :
				this.move(obj, action);
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
			default :
				console.log('can not handle ' + eventType);
				break;
		}
		this.eventQueue.splice(0, 1);
	}
};
//Let game object move from beforePos -> nextPos
EventQueueHandler.prototype.move = function(obj, action) {
	//get current position and next position current game object will move in
	var beforePos = obj.getCurPos();
	var nextPos = action.nextPos();
	//set game object to next position
	this.map.setEle(nextPos, obj);
	//set refer object before position
	if(nextPos != null){
		this.map.setEle(beforePos, obj.genObjBeforeArea());
	}
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
		oldObj.stopAction('ALL');
	}
	var objNew = this.objFactory.create(this.temp.getArgs(objTypeNew, pos));
	if(objNew != null) {
		objNew.setGenWay(objNew.GEN_WAY_FROM_OBJECT);
		this.map.setEle(pos, objNew);
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
	this.map.destroyEle(pos);
};

EventQueueHandler.prototype.playEffectSound = function(soundId) {
	this.soundEffectFactory.playSound(soundId);
};