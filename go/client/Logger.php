<?php class Logger {
    private static $insatance;
    private static $sql_ids = array();
    public static $enabled = true;
    private static $trace = true;
    private static $instance;
    public static $info = '';
    public static function addSQL( $id ) {
        $id = (string) $id;
        if (!in_array( $id, self::$sql_ids )) self::$sql_ids[] = $id;
    }
    public function logSQL( $id, $data ) {
        if (in_array($id, self::$sql_ids)) {
            self::log($data);
        }
    }
    private static function instance() {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    private function path() {
        return
            dirname(__FILE__).
            DIRECTORY_SEPARATOR.
            'log'.
            DIRECTORY_SEPARATOR.
            'debug.log';
    }
    private function write($msg, $category) {
        if (!(
            $f = @fopen($this->path(), 'a')
        )) {
            throw new Exception('Не удается открыть файл для логирования');
        }
        if (!fwrite(
                $f,
                (
                    '-------------------'.
                    "\n".
                    date('Y-m-d H:i:s'). ' '.$this->category(array(
                        strtoupper($category),
                        self::$info
                    )).
                    "\n".
                    '-------------------'.
                    "\n\n".
                    $msg.
                    "\n\n"
                )
        )) {
            throw new Exception('Не удается писать в файл для логирования');
        }
    }
    public static function process($var) {
        include_once('VarDumper.php');
        if (is_string($var)) {
            $dump = $var;
        } elseif ($var === '') {
            $dump = 'EMPTY STRING';
        } elseif ($var === true) {
            $dump = 'TRUE';
        } elseif ($var === false) {
            $dump = 'FALSE';
        } elseif ($var === NULL) {
            $dump = 'NULL';
        } else {
            $dump = VarDumper::dumpAsString($var);
        }
        return $dump;
    }
    public static function log($var, $category = 'info') {
        if (!self::$enabled) {
            return;
        }
        $dump = self::process($var);
        self::instance()->write($dump, $category);
    }
    private function category($data) {
        $result = array();
        foreach ($data as $item) {
            if ($item = trim($item)) {
                $result[] = '['.$item.']';
            }
        }
        return implode(' ', $result);
    }

} ?>
