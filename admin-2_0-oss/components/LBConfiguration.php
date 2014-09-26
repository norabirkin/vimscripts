<?php

class LBConfiguration {
    public function __construct($base) {
        $this->base = realpath($base);
    }
    public function getConfig() {
        //Preload config
        $config = $this->override(
            realpath(dirname(__FILE__).'/settings.php'),
            realpath($this->base.'/config/settings.php')
        );

        //<develop>
        // Create the list of override configuration
        // than apply them all to the main configuration
        // This code just for the development mode
        if (!YII_DEBUG) {
            return $config;
        }
        // Override configuration
        $developConfig = realpath($this->base.'/config/develop');
        
        if(is_dir($developConfig) && false != ($handler = opendir($developConfig)))
        {
            // Files
            $files = array();
            
            while (false !== ($file = readdir($handler))) {
                if(!is_dir($developConfig . DIRECTORY_SEPARATOR . $file) && 
                    strpos($file, '.php') !== false)
                {
                    $files[] = $file;
                }
            }
            
            closedir($handler);
            
            if(!empty($files)) {
                sort($files, SORT_STRING);
                
                foreach ($files as $file){
                    $config = $this->override($config, $developConfig . DIRECTORY_SEPARATOR . $file);
                }
            }
        }
        //</develop>
        return $config;
    }
    private function override($config, $path) {
        if (is_string($config)) {
            $config = require_once($config);
        }
        $overConfig = require_once($path);
        
        if(is_array($overConfig)) {
            $config = CMap::mergeArray(
                $config,
                $overConfig
            );
        }
        return $config;
    }
}

?>
