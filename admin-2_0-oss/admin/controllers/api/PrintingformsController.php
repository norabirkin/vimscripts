<?php
class PrintingformsController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $params = $this->getParamsFilter();
        $list->get("getOrders", $params);
    }


    public function actionExport() {
        try {
            $this->downloadByFilename($this->param('file_name'), $this->param('upload_ext'));
        } catch ( Exception $e ) {
            $this->downloadError( yii::t("messages", $e->getMessage()) );
        }
    }


    public function actionGetMultipleFileName() {
        $filename = false;
        if($this->param('mode') == 'selected') { // загрузка выбранных записей
            
            $orderIds = explode(",", $this->param('ids'));
            foreach ($orderIds as &$item) {
                $item = (int)$item;
            }
            $params = array(
                "order_ids" => $orderIds
            );
           
        } elseif($this->param('mode') == 'all')  { // загрузка всех записей по фильтру
            $params = array(
                "params" => $this->getParamsFilter()
            );
        } elseif($this->param('mode') == 'page')  { // загрузка постранички по фильтру
            $params = array(
                "params" => $this->getParamsFilter()
            );
            $params['params']['pg_num'] = (int)($this->param('start') / $this->param('limit') + 1);
            $params['params']['pg_size'] = (int)$this->param('limit');
        } else {
            throw new CHttpException(500, yii::t("messages", "Undefined type of uploading"));
        }

        $tackId = yii::app()->japi->callAndSend("concatOrders", $params); // инициируем задачу
        for ($i=0; $i<100; $i++) {
            $status = yii::app()->japi->callAndSend("getGeneratorsTasks", array( // запрашиваем статус
                "task_id" => (int)$tackId
            ));
            $statusid = $status[0]['status'];
            if ($statusid == 0) { // если успешно выполнилось, отдаем название файла
                $filename = yii::app()->japi->callAndSend("getGeneratorsTasksResuts", array(
                    "task_id" => $tackId
                ));
                break;
            } else if ($statusid == 1 || $statusid == 2) { // если задача в процессе, крутим цикл
                sleep(2);
            } else if($statusid == 3) { // обработка статуса "Отменено"
                throw new CHttpException(500, yii::t("messages", "Task was closed"));
            } else { // обработка статуса "Ошибка"
                throw new CHttpException(500, yii::t("messages", $status[0]['message'])); 
            }
        }
        if ($filename === false) { // Если истек таймаут и имя файла не получено, отменяем задачу
            yii::app()->japi->callAndSend("cancelGeneratorsTask", array("task_id" => $tackId));
            throw new CHttpException(500, yii::t("messages", "Task was closed"));
        }
        $this->success($filename);
    }

    public function actionDownloadFile () {
        if($this->param('file_name')) {
            $this->downloadByFilename($this->param('file_name'), $this->param('upload_ext'));
        } else {
            $this->downloadError( yii::t("messages", 'File not found') );
        }
    }

    private function downloadError( $error ) {
        $this->renderPartial("application.views.error.download", array( "error" => $error ));
        die();
    }

    protected function downloadByFilename($filename, $extension) {
        if (file_exists($filename)) {
            $downloader = new Downloader();
            $downloader->sendHeaders($filename, $extension);
            ob_clean();
            flush();
            readfile($filename);
        } else {
            $this->downloadError( yii::t("messages", "File not found") . ': ' .  $filename );
        }
    }

    protected function getParamsFilter () {
        $params = array();
        $params['payed'] = (int)$this->param('payed');

        if ((integer) $this->param('periodrb') > 0) {
            $params['date_from'] = $this->param('date_from');
            $params['date_to'] = $this->param('date_to');
        } else {
            $params['period'] = $this->param('period');
        }
        if ( (integer) $this->param('doc_id') > 0 ) {
            $params['doc_id'] = (integer) $this->param('doc_id');
        }
        if ( (integer) $this->param('oper_id') > 0 ) {
            $params['oper_id'] = (integer) $this->param('oper_id');
        }
        if ( (integer) $this->param('user_group_id') > 0 ) {
            $params['user_group_id'] = (integer) $this->param('user_group_id');
        }
        if ( (integer) $this->param('payed') == 1 ) {
            $params['pay_date'] = (string) $this->param('pay_date');
        }

        if ((string)$this->param('searchvalue') != "") {
            switch((integer)$this->param('searchtype')) {
                case 1: 
                    $params['agrm_num'] = $this->param('searchvalue'); 
                    break;
                case 0: 
                    $params['acc_name'] = $this->param('searchvalue');
                    break;
                default:
                    $params['vg_login'] = $this->param('searchvalue');
            }
        }
        return $params;
    }
    
} ?>
