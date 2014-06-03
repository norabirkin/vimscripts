<?php

class Internet_Statistics_Helper extends LBWizardItem {
    const BY_DAYS = 1;
    const BY_HOURS = 2;
    const BY_CATEGORIES = 3;
    const BY_ADDRESSES = 4;
    public function groupings() {
        return array(
            self::BY_DAYS => array(
                'repnum' => 1,
                'repdetail' => 1
            ),
            self::BY_HOURS => array(
                'repnum' => 1,
                'repdetail' => 2
            ),
            self::BY_CATEGORIES => array(
                'repnum' => 3,
                'repdetail' => 1
            ),
            self::BY_ADDRESSES => array(
                'repnum' => 3,
                'repdetail' => 2
            )
        );
    }
    public function titles() {
         return array(
            self::BY_DAYS => 'By days',
            self::BY_HOURS => 'By hours',
            self::BY_CATEGORIES => 'By categories',
            self::BY_ADDRESSES => 'By addresses'
        );
    }
    public function columns() {
        $columns = array(
            self::BY_DAYS => array(
                'dt' => 'Date',
                'volume_in' => 'Incoming traffic (Mb.)',
                'volume_out' => 'Outcoming traffic (Mb.)',
                'volume' => 'Traffic volume (Mb.)',
                'amount' => 'Traffic amount'
            ),
            self::BY_HOURS => array(
                'dt' => 'Date',
                'volume_in' => 'Incoming traffic (Mb.)',
                'volume_out' => 'Outcoming traffic (Mb.)',
                'volume' => 'Traffic volume (Mb.)',
                'amount' => 'Traffic amount'
            ),
            self::BY_CATEGORIES => array(
                'zone_descr' => 'Categories',
                'volume_in' => 'Incoming traffic (Mb.)',
                'volume_out' => 'Outcoming traffic (Mb.)',
                'volume' => 'Traffic volume (Mb.)',
                'amount' => 'Traffic amount'
            ),
            self::BY_ADDRESSES => array(
                'src_ip' => 'Address',
                'volume_in' => 'Incoming traffic (Mb.)',
                'volume_out' => 'Outcoming traffic (Mb.)',
                'volume' => 'Traffic volume (Mb.)',
                'amount' => 'Traffic amount'
            )
        );
        return $columns[$this->param('group', self::BY_DAYS)];
    }
    public function filter() {
        $groupings = $this->groupings();
        if (!isset($groupings[$this->param('group', self::BY_DAYS)])) {
            throw new Exception('Unknown grouping');
        }
        return $groupings[$this->param('group', self::BY_DAYS)];
    }
}

?>
