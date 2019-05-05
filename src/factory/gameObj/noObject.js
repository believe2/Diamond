var NoObject = function(args) {
	BaseObject.call(this, args);
	this.specificImageName = 'delete.png';
}

NoObject.prototype = Object.create(BaseObject.prototype);
NoObject.prototype.superClass = Object.create(BaseObject.prototype);
NoObject.prototype.constructor = NoObject;