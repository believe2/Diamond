var MagicWall = function(args) {
	StoneWall.call(this, args);

	this.listImage = ['stone wall.jpg', 'stone wall_1.jpg', 'stone wall_2.jpg'];
	this.specificImageName = 'stone wall_2.jpg';
	
	this.isMagicing = false;
	this.timeMaxMagic = 60;
	this.curMagicLastTime = 0;
	this.timeMaxTrigger = 1;
	this.curTriggerTime = 0;

	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	this.meetTransformObj = this.actionFactory.create({actionType: 'MEET_TRANSFORM_OBJ',
		                                               mainObj: this,
		                                               touchDir: 'UP',
		                                               transformDir: 'DOWN',
		                                               transformObjFormula: {'DIAMOND': 'STONE', 'STONE': 'DIAMOND'},
		                                               startMagicOtherAction: this.startMagicAction.bind(this),
		                                               stopMagicOtherAction: this.stopMagicAction.bind(this),
		                                               timeMaxMagic: 20
	                                                 });

	this.registerAction(1001, 1000, this.animateGameObject.doAction.bind(this.animateGameObject));
	this.registerAction(1, 1000, this.meetTransformObj.doAction.bind(this.meetTransformObj));
};

MagicWall.prototype = Object.create(StoneWall.prototype);
MagicWall.prototype.superClass = Object.create(StoneWall.prototype);
MagicWall.prototype.constructor = MagicWall;

MagicWall.prototype.startMagicAction = function() {
	this.startAction(1001);
	//trigger other same type of object magic action
	var listSameTypeObj = this.map.getAllOfObj(this.getId());
	var index = 0;
	while(index < listSameTypeObj.length) {
		listSameTypeObj[index].triggerMagic();
		index = index + 1;
	}
};

MagicWall.prototype.stopMagicAction = function() {
	this.stopAction(1001);
	this.curImage = 0;
};

MagicWall.prototype.triggerMagic = function() {
	this.meetTransformObj.triggerMagic();
};