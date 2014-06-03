<?php 

class SharedPosts_Scripts {
	private $namespace = '';
	private $params = '';
	private $task = '';
	private $jscontent = '';
	private $script = '';
	public function __construct($conf) {
		foreach( $conf as $k => $v ) {
			$method = 'set' . ucfirst( $k );
			if(method_exists($this, $method)) $this->$method( $v );
		}
	}
	private function getScriptTag($conf) {
		if ($conf['src']) $src = ' src="js/' . $conf['src'] . '.js"';
		else $src = '';
		if ($conf['content']) $content = $conf['content'];
		else $content = '';
		$html = '<script type="text/javascript"' . $src . '>' . $content . '</script>';
		return $html;
	}
	public function setNamespace( $namespace ) {
		$this->namespace = (string) $namespace;
		$this->jscontent = 'Ext.ns("' . $this->namespace . '");' . $this->jscontent;
	}
	private function setOption( $name, $value ) {
		$this->$name = $value;
		$this->jscontent .= $this->namespace . '.' . $name . ' = ' . $value . ';';
	}
	public function setParams( $params ) {
		$this->setOption( 'params', json_encode( (array) $params )  );
	}
	public function setTask( $task ) {
		$this->setOption( 'task', "'" . (string) $task . "'" );
	}
	public function setScript( $script ) {
		$this->script = $script;
	}
	public function output() {
		$script = $this->getScriptTag(array( 
			'content' => $this->jscontent 
		));
        foreach ($this->script as $item) {
            $script .= $this->getScriptTag(array(
                'src' => $item
            )); 
        }
		return $script;
	}
}

class SharedPosts {

