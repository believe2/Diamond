var MeetTransformObj = function(args) {
	BaseAction.call(this, args);

	this.touchDir = args.touchDir;
	this.transformDir = args.transformDir;
	this.transformObjFormula = args.transformObjFormula;

	this.startMagicOtherAction = args.startMagicOtherAction;
	this.stopMagicOtherAction = args.stopMagicOtherAction;

	this.timeMaxMagic = args.timeMaxMagic;

	this.posGen = new PosGenerator();

	this.isMagicing = false;
	this.curMagicLastTime = 0;
	this.timeMaxTrigger = 1;
	this.curTriggerTime = 0;
};

MeetTransformObj.prototype = Object.create(BaseAction.prototype);
MeetTransformObj.prototype.superClass = Object.create(BaseAction.prototype);
MeetTransformObj.prototype.constructor = MeetTransformObj;

MeetTransformObj.prototype.doAction = function() {
	this.observerMagic();
	this.triggerTransformObj();
};

MeetTransformObj.prototype.observerMagic = function() {
	if(this.isTouchTargetObj()){  //start Magicing
		this.triggerMagic();
		this.startMagicOtherAction();
	}
	else if(this.isMagicing) {  //continue magicing
		this.curMagicLastTime = this.curMagicLastTime + 1;
	}

	if(this.curMagicLastTime >= this.timeMaxMagic) {  //check end magicing
		this.isMagicing = false;
		this.stopMagicOtherAction();
	}
};

MeetTransformObj.prototype.triggerTransformObj = function() {
	var targetPos = this.posGen.posByConstantString(this.mainObj.getCurPos(), this.touchDir);
	var targetObj = this.mainObj.map.getEle(targetPos);
	if(this.isMagicing && targetObj != null) {
		var resultPos = this.posGen.posByConstantString(this.mainObj.getCurPos(), this.transformDir);
		var transfomTargetObj = this.transformObjFormula[targetObj.getId()];
		if(targetObj != null && targetObj.isPassby(resultPos) && transfomTargetObj != null) {  //transform object
			var parms1 = {objType: transfomTargetObj, 
			              pos: [resultPos], 
			              createType: "MULTI", 
			              isStartAction: true
			};
			this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms1);
		}
	}
	//destroy original object
	if(targetObj != null && this.transformObjFormula[targetObj.getId()] != null) {
		var parms2 = {objType: null, 
		              pos: [targetPos], 
		              createType: "MULTI", 
		              isStartAction: false,
		              isCheckPassby: false
		};
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms2);
	}
};

MeetTransformObj.prototype.isTouchTargetObj = function() {
	var posTouch = this.posGen.posByConstantString(this.mainObj.getCurPos(), this.touchDir);
	var touchObj = this.mainObj.map.getEle(posTouch);
	if(touchObj != null && this.transformObjFormula[touchObj.getId()] != null) {
		return true;
	}
	return false;
};

MeetTransformObj.prototype.triggerMagic = function() {
	if(!this.isMagicing && this.curTriggerTime < this.timeMaxTrigger) {
		this.curTriggerTime = this.curTriggerTime + 1;
		this.curMagicLastTime = 0;
		this.isMagicing = true;
		
		this.startMagicOtherAction();
	}
};