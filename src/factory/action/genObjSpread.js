var GenObjSpread = function(args) {
	BaseAction.call(this, args);
	
	this.isEnd = false;
	this.curSpreadCounter = 0;
	this.curSpreadNum = 0;
	this.curSpreadTime = 0;

	this.resetSpreadArgs();
};

GenObjSpread.prototype = Object.create(BaseAction.prototype);
GenObjSpread.prototype.superClass = Object.create(BaseAction.prototype);
GenObjSpread.prototype.constructor = GenObjSpread;

GenObjSpread.prototype.doAction = function() {
	var listSpdPos = this.map.getAllObjCanPassPos(this.mainObj.getId());
	if(!this.isEnd && listSpdPos.length <= 0) {
		this.curSpreadCounter = 0;
		this.curSpreadTime = 1;
		this.isEnd = true;
	}
	this.curSpreadCounter = this.curSpreadCounter + 1;
	if(this.curSpreadCounter >= this.curSpreadTime * (1000 / this.mainObj.getTriggerFreq())) {
		this.triggerSpreadEvent(listSpdPos);
	}
};

GenObjSpread.prototype.triggerSpreadEvent = function(listSpdPos) {
	this.resetSpreadArgs();
	if(listSpdPos.length > 0) {
		var spreadNum = this.curSpreadNum;
		if(spreadNum > listSpdPos.length) {
			spreadNum = listSpdPos.length;
		}
		var math = new MyMath();
		var listSelPosIndex = math.randSelectEleIndex(spreadNum, listSpdPos.length);
		var index = 0, listPos = [];
		while(index < listSelPosIndex.length) {
			listPos.push(listSpdPos[listSelPosIndex[index]]);
			index = index + 1;
		}
		var parms = {objType: this.mainObj.getId(), 
		             pos: listPos, 
		             createType: "MULTI", 
		             isStartAction: true
		            };
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
	}
	else if(this.nextAction != null){
		this.nextAction();
	}
};

GenObjSpread.prototype.resetSpreadArgs = function() {
	this.curSpreadCounter = 0;
	var math = new MyMath();
	var args = this.mainObj.getExtraSetting();
	this.curSpreadNum = math.randInteger(args.min_spread_num, args.max_spread_num);
	this.curSpreadTime = math.randInteger(args.min_spread_time, args.max_spread_time);
};