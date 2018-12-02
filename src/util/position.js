var Position = function (x, y) {
	this.x = x;
	this.y = y;
	this.privilege = 0;
};

Position.prototype.toString = function() {
	return this.x + '?' + this.y;
};