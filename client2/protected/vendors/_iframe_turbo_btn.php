<?php
/**
 * This script works only with USBox account of the subscriber
 *
 */

 error_reporting(7);

// Service title
define('SERVICE_TITLE', "");

// Each category can contains special external key. To identify the list of the categories
// You should set this prefix constant.
// RegExp pattern
define('CATEGORY_PREFIX', '/^turbo_/');
// Text to show as description. There can be used html tags
define('DESCRIPTION_BLOCK', 'С помощью этой формы Вы можете увеличить текущую скорость для выхода в Интернет.<br>' .
	'Ниже выберите услугу из списка. Укажите для какой учетной записи ее следует активировать и нажмите сохранить.<br>' .
	'Услуга вступает в действие с момента назначения<br');
// Service deal file name
define('SERVICE_DEAL_FILE', 'turbo_btn_deal.txt');
// Service agree file name, this text will be shown before the last step
// XTemplate variables:
// accountname, servicename, servicetype, servicetime, servicecost, servicecurr
define('SERVICE_AGREE_FILE', 'any_agree.txt');
// Main page banner file name. Put the file near this php
// Change file extension if need
define('MAIN_BANNER_FILE', 'turbo_btn_banner.gif');
// Do not allow multiple services
define('STRICT_MULTIPLE_SERVICES', false);
// Show current activated services
define('SHOW_ACTIVATED_SERVICES', true);
// Hide or show multiply
define('HIDE_MULTIPLY', false);
// Hide or show cost field
define('HIDE_COST', false);
// Service is long action
define('LONG_ACTION_SERVICE', false);
// Allow stop service, this works only if set LONG_ACTION_SERVICE = true
define('ALLOW_STOP_SERVICE', false);

// Set file name for the future request
define('FILENAME', str_replace('.php', '', basename(__FILE__)));

// Check if there exists service deal text file to show for the user
if(file_exists(($deal = dirname(realpath(__FILE__)) . ($lanbilling->UNIX ? '/' : '\\') . SERVICE_DEAL_FILE))) {
	$deal_content = str_replace(array("\r\n", "\n", "\r"), '<br />', addslashes(file_get_contents($deal)));
}

// Check if there exists service agree file to continue
if(file_exists(($agree = dirname(realpath(__FILE__)) . ($lanbilling->UNIX ? '/' : '\\') . SERVICE_AGREE_FILE))) {
	$agree_content = str_replace(array("\r\n", "\n", "\r"), '<br />', addslashes(file_get_contents($agree)));
}


