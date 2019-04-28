var Counter = function (idTag, funcStopAction) {
	this.idTag = idTag;
	this.clockTimer = null;
	this.funcStopAction = funcStopAction;
	this.startNum = 0;
};

Counter.prototype.initialCounter = function(startNum, isCountDown) {
	var self = this;
	$(self.idTag).empty();
	self.startNum = startNum;
	self.isCountDown = isCountDown;
	self.clockTimer = $(self.idTag).FlipClock(self.startNum, {
		clockFace: 'Counter',
		autoStart: false,
		countdown: isCountDown,
	});
};

Counter.prototype.start = function() {
	var self = this;
	self.stop();
	$(self.idTag).empty();
	self.clockTimer = new FlipClock($(self.idTag), self.startNum, {
		clockFace: 'Counter',
		autoStart: true,
		countdown: self.isCountDown,
		callbacks: {
			start: function() {
				console.log('start');
			},
        	stop: function() {
        		if(self.funcStopAction != null && self.clockTimer.getTime() < 1) {
        			self.funcStopAction();
        		}
        	}
        }
	});
};

Counter.prototype.stop = function() {
	if(self.clockTimer != null) {
		self.clockTimer.reset(null);
		self.clockTimer.stop();
	}
};

Counter.prototype.increase = function() {
	this.clockTimer.increment();
};

Counter.prototype.setValue = function(num) {
	this.clockTimer.setValue(num);
}

Counter.prototype.getCurTime = function() {
	return this.clockTimer.getTime();
}