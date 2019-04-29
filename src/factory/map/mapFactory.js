var MapFactory = function(mapId) {
	this.mapFileProcessor = new MapFileProcessor();
	this.mapId = mapId;
	this.mapExpandDefaultEleId = -1;
	this.map = null;
	this.objFactory = null;
	this.listAbstractObj = [];

	this.mapRawData = null;
	this.objSetting = null;
	this.scoreboardSetting = null;
};

MapFactory.prototype.initialObj = function(objFactory) {
	this.objFactory = objFactory;
};

MapFactory.prototype.getMapId = function() {
	return this.mapId;
};

MapFactory.prototype.loadStageInfoFromFile = function(filePath, callBackFunc) {
	var callBackFuncResetData = function(listMapRawData, objSetting, scoreboardSetting) {
		this.mapRawData = listMapRawData;
		this.objSetting = objSetting;
		this.scoreboardSetting = scoreboardSetting;
		callBackFunc(this.mapRawData, this.objSetting, this.scoreboardSetting);
	};
	this.mapFileProcessor.loadMapFromFile(filePath, callBackFuncResetData.bind(this));
};

MapFactory.prototype.createObjByMap = function() {
	var width = this.mapRawData[0][0].length;
	var height = this.mapRawData[0].length;
	var level = Object.keys(this.mapRawData).length;
	this.map = (new Space()).gen3DimArray(height, width, level);
	this.listAbstractObj = [];
	var callbackFuncObjCreation = function(pos, ele) {
		var obj = this.objFactory.create(this.mapRawData[pos.z][pos.y][pos.x]);
		this.setEle(pos, obj);
		if(obj != null && obj.getIsNeedAbstractObjInMap()) {
			this.setAbstractEle(obj.getId());
		}
	};
	this.processMapEle(callbackFuncObjCreation.bind(this));
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
	if(this.isInMapBoundary(pos) && this.map[pos.z][pos.y][pos.x] != null) {
		return this.map[pos.z][pos.y][pos.x].getId();
	}
	else {
		return null;
	}
}

MapFactory.prototype.getOneOfObj = function(objId) {
	var result = null;
	var callbackfuncCheckObj = function(pos, ele) {
		if(ele != null && ele.getId() == objId) {
			result = ele;
		}
	};
	this.processMapEle(callbackfuncCheckObj.bind(this));
	return result;
};

MapFactory.prototype.getAllOfObj = function(objId) {
	var result = [];
	var callbackfuncGetObj = function(pos, ele) {
		if(ele != null && ele.getId() == objId) {
			result.push(ele);
		}
	}
	this.processMapEle(callbackfuncGetObj);
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
		var ele = this.objFactory.create(eleId);
		ele.setGenWay(ele.GEN_WAY_ABSTRACT);
		this.listAbstractObj[eleId] = ele;
	}
};

MapFactory.prototype.getListAbstractObj = function() {
	return this.listAbstractObj;
};

MapFactory.prototype.destroyEle = function(pos) {
	var getObj = this.map[pos.z][pos.y][pos.x];
	if(getObj != null) {
		getObj.stopAction('ALL');
		getObj.setIsDelObj(true);
		delete this.map[pos.z][pos.y][pos.x];
		this.map[pos.z][pos.y][pos.x] = null;
	}
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

MapFactory.prototype.getMapLevelNo = function() {
	if(this.map == null) {
		return -1;
	}
	return this.map.length;
};

MapFactory.prototype.getAllObjCanPassPos = function(objId) {
	var listPosCanPass = [];
	var callBackFuncGetAllObjCanPassPos = function(pos, ele) {
		if(ele != null && ele.getId() == objId) {
			var listCurObjCanPassPos = ele.getPosCanPass();
			var indexTemp = 0;
			while(indexTemp < listCurObjCanPassPos.length) {
				var isExist = false;
				var indexCheck = 0;
				while(!isExist && indexCheck < listPosCanPass.length) {
					if(listPosCanPass[indexCheck].equal(listCurObjCanPassPos[indexTemp])) {
						isExist = true;
					}
					indexCheck = indexCheck + 1;
				}
				if(!isExist) {
					listPosCanPass.push(listCurObjCanPassPos[indexTemp]);
				}
				indexTemp = indexTemp + 1;
			}
		}
	};
	this.processMapEle(callBackFuncGetAllObjCanPassPos.bind(this));
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
	this.createObjByMap(args);
};

MapFactory.prototype.processMapEle = function(callBackFuncEle, isProcessAbstractEle) {
	//process each element in MAP
	var mapWidth = this.getMaxX();
	var mapHeight = this.getMaxY();
	var mapLevelNo = this.getMapLevelNo();
	var indexX = 0, indexY = 0, indexLv = 0;
	while(indexX < mapWidth){
		var indexY = 0;
		while(indexY < mapHeight) {
			indexLv = 0;
			while(indexLv < mapLevelNo){
				var pos = new Position(indexX, indexY, indexLv);
				var ele = this.getEle(pos);
				callBackFuncEle(pos, ele);
				indexLv = indexLv + 1;
			}
			indexY = indexY + 1;
		}
		indexX = indexX + 1;
	}
	//process each abstract element
	if(isProcessAbstractEle) {
		for(keys in this.listAbstractObj) {
			callBackFuncEle('OBJ_OBSTRACT', this.listAbstractObj[keys]);
		}
	}
};