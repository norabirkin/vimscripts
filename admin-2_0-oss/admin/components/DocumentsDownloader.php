<?php

class DocumentsDownloader extends Downloader {
    public function download($path, $filename, $mimeType) {
        yii::log('PATH ['.$path.'] FILENAME ['.$filename.'] MIMETYPE ['.$mimeType.']', 'debug', Logger::getAliasOfPath(__FILE__));
        if(
            !file_exists($path)
        ) {
            yii::log('File is not found ['.$path.']', 'debug', Logger::getAliasOfPath(__FILE__));
            return false;
        }
        if (!($handle = @fopen($path, 'r'))) {
            yii::log('Cannot open file ['.$path.']', 'debug', Logger::getAliasOfPath(__FILE__));
            return false;
        }
        $size = filesize($path);
        $this->sendHeaders($filename, $mimeType);
        header("Content-Length: " . $size);
        yii::log('READ FILE ['.$path.'] SIZE ['.$size.']', 'debug', Logger::getAliasOfPath(__FILE__));
        echo fread($handle, $size);
        fclose($handle);
        return true;
    }
}
?>
