<?php

class DTV_Channels_Personal_Confirm extends DTV_Channels_Personal_Grids {
    private $data;
    private function assign() {
        $total = 0;
        $data = array();
        foreach ($this->helper()->personal('assign') as $service) {
            $total += $service->above;
            $data[] = $this->row($service);
        }
        if (!$data) {
            return array();
        }
        $data[] = array(
            'catdescr' => $this->t('Total:'),
            'descrfull' => '',
            'above' => $this->price($total),
            'state' => ''
        );
        return $data;
    }
    public function output() {
        $assign = $this->assign();
        $stop = $this->helper()->personal('stop');
        if (!$assign AND !$stop) {
            throw new Exception('Services state was not changed');
        }
        return $this->grid(array(
            'title' => 'Channels that would be added',
            'columns' => $this->columns(),
            'data' => $assign
        ))->render() .
        $this->grid(array(
            'title' => 'Channels that would be stopped',
            'columns' => $this->columns(),
            'data' => $stop,
            'processor' => array($this, 'row')
        ))->render() .
        $this->fnext(array(
            array(
                'type' => 'submit',
                'value' => 'Confirm'
            )
        ))->render();
    }
    public function title() {
        return 'Updating of channels list';
    }
}

?>
