<?php class Sbss {
    protected function getFiles($post) {
        $files = $this->arr($post->files);
        if (!$files) return '';
        $grid = new Table(array(
            'title' => 'There are linked files',
            'localization' => 'knowledgebase',
            'processor' => array($this, 'processFileData'),
            'columns' => array(
                'editedon' => 'Date',
                'description' => 'Description',
                'originalname' => 'File',
                'size' => 'Size (Kb)',
                'link' => ''
            ),
            'data' => $files
        ));
        return $grid->render();
    }
    public function processFileData( $row ) {
        $row->link = CHtml::link(
            Yii::t('knowledgebase', 'Download'),
            array(
                $this->downloadAction(),
                'id' => $row->id,
                'originalname' => $row->originalname
            )
        );
        $row->editedon = yii::app()->controller->formatDateWithTime($row->editedon);
        return $row;
    }
    protected function getFilePath($id) {
        $folder = yii::app()->controller->lanbilling->getOption('sbss_ticket_files');
        $path = $folder . '/' . sprintf($this->template(), $id);
        return $path;
    }
    protected function arr($val) {
        if (!$val) {
            return array();
        }
        if (!is_array($val)) {
            return array($val);
        }
        return $val;
    }
    public function download($id, $originalname) {
        $path = $this->getFilePath($id);
        if (file_exists($path)) {
            yii::app()->request->sendFile($originalname, file_get_contents($path));
            yii::app()->end();
        } 
        yii::app()->user->setFlash('error',Yii::t('documents','NoFile'));
        $this->onError();
    }
} ?>
