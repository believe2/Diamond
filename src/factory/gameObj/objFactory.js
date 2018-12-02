 var ObjFactory = function (imgFactory, map) {
 	this.imgFactory = imgFactory;
 	this.map = map;
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
 		'ROAD': 		{builder: Road, type: {dim: "FLOOR"}},
 		'SAND': 		{builder: Sand, type: {dim: "OBJECT"}},
 		'STONE': 		{builder: Stone, type: {dim: "OBJECT"}},
 		'STONE_WALL': 	{builder: StoneWall, type: {dim: "OBJECT"}},
 		'DIAMOND': 		{builder: Diamond, type: {dim: "OBJECT"}},
 		'STRETCH_WALL': {builder: StretchWall, type: {dim: "OBJECT"}},
 		'MAGIC_WALL': 	{builder: MagicWall, type: {dim: "OBJECT"}},
 		'GREEN_WATER':  {builder: GreenWater, type: {dim: "OBJECT"}},
 		'BURST_AREA':   {builder: BurstArea, type: {dim: "OBJECT"}},
 		'MONSTER_CUBE': {builder: MonsterCube, type: {dim: "OBJECT"}},
 		'TILE':   		{builder: Tile, type: {dim: "OBJECT"}},
 		'BUTTERFLY':    {builder: Butterfly, type: {dim: "OBJECT"}},
 		'MASTER':       {builder: Master, type: {dim: "OBJECT"}},
 		'EXIT':         {builder: Exit, type: {dim: "OBJECT"}}
 	};
 };

 ObjFactory.prototype.setActionFactory = function(actionFactory) {
 	this.actionFactory = actionFactory;
 };

 ObjFactory.prototype.create = function(args) {
 	var target = null;
 	var obj = null;

 	if(this.mapNameToInfo[args.id] != null) {
 		target = this.mapNameToInfo[args.id];
 	}
 	else if(this.listObj[args.id] != null && this.mapNameToInfo[this.listObj[args.id]] != null) {
 		target = this.mapNameToInfo[this.listObj[args.id]];
 		args.id = this.listObj[args.id];
 	}
 	if(target != null) {
 		args.type = target.type;
 		args.map = this.map;
 		args.actionFactory = this.actionFactory;
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
 }

 ObjFactory.prototype.getNumById = function(id) {
 	for(key in this.listObj) {
 		if(this.listObj[key] == id) {
 			return key;
 		}
 	}
 	return null;
 }