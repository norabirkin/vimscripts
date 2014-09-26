<?php
/**
 * @author Weavora Team <hello@weavora.com>
 * @link http://weavora.com
 * @copyright Copyright (c) 2011 Weavora LLC
 */

class FileResponse extends WRestResponse{

    public function getContentType()
    {
        return "text/html; charset=utf-8";
    }

    public function setParams($params = array())
    {
        $this->_body = CJSON::encode($params);
        return $this;
    }
}


