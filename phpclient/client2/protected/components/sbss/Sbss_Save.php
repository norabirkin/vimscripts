<?php

class Sbss_Save extends LBWizardFinalStep {
    private $name;
    private $classid;
    public function execute() {
        $sbss = new Sbss_Tickets;
        if ($this->param('id')) {
            $ticket = $sbss->getTicket($this->param('id'));
            $classid = $ticket->ticket->classid;
            $name = $ticket->ticket->name;
        } else {
            $classid = $this->param('classid');
            $name = $this->param('name');
        }
        if (!$name) {
            throw new Exception('Subject is not specified');
        }
        if (!$this->param('text')) {
            throw new Exception('Text of message is not specified');
        }
        if (!($ticketid = $this->s('insupdSbssTicket', array(
            'id' => $this->param('id'),
            'responsibleman' => $this->responsible($classid),
            'classid' => $classid,
            'statusid' => $this->param('statusid'),
            'name' => $name,
            'vgid' => 0
        ), !$this->param('id')))) {
            return false;
        }
        if (!($postid = $this->s('insupdSbssPost', array(
            'id' => 0,
            'ticketid' => $ticketid,
            'text' => $this->param('text'),
            'spec' => 0
        ), true))) {
            return false;
        }
        $sbss->saveFile(array(
            'description' => $this->param('attach'),
            'ticketid' => $ticketid,
            'postid' => $postid,
            'file' => CUploadedFile::getInstanceByName('sbss_file')
        ));
        return true;
    }
    private function responsible($classid) {
        if (!$classid) {
            return (int) $this->option('sbss_ticket_superviser');
        }
        foreach ($this->a('getSbssRequestClasses') as $class) {
            if ($class->id == $classid) {
                return $class->responsibleman;
            }
        }
        return 0;
    }
    protected function getSuccessMessage() {
        return 'Message is successfully saved';
    }
    protected function getErrorMessage() {
        return 'Failed to save message';
    }
}

?>
