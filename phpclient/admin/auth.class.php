<?php
/********************************************************************
   filename:   auth.class.php
   modified:   January 14 2005 16:13:31.
   author:     LANBilling

   version: LANBilling 1.8
*********************************************************************/
class authentication
{
	/**
	 * Ссылка на родительсткий объект
	 *
	 */
	var $parent = "";

	/**
	 * Результат авторизации
	 * @var		bool
	 */
	var $authPassed = false;

	/**
	 * Идентификатор авторизованого менеджера
	 * @var		int
	 */
	var $authPerson = null;

	/**
	 * Массив привелегий доступа к меню и подразделам
	 * @var		array
	 */
	var $menuAccess = array();

	/**
	 * Последнее перечитывание привилегий менеджера
	 * @var		int
	 */
	var $lastReload = null;

	/**
	 * Перечитать привилегии
	 * @var		bool
	 */
	var $rereadPermitions = false;

	/**
	 * Разница интервалов в секундах
	 * @var		int
	 */
	var $timeDiff = 180;


	/**
	 * Авторизация
	 *
	 */
	function authentication( &$myparent )
	{
		// Ссылка на родительский класс
		$this->parent =& $myparent;
		// Начало сессии
		session_start();

		// Инициализация привелегий доступа к меню и подразделам
		$this->initMenuAccess();

		// Проверка необходимости перечитывания прав по истечению таймаута
		$this->initTimePerm();

		if( !isset($_SESSION['auth']['authperson']) || strlen($_SESSION['auth']['authperson']) == 0 )
		{
			$this->checkLogin($_POST['login'], $_POST['password']);

			if($this->authPassed)
				$this->generatePermissions();
			else {
				if(isset($_POST['async_call'])) die();
				else $this->RejectAccess();
			}
		}

		// Проверка необходимости перечитывания прав принудительно
		if( $this->rereadPermitions )
		{
			$this->setSession("permissions", null);
			$this->generatePermissions();
		}
	} // end authentication()


	/**
	 * Контроль прав доступа для авторизованого менеджера
	 *
	 */
	function initTimePerm()
	{
		switch( true )
		{
			case ( !isset($_SESSION["pr_reload"]) || empty($_SESSION["pr_reload"]) ):
				$this->rereadPermitions = true;
			break;

			case ( (time() - $_SESSION["pr_reload"]) >= $this->timeDiff ):
				$this->rereadPermitions = true;
			break;
		}
	} // end refreshPermitions()


	/**
	 * Загрузка доступа к меню и разделам управления биллинга
	 * для авторизованого менеджера
	 * @param	Логин
	 * @param	Пароль
	 */
	function checkLogin( $login, $pass )
	{
		$_SESSION['auth']['reload'] = 0;

		if( false != ($company_name_row = mysql_fetch_row(mysql_query(sprintf("SELECT name FROM operators WHERE oper_id = 0"), $this->parent->descriptor))) )
		{
			$_SESSION['auth']['companyname'] = $company_name_row[0];
		}

		$sql_query = sprintf("SELECT IF(fio IS NULL OR fio = '', login, fio) name,
					login, pass, person_id,
					agents, options, rate,
					usergroups, groups, managers,
					accountgroups, users, cards,
					catalog, tars, gen_card, gen_ords,
					gen_reps, exp_ords, vol_stat,
					time_stat, once_stat, per_stat,
					orders, documes,
					logs, authlog, allow_hd, gen_tolink, gen_docs,
					operator, recalc_bit, platezi, calendar,
					rad_attr, cardsets, users_doc_allow, users_pre_orders,
					broadcast, services
					FROM managers
					WHERE login='%s' AND pass='%s' LIMIT 1",
					$this->parent->specialchars($login), $this->parent->specialchars($pass));

		if( false == ($sql_query = mysql_query($sql_query, $this->parent->descriptor)) )
		{
			$this->authPassed = false;
			return false;
		}

		if( mysql_num_rows($sql_query) == 0 )
		{
			$this->authPassed = false;
			return false;
		}

		$cur_row = mysql_fetch_assoc($sql_query);
		$_SESSION["auth"]["username"] = $cur_row["name"];
		$_SESSION["auth"]["authperson"] = $cur_row["person_id"];
		$_SESSION["auth"]["login"] = $cur_row["login"];

		foreach($this->menuAccess as $_key => $_val)
		{
			if( isset($cur_row[$_val]) && $cur_row[$_val] == 1 )
				$this->menuAccess[$_key] = 1;
			else $this->menuAccess[$_key] = 0;
		}

		$this->setSession("menuaccess", $this->menuAccess);
		$this->authPassed = true;
	} // checkLogin()


