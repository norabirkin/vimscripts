<?php

class LB_DatePicker_DefaultValues {
    public static function get($param, $period) {
        switch ($param) {
            case 'dtfrom':
                switch ($period) {
                    case 'd':
                    return date('Y-m-d');
                    break;
                    case 'w':
                    return date('Y-m-d',strtotime('-1 week'));
                    break;
                    case 'm':
                    return date('Y-m-d',strtotime('last month'));
                    break;
                    default:
                    return date('Y-m-d',strtotime('-1 day'));
                    break;
                }
                break;
            case 'dtto': 
                return date('Y-m-d',strtotime('+1 day'));
                break;
            default:
                return null;
                break;
        }
    }
}

?>
