<?php

class Other_Confirm_Assign_Nonrecurrent extends Other_Confirm_Nonrecurrent {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Confirm service ordering'
        ));
    }
    protected function __form() {
        return $this->helper()->dateDisplay(parent::__form());
    }
}

?>