	/**
	 * Инициализация полей для управления меню и разделов
	 * @var		array
	 */
	function initMenuAccess()
	{
		$this->menuAccess = array(
			"agents" => "agents",			// Агенты
			"users" => "users",			// Пользователи
			"groups" => "groups",			// Учетные записи
			"managers" => "managers",		// Менеджеры
			"accounts" => "accountgroups",		// Группы пользователей
			"usergroups" => "usergroups",		// Объединения
			"operator" => "operator",		// Операторы
			"cards" => "cards",			// Карты оплаты
			"rate" => "rate",			// Курс

			"tars" => "tars",			// Тарифы
			"catalog" => "catalog",			// Каталог
			"cardsets" => "cardsets",		// Наборы карт оплаты
			"calendar" => "calendar",		// Календарь
			"platezi" => "platezi",			// Платежи
			"rad_attr" => "rad_attr",		// Radius-атрибуты
			"services" => "services",		// Услуги

			"recalc" => "recalc_bit",		// Пересчет
			"gen_tolink" => "gen_tolink",		// На подключение
			"gen_docs" => "gen_docs",		// генерировать документы
			"gen_reps" => "gen_reps",		// Генерировать отчеты
			"gen_card" => "gen_card",		// Генерировать карты
			"gen_ords" => "gen_ords",		// Генерировать счета

			"time_stat" => "time_stat",		// Временная статистика
			"vol_stat" => "vol_stat",		// Объемная статистика
			"per_stat" => "per_stat",		// Периодическая статистика
			"once_stat" => "once_stat", 		// Разовая статистика
			"orders" => "orders",			// Счета
			"documes" => "documes",			// Документы
			"logs" => "logs",			// Журнал событий
			"authlog" => "authlog",			// Журнал авторизаций

			"options" => "options",			// Опции

			"hd" => "allow_hd",			// HelpDesk
			"broadcast" => "broadcast",		// Широковещательные сообщения

			"users_doc_allow" => "users_doc_allow",		// Формирование документов в карте пользователя
			"users_pre_orders" => "users_pre_orders",		// Формирование счетов в карте пользователя

			"help" => "help",			// Помощь
			"exp_ords" => "exp_ords",		// Экспорт счетов
		);
	} // end initMenuAccess()


	/**
	 * Установка значения сессии
	 * @param
	 */
	function setSession( $_sKey = null, $_sVal = null )
	{
		if( is_null($_sKey) || $_sKey == "" ) return false;

		if( is_null($_sVal) )
			unset($_SESSION[$_sKey]);
		else
			$_SESSION[$_sKey] = $_sVal;
	} // end SetSession()


