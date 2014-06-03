<?php

// Set file name for the correct request
define('FILENAME', str_replace('.php', '', basename(__FILE__)));

// Each category can contains special external key. To identify the list of the categories
// You should set this prefix constant.
// RegExp pattern
define(FILENAME . '_CATEGORY_PREFIX', '/^zkh_/');
// Field name of the device serial number
define(FILENAME . '_SERIAL_NUMBER', 'device_serial');


// Set unique names of the variables which will be used for the lambda functions
// Function to build the list of the services
$getUBCtgs = FILENAME . "_" . mt_rand(0, 0xFFFFFF);
// Save usbox vategory
$setUBCtg = FILENAME . "_" . mt_rand(0, 0xFFFFFF);
// Get assign service
$getUBSrv = FILENAME . "_" . mt_rand(0, 0xFFFFFF);


/**
 * Get the list of the services for USBox tariff according to passed account identification
 * number and its tariff settings
 * @param	object, billing class
 */
${$getUBCtgs} = create_function('&$lanbilling', '
	$_tmp = array(
		"vgids" => array(),
		"tarids" => array(),
		"services" => array(),
	);
	
	if( false != ($result = $lanbilling->get("getClientVgroups")) ) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		$agrms = array();
		// Prepare agreements currency symbol
		foreach($lanbilling->clientInfo->agreements as $item) {
			$agrms[$item->agrmid] = $item;
		}
		
		// Search USBox vgroup item
		array_walk($result, create_function(\'$item, $key, $_tmp\', \'
			if($item->vgroup->tariftype == 5) {
				$_tmp[0]["vgids"][$item->vgroup->vgid] = array(
					"vgid" => $item->vgroup->vgid,
					"agrmid" => $item->vgroup->agrmid,
					"number" => $_tmp[1][$item->vgroup->agrmid]->number,
					"tarid" => $item->vgroup->tarifid,
					"login" => $item->vgroup->login,
					"tarifdescr" => $item->vgroup->tarifdescr,
					"symbol" => $_tmp[1][$item->vgroup->agrmid]->symbol
				);
				
				array_push($_tmp[0]["tarids"], array(
					"id" => $item->vgroup->tarifid,
					"symbol" => $_tmp[1][$item->vgroup->agrmid]->symbol
				));
				
				if(isset($item->addons)) {
					if(!is_array($item->addons)) {
						$item->addons = array($item->addons);
					}
					
					foreach($item->addons as $addon) {
						if($_tmp[2]->isConstant(FILENAME . "_SERIAL_NUMBER") != $addon->name) {
							continue;
						}
						
						$_tmp[0]["vgids"][$item->vgroup->vgid]["serial"] = $addon->strvalue;
					}
				}
			}
		\'), array( &$_tmp, $agrms, &$lanbilling ));
	}
	
	if(!empty($_tmp["tarids"])) {
		foreach($_tmp["tarids"] as $tarif) {
			if( false != ($result = $lanbilling->get("getTarCategories", array("id" => $tarif["id"]))) )
			{
				if(!is_array($result)) {
					$result = array($result);
				}
				
				array_walk($result, create_function(\'$item, $key, $_tmp\', \'
					if(!preg_match($_tmp[1]->isConstant(FILENAME . "_CATEGORY_PREFIX"), $item->uuid) || $item->common > 0) {
						return;
					}
					
					$item->symbol = $_tmp[2]["symbol"];
					$_tmp[0]["services"][$item->catidx] = (array)$item;
				\'), array( &$_tmp, &$lanbilling, $tarif ));
			}
		}
	}
	
	unset($_tmp["tarids"]);
	
	return $_tmp;
'); // end lambda function to get services list


/**
 * Save passed service data
 * @param	object, billing class
 */
${$setUBCtg} = create_function('&$lanbilling, &$staff', '
	try {
		if(empty($_POST["datadate"]) || !preg_match("/\d{2}\.\d{2}.\d{4}/", $_POST["datadate"])) {
			throw new Exception("Неверно указана дата снятия показаний прибора");
		}
		
		if((integer)$_POST["vgid"] <= 0) {
			throw new Exception("Цель запроса не может быть установлена");
		}
		
		if((integer)$_POST["tarid"] <= 0) {
			if((integer)$staff["vgids"][$_POST["vgid"]]["tarid"] <= 0) {
				throw new Exception("Невозможно определить тариф для указанной учетной записи");
			}
		}
		
		$_POST["datadate"] = implode("-", array_reverse(explode(".", $_POST["datadate"]))) . " " . date("H:i:s");
		
		$struct = array(
			"servid" => 0,
	     	"vgid" => (integer)$_POST["vgid"],
			"tarid" => $staff["vgids"][$_POST["vgid"]]["tarid"],
			"catidx" => (integer)$_POST["serviceid"],
			"mul" => 0,
			"timefrom" => $_POST["datadate"],
			"externaldata" => (integer)$_POST["multiply"]
		);
		
		$struct["mul"] = $struct["externaldata"] - ((integer)$_POST["lastvalue"] == 0 ? $struct["externaldata"] : $_POST["lastvalue"]);
		
		$struct["timeto"] = $struct["timefrom"];
		
		if( false == ($result = $lanbilling->save("insupdClientUsboxService", $struct, ((integer)$struct[\'servid\'] > 0) ? false : true, array("getVgroupServices")))) {
			throw new Exception("Во время обработки данных произошла ошибка");
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
	
	echo "(" . $lanbilling->JEncode($_response, $lanbilling) . ")";
'); // end setCurrentService()


/**
 * Get all assigned service for the specified vgid
 * @param	object, billing class
 */
${$getUBSrv} = create_function('&$lanbilling, $staff', '
	/**
	 * Available filters
	 * vgid: account id
	 * common: -1 all, 0 - once, 1 - all periodic
	 */
	$_filter = array(
		"vgid" => (integer)$_POST["getlastserv"],
		"common" => 0,
		"pgsize" => 10000
	);
	
	$_filter["pgnum"] = $lanbilling->linesAsPageNum($_filter["pgsize"], 1);
	$_md5 = $lanbilling->controlSum($_filter);
	
	$_tmp = array();
	
	try {
		if( false === ($result = $lanbilling->get("getUsboxServices", array("flt" => $_filter))) ) {
			throw new Exception("Произошла ошибка при обращении к серверу");
		}
		
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function(\'$item, $key, $_tmp\', \'
			if($_tmp[2]["catidx"] != $item->service->catidx) {
				return;
			}
			
			$_date = $_tmp[1]->formatDate($item->service->timefrom, "YmdHis");
			
			$_tmp[0][$_date ? $_date : 0] = $item;
		\'), array( &$_tmp, &$lanbilling, array(
			"catidx" => $_POST["catidx"]
		) ));
		
		// Clear memory
		unset($result);
		// Reverse sort array
		krsort($_tmp, SORT_NUMERIC);
		// Reset to the first item
		reset($_tmp);
		$_tmp = current($_tmp);
		
		$data = array(
			"lastvalue" => !empty($_tmp) ? (((integer)trim($_tmp->service->externaldata) <= 0) ? 0 : (integer)trim($_tmp->service->externaldata)) : "",
			"lastdate" => !empty($_tmp) ? $_tmp->service->timefrom : "",
			"cost" => !empty($_tmp) ? (float)$_tmp->catabove : $staff["services"][$_POST["catidx"]]["above"],
			"sum" => 0,
			"servicename" => !empty($_tmp) ? $_tmp->catdescr : $staff["services"][$_POST["catidx"]]["descr"],
			"symbol" => $staff["services"][$_POST["catidx"]]["symbol"]
		);
		
		if(isset($_POST["servicevalue"])) {
			if((integer)$_POST["servicevalue"] <= 0) {
				throw new Exception("Введите показание прибора");
			}
			
			$data["currentvalue"] = $_POST["servicevalue"];
			
			if($data["lastvalue"] > $data["currentvalue"]) {
				throw new Exception("Вы указали текущее значение меньше чем предыдущее<br>Текущее: " . $data["currentvalue"] . "<br>Предыдущее: " . $data["lastvalue"]);
			}
			
			$data["delta"] = $data["currentvalue"] - $data["lastvalue"];
			$data["sum"] = $data["delta"] * $data["cost"];
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
			"results" => $data
		);
	}
	
	echo "(" . $lanbilling->JEncode($_response, $lanbilling) . ")";
'); // end getAssignedServ()


// Start authorized operations by client request
if($lanbilling->authorized) {
	$staff = ${$getUBCtgs}($lanbilling);
	
	
	if((integer)$_POST['async_call'] == 1 || (integer)$_GET['async_call'] == 1) {
		// Find the last
		if($_POST['getlastserv']) {
			${$getUBSrv}($lanbilling, $staff);
		}
		
		if($_POST['savezkh']) {
			${$setUBCtg}($lanbilling, $staff);
		}
		
		if($_POST['getrender']) {
			$content = <<<EOF
				({
					renderTo: 'zkhFrame',
					frame: false,
					border: false,
					width: 650,
					monitorValid: true,
					url: 'index.php',
					monitorValid: true,
					labelWidth: 190,
					items: [{
						xtype: 'container',
						itemId: 'number',
						fieldLabel: 'Номер договора',
						data: {},
						tpl: '{number}'
					}, {
						xtype: 'combo',
						anchor: '100%%',
						emptyText: '...',
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						fieldLabel: 'Прибор',
						allowBlank: false,
						valueField: 'vgid',
						displayField: 'login',
						hiddenName: 'vgid',
						tpl: '<tpl for="."><div class="x-combo-list-item">{values.vgid}. {[Ext.util.Format.ellipsis(values.login, 30)]}</div></tpl>',
						itemId: 'vgid',
						forceSelection: true,
						listeners: {
							select: function(combo, record) {
								var child = combo.ownerCt.get('services');
								
								if(record) {
									combo.ownerCt.get('number').update(record.data);
									combo.ownerCt.get('serial').update(record.data);
									child.setValue(null);
									child.getStore().filter('tarid', new RegExp('^' + record.get('tarid')));
								}
								
								combo.ownerCt.get('lastdate').update({lastdate:""});
								combo.ownerCt.get('lastvalue').update({lastvalue:""});
								
								var data = combo.ownerCt.getForm().getValues();
								combo.ownerCt.get('datadate')[data['vgid'] && data['serviceid'] ? "enable" : "disable"]();
								combo.ownerCt.get('datavalue')[data['vgid'] && data['serviceid'] ? "enable" : "disable"]();
							}
						},
						store: {
							xtype: 'jsonstore',
							fields: [
								{ name: 'vgid', type: 'int' },
								{ name: 'login', type: 'string' },
								{ name: 'tarid', type: 'int' },
								{ name: 'number', type: 'string' },
								{ name: 'symbol', type: 'string' },
								{ name: 'serial', type: 'string' }
							],
							data: %s
						}
					}, {
						xtype: 'combo',
						anchor: '100%%',
						emptyText: '...',
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						fieldLabel: 'Услуги',
						allowBlank: false,
						valueField: 'catidx',
						displayField: 'descr',
						hiddenName: 'serviceid',
						tpl: '<tpl for="."><div class="x-combo-list-item">{values.catidx}. {[Ext.util.Format.ellipsis(values.descr, 30)]} ({values.above} {values.symbol})</div></tpl>',
						itemId: 'services',
						forceSelection: true,
						listeners: {
							select: function(combo, record) {
								var data = combo.ownerCt.getForm().getValues();
								
								if(!data.vgid) {
									return false;
								}
								
								combo.ownerCt.get('datadate')[data['vgid'] && data['serviceid'] ? "enable" : "disable"]();
								combo.ownerCt.get('datavalue')[data['vgid'] && data['serviceid'] ? "enable" : "disable"]();
								
								if(!combo.ownerCt['mask']) {
									combo.ownerCt.mask = new Ext.LoadMask(combo.ownerCt.getId(), {msg:"Пожалуйста подождите..."});
								}
								
								combo.ownerCt.mask.show();
								
								Ext.Ajax.request({
									url: "index.php",
									method: "POST",
									params: {
										async_call: 1,
										devision: 4,
										fcall: '%s',
										getlastserv: data.vgid,
										catidx: combo.getValue()
									},
									scope: {
										form: combo.ownerCt,
										formData: data
									},
									callback: function(opt, success, response) {
										this.form.mask.hide();
										try {
											var data = Ext.util.JSON.decode(response.responseText);
											
											if(!data["success"]) {
												throw(data["error"]);
											}
											
											this.form.get('lastdate').update({
												lastdate: data.results['lastdate'] ? Date.parseDate(data.results.lastdate, "Y-m-d H:i:s").format("d.m.Y") : ""
											});
											
											this.form.get('lastvalue').update({
												lastvalue: data.results["lastvalue"] ? data.results.lastvalue : this.formData.multiply
											});
										}
										catch(e) {
											Ext.Msg.alert('Ошибка', e);
										}
									}
								});
							}
						},
						store: {
							xtype: 'jsonstore',
							fields: [
								{ name: 'catidx', type: 'int' },
								{ name: 'descr', type: 'string' },
								{ name: 'above', type: 'double' },
								{ name: 'symbol', type: 'string' },
								{ name: 'tarid', type: 'int' },
								{ name: 'uuid', type: 'string' }
							],
							data: %s
						}
					}, {
						fieldLabel: 'Заводской номер прибора',
						itemId: 'serial',
						xtype: 'container',
						height: 22,
						tpl: new Ext.XTemplate('{serial}')
					}, {
						fieldLabel: 'Дата предыдущих показаний',
						xtype: 'container',
						itemId: 'lastdate',
						height: 22,
						tpl: new Ext.XTemplate('{lastdate}')
					}, {
						fieldLabel: 'Предыдущие показания',
						xtype: 'container',
						itemId: 'lastvalue',
						height: 22,
						tpl: new Ext.XTemplate('{lastvalue}')
					}, {
						xtype: 'datefield',
						itemId: 'datadate',
						disabled: true,
						fieldLabel: 'Дата снятия текущих показаний',
						name: 'datadate',
						allowBlank: false,
						anchor: '60%%',
						format: 'd.m.Y'
					}, {
						xtype: 'numberfield',
						itemId: 'datavalue',
						disabled: true,
						fieldLabel: 'Показания прибора',
						name: 'multiply',
						anchor: '100%%',
						allowBlank: false,
						allowNegative: false,
						minValue: 0,
						value: 0
					}],
					buttonAlign: 'center',
					buttons: [{
						xtype: 'button',
						text: 'Сохранить',
						scale: 'large',
						formBind: true,
						handler: function(Btn){
							var form = Btn.findParentByType('form');
							
							if(form.getForm().isValid()) {
								var data = form.getForm().getValues();
								
								var idx = -1;
								if((idx = form.get('services').getStore().find('catidx', data.serviceid)) > -1) {
									var record = form.get('services').getStore().getAt(idx);
									
									data.service = record.get('descr');
									data.cost = record.get('above');
									data.sum = (record.get('above') * data.multiply).toFixed(2);
								}
								else {
									return false;
								}
								
								Ext.Ajax.request({
									url: "index.php",
									method: "POST",
									params: {
										async_call: 1,
										devision: 4,
										fcall: '%s',
										getlastserv: data.vgid,
										catidx: record.get("catidx"),
										servicevalue: data.multiply
									},
									scope: {
										form: form
									},
									callback: function(opt, success, response) {
										try {
											var data = Ext.util.JSON.decode(response.responseText);
											
											if(!data["success"]) {
												throw(data["error"]);
											}
											
											var tpl = new Ext.Template(
												'<div style="width:250px;font-size:12pt;">',
													'<div><b>Услуга:</b>&nbsp;{servicename}</div>',
													'<div><b>Предыдущее показание прибора:</b>&nbsp;{lastvalue}</div>',
													'<div><b>Текущее показание прибора:</b>&nbsp;{currentvalue}</div>',
													'<div><b>Расход:</b>&nbsp;{delta}</div>',
													'<div><b>Стоимость за единицу:</b>&nbsp;{cost} ({symbol})</div>',
													'<div><b>Итого:</b>&nbsp;{sum} ({symbol})</div>',
												'</div>'
											).compile();
											
											Ext.Msg.confirm('Подтвердите списание', tpl.apply(data.results), function(Btn){
												if(Btn != 'yes') {
													return false;
												}
												
												this.form.getForm().submit({
													method: 'POST',
				            						waitTitle: 'Подключение',
				            						waitMsg: 'Отправка данных ...',
													params: {
														async_call: 1,
														devision: 4,
														fcall: '%s',
														savezkh: 1,
														lastvalue: data.results.lastvalue
													},
													scope: this.form,
													success: function(form, action){
														try {
															var data = Ext.util.JSON.decode(action.response.responseText);
															
															if(data.success) {
																form.reset();
																this.get('number').update({number:""});
																this.get('vgid').setValue(null);
																this.get('vgid').fireEvent('select', this.get('vgid'));
																this.get('lastdate').update({lastdate:""});
																this.get('lastvalue').update({lastvalue:""});
															}
															else {
																throw(data.error);
															}
															
															Ext.Msg.alert('Уведомление', 'Запрос выполнен успешно');
														}
														catch(e){
															Ext.Msg.alert('Ошибка', 'Сервер вернул ошибку: ' + e);
														}
													},
													failure: function(form, action){
														try {
															var data = Ext.util.JSON.decode(action.response.responseText);
															throw(data.error);
														}
														catch(e) {
															Ext.Msg.alert('Ошибка',e);
														}
													}
												});
											}, {
												form: this.form,
												data: data
											});
										}
										catch(e) {
											Ext.Msg.alert('Ошибка',e);
										}
									}
								});
							}
						}
					}]
				})
EOF;
			printf($content,
				// Vgroup items
				empty($staff["vgids"]) ? '[]' : $lanbilling->JEncode(array_values($staff["vgids"]), $lanbilling),
				// File name
				FILENAME,
				// Fill services data 
				empty($staff["services"]) ? '[]' : $lanbilling->JEncode(array_values($staff["services"]), $lanbilling),
				// File name
				FILENAME,
				// File name
				FILENAME
			);
		}
	}
	else {
		$content = <<<EOF
			<table style="margin-top:50px;"><tr><td align="left"><div id="zkhFrame"></div></td></tr></table>
			<script language="javascript">Ext.onReady(function(){Ext.Ajax.request({url:'index.php',params:{async_call:1,devision:4,fcall:'%s',getrender:1},callback:function(A,B,C){try{new Ext.form.FormPanel(Ext.util.JSON.decode(C.responseText));}catch(e){Ext.Msg.alert('Ошибка',e)}}})});</script>
EOF;
		printf($content,
			// File name
			FILENAME
		);
	}
}
?>