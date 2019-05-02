var StretchWall = function(args) {
	StoneWall.call(this, args);

	this.listImage = ['stone wall.jpg'];
	this.specificImageName = 'stone wall-stretch.jpg';
	this.listCanPass = ['ROAD'];

	this.ARGS_STRETCH_DIR = ['LEFT'];
	this.STRETCH_GEN_OBJ = 'STONE_WALL';

	this.genObjDirectionStretch = this.actionFactory.create({actionType: 'GENOBJ_DIR_STRETCH',
		                                                     mainObj: this
	                                                        });
	this.registerAction(1, 1000, this.genObjDirectionStretch.doAction.bind(this.genObjDirectionStretch));
};

StretchWall.prototype = Object.create(StoneWall.prototype);
StretchWall.prototype.superClass = Object.create(StoneWall.prototype);
StretchWall.prototype.constructor = StretchWall;

StretchWall.prototype.setExtraSetting = function(args) {
	this.ARGS_STRETCH_DIR = args.stretch_dir;
};

StretchWall.prototype.getExtraSetting = function() {
	return this.ARGS_STRETCH_DIR;
};

StretchWall.prototype.getStretchGenObj = function() {
	return this.STRETCH_GEN_OBJ;
}