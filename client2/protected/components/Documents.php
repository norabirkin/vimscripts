<?php class Documents {
    public function getFile($order) {
        $orderpath = trim($order->filename);
        if($orderpath[0] != '/') {
            $base = '/usr/local/billing/';
            if (substr($orderpath, 0, 2) == './') $orderpath = substr($orderpath, 2 , ( strlen($orderpath) - 2 ));
            $orderpath = $base . $orderpath;
        }
        if (file_exists($orderpath)) {
            return $orderpath;
        } else {
            return null;
        }
    }
} ?>
