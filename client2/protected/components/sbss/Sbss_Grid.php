<?php

class Sbss_Grid extends LBWizardStep {
    private function data() {
        return Sbss_Helper::fakeTickets();
        return $this->a('getSbssTickets');
    }
    public function row($row) {
        return array(
            'id' => $row->id,
            'name' => $this->lnext($row->name, array(
                'id' => $row->id
            )),
            'respondentname' => $row->respondentname,
            'lastpost' => $this->time($row->lastpost),
            'status' => $this->status($row->statusid)
        );
    }
    private function status($id) {
        return 
            '<span style="'.
                'color: #'.
                $this->helper()->status($id)->color.
            '">'.
                $this->helper()->status($id)->descr.
            '</span>';
    }
    public function output() {
        return $this->grid(array(
            'title' => 'Requests',
            'columns' => array(
                'id' => 'ID',
                'name' => 'Request title',
                'respondentname' => 'Last',
                'lastpost' => 'ResponseTime',
                'status' => 'State'
            ),
            'data' => $this->data(),
            'processor' => array($this, 'row')
        ))->render();
    }
}

?>
