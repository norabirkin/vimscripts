<?php
/**
 * Services data model
 */
class Services extends CFormModel
{
    // ID учетной записи
    public $vgid;
    // Идентификатор тарифа
    public $tarid;
    // Название тарифного плана
    public $tarname;
    // Врмя смены тарифного плана
    public $changeDate;

    // Идентификатор текущего тарифа
    public $oldtarid;
    
    public $catidx;
    
    public $catdescr;
	
	public $catinfo;
    
    public $dtfrom;
    
    public $common;
    
    public $dtto;
    
    private $limit_of_tarif_change_date;

    public $vgData;
    
    public $scheduled_by_user = null;
    
    public $services = null;
    
    public $servid;
    
    public $action;
    
    public $params = array();
    
    private static $counter = 0;

	public function rules() {
		return array(
             
            array('vgid, tarid, catidx, servid', 'numerical', 'integerOnly'=>true),
            array('action','checkAction', 'on' => 'stopService'),
            array('vgid', 'required', 'on' => 'tariffsList,servicesList,stopService'),
            
            array('vgid','CheckBalance','on' => 'changeTariff,choiceDate'),
            
            array('vgid','CheckTariffStaff','on' => 'changeTariff,choiceDate'),
            
            array('vgid,catidx,servid,action','required','on' => 'stopService'),

            array('changeDate, tarid, vgid', 'required', 'on' => 'changeTariff'),
            array('vgid', 'required', 'on' => 'addService'),
            array('changeDate,dtfrom,dtto', 'type', 'type' => 'date', 'message' => 'Дата введена в некорректном формате!', 'dateFormat' => 'yyyy-MM-dd'),
            // Правила валидации даты и идентификатора тарифа
            array('dtfrom', 'checkDateFrom', 'on' => 'addService'),
            array('dtto', 'checkDateTo', 'on' => 'addService'),
            array('vgid', 'checkVgroup','on'=>'changeTariff'),
            array('changeDate', 'checkDate','on'=>'changeTariff'),
            array('tarid', 'checkTarId','on'=>'changeTariff'),
            array('catidx', 'checkCatIdx','on'=>'addService,stopService'),

		);
	}

	public function init() {
		yii::import('application.models.Services.*');
	}
        
	/*public function checkBalance() {
		$vgdata = $this->get_vgdata();
		$balance = yii::app()->controller->lanbilling->agreements[$vgdata->vgroup->agrmid]->balance;
		$tarstaff = $this->get_array($vgdata->tarstaff);
		if (!$tarstaff) yii::app()->controller->redirect(array('account/index'));
		foreach ($tarstaff as $item) {
			if ($item->tarid == $this->tarid)  {
				$tarif = $item; 
				break;
			}
		}
		if (!$tarif) yii::app()->controller->redirect(array('account/index'));
		if ($tarif->rent > round($balance)) yii::app()->controller->redirect(array('Services/Payment'));; 
		return true;
	}*/
		
        public function checkAction() {
            $valid_actions = array('stop');
            if ( !(in_array($this->action, $valid_actions)) ) $this->addError('action', 'Некорректное действие');
        }
        
        public function serviceApplyLink($data,$row)
    {
        if ($data["catidx"] == 0 OR $data['used'] OR $data['serviceid'] !== 0) return '';
        $url = array("/Services/serviceChoiceDate");
        return CHtml::link(
            'Подключить',
            $url,
            array(
                "submit"=>$url,
                'params'=>array(
                    "catidx" => $data["catidx"],
                    "catdescr" => $data["catdescr"],
                    "common" => 1
                )
            )
        );
    }
    
    public function tarif_schedule() {
        $result = array();
        $schedule = $this->get_array($this->getTariffsRasp($this->vgid));
        $url = array("/Services/removeTarRasp");
        foreach ($schedule as $e) {
            if ($e['requestby'] == -1) {
                $drop = CHtml::link(
                    Yii::t('tariffs_and_services', 'Remove'),
                    $url,
                    array(
                        "submit"=>$url,
                        'params'=>array(
                            "recordid" => $e['recordid'],
                        ),
                        'confirm' => Yii::t('tariffs_and_services','RemoveScheduledConfirm',array('{tariff}' => $e['tarnewname']))
                    )
                );
            }
            else $drop = '';
            $result[] = array(
                'changetime' => $e['changetime'],
                'tarnewname' => $e['tarnewname'],
                'requestby' => ($e['requestby'] >= 0) ? Yii::t("tariffs_and_services","Admin") : Yii::t("tariffs_and_services","User"),
                'drop' => $drop
            );
        }
        return $result;
    }
    
    public function tarstaff_list() {
        $result = array();
        $vgroup = $this->getVgWithTariffs( true );
        $tarstaff = $this->get_array($vgroup->tarstaff);
        $url = array("/Services/ChoiceDate");
        $i = 0;
        foreach ($tarstaff as $t) {
        	$tarif = yii::app()->controller->lanbilling->get('getTarif',array('id' => $t->tarid));
			if ($tarif->tarif->unavaliable) continue;
        	$link = $tarif->tarif->link;
			$link_img = CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
            $name = (!empty($t->tarname)) ? $t->tarname : '<em>' . Yii::t('Services', 'Название отсутствует') . '</em>';
            if ($this->get_scheduled_by_user()) $tarname = $name;
            else $tarname = CHtml::link(
                $name,
                $url,
                array(
                    "submit"=>$url,
                    'params'=>array(
                        "tarid" => $t->tarid,
                        "tarname" => $t->tarname,
                    )
                )
            );
            $result[] = array(
                'id' => $i,
                'tarname' => $tarname . (($link) ? '&nbsp;&nbsp;'.CHtml::link($link_img,$link,array('class' => 'no_border')) : ''),
                'rent' => CHtml::encode($t->rent) . " (" . CHtml::encode($t->tarsymbol) . ")",
                'description' => $t->tardescrfull
            );
            $i ++;
        }
        return $result;
    }
    
