<?php

class DTV_Channels_Personal_Grids extends LBWizardStep {
    public function row($row) {
        return array(
            'catdescr' => $row->descr . LB_Style::info($row->link),
            'descrfull' => $row->descrfull,
            'above' => $this->price($row->above),
            'state' => $row->state == 'idle' ? $this->t('Not assigned') : $this->t('Assigned')
        );
    }
    public function columns() {
        return array(
            'catdescr' => 'Channel name',
            'descrfull' => 'Description',
            'above' => 'Above',
            'state' => 'State'
        );
    }
}

?>
