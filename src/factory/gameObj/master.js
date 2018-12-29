var Master = function (args) {
	BaseObject.call(this, args);
	this.listImage =   ['master-left1.png', 'master-left2.png', 'master-left3.png', 'master-left4.png',
 						'master-right1.png', 'master-right2.png', 'master-right3.png', 'master-right4.png',
 						'master-up1.png', 'master-up2.png', 'master-up3.png', 'master-up4.png',
 						'master-down1.png', 'master-down2.png', 'master-down3.png', 'master-down4.png'];
 	this.listCanPass = ['SAND', 'DIAMOND'];
 	this.burst = {source: ['MONSTER_CUBE', 'BUTTERFLY'], type: this.burstType['3x3_GRID'], prod: 'STONE'};
 	this.eat = ['DIAMOND'];
 	this.push = ['STONE'];
	this.curImage = 12;
	this.curMoveDirection = 'DOWN'
	this.isMoveLasting - false;

	this.meetCheckBurst = this.actionFactory.create({actionType: 'MEET_CHECK_BURST',
		                                             mainObj: this
		                                           });
	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	this.moveByHand = this.actionFactory.create({actionType: 'MOVE_BY_HAND',
		                                         mainObj: this
	                                           });

	this.setController(this.gamePanel);

	this.registerAction(1, 230, this.animateGameObject.doAction.bind(this.animateGameObject));

	/*
	this.dkCounter = new DeLockCounter(3);

	this.triggerBurstingEvent = args.bindFuncBurst;
	this.triggerMovingEvent = args.bindFuncMove;
	this.triggerMoving2Event = args.bindFuncMove2;
	this.triggerEatObjectEvent = args.bindFuncEatObject;
	this.triggerMasterMove = args.bindFuncMasterMove;
	this.triggerMasterGoExit = args.bindFuncMasterGoExit;

	this.curMoveDirection = "DOWN";
	this.isMoveLasting = null;
	this.lockMoveNum = 0;

	this.counterImageChange = 0;

	this.registerAction(0, this.CYCLE_TRIGER, this.monitorAction.bind(this));
	this.registerFunc(0, this.triggerBurstEvent.bind(this));
	*/
};

Master.prototype = Object.create(BaseObject.prototype);
Master.prototype.superClass = Object.create(BaseObject.prototype);
Master.prototype.constructor = Master;

Master.prototype.getCurMoveDirection = function() {
	return this.curMoveDirection;
};

Master.prototype.getIsMoveLasting = function() {
	return this.isMoveLasting;
};

Master.prototype.setController = function(panel) {
	this.gamePanel.bindOnMouseDownEvent(this.letMasterMove.bind(this));
	this.gamePanel.bindOnMouseUpEvent(this.letMasterStopMove.bind(this));
};

Master.prototype.letMasterMove = function(clickPos) {
	var posGen = new PosGenerator();
	this.isMoveLasting = true;
	console.log(posGen.transformUnitVector(new Position(clickPos.x - this.curPos.x, clickPos.y - this.curPos.y)))
};

Master.prototype.letMasterStopMove = function() {
	this.isMoveLasting = false;
};

Master.prototype.setNextImg = function() {
	var nextImgIndex = -1;
	var imageLen = this.listImage.length / 4;
	var listIndexBase = {
		'LEFT': 0,
		'RIGHT': imageLen,
		'UP': imageLen * 2,
		'DOWN': imageLen * 3
	};
	//check range in current direction
	if(this.curImage >= listIndexBase[this.curMoveDirection] && this.curImage < listIndexBase[this.curMoveDirection] + imageLen) {
		nextImgIndex = listIndexBase[this.curMoveDirection] + (((this.curImage % imageLen) + 1) % imageLen);
	}
	else {
		nextImgIndex = listIndexBase[this.curMoveDirection];
	}
	this.curImage = nextImgIndex;
};

Master.prototype.monitorAction = function() {
	//burst judgement
	var index = 0;
	var isBurst = false;
	while(!isBurst && index < this.burst.source.length) {
		if(this.isTouchObj(this.burst.source[index])) {
			this.triggerBurstEvent();
		}
		index = index + 1;
	}
	//keep moving
	this.deLockRun(this.isMoveLasting, this.triggerMoveEventByDirection.bind(this), this.curMoveDirection);
	//lock move
	if(this.lockMoveNum > 0) {
		this.lockMoveNum = this.lockMoveNum - 1;
	}
	//image change
	this.counterImageChange = this.counterImageChange + 1;
	if(this.counterImageChange >= 2) {
		this.counterImageChange = 1;
		this.triggerMovingEvent(this, null, this.nextImg(this.curMoveDirection));
	}
};

Master.prototype.triggerBurstEvent = function() {
	this.lockMoveNum = 999;
	var posGenerator = new PosGenerator();
	this.triggerBurstingEvent(posGenerator.posbaseInputVector(this.curPos, this.burst.type), this.burst.prod);
};

