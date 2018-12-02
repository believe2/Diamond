var AnimateGameObject = function(args) {
	BaseAction.call(this, args);
	this.frequency = "UNLIMITED";
	if(args.frequency != null) {
		this.frequency = args.frequency;
	}
};

AnimateGameObject.prototype = Object.create(BaseAction.prototype);
AnimateGameObject.prototype.superClass = Object.create(BaseAction.prototype);
AnimateGameObject.prototype.constructor = AnimateGameObject;

AnimateGameObject.prototype.doAction = function() {
	if(this.frequency != "UNLIMITED") {
		this.frequency = this.frequency - 1;
	}
	if(this.frequency == 0) {  //do next action when animation has finished
		if(this.nextAction != null) {
			this.nextAction();
		}
		return;
	}
	else if(this.frequency < 0) {  //do nothing
		return;
	}
	this.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_TRANSFORM_IMG', this.mainObj);
};