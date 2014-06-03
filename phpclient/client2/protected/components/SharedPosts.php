<?php class SharedPosts extends CWidget {
    private static $last;
    function run() {    
        if( yii::app()->controller->getRoute() != 'account/index' ) return false;
        if ( !yii::app()->params["shared_posts"] ) return false;
        if( !($posts = $this->getShared()) ) return false; 
        $i = 0;
        foreach ( $posts as $post ) {
            if( yii::app()->params["shared_posts_main_limit"] AND $i == (int) yii::app()->params["shared_posts_main_limit"] ) break;
            $this->render('SharedPosts', array( 'text' => html_entity_decode($post->text) ));
            $i ++;
        }
    }
    public static function getLast() {
        if (self::$last === null) {
            self::$last = yii::app()->lanbilling->get('getClientSharedPosts', array(
                'ord' => array(
                    'name' => 'posttime',
                    'ascdesc' => 1
                ),
                'flt' => array (
                    'pgnum' => 1,
                    'status' => 1,
                    'pgsize' => 1,
                    'userid' => Yii::app()->user->getId()
                )
            ));
            if (!self::$last) {
                self::$last = false;
            }
        }
        return self::$last;
    }
    public function getShared()
    {
        if( false == ($post = yii::app()->controller->lanbilling->getRows("getClientSharedPosts", array(
            "status" => 1
        )))) { return false; }
        return $post;
    }
} ?>
