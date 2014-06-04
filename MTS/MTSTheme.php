<?php class MTSTheme extends Theme {
	protected $antivirusModuleParams = array (
		'title'=> 'МТС.Антивирус',
        'subscription' => 'Подписки на МТС.Антивирус',
		'license' => "Условия использования МТС.Антивирус"
	);
    public function BeforeContent($params) {
        return $this->breadcrumbs('breadcrumbs');
    }
    public function getClientScriptRegistration() {
        $this->import('components.ClientScriptRegistrationMTS');
        return new ClientScriptRegistrationMTS;
    }
    public function PageHeader($params) {
        return $this->render('BeforeUserMenu').$this->render('PageHeader');
    }
    public function getServiceFunctionWidgets() {
        $this->import('components.ServiceFunctionWidgetsMTS');
        return new ServiceFunctionWidgetsMTS;
    }
} ?>
