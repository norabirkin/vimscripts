<?php
/**
 * LBArrayDataProvider class file.
 *
 */

class LBArrayDataProvider extends CArrayDataProvider
{
	/**
	 * @var string the name of key field. Defaults to 'id'. If it's set to false,
	 * keys of $rawData array are used.
	 */
	public $keyField='id';
	/**
	 * @var array the data that is not paginated or sorted. When pagination is enabled,
	 * this property usually contains more elements than {@link data}.
	 * The array elements must use zero-based integer keys.
	 */
	public $rawData=array();

	/**
	 * Constructor.
	 * @param array $rawData the data that is not paginated or sorted. The array elements must use zero-based integer keys. Detect objects and transform them in array.
	 * @param array $config configuration (name=>value) to be applied as the initial property values of this class.
	 */
	public function __construct($rawData,$config=array())
	{
        $this->rawData=Arr::obj2arr($rawData);
		foreach($config as $key=>$value)
			$this->$key=$value;
	}

	/**
	 * Fetches the data from the persistent data storage.
	 * @return array list of data items
	 */
	protected function fetchData()
	{
		if(($sort=$this->getSort())!==false && ($order=$sort->getOrderBy())!='')
			$this->sortData($this->getSortDirections($order));

		if(($pagination=$this->getPagination())!==false)
		{
			$pagination->setItemCount($this->getTotalItemCount());
			//$limit=$pagination->getLimit();
			//$offset=$pagination->getOffset();
            return $this->rawData;
		}
		else
			return $this->rawData;
	}

}
