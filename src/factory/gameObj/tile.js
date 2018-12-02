var Tile = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['tile.jpg'];
};

Tile.prototype = Object.create(BaseObject.prototype);
Tile.prototype.superClass = Object.create(BaseObject.prototype);
Tile.prototype.constructor = Tile;