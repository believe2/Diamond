var UiCreater = function() {}

UiCreater.prototype.createNumberInput = function(title, idText, minValue, maxValue) {
	var $title = title + ": ";
	var $input = '<input type="number" id="' + idText + 
				 '" name="' + title + 
				 '" autofocus="true" min="' + minValue +
				 '" max="' + maxValue + 
				 '" value="' + minValue +'"></input>';
	
	return {title: $title, input: $input};
};