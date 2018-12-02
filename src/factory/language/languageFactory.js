var LanguageFactory = function () {
	this.isFirstSetting = true;
	this.curLanguage = null;
	this.language = {
		"ENGLISH": (new English()),
		"CHINA": (new China())
	};

	this.tagToTextMap = {
		tab_game: {type: 'text', map: 'tabGame'},
		tab_editMap: {type: 'text', map: 'tabEditMap'},
		btnStart: {type: 'title', map: 'btnTooltipStartPlay'},
		btnRestart: {type: 'title', map: 'btnTooltipRestartGame'},
		btnBurstMyself: {type: 'title', map: 'btnTooltipBurst'},
		btnModeFurnish: {type: 'title', map: 'btnTooltipModeFurnish'},
		btnModeConfig: {type: 'title', map: 'btnTooltipModeConfig'},
		btnStepSetting: {type: 'title', map: 'btnTooltipStepSetting'},
		btnTimeLimitSetting: {type: 'title', map: 'btnTooltipTimeLimitSetting'},
		btnDimensionSetting: {type: 'title', map: 'btnTooltipDimensionSetting'},
		btnloadFile: {type: 'title', map: 'btnTooltipLoadFile'},
		btnSaveFile: {type: 'title', map: 'btnTooltipSaveFile'},
		btnSync: {type: 'title', map: 'btnTooltipSync'},
		pf_tx_obj: {type: 'text', map: 'pfOsTitleObj'},
		pf_tx_obj_pos: {type: 'text', map: 'pfOsTitleObjPos'},
		pf_tx_minst: {type: 'text', map: 'pfOsTitleGreenWaterSettingMinST'},
		pf_tx_maxst: {type: 'text', map: 'pfOsTitleGreenWaterSettingMaxST'},
		pf_tx_minsn: {type: 'text', map: 'pfOsTitleGreenWaterSettingMinSN'},
		pf_tx_maxsn: {type: 'text', map: 'pfOsTitleGreenWaterSettingMaxSN'},
		pf_sws_title: {type: 'text', map: 'pfOsTitleStretchWallSetting'},
		pf_sws_left: {type: 'text', map: 'left'},
		pf_sws_right: {type: 'text', map: 'right'},
		pf_sws_up: {type: 'text', map: 'up'},
		pf_sws_down: {type: 'text', map: 'down'},
		pf_os_btnOk: {type: 'text', map: 'ok'},
		pf_os_btnCancel: {type: 'text', map: 'cancel'},
		pf_tx_diamondTarget: {type: 'text', map: 'pfSsTitleDiamondTarget'},
		pf_tx_width: {type: 'text', map: 'width'},
		pf_tx_height: {type: 'text', map: 'height'},
		pf_tx_loadStepFile: {type: 'text', map: 'pfSsTitleLoadStepFile'},
		pf_tx_timeLimitSetting: {type: 'text', map: 'pfSsTitleTimeLimitSetting'},
		pf_tx_createNewFile: {type: 'text', map: 'pfSsTitleCreateNewMapFile'},
		pf_tx_updateFile: {type: 'text', map: 'pfSsTitleUpdateMapFile'},
		pf_tx_inputFileName: {type: 'text', map: 'inputFileName'},
		pf_tx_selItem: {type: 'text', map: 'selOneItem'},
		pf_tx_sync: {type: 'text', map: 'pfssTitleSync'},
		pf_ss_btnOk: {type: 'text', map: 'ok'},
		pf_ss_btnCancel: {type: 'text', map: 'cancel'},
		pf_sec: {type: 'text', map: 'sec'},
		pf_title_stepSetting: {type: 'text', map: 'titleStepSetting'},
		pf_title_mapDimensionSetting: {type: 'text', map: 'titleDimensionSetting'},
		pf_title_loadStepFile: {type: 'text', map: 'titleLoadFile'},
		pf_title_saveStepFile: {type: 'text', map: 'titleSaveFile'},
		pf_title_timeLimitSetting: {type: 'text', map: 'titleTimeLimitSetting'},
		pf_title_syncMap: {type: 'text', map: 'titleSync'},
		grid_attr_fileName: {type: 'text', map: 'gridAttrFileName'},
		grid_attr_mapWidth: {type: 'text', map: 'gridAttrMapWidth'},
		grid_attr_mapHeight: {type: 'text', map: 'gridAttrMapHeight'},
		grid_attr_diamondTarget: {type: 'text', map: 'gridAttrDiamondTarget'},
		grid_attr_timeLimit: {type: 'text', map: 'gridAttrTimeLimit'},
		grid_attr_objType: {type: 'text', map: 'gridAttrObjType'},
		btnLanguageSetting: {type: 'title', map: 'btnTooltipLanguageSetting'},
		pf_title_language: {type: 'text', map: 'titleLanguageSetting'},
		ENGLISH: {type: 'text', map: 'english'},
		CHINA: {type: 'text', map: 'china'}
	};

	this.setLanguage("CHINA");
};

LanguageFactory.prototype.setLanguage = function(whichLanguage) {
	this.curLanguage = whichLanguage;
	for(var key in this.tagToTextMap) {
		switch(this.tagToTextMap[key].type) {
			case 'text':
				$('#' + key).html(this.language[whichLanguage].get(this.tagToTextMap[key].map));
				break;
			case 'title':
				if(this.isFirstSetting) {
					$('#' + key).tipso({
						delay: 2,
						speed: 10
					});
				}
				$('#' + key).tipso('update', 'content', this.language[whichLanguage].get(this.tagToTextMap[key].map));
				if(this.isFirstSetting) {
					//$('#' + key).tipso('update', 'animationIn', "bounceIn");
					//$('#' + key).tipso('update', 'animationOut', "bounceOut");
				}
				break;
		}	
	}
	this.isFirstSetting = false;
};

LanguageFactory.prototype.getText = function(id) {
	return this.language[this.curLanguage].get(this.tagToTextMap[id].map);
};

LanguageFactory.prototype.getLanguageList = function() {
	var result = [];
	for (var key in this.language) {
		result.push(key);
	}
	return result;
};