// Start authorized operations by client request
if($lanbilling->authorized) {
	$staff = getUSBoxCategories($lanbilling);

	if((integer)@$_POST['async_call'] == 1 || (integer)@$_GET['async_call'] == 1) {
        if(isset($_GET['banner'])) {
                if(file_exists(dirname(realpath(__FILE__)) . ($lanbilling->UNIX ? '/' : '\\') . MAIN_BANNER_FILE)) {
                        $img = "<a href=\"javascript:window.parent.location.href='index.php?devision=4'\" style='border:none;'><img style='border:none' src='services/%s'></a>";
                        printf($img, MAIN_BANNER_FILE);
                }
        }

		if(@$_POST['getturbo']) {
			getCurrentTurbo($lanbilling, $staff);
		}

		if(@$_POST['saveturbo']) {
			setCurrentTurbo($lanbilling);
		}

		if(@$_POST['stopturbo']) {
			stopCurrentTurbo($lanbilling);
		}
	}
	else {
		$content = <<<EOF
			<table style="margin-top:50px;"><tr><td align="left"><div id="turboBtn"></div></td></tr></table>
			<script language="javascript">
				Ext.onReady(function(){
					new Ext.form.FormPanel({
						renderTo: 'turboBtn',
						title: "%s",
						longActionServ: %d,
						frame: true,
						width: 678,
						monitorValid: true,
						url: 'index.php',
						monitorValid: true,
						labelWidth: 150,
						listeners: {
							beforerender: function(form){
								if(!form.items.first().get('deal_content').contentValid) {
									form.items.first().activeItem = 1;
								}

								var grid = form.findByType('grid')[0];
								grid.store.on('load', function(store) {
									this[(store.getCount() > 0) ? 'show' : 'hide']();
								}, grid);
								grid.store.load();
							}
						},
						items: [{
							layout: 'card',
							activeItem: 0,
							defaults: {
								layout: 'form'
							},
							items: [{
								itemId: 'deal_content',
								style: 'padding:5px;padding-bottom:10px;',
								autoScroll: true,
								contentValid: %s,
								listeners: {
									afterrender: function(cont) {
										if(cont.getHeight() > 300) {
											cont.setHeight(300);
										}
									}
								},
								buttonAlign: 'center',
								buttons: [{
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Согласен</b>',
									scale: 'large',
									handler: function(Btn) {
										Btn.findParentByType('form').items.first().getLayout().setActiveItem(1);
									}
								}, {
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Отменить</b>',
									scale: 'large',
									handler: function(Btn){
										window.location.href='index.php?devision=0';
									}
								}],
								html: '%s'
							}, {
								itemId: 'tbtn-controls',
								autoHeight: true,
								items:[{
									xtype: 'container',
									style: 'padding:5px;padding-bottom:10px;',
									html: '%s'
								}, {
									xtype: 'combo',
									width: 300,
									emptyText: '...',
									mode: 'local',
									triggerAction: 'all',
									editable: false,
									fieldLabel: 'Учетная запись',
									allowBlank: false,
									valueField: 'vgid',
									displayField: 'login',
									hiddenName: 'turbovgid',
									tpl: '<tpl for="."><div class="x-combo-list-item">{login} ({[Ext.util.Format.ellipsis(values.tarifdescr, 30)]})</div></tpl>',
									ref: 'vgroup',
									forceSelection: true,
									store: new Ext.data.JsonStore({
										fields: [
											{ name: 'vgid', type: 'int' },
											{ name: 'login', type: 'string' },
											{ name: 'tarifdescr', type: 'string' }
										],
										data: %s
									})
								}, {
									xtype: 'combo',
									width: 300,
									emptyText: '...',
									mode: 'local',
									triggerAction: 'all',
									editable: false,
									fieldLabel: 'Услуги',
									allowBlank: false,
									valueField: 'catidx',
									displayField: 'descr',
									hiddenName: 'turboservice',
									tpl: '<tpl for="."><div class="x-combo-list-item">{values.catidx}. {[Ext.util.Format.ellipsis(values.descr, 30)]} ({values.above} {values.symbol})</div></tpl>',
									ref: 'service',
									forceSelection: true,
									strictSelection: %d,
									getServType: function() {
										var idx = -1;
										if((idx = this.getStore().find(this.valueField, this.getValue())) > -1) {
											return this.getStore().getAt(idx).get('common');
										}
										return 0;
									},
									listeners: {
										beforeselect: function(combo, record){
											var grid = combo.ownerCt.ownerCt.ownerCt.items.items[1];

											if(combo.strictSelection && grid.getStore().find('catidx', new RegExp('^' + record.get('catidx'))) > -1) {
												combo.collapse();
												Ext.Msg.alert('Предупреждение', 'Выбранная Вами услуга уже действует или запланирована<br>Дождитесь ее окончания и повторите запрос');
												return false;
											}
										},
										select: function(combo, rec){
											this.ownerCt.costview.updateCost(rec)
										}
									},
									store: new Ext.data.JsonStore({
										fields: [
											{ name: 'catidx', type: 'int' },
											{ name: 'descr', type: 'string' },
											{ name: 'above', type: 'double' },
											{ name: 'symbol', type: 'string' },
											{ name: 'tarid', type: 'int' },
											{ name: 'vgid', type: 'int' },
											{ name: 'common', type: 'int' }
										],
										data: %s
									})
								}, {
									xtype: 'numberfield',
									fieldLabel: 'Время действия услуги',
									hidden: %d,
									name: 'turbomulti',
									ref: 'multi',
									width: 300,
									allowBlank: false,
									allowNegative: false,
									allowDecimals: false,
									minValue: 1,
									value: 1,
									listeners: {
										render: function(el) {
											if(el.hidden) {
												el.getEl().up("div.x-form-item").hide();
											}
										},
										change: function() {
											this.ownerCt.costview.updateCost();
										}
									}
								}, {
									fieldLabel: 'Стоимость',
									height: 27,
									hidden: %d,
									ref: 'costview',
									listeners: {
										render: function(el) {
											if(el.hidden) {
												el.getEl().up("div.x-form-item").hide();
											}
										},
									},
									updateCost: function(rec) {
										if(!Ext.isObject(rec)) {
											var idx = -1;
											if((idx = this.ownerCt.service.getStore().find('catidx', new RegExp('^' + this.ownerCt.service.getValue() + '$'))) > -1) {
												var rec = this.ownerCt.service.getStore().getAt(idx);
											}
											else {
												this.update({
													cost: 0
												});
												return 0;
											}
										}
										var multi = this.ownerCt.multi.getValue() || 1;
										if(multi > 60 || multi < 1) {
											this.update({
												cost: 0
											});
											return 0;
										}
										this.update({
											cost: multi * rec.get('above')
										});
										return multi * rec.get('above');
									},
									tpl: new Ext.XTemplate('<p>{cost}<span style="padding-left:10px">%s</span></p>')
								}],
								buttonAlign: 'center',
								buttons: [{
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Согласен</b>',
									scale: 'large',
									handler: function(Btn) {
										var form = Btn.findParentByType('form');

										if(form.getForm().isValid()) {
											var realForm = form.items.first().get('tbtn-controls');

											form.items.first().get('tbtn-formconfirm').update({
												accountname: realForm.vgroup.getRawValue(),
												servicename: realForm.service.getRawValue(),
												servicetype: realForm.service.getServType(),
												servicetime: realForm.multi.getValue(),
												servicecost: realForm.costview.updateCost(),
												servicecurr: "%s"
											});

											form.items.first().getLayout().setActiveItem(2);
										}
									}
								}, {
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Отменить</b>',
									scale: 'large',
									handler: function(Btn){
										var form = Btn.findParentByType('form');
										if(form.items.first().get('deal_content').contentValid) {
											form.items.first().getLayout().setActiveItem(0);
										}
										else {
											window.location.href='index.php?devision=0';
										}
									}
								}]
							}, {
								itemId: 'tbtn-formconfirm',
								style: 'padding:5px;padding-bottom:10px;',
								data: {
									servicetype: 0
								},
								tpl: %s,
								buttonAlign: 'center',
								buttons: [{
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Согласен</b>',
									scale: 'large',
									handler: function(Btn) {
										var form = Btn.findParentByType('form'),
											idx = -1,
											record;

										if((idx = form.items.first().get('tbtn-controls').service.getStore().find('catidx', form.items.first().get('tbtn-controls').service.getValue())) < 0) {
											return false;
										};
										record = form.items.first().get('tbtn-controls').service.getStore().getAt(idx);

										if(form.getForm().isValid()) {
											form.getForm().submit({
												method: 'POST',
				            					waitTitle: 'Подключение',
				            					waitMsg: 'Отправка данных ...',
												params: {
													async_call: 1,
													devision: 4,
													fcall: '%s',
													saveturbo: 1,
													turbotarid: record.get('tarid'),
													turbocatidx: record.get('catidx'),
													servvgid: record.get('vgid')
												},
												scope: form,
												success: function(form, action){
													try{
														var data = Ext.util.JSON.decode(action.response.responseText);
														if(data.results) {
															var block = this.items.first().get('tbtn-doneok');

															data.results.timefrom = Date.parseDate(data.results.timefrom, 'Y-m-d H:i:s');
															data.results.timeto = Date.parseDate(data.results.timeto, 'Y-m-d H:i:s');

															block.update({
																servicestart: data.results.timefrom.format('H:i d.m.Y'),
																servicestop: data.results.timeto.format('H:i d.m.Y'),
																servicecost: this.items.first().get('tbtn-controls').costview.updateCost(),
																servicetype: this.items.first().get('tbtn-controls').service.getServType(),
															});

															block.ownerCt.getLayout().setActiveItem(3);
														}
													}
													catch(e){
														this.items.first().getLayout().setActiveItem(1);
														Ext.alert.show('Ошибка', 'Не удалось назначить услугу, обратитесь в абонентский отдел');
													}

													this.findByType('grid')[0].getStore().reload();
												},
												failure: function(form, action) {
													Ext.Msg.alert('Ошибка', 'Не удалось назначить услугу, обратитесь в абонентский отдел');
												}
											});
										}
									}
								}, {
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">Отменить</b>',
									scale: 'large',
									handler: function(Btn){
										Btn.findParentByType('form').items.first().getLayout().setActiveItem(1);
									}
								}]
							}, {
								itemId: 'tbtn-doneok',
								style: 'padding:5px;padding-bottom:10px;',
								data: {
									servicetype: 0
								},
								tpl: [ '<div style="text-align:center;font-weight:bold;font-size:16px;width:auto;">',
									'<p>С Вашего договора %s списано {servicecost} %s</p>',
									'<p>Время предоставления услуги:</p>',
									'<p>С {servicestart}</p>',
									'<tpl if="servicetype &lt; 1"><p>До {servicestop}</tpl></p>',
									'</div>'
								],
								buttonAlign: 'center',
								buttons: [{
									xtype: 'button',
									text: '<b style="padding:10px;text-decoration: underline;">На главную</b>',
									scale: 'large',
									handler: function(Btn){
										window.location.href='index.php?devision=0';
									}
								}]
							}]
						}, {
							xtype: 'grid',
							title: 'Услуги действующие в данный момент',
							height: 200,
							allowStop: %d,
							listeners: {
								beforerender: function(grid) {
									var columns = [{
										header: 'С',
										dataIndex: 'timefrom',
										width: 125,
										renderer: function(value) {
											try {
												return value.format('d.m.Y H:i');
											}
											catch(e){ }
											return value;
										}
									}, {
										header: 'По',
										dataIndex: 'timeto',
										width: 120,
										renderer: function(value) {
											try {
												return value.format('d.m.Y H:i');
											}
											catch(e){ }
											return value;
										}
									}, {
										header: 'Учетная запись',
										width: 120,
										dataIndex: 'login'
									}, {
										header: '(Кбит/сек)',
										dataIndex: 'shape',
										width: 90
									}, {
										header: 'Описание',
										dataIndex: 'descr',
										width: 170
									}];

									if(grid.allowStop) {
										grid.plugins[0].on('action', function(grid, record){
											Ext.Ajax.request({
												url: 'index.php',
												method: 'POST',
												params: {
													async_call: 1,
													devision: 4,
													fcall: '%s',
													stopturbo: 1,
													turbotarid: record.get('tarid'),
													turbocatidx: record.get('catidx'),
													servid: record.get('servid'),
													servvgid: record.get('vgid')
												},
												scope: grid,
												callback: function(opt, success, response) {
													try {
														var data = Ext.util.JSON.decode(response.responseText);

														if(!data["success"]) {
															throw(data["error"]);
														}

														Ext.Msg.alert('Уведомление', data['reason']);
														this.getStore().reload();
													} catch(e) {
														Ext.Msg.alert('Ошибка',e);
													}
												}
											});
										});
										columns.push(grid.plugins[0]);
									}

									grid.getColumnModel().setConfig(columns);
								},
								show: function(grid) {
									if(!this.show) {
										grid.hide();
									}
								}.createDelegate({
									show: %d
								})
							},
							plugins: [
								new Ext.grid.RowButton({
									iconCls: 'ext-drop'
								})
							],
							columns: [],
							store: {
								xtype: 'store',
								proxy: new Ext.data.HttpProxy({
									url: 'index.php',
									method: 'POST',
									timeout: '380000'
								}),
								reader: new Ext.data.JsonReader({
									root: 'results'
								}, [
									{ name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
									{ name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
									{ name: 'tarid', type: 'int' },
									{ name: 'catidx', type: 'int' },
									{ name: 'servid', type: 'int' },
									{ name: 'login', type: 'string' },
									{ name: 'shape', type: 'int' },
									{ name: 'descr', type: 'string' }
								]),
								baseParams: {
									async_call: 1,
									devision: 4,
									fcall: '%s',
									getturbo: 1
								}
							}
						}]
					});
				});
			</script>
EOF;

	if(empty($agree_content)) {
		$agree_content = <<< EOF
<div style="text-align:center;font-weight:bold;font-size:16px;width:auto;">
	<p>Вами выбраны следующие параметры услуги:</p><br>
	<p>Учетная запись: {accountname}</p>
	<p>Услуга: {servicename}</p>
	<p>Время пользования услугой: <tpl if="servicetype &lt; 1">{servicetime} (час)</tpl><tpl if="servicetype &gt; 0">Период не ограничен</tpl></p>
	<p>Стоимость: {servicecost} ({servicecurr})</p>
	<br><p style="color:#680606">Нажмите "Заказать услугу" для оплаты</p>
</div>
EOF;
	}



		/**
		 * Take the first element of the usbox array, which contains usbox accounts
		 *
		 */
		reset($staff['usbox']);
		$usbox_vg = !empty($staff['usbox']) ? current($staff['usbox']) : null;

		printf($content,
			//Title
			SERVICE_TITLE,
			// Set flag to know if allowed long action service
			LONG_ACTION_SERVICE ? 1 : 0,
			// If deal content exist set visibility flag
			!$deal_content ? 'false' : 'true',
			// Deal content
			$deal_content,
			// Description block
			DESCRIPTION_BLOCK,
			// Fill vgroups that can be "turboshaped"
			empty($staff['vgroups']) ? '[]' : $lanbilling->JEncode(array_values($staff['vgroups']), $lanbilling),
			// Set strict flag,
			STRICT_MULTIPLE_SERVICES ? 1 : 0,
			// Fill services data
			is_null($usbox_vg) ? '[]' : $lanbilling->JEncode(prepareServices($usbox_vg['items']), $lanbilling),
			//Hide multiply
			HIDE_MULTIPLY ? 1 : 0,
			//Hide cost
			HIDE_COST ? 1 : 0,
			// Symbol
			$usbox_vg['symbol'],
			// Symbol
			$usbox_vg['symbol'],
			// Service agree
			$lanbilling->JEncode($agree_content, $lanbilling),
			// Set file name for the correct request
			FILENAME,
			// Agreement number
			is_null($usbox_vg) ? 'ДОГОВОР' : $usbox_vg['number'],
			// Symbol
			$usbox_vg['symbol'],
			// Allow stop long action service
			(LONG_ACTION_SERVICE && ALLOW_STOP_SERVICE) ? 1 : 0,
			// Set file name for the correct request
			FILENAME,
			// Show activated services
			SHOW_ACTIVATED_SERVICES ? 1 : 0,
			// Set file name for the correct request
			FILENAME
		);
	}
}


/**
 * Get the list of the services for USBox tariff according to passed account identification
 * number and its tariff settings
 * @param	object, billing class
 */
function getUSBoxCategories( &$lanbilling )
{
	$_tmp = array(
		"usbox" => array(),
		"vgroups" => array(),
		"shape" => array()
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
		array_walk($result, create_function('$item, $key, $_tmp', '
			if($item->vgroup->tariftype == 5) {
				$_tmp[0]["usbox"][$item->vgroup->vgid] = array(
					"vgid" => $item->vgroup->vgid,
					"agrmid" => $item->vgroup->agrmid,
					"number" => $_tmp[1][$item->vgroup->agrmid]->number,
					"tarid" => $item->vgroup->tarifid,
					"login" => $item->vgroup->login,
					"tarifdescr" => $item->vgroup->tarifdescr,
					"symbol" => $_tmp[1][$item->vgroup->agrmid]->symbol
				);
			}

			if($item->vgroup->tariftype < 3 && $item->vgroup->blocked == 0 && $item->vgroup->blkreq == 0) {
				$_tmp[0]["vgroups"][$item->vgroup->vgid] = array(
					"vgid" => $item->vgroup->vgid,
					"agrmid" => $item->vgroup->agrmid,
					"tarid" => $item->vgroup->tarifid,
					"login" => $item->vgroup->login,
					"tarifdescr" => $item->vgroup->tarifdescr
				);

				if(!empty($item->turboshape)) {
					if(!is_array($item->turboshape)){
						$item->turboshape = array($item->turboshape);
					}

					foreach($item->turboshape as $K => $I) {
						$I->tarid = $item->vgroup->tarifid;
						$_tmp[0]["shape"][] = (array)$I;
					}
				}
			}
		'), array( &$_tmp, $agrms ));
	}


	if(!empty($_tmp["usbox"])) {
		foreach($_tmp["usbox"] as $key => $item) {
			$_tmp['usbox'][$key]['items'] = array();
			$turbo = false;

			if( false != ($result = $lanbilling->get("getTarCategories", array("id" => $_tmp['usbox'][$key]['tarid']))) )
			{
				if(!is_array($result)) {
					$result = array($result);
				}

				array_walk($result, create_function('$item, $key, $_tmp', '
					if(!preg_match(CATEGORY_PREFIX, $item->uuid) || (integer)$item->available < 1) {
						return;
					}
					if(!LONG_ACTION_SERVICE && $item->common > 0) {
						return;
					}
					if($_tmp[2] === false) {
						$_tmp[2] = true;
					}
					$_tmp[0][$item->catidx] = (array)$item;
					$_tmp[0][$item->catidx]["vgid"] = $_tmp[1];
				'), array( &$_tmp["usbox"][$key]["items"], $key, &$turbo ));
			}

			if(!$turbo) {
				unset($_tmp["usbox"][$key]);
			}
		}
	}

	return $_tmp;
} // end getUSBoxCategories()


/**
 * Save passed service
 * @param	object, billing class
 */
function setCurrentTurbo( &$lanbilling )
{
	$struct = array(
		"servid" => 0,
		"vgid" => (integer)$_POST['servvgid'],
		"tarid" => (integer)$_POST['turbotarid'],
		"catidx" => (integer)$_POST['turbocatidx'],
		"mul" => ((integer)$_POST['turbomulti'] <= 0) ? 1 : $_POST['turbomulti'],
		"timefrom" => $lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s'),
		"comment" => (integer)$_POST['turbovgid']
	);

	if(!LONG_ACTION_SERVICE) {
		$struct['timeto'] = $struct['timefrom'];
	}
	else {
		$struct['timeto'] = '9999-12-31 23:59:59';
	}

	if( false == ($result = $lanbilling->save("insupdClientUsboxService", $struct, ((integer)$struct['servid'] > 0) ? false : true, array("getVgroupServices")))) {
		echo "({ success: false })";
	}
	else {
		// Retrieve data after save action
		$staff = getUSBoxCategories($lanbilling);

		if(!empty($staff['shape'])) {
			foreach($staff['shape'] as $item) {
				if($item['vgid'] == (integer)$_POST['turbovgid']) {
					$vg = $item;
					break;
				}
			}
		}

		echo '({ "success": true, "reason": ' . (($_POST['common'] == 0) ? $lanbilling->JEncode($lanbilling->localize->get("Request completed successfully"), $lanbilling) : '""') . ', results: ' . $lanbilling->JEncode($vg) . ' })';
	}
} // end setCurrentTurbo()


/**
 * Stop current service
 * @param	object, billing class
 */
function stopCurrentTurbo( &$lanbilling )
{
	if((integer)$_POST['servid'] > 0) {
		if(!ALLOW_STOP_SERVICE || !LONG_ACTION_SERVICE) {
			echo '({ "success": false, "reason": ' . $lanbilling->JEncode($lanbilling->localize->get("Это действие не разрешено администратором")) . ' })';
			return false;
		}
	}

	$struct = array(
		"id" => $_POST['servid'],
		"timeto" => $lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s')
	);

	if( false == ($result = $lanbilling->get("stopUsboxService", $struct, false, array("getVgroupServices")))) {
		echo "({ success: false })";
	}
	else {
		echo '({ "success": true, "reason": ' . $lanbilling->JEncode($lanbilling->localize->compile("<%@ Request completed successfully %><br>В данный момент идет обработка, услуга будет остановленна в ближайшее время"), $lanbilling) . ' })';
	}
} // end stopCurrentTurbo()


/**
 * Returns short data
 * @param	array, services
 */
function prepareServices( $data = array())
{
	$_tmp = array();

	array_walk($data, create_function('$item, $key, $_tmp', '
		array_push($_tmp[0], array_intersect_key($item, array(
			"catidx" => "", "descr" => "", "above" => "", "symbol" => "", "tarid" => "", "vgid" => "", "common" => ""
		)));
	'), array( &$_tmp ));

	return $_tmp;
}


/**
 * Get current turbo-records for this client
 * @param	object, billing class
 * @param	array, data that was build from the vgroup request
 */
function getCurrentTurbo( &$lanbilling, &$staff )
{
	echo '({ results: ' . $lanbilling->JEncode($staff['shape'], $lanbilling) . ' })';
} // end getCurrentTurbo()
?>