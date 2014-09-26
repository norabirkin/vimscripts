<?php

class CasController extends Controller {
    public function actionList() {
        $list = new OSSList;
        $list->get('getCASPackages', array(
            'name' => (string) $this->param('fullsearch')
        ));
    }
}

?>
