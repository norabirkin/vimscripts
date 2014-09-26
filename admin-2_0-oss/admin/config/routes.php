<?php
return array(
    array('api/<model>/delete', 'pattern'=>'api/<model:\w+>/<id:\d+>', 'verb'=>'DELETE'),
    array('api/<model>/update', 'pattern'=>'api/<model:\w+>/<id:\d+>', 'verb'=>'PUT'),
    array('api/<model>/list', 'pattern'=>'api/<model:\w+>', 'verb'=>'GET'),
    array('api/<model>/get', 'pattern'=>'api/<model:\w+>/<id:\d+>', 'verb'=>'GET'),
    array('api/<model>/create', 'pattern'=>'api/<model:\w+>', 'verb'=>'POST')  
);