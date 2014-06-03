<?php class MainTemplateHelper {
    private static $instance;
    private $theme;
    public static function GetInstance() {
        if (!self::$instance) self::$instance = new self;
        return self::$instance;
    }
    private function GetViewPath() {
        $viewName = (yii::app()->user->isGuest) ? 'guest' : 'registered';
        return 'application.views.layouts.'.$viewName;
    }
    public function GetTheme() {
        if (!$this->theme) {
            $theme = yii::app()->getTheme()->getName().'Theme';
            yii::import('webroot.themes.'.yii::app()->getTheme()->getName().'.'.$theme);
            $this->theme = new $theme;
        }
        return $this->theme;
    }
    public function GetPositionContent($method, $params = array()) {
        return $this->GetTheme()->$method($params);
    }
    public static function Render($content) {
        $params = array(
            'content' => $content
        );
        if (!yii::app()->user->isGuest) {
            $params = array_merge($params, array(
                'BeforeContent' => self::GetInstance()->GetPositionContent('BeforeContent'),
                'ContentBegining' => self::GetInstance()->GetPositionContent('ContentBegining'),
                'BeforeUserMenu' => self::GetInstance()->GetPositionContent('BeforeUserMenu'),
                'clientInfo' => yii::app()->controller->widget('ClientInfo', array(), true),
                'serviceFunctionWidgets' => self::GetInstance()->GetTheme()->getServiceFunctionWidgets()->GetServiceFunctions()
            ));
        } else {
            $params = array_merge($params, array(
                'BeforeLoginBlock' => self::GetInstance()->GetPositionContent('BeforeLoginBlock')
            ));
        }
        return yii::app()->controller->renderPartial(self::GetInstance()->GetViewPath(), $params, true);
        
    }
} ?>
