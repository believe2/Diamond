var BackgroundMusicFactory = function () {
	SoundEffectFactory.call(this);
	this.isPlay = false;
	this.dir = 'music/';
	this.listSound = {
		'END_MUSIC': {nextIndex: -1, list: ['m1.ogg', 'm2.ogg', 'm3.ogg', 'm4.ogg', 'm5.ogg', 'm6.ogg', 'm7.ogg']}
	}
};

BackgroundMusicFactory.prototype = Object.create(SoundEffectFactory.prototype);
BackgroundMusicFactory.superClass = Object.create(SoundEffectFactory.prototype);
BackgroundMusicFactory.prototype.constructor = BackgroundMusicFactory;

BackgroundMusicFactory.prototype.initial = function() {
	this.preLoadSound('END_MUSIC');
};

BackgroundMusicFactory.prototype.playSound = function(id) {
	if(!this.isPlay) {
		this.isPlay = true;
		this.doPlay(id, -1);
	}
};

BackgroundMusicFactory.prototype.getIsPlaying = function() {
	return this.isPlay;
};

BackgroundMusicFactory.prototype.stopPlaying = function() {
	createjs.Sound.stop();
	this.isPlay = false;
};