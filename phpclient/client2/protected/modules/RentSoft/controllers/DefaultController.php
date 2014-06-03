<?php class DefaultController extends Controller {
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_rentsoft'
            )
        ));
    }
	public function actionIndex($agrmid = 0,$rs_uri = '') {
        try {
            if (!$this->getModule()->rentsoft->checkAccess()) {
                // User MUST see the meaning of this error, but not only a blank page.
                die("Access is denied for this account (typicaly because of a wrong account.type).");
            }
            $this->getModule()->rentsoft->setAgrmid($agrmid);
            $this->getModule()->rentsoft->rs_uri = $rs_uri;
            $this->render('rentsoft',array(
                'title' => yii::t('RentSoftModule.rentsoft','Title'),
                'iframe' => $this->getModule()->rentsoft->iframe(),
                'agreementsListLabel' => yii::t('RentSoftModule.rentsoft','Agreement'),
                'agreementsList' => $this->getModule()->rentsoft->getAgreementsDropdownList(),
                'rentSoftOfAgreementUrls' => $this->getModule()->rentsoft->getRentSoftOfAgreementUrls()
            ));
        } catch (Exception $e) {
            $this->output(yii::t('main', 'Section is not available. Please contact to manager.'));
        }
	}
} ?>
