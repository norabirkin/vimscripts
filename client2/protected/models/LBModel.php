<?php abstract class LBModel extends EventList {
	private $use_cache = true;
	static protected $cache = array(); 
	protected $debug = false;
	static protected $log_all = false;
	public function debug() {
		$this->debug = true;
	}
	static public function log_all(){
		self::$log_all = true;
	}
	static public function get($class) {
		$model = new $class;
		if ($model instanceof self) return $model;
		return false;
	}
	protected function debugModeEnabled() {
		return $this->debug OR self::$log_all;
	} 
	protected function printErrors() {
		if (yii::app()->controller->lanbilling->Errors) {
			$function = get_class($this);
			echo '<h1>'.$function.':error</h1>';
			Dumper::dump(yii::app()->controller->lanbilling->Errors);
		}
	}
	public function printCache() {
		Dumper::dump(LBModel::$cache);
	}
	public function getCached($key) {
		if (!$this->use_cache) return NULL;
		if(!$cached = LBModel::$cache[get_class($this)][$key]) return NULL;
		else return $cached;
	}
	public function setCached($key,$value) {
		LBModel::$cache[get_class($this)][$key] = $value;
	}
	public function getData($type = 'default') {
		$function = get_class($this);
		$params = $this->beforeCall($this->getParams($type));
		$cache_key = md5(serialize($params));
		if (($cached = $this->getCached($cache_key)) !== NULL) $data = $cached;
		else $data = yii::app()->controller->lanbilling->get($function,$params);
		$this->setCached($cache_key, $data);
		/*if ($this->debugModeEnabled()) {
			$this->printErrors();
			echo '<h1>'.$function.':request</h1>';
			Dumper::dump($params);
			echo '<h1>'.$function.':response</h1>';
			Dumper::dump($data);
		}*/
		return $data;
	}
	protected function getLink($name, $route, $params, $method = 'get', $extraOptions = array()) {
		if ($method == 'post') {
			$url = array($route);
			$options = array(
				'submit' => $url,
				'params' => $params
			);
		} elseif ($method == 'get') {
			$url = array_merge(array($route),$params);
			$options = array();
		}
		$options = array_merge( $options, $extraOptions );	
		return CHtml::link($name, $url, $options );
	}
	public function insert($update = false) {
		if ($this->validate()) {
			$function = get_class($this);
			$params = $this->getParams($type);
			$data = yii::app()->controller->lanbilling->save( $function, $params, !$update );
			if ($this->debugModeEnabled()) {
				$this->printErrors();
				echo '<h1>'.$function.':request</h1>';
				Dumper::dump($params);
				echo '<h1>'.$function.':response</h1>';
				Dumper::dump($data);
			}
			return $data;
		} else {
			if ($this->debugModeEnabled()) {
				Dumper::dump($this->getErrors());
			}
			return false;
		}
	}
	public function update() {
		return $this->insert(true);
	}
	protected function beforeCall($params) {
		return $params;
	}
	abstract protected function getParams($type = 'default');
	protected function defaultProcessing($data) {
		$result = array();
		foreach ($data as $item) $result[] = Arr::objectToArray($item);
		return $result;
	}
	public function selection($criteria,$data) {
		$data = Arr::get_array($data);
		foreach ($data as $item) {
			if ($this->$criteria($item)) {
				if ($this->debugModeEnabled()) {
					$function = get_class($this);
					Dumper::log($item,$function.'.'.$criteria);
				}
				return $item;
				break;
			}
		}
		return false;
	}
	public function getList($processing = NULL) {
		$list = $this->getData();
		if (!$list) $list = array();
		if (!is_array($list)) $list = array($list);
		if ($processing) $list = $this->$processing($list);		
		if ($this->debugModeEnabled() AND $processing) {
			$function = get_class($this);
			Dumper::log($list,$function.'.'.$processing);
			/*echo '<h1>'.$function.':processed</h1>';
			Dumper::dump($list);*/
		}
		return $list;
	}
	public function getItem($selection = NULL) {
		if (!$selection) return $this->getData();
		else return $this->selection($selection,$this->getData());
	}
	public function getGrid($columns, $processing = 'defaultProcessing', $type = 'default', $download = 0) {
		$list = $this->getList($processing);
		$id = strtolower(get_class($this));
		if (count($list) > yii::app()->params['PageLimit']) $pagination = true;
		else $pagination = false;
		return yii::app()->grid->get_grid($list,$columns,$pagination,$id,$download);
	}
} ?>