	/**
	 * Развертывание привилегий для авторизованого менеджера
	 * для доступа к объектам: Группы пользователей, Пользователи
	 * Учетные записи, Агенты
	 */
	function generatePermissions()
	{
		$qresult=mysql_query("select id from settings");
		do
		{
			$table_row=mysql_fetch_row($qresult);
			if ($table_row != false)
			$_SESSION['permissions']['allow_na_ids'][] = $table_row[0];
		}while ($table_row !=false);

		if ( $_SESSION['auth']['authperson'] == 0 )
		{

			$qresult=mysql_query("select vg_id from vgroups where vg_id > 0 group by vg_id order by vg_id", $this->parent->descriptor);
			do
			{
				$cur_row=mysql_fetch_row($qresult);
				if ($cur_row != false)
					$_SESSION['permissions']['rw_groups'][]=$cur_row[0];
			}while ($cur_row !=false);
			$_SESSION['permissions']['rw_groups'][] = 0;

			$qresult=mysql_query("select uid from accounts", $this->parent->descriptor);
			do
			{
				$cur_row=mysql_fetch_row($qresult);
				if ($cur_row != false)
					$_SESSION['permissions']['rw_usergroups'][]=$cur_row[0];
			}while ($cur_row !=false);

			$qresult=mysql_query("select group_id from usergroups", $this->parent->descriptor);
			do
			{
				$cur_row=mysql_fetch_row($qresult);
				if ($cur_row != false)
					$_SESSION['permissions']['rw_ugroups'][]=$cur_row[0];
			}while ($cur_row !=false);

			$_SESSION['permissions']['rw_ugroups'][] = 0;
		}
		else
		{
			$qr=mysql_query(sprintf("select distinct man_staff.ug_id from man_staff,managers
			where man_staff.rw_flag = 0 and managers.login = '%s' and
			managers.person_id = man_staff.person_id",$_SESSION['auth']['login']), $this->parent->descriptor);
			do
			{
				$current_row=mysql_fetch_row($qr);
				if($current_row !=false && is_numeric($current_row[0]))
				{
					$_SESSION['permissions']['ro_ugroups'][] = $current_row[0];
					$qr1 = mysql_query(sprintf("select distinct uid from usergroups_staff where group_id = %d",$current_row[0]), $this->parent->descriptor);
					do
					{
						$current_row1=mysql_fetch_row($qr1);
						if($current_row1 !=false)
							$_SESSION['permissions']['ro_usergroups'][] = $current_row1[0];
					}while ($current_row1 !=false);
				}
			}while ($current_row !=false);

			$qr=mysql_query(sprintf("select distinct man_staff.ug_id from man_staff,managers
			where man_staff.rw_flag = 1 and managers.login = '%s'
			and   managers.person_id = man_staff.person_id",$_SESSION['auth']['login']), $this->parent->descriptor);
			do
			{
				$current_row=mysql_fetch_row($qr);

				if($current_row !=false && is_numeric($current_row[0]))
				{
					$_SESSION['permissions']['rw_ugroups'][] = $current_row[0];
					$qr1=mysql_query(sprintf("select distinct uid from usergroups_staff where group_id = %d",$current_row[0]));
					do
					{
						$current_row1=mysql_fetch_row($qr1);
						if($current_row1 !=false)
							$_SESSION['permissions']['rw_usergroups'][] = $current_row1[0];
					}while ($current_row1 !=false);
				}
				elseif ($current_row !=false)
				{
					list($temp_id) = sscanf($current_row[0],"pd%d");
					$_SESSION['permissions']['rw_usergroups'][] = (-1)*(integer)$temp_id;
					$_SESSION['permissions']['rw_ugroups'][] = (-1)*(integer)$temp_id;

					$qr1=mysql_query(sprintf("select distinct uid from usergroups_staff where group_id = %d",(-1)*(integer)$temp_id));
					do
					{
						$current_row1=mysql_fetch_row($qr1);
						if($current_row1 !=false)
							$_SESSION['permissions']['rw_usergroups'][] = $current_row1[0];
					}while ($current_row1 !=false);
				}
			}while ($current_row !=false);

			$qr1=mysql_query(sprintf("select distinct uid from usergroups_staff where group_id = -%d",$_SESSION['auth']['authperson']));
			do
			{
				$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
					$_SESSION['permissions']['rw_usergroups'][] = $current_row1[0];
			}while ($current_row1 !=false);

			$_SESSION['permissions']['rw_ugroups'][] = (-1)*$_SESSION['auth']['authperson'];
			$_SESSION['permissions']['rw_usergroups'][] = (-1)*$_SESSION['auth']['authperson'];

			if(is_array($_SESSION['permissions']['ro_usergroups']))
			{
				$res = mysql_query(sprintf("select distinct v.vg_id from vgroups as v, agreements as a where a.agrm_id=v.agrm_id and a.uid in (%s) order by v.vg_id",implode(",",$_SESSION['permissions']['ro_usergroups'])));
				$row = mysql_fetch_row($res);

				if($row != false)
					do
					{
						$_SESSION['permissions']['ro_groups'][] = $row[0];
						$row = mysql_fetch_row($res);
					}while($row != false);
			}

			if(is_array($_SESSION['permissions']['rw_usergroups']))
			{
				$res = mysql_query(sprintf("select distinct v.vg_id from vgroups as v, agreements as a where a.agrm_id=v.agrm_id and a.uid in (%s) order by v.vg_id",implode(",",$_SESSION['permissions']['rw_usergroups'])));
				$row = mysql_fetch_row($res);

				if($row != false)
					do
					{
						$_SESSION['permissions']['rw_groups'][] = $row[0];
						$row = mysql_fetch_row($res);
					}while($row != false);
			}
		}

		$this->setSession("pr_reload", time());
		if(!isset($_SESSION['permissions']['ro_ugroups']) || !is_array($_SESSION['permissions']['ro_ugroups'])) $_SESSION['permissions']['ro_ugroups'] = array();
		if(!isset($_SESSION['permissions']['rw_ugroups']) || !is_array($_SESSION['permissions']['rw_ugroups'])) $_SESSION['permissions']['rw_ugroups'] = array();
		if(!isset($_SESSION['permissions']['ro_groups']) || !is_array($_SESSION['permissions']['ro_groups'])) $_SESSION['permissions']['ro_groups'] = array();
		if(!isset($_SESSION['permissions']['rw_groups']) || !is_array($_SESSION['permissions']['rw_groups'])) $_SESSION['permissions']['rw_groups'] = array();
		if(!isset($_SESSION['permissions']['ro_usergroups']) || !is_array($_SESSION['permissions']['ro_usergroups'])) $_SESSION['permissions']['ro_usergroups'] = array();
		if(!isset($_SESSION['permissions']['rw_usergroups']) || !is_array($_SESSION['permissions']['rw_usergroups'])) $_SESSION['permissions']['rw_usergroups'] = array();
	} // end generatePermissions()


	/**
	 * Функция остановки работы Вэб-интерфейса АСР
	 *
	 */
	function RejectAccess()
	{
		$tpl = new HTML_Template_IT(TPLS_PATH);
		$tpl->loadTemplatefile("accessReject.tpl",true,true);
		$tpl->syncBlockLocalize();;
		$tpl->show();
		exit;
	} // end RejectAccess()

	/**
	 * Check if there is access for the selected menu
	 * @param	string menua name
	 */
	function access( $name = "" )
	{
		foreach($_SESSION["menuaccess"] as $_key => $_val)
			if($_key == $name && $_val == 1) return true;

		return false;
	} // end access()
}
?>