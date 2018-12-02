var GenObjDirectionStretch = function(args) {
	BaseAction.call(this, args);
};

GenObjDirectionStretch.prototype = Object.create(BaseAction.prototype);
GenObjDirectionStretch.prototype.superClass = Object.create(BaseAction.prototype);
GenObjDirectionStretch.prototype.constructor = GenObjDirectionStretch;

GenObjDirectionStretch.prototype.doAction = function() {
	var listPosStretch = this.nextPosStretch();
	var parms = {objType: this.mainObj.getStretchGenObj(), 
		         pos: listPosStretch, 
		         createType: "MULTI", 
		         isStartAction: true
		        };
	var index = 0;
	while(index < listPosStretch.length) {
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
		index = index + 1;
	}
};

GenObjDirectionStretch.prototype.nextPosStretch = function() {
	var getArg = this.mainObj.getExtraSetting();
	var listPosStretch = [];
	var index = 0;
	while(index <　getArg.length) {
		var stretchPos = this.findPosCanStretch(getArg[index]);
		if(stretchPos != null) {
			listPosStretch.push(stretchPos);
		}
		index = index + 1;
	}
	return listPosStretch;
};

GenObjDirectionStretch.prototype.findPosCanStretch = function(strDir) {
	var posGen = new PosGenerator();
	var posCheck = posGen.posByConstantString(this.mainObj.getCurPos(), strDir);
	var posObjInfo = this.mainObj.funcGetObjInfoByPos(posCheck);

	while(posObjInfo != null && 
		  posObjInfo.genWay == this.mainObj.GEN_WAY_FROM_OBJECT && 
		  posObjInfo.id == this.mainObj.getStretchGenObj()) {
		posCheck = posGen.posByConstantString(posCheck, strDir);
		posObjInfo = this.mainObj.funcGetObjInfoByPos(posCheck);
	}
	if(this.mainObj.isPassby(posCheck)) {
		return posCheck;
	}
	else {
		return null;
	}
};