<?php

class Uploader {
    public static function get($name, $base64 = false) {
        if (!($file = CUploadedFile::getInstanceByName($name))) {
            throw new CHttpException(500, "no file to import");
        }
        if (!($path = $file->getTempName())) {
            throw new CHttpException(500, "no file to import");
        }
        if (!($handle = fopen(
                $path,
                'r'.($base64 ? 'b' : '')
        ))) {
            throw new CHttpException(500, "no file to import");
        }
        if ($base64) {
            $size = filesize($file->getTempName());
            $cont = fread($handle, $size);
            fclose($handle);
            return base64_encode($cont);
        } else {
            return $handle;
        }
    }
}

?>
