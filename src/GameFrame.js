var GameFrame = function(ctx, canvGame){
	this.gamePanel = new MainPanel(ctx, canvGame);

	this.mapFactory = new MapFactory(-1, "FLOOR");
	this.floorMapFactory = new MapFactory(0, "OBJECT");
	this.stepSetting = new StepSetting([this.mapFactory, this.floorMapFactory]);
	this.mapFileProcessor = new MapFileProcessor({floorMap: this.floorMapFactory, objMap: this.mapFactory}, this.stepSetting);

	this.objFactory = new ObjFactory(new ImageFactory('img/'), this.mapFactory, this.gamePanel);
	this.mapFactory.setObjFactory(this.objFactory);
	this.soundEffectFactory =  new SoundEffectFactory();
	this.backgroundMusicFactory = new BackgroundMusicFactory();
	this.languageFactory = new LanguageFactory();
	this.eventQueueHandler = new EventQueueHandler(this.mapFactory, this.objFactory, this.soundEffectFactory, this);
	this.actionFactory = new ActionFactory(this.eventQueueHandler);
	this.objFactory.setActionFactory(this.actionFactory);

	this.ctx = ctx;
	this.curStep = 5;
	this.curMap = null;

	this.cubeWidth = 50;
	this.cubeHeight = 50;
	this.eatDiamondTargetNum = 15;
	this.timeLimit = 10;
	this.isGameStart = false;

	this.drawStartPos = new Position(0, 0);
	this.drawMaxWidth = 12;
	this.drawMaxHeight = 14;

	this.initial();

	this.timerDraw = setInterval(this.slotDrawFrameEvent.bind(this), 1);

	this.slotGoNextStep();
};

GameFrame.prototype.initial = function() {
	console.log("gf initial");
	//counter - time
	this.clockTime = new Counter("#clock_time", this.slotBurstMyself.bind(this));
	//counter - diamond target
	this.clockDiamondEatNum = new Counter("#clock_diamondEatNum", null);
	this.clockDiamondTargetNum = new Counter("#clock_diamondTarget", null);
	//monitor to play background music
	this.soundEffectFactory.initial();
	this.backgroundMusicFactory.initial();
	this.timerPlauBackgroundMusic = setInterval(this.slotPlayBackgroundMusic.bind(this), 750);
	//arrow hint
	this.arrowHint = new ArrowHint();
	this.arrowHint.setIsPaint(false);
};

GameFrame.prototype.loadMap = function(loadType, res) {
	var self = this;
	var funcInitialStep = function() {
		self.mapFileProcessor.reloadRawFile();
		self.mapFactory.createObjByMap(self.objFactory, self.getArgs(null, null));
		self.floorMapFactory.createObjByMap(self.objFactory, self.getArgs(null, null));
		self.stepSetting.setSettingToAllObject();
		self.eatDiamondTargetNum = self.stepSetting.getValue('diamond_target');
		self.timeLimit = self.stepSetting.getValue('time_limit');
		self.initialScoreBoard();
	};
	self.curEatDiamondNum = 0;
	switch(loadType) {
		case 'FROM_FILE': 
			self.mapFileProcessor.loadMapFromFile(res, funcInitialStep);
			break;
		case 'SYNC':
			self.mapFileProcessor.loadMapJsonObj(res);
			funcInitialStep();
			break;
		default:
			funcInitialStep();
			break;
	}
};

GameFrame.prototype.initialScoreBoard = function() {
	if(this.clockDiamondEatNum != null && this.clockDiamondTargetNum != null && this.clockTime != null) {
		this.clockDiamondEatNum.initialCounter(this.curEatDiamondNum, false);
		this.clockDiamondTargetNum.initialCounter(this.eatDiamondTargetNum, false);
		this.clockTime.initialCounter(this.timeLimit, true);
	}
};

