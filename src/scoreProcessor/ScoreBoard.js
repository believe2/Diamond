var ScoreBoard = function(idTag) {
	this.setting = null;
	this.imgFactory = null;
	this.idTag = idTag;
	this.listCondOpenExit = null;
	this.listCondStageClear = null;
	this.listCondStageFail = null;
};

ScoreBoard.prototype.initialObj = function(imgFactory, eventQueueHandler) {
	this.imgFactory = imgFactory;
	this.eventQueueHandler = eventQueueHandler;
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
			var condItem = new ObjBehavior(this.setting[key][keySubItem]);
			switch(key) {
				case 'open_exit_condition':
					this.listCondOpenExit.push(condItem);
					break;
				case 'stage_clear_condition':
					this.listCondStageClear.push(condItem);
					break;
				case 'stage_fail_condition':
					this.listCondStageFail.push(condItem);
					break;
			}
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

ScoreBoard.prototype.processEachConditionEle = function(callbackfunc) {
	var listTemp = [this.listCondOpenExit, this.listCondStageClear, this.listCondStageFail];
	for (keyList in listTemp) {
		for(keyEle in listTemp[keyList]) {
			callbackfunc(listTemp[keyList][keyEle]);
		}
	}
}

ScoreBoard.prototype.processEvent = function(event) {

};