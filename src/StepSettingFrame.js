var StepSettingFrame = function (objFactory, mapFileProcessor, stepSetting, funcLoadMap, funcSetCanvas, funcSyncMap, funcGetArgs, languageFactory) {
	this.objFactory = objFactory;
	this.mapFileProcessor = mapFileProcessor;
	this.stepSetting = stepSetting;
	this.languageFactory = languageFactory;
	this.argStepSetting = {type: null, guiId: null, diamondTargetNum: 1, timeLimit: 10};
	this.loadMap = funcLoadMap;
	this.setCanvas = funcSetCanvas;
	this.syncMap = funcSyncMap;
	this.getArgs = funcGetArgs;

	var self = this;
	$('#btnStepSetting').click(function(){
		self.setStepSettingTemplate("STEP_SETTING", '#pf_stepSetting', self.languageFactory.getText('pf_title_stepSetting'));
	});
	$('#btnDimensionSetting').click(function(){
		self.setStepSettingTemplate("DIMENSION_SETTING", '#pf_mapDimensionSetting', self.languageFactory.getText('pf_title_mapDimensionSetting'));
	});
	$('#btnloadFile').click(function(){
		self.setStepSettingTemplate("LOAD_FILE", '#pf_loadStepFile', self.languageFactory.getText('pf_title_loadStepFile'));
	});
	$('#btnSaveFile').click(function(){
		self.setStepSettingTemplate("SAVE_SETTING", '#pf_saveStepFile', self.languageFactory.getText('pf_title_saveStepFile'));
	});
	$('#btnSync').click(function(){
		self.setStepSettingTemplate("SYNC_STEP", '#pf_syncMap', self.languageFactory.getText('pf_title_syncMap'));
	});
	$('#btnLanguageSetting').click(function(){
		self.setStepSettingTemplate("LANGUAGE", '#pf_languageSetting', self.languageFactory.getText('pf_title_language'));
	});


	$('#pf_ss_btnOk').click(function(){
		self.saveStepSetting();
	});
}

StepSettingFrame.prototype.setStepSettingTemplate = function(type, guiId, title) {
	var self = this;
	$('#popupFrameStepSetting').css("display", "block");

	$('#pf_ss_title').html(title);

	if(self.argStepSetting.guiId != null) {
		$(self.argStepSetting.guiId).css("display", "none");
	}

	self.argStepSetting.type = type;
	self.argStepSetting.guiId = guiId;

	$(self.argStepSetting.guiId).css("display", "block");

	var gridTemplate = function(idShowSelFile, idGrid) {
		self.curSelDataFromGrid = null;
		$(idShowSelFile).val('None');
		self.loadStepListFromDir("", function(resp){
			var funcOnSelRow = function(data) {
				self.curSelDataFromGrid = data;
				$(idShowSelFile).val(self.curSelDataFromGrid.file_name);
			} 
			var jg = new JsGrid(self.languageFactory);
			jg.mapSelectorTemplate(idGrid, self.objFactory.getAllTypeOfObj());
			jg.setOnSelCallBackFunc(funcOnSelRow);

			var listMapFilePath = resp.split(",");
			listMapFilePath.splice(listMapFilePath.length - 1, 1);
			(function(){
				var loadMapFinish = function(resp) {
					jg.addNewRow(listMapFilePath[index], resp);
					index = index + 1;
					if(listMapFilePath[index] != null) {
						self.mapFileProcessor.loadMapFromFile(listMapFilePath[index], loadMapFinish, true);
					}
					else {
						jg.refresh();
					}
				}
				var index = 0;
				self.mapFileProcessor.loadMapFromFile(listMapFilePath[index], loadMapFinish, true);
			})();
		});
	}

	switch(type) {
		case "STEP_SETTING":
			$("#pf_selDiamondNo").val(self.argStepSetting.diamondTargetNum);
			$('#pf_setTimeLimite').val(self.argStepSetting.timeLimit);
			break;
		case "DIMENSION_SETTING":
			$("#pf_selWidth").val(self.mapFileProcessor.getWidth('objMap'));
			$("#pf_selHeight").val(self.mapFileProcessor.getHeight('objMap'));
			break;
		case "LOAD_FILE":
			gridTemplate('#pf_selStepFileName', "#pf_fileSelector");
			break;
		case "SAVE_SETTING":
			gridTemplate('#pf_save_selStepFileName', "#pf_save_fileSelector");
			$('input[name=pf_optSave]').click(function(){
			    var selOpt = $('input[name=pf_optSave]:checked').val();
			    switch(selOpt){
			    	case 'createNewFile':
			    		$('#pf_save_createFile').css("display", "block");
			    		$('#pf_save_updateFile').css("display", "none");
			    		break;
			    	case 'updateFile':
			    		$('#pf_save_createFile').css("display", "none");
			    		$('#pf_save_updateFile').css("display", "block");
			    		break;
			    }
			});
			break;
		case "LANGUAGE":
			$('#pf_languageSelector').empty();
			var listLanguage = self.languageFactory.getLanguageList();
			var index = 0;
			while(index < listLanguage.length) {
				$('#pf_languageSelector').append("<option value='" + listLanguage[index] + 
					"'>" + self.languageFactory.getText(listLanguage[index]) + "</option>");
				index = index + 1;
			}
			break;
	}
};

