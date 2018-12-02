var StoneWall = function(args) {
	BaseObject.call(this, args);
	this.listImage = ['stone wall.jpg'];
};

StoneWall.prototype = Object.create(BaseObject.prototype);
StoneWall.prototype.superClass = Object.create(BaseObject.prototype);
StoneWall.prototype.constructor = StoneWall;