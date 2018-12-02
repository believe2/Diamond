var ArrowHint = function () {
	this.TO_RADIANS = Math.PI / 180;
	this.arrowWidth = 50;
	this.arrowHeight = 70;
	this.imageLeft = new Image();
	this.imageLeft.src = "icon/arrowLeft.png";
	this.imageRight = new Image();
	this.imageRight.src = "icon/arrowRight.png";
	this.imageUp = new Image();
	this.imageUp.src = "icon/arrowUp.png";
	this.imageDown = new Image();
	this.imageDown.src = "icon/arrowDown.png";

	this.counter = 0;
	this.isPaint = false;
};

ArrowHint.prototype.paint = function (posCenter, cubeWidth, cubeHeight, ctx) {
	if(this.isPaint) {
		this.counter = this.counter + 1;

		if(this.counter > 20) {
			if(this.counter > 40) {
				this.counter = 0;
			}
			var posCenterLT = new Position(posCenter.x * cubeWidth, posCenter.y * cubeHeight);
			var posLeftArrow = new Position(posCenterLT.x - this.arrowHeight, posCenterLT.y);
			var posRightArrow = new Position(posCenterLT.x + cubeWidth, posCenterLT.y);
			var posUpArrow = new Position(posCenterLT.x, posCenterLT.y - this.arrowHeight);
			var posDownArrow =  new Position(posCenterLT.x, posCenterLT.y + cubeHeight);

			//draw up
			ctx.drawImage(this.imageUp, posUpArrow.x, posUpArrow.y, this.arrowWidth, this.arrowHeight);
			//draw left
			ctx.drawImage(this.imageLeft, posLeftArrow.x, posLeftArrow.y, this.arrowHeight, this.arrowWidth);
			//draw down
			ctx.drawImage(this.imageDown, posDownArrow.x, posDownArrow.y, this.arrowWidth, this.arrowHeight);
			//draw right
			ctx.drawImage(this.imageRight, posRightArrow.x, posRightArrow.y, this.arrowHeight, this.arrowWidth);
		}
	}
};

ArrowHint.prototype.setIsPaint = function(isPaint) {
	this.isPaint = isPaint;
};

ArrowHint.prototype.getIsPaint = function() {
	return this.isPaint;
}