<?php
class PaymentFormatRegExp {

    private $items;
    private $last;
    private $index;
    private $str;

    public function get( $format ) {
        if (!$this->loadFormat($format)) {
            return ".*";
        }
        foreach ($this->items as $item) {
            $this->addItemTpl($item);
        }
        return $this->str;
    }

    private function loadFormat( $format ) {
        $this->init();
        if (!$format) {
            return false;
        }
        for ($i = 0, $length = mb_strlen($format, 'utf8'); $i < $length; $i ++) {
            $this->push($format[$i]);
        }
        return true;
    }

    private function push($char) {
        $tpl = $this->charToTpl($char);
        if (!$tpl) {
            $this->add($char, $char);
        } else {
            if ($this->last["char"] == $char) {
                $this->update();
            } else {
                $this->add($char, $tpl);
            }
        }
    }

    private function charToTpl( $char ) {
        $reference = array(
            'A' => $this->letter(),
            '#' => $this->digit()
        );
        if (isset($reference[$char])) {
            return $reference[$char];
        } else {
            return null;
        }
    }

    private function add($char, $tpl) {
        $this->items[] = array("tpl" => $tpl, "count" => 1);
        $this->last["char"] = $char;
        $this->last["index"] = $this->index;
        $this->index ++;
    }

    private function update() {
        $this->items[ count($this->items) - 1 ]["count"] ++;
    }

    private function addItemTpl( $item ) {
        $this->str .= $item["tpl"] . $this->occurrencesCount( $item );
    }

    private function occurrencesCount( $item ) {
        if ($item["count"] > 1) {
            return '{' . $item["count"] . '}';
        } else {
            return '';
        }
    }

    private function init() {
        $this->items = array();
        $this->last = array("char" => "", "index" => 0);
        $this->index = 0;
        $this->str = "";
    }

    private function letter() {
        return '[A-z0-9А-я]';
    }

    private function digit() {
        return '[0-9]';
    }

} ?>
