<?php

class Payment_Agreements extends LBWizardStep {
    private $title = 'Choose agreement';
    private $all = false;
    private $description;
    public function __construct($params = null) {
    	if (!$params) {
    		return;
    	}
        $this->title = (string) $params['title'];
        $this->all = (bool) $params['all'];
        $this->description = (string) $params['description'];
    }
    private function data() {
        $data = array();
        $total = 0;
        foreach ($this->lb()->agreements as $item) {
            $total += $item->balance;
            $data[] = $this->agrm($item);
        }
        if ($this->all) {
            array_unshift($data, $this->all($total));
        }
        return $data;
    }
    private function agrm($item) {
        return array(
            'number' => $this->lnext(
                $item->number,
                array('agrmid' => $item->agrmid)
            ),
            'balance' => $this->price($item->balance)
        );
    }
    private function all($total) {
        return array(
            'number' => $this->lnext(
                'All agreements',
                array('agrmid' => 0)
            ),
            'balance' => $this->price($total)
        );
    }
    public function output() {
        return (
            $this->description ? $this->description.'<br/><br/>' : ''
        ) . $this->grid(array(
            'title' => $this->title,
            'columns' => array(
                'number' => 'Agreement number',
                'balance' => 'Balance'
            ),
            'data' => $this->data()
        ))->render();
    }
    public function title() {
        return yii::t('payment', 'Choosing agreement');
    }
}

?>
