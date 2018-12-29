var ActionFactory = function(eventQueueHandler) {
	this.eventQueueHandler = eventQueueHandler;

	this.move = {
		'MOVE_ARROUND_WALL' : MoveArroundWall,
		'MOVE_FALLING' : MoveFalling,
		'MOVE_BY_HAND' : MoveByHand
	};
	this.meet = {
		'MEET_CHECK_BURST' : MeetCheckBurst,
		'MEET_CHECK_BURST_OTHER_OBJ' : MeetCheckBurstOtherObject,
		'MEET_TRANSFORM_OBJ' : MeetTransformObj
	};
	this.animate = {
		'ANIMATE_GAME_OBJECT' : AnimateGameObject
	};
	this.genObj = {
		'GENOBJ_SPREAD' : GenObjSpread,
		'GENOBJ_DIR_STRETCH' : GenObjDirectionStretch
	};
};

ActionFactory.prototype.create = function(args) {
	var obj = null;
	var target = null;

	if(args.actionType.startsWith("MOVE")) {
		target = this.move[args.actionType];
	}
	else if(args.actionType.startsWith("MEET")) {
		target = this.meet[args.actionType];
	}
	else if(args.actionType.startsWith("ANIMATE")) {
		target = this.animate[args.actionType];
	}
	else if(args.actionType.startsWith("GENOBJ")) {
		target = this.genObj[args.actionType];
	}
	else {
		console.log("Exception: ActionFactory.prototype.create, no this action " + args.actionType);
	}
	args.eventQueueHandler = this.eventQueueHandler;
	obj = new target(args);
	return obj;
};