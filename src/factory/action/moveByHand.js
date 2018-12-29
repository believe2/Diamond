var MoveByHand = function(args) {
	BaseAction.call(this, args);
	this.lockMaxTime = args.lockTime;
	this.lock = -1;
};

MoveByHand.prototype = Object.create(BaseAction.prototype);
MoveByHand.prototype.superClass = Object.create(BaseAction.prototype);
MoveByHand.prototype.constructor = MoveByHand;

MoveByHand.prototype.doAction = function() {
	if(this.lock > 0) {
		this.lock = this.lock - 1;
		return;
	}
	var isLasting = this.mainObj.getIsMoveLasting();
	if(isLasting) {
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_MOVE', this.mainObj, this);
		this.lock = this.lockMaxTime;
	}
};

MoveByHand.prototype.nextPos = function() {
	var moveDir = this.mainObj.getCurMoveDirection();
	var isLasting = this.mainObj.getIsMoveLasting();
	var countNextPos = this.mainObj.getCurPos();
	if(isLasting) {
		var posGen = new PosGenerator();
		countNextPos = posGen.posByConstantString(countNextPos, moveDir);
	}
	return countNextPos;
};