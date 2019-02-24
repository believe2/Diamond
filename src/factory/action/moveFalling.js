var MoveFalling = function(args) {
	BaseAction.call(this, args);

	this.beforePos = null;	
	this.fallDirection = null;
	this.speed = args.fallArgs.speed;
	this.checkFrequency = args.fallArgs.checkFrequency;
	this.counter = new DeLockCounter(this.speed / this.checkFrequency)
};

MoveFalling.prototype = Object.create(BaseAction.prototype);
MoveFalling.prototype.superClass = Object.create(BaseAction.prototype);
MoveFalling.prototype.constructor = MoveFalling;

MoveFalling.prototype.doAction = function() {
	this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_MOVE', this.mainObj, this);
};

MoveFalling.prototype.nextPos = function() {
	this.beforePos = this.mainObj.curPos;
	var nextPos = null;
	//check down
	var nextCand = new Position(this.mainObj.curPos.x, this.mainObj.curPos.y + 1, this.mainObj.curPos.z);
	if(this.mainObj.isPassby(nextCand)) {
		nextPos = nextCand;
		this.fallDirection = 'DOWN';
	}
	if(this.mainObj.isCanFallToLRSide()) {
		//check left
		if(nextPos == null) {
			var leftDownTarget = new Position(this.mainObj.curPos.x - 1, this.mainObj.curPos.y + 1, this.mainObj.curPos.z);
			nextCand = new Position(this.mainObj.curPos.x - 1, this.mainObj.curPos.y, this.mainObj.curPos.z);
			if(this.mainObj.isPassby(leftDownTarget) && this.mainObj.isPassby(nextCand)) {
				nextPos = nextCand;
				this.fallDirection = 'LEFT';
			}
		}
		//check right
		if(nextPos == null) {
			var rightDownTarget = new Position(this.mainObj.curPos.x + 1, this.mainObj.curPos.y + 1, this.mainObj.curPos.z);
			nextCand = new Position(this.mainObj.curPos.x + 1, this.mainObj.curPos.y, this.mainObj.curPos.z);
			if(this.mainObj.isPassby(rightDownTarget) && this.mainObj.isPassby(nextCand)) {
				nextPos = nextCand;
				this.fallDirection = 'RIGHT';
			}
		}
	}
	//object cannot fall to any dirtection
	if(nextPos == null) {
		if(this.beforePos.toString() == this.mainObj.curPos.toString()) {  //buffer when falling to the most buttom place
			this.fallDirection = null;
		}
		this.counter.reset();
	}
	else if (!this.counter.add()){  //ready to fall until counter arrive target setting
		nextPos = null;
	}
	return nextPos;
};