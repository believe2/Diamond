var WoodFloor = function(args) {
	BaseObject.call(this, args);
	this.listImage = ['wood floor.jpg'];
	this.objInMapLevel = 0;
}

WoodFloor.prototype = Object.create(BaseObject.prototype);
WoodFloor.prototype.superClass = Object.create(BaseObject.prototype);
WoodFloor.prototype.constructor = WoodFloor;