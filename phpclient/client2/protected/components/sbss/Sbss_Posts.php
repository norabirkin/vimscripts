<?php

class Sbss_Posts extends Sbss_Form {
    private $ticket;
    protected $defaultparam = 'defaultanswer';
    public function init() {
        $sbss = new Sbss_Tickets;
        $this->ticket = $sbss->getTicket($this->param('id'));
        if (!$this->ticket) {
            throw new Exception('Request is not found');
        }
        $this->statusid = $this->ticket->ticket->statusid;
        parent::init();
        if (!$this->statuses['current']) {
            throw new Exception('Status is not found. Please contact to manager.');
        }
    }
    public function title() {
        return $this->t('Subject of request').': '.$this->ticket->ticket->name;
    }
    public function output() {
        return yii::app()->controller->renderPartial('application.components.sbss.views.main', array(
            'ticket' => $this->ticket,
            'step' => $this,
            'form' => $this->statuses['current']->clientmodifyallow ? $this->fnext($this->formConfig())->render()  : ''
        ), true);
    }
}

?>
