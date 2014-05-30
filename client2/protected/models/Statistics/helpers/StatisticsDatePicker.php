<?php class StatisticsDatePicker {
    
    private $date_picker_loaded = false;
    
    public function join_date_picker_script($date) {
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
            $('#dtfrom').datepicker('option', 'maxDate', '".$date['dtto']."');
            $('#dtto').datepicker('option', 'minDate', '".$date['dtfrom']."');
            ",
            CClientScript::POS_READY
        );
        $this->date_picker_loaded = true;
    }
    
    public function get_date_picker($attribute,$model) {
    	//if (!$this->date_picker_loaded) $this->join_date_picker_script($model->date);
    	return datepicker::get(array(
    		'model' => $model,
    		'attribute' => $attribute,
    		'value' => ($model->date[$attribute]) ? $model->date[$attribute] : ''
    	));
    }
    
} ?>
