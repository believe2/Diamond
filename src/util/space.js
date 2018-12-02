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