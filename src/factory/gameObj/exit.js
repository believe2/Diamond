var Exit = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['tile.jpg', 'exit.jpg'];

	this.triggerMoveEvent = args.bindFuncMove;
	this.isOpen = false;

	this.registerAction(0, this.CYCLE_TRIGER * 5, this.monitorAction.bind(this));
	this.registerFunc(0, this.triggerOpening.bind(this));
};

Exit.prototype = Object.create(BaseObject.prototype);
Exit.prototype.superClass = Object.create(BaseObject.prototype);
Exit.prototype.constructor = Exit;

Exit.prototype.monitorAction = function() {
	if(this.isOpen) {
		this.triggerMoveEvent(this, null, this.nextImg());
	}
};

Exit.prototype.triggerOpening = function() {
	this.isOpen = true;
};

Exit.prototype.nextImg = function() {
	return (this.curImage + 1) % this.listImage.length;
};

Exit.prototype.getIsOpen = function() {
	return this.isOpen;
};