/**
 * JavaSript engine to control billing settings
 *
 * Repository information:
 * @date		$Date: 2013-12-03 17:03:54 +0400 (Вт., 03 дек. 2013) $
 * @revision	$Revision: 39881 $
 */


Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load payments classes list

showPClasses('_pclasses');
});


/**
 * Show panel with payment classes list
 * @param	string, element to render to
 */
function showPClasses( renderTo )
{
	if(!Ext.get(renderTo)) {
		return false;
	}

	var Remove = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('Remove'),
		dataIndex: 'classid',
		width: 65
	});

    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

	new Ext.grid.EditorGridPanel({
		renderTo: renderTo,
		id: 'payclasses',
		width: 430,
		height: 170,
		title: Ext.app.Localize.get('Classes of payments'),
		removed: [],
		tbar: [{
			xtype: 'button',
			iconCls: 'ext-save',
			text: Ext.app.Localize.get('Save'),
			handler: function(A) {
				if (Ext.isElement(A)) {
					this.ownerCt.ownerCt.store.each(function(I, idx){
						if (I.data.classid < 0 || I.dirty) {
							createHidOrUpdate(this.form.id, 'setpclass[' + idx + '][classid]', I.data.classid);
							createHidOrUpdate(this.form.id, 'setpclass[' + idx + '][classname]', I.data.classname);
							createHidOrUpdate(this.form.id, 'setpclass[' + idx + '][descr]', I.data.descr);
                            createHidOrUpdate(this.form.id, 'setpclass[' + idx + '][externcode]', I.data.externcode);
						}
					}, { form: A });

					Ext.each(this.ownerCt.ownerCt.removed, function(I, idx){
						createHidOrUpdate(this.form, 'delpclass[]', I.data.classid);
					}, { form : A });
				}
				else {
					var items = [{
						xtype: 'hidden',
						name: 'async_call',
						value: 1
					}, {
						xtype: 'hidden',
						name: 'devision',
						value: 331
					}];

					this.ownerCt.ownerCt.store.each(function(I, idx){
						if (I.data.classid < 0 || I.dirty) {
							items.push({
								xtype: 'hidden',
								name: 'setpclass[' + idx + '][classid]',
								value: I.data.classid
							});

							items.push({
								xtype: 'hidden',
								name: 'setpclass[' + idx + '][classname]',
								value: I.data.classname
							});

							items.push({
								xtype: 'hidden',
								name: 'setpclass[' + idx + '][descr]',
								value: I.data.descr
							});

							items.push({
								xtype: 'hidden',
								name: 'setpclass[' + idx + '][externcode]',
								value: I.data.externcode
							});
						}
					}, items);

					Ext.each(this.ownerCt.ownerCt.removed, function(I, idx){
						items.push({
							xtype: 'hidden',
							name: 'delpclass[]',
							value: I.data.classid
						});
					}, items);

					this.ownerCt.ownerCt.removed = [];

					var form = new Ext.form.FormPanel({
						frame: false,
						url: 'config.php',
						items: items,
						renderTo: Ext.getBody()
					});

					form.getForm().submit({
						method:'POST',
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						scope: this.ownerCt.ownerCt.store,
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							this.reload();
						},
						failure: function(form, action){
							var O = Ext.util.JSON.decode(action.response.responseText);
							if(!Ext.isArray(O.reason)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
									this.reload()
								}.createDelegate(this));
							}
							else {
								try {
									var store = new Ext.data.ArrayStore({
										autoDestroy: true,
										idIndex: 0,
										data: O.reason,
										fields: [
                                            { name: 'classname', type: 'string' },
                                            { name: 'descr', type: 'string' },
                                            { name: 'reason', type: 'string' },
                                            { name: 'externcode', type: 'string' }
                                        ]
									});

									new Ext.Window({
										modal: true,
										title: Ext.app.Localize.get('Error'),
										items: [{
											xtype: 'grid',
											store: store,
											height: 200,
											width: 600,
											autoExpandColumn: 'nonedelreason',
											cm: new Ext.grid.ColumnModel({
												columns: [{
													header: Ext.app.Localize.get('Login'),
													dataIndex: 'classname',
													width: 140
												}, {
													header: Ext.app.Localize.get('Tarif'),
													dataIndex: 'descr',
													width: 200
												}, {
													header: Ext.app.Localize.get('Reason'),
													dataIndex: 'reason',
													id: 'nonedelreason'
												}],
												defaults: {
													sortable: true,
													menuDisabled: true
												}
											})
										}],
										listeners: {
											close: function(){
												this.reload()
											}.createDelegate(this)
										}
									}).show();
								}
								catch(e) { }
							}
						}
					});
				}
			}
		}, {
			xtype: 'button',
			iconCls: 'ext-add',
			text: Ext.app.Localize.get('Add'),
			handler: function(){
				this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
					classid: -1,
					remove: 0,
					classname: Ext.app.Localize.get('New'),
					descr: Ext.app.Localize.get('Description'),
                    externcode: Ext.app.Localize.get('')
				}));
			}
		}, {
			xtype: 'button',
			iconCls: 'ext-remove',
			text: Ext.app.Localize.get('Remove'),
			handler: function() {
				var S = this.ownerCt.ownerCt.getSelectionModel().getSelections();
				Ext.each(S, function(I){
					if(I.data.classid < 0) {
						this.store.remove(I);
					}
					else if(I.data.classid > 0) {
						this.removed.push(I);
						this.store.remove(I);
					}
				}, this.ownerCt.ownerCt);
			}
		}],
		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST',
				timeout: 380000
			}),
			reader: new Ext.data.JsonReader({
				root: 'results'
			}, [
				{ name: 'classid', type: 'int' },
				{ name: 'classname', type: 'string' },
				{ name: 'descr', type: 'string' },
                { name: 'externcode', type: 'string' },
				{ name: 'remove', type: 'int' }
			]),
			baseParams:{
				async_call: 1,
				devision: 331,
				getpayclass: 1
			},
			sortInfo: {
				field: 'classname',
				direction: "ASC"
			},
			autoLoad: true
		}),
		clicksToEdit: 1,
		loadMask: true,
		sm: sm,
		autoExpandColumn: 'descrcol',
		cm: new Ext.grid.ColumnModel({
			columns: [sm, {
				header: Ext.app.Localize.get('Name'),
				dataIndex: 'classname',
				editor: new Ext.form.TextField({
					allowBlank: false
				}),
				width: 120
			}, {
				header: Ext.app.Localize.get('Description'),
				dataIndex: 'descr',
				id: 'descrcol',
				editor: new Ext.form.TextField({
					allowBlank: false
				})
			},{
				header: Ext.app.Localize.get('Externcode'),
				dataIndex: 'externcode',
				id: 'externcode',
				editor: new Ext.form.TextField({
					allowBlank: false
				})
			}],
			defaults: {
				menuDisabled: true
			}
		})
	});
} // end showPClasses()



