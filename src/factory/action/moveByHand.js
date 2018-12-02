var MoveByHand = function(args) {
	BaseAction.call(this, args);

};

MoveByHand.prototype = Object.create(BaseAction.prototype);
MoveByHand.prototype.superClass = Object.create(BaseAction.prototype);
MoveByHand.prototype.constructor = MoveByHand;

MoveFalling.prototype.doAction = function() {
	var isLasting = this.mainObj.getIsMoveLasting();
	if(isLasting) {
		this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_MOVE', this.mainObj, this);
	}
};

MoveFalling.prototype.nextPos = function() {
	var moveDir = this.mainObj.getCurMoveDirection();
	var isLasting = this.mainObj.getIsMoveLasting();
	var countNextPos = this.mainObj.getCurPos();
	if(isLasting) {
		var posGen = new PosGenerator();
		countNextPos = posGen.posByConstantString(countNextPos, moveDir);
	}
	return countNextPos;
};