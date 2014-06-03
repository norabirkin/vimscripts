<?php class LBForm extends CApplicationComponent {
	private $method = 'get';
	private $action;
	private $items = array();
	public function __construct( $conf = null ) {
		if($conf) $this->configure( $conf );
	}
	public function configure( $conf ) {
		if ($conf["action"]) $this->setAction( $conf["action"] );
		$this->setItems( $conf["items"] );
	}
	private function setAction( $url ) {
		$this->action = $url;
	}
	private function setMethod( $method ) {
		$this->method = (string) $method;
	}
	public function onBeforeCreateItem( CEvent $event ) {
		$this->raiseEvent('onBeforeCreateItem', $event);
	}
	public function onAfterCreateItem( CEvent $event ) {
		$this->raiseEvent('onAfterCreateItem', $event);
	}
	public function onBeforeItemsSet( CEvent $event ) {
		$this->raiseEvent('onBeforeItemsSet', $event);
	}
	public function setItems( $items ) {
		$event = new CEvent;
        $event->params = array( 'items' => $items );	
		$this->onBeforeItemsSet( $event );
		$items = $event->params["items"];
		foreach( $items as $item ) $this->items[] = $this->createItem( $item );
	}
    public function hasField($name) {
        foreach ($this->items as $item) {
            if ($item->is($name)) {
                return true;
            }
        }
        return false;
    }
	private function getItemClass( $type ) {
        yii::import('application.components.datepicker.LB_DatePicker_Period');
		switch( $type ) {
            case 'period':
                return 'LB_DatePicker_Period';
                break;
			case 'info': 
				return 'LBInfoField';
				break;
			case 'submit': 
				return 'LBSubmitButton';
				break;
			case 'date': 
				return 'LBDateField';
				break;
			case 'display': 
				return 'LBDisplayField';
				break;
			case 'hidden': 
				return 'LBHiddenField';
				break;
			case 'text': 
				return 'LBTextField';
				break;
			default: 
				return 'LBTextField';
				break;
		}
	}
	private function getItemsHTML() {
		$html = '';
		$hidden = '';
		foreach( $this->items as $item ) { 
			if (!$item->isHidden()) $html .= yii::app()->controller->renderPartial('application.views.forms.row', array( 'row' => $item->render()), true);
			else $hidden .= $item->render();
		}
		return $hidden.$html;
	}
	public function render() {
		return yii::app()->controller->renderPartial('application.views.forms.main', array( 
			'items' => $this->getItemsHTML(),
			'method' => $this->method,
			'action' => $this->action
		), true);
	}
	private function createItem( $item ) {
		$event = new CEvent;
        $event->params = array( 'conf' => $item );	
		$this->onBeforeCreateItem( $event );
		$item = $event->params["conf"];
		$class = $this->getItemClass( $item["type"] );
		$obj = new $class( $item );
		$event = new CEvent;
        $event->params = array('item' => $obj, 'type' => $item['type']);
		$this->onAfterCreateItem( $event );
        return $event->params['item'];
	}
    public function getItems() {
        return $this->items;
    }
} ?>
