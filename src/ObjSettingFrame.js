var ObjSettingFrame = function (funcUpdateSetting, funcGetSetting) {
	this.argObjSetting = {pos: null, objId: null, guiId: null};
	this.updateSetting = funcUpdateSetting;
	this.getSetting = funcGetSetting;

	var self = this;
	document.getElementById("pf_os_btnOk").addEventListener('click', function() {
		self.saveNewObjSetting();
	});
}

ObjSettingFrame.prototype.setObjSettingTemplate = function(objId, pos) {
	$('#popupFrameObjSetting').css("display", "block");

	if(this.argObjSetting.guiId != null) {
		$(this.argObjSetting.guiId).css("display", "none");
	}

	this.argObjSetting.pos = pos;
	this.argObjSetting.objId = objId;

	$('#pf_objType').text(objId);
	$('#pf_objPos').text("{ " + pos.x + " , " + pos.y + " }");

	var curSetting = this.getSetting(pos, objId);

	switch(objId) {
		case "GREEN_WATER":
			this.argObjSetting.guiId = '#pf_greenWaterSetting';
			$('#pf_inputMinSpdTime').val(curSetting != null ? curSetting.min_spread_time: 1);
			$('#pf_inputMaxSpdTime').val(curSetting != null ? curSetting.max_spread_time: 1);
			$('#pf_inputMinSpdNum').val(curSetting != null ? curSetting.min_spread_num: 1);
			$('#pf_inputMaxSpdNum').val(curSetting != null ? curSetting.max_spread_num: 1);
			break;
		case "STRETCH_WALL":
			this.argObjSetting.guiId = '#pf_stretchWallSetting';
			$('#pf_isSelLeft').prop("checked", curSetting != null && curSetting.stretch_dir.indexOf('LEFT') > -1);
			$('#pf_isSelRight').prop("checked", curSetting != null && curSetting.stretch_dir.indexOf('RIGHT') > -1);
			$('#pf_isSelUp').prop("checked", curSetting != null && curSetting.stretch_dir.indexOf('UP') > -1);
			$('#pf_isSelDown').prop("checked", curSetting != null && curSetting.stretch_dir.indexOf('DOWN') > -1);
			break;
		default:
			$('#pf_os_btnOk').prop("disabled", true);
			this.argObjSetting.guiId = null;
			break;
	}
	if(this.argObjSetting.guiId != null){
		$('#pf_os_btnOk').prop("disabled", false);
		$(this.argObjSetting.guiId).css("display", "block");
	}
};

ObjSettingFrame.prototype.saveNewObjSetting = function() {
	$('#popupFrameObjSetting').css("display", "none");
	var objSetting = {
		id: this.argObjSetting.objId,
		pos: this.argObjSetting.pos
	};
	switch(this.argObjSetting.objId) {
		case "GREEN_WATER":
			objSetting.pos = "ALL";
			objSetting.min_spread_time = Number($('#pf_inputMinSpdTime').val());
			objSetting.max_spread_time =  Number($('#pf_inputMaxSpdTime').val());
			objSetting.min_spread_num =  Number($('#pf_inputMinSpdNum').val());
			objSetting.max_spread_num =  Number($('#pf_inputMaxSpdNum').val());
			break;
		case "STRETCH_WALL":
			var stretch_dir = [];
			$('#pf_isSelLeft').prop("checked") ? stretch_dir.push("LEFT") : "";
			$('#pf_isSelRight').prop("checked") ? stretch_dir.push("RIGHT") : "";
			$('#pf_isSelUp').prop("checked") ? stretch_dir.push("UP") : "";
			$('#pf_isSelDown').prop("checked") ? stretch_dir.push("DOWN") : "";
			objSetting.stretch_dir = stretch_dir;
			break;
	}
	console.log(objSetting);
	this.updateSetting(objSetting);
};