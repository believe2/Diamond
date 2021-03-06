var Master = function (args) {
	BaseObject.call(this, args);
	this.listImage =   ['master-left1.png', 'master-left2.png', 'master-left3.png', 'master-left4.png',
 						'master-right1.png', 'master-right2.png', 'master-right3.png', 'master-right4.png',
 						'master-up1.png', 'master-up2.png', 'master-up3.png', 'master-up4.png',
 						'master-down1.png', 'master-down2.png', 'master-down3.png', 'master-down4.png'];
 	this.listCanPass = ['SAND'];
 	this.burst = {source: ['MONSTER_CUBE', 'BUTTERFLY'], type: this.burstType['3x3_GRID'], prod: null};
 	this.eat = ['DIAMOND'];
 	this.push = ['STONE'];
 	this.goin = ['EXIT%isOpenExit'];
 	this.lockMoveTime = 370;
 	this.listEnableMoveDirVector = [new Position(-1,0,0), new Position(1,0,0), new Position(0,-1,0), new Position(0,1,0)];
	this.curImage = 12;
	this.curMoveDirection = this.listEnableMoveDirVector[3];

	this.isMoveLasting = false;
	this.isLockMove = false;
	this.isBurstYourself = false;

	this.meetCheckBurst = this.actionFactory.create({actionType: 'MEET_CHECK_BURST',
		                                             mainObj: this,
		                                             checkBurstFunc: this.getIsBurstYourself.bind(this)
		                                           });
	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	this.moveByHand = this.actionFactory.create({actionType: 'MOVE_BY_HAND',
		                                         lockTime: 8,
		                                         mainObj: this
	                                           });
	if(this.gamePanel.getPanelId() == 'PANEL_GAME_FRAME') {
		this.setController(this.gamePanel);
	}

	this.registerAction(1, 230, this.animateGameObject.doAction.bind(this.animateGameObject));
    this.registerAction(2, 50, this.moveByHand.doAction.bind(this.moveByHand));
    this.registerAction(3, 100, this.meetCheckBurst.doAction.bind(this.meetCheckBurst));
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

Master.prototype.getIsLockMove = function() {
	return this.isLockMove;
};

Master.prototype.setController = function(panel) {
	this.gamePanel.bindOnMouseDownEvent(this.letMasterMove.bind(this));
	this.gamePanel.bindOnMouseUpEvent(this.letMasterStopMove.bind(this));
};

Master.prototype.setBurstYourself = function() {
	this.isBurstYourself = true;
};

Master.prototype.getIsBurstYourself = function() {
	return this.isBurstYourself;
};

Master.prototype.letMasterMove = function(clickPos) {
	var posGen = new PosGenerator();
	clickPos.z = this.curPos.z;
	var nextMoveDirVector = posGen.isMoveUnitVectorInCheckList(this.curPos, clickPos, this.listEnableMoveDirVector);
	if(nextMoveDirVector != null) {
		this.isMoveLasting = true;
		this.curMoveDirection = nextMoveDirVector;
	}
};

Master.prototype.letMasterStopMove = function() {
	this.isMoveLasting = false;
};

Master.prototype.setNextImg = function() {
	var nextImgIndex = -1;
	var imageLen = this.listImage.length / this.listEnableMoveDirVector.length;
	var indexBase = 0;
	while(indexBase < this.listEnableMoveDirVector.length) {
		if(this.curMoveDirection.toString() == this.listEnableMoveDirVector[indexBase].toString()) {
			indexBase = indexBase * imageLen;
			break;
		}
		indexBase = indexBase + 1;
	}
	//check range in current direction
	if(this.curImage >= indexBase && this.curImage < indexBase + imageLen) {
		nextImgIndex = indexBase + (((this.curImage % imageLen) + 1) % imageLen);
	}
	else {
		nextImgIndex = indexBase;
	}
	this.curImage = nextImgIndex;
};

Master.prototype.isMeetActionObject = function(type, position) {
	var listCheck = null;
	switch(type) {
		case 'MASTER_EAT':
			listCheck = this.eat;
			break;
		case 'MASTER_PUSH':
			listCheck = this.push;
			break;
		case 'MASTER_ARRIVE':
			listCheck = this.goin;
			break;
	}
	var targetObj = this.map.getEle(position);
	var isMeetTarget = false;
	var index = 0;
	while(!isMeetTarget && index < listCheck.length) {
		if(listCheck[index] == targetObj.getId()) {
			isMeetTarget = true;
		}
		else if(listCheck[index].indexOf('%') > -1) {
			var tempObjId = listCheck[index].split('%')[0];
			var tempFuncCheck = listCheck[index].split('%')[1];
			if(tempObjId == targetObj.getId() && targetObj[tempFuncCheck] != null && targetObj[tempFuncCheck]()) {
				isMeetTarget = true;
			}
		}
		index = index + 1;
	}
	return isMeetTarget;
};

Master.prototype.doNextWhenMove = function() {
	if(this.isLockMove) {
		return;
	}
	this.isLockMove = true;
	setTimeout((function(){ 
		this.isLockMove = false;
	}).bind(this), this.lockMoveTime);
};