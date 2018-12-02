var PosGenerator = function() {}

PosGenerator.prototype.posCenter3x3 = function(centerPos) {
	return [
		new Position(centerPos.x - 1, centerPos.y - 1),
		new Position(centerPos.x, centerPos.y - 1),
		new Position(centerPos.x + 1, centerPos.y - 1),
		new Position(centerPos.x - 1, centerPos.y),
		new Position(centerPos.x + 1, centerPos.y),
		new Position(centerPos.x - 1, centerPos.y + 1),
		new Position(centerPos.x, centerPos.y + 1),
		new Position(centerPos.x + 1, centerPos.y + 1)
	];
};

PosGenerator.prototype.posCenterCrossShape = function(centerPos) {
	return [
		new Position(centerPos.x - 1, centerPos.y),
		new Position(centerPos.x + 1, centerPos.y),
		new Position(centerPos.x, centerPos.y - 1),
		new Position(centerPos.x, centerPos.y + 1)
	];
};

PosGenerator.prototype.posbaseInputVector = function(posbase, listVector) {
	var listRes = [];
	var index = 0;
	while(index < listVector.length) {
		listRes.push(new Position(posbase.x + listVector[index].x, posbase.y + listVector[index].y));
		index = index + 1;
	}
	return listRes;
};

PosGenerator.prototype.posByConstantString = function(pos, str) {
	var newPos = null;
	switch(str) {
		case "LEFT":
			newPos = new Position(pos.x - 1, pos.y);
			break;
		case "RIGHT":
			newPos = new Position(pos.x + 1, pos.y);
			break;
		case "UP":
			newPos = new Position(pos.x, pos.y - 1);
			break;
		case "DOWN":
			newPos = new Position(pos.x, pos.y + 1);
			break;
	}
	return newPos;
};