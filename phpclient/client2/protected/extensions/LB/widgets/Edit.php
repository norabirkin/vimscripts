<?php

/**

Для работы виджета должен быть подключен скрипт "/client2/js/edit_form.js"

Пример инициализации виджета:

yii::app()->controller->widget('ext.LB.widgets.Edit',array(
    'id' => 'phone', 
    'route' => 'account/updateaccount',
    'data' =>  array('property'=>'phone')
));

В массиве параметров должны быть указаны три параметра:

id -    Идентификатор виджета. 
        Он должен быть уникальным для 
        каждого виджета Edit, 
        присутствующего на странице.
  
route - Значение параметра r GET-запроса,
        контроллер и действие, вызывемое
        в ajax-запросе при нажатии на кнопку
        "Сохранить"
  
data -  Ассоциативный массив произвольных данных,
        посылаемых методом POST действию контроллера.
        К этим данным при отправлении запроса
        добавляется элемент value со значением,
        введенным в поле формы редактирования

В данном примере запрос будет отправлен на url "index.php?r=account/updateaccount"
Значением переменной $_POST, при введенном в форму значении "72-55-28-09" будет такой массив:

Array
(
    [property] => phone
    [value] => 72-55-28-09
)

Чтобы по завершении ajax-запроса элемент HTML, содержащий изменяемое значение,
изменил свое содержание на новое, значение его атрибута "id" должно формироваться
по шаблону "editable-value-{id}", где {id} соответствует идентификатору виджета.
Новое содержимое берется из ответа на запрос.

В данном примере после получаения ответа на запрос элемент 
<strong id="editable-value-phone">72-55-28</strong>
должен измениться таким образом:
<strong id="editable-value-phone">72-55-28-09</strong>


*/

class Edit extends CWidget
{
    public $image;
    public $title;
    public $id;
    public $data;
    public $html;
    public $route;
    public $hint = '';
    public $script = '';
    public function init() {
        $this->title = Yii::t('bootstrap','Edit');
        $this->image = CHtml::image(Yii::app()->theme->baseUrl.'/i/edit.png',$this->title);
        $this->html = addcslashes(
                str_replace(
                        array("\r","\n"),
                        "", 
                        $this->render('Edit',array(),true)
                )
                ,'"'
        );
        yii::import('application.controllers.SiteController');
        $c = new SiteController('site');
        $this->route = $c->createUrl($this->route);
        $this->data = json_encode($this->data);
        $this->initScript();
    }
    public function getInputId() {
        return 'edit-form-input-'.$this->id;
    }
    public function initScript() {
        if (!$this->script) {
            return;
        }
        $this->script = '<script type="text/javascript">'.
                            'EditFormObservable.onOpen("'.$this->id.'", function(){'.
                                str_replace('{id}', '#'.$this->getInputId(), $this->script).
                            '});'.
                        '</script>';
    }
    public function run() {
        $this->render('EditButton');
    }
}

?>
