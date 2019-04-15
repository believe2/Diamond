var ScoreBoard = function(idTag) {
	this.idTag = idTag;
	this.listItem = [];
};

ScoreBoard.prototype.initialObj = function() {
	
};

ScoreBoard.prototype.setupByMapSetting = function(setting) {
	console(setting);
	for (key in setting) {
		switch (key) {
			case 'time_limit':
				this.addTimeItem(setting[key].maxTime);
				break;
			default:
				this.addStageClearConditionItem(setting[key].itemName, setting[key].maxNo);
				break;
		}
	}
};

ScoreBoard.prototype.addTimeItem = function(maxTime, callbackFuncTimeOver) {
	$(this.idTag).append('<table>' + 
		                 '<tr><td>' + 
		                 '<img src="icon/clock.png" alt="Smiley face" height="70" width="70"></td><td>' + 
		                 '<div class="clock" id="clock_time"></div>' + 
		                 '</td></tr></table>');
	var clockTime = new Counter("#clock_time", callbackFuncTimeOver);
	clockTime.initialCounter(maxTime, true);
	clockTime.start();
	this.listItem.push(clockTime);
};

ScoreBoard.prototype.addStageClearConditionItem = function(itemName, maxNo, iconImg) {
	$(this.idTag).append('<table>' +
						 '<tr>'+
			             '<td><img src="' + iconImg +'" alt="Smiley face" height="50" width="70"></td>' +
						 '<td><div class="clock" id="clock_curNum_' + itemName + '"></div></td>' +
						 '<td><div class="myTitle">/</div></td>' +
						 '<td><div class="clock" id="clock_targetNum_' + itemName + '"></div></td>' +
						 '</tr>' +
						 '</table>');
	var clockCurNum = new Counter("#clock_curNum_" + itemName);
	clockCurNum.initialCounter(0);
	var clockTargetNum =  new Counter("#clock_targetNum_" + itemName);
	clockTargetNum.initialCounter(maxNo);
	this.listItem.push(clockCurNum);
};

ScoreBoard.prototype.update = function(item) {

};