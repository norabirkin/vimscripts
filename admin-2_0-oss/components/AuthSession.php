<?php
        
class AuthSession extends CHttpSession {
    private $authorized; 
    /**
    * Initialize
    */
    
    public function init() {
        yii::app()->setComponent('japi', yii::createComponent(array(
            'class' => 'JAPIClient'
        )));
    }

    /**
     * Returns a value indicating whether to use custom session storage.
     * This method should be overriden to return true if custom session storage handler should be used.
     * If returning true, make sure the methods {@link openSession}, {@link closeSession}, {@link readSession},
     * {@link writeSession}, {@link destroySession}, and {@link gcSession} are overridden in child
     * class, because they will be used as the callback handlers.
     * The default implementation always return false.
     * @return boolean whether to use custom storage.
     */
    public function getUseCustomStorage() {
        return true;
    }
    
    /**
     * Open the session
     * @return bool
     */
    public function openSession() {
        return $this->callAPI( 'open' );
    } // end open()
    
    
    /**
     * Close the session
     * @return bool
     */
    public function closeSession()
    {
        return $this->callAPI( 'close' );
    } // end close
    
    
    /**
     * Read the session
     * @param int session id
     * @return string string of the sessoin
     */
    public function readSession( $id )
    {
        if(false != ($result = $this->callAPI('read'))) {
            return $result['data'];
        }
        return "";
    } // end read()
    
    
    /**
     * Write the session
     * @param int session id
     * @param string data of the session
     */
    public function writeSession( $id, $data )
    {
        $result = $this->callAPI('write', time(), $data);
        return $result['success'];
    } // end write
    
    
    /**
     * Destoroy the session
     * @param int session id
     * @return bool
     */
    public function destroySession( )
    {    
        return $this->callAPI('destroy');
    } // end destroy()
    
    
    /**
     * Garbage Collector
     * @param int life time (sec.)
     * @return bool
     * @see session.gc_divisor      100
     * @see session.gc_maxlifetime 1440
     * @see session.gc_probability    1
     * @usage execution rate 1/100
     *        (session.gc_probability/session.gc_divisor)
     */
    public function gcSession( $max )
    {
        return $this->callAPI('destroy', (time() - $max) );
    } // end gc()
    
    
    
    /*
    * Call JApi method
    */
    
    public function callAPI( $event, $timestamp = '', $data = '' ) {        
        $params = array(
            'event' => $event,
            'id' => session_id(),
            'time_stamp' => (int)$timestamp,
            'data' => $data
        );

        $resp = yii::app()->japi->callAndSend("WebSessionHandler", $params);

        if(session_id() == '') {
            session_id($resp['id']);
        }
        $this->authorized = $resp['authorized'];
    
        return $resp;
    } // end callAPI

    public function isAuthorized() {
        return $this->authorized;
    }

    public function regenerateID() {
    }

    public static function endRequest() {
        @session_write_close();
    }
    
}
    
?>
