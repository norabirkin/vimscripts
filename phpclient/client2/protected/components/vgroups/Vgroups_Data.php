<?php

class Vgroups_Data extends LBWizardItem {
    private static $vgroups = array();
    public function vgroups($agrmid = null) {
        if ($this->cache()->get('vgroups') === null) {
            $data = array();
            $vgroups['agreements'] = array();
            foreach ($this->a('getClientVgroups') as $vgroup) {
                $data[$vgroup->vgroup->vgid] = $vgroup;
                if (!isset(self::$vgroups['agreements'][self::$vgroups->vgroup->agrmid])) {
                    self::$vgroups['agreements'][self::$vgroups->vgroup->agrmid] = array();
                }
                self::$vgroups['agreements'][$vgroup->vgroup->agrmid][] = $vgroup;
            }
            $this->cache()->set('vgroups', null, $data);
        }
        if ($agrmid) {
            $data = self::$vgroups['agreements'][$agrmid];
            return $data ? $data : array();
        } else {
            return $this->cache()->get('vgroups');
        }
    }
    public function vgroup($vgid) {
        if (($vgroups = $this->cache()->get('vgroups')) !== null) {
            $vgroup = $vgroups[$vgid];
        } else {
            $vgroup = $this->g('getClientVgroups', array(
                'flt' => array(
                    'vgid' => $vgid
                )
            ));
            $this->cache->set('vgroup', $vgid, $vgroup);
        }
        if (!$vgroup) {
            throw new Exception('Vgroup not found');
        }
        return $vgroup;
    }
    public function type($type) {
        $data = array();
        foreach ($this->vgroups() as $vgroup) {
            if (Vgroup_Type::check($vgroup, $type)) {
                $data[] = $vgroup;
            }
        }
        return $data;
    }
}

?>
