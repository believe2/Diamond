var MapFileProcessor = function (listMapFactory, objectSetting) {
	this.listMapFactory = listMapFactory;
	this.listMapRawData = [];

	this.objectSetting = objectSetting;
	this.rawObjSetting = null;
};

MapFileProcessor.prototype._splitMap = function(orgMap) {
	var space = new Space();
	var row = orgMap.length;
	var col = orgMap[0].length;
	var mapSplit = {floorMap: space.gen2DimArray(row, col), objMap: space.gen2DimArray(row, col)};
	var indexRow = 0;
	while(indexRow < row) {
		var indexCol = 0;
		while(indexCol < col) {
			var eleSplit = orgMap[indexRow][indexCol].split(",");
			mapSplit.floorMap[indexRow][indexCol] = Number(eleSplit[0]);
			mapSplit.objMap[indexRow][indexCol] = Number(eleSplit[1]);
			indexCol = indexCol + 1;
		}
		indexRow = indexRow + 1;
	}
	return mapSplit;
};

MapFileProcessor.prototype._combineMap = function(listSubMap) {
	var space = new Space();
	var row = listSubMap.floorMap.length;
	var col = listSubMap.floorMap[0].length;
	var mapCombine = space.gen2DimArray(row, col);
	var indexRow = 0;
	while(indexRow < row) {
		var indexCol = 0;
		while(indexCol < col) {
			mapCombine[indexRow][indexCol] = listSubMap.floorMap[indexRow][indexCol] + ",";
			mapCombine[indexRow][indexCol] = mapCombine[indexRow][indexCol] + listSubMap.objMap[indexRow][indexCol] + "";
			indexCol = indexCol + 1;
		}
		indexRow = indexRow + 1;
	}
	return mapCombine;
};

MapFileProcessor.prototype.loadMapFromFile = function(filePath, funcCallback, flag) {
	var self = this;
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	var jsonObj = JSON.parse(this.responseText);
        	if(flag == null) {
	        	self.loadMapJsonObj(jsonObj);
	        }
        	funcCallback(jsonObj);
        }
    };
    xmlhttp.open("GET", "src/php/loadFromFile.php?filePath=" + filePath, true);
    xmlhttp.send();
};

MapFileProcessor.prototype.loadMapJsonObj = function(jsonObj) {
	var tampListMap = this._splitMap(jsonObj.map_element);
	for(var key in tampListMap) {
		this.listMapRawData[key] = tampListMap[key];
	}
	this.rawObjSetting = jsonObj;
	delete this.rawObjSetting.map_element;
};

MapFileProcessor.prototype.reloadRawFile = function() {
	for(var key in this.listMapRawData) {
		this.listMapFactory[key].loadGivenMap(this.listMapRawData[key]);
	}
	this.objectSetting.initial(this.rawObjSetting);
};

MapFileProcessor.prototype.getWidth = function(mapType) {
	return this.listMapFactory[mapType].getMaxX() + 1;
};

MapFileProcessor.prototype.getHeight = function(mapType) {
	return this.listMapFactory[mapType].getMaxY() + 1;
};

MapFileProcessor.prototype.changeMapDimension = function(width, height, idToNoTransformator, args, objFactory) {
	for(var key in this.listMapFactory) {
		this.listMapFactory[key].changeMapDimension(width, height, idToNoTransformator, args, objFactory);
	}
};

MapFileProcessor.prototype.getSnapshot = function(idToNoTransformator) {
	var listSubMapSnapshot = [];
	for(var key in this.listMapFactory) {
		listSubMapSnapshot[key] = this.listMapFactory[key].getSnapshot(idToNoTransformator);
	}
	return this._combineMap(listSubMapSnapshot);
};

MapFileProcessor.prototype.setEle = function(mapId, pos, ele) {
	var index = 0;
	var isFound = false;
	while(!isFound && index < this.listMapFactory.length) {
		if(this.listMapFactory.getId() == mapId) {
			this.listMapFactory.setEle(pos, ele)
			isFound = true;
		}
		index = index + 1;
	}
};

MapFileProcessor.prototype.getEle = function(mapId, pos) {
	var index = 0;
	var isFound = false;
	var ele = null;
	while(!isFound && index < this.listMapFactory.length) {
		if(this.listMapFactory.getId() == mapId) {
			ele = this.listMapFactory.getEle(pos);
			isFound = true;
		}
		index = index + 1;
	}
	return ele;
};