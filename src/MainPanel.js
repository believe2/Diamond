var MainPanel = function(ctx, canvas){
	this.mapBindFunc = {};
	this.mapFactory = null;
	this.timerDraw = null;

	this.drawMaxWidth = 12;
	this.drawMaxHeight = 14;
	this.cubeWidth = 50;
	this.cubeHeight = 50;

	this.drawStartPos = new Position(0, 0, 0);
	
	this.canvas = canvas;
	this.ctx = ctx;
};
/* Bind Mouse push event to given bindFunc with touch positon (event.offsetX, event.offsetY) */
MainPanel.prototype.bindOnMouseDownEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseDown != null) {  //remove original listener
		this.canvas.removeEventListener('mousedown', this.mapBindFunc.MouseDown);
	}
	var func = function(event) {
		var touchPosCube = new Position(Math.floor(event.offsetX / this.cubeWidth) + this.drawStartPos.x,
		                                Math.floor(event.offsetY / this.cubeHeight) + this.drawStartPos.y);
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
		if(ele == null) {  //no element
			return;
		}
		if(!this.isObjPosInDrawRange(pos)) {  //object position outbound the view range
			return;
		}
		this.ctx.drawImage(ele.getCurImg(), (pos.x - this.drawStartPos.x) * this.cubeWidth, (pos.y - this.drawStartPos.y) * this.cubeHeight, this.cubeWidth, this.cubeHeight);
	};
	this.mapFactory.processMapEle(callBackFuncDrawImg.bind(this));
};

MainPanel.prototype.changeStartPosOnObjectMove = function(pos) {
	//width
	if(pos.x + 5 <= this.mapFactory.getMaxX()) {
		this.drawStartPos.x = pos.x - (this.drawMaxWidth - 5);
		if(this.drawStartPos.x < 0) {
			this.drawStartPos.x = 0;
		}
	}
	else {
		this.drawStartPos.x = this.mapFactory.getMaxX() - this.drawMaxWidth;
	}
	//height
	if(pos.y + 6 <= this.mapFactory.getMaxY()) {
		this.drawStartPos.y = pos.y - (this.drawMaxHeight - 6);
		if(this.drawStartPos.y < 0) {
			this.drawStartPos.y = 0;
		}
	}
	else {
		this.drawStartPos.y = this.mapFactory.getMaxY() - this.drawMaxHeight;
	}
};

MainPanel.prototype.isObjPosInDrawRange = function(pos) {
	return (pos.x >= this.drawStartPos.x && pos.x < this.drawStartPos.x + this.drawMaxWidth) &&
	       (pos.y >= this.drawStartPos.y && pos.y < this.drawStartPos.y + this.drawMaxHeight);
};