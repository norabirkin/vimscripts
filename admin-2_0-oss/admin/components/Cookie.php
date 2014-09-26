<?php

class Cookie {

    const Session = null;
    const OneDay = 86400;
    const SevenDays = 604800;
    const ThirtyDays = 2592000;
    const SixMonths = 15811200;
    const OneYear = 31536000;
    const Lifetime = -1; // 2030-01-01 00:00:00


    public static function hasCookie($name)
    {
        return isset(Yii::app()->request->cookies[$name]);
    }

    public static function getCookie($name, $delimiter = null)
    {
        if(empty($name)) {
            return;
        }
        
        $cookie = Yii::app()->request->cookies[$name]->value;
        
        if(!is_null($delimiter)) {
            return explode($delimiter, $cookie);
        }
        
        return $cookie;
    }
    
    public static function setCookie($name, $value, $time = null, $disableClientCookies = false)
    {
        // Lifetime = 2030-01-01 00:00:00
        if ($time === -1) {
            $time = 1893456000; 
        }
        elseif (is_numeric($time)) {
            $time += time();
        }
        else {
            $time = strtotime($time);
        }

        $cookie = new CHttpCookie($name, $value);
        $cookie->expire = $time;
        $cookie->httpOnly = $disableClientCookies;
        $cookie->path = Yii::app()->request->baseUrl . '/';
        Yii::app()->request->cookies[$name] = $cookie;
    }

    public static function removeCookie($name)
    {
        unset(Yii::app()->request->cookies[$name]);
    }

}

?>