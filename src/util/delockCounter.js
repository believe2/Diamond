var DeLockCounter = function (delockNum) {
	this.counter = 0;
	this.delockNum = delockNum;
	this.isCounterLock = true;
};

DeLockCounter.prototype.add = function() {
	this.counter = this.counter + 1;
	if(this.counter >= this.delockNum) {
		this.counter = 0;
		return true;
	}
	return false;
};

DeLockCounter.prototype.reset = function() {
	this.counter = 0;
};

DeLockCounter.prototype.setLock = function(isCounterLock) {
	this.reset();
	this.isCounterLock = isCounterLock;
};

DeLockCounter.prototype.isLock = function() {
	return this.isCounterLock;
};