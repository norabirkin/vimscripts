<?php
class SupportController extends Controller {

    /**
     * Show main support page with tickets list
     */
    public function actionIndex()
    {
        
        if (!yii::app()->params['menu_helpdesk']) $this->redirect (array('account/index'));
        
        $model=new SupportForm;

        $new = Yii::app()->request->getParam("status",false);
        
        $this->pageTitle = yii::app()->name . ' - ' . Yii::t('support', 'Support');

        if ( $new ){
            $this->breadcrumbs = array(
                Yii::t('support', 'Support')        =>  array('support/index'),
                Yii::t('support', 'All messages')   =>  array('support/index'),
                Yii::t('support', 'New messages')
            );
        } else $this->breadcrumbs = array(
            yii::t('support','Support')
        );

        $ticketsList = $model->getTicketsList($new);
        $params =array(
            'ticketsList' => $ticketsList,
        );
        if(!isset($_GET['ajax'])) $this->render('support',$params);
        else  $this->renderPartial('support',$params);
    }

    public function actionDownload($id, $originalname) {
        $knowledges = new Sbss_Tickets;
        $knowledges->download($id, $originalname);
    }

    /**
     * @param integer $id Ticket ID
     */
    public function actionShowTicket()
    {
        if (!yii::app()->params['menu_helpdesk']) $this->redirect (array('account/index'));
        
        if (!(($ticketId = Yii::app()->request->getParam("id",0)) <= 0)){
            $sbss_ticket = new Sbss_Tickets;
            $model=new SupportForm('sbssActions');
            $model->ticketId = $ticketId;
            if($model->validate()){
                if ($ticket = $sbss_ticket->getTicket($ticketId)){
                    /**
                     * Set breadcrumbs with current ticket name
                     */
                    $this->breadcrumbs = array(
                        Yii::t('support', 'Support')=>array('support/index'),
                        $ticket->ticket->name
                    );
                    
                    $this->pageTitle = yii::app()->name . ' - ' . Yii::t('support', 'Support') . ' | ' . $ticket->ticket->name;

                    if(isset($_POST['SupportForm'])) {
                        $model->scenario='sbssReply';
                        $model->attributes=$_POST['SupportForm'];

                        if($model->validate()){
                            $_struct = array(
                                "id"        => $model->ticketId,
                                "responsibleman" => $model->Responsible( $ticket->ticket->classid ),
                                "classid" => $ticket->ticket->classid,
                                "statusid"  => $model->sbss_status,
                                "name" => $ticket->ticket->name,
                                "vgid"      => 0
                            );

                            if( false == $this->lanbilling->save("insupdSbssTicket", $_struct, false, array("getSbssTickets", "getSbssTicket"))) {
                                $model->addError('sbss_text, sbss_status',Yii::t('support','CantSaveTicket'));
                            }else{
                                $Pstruct = array(
                                    "id"        => 0,
                                    "ticketid"  => $model->ticketId,
                                    "text"      => $model->sbss_text,
                                    "spec"      => 0
                                );

                                if( false == $this->lanbilling->save("insupdSbssPost", $Pstruct, true, array("getSbssTickets", "getSbssTicket")) ) {
                                    $model->addError('sbss_text, sbss_titile',Yii::t('support','CantSaveTicket'));
                                }
                                else {
                                    $sbss_ticket->saveFile(array(
                                        'description' => $model->sbss_file_descr,
                                        'ticketid' => $model->ticketId,
                                        'postid' => $this->lanbilling->saveReturns->ret,
                                        'file' => CUploadedFile::getInstance($model, 'sbss_file')
                                    ));
                                    Yii::app()->user->setFlash('success',Yii::t('support','TicketSuccessfullyUpdated'));
                                    $this->redirect(Yii::app()->createUrl("support/index"));
                                }
                            }
                        }
                    }

                    $params =array(
                        'statuses' => $model->statuses,
                        'ticket'   => $ticket,
                        'model' => $model,
                    );

                    if(!isset($_GET['ajax'])) $this->render('showTicket',$params);
                    else  $this->renderPartial('showTicket',$params);
                } else throw new CHttpException(404, Yii::t('support', 'TicketNotFound'));
            }
            else throw new CHttpException(404, Yii::t('support', 'TicketNotFound'));
        } else throw new CHttpException(404, Yii::t('support', 'TicketNotFound'));
    }

    /**
     * На данный момент работает только на вставку данных
     * TODO: Добавить возможность создания ответов на тикеты
     */
    public function actionAdd()
    {
        if (!yii::app()->params['menu_helpdesk']) $this->redirect (array('account/index'));
        /**
         * Set breadcrumbs with current ticket name
         */
         
        $this->pageTitle = yii::app()->name . ' - ' . Yii::t('support', 'TicketCreating');
        
        $this->breadcrumbs = array(
            Yii::t('support', 'Support')=>array('support/index'),
            Yii::t('support', 'TicketCreating')
        );

        $model = new SupportForm('sbssAdd');
        if(isset($_POST['SupportForm'])) {
            $model->attributes=$_POST['SupportForm'];
            if($model->validate()){
                // Define ticket structure
                $_struct = array(
                    "id"        => 0,
                    "responsibleman" => $model->Responsible( $model->sbss_class ),
                    "classid"   => ($model->sbss_class) ? $model->sbss_class : 0,
                    "statusid"  => ($model->sbss_status) ? $model->sbss_status : $model->new_ticket_status,
                    "name"      => $model->sbss_title,
                    "vgid"      => 0
                );
                if( false == $this->lanbilling->save("insupdSbssTicket", $_struct, true, array("getSbssTickets", "getSbssTicket"))) {
                    $model->addError('sbss_text, sbss_titile',Yii::t('support','CantSaveTicket'));
                }else{
                    $Pstruct = array(
                        "id"        => 0,
                        "ticketid"  => $this->lanbilling->saveReturns->ret,
                        "text"      => $model->sbss_text,
                        "spec"      => 0
                    );
                    if( false == $this->lanbilling->save("insupdSbssPost", $Pstruct, true, array("getSbssTickets", "getSbssTicket")) ) {
                        $model->addError('sbss_text, sbss_titile',Yii::t('support','CantSaveTicket'));
                    }
                    else {
                        Yii::app()->user->setFlash('success',Yii::t('support','TicketSuccessfullyAdded'));
                        $this->redirect(Yii::app()->createUrl("support/index"));
                    }
                }
            }
        }
        $params =array(
            'model' => $model,
        );
        if(!isset($_GET['ajax'])) $this->render('add',$params);
        else  $this->renderPartial('support',$params);
    }

    /**
     * Get Vgroup dor the selected user
     * @param   integer, user id
     * @param   object, billing class
     */
    function getVgroups()
    {
        $accVg = array();
        if( false != ($result = $this->lanbilling->get("getClientVgroups", array("id" => (integer)$this->lanbilling->client),true)) )
        {
            if(!empty($result))
            {
                if(!is_array($result)) {
                    $result = array($result);
                }

                return $result;
                //foreach($result as $item) {
                //  $tpl->setCurrentBlock("accList");
                //  $tpl->setVariable("ACCID", $item->vgroup->vgid);
                //  $tpl->setVariable("ACCNAME", $item->vgroup->login);
                //  $tpl->parseCurrentBlock();
                //}
            }
            return $result;
        }else return array();
    } // end getVgroups()





}
