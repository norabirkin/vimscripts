<?php

class DTV_Equipment_NotBinded extends DTV_Equipment_BindedTo {
    public function output() {
        $table = $this->table(
            $this->helper()
            ->eq()
            ->idle(
                $this->vgroup(
                    $this->helper()
                    ->eq()
                    ->smartcard()
                    ->smartcard
                    ->vgid
                )
                ->vgroup
                ->agrmid
            )
        );
        $table->setTop(40);
        return $table->render();
    }
    protected function action($equipment) {
        return $this->lnext('Join', array(
            'equipid' => $equipment->equipment->equipid
        ));
    }
    protected function listData($data) {
        return $data;
    }
    protected function title() {
        return $this->wizard()->getCurrentStep()->title();
    }
}

?>
