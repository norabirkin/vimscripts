<?php

class Infoblock extends LBWizardItem {
    private function tariffChange() {
        if (!$this->config('tariff')) {
            return null;
        }
        return $this->g('getTarifsHistory', array(
            'flt' => array(
                'pgsize' => 1,
                'pgnum' => 1
            )
        ));
    }
    private function payment() {
        if (!$this->config('payment')) {
            return null;
        }
        return $this->g('getClientPayments', array(
            'flt' => array(
                'pgsize' => 1,
                'pgnum' => 1
            )
        ));
    }
    public function locks() {
        if (!$this->config('lock')) {
            return null;
        }
        return $this->dataCombine($this->g('getClientStat', array(
            'flt' => array(
                'repnum' => 12,
                'pgsize' => 1,
                'pgnum' => 1
            ),
            'ord' => array(
                'name' => 'timefrom',
                'ascdesc' => 1
            )
        )));
    }
    private function dataCombine($result) {
        if ($result = yii::app()->lanbilling->dataCombine($result->names->val, $result->data)) {
            return $result[0];
        } else {
            return array();
        }
    }
    public function messages() {
        if (!$this->config('message')) {
            return null;
        }
        return SharedPosts::getLast();
    }
    private function messageLimit() {
        return 20;
    }
    private function tariffChangeLink($item) {
        $vgroup = $this->vgroup($item->vgid);
        if (
            !($internet = Vgroup_Type::check(
                $vgroup,
                'internet'
            ))
            AND
            !($telephony = Vgroup_Type::check(
                $vgroup,
                'telephony'
            ))
        ) {
            return null;
        }
        if ($internet) {
            return array('internet/tariffHistory');
        } elseif ($telephony) {
            return array('telephony/tariffHistory');
        }
    }
    private function serv() {
        if (!$this->config('service')) {
            return null;
        }
        return $this->dataCombine($this->g('getClientStat', array(
            'flt' => array(
                'pgsize' => 1,
                'pgnum' => 1,
                'repnum' => 3,
                'repdetail' => 1,
                'userid' => Yii::app()->user->getId()
            ),
            'ord' => array(
                'name'    => 'period',
                'ascdesc' => 1
            )
        )));
        
    }
    private function config($param) {
        return (bool) yii::app()->params['infoblock'][$param];
    }
    public function data() {
        $data = array();
        if ($item = $this->tariffChange()) {
            try {
                $this->vgroup($item->vgid);
                $data[] = array(
                    'rawtime' => strtotime($item->changed),
                    'time' => $this->time($item->changed),
                    'descr' => ($tariffChangeLink = $this->tariffChangeLink($item)) ? CHtml::link($this->t('New tariff is {tariff}', array(
                        '{tariff}' => $item->tarnewname
                    )), $tariffChangeLink) : $this->t('New tariff is {tariff}', array(
                        '{tariff}' => $item->tarnewname
                    ))
                );
            } catch (Exception $e) {
            }
        }
        if ($item = $this->payment()) {
            $data[] = array(
                'rawtime' => strtotime($item->pay->paydate),
                'time' => $this->time($item->pay->paydate),
                'descr' => CHtml::link($this->t('Payment for amount {amount}', array(
                    '{amount}' => $this->price($item->pay->amount))
                ), array('payment/history'))
            );
        }
        if ($item = $this->locks()) {
            $data[] = array(
                'rawtime' => strtotime($item['timefrom']),
                'time' => $this->time($item['timefrom']),
                'descr' => CHtml::link($this->t('State "{state}" is applied for account "{vg_login}"', array(
                    '{state}' => $this->t(Block_Helper::stateDescription($item['block_type'])),
                    '{vg_login}' => $item['vg_login']
                )), array('block/index'))
            );
        }
        if ($item = $this->messages()) {
            mb_internal_encoding("UTF-8");
            $data[] = array(
                'rawtime' => strtotime($item->posttime),
                'time' => $this->time($item->posttime),
                'descr' => CHtml::link($this->t('Message recieved: {message}', array(
                    '{message}' => trim(mb_strlen($item->text) > $this->messageLimit() ? mb_substr($item->text, 0, ($this->messageLimit() - 3)).'...' : $item->text)
                )), $this->messageUrl($item))
            );
        }
        if ($item = $this->serv()) {
            $data[] = array(
                'rawtime' => strtotime($item['timefrom']),
                'time' => $this->time($item['timefrom']),
                'descr' => CHtml::link($this->t('Service "{service}" is assigned', array(
                    '{service}' => $item['zone_descr']
                )), array('invoice/charges'))
            );
        }
        usort($data, array(
            $this,
            'sort'
        ));
        return array_reverse($data);
    }
    public function time($time, $default = null) {
        return parent::time($time, $default);
    }
    public function sort($a, $b) {
        if ($a['rawtime'] > $b['rawtime']) {
            return 1;
        } elseif ($a['rawtime'] < $b['rawtime']) {
            return -1;
        } elseif ($a['rawtime'] == $b['rawtime']) {
            return 0;
        }
    }
    private function messageUrl($item) {
        return array('sharedposts/category'.$item->postcatid);
    }
}

?>
