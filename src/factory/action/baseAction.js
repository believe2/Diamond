var BaseAction = function(args) {
	this.mainObj = args.mainObj;
	this.map = args.mainObj.map;
	this.eventQueueHandler = args.eventQueueHandler;
	this.nextAction = args.nextAction;
};