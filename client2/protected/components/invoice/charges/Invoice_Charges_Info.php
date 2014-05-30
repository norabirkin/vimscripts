<?php

class Invoice_Charges_Info extends Statistics_Page {
    protected function servData($tarTotal) {
        return $this->p('getClientStat', array(
            'flt' => array(
                'repnum' => 3,
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'repdetail' => 1,
                'agrmid' => $this->agrmid(),
                'vgid' => $this->param('vgid', 0),
                "userid" => Yii::app()->user->getId()
            ),
            'ord' => array(
                'name'    => 'period',
                'ascdesc' => 1
            )
        ), array(
                'stat' => true
        ))->maxTotal($tarTotal);
    }
    protected function tarData() {
        return $this->p('getClientStat', array(
            'flt' => array(
                'repnum'    => 4,
                'dtfrom' => $this->dtfrom(),
                'dtto' => $this->dtto(),
                'agrmid' =>  $this->agrmid(),
                'vgid' => $this->param('vgid', 0),
                'repdetail' => 2,
                "userid" => Yii::app()->user->getId()
            ),
            'ord' => array(
                'name'    => 'period',
                'ascdesc' => 1
            )
        ), array(
            'stat' => true
        ));
         
    }
    public function servRow($row) {
        $data = array(
            'amount' =>  $this->price($row["amount"]),
            'volume' => $row["volume"],
            'zone_descr' => $row["zone_descr"]
        );
        if (yii::app()->params['utility_stat_enabled']) {
            if (yii::app()->params['utility_stat_external']) {
                $data['external_data'] = $row['external_data'];
            }
            if (yii::app()->params['utility_stat_date']) {
                $data['timefrom'] = $this->date($row['timefrom']);
            }
        }
        return $data;
    }
    private function firstCol($title) {
        return array(
            'width' => '33%',
            'title' => $title
        );
    }
    protected function  servTable($tarTotal) {
        $columns = array(
            'zone_descr' => $this->firstCol('Service')
        );
        if (yii::app()->params['utility_stat_enabled']) {
            if (yii::app()->params['utility_stat_external']) {
                $columns['external_data'] = yii::app()->params['utility_stat_external_name'];
            }
            if (yii::app()->params['utility_stat_date']) {
                $columns['timefrom'] = yii::app()->params['utility_stat_date_name'];
            }
        }
        $columns['amount'] = 'Charges';
        return $this->grid(array(
            'columns' => $columns,
            'top' => 40,
            'data' => $this->servData($tarTotal),
            'processor' => array($this, 'servRow'),
            'hideOnEmpty' => true
        ));
    }
    protected function  table() {
        return '';
    }
    protected function  tarTable() {
        $columns = array(
            'tar_descr' => $this->firstCol('Tariff')
        );
        if (yii::app()->params['utility_stat_enabled']) {
            if (yii::app()->params['utility_stat_external']) {
                $columns['empty1'] = '';
            }
            if (yii::app()->params['utility_stat_date']) {
                $columns['empty2'] = '';
            }
        }
        $columns['amount'] = 'Charges';
        return $this->grid(array(
            'title' => 'Expenses',
            'columns' => $columns,
            'data' => $this->tarData(),
            'top' => 40,
            'processor' => array($this, 'tarRow'),
            'displayPaging' => false,
            'hideOnEmpty' => true
        ));
    }
    public function tarRow($row) {
        $data = array(
            'amount' =>  $this->price($row['amount']),
            'tar_descr' => $row['tar_descr']
        );
        if (yii::app()->params['utility_stat_enabled']) {
            if (yii::app()->params['utility_stat_external']) {
                $data['empty1'] = '';
            }
            if (yii::app()->params['utility_stat_date']) {
                $data['empty2'] = '';
            }
        }
        return $data;
    }
    protected function itemLogin() {
        return '';
    }

    protected function dtfrom() {
        if (!yii::app()->params['use_month_and_year_selects_on_charges_page']) {
            return parent::dtfrom();
        } else {
            return $this->param('period', date('Y-m')) . '-01';
        }
    }

    protected function dtto() {
        if (!yii::app()->params['use_month_and_year_selects_on_charges_page']) {
            return parent::dtto();
        } else {
            return date('Y-m-d', $this->nextMonthFirstDay(strtotime($this->dtfrom())));
        }
    }

    public function output() {
        $tarTb = $this->tarTable();
        $tarTotal = $tarTb->getPagingTotal();
        $servTb = $this->servTable($tarTotal);
        return $this->getFilterForm() . $this->gridGroup(array(
            $tarTb,
            $servTb
        ))->render();
    }
    private function vgroupsSelectData() {
        $data = array(
            0 => $this->t('All accounts')
        );
        foreach ($this->vgroups($this->param('agrmid')) as $vgroup) {
            $data[$vgroup->vgroup->vgid] = $vgroup->vgroup->login;
        }
        return $data;
    }
    protected function yearField() {
        if (!yii::app()->params['use_month_and_year_selects_on_charges_page']) {
            return null;
        }
        $years = array();
        for ($i = 0; $i < 10; $i ++) {
            $years[date('Y') - $i] = date('Y') - $i;
        }
        return array(
            'type' => 'select',
            'name' => 'year',
            'value' => $this->param('year', date('Y')),
            'label' => 'Year',
            'data' => $years
        );
    }
    protected function monthField() {
        if (!yii::app()->params['use_month_and_year_selects_on_charges_page']) {
            return null;
        }
        return array(
            'type' => 'select',
            'label' => 'Month',
            'name' => 'month',
            'data' => array(
                '01' => yii::t('main', 'January'),
                '02' => yii::t('main', 'February'),
                '03' => yii::t('main', 'March'),
                '04' => yii::t('main', 'April'),
                '05' => yii::t('main', 'May'),
                '06' => yii::t('main', 'June'),
                '07' => yii::t('main', 'July'),
                '08' => yii::t('main', 'August'),
                '09' => yii::t('main', 'September'),
                '10' => yii::t('main', 'October'),
                '11' => yii::t('main', 'November'),
                '12' => yii::t('main', 'December')
            ),
            'value' => $this->param('month', date('m'))
        );
    }
    protected function accountField() {
        return array(
            'type' => 'select',
            'data' => $this->vgroupsSelectData(),
            'name' => 'vgid',
            'label' => 'Account',
            'value' => $this->param('vgid', 0)
        );
    }
    protected function agreementField() {
        return array(
            'type' => 'select',
            'data' => $this->agreementSelectData(),
            'value' => $this->param('agrmid', 0),
            'label' => 'Agreement',
            'name' => 'agrmid'
        );
    }
    protected function periodField() {
        if (yii::app()->params['use_month_and_year_selects_on_charges_page']) {
            return array(
                'type' => 'month',
                'name' => 'period',
                'value' => substr($this->dtfrom(), 0, 7),
                'label' => 'Period'
            );
        } else {
            return array(
                'type' => 'servicePeriod',
                'dtto' => $this->dtto(),
                'dtfrom' => $this->dtfrom(),
                'label' => 'Period'
            );
        }
    }
    protected function getFilterForm() {
        return $this->fcurr(array(
            $this->agreementField(),
            $this->accountField(),
            $this->periodField(),
            array(
                'type' => 'submit',
                'value' => 'Apply'
            )
        ))->render();
    }
    protected function agrmid() {
        return $this->param('agrmid', 0);
    }
    
}

?>
