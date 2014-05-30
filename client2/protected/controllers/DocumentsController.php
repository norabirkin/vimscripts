<?php
error_reporting(7);
if (!yii::app()->params['PageLimit']) yii::app()->params['PageLimit'] = 1;

class DocumentsController extends Controller
{
    /**
     * This action allows users to get all bills for current users
     */
     
     public function actionIndex() {
    	yii::import('application.models.Documents.getClientDocuments');
		$this->breadcrumbs = array(
            yii::t('documents','Documents')
        );
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('documents','Documents');
		$model = new getClientDocuments;
		$grid = $model->getGrid(array('name' => ''),'documentTypeLinks');
     	$this->render('document_types',array('grid' => $grid));
    }
	 
    public function actionAgreements($docid) {
    	yii::import('application.models.Documents.Agreements');
    	$this->breadcrumbs = array(
            yii::t('documents','Documents') => array('/documents'),
            yii::t('documents','ChooseAgreement')
        );
		$this->pageTitle = yii::app()->name . ' - ' . yii::t('documents','Documents') . ' | ' . yii::t('documents','ChooseAgreement');
    	$model = new Agreements;
		$grid = $model->getGrid(array(
			'number' => yii::t('documents','AgreementNumber'),
			'balance' => yii::t('documents','Balance')
		),'agreementDocumentsLinks');
     	$this->render('agreements',array('grid' => $grid));
    }
	
	public function actionList($agrmid = 0, $docid = 0, $unpayed = 0) {
		yii::import('application.models.Documents.getClientOrders');
		/*$this->breadcrumbs = array(
            'Документы' => array('/documents'),
            yii::t('documents','ChooseAgreement') => array('documents/agreements','docid' => $docid),
            yii::t('documents','DocumentsList')
        );*/
		//$this->pageTitle = yii::app()->name . ' - ' . yii::t('documents','Documents') . ' | ' . yii::t('documents','DocumentsList');
		$model = new getClientOrders;
		$model->agrmid = $agrmid;
		$model->docid = $docid;
        $model->dtfrom = $this->dtfrom() . '-01 00:00:00';
        $model->dtto = $this->dtto() . '-01 00:00:00';
		if ($unpayed) $model->payed = 0;
		else $model->payed = yii::app()->SessionStore->get('payed','docs') - 1;
		$grid = $model->getGrid(array(
			'orderdate' => yii::t('documents','Date'),
			'ordernum' => yii::t('documents','OrderNumber'),
			'docname' => yii::t('documents','DocumentName'),
			'currsumm' => yii::t('documents','Sum'),
			'state' => yii::t('documents','Status'),
			'dowlnoad' => ''
		),'documentsList');
		$this->render('list',array(
			'filter' => $this->getForm($model)/*.$filter*/,
			'grid' => $grid,
			'agreement' => $model->agrmid ? yii::app()->controller->lanbilling->agreements[$agrmid]->number : ''
		));
	}

    private function dtfrom() {
        return $this->param('dtfrom', date('Y-m'));
    }

    private function dtto() {
        return $this->param('dtto', date('Y-m', strtotime('next month')));
    }

    private function getForm($model) {
        return '<br/>' . $this->form(array(
            array(
                'type' => 'hidden',
                'name' => 'r',
                'value' => 'documents/list'
            ),
            array(
                'type' => 'month',
                'name' => 'dtfrom',
                'label' => 'Period (From)',
                'value' => $this->dtfrom()
            ),
            array(
                'type' => 'month',
                'name' => 'dtto',
                'label' => 'Period (To)',
                'value' => $this->dtto()
            ),
            array(
                'type' => 'radioList',
                'name' => 'payed',
                'label' => 'State',
                'value' => ($model->payed +1),
                'data' => array(
                    0 => yii::t('documents','All'),
                    1 => yii::t('documents','NotPayedOrders'),
                    2 => yii::t('documents','PayedOrders')
                )
            ),
            array(
                'type' => 'submit',
                'value' => 'Apply'
            )
        ))->render() . '<br/>';
    }

    public function actionDownload($file)
    {
        if(!$file) throw new CHttpException(404);

        $orders = $this->lanbilling->get("getClientOrders", array("flt" => array()));
        $orders = is_array($orders) ? $orders : array($orders);

        if(!count($orders))
        {
            Yii::app()->user->setFlash('error',Yii::t('documents','NoBills'));
            $this->redirect(array('documents/index'));
        }
        $docs = new Documents;
        foreach($orders as $order) {
            $id = array();
            $info = pathinfo($order->filename);
            $file2download =  basename($order->filename,'.'.$info['extension']);
            if($file2download && $file2download == $file) {
                $orderpath = $docs->getFile($order);
                Yii::app()->request->sendFile(basename($orderpath),file_get_contents($orderpath));
                Yii::app()->end();
            }
        }
        Yii::app()->user->setFlash('error',Yii::t('documents','NoFile'));
        $this->redirect(array('documents/index'));
    }
}
