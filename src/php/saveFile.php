<?php
	$filePath = $_REQUEST["filePath"];
	$content = $_REQUEST["content"];
	$parPath = dirname(dirname(__DIR__));
	$readfile = fopen("$parPath/step/$filePath", "w");
	fwrite($readfile, $content);
	fclose($readfile);
?>