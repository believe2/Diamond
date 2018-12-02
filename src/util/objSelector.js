var ObjSelector = function (idTag, listObjInfo, btnWidth, btnHeight, funcOnClick, isAddNullObj) {
	var self = this;
	self.curSelBtn = null;
	if(isAddNullObj) {  //add null object (mean delete current object)
		listObjInfo.push({num: -1, type: {dim: "OBJECT"}, id: 'null', listImage: ["delete.png"]});
	}

	var index = 0;
	while(index < listObjInfo.length) {
		(function(objInfo, index) {
			var $btn = $('<button/>', {
		        style: 'background-color: white;' +
		        	   'background-image: url("img/' + listObjInfo[index].listImage[0] + '");' + 
		        	   'width:' + btnWidth + 'px;' +
		        	   'height:' + btnHeight + 'px;' +
		        	   'background-size:' + (btnWidth - 10) + 'px ' + (btnWidth - 10) + 'px;' +
		        	   'background-repeat: no-repeat;' +
		        	   'background-position: center;' +
		        	   'border-color: white;',
		        click: function() {
		        	if(self.curSelBtn != null) {
						self.curSelBtn.css("border-color", "white");
					}
					self.curSelBtn = $btn;
					$btn.css("border-color", "red");
		        	funcOnClick(objInfo);
		        }
		    });
			$(idTag).append($btn);
			$(idTag).append('<br>');
			if(index == 0) {
		    	$btn.click();
		    }
		})(listObjInfo[index], index);
		index = index + 1;
	}
}