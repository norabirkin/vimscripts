<?php
/**
 * Support data model
 */
class SupportForm extends CFormModel {

	public $statuses = false;

    public $sbss_file;
    public $sbss_file_descr;
	public $sbss_title;
	public $sbss_text;
	public $sbss_class;
	public $sbss_status;

	public $new_ticket_status = null;
	public $reply_ticket_status;

	public $ticketId;

	public function rules() {
		return array(
			/**
			 * Show ticket
			 */
			array('ticketId', 'required', 'on' => 'sbssActions'),
			array('ticketId, sbss_class, sbss_status', 'numerical', 'integerOnly'=>true),
            array('sbss_file_descr, sbss_file', 'safe'),
			/**
			 * Create ticket
			 */
			array('sbss_title, sbss_text', 'required', 'on' => 'sbssAdd'),
			array('sbss_text',             'required', 'on' => 'sbssReply'),
			array('sbss_status', 'default', 'value' => $this->reply_ticket_status, 'setOnEmpty' => true, 'on' => 'sbssReply'),
			//array('sbss_text', 'saveTicket', 'on' => 'sbssAdd'),
		);
	}

	public function attributeLabels() {
		return array(
			'sbss_class'  => Yii::t('support', 'RequestClass'),
			'sbss_status' => Yii::t('support', 'RequestStatus'),
			'sbss_title'  => Yii::t('support', 'Subject'),
			'sbss_text'   => Yii::t('support', 'Message'),
			'sbss_file_descr'   => Yii::t('support', 'Description'),
			'sbss_file'   => Yii::t('support', 'File')
		);
	}

	function init()
	{
		if (!is_object($this->statuses))
			$this->statuses = $this->getStatuses();
	}

	/**
	* Get sbss tickets list
	* @param boolean $new Flag to show new messages
	*/
	public function getTicketsList($new = false)
	{
        yii::import('application.components.sbss.*');
		$_filter = array();
		/**
		 * Получение списка непрочитанных сообщений
		 */
		if ($new) $_filter = array('unavail' => 0);
		if( false != ($result = Sbss_Helper::fakeTickets()/* Yii::app()->controller->lanbilling->get("getSbssTickets", array("flt" => $_filter), true) */)){
			if(!is_array($result)) {$result = array($result);}
			foreach($result as $ticket_id => $ticket){
				$result[$ticket_id]->status = $this->getCurStatus($ticket->statusid);
			}
		}else $result = array();

		return new CArrayDataProvider($this->objectToArray($result), array(
			'id'=>'id',
			'sort'=>array(
				'attributes'=>array(
					'lastpost','id', 'name', 'respondentname', 'statusid',
				),
			),
			'pagination'=>array(
				'pageSize' => yii::app()->params['PageLimit'],
			),
		));
	}

	public function getCurStatus( $statusId = 0 )
	{
		$statuses = $this->statuses;
		foreach ($statuses as $k => $status){
			if ($status['id'] == $statusId )
				return $statuses[$k];
			else continue;
		}
	}

	/**
	 * Get SBSS exact ticket
	 */
	public function getTicket()
	{
        yii::import('application.components.sbss.*');
		$_filter = array();
		if ($this->ticketId){
			$_filter = array("id" => (integer)$this->ticketId);

			/**
			 * Mark ticket as read
			 */
			Yii::app()->controller->lanbilling->get("setClientMessagesViewed", array('flt'=>array('recordid'=>$this->ticketId)));
		}
		if( false === ($result = Sbss_Helper::fakePosts()/* Yii::app()->controller->lanbilling->get("getSbssTicket", $_filter, true) */)){
			$result = array();
		}
		return $this->objectToArray($result);
	}

	/**
	* Get sbss statuses
	*/
	public function getStatuses( $prepare = false )
	{
	   if( false != ($result = Yii::app()->controller->lanbilling->get("getSbssStatuses", array(), ($prepare) ? true : false)) ) {
			if(!is_array($result)) { $result = array($result); }

			$stat = array();
			if (count($result)){
				foreach($result as $item){
					if ($prepare){
						if($item->type != 3 && $item->type != 0) continue;
						if($item->active != 1) continue;
					}
					if($item->defaultnew == 1) $this->new_ticket_status = $item->id;
					if($item->defaultanswer == 1) $this->reply_ticket_status = $item->id;
					$stat[$item->id] = $item;
				}
			}
			return $this->objectToArray($stat);
	   }
	   return array();
	} // end getStatuses()

	/**
	 * Get sbss classes
	 */
	public function getClasses()
	{
		if( false != ($result = Yii::app()->controller->lanbilling->get("getSbssRequestClasses")) ) {
			return (!is_array($result)) ?  array($result) : $result;
		} else return array();
	} // end getClasses();


    /**
    * Convert an object to an array
    *
    * @param    object  $object The object to convert
    * @return  array
    */
    public function objectToArray( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) ) {
            return $object;
        }
        if( is_object( $object ) ) {
            $object = get_object_vars( $object );
        }
        return array_map(array($this, __FUNCTION__), $object);
    }

	/**
	 * Get responsible manager by assigned class id
	 * @param	object, billing class
	 * @param	integer request class id
	 */
	function Responsible( $classId = 0 )
	{
		if(empty($classId)) { return (integer)Yii::app()->controller->lanbilling->getOption('sbss_ticket_superviser'); }
		else {
			if( false != ($result = Yii::app()->controller->lanbilling->get("getSbssRequestClasses")) ) {
				if(!is_array($result)) { $result = array($result); }
				foreach($result as $item)
				{
					if($item->id == $classId) {
						return (integer)$item->responsibleman;
					}
				}
			}

			return 0;
		}
	} // end initResponsible()

}
