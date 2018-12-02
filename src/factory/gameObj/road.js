var Road = function(args) {
	BaseObject.call(this, args);
	this.listImage = ['road.jpg'];
}

Road.prototype = Object.create(BaseObject.prototype);
Road.prototype.superClass = Object.create(BaseObject.prototype);
Road.prototype.constructor = Road;