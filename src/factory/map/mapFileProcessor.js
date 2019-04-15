var MapFileProcessor = function () {
	this.listMapRawData = [];
	this.objSetting = null;
	this.scoreboardSetting = null;
};

MapFileProcessor.prototype._preprocess = function(mapGroup) {
	for(var keyMapGroup in mapGroup) {
		var specificMap = mapGroup[keyMapGroup];
		var row = 0;
		while(row < specificMap.length) {
			var col = 0;
			while(col < specificMap[row].length) {
				specificMap[row][col] = Number(specificMap[row][col]);
				col = col + 1;
			}
			row = row + 1;
		}
	}
	return mapGroup;
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
        	funcCallback(self.listMapRawData, self.objSetting, self.scoreboardSetting);
        }
    };
    xmlhttp.open("GET", "src/php/loadFromFile.php?filePath=" + filePath, true);
    xmlhttp.send();
};

MapFileProcessor.prototype.loadMapJsonObj = function(jsonObj) {
	this.listMapRawData = this._preprocess(jsonObj.map_element);
	this.objSetting = jsonObj.obj_setting;
	this.scoreboardSetting = jsonObj.scoreboard_setting;
};

MapFileProcessor.prototype.getSnapshot = function(idToNoTransformator) {
	var listSubMapSnapshot = [];
	for(var key in this.listMapFactory) {
		listSubMapSnapshot[key] = this.listMapFactory[key].getSnapshot(idToNoTransformator);
	}
	return this._combineMap(listSubMapSnapshot);
};