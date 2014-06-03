<?php

class LB_Form {
    private $action;
    private $file = false;
    private $map = array();
    private $id;
    private $method;
    private $rendered = false;
    private $fields = '';
    private $hidden = '';
    private $config = array();
    private $beforeItemAddHandler;
    private $beforeRenderHandler;
    private $beforeItemRenderHandler;
    public function __construct($items = array()) {
        $this->addItems($items);
    }
    public function id($id) {
        $this->id = $id;
        return $this;
    }
    public function action($action) {
        $this->action = $action;
        return $this;
    }
    public function method($method) {
        $this->method = $method;
        return $this;
    }
    public function getMethod() {
        return $this->method;
    }
    public function setBeforeItemAddHandler($callback) {
        $this->beforeItemAddHandler = $callback;
    }
    public function setBeforeItemRenderHandler($callback) {
        $this->beforeItemRenderHandler = $callback;
    }
    public function setBeforeRenderHandler($callback) {
        $this->beforeRenderHandler = $callback;
    }
    public function renderItem(LB_Form_Item_Default $params) {
        $this->beforeItemRender($params);
        $method = $params->get('type').'Renderer';
        if (method_exists($this, $method)) {
            return $this->$method($params);
        } else {
            return '';
        }
    }
    private function monthRenderer($params) {
        ClientScriptRegistration::addScript('monthField');
        $id = $this->idFromName($params->get('name'));
        return '<span id="month_field_prev_'.$id.'" class="month-field-nav">&lt;&nbsp;</span>' .
        CHtml::textField(
            null,
            null,
            array(
                'class' => 'input-text',
                'id' => $id . '_text',
                'style' => 'width: 120px;',
                'readonly' => 1
            )
        ) .
        '<span id="month_field_next_'.$id.'" class="month-field-nav">&nbsp;&gt;</span>' .
        (
            $params->get('submit')
            ?
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . CHtml::submitButton(yii::t('main', 'Apply'))
            :
            ''
        ) .
        $this->script(
            'new MonthField(' .
                CJSON::encode(array(
                    'id' => $id,
                    'name' => $params->get('name'),
                    'value' => (
                        preg_match(
                            '/^[0-9]{4}-[0-9]{2}$/',
                            $params->get('value')
                        )
                        ? $params->get('value')
                        : null
                    ),
                    'dictionary' => $this->monthDictionary()
                )) .
            ');'
        );
    }
    private function selectRenderer($params) {
        return CHtml::dropdownList(
            $params->get('name'),
            $params->get('value'),
            $params->get('data'),
            $params->get('options')
        );
    }
    private function radioListRenderer($params) {
        return CHtml::radioButtonList(
            $params->get('name'),
            $params->get('value'),
            $params->get('data'),
            array(
                'separator' => ''
            )
        );
    }
    private function checkboxListRenderer($params) {
        return CHtml::checkBoxList($params->get('name'), $params->get('checked'), $params->get('data'), $params->get('htmlOptions'));
    }
    private function textareaRenderer($params) {
        return CHtml::textArea($params->get('name'), '', array(
            'class' => 'input-text',
            'style' => 'height: 150px; width: 350px;'
        ));
    }
    private function infoRenderer($params) {
        if (!$params->get('value')) {
            return '';
        }
        return '<em>'.yii::t('main', $params->get('value')).'</em>';
    }
    private function displayRenderer($params) {
        if (!$params->get('value')) {
            return '';
        }
        return '<strong>'.$params->get('value').'</strong>';
    }
    public function wrap($params) {
        if ($params instanceof LB_Form_Item) {
            return $params;
        }
        if ($params['type'] == 'array') {
            return new LB_Form_Item_Array($params);
        } else {
            return new LB_Form_Item_Default($params);
        }
    }
    private function hiddenRenderer($params) {
        return CHtml::hiddenField($params->get('name'), $params->get('value'));
    }
    private function dateRenderer($params) {
        $options = array('dateFormat' => 'yy-mm-dd');
        if ($params->get('min')) {
            $options["minDate"] = $params->get('min');
        }
        return yii::app()->controller->widget('zii.widgets.jui.CJuiDatePicker', array(
            'language' => yii::app()->getLanguage(),
            'name' => $params->get('name'),
            'value'=> $params->get('value'),
            'options' => $options,
            'htmlOptions'=>array(
                'style'=>'height:20px;width:90px;',
                'class'=>'input-text',
                'readonly'=>true
            )
        ), true).'&nbsp;<span class="hint">(гггг-мм-дд).</span>';
    }
    private function fileRegister($item) {
        $this->file = true;
        $this->method = 'post';
    }
    private function fileRenderer($params) {
        return yii::app()->controller->renderPartial('application.views.forms.fields.file', array(
            'boxClass' => $params->get('boxClass'),
            'name' => $params->get('name'),
            'value' => $params->get('value'),
            'fileName' => $params->get('fileName')
        ), true);
    }
    private function periodRegister($item) {
        $item->set('dtfrom', $this->addItem($item->element(array(
            'type' => 'date',
            'name' => 'dtfrom',
            'value' => $item->get('dtfrom')
        ))));
        $item->set('dtto', $this->addItem($item->element(array(
            'type' => 'date',
            'name' => 'dtto',
            'value' => $item->get('dtto')
        ))));
    }
    private function periodRenderer($params) {
        return yii::app()->controller->renderPartial('application.components.datepicker.views.period', array(
            'dtfrom' => $this->renderItem($params->get('dtfrom')),
            'dtto' => $this->renderItem($params->get('dtto'))
        ), true);
    }
    private function servicePeriodRegister($item) {
        $dtfrom = array(
            'type' => 'date',
            'name' => 'dtfrom',
            'value' => $item->get('dtfrom')
        );
        $dtto = array(
            'type' => 'date',
            'name' => 'dtto',
            'value' => $item->get('dtto')
        );
        if ($item->get('min')) {
            $dtfrom['min'] = $item->get('min');
            $dtto['min'] = $item->get('min');
        }
        $item->set('dtfrom', $this->addItem($item->element($dtfrom)));
        $item->set('dtto', $this->addItem($item->element($dtto)));
    }
    private function servicePeriodRenderer($params) {
        return yii::app()->controller->renderPartial('application.components.datepicker.views.servicePeriod', array(
            'dtfrom' => $this->renderItem($params->get('dtfrom')),
            'dtto' => $this->renderItem($params->get('dtto'))
        ), true);
    }
    private function agrmPeriodSelectsRenderer($params) {
        return yii::app()->controller->renderPartial('application.components.datepicker.views.agrmSelectsPeriod', array(
                'month' => $this->renderItem($params->get('month')),
                'year' => $this->renderItem($params->get('year')),
                'agrmid' => $this->renderItem($params->get('agrmid'))
        ), true);
    }
    private function monthDictionary() {
        return array(
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
        );
    }
    private function agrmPeriodSelectsRegister($item) {
        $item->set('month', $this->addItem($item->element(array(
                'type' => 'select',
                'name' => 'month',
                'data' => $this->monthDictionary(),
                'value' => $item->get('month')
        ))));
        $years = array();
        for ($i = 0; $i < 10; $i ++) {
            $years[date('Y') - $i] = date('Y') - $i;
        }
        $item->set('year', $this->addItem($item->element(array(
                'type' => 'select',
                'name' => 'year',
                'value' => $item->get('year'),
                'data' => $years
        ))));
        $item->set('agrmid', $this->addItem($item->element(array(
                'type' => 'select',
                'value' => $item->get('agrmid'),
                'data' => $item->get('agrmdata'),
                'name' => 'agrmid'
        ))));
    }
    private function agrmPeriodRegister($item) {
        $item->set('dtfrom', $this->addItem($item->element(array(
                'type' => 'date',
                'name' => 'dtfrom',
                'value' => $item->get('dtfrom')
        ))));
        $item->set('dtto', $this->addItem($item->element(array(
                'type' => 'date',
                'name' => 'dtto',
                'value' => $item->get('dtto')
        ))));
        $item->set('agrmid', $this->addItem($item->element(array(
                'type' => 'select',
                'value' => $item->get('agrmid'),
                'data' => $item->get('agrmdata'),
                'name' => 'agrmid'
        ))));
    }
    private function agrmPeriodRenderer($params) {
        return yii::app()->controller->renderPartial('application.components.datepicker.views.agrmPeriod', array(
                'dtfrom' => $this->renderItem($params->get('dtfrom')),
                'dtto' => $this->renderItem($params->get('dtto')),
                'agrmid' => $this->renderItem($params->get('agrmid'))
        ), true);
    }
    private function customRenderer($params) {
        return $params->get('value');
    }
    private function idFromName($name) {
        $id = preg_replace('/[^a-zA-Z0-9_\-]+/', '_', $name);
        $id = preg_replace('/^_+/', '', $id);
        $id = preg_replace('/_+$/', '', $id);
        return $id;
    }
    private function script($script) {
        return '<script type="text/javascript">$(document).ready(function(){'.$script.'});</script>';
    }
    private function jsGetField($item) {
        return '$("#'.$this->idFromName($item->get('name')).'")';
    }
    private function numberRenderer($params) {
        ClientScriptRegistration::addScript('maskRe');
        $limits = '';
        if (((int) $params->get('min')) OR ((int) $params->get('max'))) {
            $limits .= ', [';
            if ((int) $params->get('min')) {
                $limits .= 'MaskRe.minValue('.((int) $params->get('min')).')';
            }
            if ((int) $params->get('max')) {
                $limits .= ', MaskRe.maxValue('.((int) $params->get('max')).')';
            }
            $limits .= ']';
        }
        return $this->textRenderer($params).$this->script('new MaskRe('.$this->jsGetField($params).', MaskRe.NUMERIC'.$limits.');');
    }
    private function ipRenderer($params) {
        ClientScriptRegistration::addScript('maskRe');
        return $this->textRenderer($params).$this->script('new MaskRe('.$this->jsGetField($params).', MaskRe.NUMERIC);');
    }
    private function checkboxRenderer($item) {
        return CHtml::checkbox($item->get('name'), (bool) $item->get('value'));
    }
    private function passwordRenderer($params) {
        return CHtml::passwordField($params->get('name'), $params->get('value'), array('class' => 'input-text'));
    }
    private function textRenderer($params) {
        return CHtml::textField($params->get('name'), $params->get('value'), array_merge(array('class' => 'input-text'), $params->get('options', array())));
    }
    private function submitRenderer($params) {
        return CHtml::submitButton(yii::t('main', $params->get('value')), $params->get('options', array()));
    }
    private function renderItems() {
        foreach ($this->config as $item) {
            if ($item->isElement() OR $item->isArray()) {
                continue;
            }
            if ($item->get('type') == 'hidden') {
                $this->hidden .= $this->renderItem($item);
            } else {
                if (!$item->get('skip')) {
                    $this->fields .= yii::app()->controller->renderPartial('application.components.form.views.item', array(
                        'label' => $item->get('label'),
                        'custom' => $item->get('type') == 'custom',
                        'note' => $item->get('note'),
                        'item' => $this->renderItem($item)
                    ), true);
                    if ($item->get('showIf')) {
                        $this->hidden .= $this->showIf($item, $html);
                    }
                }
            }
        }
    }
    private function showIf($item, $html) {
        ClientScriptRegistration::addScript('ShowIf');
        $name = key($item->get('showIf'));
        $value = current($item->get('showIf'));
        return $this->script('new ShowIf('.CJSON::encode(array(
            'id' => $this->idFromName($item->get('name')),
            'condition' => array(
                'id' => $this->idFromName($this->map[$name]->get('name')),
                'value' => $value
            )
        )).');');
    }
    private function beforeItemAdd($item) {
        if (!$this->beforeItemAddHandler) {
            return true;
        } else {
            $obj = $this->beforeItemAddHandler[0];
            $method = $this->beforeItemAddHandler[1];
            if (!is_object($obj) OR !is_string($method) OR !method_exists($obj, $method)) {
                throw new Exception('invalid callback');
            }
            return $obj->$method($item, $this);
        }
    }
    private function beforeItemRender($item) {
        if (!$this->beforeItemRenderHandler) {
            return true;
        } else {
            $obj = $this->beforeItemRenderHandler[0];
            $method = $this->beforeItemRenderHandler[1];
            if (!is_object($obj) OR !is_string($method) OR !method_exists($obj, $method)) {
                throw new Exception('invalid callback');
            }
            return $obj->$method($item, $this);
        }
    }
    private function beforeRender() {
        if (!$this->beforeRenderHandler) {
            return true;
        } else {
            $obj = $this->beforeRenderHandler[0];
            $method = $this->beforeRenderHandler[1];
            if (!is_object($obj) OR !is_string($method) OR !method_exists($obj, $method)) {
                throw new Exception('invalid callback');
            }
            return $obj->$method($this->config, $this);
        }
    }
    public function add($item) {
        return $this->addItem($item);
    }
    public function addItem($item, $array = null) {
        if (!$item) {
            return;
        }
        if (is_array($item)) {
            $name = $item['name'];
        } else {
            $name = $item->get('name');
        }
        $item = $this->wrap($item);
        if ($array) {
            $item->setParent($array);
        }
        if ($item->isArray()) {
            if ($this->beforeItemAdd($item)) {
                $this->addItems($item->get('items', array()), $item);
                $this->config[] = $item;
                $this->map[$name] = $item;
            }
        } else {
            $method = $item->get('type').'Register';
            if (method_exists($this, $method)) {
                $this->$method($item);
            }
            if ($this->beforeItemAdd($item)) {
                $this->config[] = $item;
                $this->map[$name] = $item;
            }
        }
        return $item;
    }
    public function addItems($items, $array = null) {
        foreach ($items as $item) {
            $this->addItem($item, $array);
        }
    }
    private function getHiddenStructElement($name, $value) {
        if (is_array($value)) {
            $items = array();
            foreach ($value as $k => $v) {
                $items[] = $this->getHiddenStructElement($k, $v);
            }
            return array(
                'type' => 'array',
                'name' => $name,
                'items' => $items
            );
        } else {
            return array(
                'type' => 'hidden',
                'name' => $name,
                'value' => $value
            );
        }
    }
    public function hidden($params) {
        $items = array();
        foreach ($params as $k => $v) {
            $items[] = $this->getHiddenStructElement($k, $v);
        }
        $this->addItems($items);
        return $this;
    }
    public function hasField($name) {
        foreach ($this->config as $item) {
            if ($name == $item->get('name')) {
                return true;
            }
        }
        return false;
    }
    public function render() {
        if ($this->rendered) {
            throw new Exception('form allready rendered');
        }
        $this->fields = '';
        $this->hidden = '';
        $this->beforeRender();
        $this->renderItems();
        $result = yii::app()->controller->renderPartial('application.components.form.views.form', array(
            'items' => $this->fields,
            'action' => $this->action,
            'file' => $this->file,
            'id' => $this->id,
            'method' => $this->method,
            'hidden' => $this->hidden
        ), true);
        $this->rendered = true;
        return $result;
    }
}

?>