//function selectCyberplatAgrm(grid, renderId, User, UserId, UserForm) {
function selectCyberplatAgrm(el) {
	if(!Ext.isDefined(el)) {
		return false;
	}
	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}
	selectAgreements({
		title: Ext.app.Localize.get('Cyberplat common agreement'),
		sm: true,
		callbackok: function(ret){
			record = ret.getSelectionModel().getSelected();
			try {
				//createHidOrUpdate('_Settings', 'cyberplat_common_agreement', record.data.agrmid);
				document.getElementById('cyberplat_common_agreement').value = record.data.agrmid;
				el.dom.innerHTML = record.data.number;
				return true;
			} catch(e) {
				return false;
			}
		}
	});
	return true;
}

function selectUprsAgrm(el) {
	if(!Ext.isDefined(el)) {
		return false;
	}
	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}
	selectAgreements({
		title: Ext.app.Localize.get('Agreement'),
		sm: true,
		callbackok: function(ret){
			record = ret.getSelectionModel().getSelected();
			try {
				document.getElementById('uprs_common_agreement').value = record.data.agrmid;
				el.dom.innerHTML = record.data.number;
				return true;
			} catch(e) {
				return false;
			}
		}
	});
	return true;
}

/**
 * Show date picker to change date
 * @param	id or object element
 */
