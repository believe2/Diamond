var MoveArroundWall = function(args) {
	BaseAction.call(this, args);
	this.trajHistory = new TrajHistory(this.map.getMaxX(), this.map.getMaxY());
	this.math = new MyMath();
};

MoveArroundWall.prototype = Object.create(BaseAction.prototype);
MoveArroundWall.prototype.superClass = Object.create(BaseAction.prototype);
MoveArroundWall.prototype.constructor = MoveArroundWall;

MoveArroundWall.prototype.doAction = function() {
	this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_MOVE', this.mainObj, this);
};

MoveArroundWall.prototype.nextPos = function() {
	var listCanPass = this.mainObj.getPosCanPass();
	var listCanPassPrivilege = this.setPrivilegeToNextPosCandidate(listCanPass);
	var pos = this.selHighScorePos(listCanPass, listCanPassPrivilege);
	this.trajHistory.setPrevPos(this.mainObj.getCurPos());
	return pos;
};

MoveArroundWall.prototype.nextPosTouchCurWallNo = function(pos) {
	var posGenerator = new PosGenerator();
	var posCand = posGenerator.posCenter3x3(this.mainObj.getCurPos());
	var curPosTouchWall = [];
	var index = 0;
	while(index < posCand.length) {
		if(!this.mainObj.isPassby(posCand[index])) {
			curPosTouchWall.push(posCand[index]);
		}
		index = index + 1;
	}
	var listCheckPos = posGenerator.posCenter3x3(pos);
	var touchNum = 0;
	var indexWall = 0;
	while(indexWall < curPosTouchWall.length) {
		var indexCheckPos = 0;
		var isTouch = false;
		while(!isTouch && indexCheckPos < listCheckPos.length) {
			if(listCheckPos[indexCheckPos].toString() == curPosTouchWall[indexWall].toString()) {
				isTouch = true;
				touchNum = touchNum + 1;
			}
			indexCheckPos = indexCheckPos + 1;
		}
		indexWall = indexWall + 1;
	}
	if(touchNum == 0) {
		touchNum = -20;
	}
	return touchNum / posCand.length;
};

MoveArroundWall.prototype.setPrivilegeToNextPosCandidate = function(listCanPass) {
	var listPosPriv = [];
	//initial
	var index = 0;
	while(index < listCanPass.length) {
		listPosPriv[listCanPass[index].toString()] = 0;
		index = index + 1;
	}
	//check road privilege
	var index = 0;
	var visitTimeTotal = 0;
	while(index < listCanPass.length) {
		if(this.trajHistory.isPrev(listCanPass[index])) {  //check road has ever visited at before one step
			listPosPriv[listCanPass[index].toString()] = listPosPriv[listCanPass[index].toString()] - 10;
		}
		//count visit time total num
		visitTimeTotal = visitTimeTotal + this.trajHistory.visitTime(listCanPass[index]);
		//go through along the wall
		listPosPriv[listCanPass[index].toString()] = listPosPriv[listCanPass[index].toString()] + this.nextPosTouchCurWallNo(listCanPass[index]);
		index = index + 1;
	}
	if(visitTimeTotal > 0) {
		index = 0;
		while(index < listCanPass.length) {
			var visitTime = this.trajHistory.visitTime(listCanPass[index]);
			//go new road in privilege
			listPosPriv[listCanPass[index].toString()] = listPosPriv[listCanPass[index].toString()] + ((visitTimeTotal - visitTime) / visitTimeTotal) * 2;
			index = index + 1;
		}
	}
	//console.log(listPosPriv);
	return listPosPriv;
};

MoveArroundWall.prototype.selHighScorePos = function(listPos, mapPrivScore) {
	var maxScore = -999;
	var listMaxPos = [];
	var index = 0;
	while(index < listPos.length) {
		if(mapPrivScore[listPos[index].toString()] > maxScore) {
			maxScore = mapPrivScore[listPos[index].toString()];
			listMaxPos = [];
			listMaxPos.push(listPos[index]);
		}
		else if(mapPrivScore[listPos[index].toString()] == maxScore) {
			listMaxPos.push(listPos[index]);
		}
		index = index + 1;
	}
	return listMaxPos[this.math.randInteger(0, listMaxPos.length)];
};