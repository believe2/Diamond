var Exit = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['tile.jpg', 'exit.jpg'];
	this.isOpen = false;
	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
};

Exit.prototype = Object.create(BaseObject.prototype);
Exit.prototype.superClass = Object.create(BaseObject.prototype);
Exit.prototype.constructor = Exit;

Exit.prototype.triggerOpening = function() {
	this.registerAction(1, 500, this.animateGameObject.doAction.bind(this.animateGameObject));
	this.startAction(1);
	this.isOpen = true;
};

Exit.prototype.triggerClosing = function() {
	this.stopAction(1);
	this.isOpen = false;
};

Exit.prototype.isOpenExit = function() {
	return this.isOpen;
};