function LockPeriodPicker(el)
{
	if(!Ext.isDefined(el)) {
		return false;
	}

	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}

	new Ext.menu.DateMenu({
		listeners: {
			select: {
				fn: function(picker, date) {
					createHidOrUpdate('_Settings', 'lock_period', date.format('Y-m-d'));
					this.dom.innerHTML = date.format('Y-m-d');
				},
				scope: el
			}
		}
	}).showAt([el.box.x, el.box.y + el.box.height]);
} // end LockPeriodPicker()


function LockPeriod() {
	
	Ext.Ajax.request({
        url: 'config.php',
        scope: this,
        success: function(response){
        	
        	var data = Ext.util.JSON.decode(response.responseText);
			if(!Ext.isEmpty(data.result)) {
				var date = data.result.split('-');
			}
			
        	new Ext.Window({
				title: Ext.app.Localize.get('Locked period'),
				width: 290,
				height: 100,
				layout: 'fit',
				modal: true,
				items: [{
					xtype: 'form',
					fileUpload: true,
					url: 'index.php',
					frame: true,
					buttonAlign: 'center',
					monitorValid: true,
					buttons: [{
						formBind: true,
						text: Ext.app.Localize.get('OK'),
						handler: function(Btn){
							var form = Btn.findParentByType('form');
							
							form.getForm().submit({
								method: 'POST',
								timeout: 380000,
								url: 'config.php',
								scope: {
									form: form
								},
								waitTitle: Ext.app.Localize.get('Connecting'), 
								waitMsg: Ext.app.Localize.get('Sending data') + '...',
								success: function(form, response) {
									try {
										var data = Ext.util.JSON.decode(response.response.responseText);
										
									}
									catch(e) {
										Ext.Msg.error(e);
									}
									this.form.findParentByType('window').close();
								},
								failure: function(form, response) {
									var data = Ext.util.JSON.decode(response.response.responseText);
									if (!Ext.isDefined(data['authorize'])) {
										Ext.Msg.error(Ext.app.Localize.get(data.errors.reason));
									}
									this.form.findParentByType('window').close();
								}
							});
						}
					}],
					defaults: {
						xtype: 'hidden',
						anchor: '100%'
					},
					items: [{
						name: 'async_call',
						value: 1
					}, {
						name: 'devision',
						value: 331
					}, {
						name: 'closeperiod',
						value: 1
					}, {
						xtype: 'container',
						layout: 'hbox',
						fieldLabel: Ext.app.Localize.get('Close period on'),
						items: [{
							xtype: 'combo',
							hiddenName: 'closemonth',
							mode: 'local',
							displayField: 'name',
							valueField: 'value',
							triggerAction: 'all',
							allowBlank: false,
							width: 90,
							qtip: Ext.app.Localize.get('Month'),
							store: {
								xtype: 'arraystore',
								fields: ['id', 'value', 'name'],
								data: [
									[0, '01', Ext.app.Localize.get('January')],
									[1, '02', Ext.app.Localize.get('February')],
									[2, '03', Ext.app.Localize.get('March')],
									[3, '04', Ext.app.Localize.get('April')],
									[4, '05', Ext.app.Localize.get('May')],
									[5, '06', Ext.app.Localize.get('June')],
									[6, '07', Ext.app.Localize.get('July')],
									[7, '08', Ext.app.Localize.get('August')],
									[8, '09', Ext.app.Localize.get('September')],
									[9, '10', Ext.app.Localize.get('October')],
									[10, '11', Ext.app.Localize.get('November')],
									[11, '12', Ext.app.Localize.get('December')]
								]
							},
							listeners: {
								afterrender: function(combo){
									var d = Date.parseDate(data.result, "Y-m-d");
									var newD = new Date( new Date(d).setMonth(d.getMonth()-1) );
									combo.setValue(newD.format('m'));		
								}
							},
						}, {
							xtype: 'tbspacer',
							width: 5
						}, {
							xtype: 'combo',
							hiddenName: 'closeyear',
							mode: 'local',
							displayField: 'name',
							valueField: 'name',
							triggerAction: 'all',
							allowBlank: false,
							width: 60,
							qtip: Ext.app.Localize.get('Year'),
							store: {
								xtype: 'arraystore',
								fields: ['id', 'name'],
								data: [
									[0, '2012'],[1, '2013'],[2, '2014'],[3, '2015'],[4, '2016'],[5, '2017'],
									[6, '2018'],[7, '2019'],[8, '2020'],[9, '2021'],[10, '2022'],[11, '2023']
								]
							},
							listeners: {
								afterrender: function(combo){
									var d = Date.parseDate(data.result, "Y-m-d");
									var newD = new Date(new Date(d).setMonth(d.getMonth()-1));
									combo.setValue(newD.format('Y'));							
								}
							},
						}]	
					}]
				}]
			}).show();
        },
        params: { async_call: 1, devision: 331, getcloseddate: 1 }
    });
	
}