    public function vgroups_list_for_tarif() {
        $result = array();
        $data = $this->getVgWithTariffs();
        $url = yii::app()->controller->createUrl('/Services/ChoiceTariff');
        foreach ($data as $agrmid => $vgroups) {
            $result[$agrmid]['number'] = Yii::app()->controller->lanbilling->agreements[$agrmid]->number;
			$result[$agrmid]['balance'] = Yii::app()->controller->lanbilling->agreements[$agrmid]->balance;
            $i = 0;
            foreach ($vgroups as $vgroup) {
                if ($vgroup['login']) $login = $vgroup['login'];
                else $login = '<em>' . Yii::t('Services', 'логин не назначен') . '</em>';
                $result[$agrmid]['vgroups'][] = array(
                    'id' => $i,
                    'agentdescr' => $vgroup['agentdescr'],
                    'vgroup' => CHtml::link(
                        $login,
                        $url,
                        array(
                            "submit"=>$url,
                            'params'=>array(
                                "vgid"    => $vgroup["vgid"],
                                "login"    => $vgroup["login"],
                                "clear" => 1
                            )
                        )
                    ),
                    'tarifdescr' => $vgroup['tarifdescr'],
                    'servicerent' => $vgroup['servicerent']
                );
                $i ++;
            }
        }
        return $result;
    }
        
    public function serviceStopLink($data,$row) {
        if ($data['used'] AND $data["catidx"] > 0) {
            return CHtml::link(
                "Отключить",
                array('/Services/choiceService'),
                array(
                    "submit"=>array('/Services/choiceService'),
                    'params' => array(
                        "Service[vgid]"=>$data["vgid"],
                        "Service[catidx]"=>$data["catidx"],
                        "Service[servid]"=>$data["serviceid"],
                        "Service[action]" => "stop"
                    ),
                    'confirm' => 'Вы уверены, что хотите отключить пакет '.$data["catdescr"].'?'
                )
            );      
        }
        return '';
    }
        
    public function stopUsboxService()
    {
        //$vgid   = Yii::app()->request->getParam('vgid', 0);
        $vgid = $this->vgid;
        $catidx = $this->catidx;
        $servid = $this->servid;
        //$catidx = Yii::app()->request->getParam('catidx', FALSE);
        //$servid = Yii::app()->request->getParam('servid', 0);

        if ($servid !== 0 AND $catidx !== 0){
            $struct = array(
                "id" => $servid,
		"timeto" => ""
            );
            if( false == (ServicesManager::stop(array(
                "id" => $servid,
                "vgid" => $vgid
            )))) {
                Yii::app()->user->setFlash('error',Yii::t('Service', 'Ошибка при отключении!'));
            } else Yii::app()->user->setFlash('success',Yii::t('Service', 'Список пакетов успешно изменен!'));
        }
    }
        
        public function checkDateTo() {
            if ($this->dtto) {
                if (count($this->getErrors())) return false;
                $dtto = strtotime($this->dtto);
                $dtfrom = strtotime($this->dtfrom);
                if ( $dtto < mktime(0,0,0,date('m'),date('d'),date('Y')) ) {
                    $this->addError('dtto','Дата окончания действия услуги не может быть меньше текущей!');
                }
                if ( $dtto <= $dtfrom ) $this->addError('dtto','Дата окончания действия услуги не может быть меньше или равна дате начала действия услуги!');
            }
        }
        
        public function checkDateFrom() {
            if (!$this->common) return true;
            if (!$this->dtfrom) $this->addError('dtfrom','Укажите дату начала действия услуги!');
            if (count($this->getErrors())) return false;
            $dtfrom = strtotime($this->dtfrom);
            if ( $dtfrom < mktime(0,0,0,date('m'),date('d'),date('Y')) ) {
                $this->addError('dtfrom','Дата начала действия услуги не может быть меньше текущей!');
            }
        }
        
        public function checkCatIdx() {
            $vgroup = $this->get_vgdata();
            if ($vgroup) {
                $services = $this->get_services($vgroup->vgroup->tarifid);
                $valid = false;
                foreach ($services as $s) {
                    if ( $this->catidx == $s->catidx ) {
                        $valid = true;
                        break;
                    }
                }
                if (!yii::app()->params['vgroup_schedule']) $valid = false;
                if (!$valid) $this->addError('catidx','Услуга недоступна');
            } else $this->addError('vgid','Учетная запись не найдена');
        }

	public function attributeLabels() {
		return array(
            'changeDate' => Yii::t('Services', 'Дата смены тарифного плана'),
            'tarid' => Yii::t('Services', 'Идентификатор тарифного плана'),
                    'dtto' => Yii::t('Services', 'Дата начала действия услуги')
		);
	}
        
        public function get_scheduled_by_user() {
            if ($this->scheduled_by_user === NULL) {
                $this->get_vgdata();
                $this->scheduled_by_user = false;
                if (isset($this->vgData->tarrasp)) {
                    foreach ($this->get_array($this->vgData->tarrasp) as $t) {
                        if ($t->requestby == 'null') {
                            $this->scheduled_by_user = true;
                            break;
                        }
                    }
                }
            }
            return $this->scheduled_by_user;
        }
        
        public function checkVgroup() {
            if ($this->get_scheduled_by_user()) {
                if ($this->get_scheduled_by_user()) {
                    $this->addError('vgid','Удалите запланированные вами смены тарифа');
                }
            }
        }

