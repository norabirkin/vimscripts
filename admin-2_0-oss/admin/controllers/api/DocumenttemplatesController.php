<?php
class DocumenttemplatesController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $documents = $list->getList("getDocuments");

        $result = $documents['result']->getResult();
        foreach ($result as &$item) {
            $item['group_type'] = 0;
            if ((integer)$item['user_group_id'] < 0 && (integer)$item['group_id'] < 0) {
                $item['group_type'] = -1;
            } elseif ((integer)$item['user_group_id'] > 0) {
                $item['group_type'] = 1;
            } elseif ((integer)$item['group_id'] > 0) {
                $item['group_type'] = 2;
            }
        }
        $this->success( $result, $documents['total']->getResult() );

        
    }

    public function actionSave() {
        $params = array(
            "doc_id"            => (int)$this->param("doc_id"),
            'client_allowed'    => (int)$this->param("client_allowed"),
            'cur_id'            => (int)$this->param("cur_id"),
            'detail'            => (int)$this->param("detail"),
            'doc_template'      => (string)$this->param("doc_template"),
            'document_period'   => (int)$this->param("document_period"),
            'file_naming'       => (int)$this->param("file_naming"),
            'group_id'          => ((int)$this->param("group_type") < 0) ? -1 : ((int) $this->param("group_type") == 2) ? (int)$this->param("group_id") : 0,
            'group_path'        => (string)$this->param("group_path"),
            'hidden'            => (int)$this->param("hidden"),
            'name'              => (string)$this->param("name"),
            'nds_above'         => (int)$this->param("nds_above"),
            'on_fly'            => (int)$this->param("on_fly"),
            'payable'           => (int)$this->param("payable"),
            'save_path'         => (string)$this->param("save_path"),
            'upload_ext'        => (string)$this->param("upload_ext"),
            'user_group_id'     => ((int)$this->param("group_type") < 0) ? -1 : ((int)$this->param("group_type") == 1) ?  (int)$this->param("user_group_id") : 0,
        );

        $this->success( yii::app()->japi->callAndSend('setDocument', $params));
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delDocument', array(
            "doc_id" => (int) $this->getRequest()->getParam('doc_id')
        )));
    }

    public function actionIsUseGroupedOrders() {
        $this->success(yii::app()->options->getValue( "use_grouped_orders" ));
    }

} ?>