function dbOptionsFields(element, ifFocus)
{
	if(!element) return;
	if(isNaN(element.value) || element.value == "") element.value = 0;
	if(ifFocus == 1)
	{
		if(element.value == 0) element.value = Ext.app.Localize.get('always');

        if(element.value < 32) element.value = 32;
	}
}

function ActivationAsk(act_do)
{
	var isrecordIn = '{ISACTIVATED}';
   if(act_do == 1)
   {
	document.getElementById('a1').style.display='none';
	document.getElementById('a5').style.display='none';
	document.getElementById('_ReActivation').style.display='none';
	document.getElementById('a2').style.display='';
	document.getElementById('a6').style.display='';
	document.getElementById('_SendActivation').style.display='';
	document.getElementById('_CancelActivation').style.display='';
	document.getElementById('a8').style.display='';

      if(isrecordIn > 0) alert('<%@ THere is license key %>');
   }
   else if(act_do == 2)
   {
	document.getElementById('a1').style.display='';
	document.getElementById('a5').style.display='';
	document.getElementById('_ReActivation').style.display='';
	document.getElementById('a2').style.display='none';
	document.getElementById('a6').style.display='none';
	document.getElementById('_SendActivation').style.display='none';
	document.getElementById('_CancelActivation').style.display='none';
	document.getElementById('a8').style.display='none';
	
   }
}

function getDefaultOperator(form)
{
	document.getElementsByName('liccomp')[0].value = document.getElementsByName('defaultopname')[0].value;
}



function showSalesHelp(){
	var feedWin;
	if(!feedWin){
		feedWin = new Ext.Window({
			width: 400,
			title: Ext.app.Localize.get('available templates'),
			buttonAlign: 'right',
			items:[
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Person full name') + ': %fio',
					style: '',
					hideLabel: false
				},
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Agreement') + ': %agrm',
					style: '',
					hideLabel: false
				},
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Address') + ': %addr',
					style: '',
					hideLabel: false
				},
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Balance') + ': %balance',
					style: '',
					hideLabel: false
				},
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Credit') + ': %credit',
					style: '',
					hideLabel: false
				},
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('User login') + ': %ulogin',
					style: '',
					hideLabel: false
				}
			],
			buttons:[{ text: Ext.app.Localize.get('Close'), handler: function(){ feedWin.close();}}]
		});
	}
  feedWin.show();
}


/**
 * Show address picker to change default address
 * @param	id or object element
 */
function DefaultAddrPicker(el)
{
	if(!Ext.isDefined(el)) {
		return false;
	}

	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}

    apply = function(A, B){
		try {
            //B.items.items[0].body.dom.innerHTML = '<p class="address-block">' + A.get(A.clear) + '</p>';
            Ext.get(B.getId() + '-hid').dom.value = A.get(A.code);
            Ext.get(B.getId() + '-str').dom.value = A.get(A.full);
        }
        catch (e) {
            alert(e.toString())
        }
    }

	address(apply, {
		code: '0,0,0,0,0,0,0,0,0,0', // postcode
		string: ',,,,,,,,'
	}, this)/*.showAt([el.box.x, el.box.y + el.box.height])*/;

	//new Ext.menu.DateMenu({
	//	listeners: {
	//		select: {
	//			fn: function(picker, date) {
	//				createHidOrUpdate('_Settings', 'lock_period', date.format('Y-m-d'));
	//				this.dom.innerHTML = date.format('Y-m-d');
	//			},
	//			scope: el
	//		}
	//	}
	//}).showAt([el.box.x, el.box.y + el.box.height]);
} // end LockPeriodPicker()
