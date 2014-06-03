<?php

class Antivirus_Assign extends DTV_Additional_Assign {
    protected function getSuccessMessage() {
        return yii::t('antivirus','Key is successfully generated. For continue press link on key field'); 
    }
    protected function getErrorMessage() {
        return 'Failed to assign servie';
    }
}

?>