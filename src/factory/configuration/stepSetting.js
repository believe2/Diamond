var StepSetting = function (mapFactory) {
	this.setting = null;
	this.listObjSetting = null;
	this.mapFactory = mapFactory;
};

StepSetting.prototype.initial = function(setting) {
	if(setting == null) {
		return;
	}
	this.setting = setting;
	this.listObjSetting = this.setting.obj_setting;
};

StepSetting.prototype.getValue = function(key) {
	return this.setting[key];
};

StepSetting.prototype.getAllSetting = function() {
	return this.listObjSetting;
};

StepSetting.prototype.getSetting = function(pos, objId) {
	var index = 0;
	var result = null;
	while(result == null && index < this.listObjSetting.length) {
		if(this.listObjSetting[index].pos.x == pos.x && this.listObjSetting[index].pos.y == pos.y) {
			result = this.listObjSetting[index];
		}
		else if(this.listObjSetting[index].id == objId && this.listObjSetting[index].pos == "ALL") {
			result = this.listObjSetting[index];
		}
		index = index + 1;
	}
	return result;
};

StepSetting.prototype.setSettingToAllObject = function() {
	var index = 0;
	while(this.listObjSetting != null && index < this.listObjSetting.length) {
		var setting = this.listObjSetting[index];
		if(setting.pos == 'ALL') {
			var listObj = this.getAllOfObjFromMap(setting.id);
			var indexObj = 0;
			while(indexObj < listObj.length) {
				listObj[indexObj].setExtraSetting(setting);
				indexObj = indexObj + 1;
			}

			var abstratcObj = this.mapFactory.getListAbstractObj()[setting.id];
			if(abstratcObj != null) {
				abstratcObj.setExtraSetting(setting);
			}
		}
		else {
			var pos = new Position(setting.pos.x, setting.pos.y);
			var obj = this.getEleFromMap(setting.id, pos);
			if(obj != null) {
				obj.setExtraSetting(setting);
			}
		}
		index = index + 1;
	}
};

StepSetting.prototype.updateSetting = function(settingEle, mode) {
	if(settingEle == null) {
		return;
	}
	var index = 0;
	var isFound = false;
	while(!isFound && index < this.listObjSetting.length) {
		if((settingEle.pos == "ALL" && settingEle.pos == this.listObjSetting[index].pos) || 
		   (this.listObjSetting[index].pos.x == settingEle.pos.x && this.listObjSetting[index].pos.y == settingEle.pos.y)) {
			if(this.listObjSetting[index].id == settingEle.id) {
				if(mode == "UPDATE") {
					this.listObjSetting[index] = settingEle;
				}
				else if(mode == "DELETE") {
					if(settingEle.pos != "ALL") {
						this.listObjSetting.splice(index, 1);
					}
					else {
						if(!this.isExistInMap(settingEle.id)) {
							this.listObjSetting.splice(index, 1);
						}
					}
				}
				isFound = true;
			}
		}
		index = index + 1;
	}
	if(!isFound && mode == "UPDATE") {
		this.listObjSetting.push(settingEle);
	}
};

StepSetting.prototype.isExistInMap = function(id) {
	var index = 0;
	var isExist = false;
	while(!isExist && index < this.listMapFactory.length) {
		if(this.listMapFactory[index].getOneOfObj(id) > 0) {
			isExist = true;
		}
		index = index + 1;
	}
};

StepSetting.prototype.getAllOfObjFromMap = function(id) {
	var list = [];
	var index = 0;
	while(index < this.listMapFactory.length) {
		list = list.concat(this.listMapFactory[index].getAllOfObj(id));
		index = index + 1;
	}
	return list;
};

StepSetting.prototype.getEleFromMap = function(id, pos) {
	var result = null;
	var index = 0;
	while(result == null && index < this.listMapFactory.length) {
		result = this.listMapFactory[index].getEle(pos);
		if(result != null && result.getId() != id) {
			result = null;
		}
		index = index + 1;
	}
	return result;
};