<?php

class Sbss_Tickets extends Sbss {
    protected function downloadAction() {
        return 'helpdesk/download';
    }
    protected function onError() {
        yii::app()->controller->redirect(array('helpdesk/index'));
    }
    protected function template() {
        return yii::app()->controller->lanbilling->postFileTemplate;
    }
    private function fake() {
        yii::import('application.components.sbss.*');
        $ticket = Sbss_Helper::fakePosts();
        return $ticket;
    }
    private function api($id) {
        yii::app()->controller->lanbilling->get('setClientMessagesViewed', array(
            'flt' => array(
                'recordid' => $id
            )
        ));
        $ticket = yii::app()->controller->lanbilling->get('getSbssTicket', array(
            'id' => $id
        ));
        return $ticket;
    }
    public function getTicket($id) {
        //$ticket = $this->fake();
        $ticket = $this->api($id);
        $ticket->posts = $this->getPosts($ticket);
        return $ticket;
    }
    public function getPosts($ticket) {
        foreach (($posts = $this->arr($ticket->posts)) as $k => $v) {
            $posts[$k]->files = $this->getFiles($posts[$k]);
        }
        return $posts;
    }
    public function saveFile($params) {
        if ($params['file']) {
            if (!$this->doSaveFile($params)) {
                Yii::app()->user->setFlash('error',Yii::t('support','Failed to upload file'));
            }
        }
    }
    private function getFileName(CUploadedFile $file) {
        return $file->getName();
    }
    private function getFileSize(CUploadedFile $file) {
        return $file->getSize();
    }
    private function saveFileAs(CUploadedFile $file, $name) {
        return $file->saveAs($name);
    }
    private function doSaveFile($params) {
        if (!$params['ticketid'] OR !$params['postid']) {
            throw new Exception('Invalid params');
        }
        if (!yii::app()->controller->lanbilling->save('insupdSbssPostFile', array(
            'id' => 0,
            'ticketid' => $params['ticketid'],
            'postid' => $params['postid'],
            'authortype' => 1,
            'editedtype' => 1,
            'size' => $this->getFileSize($params['file']),
            'originalname' => $this->getFileName($params['file']),
            'description' => $params['description']
        ))) {
            return false;
        }
        if (!$this->saveFileAs($params['file'], $this->getFilePath(yii::app()->controller->lanbilling->saveReturns->ret))) {
            return false;
        }
        return true;
    }
}

?>
