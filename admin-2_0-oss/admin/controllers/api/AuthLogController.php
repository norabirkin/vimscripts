<?php
class AuthLogController extends Controller{

    public function actionList() {
        $dtfrom = ($this->param("dt_from") != '') ? explode('T', $this->param("dt_from")) : array(date('Y-m-d'));
        $dtto = ($this->param("dt_to") != '') ? explode('T', $this->param("dt_to")) : array(date('Y-m-d', strtotime($dtfrom[0] . ' + 1 day')));

        $filter = array(
            'nodata' => false,
            'dt_from' => $dtfrom[0],
            'dt_to' => $dtto[0],
            'status' => ($this->param("event") == '') ? 'ALL' : $this->param("event")
        );
        
        if($this->param("agent") != '') {
            $filter['agent_id'] = (int)$this->param("agent");
        }

        if($this->param("filtertext") != '') {
            switch((int)$this->param("flt")) {
                case 0: 
                    $filter['vg_login'] = $this->param("filtertext");
                    break;
                case 1: 
                    $filter['name'] = $this->param("filtertext");
                    break;
                case 2:
                    $filter['agrm_num'] = $this->param("filtertext");
                    break;
                case 3:
                    $filter['mac'] = $this->param("filtertext");
                    break;
                case 4:
                    $filter['device_name'] = $this->param("filtertext");
                    break;
            }            
        }

        $res = yii::app()->japi->callAndSend("getAuthHistory", $filter);
        
        $this->success( $res );
    }
} ?>
