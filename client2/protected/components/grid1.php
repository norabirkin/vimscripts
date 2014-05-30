<?php class grid1 extends CApplicationComponent {
	
	private $charsets = array(
		'UTF-8' => 'UTF-8',
		'CP1251' => 'windows-1251',
		'KOI8-R' => 'KOI8-R'
	);
    
    public function get_grid($data,$messages,$use_pagination = false,$id = '', $download = 0, $footer = array()) {
        if ($download) return $this->csv($data,$messages);
        if (!$id) $id = uniqid();
        $options = array(
            'id' => $id,
            'keyField' => 'id',
            'pagination' => false,
        );
        if ($use_pagination) $options['pagination'] = array(
            'pageSize'=>Yii::app()->params['PageLimit'],
            'itemCount' => count($data)
        );
        $dp = new CArrayDataProvider($data, $options);
        $columns= array();
        foreach ($messages as $k => $v) {
            if ($k != 'id') {
                $columns[] = array(
                    'name' => $v,
                    'value' => $k
                );
            }
        }
        return $this->getGrid($dp, $columns, $use_pagination, $footer);
    }
    
    public function csv_row($row) {
        $outstream = fopen("php://temp", 'r+');
        fputcsv($outstream, $row, ';', '"');
        rewind($outstream);
        $csv = fgets($outstream);
        fclose($outstream);
        echo $csv;
    }
	
	private function getCharset() {
		$charset = $this->charsets[yii::app()->controller->lanbilling->getOption('export_character')];
		if (!$charset) return 'UTF-8';
		else return $charset;
	}
	
	private function convertToOtherCharsetIfNecessary($string) {
		if ($this->getCharset() != 'UTF-8') return iconv('UTF-8', $this->getCharset(), $string);
		else return $string;
	}
   	public function onCsvExport( $event ){
		$this->raiseEvent('onCsvExport', $event);
	} 
    public function csv($data,$messages) {
        header('Content-Disposition: attachment; filename="history.csv"');
        header('Content-Type: application/csv; charset=' . $this->getCharset());
        header('Content-Encoding: ' . $this->getCharset());
        $row = array();
        foreach ($messages as $k => $title) {
            $row[] = $this->convertToOtherCharsetIfNecessary($title);
        }
        $this->csv_row($row);
	$event = new CEvent;
        $event->params = array( 'data' => $data );	
	$this->onCsvExport( $event );
        foreach ($event->params['data'] as $v) {
            $row = array();
            foreach ($messages as $k => $title) {
                $row[] = $this->convertToOtherCharsetIfNecessary(strip_tags($v[$k]));
            }
            $this->csv_row($row);
        }
    }
    
    public function getGrid($data_provider, $columns, $use_pagination = false, $footer = array()) {
        $colums_options = array();
        $first_col = true;
        foreach ($columns as $c) {
            $o = array(
                'name' => $c['name'],
                'type' => 'raw',
                'value' => '$data["'.$c['value'].'"]'
            );
            if (isset($c['link']))  {
                $link = '';
                foreach ($c['link'][1] as $data_field) {
                    $link .= '"'.$data_field.'" => $data["'.$data_field.'"],';
                }
                $url = yii::app()->controller->createUrl($c['link'][0]);
                $condition = '';
                if (isset($c['link'][2])) $condition = '($data["'.$c['link'][2][0].'"]) ? ';
                $o['value'] = '
                    '.$condition.'CHtml::link(
                        $data["'.$c['value'].'"],
                        "'.$url.'",
                        array(
                            "submit"=>"'.$url.'",
                            "params"=>array('.$link.')
                        )
                    )
                ';
                if ($condition) {
                    $message = '';
                    if (isset($c['link'][2][1])) $message = '." <em class=\"unavailable\">('.$c['link'][2][1].')</em>"';
                    $o['value'] .= ' : CHtml::encode($data["'.$c['value'].'"])'.$message;
                }
            }
            else {
                if (is_array($c['value'])) $o['value'] = $c['value'];
                else $o['value'] = '$data["'.$c['value'].'"]';
            }
            
            if (isset($c['htmlOptions'])) $o['htmlOptions'] = $c['htmlOptions'];
			
			if ($footer[$c['value']]) $o['footer'] = $footer[$c['value']];
			
            if ($first_col) {
                $o['htmlOptions']['class'] = 'first_col';
                $o['headerHtmlOptions']['class'] = 'first_col';
				if ($o['footer']) $o['footerHtmlOptions']['class'] = 'first_col';
            }
            $colums_options[] = $o;
            $first_col = false;
        }
        $options = array(
            'id' => uniqid(),
            'dataProvider' => $data_provider,
            'ajaxUpdate'=>false,
            'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
            'enablePagination' => false,
            'template'=>'{items}',
            'columns' => $colums_options,
        );
        if ($use_pagination) {
            $options['enablePagination'] = true;
            $options['template'] = '{items} {pager} {summary}';
        }
        return '<div class="lb_table_wrp">' . yii::app()->controller->widget('zii.widgets.grid.CGridView', $options, true) . '</div>';
    }
    
} ?>
