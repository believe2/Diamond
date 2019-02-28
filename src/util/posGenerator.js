var PosGenerator = function() {}

PosGenerator.prototype.posCenter3x3 = function(centerPos) {
	return [
		new Position(centerPos.x - 1, centerPos.y - 1, centerPos.z),
		new Position(centerPos.x, centerPos.y - 1, centerPos.z),
		new Position(centerPos.x + 1, centerPos.y - 1, centerPos.z),
		new Position(centerPos.x - 1, centerPos.y, centerPos.z),
		new Position(centerPos.x + 1, centerPos.y, centerPos.z),
		new Position(centerPos.x - 1, centerPos.y + 1, centerPos.z),
		new Position(centerPos.x, centerPos.y + 1, centerPos.z),
		new Position(centerPos.x + 1, centerPos.y + 1, centerPos.z)
	];
};

PosGenerator.prototype.posCenterCrossShape = function(centerPos) {
	return [
		new Position(centerPos.x - 1, centerPos.y, centerPos.z),
		new Position(centerPos.x + 1, centerPos.y, centerPos.z),
		new Position(centerPos.x, centerPos.y - 1, centerPos.z),
		new Position(centerPos.x, centerPos.y + 1, centerPos.z)
	];
};

PosGenerator.prototype.posbaseInputVector = function(posbase, listVector) {
	var listRes = [];
	var index = 0;
	while(index < listVector.length) {
		if(listVector[index].z == null) {
			listVector[index].z = 0;
		}
		listRes.push(new Position(posbase.x + listVector[index].x, posbase.y + listVector[index].y, posbase.z + listVector[index].z));
		index = index + 1;
	}
	return listRes;
};

PosGenerator.prototype.posByConstantString = function(pos, str) {
	var newPos = null;
	switch(str) {
		case "LEFT":
			newPos = new Position(pos.x - 1, pos.y, pos.z);
			break;
		case "RIGHT":
			newPos = new Position(pos.x + 1, pos.y, pos.z);
			break;
		case "UP":
			newPos = new Position(pos.x, pos.y - 1, pos.z);
			break;
		case "DOWN":
			newPos = new Position(pos.x, pos.y + 1, pos.z);
			break;
	}
	return newPos;
};

PosGenerator.prototype.transformUnitVector = function(vector) {
	var lvectorl = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	var unitVector = new Position(vector.x / lvectorl, vector.y / lvectorl, vector.z / lvectorl);
	return unitVector;
};

PosGenerator.prototype.isMoveUnitVectorInCheckList = function(posCur, posNext, listUnitVector) {
	var vextorX = posNext.x - posCur.x;
	var vectorY = posNext.y - posCur.y;
	var vectorZ = posNext.z - posCur.z;
	var unitVector = this.transformUnitVector(new Position(vextorX, vectorY, vectorZ));
	if(listUnitVector[0] == 'ALL') {
		return unitVector;
	}
	var index = 0;
	var isExist = false;
	while(!isExist && index < listUnitVector.length) {
		if(unitVector.x == listUnitVector[index].x && unitVector.y == listUnitVector[index].y && unitVector.z == listUnitVector[index].z) {
			isExist = true;
		}
		index = index + 1;
	}
	if(isExist) {
		return unitVector;
	}
	return null;
};

PosGenerator.prototype.posByGivenVector = function(curPos, vector) {
	return new Position(curPos.x + vector.x, curPos.y + vector.y, curPos.z + vector.z);
}