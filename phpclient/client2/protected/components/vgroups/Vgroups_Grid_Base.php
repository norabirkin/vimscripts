<?php

class Vgroups_Grid_Base extends LBWizardStep {
    protected $hideOnEmpty = true;
    public function row($row) {
        throw new Exception('define row method');
    }
    protected function columns() {
        throw new Exception('define columns method');
    }
    protected function gridTitle($v) {
        return LB_Style::agrmTitle($v->agrmid);
    }
    public function output() {
        $html = '';
        foreach($this->lb()->agreements as $k => $v) {
            $html .= $this->grid(array(
                'title' => $this->gridTitle($v),
                'columns' => $this->columns(),
                'data' => $this->vgroups($k),
                'hideOnEmpty' => $this->hideOnEmpty,
                'processor' => array($this, 'row')
            ))->render();
        }
        if (!$html) {
            return $this->t('Nothing found');
        }
        return $html;
    }
    public function title() {
        return 'Choose account';
    }
}

?>
