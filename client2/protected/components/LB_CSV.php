<?php

class LB_CSV {
    
    private $charset;
    private $charsets = array(
        'UTF-8' => 'utf-8',
        'CP1251' => 'windows-1251',
        'KOI8-R' => 'koi8-r'
    );
    
    public function CSVFileToArray( $file ) {
        $array = array();
        while (($data = fgetcsv($file, 10000000, ";",'"')) !== FALSE) {
            $array[] = $data;
        }
        return $array;
    }
    
    public function arrayToCSV( $array ) {
        $csv = '';
        foreach ($array as $line) {
            $outstream = fopen("php://temp", 'r+');
            fputcsv($outstream, $line, ';', '"');
            rewind($outstream);
            $csv .= fgets($outstream);
        }
        return $this->convertToOtherCharsetIfNecessary( $csv );
    }
    
    private function convertToOtherCharsetIfNecessary($string) {
        if ($this->getCharset() != 'UTF-8') {
            return iconv('UTF-8', $this->getCharset(), $string);
        } else {
            return $string;
        }
    }
    
    private function getCharset() {
        $charset = yii::app()->lanbilling->getOption("export_character");
        if (!$this->charset) {
            $this->charset = $this->charsets[$charset];
        }
        if (!$this->charset) {
            return "UTF-8";
        }
        return $this->charset;
    }
    
    public function sendCSVHeaders($filename) {
        header('Content-Disposition: attachment; filename="' . $filename);
        header('Content-Type: application/csv; charset=' . $this->getCharset());
        header('Content-Encoding: ' . $this->getCharset());
    }
}

?>
