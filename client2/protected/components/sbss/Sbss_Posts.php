<?php

class Sbss_Posts extends LBWizardStep {
    private $ticket;
    public function init() {
        $tickets = new Sbss_Tickets;
        $this->ticket = $tickets->getTicket($this->param('id'));
    }
    public function output() {
        return yii::app()->controller->renderPartial('application.components.sbss.views.main', array(
            'ticket' => $this->ticket,
            'step' => $this,
            'form' => $this->form(array(
                array(
                    'type' => 'select',
                    'data' => $this->statuses(),
                    'value' => $this->status(),
                    'label' => 'Status of request'
                ),
                array(
                    'type' => 'textarea',
                    'label' => 'Message'
                )
            ))->render()
        ), true);
    }
    public function statuses() {
        $data = array();
        foreach ($this->helper()->statuses() as $status) {
            if ($status->type == 3 || $status->type == 0) {
                $data[$status->id] = $status->descr;
            }
        }
        return $data;
    }
    public function status() {
        return 0;
    }
    public function title() {
        return $this->t('Subject of request').': '.$this->ticket->ticket->name;
    }
}

?>
