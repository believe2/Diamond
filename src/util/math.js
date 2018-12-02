var MyMath = function() {

}

MyMath.prototype.randInteger = function(startNum, max) {
	if(startNum == max) {
		return startNum;
	}
	return Math.floor(Math.random() * max + startNum);
};

MyMath.prototype.randSelectEleIndex = function(selNum, indexMax) {
	var listResult = [];
	var listCand = [];
	var index = 0;
	while(index < indexMax) {
		listCand[index] = index;
		index = index + 1;
	}
	index = 0;
	while(index < selNum) {
		var selIndex = this.randInteger(0, listCand.length);
		listResult.push(listCand[selIndex]);
		listCand[selIndex] = listCand[listCand.length - 1];
		listCand.splice(listCand.length - 1, 1);
		index = index + 1;
	}
	return listResult;
}