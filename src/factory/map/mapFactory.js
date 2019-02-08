var MapFactory = function(mapId) {
	this.mapFileProcessor = new MapFileProcessor();
	this.mapId = mapId;
	this.mapExpandDefaultEleId = -1;
	this.mapRawData = null;
	this.map = null;
	this.objFactory = null;
	this.listAbstractObj = [];
	this.stepSetting = null;
};

MapFactory.prototype.setObjFactory = function(objFactory) {
	this.objFactory = objFactory;
};

MapFactory.prototype.getMapId = function() {
	return this.mapId;
};

MapFactory.prototype.getMapLevelNo = function() {
	return Object.keys(this.map).length;
};

MapFactory.prototype.loadStepInfoFromFile = function(filePath, callBackFunc) {
	var callBackFuncResetData = function(listMapRawData, otherStepSetting) {
		this.mapRawData = listMapRawData;
		this.stepSetting = otherStepSetting;
		callBackFunc(this.mapRawData, this.stepSetting);
	};
	this.mapFileProcessor.loadMapFromFile(filePath, callBackFuncResetData.bind(this));
};

MapFactory.prototype.loadGivenMap = function(rawMap) {
	this._map = rawMap;
	this.width = rawMap[0].length;
	this.height = rawMap.length;
};

MapFactory.prototype.static_getObjInfo = function(pos) {
	var obj = this.getEle(pos);
	if(obj != null) {
		return {id: obj.getId(),
				genWay: obj.getGenWay(),
				funcIsPassby: obj.isPassby.bind(obj),
				funcPosCanPassby: obj.getPosCanPass.bind(obj),
				funcIsFalling: obj.isFalling != null ? obj.isFalling.bind(obj) : null};
	}
	else if(!this.isInMapBoundary(pos)) {
		return "ERROR";
	}
	else {
		return null;
	}
};

MapFactory.prototype.createObjByMap = function(objFactory, args) {
	this.map = [];
	for(keyMap in this.mapRawData) {
		var width = this.mapRawData[keyMap][0].length;
		var height = this.mapRawData[keyMap].length;
		this.map[keyMap] = (new Space()).gen2DimArray(height, width);
		this.listAbstractObj = [];
		var indexX = 0;
		while(indexX < width){
			var indexY = 0;
			while(indexY < height) {
				var pos = new Position(indexX, indexY, keyMap);
				var value = this.mapRawData[keyMap][pos.y][pos.x];
				args.id = value;
				args.pos = pos;
				var obj = objFactory.create(args);
				this.setEle(pos, obj);
				if(obj != null && obj.getIsNeedAbstractObjInMap()) {
					this.setAbstractEle(obj.getId());
				}
				indexY = indexY + 1;
			}
			indexX = indexX + 1;
		}
	}
};

MapFactory.prototype.isInMapBoundary = function(pos) {
	return (pos != null && this.map != null) &&
		   (pos.x > -1 && pos.x < this.map[pos.z][0].length) &&
		   (pos.y > -1 && pos.y < this.map[pos.z].length);
};

MapFactory.prototype.getEle = function(pos) {
	if(this.isInMapBoundary(pos)) {
		return this.map[pos.z][pos.y][pos.x];
	}
	else {
		return null;
	}
};

MapFactory.prototype.getEleId = function(pos) {
	if(this.isInMapBoundary(pos) && this.map[pos.y][pos.x] != null) {
		return this.map[pos.y][pos.x].getId();
	}
	else {
		return null;
	}
}

