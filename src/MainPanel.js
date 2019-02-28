var MainPanel = function(ctx, canvas){
	this.mapBindFunc = {};
	this.mapFactory = null;
	this.timerDraw = null;

	this.drawMaxWidth = 12;
	this.drawMaxHeight = 14;
	this.cubeWidth = 50;
	this.cubeHeight = 50;
	
	this.canvas = canvas;
	this.ctx = ctx;
};

/* Bind Mouse push event to given bindFunc with touch positon (event.offsetX, event.offsetY) */
MainPanel.prototype.bindOnMouseDownEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseDown != null) {  //remove original listener
		this.canvas.removeEventListener('mousedown', this.mapBindFunc.MouseDown);
	}
	var func = function(event) {
		var touchPosCube = new Position(Math.floor(event.offsetX / this.cubeWidth), Math.floor(event.offsetY / this.cubeHeight));
		bindFunc(touchPosCube);
	};
	this.mapBindFunc.MouseDown = func.bind(this);
	this.canvas.addEventListener('mousedown', this.mapBindFunc.MouseDown, false);
};
/* Bind Mouse open event to given bindFunc */
MainPanel.prototype.bindOnMouseUpEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseUp != null) {  //remove original listener
		this.canvas.removeEventListener('mouseup', this.mapBindFunc.MouseUp);
	}
	this.mapBindFunc.MouseUp = bindFunc;
	this.canvas.addEventListener('mouseup', this.mapBindFunc.MouseUp, false);
};
/* Setup map & timer for drawing panel */
MainPanel.prototype.setMap = function(mapFactory) {
	//clear original timer for drawing panel
	clearInterval(this.timerDraw);
	//set map
	this.mapFactory = mapFactory;
	//set timer for drawing panel based on map type
	switch(this.mapFactory.getMapId()) {
		case "MAP_2D_CUBE" :
			this.timerDraw = setInterval(this.drawByCubeMap.bind(this), 5);
			break;
	}
};

/*
    This is a width = 9, height = 5 map example
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
    口口口口口口口口口
*/
MainPanel.prototype.drawByCubeMap = function() {
	var callBackFuncDrawImg = function(pos, ele) {
		if(ele == null) {
			return;
		}
		this.ctx.drawImage(ele.getCurImg(), pos.x * this.cubeWidth, pos.y * this.cubeHeight, this.cubeWidth, this.cubeHeight);
	};
	this.mapFactory.processMapEle(callBackFuncDrawImg.bind(this));
}