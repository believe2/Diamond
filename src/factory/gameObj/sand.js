var Sand = function(args) {
	BaseObject.call(this, args);
	this.listImage = ['sand.jpg'];
}

Sand.prototype = Object.create(BaseObject.prototype);
Sand.prototype.superClass = Object.create(BaseObject.prototype);
Sand.prototype.constructor = Sand;