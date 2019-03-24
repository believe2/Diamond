var Position = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.privilege = 0;
};

Position.prototype.toString = function() {
	return this.x + '?' + this.y + '?' + this.z;
};

Position.prototype.equal = function(pos) {
	return (this.x == pos.x && this.y == pos.y && this.z == pos.z);
}