    // Правило проверки даты (по параметрам из конфига)
    public function checkDate($attribute,$params)
    {
        if (count($this->getErrors())) return false;
        //  Выбранная дата
        
        //$d = explode('-',$this->changeDate);
        
        $selectedTime = strtotime($this->changeDate);
        
        //$selectedTime = mktime(0,0,0,date('m',$d[1]),date('d',$d[2]),date('Y',$d[0]));
        
        if ( $selectedTime < mktime(0,0,0,date('m'),date('d'),date('Y')) ) {
            $this->addError('changeDate','Дата смены тарифного плана не можут быть меньше текущей!');
        } else {
            $limit_of_tarif_change_date = $this->get_limit_of_tarif_change_date();
            $min_date = $limit_of_tarif_change_date['date']; 
            if ( $selectedTime == $min_date ) return true;
            if ( !$limit_of_tarif_change_date['strict'] AND ( $selectedTime > $min_date ) ) return true;
            $this->addError('changeDate',$limit_of_tarif_change_date['message']);
        }
        

        /*$schedule_month_start_strict = Yii::app()->params['schedule_month_start_strict'];
        $schedule_month_start        = Yii::app()->params['schedule_month_start'];
        $schedule_period_limit       = (integer)abs(Yii::app()->params['schedule_period_limit']);

        // Дата меньше текущего момента
        if ( $selectedTime < mktime(0,0,0,date('m'),date('d'),date('Y')) ) {
            $this->addError('changeDate','Дата смены тарифного плана не можут быть меньше текущей!');
        }
        else
        {
            if ($schedule_month_start || $schedule_month_start_strict)
            {
                if ($schedule_month_start_strict){
                    if ($this->changeDate != date('Y-m-d', strtotime('first day of next month')))
                        $this->addError('changeDate',Yii::t('Services','Внимание! Смена тарифного плана разрешена только 1-го числа следующего календарного месяца!'));
                } elseif ($schedule_month_start){
                    if ($selectedTime < mktime(0,0,0,date('m')+1,1,date('Y')))
                        $this->addError('changeDate',Yii::t('Services','Внимание! Смена тарифного плана разрешена не ранее 1-го числа следующего календарного месяца!'));
                }
            }
            elseif ($schedule_period_limit)
            {
                if ($schedule_period_limit >= 1 && $selectedTime < mktime(0,0,0,date('m'),date('d')+$schedule_period_limit,date('Y')) ){
                    $date = date('Y-m-d',mktime(0,0,0,date('m'),date('d')+$schedule_period_limit,date('Y')));
                    $this->addError('changeDate',Yii::t('Services','Внимание! Смена тарифного плана разрешена не ранее {date}!', array('{date}'=>$date)));
                }
            }
        }*/
    }


