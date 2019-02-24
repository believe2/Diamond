var Space = function() {};

Space.prototype.gen2DimArray = function(rowNum, colNum) {
	var array = new Array(rowNum);
	var index = 0;
	while(index < rowNum) {
		array[index] = new Array(colNum);
		index = index + 1;
	}
	return array;
};

Space.prototype.gen3DimArray = function(rowNum, colNum, zNum) {
	var array = new Array(zNum);
	var index = 0;
	while(index < zNum) {
		array[index] = this.gen2DimArray(rowNum, colNum);
		index = index + 1;
	}
	return array;
};