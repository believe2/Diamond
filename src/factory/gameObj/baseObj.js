var BaseObject = function (args) {
	this.burstType = {
 		'3x3_GRID': [{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1},{x: -1, y: 0},{x: 0, y: 0},{x: 1, y: 0},{x: -1, y: 1},{x: 0, y: 1},{x: 1, y: 1}]
 	};

 	this.actionFactory = args.actionFactory;
 	this.map = args.map;
 	this.gamePanel = args.gamePanel;

 	this.isDelObj = false;
	
	this.GEN_WAY_INITIAL = 0;
	this.GEN_WAY_FROM_OBJECT = 1;
	this.GEN_WAY_ABSTRACT = 2;

	this.COUNTER_MAX = 5;
	this.CYCLE_TRIGER = 200;

	this.curPos = args.pos;
	this.curImage = 0;
	this.id = args.id;
	this.genWay = this.GEN_WAY_INITIAL;
	this.listCanPass = args.listCanPass;
	
	this.burst = args.burst;
	this.mapRegisteredAction = [];
	this.mapStartAction = [];

	this.mapRegisteredFunc = [];

	this.isNeedAbstractObjInMap = false;

	this.dkCounter = new DeLockCounter(this.COUNTER_MAX);

	this.funcGetObjInfoByPos = args.bindFuncGetObjInfoByPos;
};

//load each image through given imageFactory based on setted image name in listImage
BaseObject.prototype.setListImageByImageFactory = function(imgFactory) {
	var index = 0;
 	while(index < this.listImage.length) {
 		this.listImage[index] = imgFactory.load(this.listImage[index]);
 		index = index + 1;
 	}
};

//get current image
BaseObject.prototype.getCurImg = function() {
	return this.listImage[this.curImage];
};

//set next image
BaseObject.prototype.setNextImg = function() {
	this.curImage = (this.curImage + 1) % this.listImage.length;
};

//get current position
BaseObject.prototype.getCurPos = function() {
	return this.curPos;
};

//get id referring this object
BaseObject.prototype.getId = function() {
	return this.id;
};

BaseObject.prototype.getType = function(whichType) {
	return this.type[whichType];
};

BaseObject.prototype.getGenWay = function() {
	return this.genWay;
};

BaseObject.prototype.genObjBeforeArea = function() {
	return null;
}

BaseObject.prototype.setGenWay = function(setGenWay) {
	this.genWay = setGenWay;
};

//check this position whether this object can go through
BaseObject.prototype.isPassby = function(pos) {
	var objInfo = this.funcGetObjInfoByPos(pos);
	var isOk = false;
	if(objInfo == null) {
		isOk = true;
	}
	else if(objInfo != "ERROR"){
		if(this.listCanPass != null) {
			if(this.listCanPass[0] == 'ALL') {
				var index = 1;
				isOk = true;
				while(isOk && index < this.listCanPass.length) {
					if(this.listCanPass[index] == objInfo.id) {
						isOk = false;
					}
					index = index + 1;
				}
			}
			else {
				var index = 0;
				if(this.listCanPass != null && objInfo != null) {
					while(!isOk && index < this.listCanPass.length) {
						if(this.listCanPass[index] == objInfo.id) {
							isOk = true;
						}
						index = index + 1;
					}
				}
			}
		}
	}
	return isOk;
};

BaseObject.prototype.getPosCanPass = function() {
	var listCanPass = [];
	var posGenerator = new PosGenerator();
	var listCheckPos = posGenerator.posCenterCrossShape(this.curPos);
	var index = 0;
	while(index < listCheckPos.length) {
		if(this.isPassby(listCheckPos[index])) {
			listCanPass.push(listCheckPos[index]);
		}
		index = index + 1;
	}
	return listCanPass;
};

BaseObject.prototype.isTouchObj = function(objId) {
	var posGenerator = new PosGenerator();
	var listCheckPos = posGenerator.posCenterCrossShape(this.curPos);
	var index = 0;
	var isTouch = false;
	while(!isTouch && index < listCheckPos.length) {
		if(this.funcGetObjInfoByPos(listCheckPos[index]) != null && this.funcGetObjInfoByPos(listCheckPos[index]).id == objId) {
			isTouch = true;
		}
		index = index + 1;
	}
	return isTouch;
}

//update to next position and image of object (new position, index number of iamge in listImage)
BaseObject.prototype.update = function(nextPos, nextImage) {
	if(nextPos != null) {
		this.curPos = nextPos;
	}
	if(nextImage != null) {
		this.curImage = nextImage;
	}
};

BaseObject.prototype.deLockRun = function(judgeResult, funcDeLockRun, args) {
	if(judgeResult == null) {
		this.dkCounter.setLock(true);
	}
	else {
		if(this.dkCounter.isLock()) {
			this.dkCounter.setLock(false);
		}
		if(this.dkCounter.add()) {
			funcDeLockRun(args);
		}
	}
};

BaseObject.prototype.registerFunc = function(id, func) {
	this.mapRegisteredFunc[id] = func;
};

BaseObject.prototype.callFunc = function(id, args) {
	var func = this.mapRegisteredFunc[id];
	if(func != null) {
		func(args);
	}
};

//register new action for this object (register ID, run cycle, run function)
BaseObject.prototype.registerAction = function(id, cycle, funcAction) {
	this.mapRegisteredAction[id] = {cycle: cycle, funcAction: funcAction};
};

//start new action registered in mapRegisteredAction (action ID)
BaseObject.prototype.startAction = function(id) {
	if(id == 'ALL') {
		var iterator = Object.keys(this.mapRegisteredAction);
		var index = 0;
		while(index < iterator.length) {
			var getKey = iterator[index];
			if(this.mapStartAction[getKey] == null) {
				var isStart = false;
				switch(this.genWay) {
					case this.GEN_WAY_ABSTRACT:
						if(getKey > 1000) {
							isStart = true;
						}
						break;
					default:
						if(getKey <= 1000) {
							isStart = true;
						}
						break;
				}
				if(isStart) {
					this.mapStartAction[getKey] = setInterval(this.mapRegisteredAction[getKey].funcAction, this.mapRegisteredAction[getKey].cycle);
				}
			}
			index = index + 1;
		}
	}
	else if(this.mapStartAction[id] == null && this.mapRegisteredAction[id] != null) {
		this.mapStartAction[id] = setInterval(this.mapRegisteredAction[id].funcAction, this.mapRegisteredAction[id].cycle);
	}
};

//stop running action in mapStartAction (action ID)
BaseObject.prototype.stopAction = function(id) {
	if(this.mapStartAction[id] != null) {
		clearInterval(this.mapStartAction[id]);
		this.mapStartAction[id] = null;
	}
	else if(id == 'ALL'){
		var iterator = Object.keys(this.mapStartAction);
		var index = 0;
		while(index < iterator.length) {
			var getKey = iterator[index];
			clearInterval(this.mapStartAction[getKey]);
			index = index + 1;
		}
		this.mapStartAction = [];
	}
};

BaseObject.prototype.getIsDelObj = function() {
	return this.isDelObj;
};

BaseObject.prototype.setIsDelObj = function(isDelObj) {
	this.isDelObj = isDelObj;
};

BaseObject.prototype.getIsNeedAbstractObjInMap = function() {
	return this.isNeedAbstractObjInMap;
};