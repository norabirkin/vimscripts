<?php

class DTV_Services_Grid extends LBWizardItem {
    private $categories;
    private $usbox;
    private $dtvtype;
    private $activeTitle;
    private $idleTitle;
    private $catdescrTitle;
    private $defaultTitle;
    private $top = 0;
    private $callback;
    private $multiple = false;
    private $defaultTimefrom = '----';
    private $defaultTimeto = '----';
    private $periodic = true;
    public function __construct($params) {
        if (is_object($params)) {
            $this->setWizard($params);
            return;
        }
        if (isset($params['periodic'])) {
            $this->periodic = (bool) $params['periodic'];
        }
        $this->multiple = (bool) $params['multiple'];
        $this->dtvtype = (int) $params['dtvtype'];
        $this->activeTitle = (string) $params['title']['active'];
        $this->idleTitle = (string) $params['title']['idle'];
        $this->catdescrTitle = (string) $params['title']['catdescr'];
        if (!$this->catdescrTitle) {
            $this->catdescrTitle = 'Service name';
        }
        $this->defaultTitle = (string) $params['title']['title'];
        $this->top = (int) $params['top'];
        $this->setWizard($params['wizard']);
        if ($params['defaultTimefrom']) {
            $this->defaultTimefrom = $params['defaultTimefrom'];
        }
        if ($params['defaultTimeto']) {
            $this->defaultTimeto = $params['defaultTimeto'];
        }
    }
    public function setWizard(LBWizard $wizard) {
        $this->wizard = $wizard;
    }
    public function row($row) {
        $row = clone $row;
        if ($this->callback) {
            $object = $this->callback[0];
            $method = $this->callback[1];
            if (!($row = $object->$method($row))) {
                return null;
            }
        }
        if ($row->service) {
            if ($row->timefrom === false) {
                $row->timefrom = '';
            } else {
                $row->timefrom = $this->time($row->service->timefrom, $this->defaultTimefrom);
            }
            if ($row->timeto === false) {
                $row->timeto = '';
            } else {
                $row->timeto = $this->time($row->service->timeto, $this->defaultTimeto);
            }
        }
        $row->catdescr = $this->catdescr($row);
        $row->above = $this->price($row->above);
        $row->action = $this->error($row);
        return $row;
    }
    public function tarifdescr($row) {
        return $this->vgroup()->vgroup->tarifdescr;
    }
    public function catdescr($row) {
        return $row->descr . LB_Style::info($row->link);
    }
    public function error($row) {
        return $row->error ? LB_Style::warning($row->error) : ($row->action ? $row->action : '');
    }
    public function stop($row) {
        if ($error = $this->error($row)) {
            return $error;
        }
        $stopParams = array(
            'servid' => $row->service->servid,
            'common' => $row->common
        );
        if ($row->state) {
        	$stopParams['state'] = $row->state;
        }
        return $this->lnext('Stop', $stopParams);
    }
    public function processAvailable($row) {
        if (!$result = $this->row($row)) {
            return null;
        }
        if ($result->action) {
            return $result;
        }
        $result->action = $this->lnext('Assign', array(
            'catidx' => $row->catidx,
            'common' => $row->common
        ));
        return $result;
    }
    public function processAssigned($row) {
        if (!($result = $this->row($row))) {
            return null;
        }
        if ($result->action) {
            return $result;
        }
        $result->action = $this->stop($row);
        return $result;
    }
    public function modifyColumns($callback, $active = false) {
        $obj = $callback[0];
        $method = $callback[1];
        return $obj->$method($this->columns($active));
    }
    public function active($params = array()) {
        $data = ($params['multiple'] OR $this->multiple) ? $this->usbox()->active() : $this->categories()->active();
        $this->callback = $params['processor'];
        $html = $this->grid(array(
            'title' => $params['title'] ? $params['title'] : $this->activeTitle,
            'top' => $params['top'] ? $params['top'] : $this->top,
            'columns' => $params['columns'] ? $this->modifyColumns($params['columns'], true) : $this->columns(true),
            'data' => $params['data'] ? $params['data'] : $data,
            'hideOnEmpty' => $params['hideOnEmpty'],
            'processor' => array($this, 'processAssigned')
        ))->render();
        $this->callback = null;
        return $html;
    }
    public function idle($params = array()) {
        if (isset($params['data'])) {
            $data = $params['data'];
        } else {
            $data = ($params['multiple'] OR $this->multiple) ? $this->categories($params)->all(false) : $this->categories(array(
                'unavail' => 0,
                'categoriesClass' => $params['categoriesClass']
            ))->idle();
        }
        $this->callback = $params['processor'];
        $html = $this->grid(array(
            'title' => $params['title'] ? $params['title'] : $this->idleTitle,
            'top' => $params['top'] ? $params['top'] : $this->top,
            'columns' => $params['columns'] ? $this->modifyColumns($params['columns']) : $this->columns(),
            'data' => $data,
            'hideOnEmpty' => $params['hideOnEmpty'],
            'processor' => array($this, 'processAvailable')
        ))->render();
        $this->callback = null;
        return $html;
    }
    public function custom($data, $processor = null) {
        return $this->grid(array(
            'title' => $this->defaultTitle,
            'top' => $this->top,
            'columns' => $this->columns(),
            'data' => $data,
            'processor' => $processor ? $processor : array($this, 'row')
        ))->render();
    }
    private function columns($active = false) {
        $columns = array(
            'catdescr' => $this->catdescrTitle ? $this->catdescrTitle : 'Service name',
            'tarifdescr' => 'Tariff plan',
            'descrfull' => 'Description',
        );
        if ($active) {
            $columns['timefrom'] = 'From';
        }
        $columns['above'] = 'Above';
        $columns['action'] = '';
        return $columns;
    }
    public function usbox($params = array()) {
        return parent::usbox(array_merge($params, array(
            'vgid' => $this->param('vgid'),
            'dtvtype' => $this->dtvtype,
            'periodic' => $this->periodic
        )));
    }
    private function categories($params = array()) {
        return $this->usbox($params)->categories($params['categoriesClass']);
    }
}

?>
