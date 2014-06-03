<?php class DefaultController extends Controller {
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_antivirus'
            )
        ));
    }
	public function actionIndex() {
		$this->pageTitle = Yii::app()->name.' - '.Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus');
    		$this->breadcrumbs = array(
        		Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus'),
    		);
		try {
			$this->render("index", array(
				"title" => Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus'),
				"assignedAntivirusServices" => $this->getModule()->Antivirus->getServicesGridHTML(array(
                    "dataGetter" => "getAssignedAntivirusServices",
                    "gridComponent" => "AssignedAntivirusServicesGrid",
                    "title" => "AssignedAntivirusServices"
                )),
				"availableAntivirusServices" => $this->getModule()->Antivirus->getServicesGridHTML(array(
                    "dataGetter" => "getAvailableAntivirusServices",
                    "gridComponent" => "AvailableAntivirusServicesGrid",
                    "title" => "AvailableAntivirusServices"
                ))
            ));
		} catch ( Exception $e ) {
			$error = $e->getMessage();
			$this->render("index", array(
				"title" => Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus'),
				"assignedAntivirusServices" => $error
			));
		}
	}
	public function actionAssign( $vgid, $catidx ) {
		$success = $this->getModule()->Antivirus->assignService( $vgid, $catidx ); 
        if ($success) {
            Yii::app()->user->setFlash('success',Yii::t(Antivirus::getLocalizeFileName(), "Service is successfully assigned"));
        } else {
            Yii::app()->user->setFlash('error',Yii::t(Antivirus::getLocalizeFileName(), "Service is not assinged"));
        }
		$this->redirect( array("default/index") );
	}
	public function actionStop( $servid, $vgid ) {
		$success = $this->getModule()->Antivirus->stopService( $servid, $vgid );
        if ($success) {
            Yii::app()->user->setFlash('success',Yii::t(Antivirus::getLocalizeFileName(), "Service is successfully stopped"));
        } else {
            Yii::app()->user->setFlash('error',Yii::t(Antivirus::getLocalizeFileName(), "Service is not stopped"));
        }
		$this->redirect( array("default/index") );
	}
	public function actionConfirmAssign( $vgid, $catidx ) {
		$this->pageTitle = Yii::app()->name.' - '.Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus');
    		$this->breadcrumbs = array(
        		yii::t(Antivirus::getLocalizeFileName(), 'Antivirus') => $this->createUrl("default/index"),
			yii::t(Antivirus::getLocalizeFileName(),"AssignConfirmation")
    		);
		$category = $this->getModule()->Antivirus->getCategoryData( $vgid, $catidx );
		$this->render( "confirm", array(
			"title" => yii::t(Antivirus::getLocalizeFileName(),"AssignConfirmation"),
			"url" => $this->createUrl("default/assign", array(
				"vgid" => $vgid,
				"catidx" => $catidx 
			)),
			"license" => CHtml::link( yii::t(Antivirus::getLocalizeFileName(), "License"), yii::app()->baseUrl . "/docs/islovia_F_secure.pdf" ),
			"agree" => yii::t(Antivirus::getLocalizeFileName(), "Agree"),
			"message" => yii::t(Antivirus::getLocalizeFileName(),"ConfirmAssign", array(
				"{catdescr}" => $category->descr,
				"{above}" => Yii::app()->NumberFormatter->formatCurrency(
					$category->above, 
					Yii::app()->params["currency"]
				)
			))
		));
	}
	public function actionConfirmStop( $servid, $vgid, $tarid,  $catidx ) {
		$this->pageTitle = Yii::app()->name.' - '.Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus');
    		$this->breadcrumbs = array(
        		yii::t(Antivirus::getLocalizeFileName(), 'Antivirus') => $this->createUrl("default/index"),
			yii::t(Antivirus::getLocalizeFileName(),"StopConfirmation")
    		);
		$serviceData = $this->getModule()->Antivirus->getServiceData( $servid, $vgid, $tarid,  $catidx); 
		$this->render( "confirmstop", array(
			"title" => yii::t(Antivirus::getLocalizeFileName(),"StopConfirmation"),
			"url" => $this->createUrl("default/stop", array(
				"servid" => $servid,
                "vgid" => $vgid
			)),
			"message" => yii::t(Antivirus::getLocalizeFileName(),"ConfirmStop", array(
				"{catdescr}" => $serviceData->catdescr,
				"{key}" => $serviceData->service->externaldata
			))
		));
	}	

} ?>








