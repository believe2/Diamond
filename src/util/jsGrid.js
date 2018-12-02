var JsGrid = function(languageFactory) {
    this.languageFactory = languageFactory;
	this.tagId = null;
	this.listItem = [];
	this.onClickRowFunc = null;
	this.transformRule = null;
	this.recoverRule = null;
}

JsGrid.prototype.mapSelectorTemplate = function(tagId, listObjImage) {
	var self = this;
	self.tagId = tagId;

    self.mapAttrName = {
        "name": self.languageFactory.getText('grid_attr_fileName'),
        "mapWidth": self.languageFactory.getText('grid_attr_mapWidth'),
        "mapHeight": self.languageFactory.getText('grid_attr_mapHeight'),
        "diamondTarget": self.languageFactory.getText('grid_attr_diamondTarget'),
        "timeLimit": self.languageFactory.getText('grid_attr_timeLimit'),
        "objType": self.languageFactory.getText('grid_attr_objType')
    };
 
    $(self.tagId).jsGrid({
        width: "100%",
        height: "250px",
 
        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
        selecting: true,
        loadMessage: "Please, wait...",
        loadShading: true,
        
        rowClick: function(data){
        	var result = [];
			for(var key in data.item) {
				result[self.recoverRule[key]] = data.item[key];
			}
        	self.onClickRowFunc(result);
        },
 
        controller: {
        	loadData: function() {
        		return self.listItem;
        	}
        },
 
        fields: [
            { name: self.mapAttrName['name'], type: "text", width: 50, align: "center" },
            { name: self.mapAttrName['mapWidth'], type: "number", width: 50, align: "center" },
            { name: self.mapAttrName['mapHeight'], type: "number", width: 50, align: "center" },
            { name: self.mapAttrName['diamondTarget'], type: "number", width: 70, align: "center" },
            { name: self.mapAttrName['timeLimit'], type: "number", width: 50, align: "center" },
            { name: self.mapAttrName['objType'], type: "text", width: 200, align: "left", itemTemplate: function(value, item){
            	var content = "";
            	var listObj = self.countListObjType(value);
            	var indexObj = 0;
            	while(indexObj < listObj.length) {
            		var indexImg = 0;
            		var findRes = null;
            		while(findRes == null && indexImg < listObjImage.length) {
            			if(listObj[indexObj] == listObjImage[indexImg].num) {
            				findRes = listObjImage[indexImg];
            			}
            			indexImg = indexImg + 1;
            		}
                	content = content + '<img src="img/' + findRes.listImage[findRes.listImage.length - 1] + 
                			  '" style="width:40px;height:40px;">';
            		indexObj = indexObj + 1;
            	}
            	return content;
            }}
        ]
    });

    self.transformToRule = {
    	map_width: self.mapAttrName['mapWidth'],
    	map_height: self.mapAttrName['mapHeight'],
    	diamond_target: self.mapAttrName['diamondTarget'],
    	map_element: self.mapAttrName['objType'],
        time_limit : self.mapAttrName['timeLimit'],
        obj_setting: 'obj_setting',
    };

    self.recoverRule = [];
    self.recoverRule[self.mapAttrName['name']] = 'file_name';
    self.recoverRule[self.mapAttrName['mapWidth']] = 'map_width';
    self.recoverRule[self.mapAttrName['mapHeight']] = 'map_height';
    self.recoverRule[self.mapAttrName['diamondTarget']] = 'diamond_target';
    self.recoverRule[self.mapAttrName['objType']] = 'map_element';
    self.recoverRule[self.mapAttrName['timeLimit']] = 'time_limit';
    self.recoverRule['obj_setting'] = 'obj_setting';
};

JsGrid.prototype.addNewRow = function(fileName, data) {
	var result = [];
	for(var key in data) {
		result[this.transformToRule[key]] = data[key];
	}
	result[this.mapAttrName["name"]] = fileName;
	this.listItem.push(result);
};

JsGrid.prototype.clearAllData = function(data) {
	this.listItem = [];
};

JsGrid.prototype.refresh = function() {
	$(this.tagId).jsGrid("search");
};

JsGrid.prototype.setOnSelCallBackFunc = function(func) {
	this.onClickRowFunc = func;
};

JsGrid.prototype.countListObjType = function(listMap) {
	var res = [];
	for(var keyRow in listMap) {
		for(var keyCol in listMap[keyRow]) {
            var listId = listMap[keyRow][keyCol].split(",");
            for(var keyLv in listId) {
                if(Number(listId[keyLv]) > -1 && res.indexOf(Number(listId[keyLv])) < 0) {
                    res.push(Number(listId[keyLv]));
                }
            }
		}
	}
	return res;
};