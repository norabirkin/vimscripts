<?php

class Other_Date_Assign_Nonrecurrent extends Other_Confirm_Nonrecurrent {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Choose date of service assgnment'
        ));
    }
    protected function __form() {
        return $this->helper()->dateField(parent::__form());
    }
}

?>
