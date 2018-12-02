<?php
	$filePath = $_REQUEST["filePath"];
	$parPath = dirname(dirname(__DIR__));
	echo file_get_contents("$parPath/step/$filePath");
?>