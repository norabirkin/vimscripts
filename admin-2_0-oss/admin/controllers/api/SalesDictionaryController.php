<?php

class SalesDictionaryController extends Controller {
    public function actionList() {
        $list = new OSSList;
        $list->get('getSaleDictionaryEntries', array(
            'name' => (string) $this->param('query') ? (string) $this->param('query') : null
        ));
    }
}

?>
