var GreenWater = function (args) {
	BaseObject.call(this, args);

	this.listImage = ['green1.jpg', 'green2.jpg', 'green3.jpg', 'green4.jpg', 'green5.jpg'];
	this.listCanPass = ['SAND'];
	this.fullProd = 'DIAMOND';
	this.triggerFreq = 250;

	this.isNeedAbstractObjInMap = true;

	this.ARGS_MIN_SPREAD_TIME = 5;
	this.ARGS_MAX_SPREAD_TIME = 45;
	this.ARGS_MIN_SPREAD_NUM = 1;
	this.ARGS_MAX_SPREAD_NUM = 5;

	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	this.genObjSpread = this.actionFactory.create({actionType: 'GENOBJ_SPREAD',  
		                                           mainObj: this,
		                                           nextAction: this.turnToDiamond.bind(this)
		                                         });
	this.registerAction(1, 800, this.animateGameObject.doAction.bind(this.animateGameObject));
	this.registerAction(1001, this.triggerFreq, this.genObjSpread.doAction.bind(this.genObjSpread));
};

GreenWater.prototype = Object.create(BaseObject.prototype);
GreenWater.prototype.superClass = Object.create(BaseObject.prototype);
GreenWater.prototype.constructor = GreenWater;

GreenWater.prototype.getTriggerFreq = function() {
	return this.triggerFreq;
};

GreenWater.prototype.turnToDiamond = function() {
	this.stopAction('ALL');
	var listObj = this.map.getAllOfObj(this.getId());
	var index = 0, listPos = [];
	while(index < listObj.length) {
		listPos.push(listObj[index].getCurPos());
		index = index + 1;
	}
	var parms = {objType: this.fullProd, 
	             pos: listPos, 
	             createType: "MULTI", 
	             isStartAction: true,
	             isCheckPassby: false
	            };
	this.animateGameObject.eventQueueHandler.throwEvent('EVENT_GAME_OBJ_CREATION', null, null, parms);
};

GreenWater.prototype.setExtraSetting = function(args) {
	this.ARGS_MIN_SPREAD_TIME = args.min_spread_time;
	this.ARGS_MAX_SPREAD_TIME = args.max_spread_time;
	this.ARGS_MIN_SPREAD_NUM = args.min_spread_num;
	this.ARGS_MAX_SPREAD_NUM = args.max_spread_num;
	this.genObjSpread.resetSpreadArgs();
};

GreenWater.prototype.getExtraSetting = function() {
	return {
		min_spread_time: this.ARGS_MIN_SPREAD_TIME,
		max_spread_time: this.ARGS_MAX_SPREAD_TIME,
		min_spread_num: this.ARGS_MIN_SPREAD_NUM,
		max_spread_num: this.ARGS_MAX_SPREAD_NUM
	};
};