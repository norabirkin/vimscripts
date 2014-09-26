<?php
/**
 *  This is error handler configured as global
 * 
 */

class ErrorController extends Controller
{
    public function actionError() {
        if ($error = Yii::app()->errorHandler->error) {
            if (YII_DEBUG) {
                $this->sendResponse($error['code'], array(
                    'success' => false,
                    'error' => $error
                ));
            } else {
                if (Yii::app()->user->isGuest) {
                    $this->sendResponse(401, array(
                        'success' => false,
                        'error' => array(
                            'message' => $error['message']
                        )
                    ));
                } else {
                    $this->sendResponse($error['code'], array(
                        'success' => false,
                        'error' =>  array(
                            'message' => $error['message']
                        ))
                    );
                }
            }
        } else {
            Yii::app()->end();
        }
    }
}
   
