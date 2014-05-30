<?php
/**
 * Форма управления тарифами и услугами
 */
class tarifs_and_services_page 
{
    public $agreement_id;
    public $vgroup_id;
    public $action_id;
    /**
     * Учетные записи пользователя
     */
    public $vgroups = array();
    /**
     * Доступные действия, для данной учетной записи (изменение тарифа и подключение услуг)
     */
    public $actions = array();
    public $vgroups_avaliable = false;
    public $actions_avaliable = false;
    public $current_vgroup = false;
    public $current_vgroup_services = array();
    public $current_vgroup_tarifs = array();
    public $service_volume = array();
    
    function __construct($agreement_id,$vgroup_id,$action_id) {
        $this->agreement_id = $agreement_id;
        $this->vgroup_id = $vgroup_id;
        $this->action_id = $action_id;
        $this->vgroups = $this->get_vgroups();
        if ($this->current_vgroup) $this->actions_avaliable = true;
        $this->actions = $this->get_actions();
        $this->service_volume = $this->get_service_volume();
    }
    
    public function action_avaliable($action) {
        if (in_array($action, array_keys($this->actions))) return true;
        return false;
    }
    
    private function get_actions() {
        $actions = array();
        if ($this->current_vgroup_tarifs) $actions[1] = 'ChangeTarification';
        if ($this->current_vgroup_services) $actions[2] = 'ChangeServices';
        return $actions;
    }
    
    private function get_service_volume() {
        $tarifs_volume = 0;
        $tarifs_unlimited = 0;
        if ($this->current_vgroup_tarifs) {
            foreach ($this->current_vgroup_tarifs as $t) {
                if (!empty($t->servicevolume)) $tarifs_volume++;
                else $tarifs_unlimited++;
            }
        }
        return array(
            'tarifs_volume' => $tarifs_volume,
            'tarifs_unlimited' => $tarifs_unlimited
        );
    }
    
    private function get_array($var) {
        if (!$var) return array();
        return is_array($var) ? $var : array($var);
    }
    
    private function get_services($tarif_id) {
        $avaliable_services = array();
        $services = $this->get_array(
                yii::app()->controller->lanbilling->get("getTarCategories", array("id" => $tarif_id))
        );
        foreach ($services as $s) {
            if (empty($s->archive) && !empty($s->available)) $avaliable_services[] = $s;
        }
        return $avaliable_services;
    }
    
    private function get_vgroups() {
        $vgroups = array();
        //Перебираем учетные записи пользователя
        foreach (yii::app()->controller->lanbilling->vGroups as $g) {
            //Отсеиваем некорректные элементы
            if ( !(is_object($g)) ) continue;
            //Отсеиваем учетки, не относящиеся к выбранному договору
            if ( $g->vgroup->agrmid != $this->agreement_id ) continue;
            //Получаем услуги связанные с данной учеткой
            $services = $this->get_services($g->vgroup->tarifid);
            //Получаем тарифы, доступные на смену текущего тарифа, связанного с данной учеткой. В том случае, когда пользователь уже запланировал переход на другой тариф, функция смены тарифа должна быть недоступна
            $tarifs = (tarif_change_schedule::check_requests($g))? $g->tarstaff : array();
            //Отсеиваем учетку если с ней невозможно произвести ни действие смены тарифа, ни действие подключения услуг.
            if (!$services AND !$tarifs) continue;
            
            //Записываем данные выбранной пользователем учетки
            if ( $g->vgroup->vgid == $this->vgroup_id ) {
                $this->current_vgroup = $g;
                $this->current_vgroup_services = $services;
                $this->current_vgroup_tarifs = $tarifs;
            }
            
            $vgroups[] = $g;
        }
        if ($vgroups) $this->vgroups_avaliable = true;
        return $vgroups;
    }
}

?>