GameFrame.prototype.getArgs = function(argId, argPos) {
	return {
		id: argId,
		listCanPass: null,
		listImage: null,
		pos: argPos,
		eventQueueHandler: this.eventQueueHandler,
		actionFactory: this.actionFactory,
		mapDimension: {maxX: this.mapFactory.getMaxX(), maxY: this.mapFactory.getMaxY()},
		bindFuncMove: this.slotObjMoveEvent.bind(this),
		bindFuncMove2: this.slotObjPosMoveEvent.bind(this),
		bindFuncGetObjInfoByPos: this.mapFactory.static_getObjInfo.bind(this.mapFactory),
		bindFuncCreate: this.slotCreateObjEvent.bind(this),
		bindFuncTriggerObjFunc: this.slotCallObjFunc.bind(this),
		bindFuncChangeObj: this.slotChangeObjEvent.bind(this),
		bindFuncBurst: this.slotBurstEvent.bind(this),
		bindFuncGetAllObjCanPassPos: this.slotGetAllObjCanPassPos.bind(this),
		bindFuncEatObject: this.slotEatObject.bind(this),
		bindFuncMasterMove: this.slotOnMasterMove.bind(this),
		bindFuncMasterGoExit: this.slotOnMasterGoExit.bind(this),
		bindFuncPlayEffectSound: this.slotPlayEffectSound.bind(this)
	};
};

GameFrame.prototype.addEatenDiamondNum = function() {
	this.curEatDiamondNum = this.curEatDiamondNum + 1;
	this.clockDiamondEatNum.increase();
	this.slotPlayEffectSound('DING');
	if(this.curEatDiamondNum >= this.eatDiamondTargetNum) {
		this.slotPlayEffectSound('BURP');
		this.openExit();
	}
};

GameFrame.prototype.openExit = function() {
	var listExit = this.mapFactory.getAllOfObj('EXIT');
	var index = 0;
	while(index < listExit.length) {
		listExit[index].callFunc(0);
		index = index + 1;
	}
};

GameFrame.prototype.slotObjMoveEvent = function(obj, nextPos, nextImage) {
	if(nextPos != null) {
		var curPos = obj.getCurPos();
		var temp = this.mapFactory.getEle(curPos);
		this.mapFactory.setEle(nextPos, obj);
		this.mapFactory.setEle(curPos, null);
	}
	obj.update(null, nextImage);
};

GameFrame.prototype.slotObjPosMoveEvent = function(objPos, nextPos, nextImage) {
	this.slotObjMoveEvent(this.mapFactory.getEle(objPos), nextPos, nextImage);
};

GameFrame.prototype.slotCreateObjEvent = function(id, pos, isStopAct) {
	var oldObj = this.mapFactory.getEle(pos);
	if(oldObj != null) {
		oldObj.stopAction('ALL');
	}
	var objNew = this.objFactory.create(this.getArgs(id, pos));
	if(objNew != null) {
		objNew.setGenWay(objNew.GEN_WAY_FROM_OBJECT);
		this.mapFactory.setEle(pos, objNew);
		if(isStopAct == null) {
			objNew.startAction(0);
		}
	}
	else {
		this.mapFactory.setEle(pos, null);
	}
	return objNew;
};

GameFrame.prototype.slotCallObjFunc = function(pos, funcId, objId) {
	var obj = this.mapFactory.getEle(pos);
	if(obj != null && obj.getId() == objId) {
		obj.callFunc(funcId);
	}
};

