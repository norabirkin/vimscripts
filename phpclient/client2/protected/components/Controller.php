<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
    private $title;
	private $description;
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/main';

	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();


	/**
	 * LAN Billing object
	 * @var object
	 */
	public $lanbilling = null;

	/**
	 * Current page for objects arrays
	 * @var integer
	 */
	public $page = 0;

	/**
	* Current item for objects arrays
	* @var integer
	*/
	public $id = 0;

	/**
	 * Actual message (client-side)
	 * @var string
	 */
	public $message = '';

	/**
	 * Number of new messages (server)
	 * @var integer
	 */
	public $newmessages = 0;

	/**
	 * Number of orders not paid
	 * @var integer
	 */
	public $unpaidorders = 0;

	/**
	 * User balance (virtual)
	 * @var string
	 */
	public $userbalance = '';

	public $error=false;

    private $htmlBeforeEnd = '';
    
    public $pages;

    /**
     * Deprecated
     */
    //public function filters()
    //{
    //    return array(
    //        array('application.filters.AccessControl')
    //    );
    //}

    public function HTMLBeforeTitle() {
        return '';
    }

    public function param($name, $default = null) {
        return yii::app()->request->getParam($name, $default);
    }
    public function afterMenuConfigurated() {
    }
    public function t($message, $params = array()) {
        return yii::t('main', $message, $params);
    }
    public function form($config) {
        yii::import('application.components.form.*');
        return new LB_Form($config);
    }
    
    public function grid($config) {
        return new Table($config);
    }

    public function getPage() {
        if (!$this->pages) {
            return null;
        }
        $page = $this->pages->getCurrent();
        if ($page AND $page->swithedOff()) {
            $this->redirect(array('account/index'));
        }
        return $page;
    }

    private function initTitle() {
        if ($page = $this->getPage()) {
            $this->title = $page->title();
			$this->description = $page->description();
            $this->pageTitle = yii::app()->name.' - '.$this->title;
        }
    }

    private function initBreadcrumbs() {
        if ($page = $this->getPage()) {
            $this->setBreadcrumbs($page->breadcrumbs());
        }
    }
    
    public function setBreadcrumbs($breadcrumbs) {
        $title = end(array_keys($breadcrumbs));
        unset($breadcrumbs[$title]);
        $breadcrumbs[] = $title;
        $this->breadcrumbs = $breadcrumbs;
    }

    public function getTitle() {
        return $this->title;
    }
	
    public function getDescription() {
        return $this->description;
    }

    protected function beforeAction($action) {
        if (!yii::app()->start->isAuthorized()) {
            $this->redirect(array('site/login'));
        }
        if (!$action instanceof LBWizardAction) {
            $this->initTitle();
            $this->initBreadcrumbs();
        }
        return true;
    }

    public function output($content = '') {
        $this->render('application.views.content', array('content' => $content));
    }

    public function getHTMLBeforeEnd() {
        return $this->htmlBeforeEnd;
    }

    public function appendToEnd($html) {
        $this->htmlBeforeEnd .= $html;
    }

    /**
     * Perform access control for all operations
     */
    public function filters()
    {
        return array(
            'accessControl',
        );
    }
    public function accessRules()
    {
        return array(
            // allow login, logout and restore password for all users
            array('allow',
                'actions'=>array('login','logout','restore'),
                'users'=>array('*'),
            ),
            // allow all actions for logged users
            array('allow',
                'users'=>array('@'),
            ),
            // deny all actions for non authorized users
            array('deny',
                'users'=>array('*'),
            ),
        );
    }

	function stripTags( $str ) {
		return strip_tags( $str, "<p>,<div>,<strong>,<b>,<em>,<a>" );
	}

	/**
	 * Initializes all global objects (SOAP, LANBilling, etc)
	 */
	function init() {
		$this->lanbilling = Yii::app()->lanbilling;
		yii::app()->start->run();
	}

	/**
	 * Check param
	 */
	public function config($param) {
		return is_null(Yii::app()->params[$param]) ? false : Yii::app()->params[$param];
	}

	/**
	 * Convert agent number to some string
	 */
	public function convertAgentNumber($agent) {
		return empty($agent->telstaff) ? $agent->login : $agent->telstaff->phonenumber;
	}

	/**
	 * Formats date to readable view
	 */
	public function formatDate($date, $format = 1) {
		
		return Yii::app()->dateFormatter->format('d MMMM yyyy',$date);
		
		switch ($format) {
			case 2:
				return date("d.m.Y", $date);
			default:
				return date("j", $date) . ' ' . Yii::t('app', 'Month' . date("n", $date)) . ' ' . date("Y", $date);
		}
	}
	
	public function formatDateWithTime($date) {
		$dateExploded = explode(' ', $date);
		$timePart = substr($dateExploded[1],0,5);
		$unixTimestamp = strtotime($date);
		$datePart = yii::app()->controller->formatDate($unixTimestamp);
		return $datePart.' '.$timePart;
	}

	/**
	 * Return array of possible pagination
	 */
	public function getPages () {
		$this->lanbilling->pages = array();
		if ($this->lanbilling->totalPages > 1) {
			$this->lanbilling->pages[] = 1;
		}
		if ($this->lanbilling->totalPages > 2) {
			$this->lanbilling->pages[] = 2;
		}
		if ($this->lanbilling->totalPages > 3) {
			$this->lanbilling->pages[] = 3;
		}
		if ($this->page > 0) {
			$this->lanbilling->pages[] = $this->page;
		}
		if ($this->page > 1) {
			$this->lanbilling->pages[] = $this->page - 1;
		}
		$this->lanbilling->pages[] = $this->page + 1;
		if ($this->lanbilling->totalPages > $this->page + 1) {
			$this->lanbilling->pages[] = $this->page + 2;
		}
		if ($this->lanbilling->totalPages > $this->page + 2) {
			$this->lanbilling->pages[] = $this->page + 3;
		}
		$avg = round($this->lanbilling->totalPages / 2);
		if ($avg > 4 && $this->lanbilling->totalPages > 7) {
			$this->lanbilling->pages[] = $avg;
			$this->lanbilling->pages[] = $avg - 1;
			$this->lanbilling->pages[] = $avg + 1;
		}
		if ($this->lanbilling->totalPages > 2) {
			$this->lanbilling->pages[] = $this->lanbilling->totalPages;
		}
		if ($this->lanbilling->totalPages > 3) {
			$this->lanbilling->pages[] = $this->lanbilling->totalPages - 1;
		}
		if ($this->lanbilling->totalPages > 4) {
			$this->lanbilling->pages[] = $this->lanbilling->totalPages - 2;
		}
		$this->lanbilling->pages = array_unique($this->lanbilling->pages);
		if (count($this->lanbilling->pages) == 1) {
			$this->lanbilling->pages = array();
		}
		sort($this->lanbilling->pages);
	}
}
