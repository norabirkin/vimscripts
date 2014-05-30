<?php class SiteController extends CController {
	public function actionIndex() {
		try {
			$rentsoft = yii::app()->rentsoft;
			$rentsoft->loadConfig();
			if (!$rentsoft->CheckAccess()) throw new Exception('Access denied');
			$rentsoft->SetAuthorizationPostData();
			$rentsoft->LoadLanbillingAdminMainClass();
			$rentsoft->RequireRentsoftMainClass();
			$output = $rentsoft->RunMethod( htmlentities($_GET['method']) );
			$response = $rentsoft->writeResponse($output);
			$rentsoft->Logout();
			echo $response;
		} catch (Exception $e) {
			yii::log( $e->getMessage(),'error','rentsoft.Error' );
			// The following line is important, because in practice there
			// are LOTS of situations when provider do not know causes of
			// errors and even cannot see his logs (e.g. because of his low
			// qualification), and RentSoft should immediately advise him a
			// possible solution to stop loosing money.
			echo $e->__toString();
		}
	}
} ?>
