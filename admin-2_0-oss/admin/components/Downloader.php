<?php

class Downloader {
    private $charset;
    private $charsets = array(
        'UTF-8' => 'utf-8',
        'CP1251' => 'windows-1251',
        'KOI8-R' => 'koi8-r'
    );
    
    protected function getCharset() {
        $charset = yii::app()->japi->callAndSend("getOption", array( "name" => "export_character" ));
        if (!$this->charset) {
            $this->charset = $this->charsets[ $charset["value"] ];
        }
        if (!$this->charset) {
            return "UTF-8";
        }
        return $this->charset;
    }

    public function sendHeaders($filename, $mimeType) {
        header('Content-Disposition: attachment; filename="' . $filename);
        header('Content-Type: '. $mimeType .'; charset=' . $this->getCharset());
        header('Content-Encoding: ' . $this->getCharset());
    }

}

?>
