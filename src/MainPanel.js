var MainPanel = function(ctx, canvas){
	this.drawStartPos = new Position(0, 0);
	this.drawMaxWidth = 12;
	this.drawMaxHeight = 14;
	this.cubeWidth = 50;
	this.cubeHeight = 50;
	
	this.canvas = canvas;
	this.ctx = ctx;
	this.mapBindFunc = {};
};

MainPanel.prototype.bindOnMouseDownEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseDown != null) {
		this.canvas.removeEventListener('mousedown', this.mapBindFunc.MouseDown);
	}
	this.mapBindFunc.MouseDown = bindFunc;
	var func = function(event) {
		var touchPosCube = new Position(Math.floor(event.offsetX / this.cubeWidth), Math.floor(event.offsetY / this.cubeHeight));
		bindFunc(touchPosCube);
	};
	this.canvas.addEventListener('mousedown', func.bind(this), false);
};

MainPanel.prototype.bindOnMouseUpEvent = function(bindFunc) {
	if(this.mapBindFunc.MouseUp != null) {
		this.canvas.removeEventListener('mouseup', this.mapBindFunc.MouseUp);
	}
	this.mapBindFunc.MouseUp = bindFunc;
	this.canvas.addEventListener('mouseup', bindFunc, false);
};

MainPanel.prototype.getCanvas = function() {
	return this.canvas;
};

MainPanel.prototype.getCtx = function() {
	return this.ctx;
}