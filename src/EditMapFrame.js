var EditMapFrame = function (ctx, gameFrame) {
	GameFrame.call(this, ctx);

	this.curSelObjInfo = null;
	this.curSelBtn = null;
	this.counter = 0;
	this.mousePush = false;

	this.gameFrame = gameFrame;

	this.stepSettingFrame = null;
	this.objSelector = null;
	this.objSettingFrame = null;

	this.constructObjSelector();
	this.constructModeSelector();
	this.constructStepSetting();
	this.slotSelMode("MODE_FURNISH");
};

EditMapFrame.prototype = Object.create(GameFrame.prototype);
EditMapFrame.prototype.supperClass = Object.create(GameFrame.prototype);
EditMapFrame.prototype.constructor = EditMapFrame;

EditMapFrame.prototype.initial = function() {
	console.log("emf initial");
};

EditMapFrame.prototype.constructModeSelector = function() {
	var self = this;
	$('#btnModeFurnish').click(function(){
		self.slotSelMode("MODE_FURNISH");
	});
	$('#btnModeConfig').click(function(){
		self.slotSelMode("MODE_CONFIG");
	});
};

EditMapFrame.prototype.constructObjSelector = function() {
	var self = this;

	var listObjInfo = self.objFactory.getAllTypeOfObj();
	this.objSelector = new ObjSelector('#objSelector', listObjInfo, 60, 60, self.slotSelObjFromSelector.bind(self), true);
};

EditMapFrame.prototype.constructStepSetting = function() {
	var self = this;
	self.stepSettingFrame = new StepSettingFrame(self.objFactory, self.mapFileProcessor, self.stepSetting,
		self.loadMap.bind(self), self.setCanvas.bind(self), self.slotSyncMap.bind(self), 
		self.getArgs.bind(self), self.languageFactory);

	self.objSettingFrame = new ObjSettingFrame(self.updateObjSetting.bind(self), 
		self.stepSetting.getSetting.bind(self.stepSetting));
};

EditMapFrame.prototype.slotDrawFrameEvent = function() {
	var indexX = 0;
	while(indexX <= this.mapFactory.getMaxX()){
		var indexY = 0;
		while(indexY <= this.mapFactory.getMaxY()) {
			var pos = new Position(indexX, indexY);
			this.drawOneElement(pos);
			var ele = this.mapFactory.getEle(pos);
			if(ele != null && this.counter == 40) {
				ele.setNextImg();
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	if(this.counter == 40) {
		this.counter = -1;
	}
	this.counter = this.counter + 1;
};

EditMapFrame.prototype.slotSelObjFromSelector = function(selObj) {
	this.curSelObjInfo = selObj;
};

EditMapFrame.prototype.slotSelMode = function(selMode) {
	switch(selMode) {
		case "MODE_FURNISH": 
			$('#btnModeFurnish').css('background-color', 'red');
			$('#btnModeConfig').css('background-color', 'blue');
			$('#objSelector').show(1000);
			$('#panelSetting').hide(1000);
			break;
		case "MODE_CONFIG":
			$('#btnModeFurnish').css('background-color', 'blue');
			$('#btnModeConfig').css('background-color', 'red');
			$('#objSelector').hide(1000);
			$('#panelSetting').show(1000);
			break;
	}
	this.mode = selMode;
};

EditMapFrame.prototype.slotOnTouchPanel = function(event) {
	var posTouch = new Position(event.offsetX, event.offsetY);
	var posClickCube = new Position(Math.floor(posTouch.x / this.cubeWidth), Math.floor(posTouch.y / this.cubeHeight));
	if(this.mousePush || event.type == 'click') {
		switch(this.mode) {
			case "MODE_FURNISH": 
				var orgObj = this.mapFactory.getEle(posClickCube);
				if(orgObj != null) {
					var orgObjSetting = this.stepSetting.getSetting(posClickCube, orgObj.getId());
					this.stepSetting.updateSetting(orgObjSetting, "DELETE");
				}
				this.slotCreateObjEvent(this.curSelObjInfo.id, posClickCube, true);
				break;
			case "MODE_CONFIG":
				if(event.type == 'click') {
					var obj = this.mapFactory.getEle(posClickCube);
					if(obj != null){
						var objId = this.mapFactory.getEle(posClickCube).getId();
						this.objSettingFrame.setObjSettingTemplate(objId, posClickCube);
					}
				}
				break;
		}
	}
};

EditMapFrame.prototype.slotOnPushPanel = function(event) {
	this.mousePush = true;
};

EditMapFrame.prototype.slotOnPopupPanel = function(event) {
	this.mousePush = false;
};

EditMapFrame.prototype.slotSyncMap = function(args) {
	this.gameFrame.slotSyncMap(args);
};

EditMapFrame.prototype.setCanvas = function(width, height) {
	this.ctx.canvas.width = width * this.cubeWidth;
	this.ctx.canvas.height = height * this.cubeHeight;
};

EditMapFrame.prototype.updateObjSetting = function(objInfo) {
	this.objSettingFrame.updateSetting(objInfo, "UPDATE");
};