Master.prototype.triggerMoveEventByClickPos = function(posClick, cubeWidth, cubeHeight) {
	if(this.lockMoveNum > 0) {  //lock move
		this.curMoveDirection = null;
		return;
	}
	var posClickCube = new Position(Math.floor(posClick.x / cubeWidth), Math.floor(posClick.y / cubeHeight));
	var direction = function(posBase, posTarget) {
		var resDirection = null;
		if(posBase.x - 1 == posTarget.x && posBase.y == posTarget.y) {
			resDirection = 'LEFT';
		}
		else if(posBase.x + 1 == posTarget.x && posBase.y == posTarget.y) {
			resDirection = 'RIGHT';
		}
		else if(posBase.x == posTarget.x && posBase.y - 1 == posTarget.y) {
			resDirection = 'UP';
		}
		else if(posBase.x == posTarget.x && posBase.y + 1 == posTarget.y) {
			resDirection = 'DOWN';
		}
		return resDirection;
	}(this.curPos, posClickCube);
	this.triggerMoveEventByDirection(direction);
	return direction;
};

Master.prototype.triggerMoveEventByDirection = function(direction) {
	if(direction != null) {
		var nextPosition = this.nextPos(direction);
		var isRealMove = false;
		if(this.isPassby(nextPosition)) {
			this.triggerEatObjEvent(nextPosition);
			this.triggerMovingEvent(this, nextPosition, this.nextImg(direction));
			isRealMove = true;
		}
		else {
			if(this.triggerPushObjEvent(nextPosition)) {
				this.triggerMovingEvent(this, nextPosition, this.nextImg(direction));
				isRealMove = true;
			}
			else if(this.funcGetObjInfoByPos(nextPosition) != null && 
				this.funcGetObjInfoByPos(nextPosition).id == 'EXIT') {
				this.triggerMasterGoExit();
			}
		}
		this.triggerMasterMove(this.curPos);
		if(isRealMove == true) {
			this.lockMoveNum = 3;
		}
	}
	this.curMoveDirection = direction;
};

Master.prototype.triggerEatObjEvent = function(nextPosition) {
	var index = 0;
	var target = this.funcGetObjInfoByPos(nextPosition);
	if(target != null) {
		var targetId = target.id;
		var isEatable = false;
		while(!isEatable && index < this.eat.length) {
			if(targetId == this.eat[index]) {
				this.triggerEatObjectEvent(nextPosition);
				isEatable = true;
			}
			index = index + 1;
		}
	}
};

Master.prototype.triggerPushObjEvent = function(nextPosition) {
	var index = 0;
	var targetInfo = this.funcGetObjInfoByPos(nextPosition);
	var isPushable = false;
	if(targetInfo != null) {
		while(!isPushable && index < this.push.length) {
			if(targetInfo != null && targetInfo.id == this.push[index] && 
				(targetInfo.funcIsFalling != null && !targetInfo.funcIsFalling())) {
				var vector = new Position(nextPosition.x - this.curPos.x, nextPosition.y - this.curPos.y);
				var nextPosPushObj = new Position(nextPosition.x + vector.x, nextPosition.y + vector.y);
				if(targetInfo.funcIsPassby(nextPosPushObj)) {
					this.triggerMoving2Event(nextPosition, nextPosPushObj, null);
					isPushable = true;
				}
			}
			index = index + 1;
		}
	}
	return isPushable;
};

Master.prototype.nextPos = function(direction) {
	var nextPos = new Position(this.curPos.x, this.curPos.y);
	switch(direction) {
		case 'LEFT' :
			nextPos.x = nextPos.x - 1;
			break;
		case 'RIGHT' :
			nextPos.x = nextPos.x + 1;
			break;
		case 'UP' :
			nextPos.y = nextPos.y - 1;
			break;
		case 'DOWN' :
			nextPos.y = nextPos.y + 1;
			break;
	}
	return nextPos;
};

Master.prototype.nextImg = function(direction) {
	var nextImgIndex = -1;
	var imageLen = this.listImage.length / 4;
	var listIndexBase = {
		'LEFT': 0,
		'RIGHT': imageLen,
		'UP': imageLen * 2,
		'DOWN': imageLen * 3
	};
	//check range in current direction
	if(this.curImage >= listIndexBase[direction] && this.curImage < listIndexBase[direction] + imageLen) {
		nextImgIndex = listIndexBase[direction] + (((this.curImage % imageLen) + 1) % imageLen);
	}
	else {
		nextImgIndex = listIndexBase[direction];
	}
	return nextImgIndex;
};

Master.prototype.setIsMoveLasting = function(isMoveLasting) {
	this.isMoveLasting = isMoveLasting;
};