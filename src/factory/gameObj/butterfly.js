var Butterfly = function (args) {
	MonsterCube.call(this, args);
	this.listImage = ['butterfly1.png', 'butterfly2.png', 'butterfly3.png'];
	this.listCanPass = ['ROAD'];
	this.burst = {source: ['GREEN_WATER'], type: this.burstType['3x3_GRID'], prod: 'DIAMOND'};
};

Butterfly.prototype = Object.create(MonsterCube.prototype);
Butterfly.prototype.superClass = Object.create(MonsterCube.prototype);
Butterfly.prototype.constructor = Butterfly;