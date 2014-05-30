<?php abstract class BaseGrid extends SoapListData {
    protected $usePagination = true;
    protected $id = '';
    protected $CSVMode = 0;
    protected $messagesCategory = '';
    protected $data = NULL;
    protected $title = '';
    protected $displayIfNoData = true;
    protected $getTitleFromLocaltizationMap = true;
    
    abstract protected function AddData();
    
    public function setID( $id ) {
        $this->id = $id;
    }

    public function setTitle( $title ) {
        $this->title = $title;
    }

    public function ClearData() {
        $this->data = NULL;
    }
    
    public function IsNoData() {
        try {
            $data = $this->__GetData();
        } catch (Exception $e) {
            return true;
        } 
        return empty($data);
    }
    
    public function SetDisplayIfNoData($displayIfNoData) {
        $this->displayIfNoData = (boolean) $displayIfNoData;
    }
    
    private function __GetData() {
        if ($this->data == NULL) {
            $this->AddData();
            if (!$this->data) throw new Exception();
        }
        return $this->data; 
    }
    
    protected function AddRow($row) {
        if(!is_array($this->data)) $this->data = array();
        $this->data[] = $row;
    }
    
    public function SetCSVMode() {
        $this->SetCSVMode = 1;
    }
    
    protected function getMessagesCategory() {
        return $this->messagesCategory;
    }   

    private function GetMessages() {
        $messages = array();
        $data = $this->__GetData();
        $dataRow = $data[0];
        foreach ($dataRow as $k => $v) $messages[$k] = yii::t($this->getMessagesCategory(),$k);
        return $messages;
    }
    
    private function IsPaginationRequired() {
        if (!$this->usePagination) return false;
        if (count($this->__GetData()) <= yii::app()->params['PageLimit']) return false;
        return true;
    }
    
    private function NotFoundMessage() {
        return '<div style="margin-bottom:40px;">'.yii::t($this->getMessagesCategory(), 'NotFound').'</div>';
    }
    
    protected function GetFooter() {
        return array();
    }
    
    public function Render() {
        if ($this->title) {
            $title = $this->getTitleFromLocaltizationMap ? yii::t($this->getMessagesCategory(),$this->title) : $this->title;
            $title = '<h4>'. $title .'</h4>';
        }
        else $title = '';   
        try {
            return $title.yii::app()->grid->get_grid($this->__GetData(),$this->GetMessages(),$this->IsPaginationRequired(),$this->id,$this->CSVMode,$this->GetFooter());
        } catch (Exception $e) {
            if ($this->displayIfNoData) return $title . $this->NotFoundMessage();
            else return '';
        }
    }
} ?>
