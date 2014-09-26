<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class LBController extends WRestController
{
    /**
     * Language cookie name
     * @var string
     */
    private $langCookieName = 'lang';
    
    /**
     * Stop error rizing
     * @var boolean
     */
    private $_stopErrorRize = true;
    
    
    protected $_error = array();
    private $download = false;
   
    
    private function setErrorAndExceptionHandlers() {
        // Let completely bypass Yii's default error displaying mechanism 
        // by registering onError and onException event listeners
        Yii::app()->attachEventHandler('onError',array($this,'handleError'));
        Yii::app()->attachEventHandler('onException',array($this,'handleError'));
    }
    
    /**
     * Initializes the controller. This method is called by the application 
     * before the controller starts to execute.
     */
    public function init()
    {
        $this->setErrorAndExceptionHandlers();
        yii::app()->substituteExtPath();
        parent::init();
        yii::app()->restoreExtPath();
        if ($_FILES) {
            $this->response = new FileResponse;
        } else {
            $this->response = $this->defaultResponse();
        }
        // Set Error handling
        $this->startSession();
    }

    protected function startSession() {
        yii::app()->session->open();
    }

    protected function defaultResponse() {
        return new JsonResponse;
    }

    private function convertParam( $value, $type ) {
        if ($type == 'int' OR $type == 'integer') {
            return (int) $value;
        }
        elseif ( $type == 'string' ) return (string) $value;
        elseif ( $type == 'bool' OR $type == 'boolean' ) return (bool) $value;
        elseif ( $type == 'float' OR $type == 'double' ) return (float) $value;
    }
        
    public function params( $params = null, $ifNotEmpty = false ) {
        $p = $this->getRequest()->getAllRestParams();
        if ( $params OR $ifNotEmpty ) {
            foreach ($p as $k => $v) {
                $p[$k] = trim($p[$k]);
                if ($params) { 
                    if (!$params[$k]) {
                        unset($p[$k]);
                    } else {
                        $p[$k] = $this->convertParam( $p[$k], $params[$k] );
                    }
                }
                if ( $ifNotEmpty ) {
                    if (!$v) {
                        unset($p[$k]);
                    }
                }
            }
        }
        return $p;
    }
    
    public function param( $paramName, $defaultValue = null ) {
        return $this->getRequest()->getParam( $paramName, $defaultValue );
    }

    public function success( $result = true, $total = null ) {
        $response = array(
            "success" => true,
            "results" => $result
        );
        if ($total !== null) {
            $response["total"] = (int) $total;
        }
        $this->sendResponse(200, $response); 
    }
    
    public function error( $error = null, $data = null ) {
        $response = array(
            "success" => false,
            "details" => $error ? $error : yii::t("messages", "unknown error"),
            'data' => $data
        );
        $this->sendResponse(500, $response);
    }

    public function sendResponse($status = 200, $bodyParams = array()) {
        if (yii::app()->getJsonResponseSent()) {
            return;
        }
        yii::app()->setJsonResponseSent();
        if ($this->download) {
            $this->sendDonwloadError($status, $bodyParams);
        }
        if ($status == 200) {
            if (!isset($bodyParams['success'])) {
                if (isset($bodyParams['total'])) {
                    $total = (int)$bodyParams['total'];
                    unset($bodyParams['total']);
                }
                $bodyParams = array(
                    "success" => true,
                    "results" => $bodyParams
                );
                if (isset($total)) {
                    $bodyParams['total'] = (int)$total;
                }
            }
        }
        parent::sendResponse($status, $bodyParams);
    }
    
    /**
     * Handling all errors and exceptions for all controllers
     * To check if there was error or exception need use construction like
     * 
     * if ($event instanceof CExceptionEvent) { ... }
     * elseif($event instanceof CErrorEvent) { ... }
     * 
     * @param   {object} event
     */
    public function handleError(CEvent $event)
    {
        $error = ($event instanceof CExceptionEvent) ? $event->exception : $event;
        $message = '';
        
        if ($event instanceof CExceptionEvent) {
            if (($trace = $this->getExactTrace($error)) === null) {
                $fileName = $error->getFile();
                $errorLine = $error->getLine();
            } else {
                $fileName = $trace['file'];
                $errorLine = $trace['line'];
            }
            
            $trace = $error->getTrace();
            
            foreach ($trace as $i => $t) {
                if (!isset($t['file'])) {
                    $trace[$i]['file']='unknown';
                }
                
                if (!isset($t['line'])) {
                    $trace[$i]['line']=0;
                }
                
                if (!isset($t['function'])) {
                    $trace[$i]['function']='unknown';
                }
                
                unset($trace[$i]['object']);
            }
            $message = $error->getMessage();
        } elseif ($event instanceof CErrorEvent) {
            $trace = debug_backtrace();
            // skip the first 3 stacks as they do not tell the error position
            if (count($trace) > 3) {
                $trace = array_slice($trace,3);
            }
            
            $traceString = '';
            
            foreach ($trace as $i => $t) {
                if (!isset($t['file'])) {
                    $trace[$i]['file']='unknown';
                }
                
                if (!isset($t['line'])) {
                    $trace[$i]['line']=0;
                }
                
                if (!isset($t['function'])) {
                    $trace[$i]['function']='unknown';
                }

                $traceString .= "#$i {$trace[$i]['file']}({$trace[$i]['line']}): ";
                if (isset($t['object']) && is_object($t['object'])) { 
                    $traceString.=get_class($t['object']).'->';
                }
                $traceString.="{$trace[$i]['function']}()\n";

                unset($trace[$i]['object']);
            }
            
            switch($error->code) {
                case E_WARNING:
                    $type = 'PHP warning';
                    break;
                case E_NOTICE:
                    $type = 'PHP notice';
                    break;
                case E_USER_ERROR:
                    $type = 'User error';
                    break;
                case E_USER_WARNING:
                    $type = 'User warning';
                    break;
                case E_USER_NOTICE:
                    $type = 'User notice';
                    break;
                case E_RECOVERABLE_ERROR:
                    $type = 'Recoverable error';
                    break;
                default:
                    $type = 'PHP error';
            }
            $message = yii::t('messages', 'System error has occured. Please contact to administrator. Details: "{message}"', array(
                '{message}' => $error->message
            ));
        } else {
            return;
        }

        $status = ($error instanceof CHttpException) ? $error->statusCode : 500;

        $this->_error = array(
            'type' => $type ? $type : get_class($error),   
            'message' => $message,
            'status' => $status,
            'file' => $fileName ? $fileName : $error->file,
            'line' => $errorLine ? $errorLine : $error->line,
            'trace' => ($error instanceof CException) ? $error->getTraceAsString() : $traceString,
            'traces' => $trace
        );

        $this->processError($error);

        $this->showError(
            $this->_error['status'] ?
            $this->_error['status'] :
            $status
        );
        
        // Stop rising error / exception
        $event->handled = $this->_stopErrorRize;
    }

    protected function processError() {
    }
    
    
    public function showError($status) {
        if (YII_DEBUG == true) {
            $this->sendResponse($status, array(
                'success' => false,
                'error' => $this->_error
            ));
        } else {
            $this->sendResponse($status, array(
                'success' => false,
                'error' =>  array(
                    'message' => $this->_error['message']
                ))
            );
        }
    }
    
    
    /**
     * Returns the exact trace where the problem occurs.
     * @param Exception $exception the uncaught exception
     * @return array the exact trace where the problem occurs
     */
    protected function getExactTrace($exception)
    {
        $traces = $exception->getTrace();

        foreach ($traces as $trace) {
            // property access exception
            if (isset($trace['function']) && ($trace['function']==='__get' || $trace['function']==='__set')) {
                return $trace;
            }
        }
        return null;
    }
    
    public function setErrorRize($state = true) {
        $this->_stopErrorRize = is_bool($state) ? $state : true;
    }
    
    public function getError() {
        return $this->_error;
    }
}

?>
