var ObjBehavior = function(json) {
	this.mainObj = json.main_object;
	this.action = json.action;
	this.targetObj = json.target;
	this.amount = json.amount;
	this.counterTargetObj = null;
};

ObjBehavior.prototype.isNeedObjCounter = function() {
	return (this.amount != null) && (this.mainObj != 'TIME');
};

ObjBehavior.prototype.setCounterTargetObj = function(counterTargetObj) {
	this.counterTargetObj = counterTargetObj;
};

ObjBehavior.prototype.checkEventAddOneToCounterTargetObj = function(event) {
	if(event == (this.mainObj + "_" + this.action + "_" + this.targetObj)) {
		this.counterTargetObj.increase();
	}
}