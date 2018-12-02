var China =  function() {
	this.textMap = {
		tabGame: "遊戲主畫面",
		tabEditMap: "地圖編輯器",

		btnTooltipStartPlay: "開始",
		btnTooltipRestartGame: "重新開始",
		btnTooltipBurst: "自爆",
		btnTooltipModeFurnish: "點綴模式: 右邊選擇物件,於左邊地圖點選您想要擺放物件的位置, 左鍵按著於地圖上移動可以方便大量物件擺放",
		btnTooltipModeConfig: "參數設定模式: 於左邊地圖點選想要設定的物件，便可進行相關參數設定",
		btnTooltipStepSetting: "設定過關條件",
		btnTooltipTimeLimitSetting: "過關時間設定",
		btnTooltipDimensionSetting: "變更地圖大小",
		btnTooltipLoadFile: "載入已存在的地圖檔",
		btnTooltipSaveFile: "儲存目前的地圖",
		btnTooltipSync: "將目前編輯的地圖同步到遊戲主畫面",

		pfOsTitleObj: "物件種類",
		pfOsTitleObjPos: "物件座標",

		pfOsTitleGreenWaterSettingMinST: "擴大週期最小值",
		pfOsTitleGreenWaterSettingMaxST: "擴大週期最大值",
		pfOsTitleGreenWaterSettingMinSN: "擴大單位數目最小值",
		pfOsTitleGreenWaterSettingMaxSN: "擴大單位數目最大值",

		pfOsTitleStretchWallSetting: "請選擇擴張方向(可複選)",

		left: "左邊",
		right: "右邊",
		up: "上方",
		down: "下方",

		ok: "好",
		cancel: "取消",

		pfSsTitleDiamondTarget: "鑽石目標個數",

		width: "寬度",
		height: "高度",

		pfSsTitleLoadStepFile: "選擇檔案",
		pfSsTitleTimeLimitSetting: "時間長度",

		second: "秒",

		pfSsTitleCreateNewMapFile: "建立新的地圖檔",
		pfSsTitleUpdateMapFile: "更新現有地圖檔",

		selOneItem: "請擇一選擇",
		inputFileName: "請輸入檔案名稱",

		pfssTitleSync: "請問您要將目前編輯的關卡同步到遊戲裡呢?",

		titleStepSetting: "過關目標設定",
		titleDimensionSetting: "地圖維度設定",
		titleLoadFile: "讀檔",
		titleSaveFile: "存檔",
		titleTimeLimitSetting: "過關時間設定",
		titleSync: "當前編輯地圖同步",

		gridAttrFileName: "檔案名稱",
		gridAttrMapWidth: "地圖寬度",
		gridAttrMapHeight: "地圖高度",
		gridAttrDiamondTarget: "寶石目標",
		gridAttrTimeLimit: "時間限制",
		gridAttrObjType: "地圖擁有物件種類",

		btnTooltipLanguageSetting: "設定您想要的語言",
		titleLanguageSetting: "選擇語言",

		english: "英文",
		china: "中文"
	}
};

China.prototype.get =  function(index) {
	return this.textMap[index];
};