<?php

class Antivirus_Services_Grid extends DTV_Services_Grid {
    public function stop($row) {
        if ($error = $this->error($row)) {
            return $error;
        }
        
        if ($this->helper()->isActive($row)) {
            $labelText = Yii::t('antivirus', 'Stop service');
        } else {
            $labelText = Yii::t('antivirus', 'Delete key');
        }
        return $this->lnext($labelText, array(
            'servid' => $row->service->servid
        ));
    }
}

?>
