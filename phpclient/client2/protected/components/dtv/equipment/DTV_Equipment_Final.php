<?php

class DTV_Equipment_Final extends LBWizardFinalStep {
    public function execute() {
        $params = (array) $this->helper()
            ->eq()
            ->equipment(
                $this->param('equipid')
            )
            ->equipment;
        $params['cardid'] = $this->param('cardid');
        return $this->s('setCardEquipment', $params);
    }
    protected function getSuccessMessage() {
        if ($this->param('action') == 'join') {
            return 'Equipment successfully joined';
        } else {
            return 'Equipment successfully detached';
        }
    }
    protected function getErrorMessage() {
        if ($this->param('action') == 'join') {
            return 'Equipment join failed';
        } else {
            return 'Equipment detach failed';
        }
    }
}

?>
