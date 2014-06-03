<?php

class LBPages {
    private static $allPages = array();
    private $pages = array();
    private $parent;
    public function __construct($parent = null) {
        if ($parent) {
            $this->setParent($parent);
        }
    }
    private function setParent(LBPage $parent) {
        $this->parent = $parent;
    }
    public function config($config) {
    	$config = $this->addMessageCategoriesToMenu($config);
    	
        $this->pages = array();
        foreach ($config as $item) {
            $this->addPage($item);
        }
    }
    public function addPage($conf) {
        $page = new LBPage($conf, $this->parent);
        $route = $page->route();
        $this->pages[$route] = $page;
        self::$allPages[$route] = $page;
    }
    public function getPage($route) {
        return self::$allPages[$route];
    }
    public function getCurrent() {
        return $this->getPage(yii::app()->controller->route);
    }
    public function eachPages($method, $scope, &$data = null) {
        foreach ($this->pages as $page) {
            if ($page->param('hidden')) {
                continue;
            }
            if ($page->swithedOff()) {
                continue;
            }
            $scope->$method($page, $data);
        }
    }
    public function getPages() {
        return $this->pages;
    }
    public function getCount() {
        return count($this->pages);
    }
    
    private function addMessageCategoriesToMenu($config){
    	
    	foreach($config as &$item) {
    		if($item['addSharedPostsCategoriesHere'] && $item['addSharedPostsCategoriesHere'] == true){
    			
    			$categories = yii::app()->controller->lanbilling->sharedPostsCategories;
    			foreach ($categories as $category) {
    				$item['items'][] = array (
    					'controller' => 'sharedposts',
    					'action' => 'category' .$category->id,
    					'title' => $category->name
    				);
    			} 
    		}
    		
    		if ($item['configurateAntivirusTitleFromTheme'] && $item['configurateAntivirusTitleFromTheme'] == true){
    			$titleFromThemeConfig = MainTemplateHelper::GetInstance()->GetTheme()->getAntivirusModuleParams();
    			$item['title'] = Yii::t ('antivirus', $titleFromThemeConfig['title']);
    		}
    	}
    	return $config;
    }
}

?>
