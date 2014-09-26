<?php
class PaycardsController extends Controller{

    public function actionList() {
        $filter = $this->getPayCardsFilter();
        $paycards = new OSSList( array("useSort" => false) );
        $paycards->get("getPayCards", $filter);
    }

    public function actionGenerate() {

        $this->success( yii::app()->japi->callAndSend('genPayCards', array(
            "act_til"    => $this->param( "act_til" ),
            "amount"    => (int)$this->param( "amount" ),
            "set_id"    => (int) $this->param( "set_id" ),
            'summ'      => (double) $this->param( "summ" ),
            "use_alpha" => (boolean)$this->param( "use_alpha" ),
            'valency'    => (int)$this->param( "valency" )
        )));
    }

    public function actionExport() {
        try {

            $filter = array();
            if ((boolean)$this->param('applyfilter') == true) { 
                $filter = $this->getPayCardsFilter();
                $filter['pg_num'] = (integer)$this->param('start');
                $filter['pg_size'] = (integer)$this->param('limit');
            }
            
            $paycards = yii::app()->japi->callAndSend('getPayCards', $filter);

            $forCsvArray = array();
            foreach ($paycards as $paycard) {
                
                $line = array(
                    $paycard['ser_no'],
                    $paycard['card_key'],
                    $paycard['sum'],
                    $paycard['symbol'],
                    $paycard['create_date'],
                    $paycard['act_til']
                );
                $forCsvArray[] = $line;
            }  

            $csv = new CSV;
            if ($csvresult = $csv->arrayToCSV( $forCsvArray )) {
                $csv->sendCSVHeaders("cards.csv");
                echo $csvresult;
            } else {
                $this->downloadError( yii::t("messages", "unknown error") );
            }
        
        } catch ( Exception $e ) {
            $this->downloadError( yii::t("messages", $e->getMessage()) );
        }
    }

    private function downloadError( $error ) {
        $this->renderPartial("application.views.error.download", array( "error" => $error ));
        die();
    }

    private function getPayCardsFilter() {
        $filter = array(
            'is_activated' => (integer)$this->param('is_activated') > 0 ? true : false
        );

        if ($this->param('create_date')) {
            $filter['create_date'] = $this->param('create_date');
        }

        if ($this->param('activate_date')) {
            $filter['activate_date'] = $this->param('activate_date');
        }

        if ($this->param('set_id')) {
            $filter['set_id'] = (integer)$this->param('set_id');
        }

        if ($this->param('fullsearch') && $this->param('fullsearch') != '') {
            $filter['full_search'] = $this->param('fullsearch');
        }
        return $filter;
    }

} ?>
