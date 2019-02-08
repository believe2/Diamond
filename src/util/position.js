var Position = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.privilege = 0;
};

Position.prototype.toString = function() {
	return this.x + '?' + this.y + '?' + this.z;
};