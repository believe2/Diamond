var GameFrame = function(ctx, canvGame){
	this.gamePanel = new MainPanel(ctx, canvGame);
	this.mapFactory = new MapFactory("MAP_2D_CUBE");
	this.stepSetting = new StepSetting();
	this.imgFactory = new ImageFactory('img/');
	this.objFactory = new ObjFactory();
	this.soundEffectFactory =  new SoundEffectFactory();
	this.backgroundMusicFactory = new BackgroundMusicFactory();
	this.languageFactory = new LanguageFactory();
	this.eventQueueHandler = new EventQueueHandler();
	this.actionFactory = new ActionFactory();
	this.scoreBoard = new ScoreBoard('#scoreBoard');

	this.stepSetting.initialObj(this.mapFactory);
	this.objFactory.initialObj(this.gamePanel, this.imgFactory, this.mapFactory, this.actionFactory);
	this.eventQueueHandler.initialObj(this.mapFactory, this.objFactory, this.soundEffectFactory, this.gamePanel, this.scoreBoard);
	this.mapFactory.initialObj(this.objFactory);
	this.actionFactory.initialObj(this.eventQueueHandler);
	this.scoreBoard.initialObj(this.imgFactory, this.eventQueueHandler, this.mapFactory, this);
	this.gamePanel.setMap(this.mapFactory);

	this.curStep = 9;
	this.isGameStart = false;

	this.initial();
	this.slotGoNextStep();
};

GameFrame.prototype.initial = function() {
	console.log("gf initial");
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
	var funcInitialStep = function(listMapRawData, objectSetting, scoreboardSetting) {
		self.mapFactory.createObjByMap();
		self.stepSetting.setSettingToAllObject(objectSetting);
		self.eventQueueHandler.changePanelStartPos(self.mapFactory.getOneOfObj('MASTER'));
		self.scoreBoard.setupByMapSetting(scoreboardSetting);
	};
	self.objFactory.initialNoForEachObj();
	switch(loadType) {
		case 'FROM_FILE': 
			self.mapFactory.loadStageInfoFromFile(res, funcInitialStep);
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

GameFrame.prototype.slotPlayBackgroundMusic = function() {
	if(this.isGameStart) {
		this.backgroundMusicFactory.playSound('END_MUSIC');
	}
};

GameFrame.prototype.slotStartGame = function() {
	if(this.isGameStart) {
		return;
	}
	var callBackFuncStartObjAction = function(pos, ele) {
		if(ele == null) {
			return;
		}
		ele.startAction('ALL');
	};
	this.mapFactory.processMapEle(callBackFuncStartObjAction.bind(this), true);
	this.scoreBoard.start();
	this.isGameStart = true;
	this.arrowHint.setIsPaint(true);
	this.eventQueueHandler.start();
};

GameFrame.prototype.slotStopGame = function() {
	this.eventQueueHandler.stop();
	this.backgroundMusicFactory.stopPlaying();
	this.isGameStart = false;

	var callBackFuncStopObjAction = function(pos, ele) {
		if(ele == null) {
			return;
		}
		ele.stopAction('ALL');
	};

	this.mapFactory.processMapEle(callBackFuncStopObjAction.bind(this), true);
};

GameFrame.prototype.slotReloadGame = function(loadType, res) {
	this.arrowHint.setIsPaint(false);
	this.slotStopGame();
	this.loadMap(loadType, res);
};

GameFrame.prototype.slotSyncMap = function(args) {
	this.slotReloadGame('SYNC', args);
};

GameFrame.prototype.slotGoNextStep = function() {
	this.curStep = this.curStep + 1;
	this.slotStopGame();
	this.loadMap('FROM_FILE', this.curStep + ".map");
};