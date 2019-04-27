var ObjBehavior = function(json, type) {
	this.type = type;

	this.mainObj = json.main_object;
	this.action = json.action;
	this.targetObj = json.target;
	this.amount = json.amount;
	this.max = json.max;
	this.autoCount = json.auto_count;
	this.isBypassSubId = json.isBypassSubId;
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
	var tempMainObj = (this.isBypassSubId)?event.mainObj.getId():event.mainObj.getFullId();
	var tempAction = event.action;
	var tempTarget = null;
	if(event.target != null) {
		tempTarget = (this.isBypassSubId)?event.target.getId():event.target.getFullId();
	}
	if(tempMainObj == this.mainObj && tempAction == this.action && tempTarget == this.targetObj) {
		if(this.isNeedObjCounter() != null) {
			this.counterTargetObj.increase();
		}
	}
};

ObjBehavior.prototype.checkArriveGoal = function() {
	var isArriveGoal = false;
	switch(this.isNeedObjCounter()) {
		case "COUNTER_INCREASE":
			isArriveGoal = (this.counterTargetObj.getCurTime() >= this.amount);
			break;
		case "COUNTER_DECREASE":
			isArriveGoal = (this.counterTargetObj.getCurTime() <= 0);
			break;
		default:
			break;
	}
	return isArriveGoal;
};

ObjBehavior.prototype.getType = function() {
	return this.type;
};