GameFrame.prototype.slotGetAllObjCanPassPos = function(objId) {
	var listPosCanPass = [];
	var indexX = 0;
	while(indexX <= this.mapFactory.getMaxX()){
		var indexY = 0;
		while(indexY <= this.mapFactory.getMaxY()) {
			var pos = new Position(indexX, indexY);
			var ele = this.mapFactory.getEle(pos);
			if(ele != null && ele.getId() == objId) {
				var listPosTemp = ele.getPosCanPass();
				var indexTemp = 0;
				while(indexTemp < listPosTemp.length) {
					var isExist = false;
					var indexCheck = 0;
					while(!isExist && indexCheck < listPosCanPass.length) {
						if(listPosCanPass[indexCheck].x == listPosTemp[indexTemp].x && listPosCanPass[indexCheck].y == listPosTemp[indexTemp].y) {
							isExist = true;
						}
						indexCheck = indexCheck + 1;
					}
					if(!isExist) {
						listPosCanPass.push(listPosTemp[indexTemp]);
					}
					indexTemp = indexTemp + 1;
				}
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	return listPosCanPass;
};

GameFrame.prototype.slotChangeObjEvent = function(listPos, orgObjId, targetObjId) {
	if(listPos == 'ALL') {
		var indexX = 0;
		while(indexX <= this.mapFactory.getMaxX()){
			var indexY = 0;
			while(indexY <= this.mapFactory.getMaxY()) {
				var pos = new Position(indexX, indexY);
				var ele = this.mapFactory.getEle(pos);
				if(ele != null && ele.getId() == orgObjId) {
					this.slotCreateObjEvent(targetObjId, pos);
				}
				indexY = indexY + 1;
			}
			indexX = indexX + 1;
		}
	}
	else {

	}
};

GameFrame.prototype.slotBurstEvent = function(listPos, objIdProd) {
	this.slotPlayEffectSound("BOOM");
	var tempBurstArea = this.slotCreateObjEvent('BURST_AREA', null, true)
	var index = 0;
	var isBurstGreenWaterWithMainSpread = false;
	var extraSetting = null;
	while(index < listPos.length) {
		if(tempBurstArea.isPassby(listPos[index])) {
			var obj = this.mapFactory.getEle(listPos[index]);
			if(obj != null && obj.getId() == 'GREEN_WATER' && obj.getIsAllowSpread()) {
				extraSetting = this.mapFactory.getEle(listPos[index]).getExtraSetting();
				isBurstGreenWaterWithMainSpread = true;
			}
			var newObj = this.slotCreateObjEvent('BURST_AREA', listPos[index]);
			newObj.setBurstGenObj(objIdProd);
		}
		index = index + 1;
	}
	if(isBurstGreenWaterWithMainSpread) {
		var obj = this.mapFactory.getOneOfObj('GREEN_WATER');
		if(obj != null) {
			obj.setIsAllowSpread(true);
			obj.setExtraSetting(extraSetting);
		}
	}
};

GameFrame.prototype.drawOneElement = function(pos) {
	//draw floor
	var ele = this.floorMapFactory.getEle(pos);
	if(ele != null) {
		this.ctx.drawImage(ele.getCurImg(), (pos.x - this.drawStartPos.x) * this.cubeWidth, 
			(pos.y - this.drawStartPos.y) * this.cubeHeight, this.cubeWidth, this.cubeHeight);
	}
	//draw object
	ele = this.mapFactory.getEle(pos);
	if(ele != null) {
		this.ctx.drawImage(ele.getCurImg(), (pos.x - this.drawStartPos.x) * this.cubeWidth, 
			(pos.y - this.drawStartPos.y) * this.cubeHeight, this.cubeWidth, this.cubeHeight);
	}
};

GameFrame.prototype.slotDrawFrameEvent = function() {
	var indexX = this.drawStartPos.x;
	while(indexX < this.drawStartPos.x + this.drawMaxWidth){
		var indexY = this.drawStartPos.y;
		while(indexY < this.drawStartPos.y + this.drawMaxHeight) {
			var pos = new Position(indexX, indexY);
			this.drawOneElement(pos);
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}

	//draw arrow hint
	/*
	if(this.arrowHint.getIsPaint()) {
		var master = this.mapFactory.getOneOfObj("MASTER");
		if(master != null) {
			var masterPos = master.getCurPos();
			var panelPos = new Position(masterPos.x - this.drawStartPos.x, masterPos.y - this.drawStartPos.y);
			this.arrowHint.paint(panelPos, this.cubeWidth, this.cubeHeight, this.ctx);
		}
	}
	*/
};

GameFrame.prototype.slotPlayBackgroundMusic = function() {
	if(this.isGameStart) {
		this.backgroundMusicFactory.playSound('END_MUSIC');
	}
};

GameFrame.prototype.slotStartGame = function() {
	if(this.isGameStart) {
		return;
	}
	var indexX = 0;
	while(indexX <= this.mapFactory.getMaxX()){
		var indexY = 0;
		while(indexY <= this.mapFactory.getMaxY()) {
			var obj = this.mapFactory.getEle(new Position(indexX, indexY));
			if(obj != null) {
				obj.startAction('ALL');
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	indexX = 0;
	var listAbstractObj = this.mapFactory.getListAbstractObj();
	var listIndex = Object.keys(listAbstractObj);
	while(indexX < listIndex.length) {
		var getIndex = listIndex[indexX];
		listAbstractObj[getIndex].startAction('ALL');
		indexX = indexX + 1;
	}
	this.clockTime.start();
	this.isGameStart = true;
	this.arrowHint.setIsPaint(true);
	this.eventQueueHandler.start();
};

GameFrame.prototype.slotStopGame = function() {
	this.isGameStart = false;
	var indexX = 0;
	while(indexX <= this.mapFactory.getMaxX()){
		var indexY = 0;
		while(indexY <= this.mapFactory.getMaxY()) {
			var obj = this.mapFactory.getEle(new Position(indexX, indexY));
			if(obj != null) {
				obj.stopAction('ALL');
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}

	indexX = 0;
	var listAbstractObj = this.mapFactory.getListAbstractObj();
	var listIndex = Object.keys(listAbstractObj);
	while(indexX < listIndex.length) {
		var getIndex = listIndex[indexX];
		listAbstractObj[getIndex].stopAction('ALL');
		indexX = indexX + 1;
	}

	this.backgroundMusicFactory.stopPlaying();
	this.eventQueueHandler.stop();
};

GameFrame.prototype.slotReloadGame = function(loadType, res) {
	this.arrowHint.setIsPaint(false);
	this.slotStopGame();
	this.loadMap(loadType, res);
	this.slotOnMasterMove(this.mapFactory.getOneOfObj("MASTER").getCurPos());
};

GameFrame.prototype.slotLetMasterMove = function(event) {
	if(this.isGameStart) {
		var masterObj = this.mapFactory.getOneOfObj('MASTER');
		if(masterObj != null) {
			var posTouch = new Position(event.offsetX + this.drawStartPos.x * this.cubeWidth, 
				event.offsetY + this.drawStartPos.y * this.cubeHeight);
			masterObj.setIsMoveLasting('ok');
			if(masterObj.triggerMoveEventByClickPos(posTouch, this.cubeWidth, this.cubeHeight) != null) {
				this.arrowHint.setIsPaint(false);
			}
		}
	}
};

GameFrame.prototype.slotLetMasterStopMove = function(event) {
	var masterObj = this.mapFactory.getOneOfObj('MASTER');
	if(masterObj != null) {
		masterObj.setIsMoveLasting(null);
	}
};

GameFrame.prototype.slotOnMasterMove = function(posMove) {
	//width
	if(posMove.x + 5 <= this.mapFactory.getMaxX()) {
		this.drawStartPos.x = posMove.x - (this.drawMaxWidth - 5);
		if(this.drawStartPos.x < 0) {
			this.drawStartPos.x = 0;
		}
	}
	else {
		this.drawStartPos.x = this.mapFactory.getMaxX() - this.drawMaxWidth + 1;
	}
	//height
	if(posMove.y + 6 <= this.mapFactory.getMaxY()) {
		this.drawStartPos.y = posMove.y - (this.drawMaxHeight - 6);
		if(this.drawStartPos.y < 0) {
			this.drawStartPos.y = 0;
		}
	}
	else {
		this.drawStartPos.y = this.mapFactory.getMaxY() - this.drawMaxHeight + 1;
	}
};

GameFrame.prototype.slotOnMasterGoExit = function() {
	var objExit = this.mapFactory.getOneOfObj("EXIT");
	if(objExit != null && objExit.getIsOpen()) {
		this.slotGoNextStep();
	}
}

GameFrame.prototype.slotEatObject = function(posEat) {
	var eatObj = this.mapFactory.getEle(posEat);
	var eatObjId = eatObj.getId();
	if(eatObj != null) {
		eatObj.stopAction('ALL');
		delete eatObj;
		switch(eatObjId) {
			case 'DIAMOND':
				this.addEatenDiamondNum();
				break;
		}
	}
};

GameFrame.prototype.slotSyncMap = function(args) {
	this.slotReloadGame('SYNC', args);
};

GameFrame.prototype.slotBurstMyself = function() {
	if(this.isGameStart) {
		var objMaster = this.mapFactory.getOneOfObj("MASTER");
		if(objMaster != null) {
			objMaster.triggerBurstEvent();
		}
	}
};

GameFrame.prototype.slotGoNextStep = function() {
	this.curStep = this.curStep + 1;
	this.slotStopGame();
	this.loadMap('FROM_FILE', this.curStep + ".map");
};

GameFrame.prototype.slotPlayEffectSound = function(id) {
	this.soundEffectFactory.playSound(id);
};