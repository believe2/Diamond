var Stone = function(args) {
	BaseObject.call(this, args);

	this.listImage = ['stone.png'];
	this.listFallBurstObj = ['MONSTER_CUBE', 'BUTTERFLY', 'MASTER'];
	this.listFallMeetObjCanGoLRSide = ['STONE_WALL', 'STONE', 'DIAMOND'];
	this.fallArgs = {speed: 900, checkFrequency: 225};

	this.moveFalling = this.actionFactory.create({actionType: 'MOVE_FALLING', 
		                                          mainObj: this,
		                                          fallArgs: this.fallArgs
		                                        });
	this.meetCheckBurstOtherObject = this.actionFactory.create({actionType: 'MEET_CHECK_BURST_OTHER_OBJ',
					                                            mainObj: this
					                                           });

	this.registerAction(0, this.fallArgs.checkFrequency, this.moveFalling.doAction.bind(this.moveFalling));
	this.registerAction(1, 100, this.meetCheckBurstOtherObject.doAction.bind(this.meetCheckBurstOtherObject));

};

Stone.prototype = Object.create(BaseObject.prototype);
Stone.prototype.superClass = Object.create(BaseObject.prototype);
Stone.prototype.constructor = Stone;

Stone.prototype.getBurstOtherObject = function() {
	var checkPos = new Position(this.curPos.x, this.curPos.y + 1);
	var listBurstTargetObj = []
	var index = 0;
	while(index < this.listFallBurstObj.length) {
		if(this.moveFalling.fallDirection != null) {
			var getTargetEle = this.map.getEle(checkPos)
			if(getTargetEle != null && getTargetEle.getId() == this.listFallBurstObj[index]) {
				listBurstTargetObj.push(getTargetEle);
			}
		}
		index = index + 1;
	}
	return listBurstTargetObj;
};

Stone.prototype.isCanFallToLRSide = function() {
	var downObjId = this.map.getEleId(new Position(this.curPos.x, this.curPos.y + 1));
	var index = 0, isOk = false;
	while(!isOk && index < this.listFallMeetObjCanGoLRSide.length) {
		if(this.listFallMeetObjCanGoLRSide[index] == downObjId) {
			isOk = true;
		}
		index = index + 1;
	}
	return isOk;
};