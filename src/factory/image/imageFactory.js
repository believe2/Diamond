var ImageFactory = function(dir) {
	this.dir = dir;  //set the root directory of image
	this.listImg = [];  //store image object (key : file name)

};

ImageFactory.prototype.load = function(imgName) {
 	if(this.listImg.indexOf(imgName) < 0) {  //image singleton
 		var img = new Image();
		img.src = this.dir + "/" + imgName;
 		this.listImg[imgName] = img;
 	}
	return this.listImg[imgName];
};