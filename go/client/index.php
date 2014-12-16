<?php

include_once('Request.php');
include_once('VarDumper.php');

try {

$request = new Request(array(
    'url' => 'http://localhost:9001/bye/43?param5=val5&param6=6&param7=7.7',
    'method' => 'put',
    'format' => 'json',
    'params' => array(
        'param1' => true,
        'param2' => 2,
        'param3' => 2.2,
        'param4' => 'val4'
    )
));

$results = $request->call();
echo VarDumper::dump($results, 10, true);

} catch (Exception $e) {
    echo 'ERROR: '.$e->getMessage();
}


?>
