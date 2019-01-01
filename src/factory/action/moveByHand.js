var MoveByHand = function(args) {
	BaseAction.call(this, args);
	this.lockMaxTime = args.lockTime;
	this.lock = -1;
};

MoveByHand.prototype = Object.create(BaseAction.prototype);
MoveByHand.prototype.superClass = Object.create(BaseAction.prototype);
MoveByHand.prototype.constructor = MoveByHand;

MoveByHand.prototype.doAction = function() {
	var isLasting = this.mainObj.getIsMoveLasting();
	if(!isLasting) {
		this.lock = -1;
	}
	else {
		if(this.lock > 0) {
			this.lock = this.lock - 1;
			return;
		}
		var countNextPos = this.getMasterClickNextPos();
		if(countNextPos != null) {
			if(this.mainObj.isPassby(countNextPos)) {
				this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_MOVE', this.mainObj, this);
			}
			else if(this.mainObj.isMeetActionObject('MASTER_PUSH', countNextPos)) {
				var posGen = new PosGenerator();
				var moveDirVector = this.mainObj.getCurMoveDirection();
				var targetObj = this.map.getEle(countNextPos);
				var targetObjNextPos = posGen.posByGivenVector(targetObj.getCurPos(), moveDirVector);
				if(targetObj.isPassby(targetObjNextPos)) {
					this.eventQueueHandler.throwEvent('EVENT_MASTER_PUSH_OBJECT', 
						                              this.mainObj, 
						                              null, 
						                              {objNextPos: countNextPos,
                                                       targetObj: targetObj,
													   targetNextPos: targetObjNextPos	
													  });
				}
			}
		}
		this.lock = this.lockMaxTime;
	}
};

MoveByHand.prototype.getMasterClickNextPos = function() {
	var moveDirVector = this.mainObj.getCurMoveDirection();
	var isLasting = this.mainObj.getIsMoveLasting();
	var countNextPos = this.mainObj.getCurPos();
	if(isLasting) {  //get next move position by onclick event
		var posGen = new PosGenerator();
		countNextPos = posGen.posByGivenVector(countNextPos, moveDirVector);
	}
	if(countNextPos.toString() != this.mainObj.getCurPos().toString()) {
		return countNextPos;
	}
	return null;
}

MoveByHand.prototype.nextPos = function() {
	var countNextPos = this.getMasterClickNextPos();
	if(countNextPos != null) {
		if(this.mainObj.isPassby(countNextPos)) {  //go next position without any obstacle
			return countNextPos;
		}
	}
	return null;
};