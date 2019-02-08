var MainPanel = function(ctx, canvas){
	this.mapBindFunc = {};
	this.map = null;
	this.timerDraw = null;

	this.drawMaxWidth = 12;
	this.drawMaxHeight = 14;
	this.cubeWidth = 50;
	this.cubeHeight = 50;
	
	this.canvas = canvas;
	this.ctx = ctx;
};

MainPanel.prototype.bindOnMouseDownEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseDown != null) {
		this.canvas.removeEventListener('mousedown', this.mapBindFunc.MouseDown);
	}
	var func = function(event) {
		var touchPosCube = new Position(Math.floor(event.offsetX / this.cubeWidth), Math.floor(event.offsetY / this.cubeHeight));
		bindFunc(touchPosCube);
	};
	this.mapBindFunc.MouseDown = func.bind(this);
	this.canvas.addEventListener('mousedown', this.mapBindFunc.MouseDown, false);
};

MainPanel.prototype.bindOnMouseUpEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseUp != null) {
		this.canvas.removeEventListener('mouseup', this.mapBindFunc.MouseUp);
	}
	this.mapBindFunc.MouseUp = bindFunc;
	this.canvas.addEventListener('mouseup', this.mapBindFunc.MouseUp, false);
};

MainPanel.prototype.setMap = function(map) {
	clearInterval(this.timerDraw);
	this.map = map;
	switch(this.map.getMapId()) {
		case "MAP_2D_CUBE" :
			this.timerDraw = setInterval(this.drawByCubeMap.bind(this), 1000);
			break;
	}
};

MainPanel.prototype.getCanvas = function() {
	return this.canvas;
};

MainPanel.prototype.getCtx = function() {
	return this.ctx;
}
/*
    This is a width = 9, height = 5 map
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
*/
MainPanel.prototype.drawByCubeMap = function() {
	var mapWidth = this.map.getMaxX();
	var mapHeight = this.map.getMaxY();
	var mapLevelNo = this.map.getMapLevelNo();
	var indexX = 0, indexY = 0, indexLv = 0;
	while(indexX < mapWidth){
		var indexY = 0;
		while(indexY < mapHeight) {
			indexLv = 0;
			while(indexLv < mapLevelNo){
				var pos = new Position(indexX, indexY, indexLv);
				var ele = this.map.getEle(pos);
				if(ele == null) {
					console.log(pos);
				}
				this.ctx.drawImage(ele.getCurImg(), pos.x * this.cubeWidth, pos.y * this.cubeHeight, this.cubeWidth, this.cubeHeight);
				indexLv = indexLv + 1;
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
}