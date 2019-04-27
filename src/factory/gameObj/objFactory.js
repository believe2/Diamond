var ObjFactory = function () {
 	this.imgFactory = null;
 	this.actionFactory = null;
 	this.map = null;
 	this.gamePanel = null;

 	this.listObj = {
 		0: 'ROAD',
 		1: 'SAND',
 		2: 'STONE',
 		3: 'STONE_WALL',
 		4: 'DIAMOND',
 		5: 'STRETCH_WALL',
 		6: 'MAGIC_WALL',
 		7: 'GREEN_WATER',
 		8: "BURST_AREA",
 		9: "MONSTER_CUBE",
 		10:"TILE",
 		11:"BUTTERFLY",
 		12:"MASTER",
 		13:"EXIT"
 	};
 	this.mapNameToInfo = {
 		'ROAD': 		{builder: Road},
 		'SAND': 		{builder: Sand},
 		'STONE': 		{builder: Stone},
 		'STONE_WALL': 	{builder: StoneWall},
 		'DIAMOND': 		{builder: Diamond},
 		'STRETCH_WALL': {builder: StretchWall},
 		'MAGIC_WALL': 	{builder: MagicWall},
 		'GREEN_WATER':  {builder: GreenWater},
 		'BURST_AREA':   {builder: BurstArea},
 		'MONSTER_CUBE': {builder: MonsterCube},
 		'TILE':   		{builder: Tile},
 		'BUTTERFLY':    {builder: Butterfly},
 		'MASTER':       {builder: Master},
 		'EXIT':         {builder: Exit}
 	};
};

ObjFactory.prototype.initialObj = function(gamePanel, imgFactory, mapFactory, actionFactory) {
 	this.gamePanel = gamePanel;
 	this.imgFactory = imgFactory;
 	this.map = mapFactory;
 	this.actionFactory = actionFactory;
};

ObjFactory.prototype.initialNoForEachObj = function() {
	for (key in this.mapNameToInfo) {
		this.mapNameToInfo[key].no = 0;
	}
};

ObjFactory.prototype.create = function(objId) {
 	var target = null;
 	var obj = null;
 	var args = {id: objId};

 	if(this.mapNameToInfo[args.id] != null) {
 		target = this.mapNameToInfo[args.id];
 	}
 	else if(this.listObj[args.id] != null && this.mapNameToInfo[this.listObj[args.id]] != null) {
 		target = this.mapNameToInfo[this.listObj[args.id]];
 		args.id = this.listObj[args.id];
 	}
 	if(target != null) {
 		args.subId = this.mapNameToInfo[args.id].no;
 		this.mapNameToInfo[args.id].no = this.mapNameToInfo[args.id].no + 1;

 		args.map = this.map;
 		args.actionFactory = this.actionFactory;
 		args.gamePanel = this.gamePanel;
 		obj = new target.builder(args);
 		obj.setListImageByImageFactory(this.imgFactory);
 	}
 	return obj;
};

ObjFactory.prototype.getAllTypeOfObj = function() {
 	var list = [];
 	for(key in this.listObj) {
 		var ele = {num: key, type: this.mapNameToInfo[this.listObj[key]].type, 
 				   id: this.listObj[key], listImage: this.mapNameToInfo[this.listObj[key]].listImage};
 		list.push(ele);
 	}
 	return list;
};