/**
 * BSO functions
 */

Ext.onReady(function() {
    Ext.QuickTips.init();
	showBSOList('bsoList');
});


    function showBSOList( renderTo )
    {
		if(!document.getElementById(renderTo)) return;
		if (!Ext.isEmpty(Ext.getCmp('bsoListGrid'))) {
			Ext.getCmp('bsoListGrid').show();
			Ext.getCmp('bsoListGrid').store.reload();
			return;
		}

		var Edit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit'), dataIndex: 'recordid', width: 22, iconCls: 'ext-table' });
		var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), dataIndex: 'recordid', width: 22, iconCls: 'ext-drop' });

		var Rows = Ext.data.Record.create([
			{ name: 'recordid',  type: 'int' },
			{ name: 'createdby', type: 'int' },
			{ name: 'number',    type: 'string' },
			{ name: 'created',   type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'mgrname',   type: 'string' },
			{ name: 'createdip', type: 'string'}
		]);

		var grid = new Ext.grid.GridPanel({
			title: Ext.app.Localize.get('Strict reporting forms'),
			renderTo: renderTo,
			id: 'bsoListGrid',
			width: 915,
			height: 600,
			enableHdMenu: false,
			disableSelection: true,
			loadMask: true,

			view: new Ext.grid.GridView({
				forceFit:false,
				enableRowBody:true,
				enableNoGroups: false,
				deferEmptyText: false,
				emptyText:Ext.app.Localize.get('There is no created BSO sets. Please create one.')
			}),
			tbar: [
				{
					xtype: 'button',
					id: 'bsoCreateBtn',
					text: Ext.app.Localize.get('Create new set'),
					iconCls: 'ext-add',
					handler: function() {
						var g = Ext.getCmp('bsoListGrid');
						g.hide();
						insUpdBso(g.initialConfig.renderTo, {'bsoSetId':-1})
					}
				}
			],
			cm: new Ext.grid.ColumnModel({
				columns: [
					Edit,
					{ header: Ext.app.Localize.get('Series'),           dataIndex: 'number',    width: 290, editor: new Ext.form.TextField({}) },
					{ header: Ext.app.Localize.get('Date of renovation'), dataIndex: 'created',   width: 150, renderer: function(value){try {return value.format('Y-m-d H:i:s')}catch(e){}return value;} },
					{ header: Ext.app.Localize.get('Manager name'),   dataIndex: 'mgrname',   width: 290 },
					{ header: Ext.app.Localize.get('Manager address'), dataIndex: 'createdip', width: 115 },
					Remove
				],
				defaults: {
					sortable: true,
					menuDisabled: true
				}
			}),
			plugins: [Edit, Remove],
			store: new Ext.data.Store({
				id: 'bsoFormStore',
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({root: 'results', idProperty: "id"},Rows),
				autoLoad: true,
				baseParams: { async_call: 1, devision: 18, getBsoSets: 1 }
			})
		});

			Ext.Ajax.request({
				url: 'config.php',
				success: function(a){
					var p = Ext.util.JSON.decode(a.responseText);
					if (p.result.bso < 2)
						Ext.getCmp('bsoCreateBtn').disable();
				},
				params: { devision: 13, async_call: 1, getRights: 1 }
			});


		Edit.on('action', function(g, r, i) {
			g.hide();
			insUpdBso(g.initialConfig.renderTo, {'bsoSetId': r.data.recordid,'bsoSetNumber': r.data.number})
		});
		Remove.on('action', function(g, r, i) {
			compactForm([
					{xtype: 'hidden',name: 'async_call',value: 1},
					{xtype: 'hidden',name: 'devision',  value: 18},
					{xtype: 'hidden',name: 'delBsoSet', value: r.data.recordid}
				],{
					grid: g,
					record: r,
					success: function() {
						this.grid.store.remove(this.record);
						Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
					}
				}
			);
		});
  }


	function insUpdBso( renderTo, bso )
	{
		var PAGELIMIT = 100;

		if (bso.bsoSetId == -1) {
			formTitle = Ext.app.Localize.get('New set of SRF');
		} else {
			formTitle = Ext.app.Localize.get('Strict reporting form') + ': ' + bso.bsoSetNumber;
		}

		var Store = new Ext.data.Store({
			id: 'bsoStore',
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
			reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
			[
				{ name: 'p_data', 	     type: 'array' },
				{ name: 'recordid', 	 type: 'int' },
				{ name: 'setid', 		 type: 'int' },
				{ name: 'createdby', 	 type: 'int' },
				{ name: 'updatedby', 	 type: 'int' },
				{ name: 'dirty',    	 type: 'int' },
				{ name: 'payid', 		 type: 'int' },
				{ name: 'number', 		 type: 'string' },
				{ name: 'receipt',  	 type: 'string' },
				{ name: 'created', 		 type: 'string' },
				{ name: 'updated', 		 type: 'string' },
				{ name: 'mgrnameins', 	 type: 'string' },
				{ name: 'mgrnameupd', 	 type: 'string' },
				{ name: 'createdip', 	 type: 'string' },
				{ name: 'createdipmask', type: 'int' },
				{ name: 'updatedip', 	 type: 'string' },
				{ name: 'updatedipmask', type: 'int' }
			]),
			autoLoad: false,
			baseParams: { async_call: 1, devision: 18, getBsoDocs: bso.bsoSetId, limit: PAGELIMIT, start: 0 },
			sortInfo: {
                field:          'number',
				direction:      'ASC'
			}
		})

		var generateBsoSet = function genBsoSet(setnumber, setid){
			if(!win){
				var win = new Ext.Window({
					width:420,
					height:220,
					title: Ext.app.Localize.get('Creating document set'),
					layout:'fit',
					frame: true,
					url: 'config.php',
					modal: true,
					id: 'bsoDocGenForm',
					labelAlign: 'top',
					items: [{
						xtype: 'form',
						formId: '_bsoGenDocForm',
						bodyStyle: {padding: '10px'},
						monitorValid : true,
						items:[
							{ xtype: 'hidden', name: 'async_call',  value: 1 },
							{ xtype: 'hidden', name: 'devision',    value: 18 },
							{ xtype: 'hidden', name: 'genBsoSetDoc',value: setid },
							{
								xtype:'fieldset',
								title: Ext.app.Localize.get('Creating documents for') + ' ' + setnumber,
								items:[
									{
										xtype: 'combo',
										width: 250,
										fieldLabel: Ext.app.Localize.get('Шаблон'),
										tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.genname + " - " + values.gentpl, 32)]}</div></tpl>',
										itemSelector: 'div.x-combo-list-item',
										triggerAction:'all',
										editable:false,
										forceSelection:true,
										valueField:'gentpl',
										displayField:'genname',
										hiddenName:'tplcombo',
										allowBlank: false,
										store: new Ext.data.Store({
											proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
											reader: new Ext.data.JsonReader( { root: 'results' }, [ { name: 'genname', type: 'string' }, { name: 'gentpl', type: 'string' } ]),
											autoLoad: true,
											baseParams: { async_call: 1, devision: 18, getTemplates: 1 }
										})
									},
									{
										xtype: 'textfield',
										value: '',
										width: 250,
										style: 'font-weight:bold;',
										fieldLabel: Ext.app.Localize.get('Starting number'),
										allowBlank: true,
										maskRe: new RegExp("[0-9]"),
										formBind: true,
										id: 'startDocs'
									},
                                    {
                                        xtype: 'datefield',
                                        autoWidth: true,
                                        id: 'bso_date',
                                        name: 'bso_date',
                                        allowBlank: false,
                                        editable: false,
                                        disabled: true,
                                        //readOnly: true,
                                        fieldLabel: Ext.app.Localize.get('Creation date'),
                                        format: 'Y-m-d',
                                        width: 200,
                                        value: new Date(),
                                        maskRe: new RegExp('[0-9\-]'),
                                        formBind: true
                                    },

									{
										xtype: 'textfield',
										value: 1,
										width: 250,
										style: 'font-weight:bold;',
										fieldLabel: Ext.app.Localize.get('Quantity'),
										allowBlank: false,
										maskRe: new RegExp("[0-9]"),
										formBind: true,
										id: 'amountDocs'
									}
								]
							}
						],
						buttons:[
							{
								text: 'Генерировать',
								formBind: true,
								iconCls: 'ext-table',
								id:'buttonOK',
								handler:function( v ){
									v.ownerCt.ownerCt.getForm().submit({url: 'config.php',method:'POST',scope: {form: v.ownerCt.ownerCt},
										waitTitle: Ext.app.Localize.get('Connecting'),
										waitMsg: Ext.app.Localize.get('Sending data') + '...',
										success: function(form, action){
											var data = eval(action.response.responseText);
											Store.reload();
											Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
											win.close();
										},
										failure: function(form, action){
											if(action.failureType == 'server') {
												var o = Ext.util.JSON.decode(action.response.responseText);
												Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.errors.reason);
											}
											win.close();
										}
									});
								}
							},
							{ text: Ext.app.Localize.get('Cancel'), handler: function(){ win.close(); } }
						]

					}]
				})
			}
			win.show();
		}


		var generateBsoOneDoc = function genBsoOneDoc(setnumber, setid){
			if(!fwin){
				var fwin = new Ext.Window({
					width:420,
					height:190,
					title: Ext.app.Localize.get('Creating document'),
					layout:'fit',
					frame: true,
					url: 'config.php',
					modal: true,
					id: 'bsoOneDocGenForm',
					labelAlign: 'top',
					items: [{
						xtype: 'form',
						formId: '_bsoGenOneDocForm',
						bodyStyle: {padding: '10px'},
						monitorValid : true,
						items:[
							{ xtype: 'hidden', name: 'async_call',  value: 1 },
							{ xtype: 'hidden', name: 'devision',    value: 18 },
							{ xtype: 'hidden', name: 'genBsoOneDoc',value: setid },
							{
								xtype:'fieldset',
								title: Ext.app.Localize.get('Serial number of SRF') + ' ' + setnumber,
								items:[
                                {
                                    xtype: 'datefield',
                                    autoWidth: true,
                                    id: 'bso_date',
                                    name: 'bso_date',
                                    allowBlank: false,
                                    readOnly: true,
                                    fieldLabel: Ext.app.Localize.get('Creation date'),
                                    format: 'Y-m-d',
                                    width: 200,
                                    value: new Date(),
                                    maskRe: new RegExp('[0-9\-]'),
                                    formBind: true
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'number',
                                    width: 200,
                                    fieldLabel: Ext.app.Localize.get('DocReceipt'),
                                    value: '',
                                    allowBlank: false
								}]
							}
						],
						buttons:[
							{
								text: Ext.app.Localize.get('Create'),
								formBind: true,
								iconCls: 'ext-table',
								id:'buttonOK',
								handler:function( v ){
									v.ownerCt.ownerCt.getForm().submit({url: 'config.php',method:'POST',scope: {form: v.ownerCt.ownerCt},
										waitTitle: Ext.app.Localize.get('Connecting'),
										waitMsg: Ext.app.Localize.get('Sending data') + '...',
										success: function(form, action){
											Store.reload();
											fwin.close();
										},
										failure: function(form, action){
											if(action.failureType == 'server') {
												var o = Ext.util.JSON.decode(action.response.responseText);
												Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.errors.reason);
											}
											fwin.close();
										}
									});
								}
							},
							{ text: Ext.app.Localize.get('Cancel'), handler: function(){ fwin.close(); } }
						]

					}]
				})
			}
			fwin.show();
		}

		var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:false, dataIndex: 'recordid' });

		var paymentsList = function( input ){
			var feedWin;
			var delBso = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Unbind SRF'), width: 22, iconCls: 'ext-remove', menuDisabled: true });
			delBso.on('action', function(g, r, i) {
				Ext.MessageBox.show({
					title: Ext.app.Localize.get('Unbind payment'),
					msg: Ext.app.Localize.get('Unbind payment SRF') + '?',
					width:400,
					buttons: Ext.MessageBox.OKCANCEL,
					multiline: false,
					fn: function( btn ){
						if (btn == 'cancel') return;
						Ext.Ajax.request({
							url: 'config.php',
							method: 'POST',
							params: {
								devision: 18,
								async_call: 1,
								cancelPayment: input.recordid,
								precordid: r.data.recordid
							},
							scope: {
								load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
							},
							callback: function(opt, success, res) {
								this.load.hide();
								if(!success) {
									Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
									return false;
								}
								if (Ext.isDefined(res['responseText'])) {
									var data = Ext.util.JSON.decode(res.responseText);
									if ( data.success ){
										Ext.getCmp('_paymentsList').store.removeAll();
										Ext.getCmp('_paymentsList').store.load();
										Ext.getCmp('bsoMainGrid').store.reload();

										Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Payment was unbound"));
									}else{
										Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
									}
								}
							  return false;
							}
						});
					}
				});
			});

			if(!feedWin){
				feedWin = new Ext.Window({
					width: 1000,
					title: Ext.app.Localize.get('Information about bound payments'),
					buttonAlign: 'right',
					modal: true,
					items:[{
						xtype: 'grid',
						id: '_paymentsList',
						autoExpandColumn: 'comment',
						layout: 'fit',
						height: 300,
						store: new Ext.data.Store({
							proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
							reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [
								{ name: 'recordid'  ,type: 'int'    },
								{ name: 'agrmid'    ,type: 'int'    },
								{ name: 'modperson' ,type: 'string' },
								{ name: 'amount'    ,type: 'float'  },
								{ name: 'agrm'      ,type: 'string' },
								{ name: 'uname'     ,type: 'string' },
								{ name: 'paydate'   ,type: 'date', dateFormat: 'Y-m-d H:i:s' },
								{ name: 'receipt'   ,type: 'string' },
								{ name: 'mgr'       ,type: 'string' },
								{ name: 'mgrdescr'  ,type: 'string' },
								{ name: 'comment'   ,type: 'string' }
							]),
							baseParams:{ async_call: 1, devision: 18, getBsoPayments: input.recordid },
							autoLoad: false // ATTENTION!
						}),
						cm: new Ext.grid.ColumnModel({
							columns: [
								{header: Ext.app.Localize.get('Pay date'), dataIndex: 'paydate', width: 135, renderer: function(value){try {return value.format('Y-m-d H:i:s')}catch(e){}return value;}},
								{header: Ext.app.Localize.get('Sum'), dataIndex: 'amount', width: 50 },
								{header: Ext.app.Localize.get('Receipt'), dataIndex: 'receipt', width: 150 },
								{header: Ext.app.Localize.get('Agreement'), dataIndex: 'agrm', width: 125 },
								{header: Ext.app.Localize.get('User'), dataIndex: 'uname', width: 150 },
								{
									header: Ext.app.Localize.get('Manager'),
									dataIndex: 'mgr',
									renderer: function(value, metaData, record){
										try {
											metaData.attr = 'ext:qtip="' + record.get('mgrdescr') + '"'
											return record.get('mgr');
										}
										catch(e) { return value; }
									}

								},
								{header: Ext.app.Localize.get('Comment'), dataIndex: 'comment', id: 'comment'},
								delBso
							]
						}),
						plugins: [delBso]
					}],
					buttons:[
						{
							text: Ext.app.Localize.get('Cancel'),
							handler: function(){
								feedWin.close();
							}
						}
					]
				});
				Ext.getCmp('_paymentsList').store.load();
			}
		  feedWin.show();
		}

		var bsoDocMenu = new Ext.menu.Menu({
			enableScrolling: false,
			items: [
				{
					text: Ext.app.Localize.get('Information about bound payments'),
					handler: function() {
						paymentsList(this.ownerCt.record.data);
					}
				},
				{
					text: Ext.app.Localize.get('Unbind payment'),
					handler: function() {
						var row_data = this.ownerCt.record.data;
						Ext.MessageBox.show({
							title: Ext.app.Localize.get('Unbind payment'),
							msg: Ext.app.Localize.get('Unbind payment SRF') + '?',
							width:400,
							buttons: Ext.MessageBox.OKCANCEL,
							multiline: false,
							fn: function( btn ){
								if (btn == 'cancel') return;
								Ext.Ajax.request({
									url: 'config.php',
									method: 'POST',
									params: {
										devision: 18,
										async_call: 1,
										cancelPayment: row_data.recordid
									},
									scope: {
										load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
									},
									callback: function(opt, success, res) {
										this.load.hide();
										if(!success) {
											Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
											return false;
										}
										if (Ext.isDefined(res['responseText'])) {
											var data = Ext.util.JSON.decode(res.responseText);
											if ( data.success ){
												Store.reload();
												Ext.Msg.alert(Ext.app.Localize.get('Info'), "Платеж успешно отвязан");
											}else{
												Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
											}
										}
									  return false;
									}
								});
							}
						});
					}
				},
				{
					text: Ext.app.Localize.get('Restore corrupted'),
					handler: function() {
						var row_data = this.ownerCt.record.data;
						Ext.MessageBox.show({
							title: Ext.app.Localize.get('Restore SRF'),
							msg: Ext.app.Localize.get('Restore corrupted SRF') + '?',
							width:400,
							buttons: Ext.MessageBox.OKCANCEL,
							multiline: false,
							fn: function( btn ){
								if (btn == 'cancel') return;
								Ext.Ajax.request({
									url: 'config.php',
									method: 'POST',
									params: {
										devision: 18,
										async_call: 1,
										markDocDirty: row_data.recordid,
										bsoSetId: row_data.setid,
										number: row_data.number,
										restore: 1
									},
									scope: {
										load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
									},
									callback: function(opt, success, res) {
										this.load.hide();
										if(!success) {
											Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
											return false;
										}
										if (Ext.isDefined(res['responseText'])) {
											var data = Ext.util.JSON.decode(res.responseText);
											if ( data.success ){
												Store.reload();
												Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("SRF was restored"));
											}else{
												Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
											}
										}
									  return false;
									}
								});
							}
						});
					}
				}
			],
			listeners: {
				beforeshow: function(menu) {
					menu.items.each(function(item, key){
						if ( this.ownerCt.record.data.p_data !== null ) {
							switch(key) {
								case 0: item.show(); break;
								default: item.hide();
							}
						}
						else if (this.ownerCt.record.data.dirty > 0){
							switch(key) {
								case 2: item.show(); break;
								default: item.hide();
							}
						}
					});
				}
			}
		});

		var DBso = new Ext.grid.RowButton({
			header: '&nbsp;',
			width: 22,
			menuDisabled: true,
			qtip: function(record,x,c){
				if ((record.data.dirty > 0) || (record.data.p_data !== null)){
					return '';
				} else {
					return 'Удалить';
				}
			},
			iconCls: function(record,x,c){
				if ((record.data.dirty > 0) || (record.data.p_data !== null)){
					return '';
				} else {
					return 'ext-drop';
				}
			}
		});
		DBso.on('action', function(g, r, i) {
			if ((r.data.dirty > 0) || (r.data.p_data !== null)){
				return '';
			} else {
				Ext.MessageBox.show({
					title: Ext.app.Localize.get('Removing SRF'),
					msg: Ext.app.Localize.get('Remove SRF') + '?',
					width:300,
					buttons: Ext.MessageBox.OKCANCEL,
					multiline: false,
					fn: function( btn ){
						if (btn == 'cancel') return;
							compactForm([
									{xtype: 'hidden',name: 'async_call',value: 1},
									{xtype: 'hidden',name: 'devision',  value: 18},
									{xtype: 'hidden',name: 'delBsoDoc', value: r.data.recordid}
								],{
									grid: g,
									record: r,
									success: function() {
										this.grid.store.remove(this.record);
										Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
									}
								}
							);
					}
				});
			}
		});

		/**
		 * menu button
		 */
		var PButton = new Ext.grid.RowButton({
			header: '&nbsp;',
			width: 22,
			menuDisabled: true,
			iconCls: function(record,x,c){
				if (record.data.p_data != null || record.data.dirty > 0)
					return 'ext-pedit';
				else return '';
			}
		});
		PButton.on('action', function(grid, record, rowIndex, e) {
			// TODO: add validation
			//if (record.data.p_data == null || record.data.dirty != 1) return;
			this.record = record;
			this.showAt(e.getXY());
		}.createDelegate( bsoDocMenu ));
		/**
		 * END menu button
		 */

		var Dirty = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: function(record){
				if (record.data.dirty == 0 && record.data.p_data == null)
					return Ext.app.Localize.get('Mark as corrupted');
				else return '';
			},
			dataIndex: 'recordid',
			width: 22,
			iconCls: function(record,x,c){
				if (record.data.dirty == 0 && record.data.p_data == null)
					return 'ext-remove';
				else return '';
			}
		});
		Dirty.on('action', function(g, r, i) {
			/**
			 * Если строка помечена как испорченная, то return
			 */
			if (r.data.dirty == 1 || r.data.p_data != null) return;

			Ext.MessageBox.show({
				title: Ext.app.Localize.get('Corrupted payment'),
				msg: Ext.app.Localize.get('Mark SRF as corrupted?'),
				width:300,
				buttons: Ext.MessageBox.OKCANCEL,
				multiline: false,
				fn: function( btn ){
					if (btn == 'cancel') return;
					compactForm([
							{xtype: 'hidden',name: 'async_call',value: 1},
							{xtype: 'hidden',name: 'devision',  value: 18},
							{xtype: 'hidden',name: 'markDocDirty', value: r.data.recordid},
							{xtype: 'hidden',name: 'bsoSetId', value: bso.bsoSetId},
							{xtype: 'hidden',name: 'number', value: r.data.number}
						],{
							grid: g,
							record: r,
							success: function() {
								this.grid.store.reload();  // remove(this.record);
								Ext.Msg.alert(Ext.app.Localize.get('Request done successfully'), Ext.app.Localize.get('Document was marked as corrupted'));
							}
						}
					);
				}
			});
		});


		Ext.Ajax.request({
			url: 'config.php',
			callback: function(opts, suss, resp){
				var result = Ext.util.JSON.decode(resp.responseText);
				return useBso = result.result.bso;
			},
			success: function(a){
				var p = Ext.util.JSON.decode(a.responseText);
				if (p.result.bso != 2){
					Ext.getCmp('saveBtn').disable();
					Ext.getCmp('bsoSetNumber').disable();
					Ext.getCmp('genBtn').disable();
					Ext.getCmp('addBtn').disable();
				}
			},
			params: { devision: 13, async_call: 1, getRights: 1 }
		});

		var text = new Ext.form.TextField({
			id: 'bsoDocumentNumber',
			value: '',
			width: 50,
			allowBlank: true,
			style: 'font-weight:bold;',
			renderTo: Ext.getBody()
		});

		new Ext.Panel({
			renderTo: renderTo,
			id: 'insUpdBsoPanel',
			title: formTitle,
			frame: true,
			width: 1015,
			height: 600,
			items: [
			{
				xtype: 'form',
				frame: false,
				url: 'config.php',
				labelWidth: 75,
				tbar: [
					{
						xtype: 'button',
						disabled: true,
						iconCls: 'ext-save',
						id: 'saveBtn',
						text: Ext.app.Localize.get('Save'),
						handler: function() {
							compactForm([
									{xtype: 'hidden',name: 'async_call',   value: 1 },
									{xtype: 'hidden',name: 'devision',     value: 18},
									{xtype: 'hidden',name: 'insupdBsoSet', value: bso.bsoSetId},
									{xtype: 'hidden',name: 'bsoSetNumber', value: Ext.getCmp('bsoSetNumber').getValue() }
								],{
									success: function(action) {
										var O = Ext.util.JSON.decode(action.response.responseText);
										this.bso.bsoSetId = O.insupdBsoSet;
										this.bso.bsoSetNumber = Ext.getCmp('bsoSetNumber').getValue();
										this.Store.baseParams.getBsoDocs = O.insupdBsoSet;
										Ext.getCmp('addBtn').enable();
										Ext.getCmp('genBtn').enable();
										Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
									}.createDelegate( {bso:bso, Store:Store })
								}
							);
						}
					},
					'-', Ext.app.Localize.get('Serial number of SRF') + ':&nbsp;',
					{
						xtype: 'textfield',
						id: 'bsoSetNumber',
						width: 180,
						value: (bso.bsoSetId == -1) ? Ext.app.Localize.get('Введите номер серии БСО') : bso.bsoSetNumber,
						initEvents: Ext.form.Field.prototype.initEvents,
						onFocus: Ext.form.Field.prototype.onFocus,
						enableKeyEvents: true,
						listeners: {
							afterrender: function(){
								this.getEl().on('keyup',function(el,e) {
									if (this.getValue() != Ext.app.Localize.get('Enter Serial number of SRF') && !Ext.isEmpty(this.getValue().split(' ').join('')) ){
										Ext.getCmp('saveBtn').enable();
										if (bso.bsoSetId != -1){
											Ext.getCmp('addBtn').enable();
											Ext.getCmp('genBtn').enable();
										}
									}else{
										Ext.getCmp('saveBtn').disable();
										Ext.getCmp('addBtn').disable();
										Ext.getCmp('genBtn').disable();
									}
								})
							},
							initialize: function(ed){
								Ext.EventManager.on(ed.getWin(), 'focus', ed.onFocus, ed);
								Ext.EventManager.on(ed.getWin(), 'blur', ed.onBlur, ed);
							},
							focus: function(){
								if (this.getValue() == Ext.app.Localize.get('Enter Serial number of SRF')) this.setValue('');
							},
							blur: function(){
								if(Ext.isEmpty(this.getValue().split(' ').join(''))) this.setValue(Ext.app.Localize.get('Enter Serial number of SRF'));
							}
						},
						renderTo: Ext.getBody()
					},
					'-', Ext.app.Localize.get('Document number') + ':&nbsp;',
					text,
					'&nbsp;',
					{
						xtype: 'button',
						id: 'searchBtn',
						renderTo: Ext.getBody(),
						iconCls: 'ext-search',
						listeners: {
							click: function() {
									Store.baseParams.getBsoDocs = bso.bsoSetId;
									Store.baseParams.number = text.getValue();
									Store.removeAll();
									Store.load();
								}
						}
					},
					'&nbsp;',
					{
						xtype: 'button',
						iconCls: 'ext-table',
						text: Ext.app.Localize.get('Create documents set'),
						id: 'genBtn',
						disabled: (bso.bsoSetId == -1) ? true : false,
						handler: function() {
							generateBsoSet(bso.bsoSetNumber, bso.bsoSetId);
						}
					},
					'&nbsp;',
					{
						xtype: 'button',
						iconCls: 'ext-add',
						text: Ext.app.Localize.get('Add document'),
						id: 'addBtn',
						disabled: (bso.bsoSetId == -1) ? true : false,
						handler: function() {
							generateBsoOneDoc(bso.bsoSetNumber, bso.bsoSetId);
						}
					},
					'->',
					{
						xtype: 'button',
						text: '',
						iconCls: 'ext-levelup',
						handler: function () {
							var F = Ext.getCmp('insUpdBsoPanel');
							F.hide();
							showBSOList(F.initialConfig.renderTo);
							F.destroy();
						}
					}
				],
				items: [
					{ xtype: 'hidden', name: 'async_call', value: 1 },
					{ xtype: 'hidden', name: 'devision', value: 18 },
					{ xtype: 'hidden', name: 'insUpdBso', value: bso.bsoSetId }
				]
			},
			{
				xtype: 'grid',
				id: 'bsoMainGrid',
				title: Ext.app.Localize.get('Ready documents'),
				height: 535,
				layout:'fit',
				loadMask: true,
				autoExpandColumn: 'number',
				store: Store,
				enableHdMenu: false,
				//disableSelection: true,
				viewConfig: {
					deferEmptyText: false,
					emptyText:Ext.app.Localize.get('There is no created forms. You can create new set or add single document'),
					getRowClass: function(record, index) {
						if (record.get('dirty') == 1)
							return 'x-type-payment-canceled'
						else if (record.get('p_data') != null)
							return 'x-type-payment-transfer'
						else
							return '';
					}
				},
				sm: sm,
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: Store,
					displayInfo: true,
					items: ['-', {
						xtype: 'combo',
						width: 70,
						displayField: 'id',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						value: PAGELIMIT,
						editable: false,
						store: new Ext.data.ArrayStore({
							data: [
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								Store.reload({ params: { limit: PAGELIMIT } });
							}
						}
					},
					'-',
					{
						xtype: 'displayfield',
						value: Ext.app.Localize.get('Corrupted'),
						hideLabel: true,
						style: 'padding:3px;border:1px solid gray;',
						ctCls: 'x-type-payment-canceled'
					},
					'-',
					{
						xtype: 'displayfield',
						value: Ext.app.Localize.get('Bound'),
						hideLabel: true,
						style: 'padding:3px;border:1px solid gray;',
						ctCls: 'x-type-payment-transfer'
					}

					]
				}),
				cm: new Ext.grid.ColumnModel({
					defaults: {
						sortable: true,
						menuDisabled: true
					},
					columns: [
						Dirty,
						{
							header: Ext.app.Localize.get('Number'),
							dataIndex: 'number',
							id: 'number',
							renderer: function(value, metaData, record) {
								try {
									if (record.data.dirty > 0){
										return value + ' (' + Ext.app.Localize.get('сorrupted') + ')';
									}else{
										return value;
									}
								}
								catch(e){ return value; }
							}
						}, {
							header: Ext.app.Localize.get('Created') + '/' + Ext.app.Localize.get('Updated'),
							dataIndex: 'mgrnameins',
							width: 180,
							renderer: function(value, metaData, record) {
								if (!Ext.isEmpty(record.get('updated'))){
									return record.get('mgrnameupd');
								}else{
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Bound payments'),
							dataIndex: 'p_data',
							width: 190,
							renderer: function(value, metaData, record) {
								i = [];
								Ext.each(value, function(itm){
										if (itm == null)
											r = "";
										else
											r = Ext.app.Localize.get('Agreement number') + ': ' + itm.agrm + '<br/>' + Ext.app.Localize.get('Payment summary') + ': ' + itm.amount + '<br/>' + Ext.app.Localize.get('Client') + ': ' + itm.uname + '<br/>' + Ext.app.Localize.get('Payment date') + ': ' + itm.paydate;
										this.push(r);
									},i
								)
								return i.join("<hr/>");
							}
						}, {
							header: Ext.app.Localize.get('Creation date'),
							dataIndex: 'created',
							width: 140,
							renderer: function(value, metaData, record) {
								if (Ext.isEmpty(value)){
									return (!Ext.isEmpty(record.get('created'))) ? record.get('created') : '-';
								}else{
									return value;
								}
							}
						},
						{
							header: Ext.app.Localize.get('Modified date'),
							dataIndex: 'updated',
							width: 140,
							renderer: function(value, metaData, record) {
								if (Ext.isEmpty(value)){
									return '-';
								}else{
									return value;
								}
							}
						},
						{
							header: Ext.app.Localize.get('IP'),
							dataIndex: 'updatedip',
							renderer: function(value, metaData, record) {
								if (value == '0.0.0.0'){
									return (record.get('createdip') != '0.0.0.0') ? record.get('createdip') : '-';
								}else{
									return value;
								}
							}
						},
						PButton,
						DBso
					]
				}),
				plugins: [Dirty,PButton,DBso]
			}]
		});

		if (bso.bsoSetId != -1) Store.load();
	}



	function compactForm(items, object) {
		if (Ext.isEmpty(items)) { return false; };
		var form = new Ext.form.FormPanel({
			id: 'compactForm',
			renderTo: Ext.getBody(),
			url: 'config.php',
			items: items
		});
		form.getForm().submit({
			method: 'POST',
			waitTitle: Ext.app.Localize.get('Connecting'),
			waitMsg: Ext.app.Localize.get('Sending data') + '...',
			success: function(form, action) {
				if (!Ext.isEmpty(object)) {
					try {
						object.success(action);
					} catch (e) {}
				};
				form.destroy();
			},
			failure: function(form, action) {
				if (action.failureType == 'server') {
					obj = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.errors.reason);
				}
				form.destroy();
			}
		})
		return true;
	}
