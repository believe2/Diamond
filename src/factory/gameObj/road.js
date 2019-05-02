var Road = function(args) {
	BaseObject.call(this, args);
	this.listImage = ['road.jpg'];
	this.objInMapLevel = 1;
}

Road.prototype = Object.create(BaseObject.prototype);
Road.prototype.superClass = Object.create(BaseObject.prototype);
Road.prototype.constructor = Road;