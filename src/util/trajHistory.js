var TrajHistory = function(maxX, maxY) {
	this.listMap = null;
	this.prevPos = null;

	this.initialMap(maxX, maxY);
};

TrajHistory.prototype.initialMap = function(maxX, maxY) {
	this.listMap = new Array(maxY);
	var indexY = 0;
	while(indexY <= maxY) {
		this.listMap[indexY] = new Array(maxX);
		var indexX = 0;
		while(indexX <= maxX) {
			this.listMap[indexY][indexX] = 0;
			indexX = indexX + 1;
		}
		indexY = indexY + 1;
	}
};

TrajHistory.prototype.setPrevPos = function(pos) {
	this.listMap[pos.y][pos.x] = this.listMap[pos.y][pos.x] + 1;
	this.prevPos = pos;
};

TrajHistory.prototype.isPrev = function(pos) {
	if(this.prevPos == null) {
		return false;
	}
	return pos.toString() == this.prevPos.toString();
};

TrajHistory.prototype.visitTime = function(pos) {
	return this.listMap[pos.y][pos.x];
};