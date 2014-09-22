<?php

class LBR_Error extends CHttpException {
    private $detail = array();
    public function __construct($params) {
        if (!$params || !is_array($params)) {
            throw new CHttpException(500, 'Invalid exception config');
        }
        foreach ($params as $item) {
            $item = new LBR_Error_Item($item);
            $this->detail[] = $item;
        }
        parent::__construct(500);
    }
    public function getDetail() {
        $result = array();
        foreach ($this->detail as $item) {
            $result[] = $item->getDetail();
        }
        return $result;
    }
}

?>
