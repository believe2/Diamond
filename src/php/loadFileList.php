<?php
	$dir    = $_REQUEST["filePath"];
	$parPath = dirname(dirname(__DIR__));
	$files = scandir("$parPath/$dir/step");
	$result = '';
	
	foreach ($files as $key => $value) {
		if(strpos($value, '.map') !== false) {
			$result = $result . $value . ',';
		}
	}

	echo $result;
?>