MapFactory.prototype.getOneOfObj = function(objId) {
	var indexX = 0;
	var result = null;
	while(result == null && indexX <= this.getMaxX()){
		var indexY = 0;
		while(result == null && indexY <= this.getMaxY()) {
			var pos = new Position(indexX, indexY);
			var obj = this.getEle(pos);
			if(obj != null && obj.getId() == objId) {
				result = obj;
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	return result;
};

MapFactory.prototype.getAllOfObj = function(objId) {
	var indexX = 0;
	var result = [];
	while(indexX <= this.getMaxX()){
		var indexY = 0;
		while(indexY <= this.getMaxY()) {
			var pos = new Position(indexX, indexY);
			var obj = this.getEle(pos);
			if(obj != null && obj.getId() == objId) {
				result.push(obj);
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	return result;
};

MapFactory.prototype.setEle = function(pos, ele) {
	if(pos != null) {
		if(ele != null) {
			ele.update(pos, null);
		}
		this.map[pos.z][pos.y][pos.x] = ele;
	}
};

MapFactory.prototype.setAbstractEle = function(eleId) {
	if(this.listAbstractObj[eleId] == null) {
		var args = [];
		args.id = eleId;
		args.pos = new Position(-1, -1);
		var ele = this.objFactory.create(args);
		ele.setGenWay(ele.GEN_WAY_ABSTRACT);
		this.listAbstractObj[eleId] = ele;
	}
};

MapFactory.prototype.getListAbstractObj = function() {
	return this.listAbstractObj;
};

MapFactory.prototype.destroyEle = function(pos) {
	var getObj = this.map[pos.y][pos.x];
	if(getObj != null) {
		getObj.stopAction('ALL');
		getObj.setIsDelObj(true);
		delete this.map[pos.y][pos.x];
		this.map[pos.y][pos.x] = null;
	}
};

MapFactory.prototype.getId = function() {
	return this.id;
};

MapFactory.prototype.getMaxX = function() {
	if(this.map == null) {
		return -1;
	}
	return this.map[0][0].length;
};

MapFactory.prototype.getMaxY = function() {
	if(this.map == null) {
		return -1;
	}
	return this.map[0].length;
};

MapFactory.prototype.getAllObjCanPassPos = function(objId) {
	var listPosCanPass = [];
	var indexX = 0;
	while(indexX <= this.getMaxX()){
		var indexY = 0;
		while(indexY <= this.getMaxY()) {
			var pos = new Position(indexX, indexY);
			var ele = this.getEle(pos);
			if(ele != null && ele.getId() == objId) {
				var listPosTemp = ele.getPosCanPass();
				var indexTemp = 0;
				while(indexTemp < listPosTemp.length) {
					var isExist = false;
					var indexCheck = 0;
					while(!isExist && indexCheck < listPosCanPass.length) {
						if(listPosCanPass[indexCheck].x == listPosTemp[indexTemp].x && listPosCanPass[indexCheck].y == listPosTemp[indexTemp].y) {
							isExist = true;
						}
						indexCheck = indexCheck + 1;
					}
					if(!isExist) {
						listPosCanPass.push(listPosTemp[indexTemp]);
					}
					indexTemp = indexTemp + 1;
				}
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	return listPosCanPass;
};

MapFactory.prototype.getSnapshot = function(idToNoTransformator) {
	var snapshot = (new Space()).gen2DimArray(this.getMaxY() + 1, this.getMaxX() + 1);
	var indexX = 0;
	while(indexX <= this.getMaxX()){
		var indexY = 0;
		while(indexY <= this.getMaxY()) {
			var pos = new Position(indexX, indexY);
			var ele = this.getEle(pos);
			if(ele == null) {
				snapshot[indexY][indexX] = -1;
			}
			else {
				snapshot[indexY][indexX] = idToNoTransformator(this.getEle(pos).getId());
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	return snapshot;
};

MapFactory.prototype.changeMapDimension = function(width, height, idToNoTransformator, args, objFactory) {
	var orgMap = this.getSnapshot(idToNoTransformator);
	//process height
	var orgHeight = this.getMaxY() + 1;
	var orgWidth = this.getMaxX() + 1
	if(height > orgHeight) {
		var indexY = orgHeight;
		while(indexY < height) {
			var ele = new Array(orgWidth);
			var indexX = 0;
			while(indexX < orgWidth) {
				ele[indexX] = this.mapExpandDefaultEleId + "";
				indexX = indexX + 1;
			}
			orgMap.push(ele);
			indexY = indexY + 1;
		}
	}
	else if(height < orgHeight) {
		orgMap.splice(height - 1, orgHeight - height);
	}
	//process width
	if(width > orgWidth) {
		var indexY = 0;
		while(indexY < height) {
			var indexX = orgWidth;
			while(indexX < width) {
				orgMap[indexY].push(this.mapExpandDefaultEleId + "");
				indexX = indexX + 1;
			}
			indexY = indexY + 1;
		}
	}
	else if(width < orgWidth) {
		var indexY = 0;
		while(indexY < height) {
			orgMap[indexY].splice(width - 1, orgWidth - width);
			indexY = indexY + 1;
		}
	}
	this._map = orgMap;
	this.width = this._map[0].length;
	this.height = this._map.length;
	this.createObjByMap(objFactory, args);
};