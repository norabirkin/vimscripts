<?php
class ProfileController extends Controller {
    const PRIVATE_PERSON = 2;
    const LEGAL_ENTITY = 1;
    public function actionIndex() {
        $menu = $this->getPage()->menu();
        $form = $this->form(array(
            array(
                'type' => 'hidden',
                'name' => 'r',
                'value' => 'profile/save'
            ),
            array(
                'type' => 'display',
                'value' => yii::app()->lanbilling->clientInfo->account->name,
                'label' => yii::app()->lanbilling->clientInfo->account->type == self::PRIVATE_PERSON ? 'Full name' : 'Company name'
            ),
            array(
                'type' => 'text',
                'value' => yii::app()->lanbilling->clientInfo->account->phone,
                'name' => 'phone',
                'label' => 'Phone'
            ),
            array(
                'type' => 'text',
                'value' => yii::app()->lanbilling->clientInfo->account->mobile,
                'name' => 'mobile',
                'label' => 'Mobile phone'
            ),
            array(
                'type' => 'text',
                'value' => yii::app()->lanbilling->clientInfo->account->email,
                'name' => 'email',
                'label' => 'E-Mail'
            ),
            array(
                'type' => 'display',
                'value' => $this->getAddress(),
                'label' => yii::app()->lanbilling->clientInfo->account->type == self::PRIVATE_PERSON ? 'Address of registration' : 'Address of bill delivery'
            )
        ));
        if (
            yii::app()->lanbilling->clientInfo->account->type == self::PRIVATE_PERSON
            AND
            yii::app()->params['showPersonalData']
        ) {
            $form->addItems(array(
                array(
                    'type' => 'custom',
                    'value' => '<h4>'.$this->t('Passport data').'</h4>'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->passsernum,
                    'label' => 'Series'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->passno,
                    'label' => 'Number'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->passissuedate,
                    'label' => 'Date'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->passissuedep,
                    'label' => 'Given by'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->passissueplace,
                    'label' => 'Place of giving'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->birthdate,
                    'label' => 'Birth date'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->inn,
                    'label' => 'ITN'
                )
            ));
        } elseif (yii::app()->lanbilling->clientInfo->account->type == self::LEGAL_ENTITY) {
            $form->addItems(array(
                array(
                    'type' => 'custom',
                    'value' => '<h4>'.$this->t('Bank details').'</h4>' 
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'bankname',
                    'value' => yii::app()->lanbilling->clientInfo->account->bankname,
                    'label' => 'Bank name'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'branchbankname',
                    'value' => yii::app()->lanbilling->clientInfo->account->branchbankname,
                    'label' => 'Branch bank name'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'bik',
                    'value' => yii::app()->lanbilling->clientInfo->account->bik,
                    'label' => 'BIK'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'settl',
                    'value' => yii::app()->lanbilling->clientInfo->account->settl,
                    'label' => 'Settl. bill'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'corr',
                    'value' => yii::app()->lanbilling->clientInfo->account->corr,
                    'label' => 'Corr. bill'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'inn',
                    'value' => yii::app()->lanbilling->clientInfo->account->inn,
                    'label' => 'TIN'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'ogrn',
                    'value' => yii::app()->lanbilling->clientInfo->account->ogrn,
                    'label' => 'OGRN'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'kpp',
                    'value' => yii::app()->lanbilling->clientInfo->account->kpp,
                    'label' => 'KPP'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'okpo',
                    'value' => yii::app()->lanbilling->clientInfo->account->okpo,
                    'label' => 'OKPO'
                ),
                array(
                    'type' => yii::app()->params['editBankDetails'] ? 'text' : 'display',
                    'name' => 'okved',
                    'value' => yii::app()->lanbilling->clientInfo->account->okved,
                    'label' => 'OKVED'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->treasuryname,
                    'label' => 'Treasury name'
                ),
                array(
                    'type' => 'display',
                    'value' => yii::app()->lanbilling->clientInfo->account->treasuryaccount,
                    'label' => 'Treasury account'
                )
            ));
        }
        $form->add(array(
            'type' => 'submit',
            'value' => 'Save'
        ));
        $this->output(
            $this->mask('#phone').
            $this->mask('#mobile').
            $menu.
            $form->render()
        );
    }
    public function actionSave() {
        $params = array(
            'userid' => yii::app()->lanbilling->client,
            'login' => yii::app()->lanbilling->clientInfo->account->login,
            'pass' => yii::app()->lanbilling->clientInfo->account->pass,
            'kontperson' => yii::app()->lanbilling->clientInfo->account->kontperson,
            'bankname' => yii::app()->lanbilling->clientInfo->account->bankname,
            'branchbankname' => yii::app()->lanbilling->clientInfo->account->branchbankname,
            'bik' => yii::app()->lanbilling->clientInfo->account->bik,
            'settl' => yii::app()->lanbilling->clientInfo->account->settl,
            'corr' => yii::app()->lanbilling->clientInfo->account->corr,
            'inn' => yii::app()->lanbilling->clientInfo->account->inn,
            'ogrn' => yii::app()->lanbilling->clientInfo->account->ogrn,
            'kpp' => yii::app()->lanbilling->clientInfo->account->kpp,
            'okpo' => yii::app()->lanbilling->clientInfo->account->okpo,
            'okved' => yii::app()->lanbilling->clientInfo->account->okved
        );
        $fields = array('email', 'phone', 'mobile');
        if (yii::app()->params['editBankDetails']) {
            $fields = array_merge($fields, array(
                'bankname',
                'branchbankname',
                'bik',
                'settl',
                'corr',
                'inn',
                'ogrn',
                'kpp',
                'okpo',
                'okved'
            ));
        }
        foreach ($fields as $param) {
            if (yii::app()->request->getParam($param, '')) {
                $params[$param] = yii::app()->request->getParam($param, '');
            }
        }
        if (yii::app()->lanbilling->save('setClientInfo', $params)) {
            yii::app()->user->setFlash('success', $this->t('Data is successfully saved'));
        } else {
            yii::app()->user->setFlash('error', $this->t('Failed to save data'));
        }
        $this->redirect(array('profile/index'));
    }
    private function mask($id) {
        return  '<script type="text/javascript">'.
                    '$(document).ready(function(){'.
                        str_replace('{id}', $id, Profile_PhoneMask::script()).
                    '});'.
                '</script>';
    }
    private function getAddress() {
        $addresses = yii::app()->lanbilling->clientInfo->addresses;
        if (!$addresses) {
            $addresses = array();
        }
        if (!is_array($addresses)) {
            $addresses = array($addresses);
        }
        foreach ($addresses as $item) {
            if (
                $item->type == (
                    yii::app()->lanbilling->clientInfo->account->type == self::PRIVATE_PERSON ? 0 : 2
                )
            ) {
                return $item->address;
            }
        }
        return '';
    }
}
