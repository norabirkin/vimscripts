<?php
/**
 * Engine to view and control users
 *
 * Repository information:
 * $Date: 2009-12-23 12:44:13 $
 * $Revision: 1.11.2.57 $
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['deluid'])) {
        deleteUser($lanbilling, $localize);
    }

    if(isset($_POST['delvgid'])) {
        deleteAccount($lanbilling);
    }

    if(isset($_POST['getgroups'])) {
        getGroups($lanbilling, $localize);
    }

    if(isset($_POST['getagreementslist'])) {
        getAgreements($lanbilling);
    }

    if(isset($_POST['getoperlist'])) {
        getOperList($lanbilling);
    }

    if(isset($_POST['getusers'])) {
        if(isset($_POST['listext'])) {
            getUsersExt($lanbilling);
        }
        else {
            getUsers($lanbilling);
        }
    }

    if(isset($_POST['getufrmfds'])) {
        getUserFormFields($lanbilling);
    }

    if(isset($_POST['getafrmfds'])) {
        getAgrmFormFields($lanbilling);
    }

    if(isset($_POST['getagrmbal'])) {
        getAgreementBalance($lanbilling);
    }

    if(isset($_POST['setufrmfds'])) {
        saveUserFormField($lanbilling);
    }

    if(isset($_POST['delufrmfds'])) {
        delUserFormFields($lanbilling);
    }

    if(isset($_POST['setafrmfds'])) {
        saveAgrmFormField($lanbilling);
    }

    if(isset($_POST['delafrmfds'])) {
        delAgrmFormFields($lanbilling);
    }

    if(!isset($_POST['download']) && isset($_POST['getinvoice'])) {
        createInvoice($lanbilling);
    }

    if(isset($_POST['download']) && isset($_POST['getinvoice'])) {
        downloadInvoice($lanbilling, $localize);
    }

    if(isset($_POST['filterperm'])) {
        initFilterPermision($lanbilling);
    }

    if(isset($_POST['getagrmtpls'])) {
        getAgreementsTpls($lanbilling);
    }

    if(isset($_POST['getanumber'])) {
        getAgrmNumberFromTemplate($lanbilling);
    }

    if(isset($_POST['lockcommand'])) {
        sendLockCommand($lanbilling, $localize);
    }

    if(isset($_POST['getopertelstaff'])) {
        getOperTelStaff($lanbilling);
    }

    if(isset($_POST['setopertelstaff'])) {
        setOperTelStaff($lanbilling, $localize);
    }

    if(isset($_POST['delopertelstaff'])) {
        delOperTelStaff($lanbilling);
    }

    if(isset($_POST['getaddressfly'])) {
        getAddresses($lanbilling, $localize);
    }

    if(isset($_POST['getagrm_main_settings'])) {
        getAgrmMainSettings($lanbilling);
    }
	
	if($_POST['closeagrm']) {
		closeAgreement($lanbilling);
	}
	
	if($_POST['getvgroupslist']) {
		getVgroupsList($lanbilling);
	}
	
	if($_POST['getpreactivated']) {
		getPreactivatedAgreements($lanbilling, $localize);
	}
	
	if($_POST['migrateagreement']) {
		migrateAgreement($lanbilling, $localize);
	}
	
}
// There is standard query
else
{
    if(isset($_POST['default_operator'])) {
        $O = $lanbilling->getOperators(null, true);

        if(empty($O)) {
            $O = $lanbilling->getOperators();
            define('UNKNOWN_DEFAULT_OPERATOR', true);

            $_POST['uid'] = (integer)key($O);
        }
        else {
            $_POST['uid'] = $O['uid'];
        }
    }

    $tpl = new HTML_Template_IT(TPLS_PATH);
    define("AUTHPERSON_ID", $lanbilling->manager);

    if(isset($_POST['save'])) {
        $saveStatus = saveUserData($lanbilling, $localize);

        if($saveStatus['success']){
            define("SAVESTAT", true);
        }else{
            define("SAVESTAT", false);
        }
    }

    if(isset($_POST['uid']) || (integer)$_POST['userbytpl'] > 0)
    {
        showUserForm($lanbilling, $localize, $tpl);
    }
    else showUsersList($lanbilling, $tpl);

    $localize->compile($tpl->get(), true);
}


/**
 * Returns operator list
 * @param   object, billing class
 */
