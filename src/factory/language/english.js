var English =  function () {
	this.textMap =  {
		tabGame: "Game Screen",
		tabEditMap: "Map Editor",

		btnTooltipStartPlay: "Start to play",
		btnTooltipRestartGame: "Restart the game",
		btnTooltipBurst: "Boom ~ Boom ~ Boomimg",
		btnTooltipModeFurnish: "Furnish Mode: assign object to your map --> try to select any object, and click on map in some position",
		btnTooltipModeConfig: "Object Configuration Mode: click one of object in map, and you can set the arguments of current object",
		btnTooltipStepSetting: "Set the argument of step-passing goal",
		btnTooltipTimeLimitSetting: "Time limit setting",
		btnTooltipDimensionSetting: "Resize the map width or height",
		btnTooltipLoadFile: "Load existing map file",
		btnTooltipSaveFile: "Save current map into file",
		btnTooltipSync: "Synchronize current map into GameFrame and you can try to play all-you-make",

		pfOsTitleObj: "Object Type",
		pfOsTitleObjPos: "Object Position",

		pfOsTitleGreenWaterSettingMinST: "Minumum Spread Time",
		pfOsTitleGreenWaterSettingMaxST: "Maximum Spread Time",
		pfOsTitleGreenWaterSettingMinSN: "Minimum Spread Number",
		pfOsTitleGreenWaterSettingMaxSN: "Maximum Spread Number",

		pfOsTitleStretchWallSetting: "Please select the direction",

		left: "Left",
		right: "Right",
		up: "Up",
		down: "Down",

		ok: "Ok",
		cancel: "Cancel",

		pfSsTitleDiamondTarget: "Diamond Target",

		width: "width",
		height: "height",

		second: "sec",

		pfSsTitleLoadStepFile: "Please select an item for loading",
		pfSsTitleTimeLimitSetting: "Please set the time limitation",

		pfSsTitleCreateNewMapFile: "Create new map file",
		pfSsTitleUpdateMapFile: "Update existing map file",

		selOneItem: "Please select an item",
		inputFileName: "Please input file name",

		pfssTitleSync: "Do you want to synchronize current map into game frame?",

		titleStepSetting: "Pass Goal Setting",
		titleDimensionSetting: "Map Dimension Setting",
		titleLoadFile: "Load File",
		titleSaveFile: "Save File",
		titleTimeLimitSetting: "Pass Time Setting",
		titleSync: "Synchronization of Current Editing Map",

		gridAttrFileName: "File Name",
		gridAttrMapWidth: "Map Width",
		gridAttrMapHeight: "Map Height",
		gridAttrDiamondTarget: "Diamond Target",
		gridAttrTimeLimit: "Time Limit",
		gridAttrObjType: "Object Type",

		btnTooltipLanguageSetting: "Set the language you enjoy",
		titleLanguageSetting: "Select a language",

		english: "English",
		china: "Chinese"
	};
};

English.prototype.get = function(index) {
	return this.textMap[index];
};