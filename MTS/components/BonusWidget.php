<?php
class BonusWidget extends CWidget
{
    public $vgroups;
    public $config;
    public function run()
	{
		$data = array();
		$accVg = $this->getVgroupsMtsBonus($this->controller->lanbilling->clientInfo->account->uid);
        if(isset($this->controller->lanbilling->clientInfo->agreements))
        {
            if (FALSE !== ($accVg = $this->getVgroupsMtsBonus($this->controller->lanbilling->clientInfo->account->uid))) {
                $agrmIdArr = array();
                foreach($accVg as $item)
                {
                    $agrmIdArr[] = $item->agrmid;
                }
                $agrmData = array();
                foreach ($this->controller->lanbilling->clientInfo->agreements as $agrm)
                {
                    if (in_array($agrm->agrmid, $agrmIdArr)) {
                        $agrmData[$this->getUrlMtsBonus($agrm->agrmid)] = $agrm->number;
                    }
                }
            }
        }

		if (is_array($agrmData) && count($agrmData) > 0){
			$image = Yii::app()->baseUrl.'/i/'.$this->config['img'];

			$this->render(MainTemplateHelper::GetInstance()->GetTheme()->getViewPath('bonusWidget'),array('data' => $agrmData, 'image' => $image));
		}
	}

	function getVgroupsMtsBonus( $uid )
	{
        return $this->vgroups;
	} // end getVgroups()

	/**
	 * Generate url according to the user setting for this service
	 * @param	object, billing class
	 * @param	boolean, true if current user
	 * @param   integer, id of agreement
	 */
	function getUrlMtsBonus( $agrm_id = false )
	{
		if (!$agrm_id) return FALSE;
		$url = array(
			"personal_account" => (integer)$agrm_id,
			"billing_id" => $this->controller->lanbilling->getOption("billing_code"),
			"time_zone"  => $this->controller->lanbilling->getOption("time_zone"),
			"sign" => $this->setSignMtsBonus((integer)$this->controller->lanbilling->getOption("billing_code"), (integer)$agrm_id)
		);
		$_url = array();
		foreach($url as $key => $val) {
			$_url[] = $key . "=" . $val;
		}
		return "http://" . $this->config['host'] . $this->config['subpath'] . "?" . implode("&", $_url);
	} // end getUrlMtsBonus()


	/**
	 * Create sign
	 * @param	string, personal account
	 */
	function setSignMtsBonus($billid = null, $pid = null )
	{
		return md5($billid . "-" . $pid . date("d.m.Y H") . $this->config['sign_secret']);
	} // end setSign()

}