function getOperList( &$lanbilling ){
    try {
        if( false != ($result = $lanbilling->getOperators()) )
        {
            if(!is_array($result)) {
                $result = array($result);
            }
			
			$_tmp = array();
			foreach ($result as $item){
				$_tmp[] = array (
					"id" => $item["uid"],
                    "descr" => html_entity_decode($item["name"])
				); 
			}
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "results" => (array)$_tmp
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getOperList()


function closeAgreement( &$lanbilling)
{
	try {
    	$date = $_POST['agrmrdate'];
		$agrmid = $_POST['agrmid'];
		if($date && $agrmid)
		{
			if( false === ($result = $lanbilling->get("closeAgreement", array("agrmid"=>$agrmid, "closedate"=> $date))) )
	        {
	            throw new Exception ($lanbilling->soapLastError()->detail);
	        }
		}
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end closeAgreement()


/**
 * Show users list
 * @param    object, billing class
 * @param    object, template class
 */
function showUsersList( &$lanbilling, &$tpl )
{
    $tpl->loadTemplatefile("userslist.tpl", true, true);
    $tpl->touchBlock("__global__");
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
} // end showUsersList()


/**
 * Show User form to edit or create new
 * @param    object, billing class
 * @param    object, localize class
 * @param    object, template class
 */
function showUserForm( &$lanbilling, &$localize, &$tpl )
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("user.tpl",true, true);
    $tpl->setVariable("IFUSECERBER", ((integer)$lanbilling->getLicenseFlag('usecerber') > 0 && (integer)$lanbilling->Option('use_cerbercrypt') > 0) ? 1 : 0);
    
    $phoneFormat = $lanbilling->get("getOptionByName", array("name" => "user_mobile_format"));
	if($phoneFormat != false) {
	    $phoneFormat->value = htmlspecialchars($lanbilling->stripMagicQuotes($phoneFormat->value), ENT_QUOTES, 'UTF-8');
		$phoneFormat->value = str_replace("{","&#123;", $phoneFormat->value);
		$phoneFormat->value = str_replace("}","&#125;", $phoneFormat->value);
		$tpl->setVariable("PFORMAT", $phoneFormat->value);
	}
	
    if(defined("SAVESTAT")) {
        $tpl->touchBlock("SaveStat");
        if(SAVESTAT) {
            $tpl->touchBlock("SaveStatOk");
            // Try to call reread
            unset($_POST['descr']);
            unset($_POST['agrms']);
            unset($_POST['new_agrms']);
            unset($_POST['user_assigned2group_1']);
        }
        else {

            global $saveStatus;
            $tpl->touchBlock("SaveStatFalse");
            if (!empty($saveStatus['detail'])){
                if (preg_match('~.*&#039;(.*)&#039;.*&#039;(.*)&#039;~',$saveStatus['detail'],$mtch)/* && strpos('Duplicate entry',$saveStatus['detail'])*/){
                    if(strstr($saveStatus['detail'], 'login')) {
                    	$err = $localize->get('That login is already used');
                    }
                    else {
                    	$err = $localize->get('Agreement already exist');
                    }
                }
                if (preg_match('/LICENSE_limit:([0-9]{1,}) ADDING_user:([0-9]{1,})/i',$saveStatus['detail'],$mtch)){
                    $err = $localize->get('Too much users');
					//$err = 'Ограничение на число пользователей: '.$mtch[1].'</br>  Попытка зарегистрировать: '.$mtch[2];
                }
				// Password length is lesser than number in common settings
                if (preg_match('/Password is too short ([0-9]{1,})/i', $saveStatus['detail'],$mtch)){
                    $err = $localize->get("Minimal password length is") . " " . $mtch[1] .' '. $localize->get("symbols"). "<br>" . $localize->get("Data not saved");
                }
				
                $tpl->setVariable("SAVESTATERR", '<br/>'.$err);
            }
        }
    }

    if($lanbilling->isConstant('UNKNOWN_DEFAULT_OPERATOR') == true) {
        $tpl->touchBlock('UnknownDefOperator');
    }

    // Convert QUOTES to html cpecial chars
    foreach($_POST as $key => $value)
    {
        if(!is_array($value)) {
            $_POST[$key] = htmlspecialchars($lanbilling->stripMagicQuotes($value), ENT_QUOTES, 'utf-8');
        }
    }

    if((integer)$_POST['uid'] == 0) {
        define("NEW_USER", true);
    }
    else define("NEW_USER", false);

    // Try to restore data from server by present field in post
    if(!isset($_POST['descr'])) {
        if((integer)$_POST['userbytpl'] > 0) {
            $_POST['uid'] = $_POST['userbytpl'];
        }
        // Before Clear previous user password from session variable
        unset($_SESSION['auth']['userPass']);
        restoreUserData($lanbilling, true);
        if((integer)$_POST['userbytpl'] > 0) {
            unset($_POST['userbytpl']);
            $_POST['uid'] = 0;
            $_POST['templ'] = 0;
        }
    }
    if($lanbilling->manager != 0 && $lanbilling->Option('uuid_disable_account_fields') == 1 && $_POST['uuid'] != ""){ 
    	define("DISABLE_ACCOUNT_FIELDS", true);
    	$tpl->setVariable("DISABLE_ACCOUNT_FIELDS", 1);
    }
    else {
    	define("DISABLE_ACCOUNT_FIELDS", false);
    	$tpl->setVariable("DISABLE_ACCOUNT_FIELDS", 0);
    }
    
	if(isset($_POST['migrateAgrm']) && (int)$_POST['migrateAgrm'] > 0) {
		unset($_POST['migrateAgrm']);
		restoreUserData($lanbilling, true);
	}

    define("USER_CATEGORY", (integer)$_POST['category']);
    define("IS_TEMPLATE", (integer)$_POST['templ']);
	
    if(IS_TEMPLATE != 0) {
        $tpl->touchBlock("isTpl");
    } else {
    	$tpl->touchBlock("isNotTpl");
    }

    // Permisions to create account for the selected user
    if($lanbilling->getAccess('accounts') > 1 && IS_TEMPLATE != 1) {
        $tpl->touchBlock("createVgroup");
        if((integer)$lanbilling->getAccess('openpass') < 1) {
            $tpl->touchBlock("createVgClearPass");
        }
    }

    if (!IS_TEMPLATE && !NEW_USER) {
        $tpl->touchBlock("returnEventsLog");
    }

    if(isset($_SESSION['auth']['application'])) {
        $tpl->touchBlock("returnApplications");
    }
    else {
        // Hide or show button to return to the user list
        if(IS_TEMPLATE < 2) {
            $tpl->touchBlock("returnUsersList");
        }

        // Permissions to view accounts list
        if($lanbilling->getAccess('accounts') > 0 && IS_TEMPLATE < 2) {
            $tpl->touchBlock("returnVgroupsList");
        }

    }

    // If there is call for existing user item than need to parse cpecial fields
    if(!NEW_USER)
    {
        $tpl->touchBlock("editUHead");
        $tpl->touchBlock("EditUser");
        $tpl->setvariable("OPENUID", $_POST['uid']);

        // Main user form fields
        if($lanbilling->Option('change_usertype') == 1)
        {
            if($_POST['type'] == 1) $tpl->touchBlock("uTypeDsbl_2");
            else $tpl->touchBlock("uTypeDsbl_1");
        }

        if(IS_TEMPLATE != 1) {
            // Accounts for the selected user
            $accVg = getVgroups($lanbilling);

            if(IS_TEMPLATE < 1) {
                // CRM / Helpdesk information for the existing user except template
                crmHdData($lanbilling, $tpl);

                // Advanced payments
                AdvancedPayments($lanbilling, $tpl, $accVg);

                // Templates (Comment due engine complete)
                buildDocOnTemplate($lanbilling, $tpl, $accVg);

                // Cards activation control
                controlActivation($lanbilling, $tpl);
                
                // Show Services packages
                if($_POST['category'] == 0) {
                    $tpl->touchBlock('returnPackages');
                }
            }

            // If permissions allow to edit
            if($lanbilling->getAccess('users') > 1) {
                $tpl->setCurrentBlock("ifCheckBeforeSave");
                $tpl->setVariable("SAVEMODEVALUE", 0);
                $tpl->parseCurrentBlock();
            }
        }
        else {
            if($lanbilling->getAccess('users') > 1) {
                $tpl->touchBlock('saveData');
            }
        }
    }
    // If there is call for new user
    else
    {
        if(!isset($_POST['type']))
        {
            $_POST['type'] = 2;
            $tpl->touchBlock("passport");
            foreach($tpl->blockvariables['__global__'] as $_key => $_val )
                $tpl->setVariable($_key, "");
        }

        if($lanbilling->autoGeneratePass == 1 && empty($_POST['pass'])) {
            $_POST['pass'] = $lanbilling->randomString();
        }

        if(IS_TEMPLATE != 1) {
            // If permissions allow to edit
            if($lanbilling->getAccess('users') > 1) {
                $tpl->setCurrentBlock("ifCheckBeforeSave");
                $tpl->setVariable("SAVEMODEVALUE", 1);
                $tpl->parseCurrentBlock();
            }
        }
        else {
            if($lanbilling->getAccess('users') > 1) {
                $tpl->touchBlock('saveData');
            }
        }

        $tpl->touchBlock("newUHead");
        $tpl->touchBlock("newUser");
        $tpl->touchBlock("CreateUser");
    }
	
	// if form is for application (preactivated account)
	
	if(IS_TEMPLATE == 2) {

		if(isset($_SESSION['auth']['application'])) {
			unset($_SESSION['auth']['application']);
		}

		$applicationdata = setApplicationToCache($lanbilling);
		$_SESSION['auth']['application'] = $applicationdata;

		$tpl->setVariable("APPNUMBER", $_POST['application']);
		$tpl->touchBlock("Application");
	}
	 
    // If there is user not template
    if(IS_TEMPLATE != 1) {
        // Show agreements list for the existing user
        Agreements($lanbilling, $tpl, $localize);
        // Show user access attributes
        userAccessData($lanbilling, $tpl);
        // Show button to compare new user with existing
        $tpl->touchBlock("ifContactGrp");
    }
    else $tpl->touchBlock("elseContactGrp");

    // Show user category
    userCategory($lanbilling, $tpl);

    // Show Addon fields
    buildAddonFields($lanbilling, $tpl);

    // Fields only for the Legal person type controls
    if($_POST['type'] == 1)
    {
        $tpl->touchBlock("legalName");

        $tpl->setVariable( "THISUSERNAMEL"          , $_POST['name']              );
        $tpl->setVariable( "THISABONENTSURNAMEL"    , $_POST['abonentsurname']    );
        $tpl->setVariable( "THISABONENTNAMEL"       , $_POST['abonentname']       );
        $tpl->setVariable( "THISABONENTPATRONYMICL" , $_POST['abonentpatronymic'] );

        $tpl->setCurrentBlock("leaders");
        $tpl->setVariable("THISDIRECTOR", $_POST['gendiru']);
        $tpl->setVariable("THISCHIEFACC", $_POST['glbuhgu']);
        $tpl->setVariable("THISKONTACT", $_POST['kontperson']);
        $tpl->setVariable("THISACTONWHAT", $_POST['actonwhat']);
        $tpl->parseCurrentBlock();

        if(!isset($_POST['gendiru'])) $tpl->touchBlock("leaders");

        $tpl->setCurrentBlock("bank");
        $tpl->setVariable("THISBANKNAME", $_POST['bankname']);
        $tpl->setVariable("THISBANKBRANCH", $_POST['branchbankname']);
        $tpl->setVariable("THISBIK", $_POST['bik']);
        $tpl->setVariable("THISSETTLACC", $_POST['settl']);
        $tpl->setVariable("THISCORRACC", $_POST['corr']);
        $tpl->setVariable("THISINN", $_POST['inn']);
        $tpl->setVariable("THISOGRN", $_POST['ogrn']);
        $tpl->setVariable("THISKPP", $_POST['kpp']);
        $tpl->setVariable("THISOKPO", $_POST['okpo']);
        $tpl->setVariable("THISOKVED", $_POST['okved']);
        $tpl->setVariable("THISTREASURYNAME", $_POST['treasuryname']);
        $tpl->setVariable("THISTREASURYACC", $_POST['treasuryaccount']);
        if(DISABLE_ACCOUNT_FIELDS) {
        	$tpl->touchBlock("ab_inn_dis");
        	$tpl->touchBlock("ab_kpp_dis");
        }
        $tpl->parseCurrentBlock();
        
        if(DISABLE_ACCOUNT_FIELDS) {
        	$tpl->touchBlock("ab_namel_dis");
        	$tpl->setCurrentBlock("DisableAccountFieldsForLegal");
        	$tpl->setVariable("D_USERNAMEL", $_POST['name']);
        	$tpl->setVariable("D_INN", $_POST['inn']);
        	$tpl->setVariable("D_KPP", $_POST['kpp']);
        	$tpl->parseCurrentBlock();
        }
        
    }
    // Fields only for the Physical person type controls
    else
    {
        $tpl->touchBlock("physName");

        if (!empty($_POST['name']) && empty($_POST['abonentsurname']) && empty($_POST['abonentname']) && empty($_POST['abonentpatronymic'])){
            $tpl->setVariable( "COMMONUSERNAME" , $_POST['name'] );
        }

        $tpl->setVariable( "THISUSERNAME"          , $_POST['name']              );
        $tpl->setVariable( "THISABONENTSURNAME"    , ((!empty($_POST['name']) && empty($_POST['abonentsurname']) && empty($_POST['abonentname']) && empty($_POST['abonentpatronymic'])) ? $_POST['name'] : $_POST['abonentsurname'] ) );
        $tpl->setVariable( "THISABONENTNAME"       , $_POST['abonentname']       );
        $tpl->setVariable( "THISABONENTPATRONYMIC" , $_POST['abonentpatronymic'] );
        if(DISABLE_ACCOUNT_FIELDS) {
        	$tpl->touchBlock("ab_surname_dis");
        	$tpl->touchBlock("ab_name_dis");
        	$tpl->touchBlock("ab_patrname_dis");
        }
        
        $tpl->setCurrentBlock("passport");
        $tpl->setVariable("THISPASSPORTSER", $_POST['passsernum']);
        $tpl->setVariable("THISPASSPORTNUM", $_POST['passno']);
        $tpl->setVariable("THISPASSPORTDATE", $_POST['passissuedate']);
        $tpl->setVariable("THISPASSPORTDEP", $_POST['passissuedep']);
        $tpl->setVariable("THISPASSPORTPLACE", $_POST['passissueplace']);
        $tpl->setVariable("THISBIRTHDAY", $_POST['birthdate']);
        $tpl->setVariable("THISBIRTHPLACE", $_POST['birthplace']);
        $tpl->setVariable("THISINN", $_POST['inn']);
        if(DISABLE_ACCOUNT_FIELDS) {
        	$tpl->touchBlock("ab_pass_ser_dis");
        	$tpl->touchBlock("ab_pass_num_dis");
        	$tpl->touchBlock("ab_pass_dep_dis");
        }
        $tpl->parseCurrentBlock();
        
        $tpl->touchBlock("PhysAddrFiled");
        
        if(DISABLE_ACCOUNT_FIELDS) {
        	$tpl->setCurrentBlock("DisableAccountFieldsForPhysical");
        	$tpl->setVariable( "D_ABONENTSURNAME"    , ((!empty($_POST['name']) && empty($_POST['abonentsurname']) && empty($_POST['abonentname']) && empty($_POST['abonentpatronymic'])) ? $_POST['name'] : $_POST['abonentsurname'] ) );
        	$tpl->setVariable( "D_ABONENTNAME"       , $_POST['abonentname']       );
        	$tpl->setVariable( "D_ABONENTPATRONYMIC" , $_POST['abonentpatronymic'] );
        	$tpl->setVariable("D_PASSPORTSER", $_POST['passsernum']);
        	$tpl->setVariable("D_PASSPORTNUM", $_POST['passno']);
        	$tpl->setVariable("D_PASSPORTDEP", $_POST['passissuedep']);
        	$tpl->parseCurrentBlock();
        }
    }

    $tpl->touchBlock("uType_log_" . $_POST['type']);
    $tpl->touchBlock("uType_" . $_POST['type']);
    $tpl->touchBlock("wayDelacc_" . $_POST['billdelivery']);
    if(IS_TEMPLATE > 0) {
        $tpl->setCurrentBlock("isTemplate");
        $tpl->setVariable("TEMPLATEVALUE", IS_TEMPLATE);
        $tpl->parseCurrentBlock();
    }

    // Address list
    $tpl->setVariable("ADDRESS_IDX_0", $_POST['address_idx'][0]);
    $tpl->setVariable("ADDRESS_IDX_1", $_POST['address_idx'][1]);
    $tpl->setVariable("ADDRESS_IDX_2", $_POST['address_idx'][2]);
    $tpl->setVariable("ADDRESS_STR_0", htmlspecialchars($_POST['address_str'][0]));
    $tpl->setVariable("ADDRESS_STR_1", htmlspecialchars($_POST['address_str'][1]));
    $tpl->setVariable("ADDRESS_STR_2", htmlspecialchars($_POST['address_str'][2]));

    // Common template variables

    $tpl->setvariable( "USERID"                , $_POST['uid']               );
    $tpl->setVariable( "PASSLENGTH"            , $lanbilling->passwordLength );
    $tpl->setVariable( "THISUSERPHONE"         , $_POST['phone']             );
    $tpl->setVariable( "THISUSERFAX"           , $_POST['fax']               );
    $tpl->setVariable( "THISUSERMAIL"          , $_POST['email']             );
    $tpl->setVariable( "THISUSERMOBILE"        , $_POST['mobile']            );
    $tpl->setVariable( "THISUSERCHECKMOBILE"   , $lanbilling->check_mobile   );
    $tpl->setVariable( "THISUSERDESCR"         , $_POST['descr']             );

    // Load user's groups and system groups
    $freeGroups = getGroups($lanbilling, $localize, false);

    if(isset($_POST['addGroup']))
        $_POST['user_assigned2group_1'][] = $_POST['addGroup'];

    if(isset($_POST['removeGroup']) && sizeof($_POST['groups2Remove']) > 0)
        $_POST['user_assigned2group_1'] = array_diff($_POST['user_assigned2group_1'], $_POST['groups2Remove']);

    // User's groups
    if(is_array($_POST['user_assigned2group_1']) && sizeof($_POST['user_assigned2group_1']) > 0)
    {
        foreach($_POST['user_assigned2group_1'] as $value)
        {
            $tpl->setCurrentBlock("assignedUG");
            $tpl->setvariable("UG_ID", $value);
            $tpl->parseCurrentBlock();

            if($value <= 0) $tpl->touchBlock("prefixNameUG");

            $tpl->setCurrentBlock("optUG");
            $tpl->setvariable("OPTUG_ID", $value);
            $tpl->setvariable("OPTUG_NAME",$freeGroups[$value]['name']);
            $tpl->parseCurrentBlock();
        }
    }

    // Show free groups
    foreach($freeGroups as $key => $name)
    {
        if(sizeof($_POST['user_assigned2group_1']) > 0 && in_array($key, $_POST['user_assigned2group_1'])) {
            continue;
        }

        $tpl->setCurrentBlock("groupsFree");
        if($key <= 0) $tpl->touchBlock("prefixNameUGFree");
        $tpl->setVariable("FREEGROUPID", $key);
        $tpl->setVariable("FREEGROUPNAME", $name['name']);
        $tpl->parseCurrentBlock();
    }
} // end showUserForm()


/**
 * CRM and HelpDesk data for the existsing user in the DB
 * @param    object, billing class
 * @param    object, template class
 */
function crmHdData( &$lanbilling, &$tpl )
{
    // Load classes to wirk with crm-helpdes
    include_once("helpdesk/sbss.class.php");
    include_once("helpdesk/sbssFiles.class.php");
    // Create object
    $sbss = new SBSS($lanbilling);
    $sbssFiles = new SBSSFiles($lanbilling->descriptor);
    $sbssFiles->settings = $sbss->settings;
    $statusStat = $sbss->authorStatusStatistic(1, $_POST["uid"]);
    $tpl->setCurrentBlock("ifEditAndCRM");
    $tpl->setVariable("CRMOPENUID", $_POST["uid"]);
    $tpl->setVariable("CRMFILES_ATTCH", $sbssFiles->initTotalCRMRecords(0, $_POST["uid"]));
    $tpl->setVariable("CRMEMAIL_ATTCH", $sbssFiles->initTotalCRMRecords(1, $_POST["uid"]));

    // Parse array to know about statuses
    foreach($sbss->settings->statusList as $sKey => $arr)
    {
        if($arr["request_def"] == 1) $requestDefC = $statusStat[$sKey];
        elseif($arr["response_def"] == 1) $responseDefC = $statusStat[$sKey];
        else $otherStatusC += $statusStat[$sKey];
    }

    $tpl->setVariable("HDNEWREQ", $requestDefC);
    $tpl->setVariable("HDRAECTION", $responseDefC);
    $tpl->setVariable("HDOTHERS", $otherStatusC);
    $tpl->parseCurrentBlock();
} // end crmHdData()


/**
 * Build and select saved user category
 * @param    object, billing class
 * @param    object, template class
 */
function userCategory( &$lanbilling, &$tpl )
{
    if(IS_TEMPLATE > 0) {
        $A = $lanbilling->getUserCategory(0);
    }
    else if(NEW_USER) {
        $A = $lanbilling->getUserCategory();
    }
    else {
        $A = $lanbilling->getUserCategory((integer)$_POST['category']);

        // Render oper tell staff for the saved item
        if((integer)$_POST['category'] == 1) {
            $tpl->setCurrentBlock('OperTellStaff');
            $tpl->setVariable("USEROPERID", (integer)$_POST['uid']);
            $tpl->parseCurrentBlock();
        }
    }

    foreach($A as $id => $name) {
        $tpl->setCurrentBlock('CategoryOpt');
        $tpl->setVariable("CATEGORY_VAL", $id);
        $tpl->setVariable("CATEGORY_NAME", $name);

        if((integer)$_POST['category'] == $id) {
            $tpl->touchBlock('CategoryOptSel');
        }

        $tpl->parse('CategoryOpt');
    }
} // end userCategory()


/**
 * Show agreement information
 * Manipulate the list
 */
function Agreements( &$lanbilling, &$tpl, &$localize )
{	
    $lanbilling->initCurrency();
    // Get agreements additional fields
    if( false != ($AAddonsSet = $lanbilling->get("getAgreementsAddonsSet", array('flt' => array()))) ){		
        if(!is_array($AAddonsSet)) {
            $AAddonsSet = array($AAddonsSet);
        }
    }
       else {
        $AAddonsSet = array();
    }
	
	$agrmtypelist = array( 
		0 => array("name" => $localize->get("Advance"), "id" => 0),
		1 => array("name" => $localize->get("Credit acc"), "id" => 1),
		2 => array("name" => $localize->get("Mixed"), "id" => 2)
	);
	

    // Requests that sent to remove agreement from the list
    // List from DB
    if(isset($_POST['delAgrm']) && $_POST['agrmToRemove'] >= 0 && sizeof($_POST['agrms']) > 1)
    {
        if(isset($_POST['agrms'][$_POST['agrmToRemove']]))
            unset($_POST['agrms'][$_POST['agrmToRemove']]);

        if(!isset($_POST['agrmListDel']))
            $_POST['agrmListDel'] = $_POST['agrmToRemove'];
        else {
            $_POST['agrmListDel'] = explode(',', $_POST['agrmListDel']);
            $_POST['agrmListDel'][] = $_POST['agrmToRemove'];
            $_POST['agrmListDel'] = implode(',', array_unique($_POST['agrmListDel']));
        }
    }

    // Store removed items from the agreements list to control them
    if(isset($_POST['agrmListDel']))
    {
        $tpl->setCurrentBlock("agrmListDel");
        $tpl->setVariable("AGRMLISTDEL", $_POST['agrmListDel']);
        $tpl->parseCurrentBlock();
    }

    // List not yet saved to DB
    if(isset($_POST['delNewAgrm']) && $_POST['agrmToRemove'] >= 0)
    {
        if(isset($_POST['new_agrms'][$_POST['agrmToRemove']]))
            unset($_POST['new_agrms'][$_POST['agrmToRemove']]);
    }

    // Print existing agreements list that already saved to DB
    if(is_array($_POST['agrms']))
    {
        foreach($_POST['agrms'] as $key => $arr)
		{
            $tpl->setCurrentBlock("existAgrm");
            $tpl->setVariable("AGRM_STRING", $arr['num']);
            $tpl->setVariable("AGRM_OPERID", $arr['oper']);
            $tpl->setVariable("AGRM_DATE", $arr['date']);
            $tpl->setVariable("AGRM_PENI", $arr['penaltymethod']);
            $tpl->setVariable("AGRM_VGROUPS", $arr['vgroups']);
            $tpl->setVariable("AGRMCURID", $arr['curid']);
            $tpl->setVariable("AGRMID", $key);
            $tpl->setVariable('AGRMPROMISED', (integer)$arr['agrmpromised']);
            $tpl->setVariable("AGRM_FRIEND_AGRMID", (integer)$arr['friendagrmid']);
			$tpl->setVariable("AGRM_FRIEND_NUMBER", (string)$arr['friendnumber']);
            $tpl->setVariable("AGRM_PARENT_NUMBER", (string)$arr['parentnumber']);
            $tpl->setVariable("AGRM_PARENT_AGRMID", (integer)$arr['parentagrmid']);
            $tpl->setVariable("PRIORITY", (integer)$arr['priority']);
			$tpl->setVariable("CLOSEDON", $arr['closedon']);
			$tpl->setVariable("INSTALLMENTS", $arr['installments']);
			$tpl->setVariable("AGRM_OWNERID", $arr['ownerid']);
			
			$tpl->setVariable("AG_ORDERPAYDAY", $arr['orderpayday']);
			$tpl->setVariable("AG_BLOCKORDERS", $arr['blockorders']);
			
			$tpl->setVariable("AG_ABLOCKTYPE", $arr['ablocktype']);
			$tpl->setVariable("AG_ABLOCKVALUE", $arr['ablockvalue']);
			
            $tpl->setVariable("AG_BAL", $arr['balance']);
            $tpl->parseCurrentBlock();
            
            if(DISABLE_ACCOUNT_FIELDS && $arr['code'] != "") {
            	$tpl->setCurrentBlock("existAgrmDisCode");
            	$tpl->setVariable("AGRMID", $key);
            	$tpl->setVariable("D_CODE", $arr['code']);
            	$tpl->parseCurrentBlock();
            }

            $tpl->setVariable("AGRM_OSTRING", $lanbilling->Operators[$arr['oper']]['name']);
			
			$tpl->setCurrentBlock("existTypeSel"); 
            $tpl->setVariable("AGRMID", $key); 
			
            $availableAgrmTypes = $lanbilling->get("getAgrmAvailablePayMethods", array("agrmid" => $key));
			if(!is_array($availableAgrmTypes)) $availableAgrmTypes = array($availableAgrmTypes);

			foreach($availableAgrmTypes as $item) 
            {
				$tpl->setCurrentBlock("existTypeOpt");
				if($item == $arr['paymentmethod']) $tpl->touchBlock("typeOptSel"); 
                $tpl->setVariable("THISTYPE_ID", $item);
                $tpl->setVariable("AG_TSTRING", $agrmtypelist[$item]["name"]);
                $tpl->parseCurrentBlock();
            }
            $tpl->parseCurrentBlock();

            // Paycode
            $tpl->setCurrentBlock("agrmCode");
            $tpl->setVariable("AGRMC_ID", $key);
            $tpl->setVariable("AGRM_CODE", $arr['code']);
            if(DISABLE_ACCOUNT_FIELDS && $arr['code'] != "") {
            	$tpl->touchBlock("code_dis");
            }
            $tpl->parseCurrentBlock();

            // Balance
            $tpl->setVariable("AG_BAL", number_format((float)$arr['balance'], 2, ",", " "));
            if($lanbilling->getAccess('cashonhand') > 0) {
                $tpl->setCurrentBlock('agrmBalModify');
                $tpl->setVariable('BAG_ID', $key);
                $tpl->parseCurrentBlock();
            }

            $tpl->setVariable("AGREEMENT_NUM", !empty($arr['num']) ? $arr['num'] . (!empty($arr['date']) ? " (" . $arr['date'] . ")" : "") : "<%@ Undefined %>");
            $tpl->touchBlock("OperAgrmDispl");
            $tpl->touchBlock("OpAgDsJ");
            $tpl->touchBlock("jsIfAG");
			
			if($arr['closedon'])
			{
				$tpl->touchBlock('GrayCloseAgrm');
				$tpl->touchBlock('GrayCloseAgrmHref');
			
			}

            // Currency
            $tpl->setVariable("AGRMCURSYMBOL", $lanbilling->Currency[$arr['curid']]['name']);

            // Credit
            $tpl->setCurrentBlock("CreditNew");
            $tpl->setVariable("AGRM_ID", $key);
            $tpl->setVariable("AGRM_CRD", round ($arr['credit'], 2));
            $tpl->parseCurrentBlock();

            // Strict Mode
            //$tpl->setCurrentBlock("Strict");
            //$tpl->setVariable("AGRM_ID", $key);
            //$tpl->setVariable("AGRM_STL", $arr['balancestrictlimit']);
            //$tpl->parseCurrentBlock();

             // Strict Mode
            //$tpl->setCurrentBlock("Strict");
            //$tpl->setVariable("AGRM_ID", $key);
            //$tpl->setVariable("AGRM_STL", $arr['balancestrictlimit']);
            //$tpl->parseCurrentBlock();

            // Color Credit of promised exists
            if((integer)$arr['agrmpromised'] == 1) {
                $tpl->touchBlock('PromisedColor');
            }

            if($arr['vgroups'] > 0 && $arr['closedon'] == '') {
                $tpl->touchBlock("delAgrmDis");
            }

            $tpl->touchBlock("delAgrm");
            $tpl->setVariable("AG_ID", $key);
            $tpl->parse("agrmLine");

            // Agreement addons
            if(!empty($AAddonsSet)) {
                foreach($AAddonsSet as $a_item){
                    $tpl->setCurrentBlock('agrmAddons');
                    $tpl->setVariable("AADDON_ID", $key);
                    $tpl->setVariable("AADDON_NAME", $a_item->addon->name);
                    $tpl->setVariable("AADDON_VALUE", isset($_POST['aaddons'][$key][$a_item->addon->name]) ? $_POST['aaddons'][$key][$a_item->addon->name] : "");
                    $tpl->parse('agrmAddons');
                }
            }
        }
    }

    // Add new entry to the agreements list
    if((isset($_POST['addAgrm']) && $_POST['addAgrm']>0) || ($_POST['uid'] == 0 && (!isset($_POST['new_agrms']) || sizeof($_POST['new_agrms']) == 0))) {
        $_POST['new_agrms'][] = array( 'num' => '', 'date' => '', 'oper' => 0, 'code' => '', 'credit' => 0, 'usedef' => 1, 'paymentmethod' => 2);
    } 

    // New added agreements through interface
    if(is_array($_POST['new_agrms']))
    {
        foreach($_POST['new_agrms'] as $key => $arr)
        {
            // Hidden Elements
            $tpl->setCurrentBlock("NewAgrm");
            $tpl->setVariable("NAG_ID", $key);
            $tpl->setVariable("NAG_NUM", $arr['num']);
            $tpl->setVariable("NAG_DATE", $arr['date']);
            $tpl->setVariable("NAG_PENI", $arr['penaltymethod']);
			$tpl->setVariable("NAG_TYPE", $arr['paymentymethod']); 
            $tpl->setVariable("NAG_FRIEND_AGRMID", (integer)$arr['friendagrmid']);
            $tpl->setVariable("NAG_FRIEND_NUMBER", (string)$arr['friendnumber']);
            $tpl->setVariable("NAG_PARENT_AGRMID", (integer)$arr['parentagrmid']);
            $tpl->setVariable("NAG_PARENT_NUMBER", (string)$arr['parentnumber']);
			
			$tpl->setVariable("NAG_ORDERPAYDAY", $arr['orderpayday']);
			$tpl->setVariable("NAG_BLOCKORDERS", $arr['blockorders']);
			
			$tpl->setVariable("NAG_ABLOCKTYPE", $arr['ablocktype']);
			$tpl->setVariable("NAG_ABLOCKVALUE", $arr['ablockvalue']);
			
			$tpl->setVariable("NAG_OWNERID", $arr['ownerid']);
			
            $tpl->parseCurrentBlock();

            // Disable button
            $tpl->touchBlock('ifANew');
            $tpl->touchBlock('ifANewCursor');

            // Operator list to add
            $tpl->setCurrentBlock("operSel");
            $tpl->setVariable("NAG_ID", $key);

            // Add default value before if there is user-operator
            if(USER_CATEGORY == 1) {			
                $tpl->setCurrentBlock("operOpt");
                $tpl->setVariable("THISOP_ID", (integer)$_POST['uid']);
                $tpl->setVariable("NAG_OSTRING", '<%@ Default %>');
                $tpl->parseCurrentBlock();
            }
            
            if($arr['oper'] != 0) { // Set selected operator
	            foreach($lanbilling->Operators as $oKey => $oVal){
	                $tpl->setCurrentBlock("operOpt");
	                if($oKey == $arr['oper']) $tpl->touchBlock("operOptSel");
	                $tpl->setVariable("THISOP_ID", $oKey);
	                $tpl->setVariable("NAG_OSTRING", $oVal['name']);
	                $tpl->parseCurrentBlock();
	            }
            }
            else { // Set default operator
            	foreach($lanbilling->Operators as $oKey => $oVal){
            		$tpl->setCurrentBlock("operOpt");
            		if($oVal['def'] == 1) $tpl->touchBlock("operOptSel");
            		$tpl->setVariable("THISOP_ID", $oKey);
            		$tpl->setVariable("NAG_OSTRING", $oVal['name']);
            		$tpl->parseCurrentBlock();
            	}
            }
			
			$tpl->parseCurrentBlock();
		
			$tpl->setCurrentBlock("typeSel"); 
            $tpl->setVariable("NAG_ID", $key); 
            
			foreach($agrmtypelist as $oKey => $oVal) 
            {
				$tpl->setCurrentBlock("typeOpt");
				if($oKey == $arr['paymentmethod']) $tpl->touchBlock("typeOptSel"); 
                $tpl->setVariable("THISTYPE_ID", $oKey);
                $tpl->setVariable("NAG_TSTRING", $oVal['name']);
                $tpl->parseCurrentBlock();
            }
            $tpl->parseCurrentBlock();

            // Agreement Number
            $tpl->setVariable("AGREEMENT_NUM", !empty($arr['num']) ? $arr['num'] . (!empty($arr['date']) ? " (" . $arr['date'] . ")" : "") : "<%@ Undefined %>");

            // Paycode
            $tpl->setCurrentBlock("agrmCodeNew");
            $tpl->setVariable("NAG_ID", $key);
            $tpl->setVariable("NAG_CODE", $arr['code']);
            $tpl->parseCurrentBlock();

            // Balance
            $tpl->setVariable("AG_BAL", "-");
            $tpl->touchBlock("newAgrmDispl");
            $tpl->touchBlock("newOpAgDsJ");
            $tpl->touchBlock("jsIfAGNew");

            // Currency
            $tpl->setCurrentBlock("CurrencyNew");
            $tpl->setVariable("NAG_ID", $key);
            foreach($lanbilling->Currency as $cKey => $cArr)
            {
                if($cKey == 0) {
                    continue;
                }

                $tpl->setCurrentBlock("CurOptNew");
                $tpl->setVariable("NAG_CURID", $cKey);
                $tpl->setVariable("NAG_CUR", $cArr['name']);

                if(isset($arr['usedef'])) {
                    if($cArr['default'] == 1) {
                        $tpl->touchBlock("CurOptNewSel");
                    }
                }
                else {
                    if($arr['curid'] == $cKey) {
                        $tpl->touchBlock("CurOptNewSel");
                    }
                }

                $tpl->parseCurrentBlock();
            }
            $tpl->parse("CurrencyNew");

            // Credit
            $tpl->setCurrentBlock("Credit");
            $tpl->setVariable("NAG_ID", $key);
            $tpl->setVariable("NAG_CRD", $arr['credit']);
            $tpl->parseCurrentBlock();

            // Strict Mode
            //$tpl->setCurrentBlock("Strict");
            //$tpl->setVariable("AGRM_ID", $key);
            //$tpl->setVariable("AGRM_STL", $arr['balancestrictlimit']);
            //$tpl->parseCurrentBlock();

            // Strict Mode
            //$tpl->setCurrentBlock("StrictNew");
            //$tpl->setVariable("NAG_ID", $key);
            //$tpl->setVariable("NAG_STL", $arr['balancestrictlimit']);
            //$tpl->parseCurrentBlock();

            $tpl->touchBlock("delNewAgrm");
            $tpl->setVariable("AG_ID", $key);
            $tpl->parse("agrmLine");

            // Agreement addons
            if(!empty($AAddonsSet)) {
                foreach($AAddonsSet as $a_item){
                    $tpl->setCurrentBlock('agrmAddons');
                    $tpl->touchBlock('ifAgrmAddonNew');
                    $tpl->setVariable("AADDON_ID", $key);
                    $tpl->setVariable("AADDON_NAME", $a_item->addon->name);
                    $tpl->setVariable("AADDON_VALUE", isset($_POST['new_aaddons'][$key][$a_item->addon->name]) ? $_POST['new_aaddons'][$key][$a_item->addon->name] : "");
                    $tpl->parse('agrmAddons');
                }
            }
        }
    }
} // end Agreements()


/**
 * Show control to set user access data: login, password and other attributes to grant
 * @param    object, billing class
 * @param    object, template class
 */
function userAccessData( &$lanbilling, &$tpl )
{
    // Password show / Hide
    if(!NEW_USER)
    {
        if($lanbilling->getAccess('openpass') >= 1)
        {
            $tpl->touchBlock("showPass");
            $tpl->setvariable("THISPASS", $_POST['pass']);
        }
        else
        {
            if((integer)$_POST['pass_chg'] == 1) {
                $_SESSION['auth']['userPass'] = $_POST['pass'];
            }
            $tpl->touchBlock("hidePass");
            $tpl->setvariable("THISPASS", substr(time(), 0, $lanbilling->Option('pass_length')));
        }
    }
    else
    {
        $tpl->touchBlock("showPass");
        $tpl->setvariable("THISPASS", $_POST['pass']);
    }

    // Ip access
    if($_POST['ipaccess'] == 1) {
        $tpl->touchBlock("ipAccess");
    }

    $tpl->setVariable("THISUSERLOGIN", $_POST['login']);
    $tpl->setVariable("THISUSERLOGINTPL", $lanbilling->specialToHtmlCodes($lanbilling->Option('user_pass_symb')));

    $tpl->setVariable("THISUUID", $_POST['uuid']);
    if(DISABLE_ACCOUNT_FIELDS) {
    	$tpl->touchBlock("uuid_dis");
    }
    $tpl->parse("ifAccessData");
    
    if(DISABLE_ACCOUNT_FIELDS) {
    	$tpl->setCurrentBlock("DisableUuid");
    	$tpl->setVariable("D_UUID", $_POST['uuid']);
    	$tpl->parseCurrentBlock();
    }
} // end userAccessData()


/**
 * Show control for the advanced payments
 * @param    object, billing class
 * @param    object, template class
 * @param    array, vglist for the selected user
 */
function AdvancedPayments( &$lanbilling, &$tpl, &$accVg )
{
    if($lanbilling->getAccess('userspreorders') > 1)
    {
        $accDocs = $lanbilling->getAccountancyDocs(array('hidden' => 0, 'payable' => 2, 'onfly' => 0));
        $tpl->setCurrentBlock("ifEditAndPay");
        foreach($accDocs as $doc)
        {
            $tpl->setCurrentBlock("payOption");

            if($_POST['type'] == 1)
            {
                if($lanbilling->Option('default_legal') == $doc['doc_id'])
                    $tpl->touchBlock("payOptionSel");
            }
            else
            {
                if($lanbilling->Option('default_physical') == $doc['doc_id'])
                    $tpl->touchBlock("payOptionSel");
            }

            $tpl->setVariable("THISDOCID", $doc['doc_id']);
            $tpl->setVariable("THISDOCNAME", $doc['doc_id'] . ". " . $doc['name']);
            $tpl->parseCurrentBlock();
        }

        if(sizeof($_POST['agrms']) > 0)
        {
            foreach($_POST['agrms'] as $key => $arr)
            {
                $tpl->setCurrentBlock("payOptionVG");
                $tpl->setVariable("DOCVGID", $key);
                $tpl->setVariable("DOCVGNAME", ($arr['num'] == '') ? '<%@ Agreement number %> (<%@ Undefined %>)' : $arr['num']);
                $tpl->parseCurrentBlock();
            }
        }
        else $tpl->touchBlock("optPayAgrmEmpty");

        $tpl->parse("ifEditAndPay");
    }
} // end AdvancedPayments()


/**
 * Show control to call and build document template
 * @param    object, billing class
 * @param    object, template class
 * @param    array, vglist for the selected user
 */
function buildDocOnTemplate( &$lanbilling, &$tpl, &$accVg )
{
    $_filter = array("onfly" => 1);
    if( false != ($result = $lanbilling->get("getDocuments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)))) )
    {	
		
        if(!is_array($result)) {
            $result = array($result);
        }
		
        $tpl->setCurrentBlock("ifEditAndDoc");
        $tpl->setVariable("THISTEMPLDATE", date('d-m-Y'));
        $tpl->setVariable("THISTEMPLDATETILL", date('d-m-Y'));
        foreach($result as $item) {
            if($item->hidden == 1) {
                continue;
            }

            $tpl->setCurrentBlock("docOption");
            $tpl->setVariable("THISTEMPLID", $item->docid);
            $tpl->setVariable("THISTEMPLNAME", $item->name);
            $tpl->parseCurrentBlock();
            
            $tpl->setCurrentBlock("docTypes");
            $tpl->setVariable("DOCTYPEID", $item->docid);
            $tpl->setVariable("DOCTYPEVALUE", $item->documentperiod);
            $tpl->parseCurrentBlock();
        }
        if($result[0]->documentperiod != 1) {
        	$tpl->touchBlock("disableDateTill");
        }
        $tpl->touchBlock("docType_" . $result[0]->documentperiod);
    }
    else {
    	$tpl->touchBlock("docOptionEmpty");
    	$tpl->touchBlock("disableDateTill");
    	$tpl->touchBlock("docType_1");
    }

    foreach($_POST['agrms'] as $key => $arr)
    {
        $tpl->setCurrentBlock("docOptionVG");
        $tpl->setVariable("VGID", $key);
        $tpl->setVariable("VGNAME", ($arr['num'] == '') ? '<%@ Agreement number %> (<%@ Undefined %>)' : $arr['num']);
        $tpl->parseCurrentBlock();
    }
    $tpl->parse("ifEditAndDoc");

    $tpl->setCurrentBlock("authPersonToPost");
    $tpl->setVariable("THISAUTHPERSON", $lanbilling->manager);
    $tpl->parseCurrentBlock();
} // end buildDocOnTemplate()


/**
 * Show control to allow / deny activation engine in the clients interface
 * @param    object, billing class
 * @param    object, template class
 */
function controlActivation( &$lanbilling, &$tpl )
{
    $tpl->setCurrentBlock("ifEditAndCard");
    $tpl->setVariable("THISLASTCARDWRONG", $_POST['wrongdate']);
    if($_POST['wrongactive'] >= $lanbilling->Option('wrong_active')) $tpl->touchBlock("cardBlock");
    $tpl->parseCurrentBlock();
} // end controlActivation()


/**
 * Restore user information from the server
 * @param    object, billing class
 * @param    boolean, if need to store result to post array
 */
function restoreUserData( &$lanbilling, $toPost = false )
{
    if(!isset($_POST['uid']) || (integer)$_POST['uid'] == 0) {
        return array();
    }

    if( false != ($result = $lanbilling->get("getAccount", array("id" => (integer)$_POST['uid']))) )
    {
		$_POST['application'] = (int)$result->application;
		
        if(!empty($result->agreements)) {
            if(!is_array($result->agreements)) {
                $result->agreements = array($result->agreements);
            }
        }
        if(!empty($result->addresses)) {
            if(!is_array($result->addresses)) {
                $result->addresses = array($result->addresses);
            }
        }
        if(!empty($result->usergroups)) {
            if(!is_array($result->usergroups)) {
                $result->usergroups = array($result->usergroups);
            }
        }
        if(!empty($result->addons)) {
            if(!is_array($result->addons)) {
                $result->addons = array($result->addons);
            }

            foreach($result->addons as $item)
            {
                if($item->type == 1) {
                    $_POST['addons']['combo'][$item->name] = $item->idx;
                }
                elseif($item->type == 2) {
                    $_POST['addons']['bool'][$item->name] = $item->strvalue;
                }
                else {
                    $_POST['addons']['text'][$item->name] = $item->strvalue;
                }
            }
        }

        if($toPost)
        {
            // Determine promised list for the user
            // Filter:
            // payed: 1 = pay_id < 0, 2 = pay_id > 0, 3 = pay_id = 0, default all
            $promised = array();
            if( false != ($r = $lanbilling->get("getPromisePayments", array('flt' => array('payed' => 3, 'userid' => (integer)$_POST['uid'])))) ) {
                if(!is_array($r)) {
                    $r = array($r);
                }

                array_walk($r, create_function('$item, $key, $_tmp', '$_tmp[0][$item->agrmid][] = (array)$item;'), array( &$promised) );
            }

            $_array = (array)$result->account;
            foreach($_array as $key => $val)
            {
                switch($key)
                {
                    default: $_POST[$key] = htmlspecialchars($val, ENT_QUOTES, 'utf-8');
                }
            }
			
            if(!empty($result->agreements))
            {

                foreach($result->agreements as $obj) {
                	
					$ablocktype = 0;
					$ablockvalue = 0;
					$orderpayday = 0;
                    $blockorders = 0;
						
					if($obj->paymentmethod == 0){
								
							$ablocktype = 0;
							$ablockvalue = $obj->blockdays;
							
							if ($obj->blockmonths !=0){
								$ablocktype = 1;
								$ablockvalue = $obj->blockmonths;
							}
							if ($obj->blockamount != 0){
								$ablocktype = 2;
								$ablockvalue = $obj->blockamount;
							}
					}
					if($obj->paymentmethod ==1){
							$orderpayday = $obj->orderpayday;
                            $blockorders = $obj->blockorders;
							
					}
                	
                    $_POST['agrms'][$obj->agrmid] = array(
                                    'penaltymethod' => $obj->penaltymethod,
                                    'ablocktype' => $ablocktype,
                                    'ablockvalue' => $ablockvalue,
                                    'orderpayday' => $orderpayday,
                                    'blockorders' => $blockorders,
                                    'paymentmethod' => $obj->paymentmethod,
                                    'priority' => $obj->priority,
                                    'closedon' => $obj->closedon,
                    				'installments' => $obj->installments,
                                    'oper' => $obj->operid,
                                    'num' => $obj->number,
                                    'date' => $obj->date,
                                    'balance' => $obj->balance,
                                    'credit' => $obj->credit,
                                    'friendagrmid' => $obj->friendagrmid,
                                    'friendnumber' => $obj->friendnumber,
                                    'parentagrmid' => $obj->parentagrmid,
                                    'parentnumber' => $obj->parentnumber,
                                    'curid' => $obj->curid,
                                    'code' => $obj->code,
                                    'vgroups' => $obj->vgroups,
                                    'remind' => $obj->bnotify,
                                    'remindif' => $obj->blimit,
                                    'agrmpromised' => isset($promised[$obj->agrmid]) ? 1 : 0,
                                    'ownerid' => $obj->ownerid);

                    if(!empty($obj->addons)) {
                        if(!is_array($obj->addons)) {
                            $obj->addons = array($obj->addons);
                        }

                        foreach($obj->addons as $addon){
                            if($addon->type == 1) {
                                $_POST['aaddons'][$obj->agrmid][$addon->name] = $addon->idx;
                            }
                            else {
                                $_POST['aaddons'][$obj->agrmid][$addon->name] = $addon->strvalue;
                            }
                        }
                    }
                }
            }

            if(!empty($result->addresses))
            {
                foreach($result->addresses as $obj) {
                    $_POST['address_idx'][$obj->type] = $obj->code;
                    $_POST['address_str'][$obj->type] = $obj->address;
                }
            }

            if(!empty($result->usergroups))
            {
                foreach($result->usergroups as $obj) {
                    $_POST['user_assigned2group_1'][] = $obj->usergroup->groupid;
                }
            }

            if(!$lanbilling->getAccess('openpass')) {
                $_SESSION['auth']['userPass'] = $result->account->pass;
            }
        }

        if(isset($_SESSION['auth']['application'])) {
            $_SESSION['auth']['application']['uid'] = $_POST['uid'];
            $_SESSION['auth']['application']['username'] = $_POST['name'];
            $_SESSION['auth']['application']['template'] = (integer)$_POST['templ'];
        }

        return $result;
    }
    else {
        return array();
    }
} // end restoreUserData()


/**
 * Get users groups list and send them as JSON object
 * @param    object, billing class
 * @param    object, localize class
 * @param    boolean, return array or send to stdout
 */
function getGroups( &$lanbilling, &$localize, $_echo = true )
{
    $_tmp = array();
    if( false != ($result = $lanbilling->get("getUserGroups", array("flt" => array()))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        if($_echo == false) {
            array_walk($result, create_function('&$obj, $key, $_tmp', '
            $_tmp[0][$obj->usergroup->groupid] = array(
                "id" => $obj->usergroup->groupid,
                "name" => $obj->usergroup->name,
                "descr" => $obj->usergroup->description,
                "ro" => $obj->usergroup->fread,
                "rw" => $obj->usergroup->fwrite
            );'), array( &$_tmp ));
        }
        else {
            $_ifdef = false;
            array_walk($result, create_function('&$obj, $key, $_tmp', '
            $_tmp[0][] = array(
                "id" => $obj->usergroup->groupid,
                "name" => $obj->usergroup->name,
                "descr" => $obj->usergroup->description,
                "ro" => $obj->usergroup->fread,
                "rw" => $obj->usergroup->fwrite
            );
            if($obj->usergroup->groupid == 0) {
                $_tmp[1] = true;
            }
            '), array( &$_tmp, &$_ifdef ));

            if(!$_ifdef) {
                $_tmp[] = array(
                    "id" => 0,
                    "name" => $localize->get('All available') . ' ' . $localize->get('users'),
                    "descr" => $localize->get('All available') . ' ' . $localize->get('users'),
                    "ro" => 1,
                    "rw" => 0
                );
            }
        }
    }

    if($_echo == false) {
        return $_tmp;
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else echo "({ })";
} // end getGroups()


/**
 * MaxS
 * getAgreements list
 * для окна выбора договоров (при корректировке платежей)
 */
function getAgreements( &$lanbilling )
{
    $_tmp = array();
    $_filter = usersFilter($lanbilling);
    $_filter['archive'] = 0; // не удаленный
    $_filter['unavail'] = isset($_POST['unavail']) ? (integer) $_POST['unavail'] : 0; // do not show closed agreements by default

    if (isset($_POST['userid'])){
        $_filter['userid'] = $_POST['userid']; // Фильтр по пользователю
    }
    
    if(isset($_POST['archive'])) {
    	$_filter['archive'] = (integer)$_POST['archive'];
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $lb = $lanbilling->cloneMain(array('query_timeout' => 380));
    $count = $lb->get("Count", array("flt" => $_filter, "procname" => "getAgreements", "md5" => $_md5));

    if( false != ($result = $lb->get("getAgreements", array("flt" => $_filter, "md5" => $_md5))) ) {
	    if(!is_array($result)) { $result = array($result); }
        $_count = count($result);

        if (isset($_POST['not_in_agrm'])) {
            $_POST['not_in_agrm'] = explode(',', $_POST['not_in_agrm']);
        } else {
            $_POST['not_in_agrm'] = array();
        }

        foreach($result as $obj) {
            if($lanbilling->getAccess('operators') < 1 && $obj->account->category == 1) {
                continue;
            }
            
            if(
                in_array($obj->agrmid, $_POST['not_in_agrm']) ||
                (
                    isset($_POST['has_no_parent']) &&
                    $obj->parentagrmid
                )
            ) {
            	$count--;
            	continue;
            }
            
            $_arr = array(
                "uid"      => $obj->uid,
                "agrmid"   => $obj->agrmid,
                "number"   => $obj->number,
                "balance"  => $obj->balance,
            	"username" => $obj->username,
                "paymentmethod" => $obj->paymentmethod,
                "opername" => $obj->opername
            );
			
			$_tmp[] = $_arr;
        }
    }
    if(sizeof($_tmp) > 0) {
        echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . ', "flt": ' . JEncode($_filter, $lanbilling) . '})'; // delete quotes
    }
    else echo '({ "total": 0, "results": "" })';
} // end getAgreements()


/**
 *
 * @param object $lanbilling
 * @return
 */
function getUsers( &$lanbilling )
{
    $_tmp = array();

    $_filter = usersFilter($lanbilling);
    
    if(isset($_POST['showdefault']) ){
    	$_filter["showdefault"] = (integer) $_POST['showdefault'];
    }

    /**
     * Available order by names:
     * a_uid
     * a_type
     * a_category
     * a_login
     * a_name
     * a_descr
     * a_email
     * a_phone
     * a_mobile
     */
    $_order = array(
        "name" => 'a_uid',
        "ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
    );
    $_md5 = $lanbilling->controlSum(array_merge($_filter, $_order));

    $lb = $lanbilling->cloneMain(array('query_timeout' => 380));
    $count = $lb->get("Count", array("flt" => $_filter, "procname" => "getAccounts", "md5" => $_md5));

	if( false != ($result = $lb->get("getAccounts", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $obj)
        {
            if($lanbilling->getAccess('operators') < 1 && $obj->account->category == 1) {
                continue;
            }

            $_arr = array(
                "uid" => $obj->account->uid,
                "name" => $obj->account->name,
				"application" => (int)$obj->application,

                "abonentsurname" => $obj->account->abonentsurname,
                "abonentname" => $obj->account->abonentname,
                "abonentpatronymic" => $obj->account->abonentpatronymic,

                "descr" => $obj->account->descr,
                "email" => $obj->account->email,
                "phone" => $obj->account->phone,
                "mobile" => $obj->account->mobile,
                "vgcnt" => $obj->account->vgcnt,
                "login" => $obj->account->login,
                "type" => $obj->account->type,
                "category" => $obj->account->category
            );

            // Push address data to user line information
            if(!empty($obj->addresses))
            {
                if(!is_array($obj->addresses)) {
                    $obj->addresses = array($obj->addresses);
                }

                $_arr["addrtype"] = $obj->addresses[0]->type;
                $_arr["addrcode"] = $obj->addresses[0]->code;
                $_arr["addressraw"] = $obj->addresses[0]->address;
                $_arr["address"] = $lanbilling->clearAddress($obj->addresses[0]->address);
            }

            $_tmp[] = $_arr;
        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else echo '({ "total": 0, "results": "" })';
} // end getUsers()


/**
 * Get users groups list and send them as JSON object
 * @param    object, billing class
 */
function getUsersExt( &$lanbilling )
{
    $_tmp = array();

    $_filter = usersFilter($lanbilling);

    /**
     * Available order by names:
     * a_uid
     * a_type
     * a_category
     * a_login
     * a_name
     * a_descr
     * a_email
     * a_phone
     * a_mobile
     */
    $_order = array(
        "name" => 'a_name',
        "ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
    );
    $_md5 = $lanbilling->controlSum(array_merge($_filter, $_order));

    $lb = $lanbilling->cloneMain(array('query_timeout' => 380));
    $count = $lb->get("Count", array("flt" => $_filter, "procname" => "getAccounts", "md5" => $_md5));

    if( false != ($result = $lb->get("getAccounts", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $obj)
        {
            if($lanbilling->getAccess('operators') < 1 && $obj->account->category == 1) {
                continue;
            }

            $_key = null;

            if(!isset($obj->agreements) || empty($obj->agreements)) {
                $_tmp[] = array(
                    "uid" => $obj->account->uid,
                    "istemplate" => (integer)$_POST['istemplate'],
                    "name" => htmlentities($obj->account->name, ENT_QUOTES, 'UTF-8'),
					"application" => (int)$obj->application,

                    "abonentsurname" => htmlentities($obj->account->abonentsurname, ENT_QUOTES, 'UTF-8'),
                    "abonentname" => htmlentities($obj->account->abonentname, ENT_QUOTES, 'UTF-8'),
                    "abonentpatronymic" => htmlentities($obj->account->abonentpatronymic, ENT_QUOTES, 'UTF-8'),

                    "descr" => htmlentities($obj->account->descr, ENT_QUOTES, 'UTF-8'),
                    "email" => $obj->account->email,
                    "phone" => $obj->account->phone,
                    "mobile" => $obj->account->mobile,
                    "vgcnt" => $obj->account->vgcnt,
                    "login" => $obj->account->login,
                    "type" => $obj->account->type,
                    "category" => $obj->account->category,
                    "agrmid" => null,
                    "agrmnum" => null,
                    "agrmdate" => null,
                    "balance" => null,
                    "symbol" => null,
                    "remind" => null,
                    "code" => null,
                    "opername" => null,
                    "closedon" => null,
                    "installments" => null
                );

                end($_tmp);
                $_key = key($_tmp);
            }
            else {
                if(!is_array($obj->agreements)) {
                    $obj->agreements = array($obj->agreements);
                }
				
                foreach($obj->agreements as $i => $agrm) {
                    $_tmp[] = array(
                        "uid" => $obj->account->uid,
                        "istemplate" => (integer)$_POST['istemplate'],
                        "name" => htmlentities($obj->account->name, ENT_QUOTES, 'UTF-8'),
						"application" => (int)$obj->application,
						
                        "abonentsurname" => htmlentities($obj->account->abonentsurname, ENT_QUOTES, 'UTF-8'),
                        "abonentname" => htmlentities($obj->account->abonentname, ENT_QUOTES, 'UTF-8'),
                        "abonentpatronymic" => htmlentities($obj->account->abonentpatronymic, ENT_QUOTES, 'UTF-8'),

                        "descr" => htmlentities($obj->account->descr, ENT_QUOTES, 'UTF-8'),
                        "email" => $obj->account->email,
                        "phone" => $obj->account->phone,
                        "mobile" => $obj->account->mobile,
                        "vgcnt" => $obj->account->vgcnt,
                        "login" => $obj->account->login,
                        "type" => $obj->account->type,
                        "category" => $obj->account->category,
                        "agrmid" => $agrm->agrmid,
                        "agrmnum" => $agrm->number,
                        "agrmdate" => $agrm->date,
                        "balance" => sprintf("%.02f", $agrm->balance),
                        "symbol" => $agrm->symbol,
                        "remind" => $agrm->bcheck,
                        "ppdebt" => $agrm->ppdebt,
                        "code" => $agrm->code,
                        "opername" => $agrm->opername,
                        "closedon" => $agrm->closedon,
                    	"installments" => $agrm->installments
                    );

                    if($i == 0) {
                        end($_tmp);
                        $_key = key($_tmp);
                    }
                }
            }

            // Push address data to user line information
            if(!is_null($_key)) {
                if(!empty($obj->addresses))
                {
                    if(!is_array($obj->addresses)) {
                        $obj->addresses = array($obj->addresses);
                    }

                    foreach($obj->addresses as $i => $address) {
                        if(empty($address->address)) {
                            continue;
                        }

                        $_tmp[$_key]['address_' . ($address->type + 1)] = $lanbilling->clearAddress($address->address);
                    }
                }
            }
        }
    }
    if(sizeof($_tmp) > 0) {
        echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else echo '({ "total": 0, "results": "" })';
} // end getUsers()


/**
 * Build filter structure, returns array
 * @param    object, billing class
 */
function usersFilter( &$lanbilling )
{
    $_filter = array(
        "personid" => $lanbilling->manager,
        "ugroups" => (integer)$_POST['getusers'],
        "istemplate" => (integer)$_POST['istemplate'],
		"includepreactivated" => (integer)$_POST['includepreactivated']
    );

    if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
        foreach($_POST['searchtpl'] as $item) {
            $t = explode('.', $item['property']);
            $_filter['searchtempl'][] = array(
                "tplname" => '',
                "tablename" => $t[0],
                "field" => $t[1],
                "condition" => $item['condition'],
                "value" => $item['value'],
                "logic" => $item['logic']
            );
        }
    }
    else {
    	$sval = trim($_POST['search']);
        switch((integer)$_POST['searchtype'])
        {
        	
            case 0: $_filter['name'] = $sval; break;
            case 1: $_filter['agrmnum'] = $sval; break;
            case 2: $_filter['login'] = $sval; break;
            case 3: $_filter['vglogin'] = $sval; break;
            case 4: $_filter['email'] = $sval; break;
            case 5: $_filter['phone'] = $sval; break;
            case 6: $_filter['code'] = $sval; break;
            case 7: $_filter['address'] = $sval; break;
            case 8: $_filter['addresscode'] = $sval; break;
            case 10:
                $str_arr = explode(" ", $_POST['search']);
                $_tmp = array();

                foreach($str_arr as $_val) {
                    if(empty($_val)) continue;
                    $cons = $lanbilling->consonant($_val);
                    if($cons[1] < 3) continue;
                    $_tmp[] = $cons[0];
                }

                if(sizeof($_tmp) > 0) {
                    $_filter['namesound'] = implode("|", $_tmp);
                }
            break;
            case 11: $_filter['inn'] = $sval; break;
            default: $_POST['search'];
        }
    }

    if(!isset($_POST['category'])) {
        $_POST['category'] = -1;
    }

    if(isset($_POST['userid'])) {
        $_filter['userid'] = $_POST['userid'];
    }

    $_filter['category'] = $_POST['category'];
    $_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
    $_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);

    return $_filter;
} // end Filter()


/**
 * Get Vgroup dor the selected user
 * @param    object, billing class
 */
function getVgroups( &$lanbilling )
{
    $filter = $lanbilling->soapFilter(array("archive" => 0, "userid" => (integer)$_POST['uid']));

    if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) )
    {
        if(!empty($result))
        {
            if(!is_array($result)) {
                $result = array($result);
            }

            $accVg = array();
            array_walk($result, create_function('&$val, $key, $_tmp', '$_tmp[0][$val->vgid] = (array)$val;'), array(&$accVg));
            return $accVg;
        }
        else return array();
    }
    else return array();
} // end getVgroups()


/**
 * Get the list of avaliable addons for the user
 * @param    object, billing
 * @param    objrct, template class
 */
function buildAddonFields( &$lanbilling, &$tpl )
{
    if( false != ($result = $lanbilling->get("getAccountsAddonsSet", array('flt' => array()))) )
    {	
        if(!is_array($result)) {
            $result = array($result);
        }
        $addonsForDisable = array();
        foreach($result as $item)
        {
            switch((integer)$item->addon->type)
            {
                case 1:
                    $tpl->setCurrentBlock('AddonComboRow');
                    $tpl->setVariable('ADDONCOMBODESCR', $item->addon->descr);
                    $tpl->setVariable('ADDONCOMBONAME', $item->addon->name);

                    if(!is_array($item->staff)) {
                        $item->staff = array($item->staff);
                    }

                    array_walk($item->staff, create_function('$item, $key, $_tmp', '
                        $_tmp[0]->setCurrentBlock("AddonComboOpt");
                        $_tmp[0]->setVariable("ADDONCOMBOSELVAL", $item->idx);
                        $_tmp[0]->setVariable("ADDONCOMBOSELNAME", $item->value);
                        if($_tmp[1] == $item->idx){
                            $_tmp[0]->touchBlock("AddonComboOptSel");
                        };
                        $_tmp[0]->parseCurrentBlock();
                    '), array( &$tpl, isset($_POST['addons']['combo'][$item->addon->name]) ? $_POST['addons']['combo'][$item->addon->name] : 0 ));

                    $tpl->parse('AddonComboRow');
                break;

                case 2:

                    $tpl->setCurrentBlock('AddonBoolRow');
                    $tpl->setVariable('ADDONBOOLDESCR', $item->addon->descr);
                    $tpl->setVariable('ADDONBOOLNAME', $item->addon->name);
                    //$tpl->setVariable('ADDONBOOLVALUE', isset($_POST['addons']['bool'][$item->addon->name]) ? $_POST['addons']['bool'][$item->addon->name] : '');
                    $tpl->setVariable('ADDONBOOLVALUE', (isset($_POST['addons']['bool'][$item->addon->name]) && $_POST['addons']['bool'][$item->addon->name] == 1) ? 'checked="checked"' : '');
                    $tpl->parse('AddonBoolRow');
                break;

                default:
                	
                    $tpl->setCurrentBlock('AddOnTextRow');
                    $tpl->setVariable('ADDONTEXTDESCR', $item->addon->descr);
                    $tpl->setVariable('ADDONTEXTNAME', $item->addon->name);
                    $tpl->setVariable('ADDONTEXTVALUE', isset($_POST['addons']['text'][$item->addon->name]) ? $_POST['addons']['text'][$item->addon->name] : '');
                    if ( DISABLE_ACCOUNT_FIELDS && ($item->addon->name == 'address' || $item->addon->name == 'actual_address') ) {
                    	$tpl->touchBlock('AddOnTextRowDis');
                    	$addonsForDisable[] = array(
                    		'name' => $item->addon->name,
                    		'value' => isset($_POST['addons']['text'][$item->addon->name]) ? $_POST['addons']['text'][$item->addon->name] : ''
                    	);
                    }
                    $tpl->parse('AddOnTextRow');
            }
        }

        $tpl->parse('AddonFields');
        
        foreach($addonsForDisable as $item) {
        	$tpl->setCurrentBlock('DisableAccountFieldsForAddon');
        	$tpl->setVariable('D_ADDONTEXTNAME', $item['name']);
        	$tpl->setVariable('D_ADDONTEXTVALUE', $item['value']);
        	$tpl->parse('DisableAccountFieldsForAddon');
        }
    }
} // end buildAddonFields()


/**
 * Save user data to server
 *
 */
function saveUserData( $lanbilling, $localize )
{
    // Strip post
    foreach($_POST as $key => $val) {
        if(is_string($val)) {
            $_POST[$key] = $lanbilling->stripMagicQuotes($val);
        }
    }

    if((integer)$_POST['templ'] == 0 && (integer)$_POST['uid'] > 0)
    {
        if(!$lanbilling->getAccess('openpass')) {
            if((integer)$_POST['pass_chg'] == 0) {
                $_POST['pass'] = $_SESSION['auth']['userPass'];
                unset($_SESSION['auth']['userPass']);
            }
        }
    }

    // Additional fields for agreements
    if( false != ($AAddonsSet = $lanbilling->get("getAgreementsAddonsSet", array('flt' => array()))) ){
        if(!is_array($AAddonsSet)) {
            $AAddonsSet = array($AAddonsSet);
        }
    }
    else {
        $AAddonsSet = array();
    }
	
	
	$pwd = $_POST['pass'];
	
    $passLength = $lanbilling->get("getOptionByName", array("name" => "pass_length"));
	
	if(strlen($pwd) < $passLength->value) {
		$err = "Password is too short " . $passLength->value;
		$saveStatus['detail'] = $err;        
		return array(
            'success' => false,
            'detail'  => $err
        );
	}

    //foreach ($_POST as $k=> $v) $_POST[$k] = trim($v);

    $struct = array("account" => array(
        "uid" => (integer)$_POST['uid'],
        "ipaccess" => (integer)$_POST['ipaccess'],
        "billdelivery" => (integer)$_POST['billdelivery'],
        "category" => (integer)$_POST['category'],
        "type" => ((integer)$_POST['type'] < 1 || (integer)$_POST['type'] > 2) ? 1 : (integer)$_POST['type'],
        "oksm" => 643,
        "templ" => (integer)$_POST['templ'],
        "wrongactive" => (integer)$_POST['wrongactive'],
        "login" => $_POST['login'],
        "pass" => $_POST['pass'],
        "uuid" => $_POST['uuid'],
        "descr" => $_POST['descr'],
        "name" => $_POST['name'],

        "abonentsurname" => trim($_POST['abonentsurname']),
        "abonentname" => trim($_POST['abonentname']),
        "abonentpatronymic" => trim($_POST['abonentpatronymic']),

        "phone" => $_POST['phone'],
        "fax" => $_POST['fax'],
        "email" => $_POST['email'],
        "mobile" => $_POST['mobile'],
        "bankname" => $_POST['bankname'],
        "branchbankname" => $_POST['branchbankname'],
        "treasuryname" => $_POST['treasuryname'],
        "treasuryaccount" => $_POST['treasuryaccount'],
        "bik" => $_POST['bik'],
        "settl" => $_POST['settl'],
        "corr" => $_POST['corr'],
        "kpp" => $_POST['kpp'],
        "inn" => $_POST['inn'],
        "ogrn" => $_POST['ogrn'],
        "okpo" => $_POST['okpo'],
        "okved" => $_POST['okved'],
        "gendiru" => $_POST['gendiru'],
        "glbuhgu" => $_POST['glbuhgu'],
        "kontperson" => $_POST['kontperson'],
        "actonwhat" => $_POST['actonwhat'],
        "passsernum" => $_POST['passsernum'],
        "passno" => $_POST['passno'],
        "passissuedate" => $_POST['passissuedate'],
        "passissuedep" => $_POST['passissuedep'],
        "passissueplace" => $_POST['passissueplace'],
        "birthdate" => $_POST['birthdate'],
        "birthplace" => $_POST['birthplace'],
        "lastmoddate" => 0,
        "wrongdate" => '',
        "okato" => $_POST['okato']
    ));

    if(is_array($_POST['user_assigned2group_1']))
    {
        $_POST['user_assigned2group_1'] = array_unique($_POST['user_assigned2group_1']);
        foreach($_POST['user_assigned2group_1'] as $val)
        {
            $struct['usergroups'][] = array("usergroup" => array(
                    "groupid" => (integer)$val,
                    "promiseallow" => 0, "promiserent" =>  0, "promisetill" => 0, "promisemax" => 0,
                    "promisemin" => 0, "promiselimit" => 0, "name" => "", "description" => ""),
                "usercnt" =>  0, "fread" =>  0, "fwrite" =>  0);
        }
    }

    foreach($_POST['address_idx'] as $key => $value)
    {
        if($key < 0 || $key > 2)
        {
            $lanbilling->ErrorHandler(__FILE__, "Unknown address type passed through key value: " . $key . ", Skiping", __LINE__);
            continue;
        }

        $data = explode(',', $value);

        if(!isset($data[0])) {
            continue;
        }
        else {
            if((integer)$data[0] <= 0) continue;
        }

        $struct['addresses'][] = array("type" => (integer)$key, "code" => $value);
    }

    // Update existsing agreements
    if( is_array($_POST['agrms']) && sizeof($_POST['agrms']) > 0 )
    {
        foreach($_POST['agrms'] as $key => $arr)
        {
            $addon = array();

            if(!empty($AAddonsSet) && isset($_POST['aaddons'][$key])) {
                foreach($AAddonsSet as $a_item) {
                    if(!isset($_POST['aaddons'][$key][$a_item->addon->name]) ||
                        ($a_item->addon->type == 1 && (integer)$_POST['aaddons'][$key][$a_item->addon->name] == 0)) {
                        continue;
                    }

                    $addon[] = array(
                        "agrmid" => (integer)$key,
                        "type" => $a_item->addon->type,
                        "idx" => ((integer)$a_item->addon->type == 1) ? (integer)$_POST['aaddons'][$key][$a_item->addon->name] : '',
                        "name" => $a_item->addon->name,
                        "descr" => '',
                        "strvalue" => ((integer)$a_item->addon->type == 0) ? $_POST['aaddons'][$key][$a_item->addon->name] : ''
                    );
                }
            }

			$ablocktype = 0;
			$ablockvalue = 0;
			$orderpayday = 0;
            $blockorders = 0;
			$blockamount = 0;
						
			if($arr['paymentmethod'] == 0){
						
					$blockdays = $_POST['agrms'][$key]['ablocktype'] == 0 ? $_POST['agrms'][$key]['ablockvalue'] : 0;
					$blockmonths = $_POST['agrms'][$key]['ablocktype'] == 1 ? $_POST['agrms'][$key]['ablockvalue'] : 0;
					$blockamount  = $_POST['agrms'][$key]['ablocktype'] == 2 ? $_POST['agrms'][$key]['ablockvalue'] : 0;
			}
			if($arr['paymentmethod'] == 1){
					$orderpayday = $_POST['agrms'][$key]['orderpayday'];
                    $blockorders = $_POST['agrms'][$key]['blockorders'];
					
			}
			
            $struct['agreements'][] = array(
                "agrmid" => (integer)$key,
                "uid" => (integer)$_POST['uid'],
                "operid" => (integer)$arr['oper'],
                "curid" => (integer)$arr['curid'],
                //"bnotify" => (integer)$arr['remind'],
                "balance" => 0,
                "credit" => (float)$arr['credit'],
                "friendagrmid" => (integer)$arr['friendagrmid'],
                "parentagrmid" => (integer)$arr['parentagrmid'],
                "priority" => (integer)$arr['priority'],
                //"balancestrictlimit" => (float)$arr['balancestrictlimit'],
                //"blimit" => (float)$arr['remindif'], 
                "number" => $arr['num'],
                "code" => $arr['code'],
                "date" => empty($arr['date']) ? '0000-00-00' : $arr['date'],
                "bcheck" => '0000-00-00',
                "addons" => empty($addon) ? null : $addon,
                "penaltymethod" => $_POST['agrms'][$key]['penaltymethod'],
                "paymentmethod" => $arr['paymentmethod'], 
                "blockdays" => $blockdays,
                "blockmonths" => $blockmonths,
                "blockamount" => $blockamount,
                "orderpayday" => $orderpayday,
                "blockorders" => $blockorders,
            	"ownerid" => (integer)$arr['ownerid']
            );
            

            if(empty($addon)) {
                unset($struct['agreements'][sizeof($struct['agreements']) - 1]['addons']);
            }
        }
    }

    if( is_array($_POST['new_agrms']) && sizeof($_POST['new_agrms']) > 0 )
    {
        foreach($_POST['new_agrms'] as $key => $arr)
        {
            $addon = array();

            if(!empty($AAddonsSet) && isset($_POST['new_aaddons'][$key])) {
                foreach($AAddonsSet as $a_item) {
                	
                    if(!isset($_POST['new_aaddons'][$key][$a_item->addon->name]) ||
                        ($a_item->addon->type == 1 && (integer)$_POST['new_aaddons'][$key][$a_item->addon->name] == 0)) {
                        continue;
                    }

                    $addon[] = array(
                        "agrmid" => (integer)$key,
                        "type" => $a_item->addon->type,
                        "idx" => ((integer)$a_item->addon->type == 1) ? (integer)$_POST['new_aaddons'][$key][$a_item->addon->name] : '',
                        "name" => $a_item->addon->name,
                        "descr" => '',
                        "strvalue" => ((integer)$a_item->addon->type == 0) ? $_POST['new_aaddons'][$key][$a_item->addon->name] : ''
                    );
                }
            }
			
			$ablocktype = 0;
			$ablockvalue = 0;
			$orderpayday = 0;
            $blockorders = 0;
			$blockamount = 0;
						
			if($arr['paymentmethod'] == 0){
						
					$blockdays = $arr['ablocktype'] == 0 ? $arr['ablockvalue'] : 0;
					$blockmonths = $arr['ablocktype'] == 1 ? $arr['ablockvalue'] : 0;
					$blockamount = $arr['ablocktype'] == 2 ? $arr['ablockvalue'] : 0;
			}
			if($arr['paymentmethod'] == 1){
					$orderpayday = $arr['orderpayday'];
                    $blockorders = $arr['blockorders'];
					
			}
			

            $struct['agreements'][] = array(
                "agrmid" => 0,
                "uid" => (integer)$_POST['uid'],
                "operid" => (integer)$arr['oper'],
                "curid" => (integer)$arr['curid'],
                //"bnotify" => (integer)$arr['remind'], 
                "balance" => 0,
                "credit" => (float)$arr['credit'],
                //"blimit" => (float)$arr['remindif'], 
                "friendagrmid" => (integer)$arr['friendagrmid'],
                "priority" => (integer)$arr['priority'],
                "parentagrmid" => (integer)$arr['parentagrmid'],
                //"balancestrictlimit" => (float)$arr['balancestrictlimit'],
                "number" => $arr['num'],
                "code" => $arr['code'],
                "date" => empty($arr['date']) ? '0000-00-00' : $arr['date'],
                "bcheck" => '0000-00-00',
                "addons" => $addon,
                "penaltymethod" => $arr['penaltymethod'],
                "blockdays" => $blockdays,
                "blockmonths" => $blockmonths,
                "blockamount" => $blockamount,
                "orderpayday" => $orderpayday,
                "blockorders" => $blockorders,
                "paymentmethod" => $arr['paymentmethod'],
            	"ownerid" => (integer)$arr['ownerid']
            );

            if(empty($addon)) {
                unset($struct['agreements'][sizeof($struct['agreements']) - 1]['addons']);
            }
        }
    }

    if(isset($_POST['addons']['text']) && sizeof($_POST['addons']['text']) > 0) {
        foreach($_POST['addons']['text'] as $key => $val) {
            $struct['addons'][] = array(
                "uid" => (integer)$_POST['uid'],
                "type" => 0,
                "idx" => 0,
                "name" => $key,
                "descr" => '',
                "strvalue" => $val
            );
        }
    }

    if(isset($_POST['addons']['bool']) && sizeof($_POST['addons']['bool']) > 0) {
        foreach($_POST['addons']['bool'] as $key => $val) {
            $struct['addons'][] = array(
                "uid" => (integer)$_POST['uid'],
                "type" => 3,
                "idx" => 0,
                "name" => $key,
                "descr" => '',
                "strvalue" => 1
            );
        }
    }

    if(isset($_POST['addons']['combo']) && sizeof($_POST['addons']['combo']) > 0) {
        foreach($_POST['addons']['combo'] as $key => $val) {
            if((integer)$val <= 0) {
                continue;
            }

            $struct['addons'][] = array(
                "uid" => (integer)$_POST['uid'],
                "type" => 1,
                "idx" => $val,
                "name" => $key,
                "descr" => '',
                "strvalue" => ''
            );
        }
    }
	 	   			
    if( false != $lanbilling->save("insupdAccount", $struct, (((integer)$_POST['uid'] == 0) ? true : false), array("getAccounts", "getAccount", "getVgroup", "getVgroups")) )
    {  	
        if($lanbilling->saveReturns->ret == 0) {
            return array(
                'success' => false,
                'detail'  => ''
            );
        }
        else {
            if((integer)$_POST['uid'] == 0) {
                $_POST['uid'] = $lanbilling->saveReturns->ret;
                if((integer)$lanbilling->getAccess('openpass') < 1) {
                    $_SESSION['auth']['crossPass'][$_POST['uid']] = $_POST['pass'];
                }
            }
            $lanbilling->flushOperators();
            if(isset($_SESSION['auth']['application'])) {
                $_SESSION['auth']['application']['uid'] = $_POST['uid'];
                $_SESSION['auth']['application']['username'] = $_POST['name'];
                $_SESSION['auth']['application']['template'] = (integer)$_POST['templ'];
            }
            return array(
                'success' => true
            );

        }
    }
    else {    		
        $error = $lanbilling->soapLastError();
        return array(
            'success' => false,
            'detail'  => $error->detail
        );
		
    }
} // end saveUserData()


/**
 * Remove selected user or template from server
 * @param    object, billing class
 */
function deleteUser( &$lanbilling, &$localize )
{
    if(!is_array($_POST['deluid']) || empty($_POST['deluid'])) {
        echo "({ success: true })";
    }
    else {
        $_withError = array();

        foreach($_POST['deluid'] as $item) {
            if((integer)$item == 0) {
                continue;
            }
			
            if( false == $lanbilling->delete("delAccount", array("id" => $item), array("getAccounts", "getAccount")) ) {
                $error = $lanbilling->soapLastError();
                $_withError[] = array($item, $item, $localize->get($error->detail));
            }
        }

        if(empty($_withError)) {
            echo "({ success: true })";
        }
        else {
            echo "({ success: false, errors: { reason: " . JEncode($_withError, $lanbilling) . " } })";
        }
    }
} // end deleteUser()


/**
 * Remove selected user account from server
 * @param    object, billing class
 */
function deleteAccount( &$lanbilling )
{
    if( false == $lanbilling->delete("delVgroup", array("id" => (integer)$_POST['delvgid']), array("getAccounts", "getAccount", "getVgroups")) )
    {
        $error = $lanbilling->soapLastError();
        echo '({ success: false, errors: { reason: "There was an error while deleting item: ' . $error->detail . '. Look server logs for details" } })';
        return false;
    }
    else {
        echo "({ success: true })";
        return true;
    }
} // end deleteAccount()


/**
 * Create 	ice document for the user
 * @param    object, billing class
 */
function createInvoice( &$lanbilling )
{
	$date = explode("-", str_replace('.', '-', $_POST['templatedate']));
	if(!checkdate((int)$date[1], (int)$date[0], (int)$date[2])) { 
		$docdate = date("Ymd");
		$per = date("Ym");
	} else {
		$docdate = $date[2].$date[1].$date[0];
		$per = $date[2].$date[1];	
	}
	
	$datetill = explode("-", str_replace('.', '-', $_POST['templatedatetill']));
	if(!checkdate((int)$datetill[1], (int)$datetill[0], (int)$datetill[2])) {
		$datetillvalue = date("Ymd");
	} else {
		$datetillvalue = $datetill[2].$datetill[1].$datetill[0];
	}
	
    $struct = array(
        "period" => $per,
        "docid" => (integer)$_POST['docid'],
        "num" => 0,
        "date" => 0,
        "summ" => (float)$_POST['orsum'],
        "grp" => 0,
        "ugrp" => 0,
        "uid" => (integer)$_POST['userid'],
        "agrmid" => (integer)$_POST['agrmid'],
        "oper" => 0,
        "date" => $docdate
    );

    if(empty($struct['uid'])) {
        echo "({ success: false, errors: { reason: 'Unknown user id' } })";
        return false;
    }

    // Create object copy with long timeout
    $lb = $lanbilling->cloneMain(array('query_timeout' => 380));
    
    $flt = array(
    	"vgid" => (integer)$_POST['vgid'],
    	"dtfrom" => $docdate,
    	"dtto" =>  $datetillvalue
    );
    
    if(isset($_POST['vgroups']) && $_POST['vgroups']!=""){
    	$flt['fullsearch'] = $_POST['vgroups'];
    }

    if( false != ($lb->save("genOrders", $struct,  false, null, $flt) )) {
        if($lb->saveReturns->ret == 0) {
            echo "({ success: false, errors: { reason: 'Server returns empty document ID. Look server logs for detail' } })";
        }
        else {
            echo "({ success: true, fileid: " . $lb->saveReturns->ret . " })";
        }
    }
    else {
        $error = $lb->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error to start generation: " . $error->detail . ". Look server logs for detail' } })";
    }
} // end createInvoice()


/**
 * Start to download invoice file
 * @param    object, billing class
 * @param    object, localize
 */
function downloadInvoice( &$lanbilling, &$localize )
{
    $_filter = array("orderid" => (integer)$_POST['getinvoice']);
    $_md5 = $lanbilling->controlSum($_filter);

    if( false != ($result = $lanbilling->get("getOrders", array("flt" => $_filter, "md5" => $_md5, "ord" => array()))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $item) {
            if($item->orderid == (integer)$_POST['getinvoice']) {
                $_tmp = explode('.', $item->doctemplate);
                $_tmp[0] = (integer)$_POST['getinvoice'];
                $_file = $lanbilling->formatDate($item->orderdate, 'Ymd') . "." . $_tmp[1];
				
				if(!empty($_POST['getExt']) && $item->docuploadext != "application/octet-stream") {
					$ext = LBDownloadHelper::getExtensionByMimeType($item->docuploadext);
					$_file = $lanbilling->formatDate($item->period, 'Ymd') . "." . $ext;
				}
				
                if( false == $lanbilling->Download($lanbilling->inCorePath($item->docsavepath) .
                    sprintf("/%d/", $lanbilling->formatDate($item->orderdate, 'Ym')) .
                    implode('.', $_tmp), $_file, '', $item->docuploadext) )
                {
                    getFileError($lanbilling, $localize, 1, $lanbilling->inCorePath($item->docsavepath) .
                        sprintf("/%d/", $lanbilling->formatDate($item->orderdate, 'Ym')) .
                        implode('.', $_tmp), $_file);
                }

                break;
            }
        }
    }
    else getFileError($lanbilling, $localize, 2);
} // end downloadInvoice()


/**
 * Get the list of additional user's form fields
 * @param    object, billing class
 */
function getUserFormFields( &$lanbilling )
{
    $_filter = array();
    $_tmp = array();

    if(!empty($_POST['getufrmfds'])) {
        $_filter['name'] = $_POST['getufrmfds'];
    }

    $_md5 = $lanbilling->controlSum($_filter);

    if( false != ($result = $lanbilling->get("getAccountsAddonsSet", array('flt' => $_filter, 'md5' => $_md5))) )
    {
        if(isset($_POST['values'])) {
            if(isset($result->staff)) {
                if(!is_array($result->staff)) {
                    $result->staff = array($result->staff);
                }

                array_walk($result->staff, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item;'), array( &$_tmp ));
            }
        }
        else {
            if(!is_array($result)) {
                $result = array($result);
            }

            array_walk($result, create_function('$item, $key, $_tmp', ' $A = (array)$item->addon; if(isset($item->staff)){ $D = (array)$item->staff; $B = array(); foreach($D as $C){ $B[] = $C->value; }; $A["strvalue"] = implode("; ", $B); }; $_tmp[0][] = $A;'), array( &$_tmp ));
        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
} // end getUserFormFields()


/**
 * Get the list of additional agreements form fields
 * @param    object, billing class
 */
function getAgrmFormFields( &$lanbilling )
{
    $_filter = array();
    $_tmp = array();

    if(!empty($_POST['getafrmfds'])) {
        $_filter['name'] = $_POST['getafrmfds'];
    }

    if( false != ($result = $lanbilling->get("getAgreementsAddonsSet", array('flt' => $_filter))) )
    {
        if(isset($_POST['values'])) {
            if(isset($result->staff)) {
                if(!is_array($result->staff)) {
                    $result->staff = array($result->staff);
                }
                foreach($result->staff as $key => $item) {
                    $_tmp[] = $item;
                }
            }
        }
        else {
            if(!is_array($result)) {
                $result = array($result);
            }

            foreach($result as $key => $item) {
                $A = (array)$item->addon;
                
                if ( isset($item->staff) ) {
                	if(!is_array($item->staff)) {
                		$item->staff = array($item->staff);
                	}
                    $D = $item->staff;
                    $B = array();
                    foreach ($D as $C) {
                        $B[] = $C->value;
                    };
                    $A["strvalue"] = implode("; ", $B);
                };
                $_tmp[] = $A;
            }

        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
} // end getAgrmFormFields()

/// @brief get soapAgreement array
///    if agrmid is set
function getAgrmMainSettings( &$lanbilling )
{
    $_filter = array();
    $_tmp = array();

    if(isset($_POST['agrmid']) && !empty($_POST['agrmid'])) {
        $_filter = array(
                'agrmid' => (integer)$_POST['agrmid']
        );
        if( false != ($result = $lanbilling->get("getAgreements", array('flt' => $_filter))) ) {
            if(!empty($result)) {
                $_tmp['balancestatus'] = $result->balancestatus;
            }
        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
} // getAgrmMainSettings


/**
 * Save new or edit additional user form field
 * @param    object, billing class
 */
function saveUserFormField( &$lanbilling )
{
    if(empty($_POST['setufrmfds'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    $struct = array(
        "addon" => array(
            "type" => (integer)$_POST['type'],
            "name" => $_POST['setufrmfds'],
            "descr" => $_POST['descr']
        )
    );

    if(isset($_POST['newstaff']) && sizeof($_POST['newstaff']) > 0)
    {
        foreach($_POST['newstaff'] as $item)
        {
            $struct['staff'][] = array(
                "idx" => 0,
                "value" => $item
            );
        }
    }

    if(isset($_POST['staff']) && sizeof($_POST['staff']) > 0)
    {
        foreach($_POST['staff'] as $key => $item)
        {
            $struct['staff'][] = array(
                "idx" => $key,
                "value" => $item
            );
        }
    }

    if( false == $lanbilling->save("insupdAccountsAddonsSet", $struct, false, array("getAccountsAddonsSet")) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while saving field: " . $error->detail . ". Look server logs for details' } })";
    }
    else echo "({ success: true })";
} // end saveUserFormField()


/**
 * Save new or edit additional agreement form field
 * @param    object, billing class
 */
function saveAgrmFormField( &$lanbilling )
{
    if(empty($_POST['setafrmfds'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    $struct = array("staff" => array(),
        "addon" => array(
            "type" => (integer)$_POST['type'],
            "name" => $_POST['setafrmfds'],
            "descr" => $_POST['descr']
        )
    );

    if(isset($_POST['newstaff']) && sizeof($_POST['newstaff']) > 0)
    {
        foreach($_POST['newstaff'] as $item)
        {
            $struct['staff'][] = array(
                "idx" => 0,
                "value" => $item
            );
        }
    }

    if(isset($_POST['staff']) && sizeof($_POST['staff']) > 0)
    {
        foreach($_POST['staff'] as $key => $item)
        {
            $struct['staff'][] = array(
                "idx" => $key,
                "value" => $item
            );
        }
    }

    if( false == $lanbilling->save("insupdAgreementsAddonsSet", $struct, false, array("getAgreementsAddonsSet")) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while saving field: " . $error->detail . ". Look server logs for details' } })";
    }
    else echo "({ success: true })";
} // end saveAgrmFormField()


/**
 * Remove additional user's form fiels from settings
 * @param    object, billing class
 */
function delUserFormFields( &$lanbilling )
{
    if(empty($_POST['delufrmfds'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    if( false == $lanbilling->delete("delAccountsAddonsSet", array("id" => $_POST['delufrmfds']), array("getAccountsAddonsSet")) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while removing field: " . $error->detail . ". Look server logs for details' } })";
    }
    else echo "({ success: true })";
} // end delUserFormFields()


/**
 * Remove additional user's form fiels from settings
 * @param    object, billing class
 */
function delAgrmFormFields( &$lanbilling )
{
    if(empty($_POST['delafrmfds'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    if( false == $lanbilling->delete("delAgreementsAddonsSet", array("id" => $_POST['delafrmfds']), array("getAgreementsAddonsSet")) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while removing field: " . $error->detail . ". Look server logs for details' } })";
    }
    else echo "({ success: true })";
} // end delAgrmFormFields()


/**
 * Send filter permissions to view user categories
 * @param    object, billing class
 */
function initFilterPermision( &$lanbilling )
{
    $C = $lanbilling->getUserCategory();
    $C[-1] = 1;

    array_walk($C, create_function('$item, $key, $_tmp', '$_tmp[0][$key] = 1;'), array( &$C ));

    switch((integer)$lanbilling->getAccess('operators'))
    {
        case 0: $C[1] = 0; break;
        default: $C[1] = 1;
    }

    echo '({ success: true, filterperm: ' . JEncode($C, $lanbilling) . ' })';
} // end initFilterPermision()


/**
 * Get agreement balance for the specified user
 * @param    object, billing class
 */
function getAgreementBalance( &$lanbilling )
{
    $_POST['uid'] = $_POST['getagrmbal'];
    $result = restoreUserData($lanbilling, false);

    $_tmp = array();

    if(!empty($result->agreements)) {
        foreach($result->agreements as $item)
        {
            if($item->agrmid == (integer)$_POST['agrmid']) {
                $_tmp = (array)$item;
                break;
            }
        }
    }

    if(isset($_POST['getppset'])) {
        if( false != ($result = $lanbilling->get("getPPSettings", array('agrm' => (integer)$_POST['getppset']))) )
        {
            if(!empty($result)) {
                $_tmp = array_merge($_tmp, (array)$result);
                $_tmp['ispromised'] = true;
            }
            else {
                $_tmp['ispromised'] = false;
            }

            if( false !== ($p = $lanbilling->get('getPromisePayments', array('flt' => array('payed' => 3, 'agrmid' => (integer)$_POST['getppset'])))) )
            {
                if(!empty($p)) {
                    $_tmp['promisedexists'] = 1;
                }
                else {
                    $_tmp['promisedexists'] = 0;
                }
            }
        }
        else {
            $_tmp['ispromised'] = false;
        }
    }

    $_tmp['extid'] = $_SESSION['auth']['cashregister']['id'];
    $_tmp['registerfolder'] = $_SESSION['auth']['cashregister']['folder'];
    $_tmp['authname'] = $_SESSION['auth']['authname'];
    $_tmp['lock_period'] = $lanbilling->Option('lock_period');
    $_tmp['payments_cash_now'] = $lanbilling->Option('payments_cash_now');

    $_tmp['use_bso'] = $_SESSION['auth']['access']['bso'];

    echo '({ success: true, result: ' . JEncode($_tmp, $lanbilling) . ' })';
} // end getAgreementBalance()


/**
 * GetAgreements numbering templates
 * @param    object, billing class
 */
function getAgreementsTpls( &$lanbilling )
{
    $agrm_tpls = $lanbilling->Option('agrmnum_template_[0-9]+', true);
    $_tmp = array();

    if(!empty($agrm_tpls)) {
        foreach($agrm_tpls as $key => $item) {
            $_str = '';
            $_str = str_replace("{","&#123;", $item->value);
            $_str = str_replace("}","&#125;", $_str);

            $_tmp[] = array(
                'name' => $item->descr,
                'template' => $_str
            );
        }

        if (!is_array($_tmp)) $_tmp = (array)$_tmp;
        sort($_tmp);
        echo '({"success": true, "results":' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({"success": true, "results": null})';
    }
} // end getAgreementsTpls()


/**
 * Get next agreements number generated by server side
 * @param    object, billing class
 */
function getAgrmNumberFromTemplate( &$lanbilling )
{
    $_POST['getanumber'] = str_replace("&#123;", "{", $_POST['getanumber']);
    $_POST['getanumber'] = str_replace("&#125;", "}", $_POST['getanumber']);
    if( false != ($result = $lanbilling->get("getAutoAgreementNumber", array("templ" => $_POST['getanumber']), false, true)) ) {
        echo '({"success": true, number: "' . $result . '"})';
    }
    else {
        echo '({"success": true, number: ""})';
    }
} // end getAgrmNumberFromTemplate()


/**
 * Call lock or unlock action for the all vgroups on the specified agreement ID
 * @param    object, billing class
 * @param    object, localize class
 */
function sendLockCommand( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('accounts') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }

    if((integer)$_POST['lockcommand']['agrmid'] == 0) {
        echo '({ success: false, reason: "' . $localize->get('Undefined') . ' ' . $localize->get('agreement') . '" })';
        return false;
    }

    if( false == ($result = $lanbilling->get("getVgroups", array("flt" => array("agrmid" => $_POST['lockcommand']['agrmid'])))) ) {
        $error = $lanbilling->soapLastError();
        echo '({ success: false, reason: "' . $error->detail . '" })';
        return false;
    }

    if(!is_array($result)) {
        $result = array($result);
    }

    switch($_POST['lockcommand']['action']) {
        case 'unlock':
            $action = 0;
        break;

        case 'lock':
        default:
            $action = 3;
        break;
    }

    $_withError = array();
    foreach($result as $item) {
        if($action > 0 && $item->blkreq > 0 && $item->blocked == 0) {
            continue;
        }

        if($action == 0 && $item->blocked == 0) {
            continue;
        }

        /**
         * State paramenter: on / off
         */
        if( false == $lanbilling->get("blkVgroup", array("id" => $item->vgid, "blk" => ($action > 0) ? $action : $item->blocked, ($action > 0) ? 'on' : 'off'), true)) {
            $error = $lanbilling->soapLastError();
            $_withError[] = array($item->login, $item->tarifdescr, $localize->get($error->detail));
        }
    }

    if(empty($_withError)) {
        echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
    }
    else {
        echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
    }
} // end sendLockCommand()


/**
 * Get operator phone directions
 * @param    object, billing main class
 */
function getOperTelStaff( &$lanbilling )
{
    $_tmp = array();

    try {
        $filter = array(
            "operid" => (integer)$_POST['getopertelstaff']
        );

        if( false === ($result = $lanbilling->get("getOperTelStaff", array("flt" => $filter))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = (array)$item;
            '), array( &$_tmp));

            $_md5 = $lanbilling->controlSum($filter);
            $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getOperTelStaff", "md5" => $_md5));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "success" => true,
            "error" => null
        );
    }

    echo JEncode($_response, $lanbilling);
} // end getOperTelStaff()


/**
 * Save operator phone directions
 * @param    object, billing class
 * @param    object, localize class
 */
function setOperTelStaff( &$lanbilling, &$localize )
{
    try {
        $struct = array(
            "recordid" => (integer)$_POST['recordid'],
             "operid" => (integer)$_POST['setopertelstaff'],
             "device" => (integer)$_POST['device'],
             "number" => $_POST['number']
        );

        if($struct['number'] == "") {
            throw new Exception($localize->get('Undefined') . ': ' . $localize->get('Template'));
        }

        if( false == $lanbilling->save("insupdOperTelStaff", $struct, $struct['recordid'] > 0 ? false : true, array("getOperTelStaff")) ) {
            throw new Exception($lanbilling->soapLastError()->detail);
        }

        if($struct['recordid'] == 0) {
            $struct['recordid'] = $lanbilling->saveReturns->ret;
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "results" => array($struct),
            "success" => true,
            "error" => null
        );
    }

    echo JEncode($_response, $lanbilling);
} // end setOperTelStaff()


/**
 * Remove phone record
 * @param    object, billing class
 * 
 */ 
function delOperTelStaff( &$lanbilling )
{
    try {
        if( false == $lanbilling->delete("delOperTelStaff", array("id" => (integer)$_POST['delopertelstaff']), array("getOperTelStaff")) ) {
            throw new Exception($lanbilling->soapLastError()->detail);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }

    echo JEncode($_response, $lanbilling);
} // end delOperTelStaff()


/**
 * Get Accounts address on fly
 * @param    object, main billing class
 * @param    object, localize class
 */
function getAddresses( &$lanbilling, &$localize )
{
    $_tmp = array();

    try {
        $filter = array(
            "address" => trim($_POST['address']),
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 50 : $_POST['limit']
        );
		
		if (isset($_POST['skipduplicate'])) $filter['skipduplicate'] = (integer)$_POST['skipduplicate']; 


        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);

        if( false === ($result = $lanbilling->get("getAddresses", array( "flt" => $filter ))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            array_walk($result, create_function('$item, $key, $_tmp', '
                $item->address = $_tmp[1]->clearAddress($item->address);
                $_tmp[0][] = (array)$item;
            '), array( &$_tmp, &$lanbilling ));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null,
            "results" => $_tmp
        );
    }
    
    echo JEncode($_response, $lanbilling);
} // end getAddresses()


/**
 * Get vgroups list for user
 * @param    object, main billing class
 * @param    object, localize class
 */
function getVgroupsList ( &$lanbilling ) {
	try {
		if(false === ($result = $lanbilling->get("getVgroups", array("flt" => array(
				"userid" => (int)$_POST['uid'],
				"archive" => 0,
		)))))
		{
			throw new Exception($lanbilling->soapLastError()->detail);
		}

		if(!is_array($result)) $result = array($result);
		$_tmp = array();
		
		array_walk($result, create_function('&$obj, $key, $_tmp','
			$_tmp[0][] = array(
				"vgid" => (int)$obj->vgid,
				"login" => (string)$obj->login,
				"tarifdescr" => $obj->tarifdescr,
				"accondate" => $obj->accondate
			);
		'), array( &$_tmp ));
	}

	catch(Exception $error) {
		$_response = array(
				"success" => false,
				"error" => $error->getMessage()
		);
	}

	if(!$_response) {
		$_response = array(
				"results" => $_tmp,
				"success" => true
		);
	}

	echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgroupsList()



/**
 * Set application to php session
 * @param object, billing class
 * @param object $localize
 * @return
 */
function setApplicationToCache( &$lanbilling )
{

	$_filter = array(
		'recordid' => $_POST['application']
	);

	if( false != ($result = $lanbilling->get("getApplications", array( "flt" => $_filter, "md5" => $_md5 ))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item) {
			$_tmp = array(
				"uid" => $item->uid,
				"recordid" => $item->recordid,
				"authorid" => $item->authorid,
				"authorid" => $item->authorid,
				"executetime" => $item->executetime,
				"alreadydone" => $item->alreadydone,
				"apptypeid" => $item->apptypeid,
				"statusid" => $item->statusid,
				"responsibleid" => $item->responsibleid,
				"authorname" => $item->authorname,
				"username" => $item->username,
				"created" => $item->created,
				"executestart" => $item->executestart,
				"executefinal" => $item->executefinal,
				"responsible" => $item->responsible,
				"task" => $item->task,
				"address" => $lanbilling->clearAddress($item->address, ","),
				"classcolor" => $item->classcolor,
				"classdescr" => $item->classdescr,
				"statuscolor" => $item->statuscolor,
				"statusdescr" => $item->statusdescr,
				"template" => 2
			);
		}
	}
	return $_tmp;
} // end setApplicationToCache()



function getPreactivatedAgreements( &$lanbilling, &$localize ) {
	
	try {
		
		$_filter = array(
			'istemplate' => 2,
			'agrmnum' => $_POST['search']
		);
		
		if(false === ($result = $lanbilling->get("getAgreements", array("flt" => $_filter))))
		{
			throw new Exception($lanbilling->soapLastError()->detail);
		}
		
		if(count($result)>0) {
			if(!is_array($result)) $result = array($result);
			$_tmp = array();
		
		
			array_walk($result, create_function('&$obj, $key, $_tmp','
				$_tmp[0][] = array(
					"agrmid" => (int)$obj->agrmid,
					"number" => $obj->number,
					"uid" => $obj->uid,
					"username" => $obj->username
				);
			'), array( &$_tmp ));
		}
		
	}

	catch(Exception $error) {
		$_response = array(
			"success" => false,
			"error" => $error->getMessage()
		);
	}

	if(!$_response) {
		$_response = array(
			"results" => $_tmp,
			"success" => true
		);
	}
	echo "(" . JEncode($_response, $lanbilling) . ")";
}



function migrateAgreement( &$lanbilling, &$localize )
{
	$struct = array(
		'agrmid' => (int)$_POST['agrmid'],
		'uid' => (int)$_POST['uid']
	);

	if( false == $lanbilling->get("migrateAgreement", array("val" => $struct)) )
    {
		echo '({ success: false, reason: "'. $lanbilling->soapLastError()->detail .'"})';
		return;
	}

	echo '({ success: true })';
}
