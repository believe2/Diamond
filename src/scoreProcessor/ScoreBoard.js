var ScoreBoard = function(idTag) {
	this.setting = null;
	this.imgFactory = null;
	this.idTag = idTag;
	this.listCondOpenExit = null;
	this.listCondStageClear = null;
	this.listCondStageFail = null;
};

ScoreBoard.prototype.initialObj = function(imgFactory, eventQueueHandler, mapFactory, gameFrame) {
	this.imgFactory = imgFactory;
	this.eventQueueHandler = eventQueueHandler;
	this.mapFactory = mapFactory;
	this.gameFrame = gameFrame;
};

ScoreBoard.prototype.setupByMapSetting = function(setting) {
	if(setting != null) {
		this.setting = setting;
	}
	$(this.idTag).empty();
	this.listCondOpenExit = [];
	this.listCondStageClear = [];
	this.listCondStageFail = [];

	for (key in this.setting) {
		for (keySubItem in this.setting[key]) {
			var callbackFunc = null;
			var condItem = new ObjBehavior(this.setting[key][keySubItem], key);
			switch(key) {
				case 'open_exit_condition':
					this.listCondOpenExit.push(condItem);
					callbackFunc = this.openExit.bind(this);
					break;
				case 'stage_clear_condition':
					this.listCondStageClear.push(condItem);
					callbackFunc = this.clearStage.bind(this);
					break;
				case 'stage_fail_condition':
					this.listCondStageFail.push(condItem);
					callbackFunc = this.loseStage.bind(this);
					break;
			}

			condItem.setMeetBahaviorNextAction(callbackFunc);

			var counter = null;
			switch(condItem.isNeedObjCounter()) {
				case 'COUNTER_INCREASE':
					counter = this.addIncreaseItemCounter(condItem.targetObj, condItem.amount);
					break;
				case 'COUNTER_DECREASE':
					counter = this.addDecreaseCounterItem(condItem.targetObj, condItem.max, condItem.autoCount);
					break;
			}
			if(counter != null) {
				condItem.setCounterTargetObj(counter);
			}
		}
	}
};

ScoreBoard.prototype.addDecreaseCounterItem = function(itemName, maxNo, isAutoCount, callbackFunc) {
	var htmlItem = '<table>' + 
	               '<tr><td>' + 
	               '<img src="' + this.imgFactory.getIconPath(itemName) + '" alt="Smiley face" height="70" width="70"></td><td>' + 
	               '<div class="clock" id="counter_decrease_' + itemName + '"></div>' + 
	               '</td></tr></table>';
	if(itemName == 'TIME'){
		$(this.idTag).prepend(htmlItem);
	}
	else {
		$(this.idTag).append(htmlItem);
	}
	var counterDecrease = new Counter("#counter_decrease_" + itemName, callbackFunc);
	counterDecrease.initialCounter(maxNo, isAutoCount);
	return counterDecrease;
};

ScoreBoard.prototype.addIncreaseItemCounter = function(itemName, maxNo, callbackFunc) {
	$(this.idTag).append('<table>' +
						 '<tr>'+
			             '<td><img src="' + this.imgFactory.getIconPath(itemName) +'" alt="Smiley face" height="50" width="70"></td>' +
						 '<td><div class="clock" id="counter_curNum_' + itemName + '"></div></td>' +
						 '<td><div class="myTitle">/</div></td>' +
						 '<td><div class="clock" id="counter_targetNum_' + itemName + '"></div></td>' +
						 '</tr>' +
						 '</table>');
	var counterCurNum = new Counter("#counter_curNum_" + itemName, callbackFunc);
	counterCurNum.initialCounter(0);
	var counterTargetNum =  new Counter("#counter_targetNum_" + itemName);
	counterTargetNum.initialCounter(maxNo);
	return counterCurNum;
};

ScoreBoard.prototype.start = function() {
	var callbackFuncStartAutoCount = function(ele) {
		ele.startAutoCount();
	};
	this.processEachConditionEle(callbackFuncStartAutoCount);
};

ScoreBoard.prototype.processEachConditionEle = function(callbackfuncEle, callbackfuncList) {
	var listTemp = [this.listCondOpenExit, this.listCondStageClear, this.listCondStageFail];
	for (keyList in listTemp) {
		for(keyEle in listTemp[keyList]) {
			callbackfuncEle(listTemp[keyList][keyEle]);
		}
		if(callbackfuncList != null) {
			callbackfuncList(listTemp[keyList]);
		}
	}
};

ScoreBoard.prototype.processEvent = function(event) {
	var callbackFuncCheckEvent = function(ele) {
		ele.checkEventAddOneToCounterTargetObj(event);
	};
	var callbackFuncCheckListArrive = function(list) {
		var isAllArrive = true;
		var getFirstEle = null;
		for(keyEle in list) {
			getFirstEle = list[keyEle];
			if(!list[keyEle].checkArriveGoal()) {
				isAllArrive = false;
				break;
			}
		}
		if(isAllArrive && getFirstEle != null) {
			getFirstEle.callNextAction();
		}
	}
	this.processEachConditionEle(callbackFuncCheckEvent, callbackFuncCheckListArrive.bind(this));
};

ScoreBoard.prototype.openExit = function() {
	var listObj = this.mapFactory.getAllOfObj('EXIT');
	for(key in listObj) {
		if(!listObj[key].isOpenExit()) {
			listObj[key].triggerOpening();
		}
	}
};

ScoreBoard.prototype.clearStage = function() {
	this.gameFrame.slotGoNextStep();
};

ScoreBoard.prototype.loseStage = function() {

};