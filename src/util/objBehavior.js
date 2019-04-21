var ObjBehavior = function(json) {
	this.mainObj = json.main_object;
	this.action = json.action;
	this.targetObj = json.target;
	this.amount = json.amount;
	this.max = json.max;
	this.autoCount = json.auto_count;
	this.counterTargetObj = null;
};

ObjBehavior.prototype.isNeedObjCounter = function() {
	if(this.amount == null) {
		return null;
	}
	else if(this.amount > 0) {
		return "COUNTER_INCREASE";
	}
	else if(this.max > 0) {
		return "COUNTER_DECREASE";
	}
};

ObjBehavior.prototype.setCounterTargetObj = function(counterTargetObj) {
	this.counterTargetObj = counterTargetObj;
};

ObjBehavior.prototype.startAutoCount = function() {
	if(this.autoCount) {
		this.counterTargetObj.start();
	}
}

ObjBehavior.prototype.initialCounter = function() {
	this.counterTargetObj.initialCounter(0, false);
};

ObjBehavior.prototype.checkEventAddOneToCounterTargetObj = function(event) {
	if(event == (this.mainObj + "_" + this.action + "_" + this.targetObj)) {
		this.counterTargetObj.increase();
	}
};