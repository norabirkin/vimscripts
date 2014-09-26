<?php

class DocumentsqueueController extends Controller {
    private $mimeTypes =  array(
        'image/bmp'=>'bmp',
        'application/msword'=>'doc',
        'application/octet-stream'=>'exe',
        'image/gif'=>'gif',
        'application/x-gtar'=>'gtar',
        'application/x-gzip'=>'gz',
        'text/html'=>'htm',
        'text/html'=>'html',
        'image/jpeg'=>'jpe',
        'image/jpeg'=>'jpeg',
        'image/jpeg'=>'jpg',
        'application/pdf'=>'pdf',
        'image/png'=>'png',
        'application/mspowerpoint'=>'pps',
        'text/rtf'=>'rtf',
        'application/x-shockwave-flash'=>'swf',
        'application/x-tar'=>'tar',
        'application/x-tcl'=>'tcl',
        'text/plain'=>'txt',
        'audio/x-wav'=>'wav',
        'application/vnd.ms-excel'=>'xls',
        'application/xml'=>'xml',
        'application/zip'=>'zip'
    );
    public function actionList() {
        $list = new OSSList(array(
            'useSort' => false
        ));

        $onFly = explode(',' , $this->param('on_fly'));
        foreach($onFly as $k=>$item) {
            $onFly[$k] = (int)$item;
        }
        $params = array(
            'on_fly' => $onFly,
            'time_from' => ((string) $this->param('time_from')) ? (string) $this->param('time_from').' 00:00:00' : "",
            'time_to' => ((string) $this->param('time_to')) ? (string) $this->param('time_to').' 00:00:00' : "",
            'template_name' => (string) $this->param('template_name')
        );
        
        $list->get('getStatusGenTask', $params);
    }
    public function actionCreate() {
        $dtto = '';
        yii::log(array(
            'document_period' => $this->param('document_period'),
            'since' => $this->param('since')
        ), 'vardump');
        switch ((int) $this->param('document_period')) {
            case 0:
                $period = $dtfrom = (string) $this->param('period');
                break;
            case 1:
                $period = $dtfrom = (string) $this->param('since');
                $dtto = (string) $this->param('to');
                break;
            case 2:
                $period = (string) $this->param('date');
                break;
        }
        $this->success(yii::app()->japi->callAndSend('addDocumentGenTask', array(
            'val' => array(
                'period' => (int) date('Ym', strtotime($period)),
                'doc_id' => (int) $this->param('doc_id'),
                'ugrp' => ((int) $this->param('include_group') == 1) ? ((int) $this->param('group_id')) : 0
            ),
            'flt' => array(
                'dtfrom' => $dtfrom,
                'dtto' => $dtto,
                'ugroups' => ((int) $this->param('include_group') == 1) ? ((int) $this->param('group_id')) : 0,
                'notgroups' => ((int) $this->param('include_group') == 2) ? ((int) $this->param('group_id')) : 0,
                'code' => ((int) $this->param('on_fly') == 7) ? (string) $this->param('code') : '',
                'receipt' => ((int) $this->param('on_fly') == 7) ? (string) $this->param('receipt') : '',
                'category' => ((int) $this->param('on_fly') == 7) ? (int) $this->param('category') : 0,
                'searchtempl' => (string) $this->param('search_template') ? CJSON::decode($this->param('search_template')) : null
            )
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delGenTask', array(
            'record_id' => (int) $this->param('id')
        )));
    }
    public function actionCancel() {
        $this->success(yii::app()->japi->callAndSend('cancelGenTask', array(
            'record_id' => (int) $this->param('record_id')
        )));
    }
    private function inCorePath($path) {
        if (preg_match('/^(\/)|(\w:[\/])/', $path)) {
            return $path;
        } else {
            return (yii::app()->params['corePath'] . preg_replace('/^[\.\\/]+/', '', $path));
        }
    }
    public function actionDownload() {
        $dowloader = new DocumentsDownloader;
        $this->downloadAction();
        try {
            if (
                !((int) $this->param('last_order_id')) OR
                !($order = yii::app()->japi->callAndSend('getOrders', array(
                   'order_id' => (int) $this->param('last_order_id')
                )))
            ) {
                $this->error(yii::t('errors', 'Order is not found'));
            }
            $order = $order[0];
            $doc_template = explode('.', $order['template']);
            $doc_template[0] = $order['order_id'];
            $filename = strtr('name-date.extension', array(
                'name' => $doc_template[0],
                'date' => date('Ymd', strtotime($order['period'])),
                'extension' => $order['upload_ext'] == 'application/octet-stream' ?
                    $doc_template[1] :
                    $this->mimeTypes[strtolower($order['upload_ext'])]
            ));
            $path = strtr('dir/date/file', array(
                'dir' => $this->inCorePath($order['save_path']),
                'date' => date('Ym', strtotime($order['period'])),
                'file' => implode($doc_template, '.')
            ));
            if (!$dowloader->download($path, $filename, $order['upload_ext'])) {
                $this->error(yii::t('errors', 'Failed to download document'));
            }
        } catch (Exception $e) {
            $this->error($e->getMessage());
        }
    }
    
    
    public function actionGenPrintForms() {
        $month = ($this->param('period_month') == '') ? '01' : $this->param('period_month');

        $period = $this->param('period_year') . $month;
        $params = array(
           'val' => array(
               'period' => (int)$period,
               'doc_id' => (int)$this->param('doc_id'),
               'num' => (int)$this->param('startnum'),
               'date' => (int)date('Ymd',strtotime($this->param('date'))),
               'summ' => (float)$this->param('sum'),
               'grp' => (int)0,
               'uid' => ($this->param('userType')==2) ? (int)$this->param('uid') : 0,
               'oper' => (int)$this->param('oper_id'),
               'comment' => $this->param('comment'),
               'groupcnt' => (int)$this->param('groupcnt'),
               'groupidx' => 0,
               'ugrp' => ((int) $this->param('include_group') == 1 && (int)$this->param('userType')==1) ? ((int) $this->param('group_id')) : 0
           ),
           'flt' => array(
               'ugroups' => ((int) $this->param('include_group') == 1 && (int)$this->param('userType')==1) ? ((int) $this->param('group_id')) : 0,
               'notgroups' => ((int) $this->param('include_group') == 2 && (int)$this->param('userType')==1) ? ((int) $this->param('group_id')) : 0,
               'searchtempl' => (string) $this->param('search_template') ? CJSON::decode($this->param('search_template')) : null
           )
        );
        
        $this->success(yii::app()->japi->callAndSend('addDocumentGenTask', $params));
    }
}

?>
