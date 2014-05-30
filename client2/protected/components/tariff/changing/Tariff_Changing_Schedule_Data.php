<?php

class Tariff_Changing_Schedule_Data extends LBWizardItem {
    private $data;
    public function __construct($wizard) {
        $this->setWizard($wizard);
    }
    public function sortSchedule($a, $b) {
        $a = strtotime($a->changetime);
        $b = strtotime($b->changetime);
        if ($a < $b) {
            return -1;
        } elseif ($a > $b) {
            return 1;
        } elseif ($a == $b) {
            return 0;
        }
    }
    private function sort($data) {
        usort($data, array($this, 'sortSchedule'));
        return $data;
    }
    private function vgroupSchedule($vgroup) {
        if (!$this->wizard()->action()->tariffType($vgroup)) {
            return array();
        }
        return $this->sort($this->arr($vgroup->tarrasp));
    }
    private function addVgroupScheduleItems($vgroup) {
        $taridold = $vgroup->vgroup->tarifid;
        $taroldname = $vgroup->vgroup->tarifdescr;
        foreach ($this->vgroupSchedule($vgroup) as $plan) {
            $plan->taroldname = $taroldname;
            $plan->taridold = $taridold;
            $this->data[] = $plan;
            $taroldname = $plan->tarnewname;
            $taridold = $plan->taridnew;
        }
    }
    private function rent($id) {
        try {
            return ' ('.$this->price($this->tariff($id)->tarif->rent).')';
        } catch (Exception $e) {
            return '';
        }
    }
    public function row($row) {
        return array(
            'vglogin' => $row->vglogin,
            'changetime' => $this->time($row->changetime),
            'requestby' => $this->helper()->requestby($row),
            'taroldname' => $row->taroldname . $this->rent($row->taridold),
            'tarnewname' => $row->tarnewname . $this->rent($row->taridnew),
            'recordid' => $this->drop($row)
        );
    }
    private function drop($row) {
        if ($this->helper()->byUser($row)) {
            return $this->lnext('Remove from schedule', array(
                'recordid' => $row->recordid
            ));
        } else {
            return '';
        }
    }
    public function data() {
        $this->data = array();
        foreach ($this->vgroups() as $vgroup) {
            $this->addVgroupScheduleItems($vgroup);
        }
        return $this->sort($this->data);
    }
}

?>
