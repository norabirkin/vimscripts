<?php class DefaultController extends Controller {
    public function actionIndex() {
        try {
            $this->output($this->getModule()->t(
                "To access Your Billing platform follow these links:".
                "<br />".
                "<br />".
                "- Interface for the managers: <a href=\"{schema}://{subdomain}.{platform_url}/admin/\">{schema}://{subdomain}.{platform_url}/admin/</a>.".
                "<br />".
                "<br />".
                "Login: admin".
                "<br />".
                "<br />".
                "- Interface for the clients: <a href=\"{schema}://{subdomain}.{platform_url}/client/\">{schema}://{subdomain}.{platform_url}/client/</a>.", $this->data()
            ));
        } catch (Exception $e) {
            $this->output($e->getMessage());
        }
    }
    private function data() {
        return array(
            '{schema}' => 'http',
            '{subdomain}' => $this->subdomain(),
            '{platform_url}' => 'saas.mediabilling.net',
            '{subscription_url}' => 'client.mediabilling.net'
        );
    }
    private function subdomain() {
        $vgroups = new Vgroups_Data;
        $vgids = array();
        foreach ($vgroups->vgroups() as $vgroup) {
            $vgids[] = $vgroup->vgroup->vgid;
        }
        if (!$vgids) {
            throw new Exception($this->getModule()->t('Vgroups not found'));
        }
        return $vgroups->vgroup(min($vgids))->vgroup->login;
    }
} ?>
