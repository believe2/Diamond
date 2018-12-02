var MonsterCube = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['cube1.jpg', 'cube2.jpg', 'cube3.jpg'];
	this.listCanPass = ['ROAD'];
	this.burst = {source: ['GREEN_WATER'], type: this.burstType['3x3_GRID'], prod: 'null'};

	this.moveArroundWall = this.actionFactory.create({actionType: 'MOVE_ARROUND_WALL', 
		                                              mapDimension: args.mapDimension,
		                                              mainObj: this
		                                             });
	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	this.meetCheckBurst = this.actionFactory.create({actionType: 'MEET_CHECK_BURST',
		                                             mainObj: this
		                                           });

	this.registerAction(0, 1000, this.moveArroundWall.doAction.bind(this.moveArroundWall));
	this.registerAction(1, 1000, this.animateGameObject.doAction.bind(this.animateGameObject));
	this.registerAction(2, 200, this.meetCheckBurst.doAction.bind(this.meetCheckBurst));
};

MonsterCube.prototype = Object.create(BaseObject.prototype);
MonsterCube.prototype.superClass = Object.create(BaseObject.prototype);
MonsterCube.prototype.constructor = MonsterCube;