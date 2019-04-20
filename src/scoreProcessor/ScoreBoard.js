var ScoreBoard = function(idTag) {
	this.imgFactory = null;
	this.idTag = idTag;
	this.listCondOpenExit = null;
	this.listCondStageClear = null;
	this.listCondStageFail = null;
};

ScoreBoard.prototype.initialObj = function(imgFactory) {
	this.imgFactory = imgFactory;
};

ScoreBoard.prototype.setupByMapSetting = function(setting) {
	console.log(setting);
	$(this.idTag).empty();
	this.listCondOpenExit = [];
	this.listCondStageClear = [];
	this.listCondStageFail = [];

	for (key in setting) {
		switch (key) {
			case 'time_limit':
				this.addTimeItem(setting[key]);
				break;
			default:
				for (keySubItem in setting[key]) {
					var condItem = new ObjBehavior(setting[key][keySubItem]);
					switch(keySubItem) {
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
					if(condItem.isNeedObjCounter()) {
						this.addItemCounter(condItem.targetObj, condItem.amount);
					}
				}
				break;
		}
	}
};

ScoreBoard.prototype.addTimeItem = function(maxTime, callbackFuncTimeOver) {
	$(this.idTag).append('<table>' + 
		                 '<tr><td>' + 
		                 '<img src="' + this.imgFactory.getIconPath('clock') + '" alt="Smiley face" height="70" width="70"></td><td>' + 
		                 '<div class="clock" id="clock_time"></div>' + 
		                 '</td></tr></table>');
	var clockTime = new Counter("#clock_time", callbackFuncTimeOver);
	clockTime.initialCounter(maxTime, true);
	return clockTime;
};

ScoreBoard.prototype.addItemCounter = function(itemName, maxNo) {
	$(this.idTag).append('<table>' +
						 '<tr>'+
			             '<td><img src="' + this.imgFactory.getIconPath(itemName) +'" alt="Smiley face" height="50" width="70"></td>' +
						 '<td><div class="clock" id="clock_curNum_' + itemName + '"></div></td>' +
						 '<td><div class="myTitle">/</div></td>' +
						 '<td><div class="clock" id="clock_targetNum_' + itemName + '"></div></td>' +
						 '</tr>' +
						 '</table>');
	var clockCurNum = new Counter("#clock_curNum_" + itemName);
	clockCurNum.initialCounter(0);
	var clockTargetNum =  new Counter("#clock_targetNum_" + itemName);
	clockTargetNum.initialCounter(maxNo);
	return clockCurNum;
};

ScoreBoard.prototype.update = function(item) {

};