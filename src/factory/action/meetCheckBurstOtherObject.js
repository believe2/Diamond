var MeetCheckBurstOtherObject = function(args) {
	BaseAction.call(this, args);
};

MeetCheckBurstOtherObject.prototype = Object.create(BaseAction.prototype);
MeetCheckBurstOtherObject.prototype.superClass = Object.create(BaseAction.prototype);
MeetCheckBurstOtherObject.prototype.constructor = MeetCheckBurstOtherObject;

MeetCheckBurstOtherObject.prototype.doAction = function() {
	var index = 0;
	var listBurstObj = this.mainObj.getBurstOtherObject()
	while(index < listBurstObj.length) {
		var posGenerator = new PosGenerator();
		var listPos = posGenerator.posbaseInputVector(listBurstObj[index].getCurPos(), listBurstObj[index].burst.type);
		var parms = {objType: "BURST_AREA", 
		             pos: listPos, 
		             createType: "MULTI", 
		             isStartAction: true, 
		             initObjFunc: (function() {
		             	 var getCurObjBurstProd = listBurstObj[index].burst.prod;
		                 return function(objNew) {
				             objNew.setBurstGenObj(getCurObjBurstProd);
				         }
		             })()};
		this.eventQueueHandler.throwEvent('EVENT_PLAY_EFFECT_SOUND', null, null, {soundId: 'BOOM'});
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
		index = index + 1;
	}
};