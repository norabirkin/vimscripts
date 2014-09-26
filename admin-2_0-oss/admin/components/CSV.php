<?php
class CSV extends Downloader {
    
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
    
    public function sendCSVHeaders($filename) {
        $this->sendHeaders($filename, 'application/csv');
    }
} ?>
