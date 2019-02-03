var Diamond = function (args) {
	Stone.call(this, args);

	this.listImage = ['diamond1.png','diamond2.png','diamond3.png', 'diamond4.png','diamond5.png'];
	this.animateGameObject = this.actionFactory.create({actionType: 'ANIMATE_GAME_OBJECT',
		                                                mainObj: this
	                                                  });
	
	this.registerAction(2, 200, this.animateGameObject.doAction.bind(this.animateGameObject));
};

Diamond.prototype = Object.create(Stone.prototype);
Diamond.prototype.superClass = Object.create(Stone.prototype);
Diamond.prototype.constructor = Diamond;