    // Правило проверки идентификатора тарифа
    // Должен присутствовать в доступных для данной учетки
    public function checkTarId($attribute,$params)
    {
        // Пропускаем проверку, если уже есть ошибки
        if (count($this->getErrors())) return false;

        if (empty($this->vgData) || !isset($this->vgData->vgid) || $this->vgData->vgid != $this->vgid)
        {
            if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", array("id" => Yii::app()->user->getId()))) ) {
                if(!empty($result)) {
                    if (!is_array($result)) { $result = array($result); }
                    foreach($result as $item) {
                        if($item->vgroup->vgid == $this->vgid) {
                            $this->vgData = $item;
                            break;
                        }
                    }
                }
            }
        }
       	if($this->vgData AND isset($this->vgData->tarstaff))
        {
            if (!is_array($this->vgData->tarstaff)) {
                $this->vgData->tarstaff = array($this->vgData->tarstaff);
            }
            // Проверяем, доступен ли выбранный тариф для данной У.З.
            $avlTarId = array();
            foreach ($this->vgData->tarstaff as $tar){
                $avlTarId[] = $tar->tarid;
            }

            if (!in_array($this->tarid,$avlTarId))
                $this->addError(null,Yii::t('Services','Выбранный тариф отсутствует в списке доступных для пользователя.!'));

			// Проверка на наличие тарифа в расписании
            if(isset($this->vgData->tarrasp)) {
				if(!is_array($this->vgData->tarrasp)) {
					$this->vgData->tarrasp = array($this->vgData->tarrasp);
				}
				foreach($this->vgData->tarrasp as $item) {
					if(Yii::app()->controller->lanbilling->formatDate($item->changetime, 'Y-m-d') == $this->changeDate){
						$this->addError(null,Yii::t('Services','Уже есть запланированный на это время тариф!'));
					}
				}
			}
        } else $this->addError(null,Yii::t('Services','Ошибка при проверке тарифа!'));
    }
    
    private function get_services($tarif_id) {
        if ($this->services == NULL OR !isset($this->services[$tarif_id]) OR $this->services[$tarif_id] === null) {
            $avaliable_services = array();
            $services = $this->get_array(
                yii::app()->controller->lanbilling->get("getTarCategories", array("id" => $tarif_id))
            );
            foreach ($services as $s) {
                if (empty($s->archive) /*&& !empty($s->available)*/) $avaliable_services[] = $s;
            }
            $this->services[$tarif_id] = ($avaliable_services) ? $avaliable_services : NULL;
        }
        return $this->services[$tarif_id];
    }
    
    public function vg_filter_for_tarifs($item) {
        if (isset($item->tarstaff) && count($item->tarstaff)) return true;
    }
    
    public function vg_filter_for_services($item) {
        if($this->get_services($item->vgroup->tarifid)) return true;
    }
    
    static public function check_unlimited_timeto($yyyy_mm_dd) {
        $d = preg_split('/[\-: ]/', $yyyy_mm_dd);
        if (!$d) return false;
        if((int)$d[0] > 3000) return true;
        return false;
    }
    
    public function check_assigned($data,$row) {
        return ( $data["servid"] > 0 AND ($data["assigned"] == 1 OR $data["assigned"] == 0) AND self::not_expired($data["timeto"]) );
    }
    
    static public function not_expired($yyyy_mm_dd){
        if (self::check_unlimited_timeto($yyyy_mm_dd)) return true;
        if (strtotime($yyyy_mm_dd) > time()) return true;
        return false;
    }
    
    public function service_action_link($data,$row) {
        return $data["login"];
    }
    
    public function service_state($data,$row) {
        return $data["state"];
    }
    
    public function get_grid($data,$messages) {
        $dp = new CArrayDataProvider($data, array(
            'id' => uniqid(),
            'keyField' => 'id',
            'pagination' => false,
        ));
        $columns= array();
        foreach ($messages as $k => $v) {
            if ($k != 'id') {
                $columns[] = array(
                    'name' => $v,
                    'value' => $k
                );
            }
        }
        return $this->getGrid($dp, $columns);
    }
    
    public function getGrid($data_provider,$columns) {
        $colums_options = array();
        $first_col = true;
        foreach ($columns as $c) {
            $o = array(
                'name' => $c['name'],
                'type' => 'raw',
                'value' => '$data["'.$c['value'].'"]'
            );
            if (isset($c['link']))  {
                $link = '';
                foreach ($c['link'][1] as $data_field) {
                    $link .= '"'.$data_field.'" => $data["'.$data_field.'"],';
                }
                $url = yii::app()->controller->createUrl($c['link'][0]);
                $condition = '';
                if (isset($c['link'][2])) $condition = '($data["'.$c['link'][2][0].'"]) ? ';
                $o['value'] = '
                    '.$condition.'CHtml::link(
                        $data["'.$c['value'].'"],
                        "'.$url.'",
                        array(
                            "submit"=>"'.$url.'",
                            "params"=>array('.$link.')
                        )
                    )
                ';
                if ($condition) {
                    $message = '';
                    if (isset($c['link'][2][1])) $message = '." <em class=\"unavailable\">('.$c['link'][2][1].')</em>"';
                    $o['value'] .= ' : CHtml::encode($data["'.$c['value'].'"])'.$message;
                }
            }
            else {
                if (is_array($c['value'])) $o['value'] = $c['value'];
                else $o['value'] = '$data["'.$c['value'].'"]';
            }
            
            if (isset($c['htmlOptions'])) $o['htmlOptions'] = $c['htmlOptions'];
            if ($first_col) {
                $o['htmlOptions']['class'] = 'first_col';
                $o['headerHtmlOptions']['class'] = 'first_col';
            }
            $colums_options[] = $o;
            $first_col = false;
        }
        return '<div class="lb_table_wrp">' . yii::app()->controller->widget('zii.widgets.grid.CGridView', array(
            'id' => uniqid(),
            'dataProvider' => $data_provider,
            'ajaxUpdate'=>true,
            //'itemsCssClass'=>'sepGrid',
            'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
            'enablePagination' => false,
            'template'=>'{items}',
            //'emptyText' => Yii::t('Services', 'На данный момент нет доступных услуг :\'('),
            'columns' => $colums_options,
        ),true) . '</div>';
    }
    
    public function replace($name,$value) {
        $this->params[$name] = $value;
    }
    
    public function store($name,$value) {
        if (!isset($this->params[$name])) $this->params[$name] = $value;
    }
    
    public function stored($name) {
        if (!isset($this->params[$name])) return false;
        return $this->params[$name];
    }
    
    public function isNotAvailable($vgroup, $above) {
        if ( $above >= (yii::app()->lanbilling->agreements[$vgroup->agrmid]->balance + yii::app()->lanbilling->agreements[$vgroup->agrmid]->credit) ) return 'ServiceLowBalance';
        elseif ($vgroup->blocked) return 'VGroup is blocked';
        else return false;
    }

    public function getVgroupsForService($data) {
        $vgroups = $this->get_array(yii::app()->controller->lanbilling->get(
                "getClientVgroups", 
                array('flt' => array('agrmid' => $data['agrmid'])), 
                true
        ));
        $result = array();
        $result_array = array();
        $add = 'services/servicechoosedate';
        $stop = 'services/stopservice';
        $i = 0;
        foreach($vgroups as $vg) {
            if ($vg->vgroup->tarifid == (int) $data['tarifid']) {
                $result[] = $vg->vgroup;
                
                $services = array();
                for ($needcalc = 0; $needcalc < 2; $needcalc ++) {
                    $services[$needcalc] = ServicesManager::get(array(
                        "vgid" => $vg->vgroup->vgid,
                        "needcalc" => $needcalc
                    ));
                }
                
                $assigned = false;
                $timefrom = "";
                $timeto = "";
                $servid = 0;
                
                foreach ($services as $k=>$v) {
                    foreach ($v as $s) {
                        if ((int) $data['catidx'] == $s->catidx) {
                            if (!$s->timeto) $timeto = "";
                            else {
                                if (self::check_unlimited_timeto($s->timeto)) $timeto = yii::t('tariffs_and_services','Unlimited');
                                else $timeto = $s->timeto;
                            }
                            $planned = !$s->state;
                            $assigned = $k;
                            $timefrom = $s->timefrom;
                            $servid = $s->servid;
                            $common = $s->common;
                            $above = $s->above;
                            $this->store('tardescr',$s->tardescr);
                            $this->store('catdescr',$s->catdescr);
                        }
                    }
                }
                
                if ($common) {
                    if ($assigned) {
                        $state = $planned ? yii::t('tariffs_and_services','Planned to assign') : yii::t('tariffs_and_services','Assigned');
                        $action = $planned ? yii::t('tariffs_and_services','Cancel') : yii::t('tariffs_and_services','Stop');
                        $url = $stop;
                    } else {
                        $state = yii::t('tariffs_and_services','NotAssigned');
                        $action = yii::t('tariffs_and_services','Assign');
                        $url = $add;
                    }
                } else {
                    $state = "";
                    $action = yii::t('tariffs_and_services','Order');
                    $url = $add;
                    $timeto = "";
                }
                $result_item = array(
                    'id' => $i,
                    'login' => $vg->vgroup->login,
                    'action' => ($url == $stop OR !($notAvailableMessage = $this->isNotAvailable($vg->vgroup, $above))) ? CHtml::link( $action, array($url, 
                        'vgid' => $vg->vgroup->vgid,
                        'catidx' => (int) $data['catidx'],
                        'tarif' => (int) $data['tarifid'],
                        //'catdescr' => $data['description'],
                        'servid' => $servid,
                        'common' => $common,
                        //'action' => 'stop'
                    )) : '<em class="unavailable">('. yii::t('tariffs_and_services', $notAvailableMessage) .')</em>',
                    'timefrom' => $timefrom,
                    'timeto' => $timeto,
                    'vgid' => $vg->vgroup->vgid,
                    'state' => $state
                );
                $result_array[] = $result_item;
            }
            $i ++;
        }
        return $result_array;
    }
    
    public function getServiceDetails($vgid,$catidx) {
        $result = array();
        $vgroups = $this->get_array(yii::app()->controller->lanbilling->get("getClientVgroups", array() , true));
        foreach ($vgroups as $vg) {
            if ($vg->vgroup->vgid == $vgid) {
                $services = array();
                for ($needcalc = 0; $needcalc < 2; $needcalc ++) {
                    $_filter = array(
                        'vgid' => $vg->vgroup->vgid, 
                        'common' => -1, 
                        'unavail' => -1, 
                        'needcalc' => $needcalc, 
                        'defaultonly' => 1 
                    );
                    $services[$needcalc] = $this->get_array(yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true)); 
                }
                foreach ($services as $k=>$v) {
                    foreach ($v as $s) {
                        if ((int) $catidx == $s->catidx) {
                            $result['timeto'] = $s->timeto;
                            $result['assigned'] = $k;
                            $result['timefrom'] = $s->timefrom;
                            $result['servid'] = $s->servid;
                            $result['common'] = $s->common;
                            $result['tardescr'] = $s->tardescr;
                            $result['catdescr'] = $s->catdescr;
                            $result['price'] = $s->above.' руб.';
                            return $result;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    public function getServiceFunctions() {
        $functions = array();
        $uuids = array(); 
        if(false != ($result = yii::app()->controller->lanbilling->get("getClientServFuncs",array('flt' => array('unavail' => 1)),true))) {
            if(!is_array($result)) { $result = array($result); }
            foreach($result as $item) {
                $modulename = str_replace('action_', '', $item->savedfile);
                if (isset(yii::app()->params['service_function_modules']) AND is_array(yii::app()->params['service_function_modules']) AND in_array($modulename, yii::app()->params['service_function_modules'])) {
                    $functions[] = array(
                        'uuid' => $item->uuid,
                        'module' => $modulename,
                        'descr' => $item->descr
                    );
                    $uuids[] = $item->uuid;
                }
            }
        }
        $this->store('service_functions_uuids', $uuids);
        return $functions;
    }
    
    public function reg_match_in_array($needle,$haystack) {
        $i = 0;
        foreach ($haystack as $pattern) {
            if (@preg_match($pattern, $needle)) return $i;
            $i++;
        }
        return false;
    }
    
    public function getVgroupServices($vgroup,$callback = false,$params) {
         $result = array();
         for ($needcalc = 0; $needcalc < 2; $needcalc++) {
            $_filter = array(
                'vgid' => $vgroup->vgid, 
                'common' => -1,
                'unavail' => -1,  
                'needcalc' => $needcalc, 
                'defaultonly' => 1 
            );
            $services = $this->get_array(yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true));
			
			if (!isset($this->catinfo[$vgroup->tarifid])) {
				$s = $this->get_array(yii::app()->controller->lanbilling->get("getTarCategories", array("id" => $vgroup->tarifid), true));
				$this->catinfo[$vgroup->tarifid] = array();
				foreach ($s as $item) $this->catinfo[$vgroup->tarifid][$item->catidx] = $item;
			}
			
            if ($callback) $services = $this->$callback($services,$params,$needcalc);
            $result = array_merge($result,$services);
        }
        return $result;
    }
    
    public function agrm_service_function($agrmid,$function) {
        if (
           !isset($this->params['agrm_service_function']['data'][$agrmid]) OR (
                isset($this->params['agrm_service_function']['data'][$agrmid]) AND 
                !in_array($function['uuid'], $this->params['agrm_service_function']['processed'][$agrmid])
           )
        ){  
            $this->params['agrm_service_function']['processed'][$agrmid][] = $function['uuid'];
            $this->params['agrm_service_function']['data'][$agrmid][] = $function;
        }
    }
    
    public function service_function_output($function) {
        $result = array('price' => '');
        $name = $function['descr_func'];
		$link = (!$function['link']) ? '' :'&nbsp;&nbsp;<em>'.CHtml::link('(i)',$function['link']).'</em>';
        if ($function['available']) {
            $result['description'] = CHtml::link($name,array('/'.$function['module'],
                            'usbox_uuid' => $function['uuid']
            )).$link;
        } else $result['description'] = $name.' <em class="unavailable">('.yii::t('tariffs_and_services','ServiceUnavailable').')</em>'.$link;
		$result['full_description'] = $function['full_descr'];
        return $result;
    }
    
    public function not_binded_functions() {
        $result = array();
        foreach ($this->stored('functions') as $f) {
            if (!isset($f['binded'])) $result[] = $this->service_function_output(array(
                'available' => 1,
                'descr_func' => $f['descr'],
                'descr_usbox' => $f['descr'],
                'uuid' => $f['uuid'],
                'module' => $f['module']
            ));
        }
        return $result;
    }
    
    public function selectAgreementFunctions($agrmid) {
        $data = $this->get_array($this->params['agrm_service_function']['data'][$agrmid]);
        $result = array();
        $functions = $this->params['functions'];
        foreach ($data as $f) {
            $this->params['functions'][$f['match_index']]['binded'] = true;
            $result[] = $this->service_function_output(array(
                'available' => $f['available'],
                'descr_func' => $functions[$f['match_index']]['descr'],
                'uuid' => $functions[$f['match_index']]['uuid'],
                'descr_usbox' => $f['descr'],
                'link' => $f['link'],
                'full_descr' => $f['full_description'],
                'module' => $functions[$f['match_index']]['module']
            ));
        }
        return $result;
    }
    
    public function getUniqueServices($services,$params,$applied) {
        $result = array();
        foreach ($services as $s) {
        	$ext_link = $this->catinfo[$s->tarid][$s->catidx]->link;
			$full_descr = $this->catinfo[$s->tarid][$s->catidx]->descrfull;
            if (!$s->uuid OR ($match = $this->reg_match_in_array($s->uuid, $this->stored('service_functions_uuids'))) === false ) {
                if ($s->available) {
                    $link = CHtml::link($s->catdescr,array('services/choosevgroupforservice',
                        'catidx' => $s->catidx,
                        'tarifid' => $s->tarid,
                        'common' => $s->common,
                        'agrmid' => $params['agrmid']
                	));
                } else $link = $s->catdescr.' <em class="unavailable">('.yii::t('tariffs_and_services','ServiceUnavailable').')</em>';
				
                $result[] = array(
                	'applied' => $applied,
                    'description' => $link . ($ext_link ? '&nbsp;&nbsp;<em>'.CHtml::link('(i)'.'</em>',$ext_link) : '' ),
                    'price' => $s->above.' руб.',
                    'full_description' => $full_descr
                );
            } else {
            	if ($ext_link) $descr = '&nbsp;&nbsp;<em>'.CHtml::link('(i)'.'</em>',$ext_link);
				else $descr = '';
                $this->agrm_service_function($params['agrmid'],array(
                    'match_index' => $match,
                    'uuid' => $s->uuid,
                    'available' => $s->available,
                    'descr' => $s->catdescr,
                    'link' => $ext_link,
                    'full_description' => $full_descr
                ));
            }
        }
        return $result;
    }
    
    public function getUserServices() {
        $result = array();
        $agreements = array();
        $vgroups = $this->get_array(yii::app()->controller->lanbilling->get("getClientVgroups", array() , true));
        $processed_index = array();
        foreach ($vgroups as $vg) {
            if ($vg->vgroup->tariftype == 5) {
                if (!isset($agreements[$vg->vgroup->agrmid])) $agreements[$vg->vgroup->agrmid] = array(
                    'agreement' => yii::app()->controller->lanbilling->agreements[$vg->vgroup->agrmid]->number,
                    'services' => array()
                );
                if (!(
                        isset($processed_index[$vg->vgroup->agrmid]) AND 
                        isset($processed_index[$vg->vgroup->agrmid][$vg->vgroup->tarifid])
                   
                )) {
                    $agreements[$vg->vgroup->agrmid]['services'] = array_merge(
                            $agreements[$vg->vgroup->agrmid]['services'], 
                            $this->getVgroupServices($vg->vgroup,'getUniqueServices',array('agrmid' => $vg->vgroup->agrmid))
                    );
                    $processed_index[$vg->vgroup->agrmid][$vg->vgroup->tarifid] = true;
                }
            }
        }
        return $agreements;
    }
    
    public function getUSBoxForVg($active = true, $all = false)
    {
        if (!$this->vgid) return false;
        
        
        
        
        //$test = Yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true);
        
        //print_r($test);
        
        /**
         * Available filters
         * vgid: account id
         * common: -1 all, 0 - once, 1 - all periodic
         */
      
            if ($active) $needcalc = 1;
            else $needcalc = 0;
            
        $_filter = array( 'vgid' => $this->vgid, 'common' => -1, 'unavail' => -1, 'needcalc' => $needcalc, 'defaultonly' => 1 );
        
        //$_filter = array(
            //"vgid" => (integer)$this->vgid,
            //"unavail" => -1,
            //"common" => 1,
            //'needcalc' => $needcalc
        //);
        //if (!$all) $_filter['defaultonly'] = 1;
        
        //$_filter = array( 'vgid' => 727, 'common' => 1, 'unavail' => -1, 'needcalc' => 1, 'defaultonly' => 1 );
        
        
        $_tmp = array();
        if( 
                false != (
                    $result = yii::app()->controller->lanbilling->get("getVgroupServices", array("flt" => $_filter), true)
                ) 
        ){
            if(!is_array($result)) {
                $result = array($result);
            }
            array_walk($result, create_function('$item, $key, $_tmp', '
                if ($item->available) {
                    $_tmp[0][] = array(
                        "available" => $item->available,
                        "serviceid" => $item->servid,
                        "common" => $item->common,
                        "vgid" => $item->vgid,
                        "tarid" => $item->tarid,
                        "catidx" => $item->catidx,
                        "dateon" => $item->vgrfirston,
                        "timefrom" => $item->timefrom,
                        "timeto" => $item->timeto,
                        "catdescr" => $item->catdescr,
                        "above" => $item->above,
                        "mul" => $item->mul,
                        "personid" => $item->personid,
                        "used" => $item->assigned,
                        "symbol" => "руб",
                        "flagused" => $item->assigned
                    );
                }
            '), array( &$_tmp ));
        }
        //print_r($result);
        if(sizeof($_tmp) > 0) { return $_tmp; } else { return false; }
    } // end getUSBoxForVg
    
    public function serviceTimeto($data,$row)
    {
        $d = explode('-', $data['timeto']);
        if ($d[0] > 3000) return 'не ограничена';
        return $data['timeto'];
    }
    
    public function getVgWithTariffs( $oneVg = false, $excludeCurrent = false, $filter = 'tarifs' )
    {
        // Список договоров с учетными записями и количеством доступных тарифов
        $cArray = array();
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups")))
        {
            if(!empty($result))
            {
                $result = (is_array($result)) ? $result : array($result);
                if (count($result) > 0)
                {
                    $filter_method = 'vg_filter_for_'.$filter;
                    foreach($result as $item) {

                        // Возвращаем детальную инф-ию по учетке для выбора тарифа
                        if ( $oneVg && $this->vgid !== false ){
                            if ($item->vgroup->vgid == $this->vgid){
                                return $item;
                            }
                            else
                                continue;
                        }

                        $tmpRow = array();
                        if ($this->$filter_method($item)) {
                        /*if (isset($item->tarstaff) && count($item->tarstaff))
                        {*/
                            if (isset($item->tarstaff)) {
                                $tarstaff = ((is_array($item->tarstaff)) ? $item->tarstaff : array($item->tarstaff));
                            } else $tarstaff = array();
                            $tmpRow = array(
                                'vgid' => $item->vgroup->vgid,
                                'agrmid' => $item->vgroup->agrmid,
                                'login' => $item->vgroup->login,
                                'curshape' => (isset($item->vgroup->curshape)) ? $item->vgroup->curshape : NULL,
                                'servicerent' => $item->vgroup->servicerent,
                                'tarifid' => $item->vgroup->tarifid,
                                'tarifdescr' => $item->vgroup->tarifdescr,
                                'tariftype' => $item->vgroup->tariftype,
                                'agentdescr' => $item->vgroup->agentdescr,
                                'availabletarifs' => $tarstaff,
                            );
                            if (isset($item->tarrasp))
                                $tmpRow['tarrasp'] = ((is_array($item->tarrasp)) ? $item->tarrasp : array($item->tarrasp));
                            $cArray[$item->vgroup->agrmid][] = $tmpRow;
                        //}
                        }
                    }
                }
            }
        }
        return Arr::obj2arr($cArray);
    }


	/**
     * Информация по учетным записям
     */
    /*public function getVgWithTariffs( $oneVg = false, $excludeCurrent = false )
    {
        // Список договоров с учетными записями и количеством доступных тарифов
        $cArray = array();
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", array("id" => Yii::app()->user->getId()))) )
        {
            if(!empty($result))
            {
                $result = (is_array($result)) ? $result : array($result);
                if (count($result) > 0)
                {
                    foreach($result as $item) {

                        // Возвращаем детальную инф-ию по учетке для выбора тарифа
                        if ( $oneVg && $this->vgid !== false ){
                            if ($item->vgroup->vgid == $this->vgid){
                                return $item;
                            }
                            else
                                continue;
                        }

                        $tmpRow = array();
                        if (isset($item->tarstaff) && count($item->tarstaff))
                        {
                            $tmpRow = array(
                                'vgid' => $item->vgroup->vgid,
                                'agrmid' => $item->vgroup->agrmid,
                                'login' => $item->vgroup->login,
                                'curshape' => $item->vgroup->curshape,
                                'servicerent' => $item->vgroup->servicerent,
                                'tarifid' => $item->vgroup->tarifid,
                                'tarifdescr' => $item->vgroup->tarifdescr,
                                'tariftype' => $item->vgroup->tariftype,
                                'agentdescr' => $item->vgroup->agentdescr,
                                'availabletarifs' => ((is_array($item->tarstaff)) ? $item->tarstaff : array($item->tarstaff)),
                            );
                            if (isset($item->tarrasp))
                                $tmpRow['tarrasp'] = ((is_array($item->tarrasp)) ? $item->tarrasp : array($item->tarrasp));
                            $cArray[$item->vgroup->agrmid][] = $tmpRow;
                        }
                    }
                }
            }
        }
        return Arr::obj2arr($cArray);
    }*/

	/**
     * Информация по запланированным сменам тарифных планов.
     */
    
    
    
    public function sort_tarif_changes_by_date($a, $b) {
        if ((int)strtotime($a['changetime']) < (int)strtotime($b['changetime'])) {
            return -1;
        }
        elseif ((int)strtotime($a['changetime']) > (int)strtotime($b['changetime'])) {
            return 1;
        }
        else return 0;
    }
    
    function get_array($var) {
        if (!$var) return array();
        return is_array($var) ? $var : array($var);
    }
    
    public function get_next_month_start($current_timestamp) {
        $month = date('n',$current_timestamp);
        $year = date('Y',$current_timestamp);
        if ($month == 12) {
            $next_month = 1;
            $year = $year+1;
        }
        else $next_month = $month + 1;
        return mktime(0, 0, 0, $next_month, 1, $year);
    }
    
    public function date_picker($attribute,$min_date) {
    	return datepicker::get(array(
			'model' => $this,
            'attribute' => $attribute,
            'name' => 'Services['.$attribute.']',
            'value'=>$min_date,
            'minDate'=>$min_date
		));
	}
    
    public function get_date_picker() {
        $date = $this->get_limit_of_tarif_change_date();
        $min_date = date('Y-m-d',  $date['date']);
        if ($date['strict']) return '<input type="text" readonly="readonly" class="input-text input-date-min" name="Services[changeDate]" value="'.$min_date.'">';
        $this->changeDate = $min_date;
        return $this->date_picker('changeDate',$min_date);
    }
    
    public function get_limit_of_tarif_change_date () {
        if (!$this->limit_of_tarif_change_date) {
            $strict = false;
            $last_tarif_change_date = $this->get_last_tarif_change_date();
            if (!$last_tarif_change_date) {
                $last_tarif_change_date = (int) mktime(0,0,0,date('m'),date('d'),date('Y'));
                $empty_schedule = true;
            } else $empty_schedule = false;
        
            $schedule_month_start_strict = Yii::app()->params['schedule_month_start_strict'];
            $schedule_month_start        = Yii::app()->params['schedule_month_start'];
            $schedule_period_limit       = (int) Yii::app()->params['schedule_period_limit'];
        
            if ($schedule_month_start_strict OR $schedule_month_start) {
                $date = $this->get_next_month_start($last_tarif_change_date);
                if ($schedule_month_start_strict) {
                    $strict = true;
                    $message = Yii::t('Services','Внимание! Смена тарифного плана разрешена только 1-го числа следующего календарного месяца после последней запланированной смены тарифа!');
                } else $message = Yii::t('Services','Внимание! Смена тарифного плана разрешена не ранее 1-го числа следующего календарного месяца после последней запланированной смены тарифа!');
            }
            elseif ($schedule_period_limit >= 1) {
                $date = $last_tarif_change_date + 86400*$schedule_period_limit;
                $message = Yii::t('Services','<strong>Внимание!</strong> Смена тарифного плана разрешена не ранее {date}!', array('{date}'=>date('Y-m-d',$date)));
            }
            else {
                if ($empty_schedule) $date = $last_tarif_change_date;
                else $date = $last_tarif_change_date + 86400;
            }
            $this->limit_of_tarif_change_date = array('date' => $date, 'strict' => $strict, 'message' => $message);
        }
        return $this->limit_of_tarif_change_date;
    }
    
    public function get_vgdata() {
        if (empty($this->vgData) || !isset($this->vgData->vgid) || $this->vgData->vgid != $this->vgid) {
            $vg = Yii::app()->controller->lanbilling->get("getClientVgroups",array('flt'=>array('vgid' => (int)$this->vgid)));
            if (is_object($vg)) $this->vgData = $vg;
            else $this->vgData = false;
        }
        return $this->vgData;
    }
    
    public function get_last_tarif_change_date() {
        $this->get_vgdata();
        if ($this->vgData) {
            $dates = array();
            //$dates[] = (int) mktime(0,0,0,date('m'),date('d'),date('Y'));
            if (isset($this->vgData->tarrasp)) {
                foreach ($this->get_array($this->vgData->tarrasp) as $t) $dates[] = (int)strtotime($t->changetime);
            }
            if ($dates) return max($dates);
            else return false;
        } else throw new CHttpException(404, Yii::t('Services', 'Не удалось определить учетную запись.'));
    }
    
    public function getTariffsRasp( $vgid = false )
    {
        $vgid = ($vgid) ? $vgid : $this->vgid;
        if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", array("id" => Yii::app()->user->getId()))) ) {
            if(!empty($result)) {
                if(!is_array($result)) { $result = array($result); }
                foreach($result as $item) { if($item->vgroup->vgid == $vgid) { $_accVg = $item; break; } }
            }
        }
        $_tmp = array();
        if(isset($_accVg) && isset($_accVg->tarrasp)) {
            if(!is_array($_accVg->tarrasp)) {
                $_accVg->tarrasp = array($_accVg->tarrasp);
            }
            $_tmp = array();
            foreach ($_accVg->tarrasp as $key => $val) {
                if ($val->requestby == "null") $this->scheduled_by_user = true;
                //else $this->scheduled_by_user = false;
                $_tmp[] = array(
                    "changetime" => $val->changetime, 
                    "requestby" => ($val->requestby == "null") ? -1 : $val->requestby, 
                    "tarnewname" => $val->tarnewname, 
                    "recordid" => $val->recordid
                );
            }
            if ($this->scheduled_by_user == NULL) $this->scheduled_by_user = false;
            //array_walk($_accVg->tarrasp, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array("changetime" => $val->changetime, "requestby" => ($val->requestby == "null") ? -1 : $val->requestby, "tarnewname" => $val->tarnewname, "recordid" => $val->recordid);'), array(&$_tmp));
            
            
        }
        usort($_tmp,array('Services','sort_tarif_changes_by_date'));
        
        return $_tmp;
    }

    /**
     * Remove scheduled tarif by user
     * @param	object, billing class
     */
    function deleteScheduled( $recordid )
    {
        if( false == Yii::app()->controller->lanbilling->delete("delClientTarifsRasp", array("id" => (integer)$recordid), array("getClientVgroups")) ) {
            return false;
        }
        return true;
    } // end deleteScheduled()

    
    public function applyAddService() {
        $vgroup = $this->get_vgdata();
        $struct = array(
            "servid"    =>  (int) $this->servid,
            "vgid" => $this->vgid,
            "tarid" => (int) $vgroup->vgroup->tarifid,
            "catidx" => (int) $this->catidx,
            "mul" => 1,
           // "timefrom" => date("YmdHis",strtotime($this->dtfrom)),
          //  "timeto" => (!empty($this->dtto)) ? date("YmdHis",strtotime($this->dtto)) : '',
	    	"timefrom" => ($this->dtfrom == date("Y-m-d")) ? "" : date("Y-m-d 00:00:00",strtotime($this->dtfrom)),
            "timeto" => (!empty($this->dtto)) ? date("Y-m-d 00:00:00",strtotime($this->dtto)) : '',
            'rate' => 1
        );
        
        if ($this->servid) $insert = false;
        else $insert = true;
        
        try {
            if( false == ($result = Yii::app()->controller->lanbilling->save("insupdClientUsboxService", $struct, $insert, array("getVgroupServices")))) {
                $error = Yii::app()->controller->lanbilling->soapLastError()->detail;

                Yii::log('Error while adding usbox service. Detail: '.$error, 'error', 'error');
                throw new Exception ($error);
            }
        }
        catch(Exception $error) {
            Yii::log(__METHOD__.'Can not adding usbox service. Detail: '.$error->getMessage(), 'error', 'error.usboxservice');
            return false;
        }
        return true;
    }
    
	/**
     * Планирование тарифного плана
     */
    public function applyChangeTariff()
    {
        // Смена ТП текущим моментом
        if (!Yii::app()->params['schedule_month_start'] && !Yii::app()->params['schedule_month_start_strict'] && (integer)Yii::app()->params['schedule_period_limit'] == 0){
            if ($this->changeDate == date('Y-m-d'))
                $this->changeDate = date('Y-m-d H:i:s');
        }

		$struct = array(
            "recordid"   => 0,
            "vgid"       => $this->vgid,
            "groupid"    => 0,
            "id"         => $this->vgData->vgroup->agentid,
            "taridnew"   => $this->tarid,
            "taridold"   => $this->vgData->vgroup->tarifid,
            "changetime" => $this->changeDate,
            "requestby"  => "",
            "discount"   => 1
        );
        try {
            if( false == ($result = Yii::app()->controller->lanbilling->save("insClientTarifsRasp", $struct, false, array("getClientVgroups")))) {
                $error = Yii::app()->controller->lanbilling->soapLastError()->detail;
                Yii::log('Error while scheduling tariff. Detail: '.$error, 'error', 'error');
                throw new Exception ($error);
            }
        }
        catch(Exception $error) {
            Yii::log(__METHOD__.'Can not scheduling tariff. Detail: '.$error->getMessage(), 'error', 'error.tariff');
            return false;
        }
        return true;
    }
    
    
    
    
    
    
    
    
    
    public function getVgroupServices1($vgroup,$callback = false) {
        $result = $this->get_array(yii::app()->controller->lanbilling->get("getTarCategories", array("id" => $vgroup->tarifid), true));
        if ($callback AND $result) $result = $this->$callback($result,$params);
        return $result;
    }
    
    public function getUniqueServices1($services,$params) {
        $result = array();
        foreach ($services as $s) {
            if (!$s->uuid OR !$this->reg_match_in_array($s->uuid, $this->stored('service_functions_uuids'))) {
            	
                if ($s->available) {
                    $link = CHtml::link($s->descr,array('services/choosevgroupforservice',
                        'catidx' => $s->catidx,
                        'tarifid' => $s->tarid,
                        'common' => $s->common
                ));
                } else $link = $s->descr.' <em class="unavailable">(Управление услугой недоступно)</em>';
                $result[] = array(
                    'description' => $link,
                    'price' => $s->above.' руб.'
                );
            }
        }
        return $result;
    }





}
