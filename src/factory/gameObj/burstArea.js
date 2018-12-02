var BurstArea = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['fire1.png', 'fire2.png', 'fire3.png'];
	this.listCanPass = ['ALL', 'TILE'];

	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                frequency: this.listImage.length,
		                                                mainObj: this,
		                                                nextAction: this.burstGenObject.bind(this)
	                                                  });

	this.registerAction(0, 1000, this.animateGameObject.doAction.bind(this.animateGameObject));
};

BurstArea.prototype = Object.create(BaseObject.prototype);
BurstArea.prototype.superClass = Object.create(BaseObject.prototype);
BurstArea.prototype.constructor = BurstArea;

BurstArea.prototype.burstGenObject = function() {
	var parms = {objType: this.burstGenObj, 
	             pos: [this.curPos], 
	             createType: "MULTI", 
	             isStartAction: true,
	             isCheckPassby: false
	            };
	this.animateGameObject.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
};

BurstArea.prototype.setBurstGenObj = function(obj) {
	this.burstGenObj = obj;
}