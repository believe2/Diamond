var SoundEffectFactory = function () {
	this.dir = 'soundEffect/';
	this.listSound = {
		'BOOM': {nextIndex: -1, list: ['boom1.mp3', 'boom2.mp3', 'boom3.mp3']},
		'BURP': {nextIndex: -1, list: ['burp.mp3']},
		'BANG': {nextIndex: -1, list: ['bang1.mp3', 'bang2.mp3']},
		'WATER': {nextIndex: -1, list: ['water1.mp3', 'water2.mp3']},
		'DING' : {nextIndex: -1, list: ['ding1.mp3', 'ding2.mp3']}
	};
	this.listObjSound = [];
	this.math = new MyMath();
	createjs.Sound.on("fileload", this.onLoadHandler, this);
};

SoundEffectFactory.prototype.initial = function() {
	for(var key in this.listSound) {
		this.preLoadSound(key);
	}
};

SoundEffectFactory.prototype.randSound = function(id) {
	var playIndex = this.math.randInteger(0, this.listSound[id].list.length);
	var targetFileName = this.listSound[id].list[playIndex];
	if(this.listObjSound.indexOf(targetFileName) < 0) {
		this.loadSound(targetFileName);
	}
	return playIndex;
};

SoundEffectFactory.prototype.loadSound = function(fileName) {
	this.listObjSound.push(fileName);
	createjs.Sound.registerSound(this.dir + fileName, fileName);
};

SoundEffectFactory.prototype.preLoadSound = function(id) {
	this.listSound[id].nextIndex = this.randSound(id);
};

SoundEffectFactory.prototype.doPlay = function(id, setloop = 0) {
	if(this.listSound[id].nextIndex > -1) {
		createjs.Sound.play(this.listSound[id].list[this.listSound[id].nextIndex], {loop:setloop});
	}
	this.preLoadSound(id);
};

SoundEffectFactory.prototype.playSound = function(id) {
	this.doPlay(id);
};

SoundEffectFactory.prototype.onLoadHandler = function(event) {
	//createjs.Sound.play(event.id);
};