StepSettingFrame.prototype.saveStepSetting = function() {
	$('#popupFrameStepSetting').css("display", "none");

	switch(this.argStepSetting.type) {
		case "STEP_SETTING":
			this.argStepSetting.diamondTargetNum = Number($("#pf_selDiamondNo").val());
			this.argStepSetting.timeLimit = Number($("#pf_setTimeLimite").val());
			break;
		case "DIMENSION_SETTING":
			var width = Number($('#pf_selWidth').val());
			var height = Number($('#pf_selHeight').val());
			this.mapFileProcessor.changeMapDimension(width, height, this.objFactory.getNumById.bind(this.objFactory), 
				this.getArgs(null, null), this.objFactory);
			this.setCanvas(width, height);
			break;
		case "LOAD_FILE":
			if(this.curSelDataFromGrid != null) {
				this.loadMap('SYNC', this.curSelDataFromGrid);
				this.argStepSetting.diamondTargetNum = this.curSelDataFromGrid.diamond_target;
				this.argStepSetting.timeLimit = this.curSelDataFromGrid.time_limit;
				this.setCanvas(this.mapFileProcessor.getWidth('objMap'), this.mapFileProcessor.getHeight('objMap'));
			}
			break;
		case "SAVE_SETTING":
			var selOpt = $('input[name=pf_optSave]:checked').val();
			var fileName = null;
			switch(selOpt){
				case 'createNewFile':
		    		fileName = $('#pf_save_fileName').val()!=null && $('#pf_save_fileName').val()!='' ? 
		    				   $('#pf_save_fileName').val() + '.map' : null;
		    		break;
		    	case 'updateFile':
		    		if(this.curSelDataFromGrid != null) {
		    			fileName = this.curSelDataFromGrid.file_name;
		    		}
		    		break;
			}
			if(fileName != null) {
				this.saveStepFile(fileName);
			}
			break;
		case "SYNC_STEP":
			var snapShot = this.mapFileProcessor.getSnapshot(this.objFactory.getNumById.bind(this.objFactory));
			var args = {
				map_width: snapShot[0].length,
				map_height: snapShot.length,
				diamond_target: this.argStepSetting.diamondTargetNum,
				map_element: snapShot,
				obj_setting: this.stepSetting.getAllSetting(),
				time_limit: this.argStepSetting.timeLimit
			};
			this.syncMap(args);
			break;
		case "LANGUAGE":
			var selLanguage = $("#pf_languageSelector").val();
			this.languageFactory.setLanguage(selLanguage);
			break;
	}
};

StepSettingFrame.prototype.loadStepListFromDir = function(dirPath, callBackFunc) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	callBackFunc(this.responseText);
        }
    };
    xmlhttp.open("GET", "src/php/loadFileList.php?filePath=" + dirPath, true);
    xmlhttp.send();
};

StepSettingFrame.prototype.saveStepFile = function(fileName) {
	var self = this;
	var getMap = self.mapFactory.getSnapshot(this.objFactory.getNumById.bind(this.objFactory));
	//update object
	var result = {
		map_width: getMap[0].length,
		map_height: getMap.length,
		map_element: getMap,
		time_limit: self.argStepSetting.timeLimit,
		diamond_target: self.argStepSetting.diamondTargetNum,
		obj_setting: self.stepSetting.getAllSetting()
	};
	result = JSON.stringify(result);
	console.log(fileName, result);

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	
        }
    };
    xmlhttp.open("GET", "src/php/saveFile.php?filePath=" + fileName + "&" + "content=" + result, true);
    xmlhttp.send();
};

StepSettingFrame.prototype.setPopup = function() {
	// body...
};