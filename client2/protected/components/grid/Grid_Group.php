<?php

class Grid_Group {
    private $items = array();
    public function __construct($items) {
        foreach ($items as $item) {
            if ($item) {
                $this->add($item);
            }
        }
    }
    public function add(Table $grid) {
        $this->items[] = $grid;
    }
    public function render() {
        if (!$this->items) {
            return '';
        }
        $items = '';
        foreach ($this->items as $grid) {
            if (!($data = $grid->getRenderData())) {
                continue;
            }
            $items .= yii::app()->controller->renderPartial('application.components.table.item', array_merge(
                array(
                    'colspan' => count($grid->getColumns())
                ),
                $data
            ), true);
        }
        return $items ? yii::app()->controller->renderPartial('application.components.table.group', array(
            'items' => $items
        ), true) : '';
    }
}

?>
