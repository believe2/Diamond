var MeetCheckBurst = function(args) {
	BaseAction.call(this, args);
};

MeetCheckBurst.prototype = Object.create(BaseAction.prototype);
MeetCheckBurst.prototype.superClass = Object.create(BaseAction.prototype);
MeetCheckBurst.prototype.constructor = MeetCheckBurst;

MeetCheckBurst.prototype.doAction = function() {
	var index = 0;
	var isBurst = false;
	while(!isBurst && index < this.mainObj.burst.source.length) {
		if(this.mainObj.isTouchObj(this.mainObj.burst.source[index])) {
			var posGenerator = new PosGenerator();
			var listPos = posGenerator.posbaseInputVector(this.mainObj.getCurPos(), this.mainObj.burst.type);
			var parms = {objType: "BURST_AREA", 
			             pos: listPos, 
			             createType: "MULTI", 
			             isStartAction: true, 
			             initObjFunc: this.initialNewObj.bind(this)};
			this.eventQueueHandler.throwEvent('EVENT_PLAY_EFFECT_SOUND', null, null, {soundId: 'BOOM'});
			this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
			isBurst = true;
		}
		index = index + 1;
	}
};
MeetCheckBurst.prototype.initialNewObj = function(objNew) {
	objNew.setBurstGenObj(this.mainObj.burst.prod);
};