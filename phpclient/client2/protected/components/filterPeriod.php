<?php class filterPeriod extends CWidget {
	public $names;
	public $model;
    public $defaults = array();
	function init() {
		//$this->addScript();
		$this->getValue();
	}
	public function addScript() {
        Yii::app()->clientScript->registerScript('daterangescript',"
            var dates = $('#dtfrom, #dtto').datepicker({
                defaultDate: 'null',
                showAnim: 'fold',
                changeMonth: true,
                changeYear: false,
                showOtherMonths: true,
                hideIfNoPrevNext: true,
                dateFormat: 'yy-mm-dd',
                showButtonPanel: 'true',
                onSelect: function( selectedDate ) {
                    var option = this.id == 'dtfrom' ? 'minDate' : 'maxDate',
                        instance = $( this ).data( 'datepicker' );
                        date = $.datepicker.parseDate(
                            instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings
                        );
                    dates.not( this ).datepicker( 'option', option, date );
                }
            });
            $('#dtfrom').datepicker('option', 'maxDate', '".$this->model->dtto."');
            $('#dtto').datepicker('option', 'minDate', '".$this->model->dtfrom."');
            ",
            CClientScript::POS_READY
        );
    }
    public function datePicker($attribute) {
    	return datepicker::get(array(
    		'model' => $this->model,
    		'attribute' => $attribute
    	));
    }
	public function defaultDate() {
		$dtto = $this->names['dtto'];
		$dtfrom = $this->names['dtfrom'];
        if ($this->defaults['dtto']) {
            $this->model->$dtto = $this->defaults['dtto'];
        } else {
            $this->model->$dtto = date('Y-m-d',strtotime('+1 day'));
        }
        if ($this->defaults['dtfrom']) {
            $this->model->$dtfrom = $this->defaults['dtfrom'];
        } else {
            if (Yii::app()->params['statDatePeriod'] && in_array(Yii::app()->params['statDatePeriod'],array('d','w','m',))){
                switch (Yii::app()->params['statDatePeriod']){
                    case 'd':
                    $this->model->$dtfrom = date('Y-m-d');
                    break;
                    case 'w':
                    $this->model->$dtfrom = date('Y-m-d',strtotime('-1 week'));
                    break;
                    case 'm':
                    $this->model->$dtfrom = date('Y-m-d',strtotime('last month'));
                    break;
                }
            } else $this->model->$dtfrom = date('Y-m-d',strtotime('-1 day'));
        }
	}
	public function getValue() {
		$dtfrom = yii::app()->SessionStore->get($this->names['dtfrom'], 'stat_');
        $dtto = yii::app()->SessionStore->get($this->names['dtto'], 'stat_');
		if ($dtfrom AND $dtto) {
			$this->model->dtfrom = $dtfrom;
			$this->model->dtto = $dtto;
		} else $this->defaultDate();
	}
	public function run() {
        $this->render('period',array(
        	'dtfrom' => $this->datePicker($this->names['dtfrom']),
        	'dtto' => $this->datePicker($this->names['dtto'])
		));
    }
} ?>
