<?php

class Internet_Shape extends LBWizardItem {
    private $shapes;
    private $tariff;
    public function getShape($vgroup) {
        $this->tariff = $this->tariff($vgroup->vgroup->tarifid);
        //$this->tariff = $this->f();
        $this->shapes = array(
            array(
                'descr' => $this->t('Shape of tariff'),
                'value' => LB_Style::kbToMb($this->tariff->tarif->shape)
            )
        );
        $this->addTimeShapes();
        $this->addSizeShapes();
        return $this->shapes;
    }
    /*private function f() {
        $tariff = new stdClass;
        $tariff->tarif = (object) array(
            'tarid' => 124,
            'actualtarid' => 0,
            'parentid' => 0,
            'shape' => 2048,
            'trafflimit' => 500,
            'trafflimitper' => 1,
            'type' => 0,
            'actblock' => 0,
            'archive' => 0,
            'priceplan' => 0,
            'trafftype' => 3,
            'dailyrent' => 0,
            'dynamicrent' => 0,
            'shapeprior' => 3,
            'unavaliable' => 0,
            'rentmultiply' => 0,
            'chargeincoming' => 0,
            'curid' => 1,
            'used' => 1,
            'voipblocklocal' => 0,
            'dynroute' => 0,
            'blockrentduration' => 0,
            'rent' => 500,
            'blockrent' => 100,
            'usrblockrent' => 0,
            'admblockrent' => 0,
            'coeflow' => 0,
            'coefhigh' => 2,
            'descr' => 'Фикс. без. 500/100  (мин. платеж 90р) (ночь ск. 15%)',
            'descrfull' => '',
            'symbol' => 'руб',
            'link' => '',
            'uuid' => '',
            'saledictionaryid' => 52,
            'additional' => 0,
        );
        $tariff->sizeshapes = array(
            ((object) array(
                'id' => 1160,
                'tarid' => 124,
                'amount' => 2048,
                'shaperate' => 1024             
            )),
            ((object) array(
                'id' => 1287,
                'tarid' => 124,
                'amount' => 3072,
                'shaperate' => 512
            ))
        );
        $tariff->timeshapes = array(
                ((object) array(
                    'id' => 187,
                    'tarid' => 124,
                    'shaperate' => 4096,
                    'sun' => 1,
                    'mon' => 1,
                    'tue' => 1,
                    'wed' => 1,
                    'thu' => 1,
                    'fri' => 1,
                    'sat' => 1,
                    'useweekend' => 0,
                    'timefrom' => '10:00:00',
                    'timeto' => '07:00:00',
                )),
                ((object) array(
                    'id' => 188,
                    'tarid' => 124,
                    'shaperate' => 3072,
                    'sun' => 1,
                    'mon' => 1,
                    'tue' => 1,
                    'wed' => 1,
                    'thu' => 1,
                    'fri' => 1,
                    'sat' => 1,
                    'useweekend' => 0,
                    'timefrom' => '05:00:00',
                    'timeto' => '07:00:00'
                ))
        );
        return $tariff;
    }*/
    private function addShapes($order, $field, $descr) {
        $shapes = $this->arr($this->tariff->$field);
        usort($shapes, array($this, $order));
        foreach ($shapes as $shape) {
            $this->shapes[] = array(
                'descr' => $this->$descr($shape),
                'value' => LB_Style::kbToMb($shape->shaperate)
            );
        }
    }
    private function orderByField($a, $b, $process) {
        $a = $this->$process($a);
        $b = $this->$process($b);
        if ($a > $b) {
            return 1;
        } elseif ($a < $b) {
            return -1;
        } elseif ($a == $b) {
            return 0;
        }
    }
    private function processSizeShape($obj) {
        return $obj->amount;
    }
    private function processTimeShape($obj) {
        return strtotime($obj->timefrom);
    }
    private function addTimeShapes() {
        $this->addShapes('orderByTimefrom', 'timeshapes', 'timeShapeDescr');
    }
    private function addSizeShapes() {
        $this->addShapes('orderByAmount', 'sizeshapes', 'sizeShapeDescr');
    }
    private function timeShapeDescr($item) {
        return $this->t('From {timefrom} to {timeto}', array(
            '{timefrom}' => substr($item->timefrom, 0, 5),
            '{timeto}' => substr($item->timeto, 0, 5)
        ));
    }
    private function sizeShapeDescr($item) {
        return $this->t('From {amount} Mb', array(
            '{amount}' => $item->amount
        ));
    }
    public function orderByTimefrom($a, $b) {
        return $this->orderByField($a, $b, 'processTimeShape');
    }
    public function orderByAmount($a, $b) {
        return $this->orderByField($a, $b, 'processSizeShape');
    }
}

?>