	private $managers;
	private $lanbilling;
	private $localize;
	private $tpl;
	private $task;
	function __construct( $lanbilling, $localize ) {
		$this->localize = $localize;
		$this->setLanbilling( $lanbilling );
		$this->task = ( $_POST['task'] ) ? $_POST['task'] : 'outputListHTML';
		$this->tpl = new HTML_Template_IT(TPLS_PATH);
	}
	private function outputHTML( $scripts ) {
		$this->tpl->loadTemplatefile("broadcast_mess.tpl",true,true);
		$this->tpl->setVariable("SCRIPTS", $scripts);
		$this->tpl->show();
	}
	public function outputListHTML() {
		$scripts = new SharedPosts_Scripts(array(
			'namespace' => 'SharedPosts',
			'script' => array(
                'sbss_view',
                'broadcast_mess'
            ),
			'task' => 'list'
		));
		$this->outputHTML( $scripts->output() );
	}
	private function getScriptTag($conf) {
		if ($conf['src']) $src = ' src="js/' . $conf['src'] . '.js"';
		else $src = '';
		if ($conf['content']) $content = $conf['content'];
		else $content = '';
		$html = '<script type="text/javascript"' . $src . '>' . $content . '</script>';
		return $html;
	}
	private function outputFormHTML( $isNew = false ) {
		$scripts = new SharedPosts_Scripts(array(
			'namespace' => 'SharedPosts',
			'script' => array(
                'sbss_view',
                'broadcast_mess'
            ),
			'task' => 'form',
			'params' => $this->getEditFormValues( $isNew )
		));
		$this->outputHTML( $scripts->output() );
	}
	private function editForm() {
		$this->outputFormHTML();
	}
	private function createForm() {
		$this->outputFormHTML( true );
	}
	private function br2nl( $data ) {
  		return preg_replace( '!<br.*>!iU', "", $data );
	}
	private function deleteMessage() {
		if( $this->lanbilling->delete("delSharedPost", array("id" => (int) $_POST['post_id'])) ) $this->success();
		else $this->error( 'Cannot delete message' );
	} 
	private function sendMessage() {
		$ids = explode(",",$_POST["ids"]);
		foreach( $ids as $id ) if( !$this->lanbilling->get("sendSharedPost", array("id" => (int) $id)) ) $this->error( 'Cannot send message' );
		$this->success();
	}
	private function saveMessage(){
		$params = array(
			'pid' => (int) $_POST['pid'],
    		'postto' => (int) $_POST['postto'],
    		'text' => $_POST['text']
		);
		if ((int) $_POST["uid"]) $params["uid"] = (int) $_POST["uid"];
		else $params["groupid"] = (int) $_POST["groupid"];
		if((int) $_POST["postto"] == 0) {
			$params['postcatid'] = $_POST['category'];
		}
		if ( $this->lanbilling->save( 'setSharedPost', $params ) ) $this->success($this->lanbilling->saveReturns->ret);
		else $this->error( "Cannot save message" );
	} 
	private function setStatus(){
		$params = array(
				'pid' => (int) $_POST['pid'],
				'postto' => (int) $_POST['postto'],
				'text' => $_POST['text'],
				'status' => (int) $_POST["status"],
				'created' => $_POST["created"]
		);
		if ((int) $_POST["uid"] > 0) $params["uid"] = (int) $_POST["uid"];
		else $params["groupid"] = (int) $_POST["groupid"];
		if ( $this->lanbilling->save( 'setSharedPost', $params ) ) $this->success($this->lanbilling->saveReturns->ret);
		else $this->error( $this->localize->get( "Cannot change status" ) );
	}
	private function getUserGroups() {
		$result = array();
		$groups = $this->lanbilling->get( 'getUserGroups' );
		$groups = $this->checkArrayResult( $groups, 'Cannot load usergroups' );
		foreach ( $groups as $usergroup ) {
			$result[] = array(
				'id' => $usergroup->usergroup->groupid,
				'name' => $usergroup->usergroup->name 
			);	
		}
		$this->success( $result );
	
	}
	private function getEditFormValues( $isNew = false ) {
  		if (!$isNew) $post = $this->lanbilling->get("getSharedPosts", array("flt" => array(
  			"recordid" => (int) $_POST['post_id'],
			"type" => -1
  		)));
		else $post = null;
		
		if ($post->uid) $account = $this->lanbilling->get('getAccount', array('id' => $post->uid)); 
		else $account = null;
		
		return array(
	   		'message_text' => ($post == null) ? '' : $this->br2nl($post->text),
			'sent' => ($post == null) ? "0000-00-00 00:00:00" : $post->senttime,
            'date_new' => ($post == null) ? date('Y-m-d H:i') : $post->posttime,
            'action' => 3,  
            'post_id' => ($isNew) ? 0 : $_POST['post_id'],
            'postto' => ($post == null) ? 0 : $post->postto,
			'groupid' => ($post == null) ? null : $post->groupid,
			'uid' => ($post == null) ? null : $post->uid,
			'username' => $account ? $account->account->name : '',
			'category' =>  $post == null ? -1 : $post->postcatid
		);
	}	
	private function checkArrayResult( $result, $errorMsg = 'unknown error' ) {
		if ( $result === false OR $result === null ) $this->error( $errorMsg );
		if ( !is_array($result) ) $result = array( $result );
		return $result;
	}
	private function setFakes() {
		$this->lanbilling->getFakeConstructor()->get(
			Rq::get( "getSharedPosts", array(
				"flt" => array (
					"type" => 1,
					"pgsize" => 5,
					"pgnum" => 1
				)
			)),
			array (
			    0 => Obj::get(array (
				'pid' => 12,
				'postby' => 0,
				'postto' => 1,
				'groupid' => 4,
				'uid' => 0,
				'posttime' => '2013-05-17 11:38:32',
				'text' => 'Email-001',
				'senttime' => '0000-00-00 00:00:00',
			    )),
			    1 => Obj::get(array (
				'pid' => 13,
				'postby' => 0,
				'postto' => 1,
				'groupid' => 5,
				'uid' => 0,
				'posttime' => '2013-05-17 11:38:47',
				'text' => 'Email-002',
				'senttime' => '0000-00-00 00:00:00',
			    )),
			    2 => Obj::get(array (
				'pid' => 14,
				'postby' => 0,
				'postto' => 1,
				'groupid' => 2,
				'uid' => 0,
				'posttime' => '2013-05-17 11:39:04',
				'text' => 'Email-003',
				'senttime' => '2013-04-15 00:00:00',
			    )),
			    3 => Obj::get(array (
				'pid' => 15,
				'postby' => 0,
				'postto' => 1,
				'groupid' => 0,
				'uid' => 22,
				'posttime' => '2013-05-17 11:39:35',
				'text' => 'Email-004',
				'senttime' => '2013-06-25 00:00:00',
			    )),
			    4 => Obj::get(array (
				'pid' => 16,
				'postby' => 0,
				'postto' => 1,
				'groupid' => 28,
				'uid' => 0,
				'posttime' => '2013-05-17 11:39:52',
				'text' => 'Email-005',
				'senttime' => '0000-00-00 00:00:00',
			    ))
			)
		);
	}
	private function getStatus($senttime) {
		if ($senttime == '0000-00-00 00:00:00') return $this->localize->get("Not sent");
		else {
			if ( strtotime($senttime) < time() ) $status = "Sent";
			else $status = "Planed to send";
			return $this->localize->get($status) . ' ' . $senttime;
		}
	}
	private function getStatusText($status) {
		if($status == 0) 
			return $this->localize->get('Created-o');
		if($status == 1) 
			return $this->localize->get('Published');
		if($status == 2) 
			return $this->localize->get('Publish is ended');
		return $this->localize->get('Undefined');
	}
	private function getMessages( $type ) {
		$params = array(
  			"type" => $type
  		);
		foreach( array('dtfrom','dtto','descr') as $param ) {
			if( $_POST[$param] ) $params[ $param ] = $_POST[ $param ];
		}
		$count = $this->lanbilling->get("Count", array("flt" => $params, "procname" => "getSharedPosts"));	
		$params['pgsize'] = ($_POST['limit']) ? (int) $_POST['limit'] : 5;
		if(!isset($_POST['start'])) $_POST['start'] = 0;
        	$params['pgnum'] = (int) $this->lanbilling->linesAsPageNum($params['pgsize'], (int) $_POST['start'] + 1);
		//$this->setFakes();
		if ($count) {
  			$posts = $this->lanbilling->get("getSharedPosts", array("flt" => $params));
			$posts = $this->checkArrayResult( $posts, 'Cannot load messages' );
		} else $posts = array();
  		$result = array();
  		foreach( $posts as $mess ) {
    			$result[] = array(
    				"edit_this" => $mess->pid,
					"manager" 	=> $this->getManagerName($mess->postby),
					"created" 	=> $mess->posttime,
					"sent"		=> $this->getStatus($mess->senttime),
					"mess_text" => $mess->text,
    				"statusid"	=> $mess->status,
    				"statusname"=> $this->getStatusText($mess->status),
    				"groupid"	=> $mess->groupid,
    				"uid"		=> $mess->uid,
    				"category"	=> $mess->postcatid
    			);
  		}
		$this->success( $result, $count );
	}
	private function getManagerName($id) {
		if (!isset($this->managers[$id])) {
			if (!$manager = $this->lanbilling->get("getManager", array("id" => (integer) $id))) $this->managers[$id] = '';
			else $this->managers[$id] = $manager->manager->fio;
		}
		return $this->managers[$id]	;
	}
	public function getEmailMessages() {
		$this->getMessages( 1 );
	}
	public function getClientMessages() {
		$this->getMessages( 0 );
	}
	private function error( $reason = 'unknown error' ) {
		echo json_encode(array( 
			"success" => false,
			"errors" => array(
				"reason" => $reason
			)
		));
		die();
	}
	private function success( $result = null, $total = null ) {
		$output = array( "success" => true );
		if( $result !== null ) $output["results"] = $result;
		if( $total !== null ) $output["total"] = $total;
		echo json_encode( $output );
		die();
	}
	private function setLanbilling(LANBilling $lanbilling) {
		$this->lanbilling = $lanbilling;
		//$this->lanbilling = new LBFake($lanbilling);
	}
	public function run() {
		$method = $this->task;
		$this->$method();
	}
}

$sharedPosts = new SharedPosts( $lanbilling, $localize );
$sharedPosts->run();

?>
