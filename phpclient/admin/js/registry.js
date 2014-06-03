/**
 * Registry functions
 */

Ext.onReady(function() {
    Ext.QuickTips.init();
	showAgentsList('registryList');
});

    function showAgentsList( renderTo )
    {
        PPAGELIMIT = 100;

        if(!document.getElementById(renderTo)) return;

		var addManual = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Add registry manually'),
			dataIndex: 'recordid',
			width: 22,
			iconCls: 'ext-add-manual'
		});
		var addFromFile = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Upload registry'),
			dataIndex: 'recordid',
			width: 22,
			iconCls: 'ext-add-many'
		});

		addManual.on('action', function(g, r, i) {
			g.hide();
			addUpdateRegistry(renderTo, {'uid':r.data.uid,'name':r.data.name}, 1);
            Ext.getCmp('agentsRegistry').destroy();
		});
		addFromFile.on('action', function(g, r, i) {
			g.hide();
			addUpdateRegistry(renderTo, {'uid':r.data.uid,'name':r.data.name}, 2);
   			Ext.getCmp('agentsRegistry').destroy();
		});


		var showPayments = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('View payments'),
			width: 22,
			iconCls: 'ext-table'
		});
		showPayments.on('action', function(g, r, i) {
            paymentsList(r.data.registryid);
		});
		
		var reloadRegistry = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Reload registry'),
			width: 22,
			dataIndex: 'recordid',
			iconCls: 'ext-add-many'
		});
		reloadRegistry.on('action', function(g, r, i) {
			g.hide(); 
			addUpdateRegistry(renderTo, {'uid':g.agentinfo.uid,'name':g.agentinfo.name, 'regdata': r.data}, 3); 
            Ext.getCmp('agentsRegistry').destroy();
		});
		
		/**
		 * Хранилище истории реестров
		 */
		var RStore = new Ext.data.Store({
			id: 'registryAgentHistoryStore',
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
			reader: new Ext.data.JsonReader(
				{root: 'results', idProperty: "id"},
				[
					{ name: 'registryid',          type: 'int' },
					{ name: 'agrmid',              type: 'int'},
					{ name: 'code',                type: 'string'},
					{ name: 'paydate',             type: 'string'},
                    { name: 'receipt',             type: 'string'},
                    { name: 'amount',              type: 'string'},
                    { name: 'amountagency',        type: 'string'},
                    { name: 'paymentid',           type: 'string'},
                    { name: 'bankaccountagency',   type: 'string'},
                    { name: 'bankaccountoperator', type: 'string'},
                    { name: 'amountpayment',       type: 'string'},
                    { name: 'status',              type: 'int'},
                    { name: 'modperson',           type: 'int'} 
				]
			),
			autoLoad: false,
			baseParams: {
                async_call: 1,
                devision: 21,
                getRegistry: 0
            }
		});

		new Ext.Panel({
			renderTo: renderTo,
			id: 'agentsRegistry',
			frame: true,
			width: 915,
			height: 800,
			items: [
				{
					xtype: 'grid',
					title: Ext.app.Localize.get('Payments registries') + '.' + Ext.app.Localize.get('Agents list'),
					id: 'registryListGrid',
					//width: 915,
					height: 300,
					enableHdMenu: false,
					disableSelection: true,
					loadMask: true,
					autoExpandColumn: 'name',
					view: new Ext.grid.GridView({
						forceFit:false,
						enableRowBody:true,
						enableNoGroups: false,
						deferEmptyText: false,
						emptyText:Ext.app.Localize.get('There is no commercial agents')
					}),
					cm: new Ext.grid.ColumnModel({
						columns: [
							{ header: Ext.app.Localize.get('#'),           dataIndex: 'uid', width: 35    },
							{ header: Ext.app.Localize.get('Login'),       dataIndex: 'login', width: 200 },
							{ header: Ext.app.Localize.get('Name'),        dataIndex: 'name', id: 'name'  },
							{ header: Ext.app.Localize.get('Description'), dataIndex: 'descr', width: 300 },
							addManual,
							addFromFile
						],
						defaults: {
							sortable: true,
							menuDisabled: true
						}
					}),
					plugins: [addManual, addFromFile],
					store: new Ext.data.Store({
						id: 'registryAgentFormStore',
						proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
						reader: new Ext.data.JsonReader(
							{root: 'results', idProperty: "id"},
							[
								{ name: 'uid',   type: 'int' },
								{ name: 'login', type: 'string'},
								{ name: 'name',  type: 'string'},
								{ name: 'descr', type: 'string'}
							]
						),
						autoLoad: true,
						baseParams: { async_call: 1, devision: 21, getAgentAccounts: 1 }
					}),
					listeners: {
						rowclick: function(grid, rowIndex, e) {
							var store = Ext.getCmp('agentRegHist').getStore(),
								tbar = this.ownerCt.find('id', 'agentRegHist')[0].getTopToolbar();
							
							Ext.getCmp('agentRegHist').agentinfo = grid.getStore().getAt(rowIndex).data;
							store.removeAll();
							store.setBaseParam('datefrom', tbar.find('id', 'PFROM')[0].getValue().format('Y-m-d'));
                            store.setBaseParam('datetill', tbar.find('id', 'PTILL')[0].getValue().format('Y-m-d'));
                            store.setBaseParam('getRegistry', grid.getStore().getAt(rowIndex).data.uid);
							store.load();
						}
					}
				},
				{
					xtype: 'grid',
					title: Ext.app.Localize.get('Registry history'),
					id: 'agentRegHist',
					//width: 915,
					height: 480,
					enableHdMenu: false,
					disableSelection: true,
					loadMask: true,
					autoExpandColumn: '_receipt',
					tbar: [Ext.app.Localize.get('Since') + ':&nbsp;', {
						xtype: 'datefield',
						id: 'PFROM',
						allowBlank: false,
						format: 'Y-m-d',
						value: new Date().format('Y-m-01')
					}, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
						xtype: 'datefield',
						id: 'PTILL',
						allowBlank: false,
						format: 'Y-m-d',
						value: new Date().add(Date.MONTH, 1).format('Y-m-01')
					}, '&nbsp;', {
						xtype: 'button',
						iconCls: 'ext-search',
						handler: function(){
							if (RStore.baseParams.getRegistry != 0){
                                if (RStore.baseParams.start_date != '') {
                                    RStore.baseParams.datefrom = this.ownerCt.find('id', 'PFROM')[0].getValue().format('Y-m-d');
                                    RStore.baseParams.datetill = this.ownerCt.find('id', 'PTILL')[0].getValue().format('Y-m-d');
                                    RStore.removeAll();
                                    RStore.reload({
                                        params: {
                                            start: 0,
                                            limit: 100
                                        }
                                    })
                                }
                            }else{
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Agent is undefined'));
                            }
						}
					}],
                    /*
                    * @field status Статус реестра
                    * 0 − реестр успешно сопоставлен с агентским платежом и все абонентские платежи реестра зачислены на лицевые счета абонентов ;
                    * 1 − ошибка сопоставления ( реестр не сопоставлен с платежом или имеются несоответствия суммы реестра и платежа ) ;
                    * 2 − ошибка распределения ( один или несколько абонентских платежа реестра имеют ошибки распределения ) .
                    */
                    view: new Ext.grid.GridView({
                        forceFit:false,
                        enableRowBody:true,
                        enableNoGroups: true,
                        deferEmptyText: false,
                        emptyText:Ext.app.Localize.get('Agent is not selected or there is no uploaded registries on this period'),
                        getRowClass: function(record, index) {
                            if (record.get('status') == 1){
                                return 'x-type-payment-canceled';
                            }
                            else if (record.get('status') == 2) {
                                return 'x-type-payment-corrected';
                            }
                            else {
                                return '';
                            }
                        }
                    }),
                    bbar: new Ext.PagingToolbar({
                        pageSize: PPAGELIMIT,
                        store: RStore,
                        displayInfo: true,
                        items: ['-', {
                            xtype: 'combo',
                            width: 70,
                            displayField: 'id',
                            valueField: 'id',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            value: PPAGELIMIT,
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
                                    PPAGELIMIT = this.getValue();
                                    this.ownerCt.pageSize = PPAGELIMIT;
                                    RStore.reload({ params: { limit: PPAGELIMIT } });
                                }
                            }
                        },
                        '-',
                        {
                            xtype: 'displayfield',
                            value: Ext.app.Localize.get('Compare error'),
                            hideLabel: true,
                            style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                            ctCls: 'x-type-payment-canceled'
                        },
                        '-',
                        {
                            xtype: 'displayfield',
                            value: Ext.app.Localize.get('Error of determination'),
                            hideLabel: true,
                            style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                            ctCls: 'x-type-payment-corrected'
                        }
                        ]
                    }),
					cm: new Ext.grid.ColumnModel({
						columns: [
							{ header: Ext.app.Localize.get('#'),                        dataIndex: 'registryid', width: 35 },
                            { header: Ext.app.Localize.get('Date'),                     dataIndex: 'paydate', id: 'paydate', width: 80  },
                            { 
                            	header: Ext.app.Localize.get('Receipt'),
                            	dataIndex: 'receipt', 
                            	id: '_receipt',  
                            	width: 180
                            },
							{ 
                            	header: Ext.app.Localize.get('Sum'),                    
                            	dataIndex: 'amount', 
                            	width: 80,
                            	align:'right',
                            	style: 'text-align:left',
                            	renderer: function(value) {
                            		var str = Ext.util.Format.number(value, '0,000.00');
                                    return str.split(',').join(' ');
                                }
                            },
                            { header: Ext.app.Localize.get('E of comission'),           dataIndex: 'amountagency', width: 80},
                            { header: Ext.app.Localize.get('Outcoming settlement account'),            dataIndex: 'bankaccountagency'},
                            { header: Ext.app.Localize.get('Incoming settlement account'),          dataIndex: 'bankaccountoperator'},
                            { header: Ext.app.Localize.get('E of agent payment'), dataIndex: 'amountpayment'},
                            showPayments,
                            reloadRegistry
						],
						defaults: {
							sortable: true,
							menuDisabled: true
						}
					}),
                    plugins: [showPayments, reloadRegistry],
					store: RStore
				}
			]
		});


		var paymentsList = function( regid ){
			var feedWin;
			if(!feedWin){
				feedWin = new Ext.Window({
					width: 1000,
                    height: 600,
                    layout:'fit',
					title: Ext.app.Localize.get('Payments registry'),
					buttonAlign: 'right',
					items:[{
						xtype: 'grid',
						renderTo: renderTo,
						id: 'regPayHistGrid',
						name: 'regPayHistGrid',
                        layout:'fit',
						enableHdMenu: false,
						disableSelection: true,
						loadMask: true,
						autoExpandColumn: '_number',
						view: new Ext.grid.GridView({
							forceFit:false,
							enableRowBody:true,
							enableNoGroups: true,
							deferEmptyText: false,
							emptyText:Ext.app.Localize.get('Payments undefined'),
							getRowClass: function(record, index) {
                                if (record.get('status') == 1)
                                    return 'x-type-payment-canceled';
                                else if (record.get('status') == 2)
                                    return 'x-type-payment-corrected';
                                else
                                    return '';
							}
						}),

                        bbar: new Ext.Toolbar({
                            displayInfo: true,
                            items: [
                            {
                                xtype: 'displayfield',
                                value: Ext.app.Localize.get('Agreement undefined'),
                                hideLabel: true,
                                style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                                ctCls: 'x-type-payment-canceled'
                            },
                            '-',
                            {
                                xtype: 'displayfield',
                                value: Ext.app.Localize.get('Duplicate'),
                                hideLabel: true,
                                style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                                ctCls: 'x-type-payment-corrected'
                            }
                            ]
                        }),

						cm: new Ext.grid.ColumnModel({
							columns: [
                                { header: Ext.app.Localize.get('#'),                     dataIndex: 'recordid', id: '_recordid', width: 30},
                                { header: Ext.app.Localize.get('Agreement number'),        dataIndex: 'number', id: '_number'},
                                { 
                                	header: Ext.app.Localize.get('Payment number'),         
                                	dataIndex: 'receipt',
                            		renderer: function(value, meta, record){
										if(Ext.isEmpty(record.get('paymentordernumber'))) {
											return value;
										}
										return record.get('paymentordernumber');
									}
                                },
                                { header: Ext.app.Localize.get('Payment date'),          dataIndex: 'paydate', id: 'paydate', width: 130, renderer: function(value){try {return value.format('Y-m-d')}catch(e){}return value;}   },
                                { header: Ext.app.Localize.get('Payment sum'),         dataIndex: 'amount'},
                                { header: Ext.app.Localize.get('Invoice number'), dataIndex: 'ordernum', width: 160},
                                { header: Ext.app.Localize.get('Comment'), dataIndex: 'comment'}
							],
							defaults: {
								sortable: true,
								menuDisabled: true
							}
						}),
						store: new Ext.data.Store({
							id: 'regPayHistStore',
							name: 'regPayHistStore',
							proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
							reader: new Ext.data.JsonReader({root: 'results', idProperty: "recordid"},
								[
									{ name: 'recordid', type: 'int'    },
									{ name: 'number',   type: 'string' },
									{ name: 'paydate',  type: 'string' },
									{ name: 'amount',   type: 'float'  },
									{ name: 'receipt',  type: 'string' },
									{ name: 'ordernum', type: 'string' },
									{ name: 'paymentid',type: 'int'    },
                                    { name: 'localdate',type: 'string' },
									{ name: 'status',   type: 'int'    },
									{ name: 'more',   	type: 'string'    },
									{ name: 'comment',  type: 'string'    },
									{ name: 'paymentordernumber',  type: 'string'    }
								]
							),
							autoLoad: false,
							baseParams: { async_call: 1, devision: 21, getRegPayments: regid }
						})
					}],
					buttons:[
						{
							text: Ext.app.Localize.get('Close'),
							handler: function(){
								feedWin.close();
							}
						}
					]
				});
				Ext.getCmp('regPayHistGrid').getStore().load();
			}
		  feedWin.show();
		}


    }


	/**
	 * @param renderTo
	 * @param manager
	 * @param type (1-manual; 2-from file)
	 */
	function addUpdateRegistry( renderTo, manager, type )
	{
		var PAGELIMIT = 100;
		var CANPAY = false;

		if (type == 1) {
			formTitle = Ext.app.Localize.get('Add registry manually for manager') + ' ' + manager.name;
			$topPan = '';
		} else if(type == 2) {
			formTitle = Ext.app.Localize.get('Upload registry for manager') + ' ' + manager.name;
			$topPan = '';
		} else {
			formTitle = Ext.app.Localize.get('Upload registry for manager') + ' ' + manager.name + ' (' + Ext.app.Localize.get('Reload registry') + ')';
			$topPan = '';			
		}

		var Edit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit'), dataIndex: 'recordid', width: 22, iconCls: 'ext-table' });
		var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), dataIndex: 'recordid', width: 22, iconCls: 'ext-drop' });
		var DividePayment = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Divide payment'), dataIndex: 'recordid', width: 22, iconCls: 'ext-calendar' });
		var ShowDetails = new Ext.grid.RowButton({ 
			header: '&nbsp;', 
			qtip: Ext.app.Localize.get('Detalization'), 
			dataIndex: 'recordid', 
			width: 22, 
			iconCls: 'ext-text' 
		}); 
		var SelectAgreement = new Ext.grid.RowButton({ 
			header: '&nbsp;', 
			qtip: Ext.app.Localize.get('Choose agreement'), 
			dataIndex: 'recordid', 
			width: 22, 
			iconCls: 'ext-agreement' 
		}); 
		Edit.on('action', function(g, r, i) {
			addUserPayment({Store: Ext.getCmp('registryPaymentsGrid').getStore(), localPayment: r});
		});
		Remove.on('action', function(g, r, i) {
			var paydate = Ext.isPrimitive(r.get('pay_date')) ? r.get('pay_date') :  r.get('pay_date').format('d.m.Y'),
				paynumber = !Ext.isEmpty(r.get('paymentordernumber')) ? r.get('paymentordernumber') : r.get('recipe');
			
			var paymentInfo = Ext.app.Localize.get('Agreement number') + ': ' + r.get('agrm') + '<br/>'
				+ Ext.app.Localize.get('Payment number') + ': ' + paynumber + '<br/>'
				+ Ext.app.Localize.get('Payment date') + ': ' + paydate + '<br/>'
				+ Ext.app.Localize.get('Payment summary') + ': ' + r.get('pay_sum');
			
			Ext.MessageBox.show({
				title:  Ext.app.Localize.get('Do You really want to remove this payment'),
				msg: paymentInfo,
				width:400,				
				buttons: Ext.MessageBox.OKCANCEL,
	            fn: function( btn ){
	                if (btn == 'cancel') {
	                	return;
	                }
	                var amountField = g.ownerCt.getForm().findField('searchPaymentSum');
	                amountField.setValue(amountField.getValue() - r.get('pay_sum'));
	                g.getStore().remove(r);
	            }
			});
		});
		ShowDetails.on('action', function(g, r, i) { 
			var msg = Ext.isEmpty(r.get('more')) ? Ext.app.Localize.get('No data') : r.get('more');
			msg = msg.split("\\n").join("</br>");
			Ext.MessageBox.show({
				title: Ext.app.Localize.get('TransferInfo'),
				msg: msg,
				width:400,				
				buttons: Ext.MessageBox.OK,
			});
		});
		DividePayment.on('action', function(g, r, i) { 
			showDividePaymentForm({
				record: r,
				grid: g,
				index: i
			});
		});
		
		SelectAgreement.on('action', function(g, r, i) {
			selectAgreements({
                sm: true,
                searchTypeValue: 1,
                filter: {},
                showusername: 1,
                callbackok: function(grid) {
             
                    var record = grid.getSelectionModel().getSelected();
                    r.set('agrm', record.get('number'));
                    
                }.createDelegate(r)
            });
		});


		new Ext.Panel({
			renderTo: renderTo,
			id: 'addUpdateRegistry',
			title: formTitle,
			frame: true,
			width: 915,
			height:750,
            layout:'fit',
            border: false,
            minHeight: 750,
			items: [
			{
				xtype: 'form',
				frame: false,
				url: 'config.php',
				id: 'registryForm',
				labelWidth: 130,
				style:'border-width:0;',
				tbar: [
					{
						xtype: 'button',
						text: Ext.app.Localize.get('Add records from file'),
						id: 'loadCSV',
						name: 'loadCSV',
						iconCls: 'ext-upcsv',
						handler: function(){
							uploadRegistryCSV({
								manager: manager,
								Store: Ext.getCmp('registryPaymentsGrid').getStore()
							})
						},
                        listeners: {
                            render: function(){
								if (type == 1 || type == 3) this.disable();
							}
						}
					},
					{
						xtype: 'button',
						text: Ext.app.Localize.get('Add payment'),
						id: 'addPayment',
						name: 'addPayment',
						iconCls: 'ext-add',
						disabled: true,
						handler: function(){
							addUserPayment({Store: Ext.getCmp('registryPaymentsGrid').getStore()});
						},
                        listeners: {
                            render: function(){
								if (type == 2) this.disable();
							}
						}
					},
					{
						xtype: 'button',
						text: Ext.app.Localize.get('Registry check'),
						id: 'registryControl',
						name: 'registryControl',
						iconCls: 'ext-edit',
						disabled: true,
						handler: function(){

							regArray = new Array();
							regPaymentsArray = new Array();
							paymentData = Ext.getCmp('registryForm').getForm().getValues();
							paymentData.payments = [];
							Ext.getCmp('registryPaymentsGrid').getStore().each(function(rec){
								
								this.payments.push(rec.data);
							},paymentData)
							
							Ext.Ajax.request({
								
								timeout: 380000,
								url: 'config.php',
								method: 'POST',
								params: {
									devision: 21,
									async_call: 1,
									registryControl: manager.uid,
									payments: Ext.util.JSON.encode(paymentData)
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
											try {
                                                Ext.each(data.result.payments, function(item, idx){
                                                        this.getAt(idx).set('status',item.status);
                                                        this.getAt(idx).set('username',item.username); 
                                                        this.getAt(idx).set('more',item.more); 
                                                    }, Ext.getCmp('registryPaymentsGrid').getStore()
                                                );
                                                /**
                                                 * Активируем кнопку проведения реестра
                                                 * ВАЖНО: в хранилище платежей стоит ее деактивация после обновления
                                                 */
                                                Ext.getCmp('commitPayments').enable();
											}
											catch(e) { console.log(e) }
										}else{
											Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(data.errors.reason.detail));
										}
									}
								  return false;
								}
							});
						}
					},
					{
						xtype: 'button',
						text: Ext.app.Localize.get('Make a registry'),
						id: 'commitPayments',
						name: 'commitPayments',
						iconCls: 'ext-save',
						disabled: (type == 3) ? false : true,
						repassage: (type == 3) ? true : false,
						handler: function(){

							regArray = new Array();
							regPaymentsArray = new Array();
							paymentData = Ext.getCmp('registryForm').getForm().getValues();
							paymentData.payments = [];
							Ext.getCmp('registryPaymentsGrid').getStore().each(function(rec){
								this.payments.push(rec.data);
							},paymentData)
							
							var params = {
								devision: 21,
								async_call: 1,
								saveRegistry: manager.uid,
								payments: Ext.util.JSON.encode(paymentData)
							}
							
							if (this.repassage) {
								params['repassage'] = 1;
								params['registryid'] = this.registryid;
							}

							Ext.Ajax.request({
								timeout: 380000,
								url: 'config.php',
								method: 'POST',
								params: params,
								scope: {
									load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
								},
								callback: function(opt, success, res) {
									this.load.hide();
									if(!success) {
										Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
										//return false;
									}
									if (Ext.isDefined(res['responseText'])) {
										var data = Ext.util.JSON.decode(res.responseText);
										if ( data.success ){
											try {
                                                if (data.result >= 0){
                                                    Ext.Msg.alert(Ext.app.Localize.get('Upload registry'), Ext.app.Localize.get('Request done successfully'));
                                                    var F = Ext.getCmp('addUpdateRegistry');
                                                    F.hide();
                                                    showAgentsList(F.initialConfig.renderTo);
                                                    F.destroy();
                                                }
											}
											catch(e) { console.log(e) }
										}else{
											Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason.detail);
										}
									}
								  return false;
								}
							});
						}
					},
					'->',
					{
						xtype: 'button',
						text: '',
						iconCls: 'ext-levelup',
						handler: function () {
							var F = Ext.getCmp('addUpdateRegistry');
							F.hide();
							showAgentsList(F.initialConfig.renderTo);
							F.destroy();
						}
					}
				],
				items: [
                    { xtype: 'hidden', id: 'payment_id', name: 'payment_id', value: 0 },
					{
						xtype: 'displayfield',
						id: 'payTip',
						value: Ext.app.Localize.get('Choose a payment'),
						hidden: (type == 1) ? false : true,
						style: 'font-weight:normal;color:red;'
					},
                    {
                        xtype: 'compositefield',
                        id: 'compositebso',
                        fieldLabel: Ext.app.Localize.get('Payment'),
                        msgTarget : 'side',
                        items: [
							{
                                xtype: 'textfield',
                                id: 'searchPaymentDate',
                                name: 'searchPaymentDate',
                                value: '',
                                width: 130,
                                readOnly: true,
                                allowBlank: true
                            },
                            {
                                xtype: 'textfield',
                                id: 'searchPaymentSum',
                                name: 'searchPaymentSum',
                                value: '',
                                width: 60,
                                readOnly: true,
                                allowBlank: true
                            },
                            {
                                xtype: 'textfield',
                                id: 'searchPaymentRecipe',
                                name: 'searchPaymentRecipe',
                                value: '',
                                width: 160,
                                readOnly: true,
								allowBlank: true
                            },
                            {
                                xtype: 'button',
                                id: 'searchPaymentBtn',
                                iconCls: 'ext-search',
                                hideLabel: true,
                                width: 22,
                                handler: function(){
									getRegistryPayments( manager.uid, type);
                                }
                            }
                        ],
                        listeners: {
                            render: function(){
                                // @param type (1-manual; 2-from file)
								if (type == 2 || type == 3){
                                    ////Ext.getCmp('searchPaymentBtn').getEl().up('.x-form-item').setDisplayed(false);
									Ext.getCmp('searchPaymentBtn').disable();
									//Ext.getCmp('searchPaymentDate').disable();
									//Ext.getCmp('searchPaymentSum').disable();
									//Ext.getCmp('searchPaymentRecipe').disable();
								}
								if (type == 3) {
									Ext.getCmp('payment_id').setValue(manager.regdata.paymentid);
									Ext.getCmp('searchPaymentSum').setValue(manager.regdata.amount);
									Ext.getCmp('searchPaymentDate').setValue(manager.regdata.paydate);
									Ext.getCmp('searchPaymentRecipe').setValue(manager.regdata.receipt);
									Ext.getCmp('commitPayments').registryid = manager.regdata.registryid;
									loadPreviousRegistryPayments(manager.regdata.registryid);
								}
                            }
                        }
                    },
					{
						xtype: 'textfield',
						value: '',
						width: 50,
						style: 'font-weight:bold;',
						fieldLabel: Ext.app.Localize.get('Organization code'),
						allowBlank: true,
						formBind: true,
						id: 'divisionCode',
						readOnly: ((type==2)?true:false)
					},
					{
						xtype: 'grid',
						title: Ext.app.Localize.get('Payments registry'),
						renderTo: renderTo,
						id: 'registryPaymentsGrid',
						name: 'registryPaymentsGrid',
						height: 600,
                        layout:'fit',
						enableHdMenu: false,
						disableSelection: true,
						loadMask: true,
						autoExpandColumn: '_agrm',
						view: new Ext.grid.GridView({
							forceFit:false,
							enableRowBody:true,
							enableNoGroups: true,
							deferEmptyText: false,
							emptyText:Ext.app.Localize.get('Payments undefined'),
							getRowClass: function(record, index) {
                                if (record.get('status') == 1)
                                    return 'x-type-payment-canceled';
                                else if (record.get('status') == 2 && type!=3)
                                    return 'x-type-payment-corrected';
                                else
                                    return '';
							}
						}),

                        bbar: new Ext.Toolbar({
                            displayInfo: true,
                            items: [
                            {
                                xtype: 'displayfield',
                                value: Ext.app.Localize.get('Agreement undefined'),
                                hideLabel: true,
                                style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                                ctCls: 'x-type-payment-canceled'
                            },
                            '-',
                            {
                                xtype: 'displayfield',
                                value: Ext.app.Localize.get('Duplicate'),
                                hideLabel: true,
                                style: 'font-weight:bold;padding:3px;border:1px solid gray;',
                                ctCls: 'x-type-payment-corrected'
                            }
                            ]
                        }),

						cm: new Ext.grid.ColumnModel({
							columns: [],
							defaults: {
								sortable: true,
								menuDisabled: true
							}
						}),
						plugins: [Edit, Remove, ShowDetails, SelectAgreement, DividePayment],
						store: new Ext.data.Store({
							id: 'registryPaymentsStore',
							name: 'registryPaymentsStore',
							proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
							reader: new Ext.data.JsonReader({root: 'results', idProperty: "id"},
								[
									{ name: 'agrmid',   type: 'int'    },
									{ name: 'agrm',     type: 'string' },
									{ name: 'recipe',   type: 'string' },
									{ name: 'pay_date', type: 'string' },
									{ name: 'pay_sum',  type: 'float'  },
									{ name: 'order',    type: 'string' },
									{ name: 'order_id', type: 'int'    },
									{ name: 'status',   type: 'int'    },
									{ name: 'username', type: 'string'    }, 
									{ name: 'more',   	type: 'string'    } , 
									{ name: 'comment',  type: 'string'    }, 
									{ name: 'recordid',  type: 'int'    }, 
									{ name: 'paymentordernumber',  type: 'string'    }
								]
							),
							autoLoad: false,
							baseParams: { async_call: 1, devision: 21, registrycontrol: 1 },
							listeners: {
								remove: function(){
									Ext.getCmp('commitPayments').disable();
                                    if (this.getCount() == 0){
										Ext.getCmp('registryControl').disable();
									}
								},
								update: function(store){
									Ext.getCmp('commitPayments').disable();
                                    if (this.getCount() == 0){
										Ext.getCmp('registryControl').disable();
									}
								},
								add: function(){
                                    Ext.getCmp('commitPayments').disable();
									if (this.getCount() > 0){
										if (type == 2) Ext.getCmp('commitPayments').enable();
										Ext.getCmp('registryControl').enable();
									}
								}
							}
						}),
						listeners: {
							beforerender: function(grid){
								columns = [
						           	SelectAgreement,           
									{ header: Ext.app.Localize.get('Agreement number'),        dataIndex: 'agrm', id: '_agrm'},
									{ 
										header: Ext.app.Localize.get('Payment number'),         
										dataIndex: 'recipe',
										renderer: function(value, meta, record){
											if(Ext.isEmpty(record.get('paymentordernumber'))) {
												return value;
											}
											return record.get('paymentordernumber');
										}
									},
									{ header: Ext.app.Localize.get('Payment date'),          dataIndex: 'pay_date', id: 'pay_date', width: 130, renderer: function(value){try {return value.format('Y-m-d')}catch(e){}return value;}   },
									{ 
										header: Ext.app.Localize.get('Payment summary'),         
										dataIndex: 'pay_sum',
										align:'right',
		                            	style: 'text-align:left',
		                            	renderer: function(value) {
		                            		var str = Ext.util.Format.number(value, '0,000.00');
		                                    return str.split(',').join(' ');
		                                }
									},
									{ header: Ext.app.Localize.get('Invoice number'), dataIndex: 'order', width: 160},
									{ header: Ext.app.Localize.get('Full name'), dataIndex: 'username', width: 160}, 
									{ header: Ext.app.Localize.get('Comment'), dataIndex: 'comment'},
									ShowDetails 
								];
								if (type == 1){ columns.push(Edit, Remove); }
								
								if (type == 2){ 
									columns.push(DividePayment, Remove);
								}
								grid.getColumnModel().setConfig( columns );
							}
						}
					}
				]
			}
			]
		});
		
		function showDividePaymentForm(A){
			
			var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), dataIndex: 'recordid', width: 22, iconCls: 'ext-drop' });
			Remove.on('action', function(g, r, i) {
				var balance = g.ownerCt.get(0).getForm().findField('balance');
				balance.setValue(balance.getValue() + r.get('amount'));
				g.getStore().remove(r);
			});
			var SelectAgreement = new Ext.grid.RowButton({ 
				header: '&nbsp;', 
				qtip: Ext.app.Localize.get('Choose agreement'), 
				dataIndex: 'recordid', 
				width: 22, 
				iconCls: 'ext-agreement' 
			}); 
			SelectAgreement.on('action', function(g, r, i) {
				selectAgreements({
	                sm: true,
	                searchTypeValue: 1,
	                filter: {},
	                showusername: 1,
	                callbackok: function(grid) {
	             
	                    var record = grid.getSelectionModel().getSelected();
	                    r.set('agrm', record.get('number'));
	                    
	                }.createDelegate(r)
	            });
			});
			
			new Ext.Window({ 
		        title: Ext.app.Localize.get('Divide payment'),
		        height: 560,
		        width: 370,
		        layout: 'anchor',
		        buttonAlign: 'center',
		        isNegativeBalance: function(){
		        	return (this.items.get(0).getForm().findField('balance').getValue() < 0) ? true : false;
		        },
		        buttons:[{
	                xtype: 'button',
	                text: Ext.app.Localize.get('Save'),
	                handler: function(Btn){
	                	var win = Btn.findParentByType('window');
	                	
	                	if(win.isNegativeBalance()){
	                		Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Negative balance is not allowed'));
	                		return false;
	                	}
	                	
	                		
	                	Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to divide payment'), function(Btn){
	                        if(Btn != 'yes') {
	                            return;
	                        }
	                        
	                        this.A.grid.store.removeAt(this.A.index);
	                        
	                        var payments = this.win.get(1).getStore().getRange();
	                        var comment = this.A.record.get('comment') + ' ' + Ext.app.Localize.get('Divided from payment') + ': ' + this.A.record.get('pay_sum') + ', ' + this.A.record.get('pay_date') + '. ' + CURRENTMANAGERNAME;
	                        for(var i = 0; i < payments.length; ++i){
	                        	if(0 == payments[i].get('amount')){
	                        		continue;
	                        	}
	                        	this.A.grid.store.insert(0, new this.A.grid.store.recordType({
	                        	 	'agrm':	payments[i].get('agrm'),
	                        	 	'more': this.A.record.get('more'),
	                        	 	'order': this.A.record.get('order'),
		                        	'pay_date': this.A.record.get('pay_date'),
			                        'pay_sum': payments[i].get('amount'),
				                    'recipe': this.A.record.get('recipe'),
					                'status': this.A.record.get('status'),
					                'paymentordernumber': this.A.record.get('paymentordernumber'),
					                'comment': comment
	                        	}));
	                        }
	                        
	                        if(0 != this.win.get(0).getForm().findField('balance').getValue()){
	                        	this.A.grid.store.insert(0, new this.A.grid.store.recordType({
	                        	 	'agrm':	this.A.record.get('agrm'),
	                        	 	'more': this.A.record.get('more'),
	                        	 	'order': this.A.record.get('order'),
		                        	'pay_date': this.A.record.get('pay_date'),
			                        'pay_sum': this.win.get(0).getForm().findField('balance').getValue(),
				                    'recipe': this.A.record.get('recipe'),
					                'status': this.A.record.get('status'),
					                'paymentordernumber': this.A.record.get('paymentordernumber'),
					                'comment': comment
	                        	}));
	                        }
	                        
	                        this.win.close();                        
	                	}, {
	                		A: A,
	                		win: win
	                	});
	                }
	            }],
		        items: [{
		        	xtype: 'form',
		        	url: 'config.php',
	                method: 'POST',
	                frame: true,
	                items: [{
                        xtype: 'textfield',
                        fieldLabel: Ext.app.Localize.get('Payment summary'),
                        name: 'amount',
                        readOnly: true,
                        cls: 'textfield-body-hide',
                        width: 150,
                        value: A.record.get('pay_sum') ? A.record.get('pay_sum') : 0,
                        editable: 'true'
                        
	                },{
                        xtype: 'numberfield',
                        fieldLabel: Ext.app.Localize.get('Residue'),
                        name: 'balance',
                        readOnly: true,
                        width: 150,
                        cls: 'textfield-body-hide',
                        value: A.record.get('pay_sum') ? A.record.get('pay_sum') : 0,
                        
	                }]	
		        },{
		            xtype: 'editorgrid',
		            clicksToEdit: 1,
		            anchor: '100% -63',
		            autoExpandColumn: 'auto_exp_col_agrm',
		            tbar: [{
	                    xtype: 'button',
	                    iconCls: 'ext-add',
	                    text: Ext.app.Localize.get('Add'),
	                    handler: function(){
	                        this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
	                            agrm: '',
	                            amount: 0
	                        }));
	                    }
	                }],
	                listeners: {
	                	'validateedit': function(d){
	                		var balance = d.grid.ownerCt.get(0).getForm().findField('balance');
	                		balance.setValue(balance.getValue() - d.value);
	                		if(d.originalValue){
	                			balance.setValue(balance.getValue() + d.originalValue);
	                		}       				
	                	}
	                },
		            plugins: [Remove, SelectAgreement],
		            columns: [SelectAgreement, {
		                header: Ext.app.Localize.get('Agreement'),
		                dataIndex: 'agrm',
		                id: 'auto_exp_col_agrm'
		            }, {
		                header: Ext.app.Localize.get('Payment summary'),
		                dataIndex: 'amount',
		                editable: true,
		                width: 110,
		                editor: new Ext.form.NumberField({allowNegative: false})
		            }, Remove],
		            store: {
		            	xtype: 'jsonstore',
	                    root: 'results',
	                    fields: ['id', 'agrm', 'amount'],
	                    autoLoad: false
		            }
		        }]			
			}).show();
		}
	}

	function addUserPayment(Object){

		isInsert = (typeof Object.localPayment == 'undefined') ? true : false;

		Store = Object.Store;
		if (!Ext.isEmpty(Ext.getCmp('winAddPayment'))) {
			return;
		}
		var addPayment = function(button){

			var form = button.findParentByType('form');

			if(!isInsert){
				Object.localPayment.set('agrm',     form.get('agrm').getValue());
				Object.localPayment.set('recipe',   form.get('recipe').getValue());
				Object.localPayment.set('pay_date', form.get('pay_date').getValue());
				Object.localPayment.set('pay_sum',  form.get('pay_sum').getValue());
				Object.localPayment.set('order',    form.get('order').getValue());
				Win.close();
			}else{

				Store.insert(0, new Store.recordType({
					agrm:     form.get('agrm').getValue(),
					recipe:   form.get('recipe').getValue(),
					pay_date: form.get('pay_date').getValue(),
					pay_sum:  form.get('pay_sum').getValue(),
					order:    form.get('order').getValue()
				}));

				//Ext.getCmp('commitPayments').enable();

				form.get('agrm').setValue('');
				form.get('recipe').setValue('');
				form.get('pay_sum').setValue('');
				form.get('order').setValue('');
			}

			//Win.close(); // Закрытие окошка добавления платежа

		}

		var Win = new Ext.Window({
			title: Ext.app.Localize.get('Add user payment'),
			id: 'winAddPayment',
			width: 355,
			resizable: false,
			items: {
				xtype: 'form',
				url: 'config.php',
				//width: 354,
				autoHeight: true,
				bodyStyle: 'padding: 3px 3px 0 3px;',
				labelWidth: 120,
				defaults: {
					anchor: '95%',
					allowBlank: false
				},
				frame: true,
				monitorValid : true,
				listeners: {
					'afterrender': function(){
						this.doLayout();
					}
				},
				tbar: [
                    {
                        xtype: 'button',
                        id: 'getFromScanner',
                        text: Ext.app.Localize.get('Set barcode'),
                        iconCls: 'ext-scanbarcode',
                        handler: function() {
                            Ext.getCmp('scancode').setVisible(true);
                            Ext.getCmp('scancode').focus();
                        }
                    },
                    {
                        fieldLabel: Ext.app.Localize.get('Barcode'),
                        xtype: 'textfield',
                        ref: 'defaultButton',
                        id: 'scancode',
                        name: 'orderid',
                        validateOnBlur: false,
                        width: 160,
                        labelStyle: 'font-weight:bold;',
                        readOnly: false,
                        hidden: true,
                        enableKeyEvents: true,
                        maxLength: 32,
                        autoCreate: {tag: 'input', type: 'text', size: '32', autocomplete: 'off', maxlength: '32'},
                        maskRe: new RegExp('[0-9]'),
                        validator: function(v){
                            var checkval = new RegExp('[0-9]');
                            if (checkval.test(new String(v)))
                              return true;
                            else
                              return false;
                        }
                    }
                ],
                items: [
                    {
						xtype: 'textfield',
						style: 'font-weight:bold;',
						fieldLabel: Ext.app.Localize.get('Agreement number'),
						allowBlank: false,
						formBind: true,
						id: 'agrm',
						value: ((isInsert)?'':Object.localPayment.data.agrm)
					},
					{
						xtype: 'textfield',
						style: 'font-weight:bold;',
						fieldLabel: Ext.app.Localize.get('Payment number'),
						allowBlank: true,
						formBind: true,
						id: 'recipe',
						value: ((isInsert)?'':Object.localPayment.data.recipe)
					},
					{
						xtype: 'textfield',
						style: 'font-weight:bold;',
						fieldLabel: Ext.app.Localize.get('Payment summary'),
						allowBlank: false,
						maskRe: new RegExp("[0-9\.]"),
						formBind: true,
						id: 'pay_sum',
						value: ((isInsert)?'':Object.localPayment.data.pay_sum)
					},
					{
						xtype: 'datefield',
						autoWidth: true,
						id: 'pay_date',
						name: 'pay_date',
						allowBlank: false,
						disabled: true,
						fieldLabel: Ext.app.Localize.get('Payment date'),
						format: 'Y-m-d',
						maskRe: new RegExp('[0-9\-]'),
						formBind: true,
						value: ((isInsert) ? new Date() : Object.localPayment.data.pay_date)
					},
					{
						xtype: 'textfield',
						style: 'font-weight:bold;',
						fieldLabel: Ext.app.Localize.get('Invoice number'),
						allowBlank: true,
						formBind: true,
						id: 'order',
						value: ((isInsert)?'':Object.localPayment.data.order)
					}

				],
				buttons: [{
					text: ((isInsert) ? Ext.app.Localize.get('Add') : Ext.app.Localize.get('Update')),
					formBind: true,
					iconCls: 'ext-add',
					handler: addPayment
				}, {
					text: Ext.app.Localize.get('Close'),
					handler: function(){
						Win.close();
					}
				}]
			}
		});
		Win.show();


        scanField = Ext.getCmp('scancode');
        scanField.on('valid', function() {
            Ext.Ajax.request({
				timeout: 380000,
                url: 'config.php',
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
                            Ext.getCmp('agrm').setValue(data.results['agrm']);
                            Ext.getCmp('pay_sum').setValue(data.results['sum']);
                            Ext.getCmp('order').setValue(data.results['order']);
                            scanField.setValue('');
                            scanField.hide();
                        }else{
                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                            scanField.setValue('');
                            scanField.hide();
                            Ext.getCmp('agrm').focus();
                        }
                    }
                  return false;
                },
                params: {
                    async_call: 1,
                    devision: 21,
                    makeManualData: scanField.getValue()
                }
            });
        });
        scanField.on('invalid', function() {
            scanField.addListener('blur', blurhandler, null, { delay: 500 });
        });
        function blurhandler() {
            scanField.focus();
        };



	}


	function uploadRegistryCSV( object )
	{
		if (!Ext.isEmpty(Ext.getCmp('winUpCsv'))) { return; }
		var formText = new Ext.Template('<div style="padding-bottom: 8px; color: red;">{text}</dv>');
		sendData = function(button){
			var form = button.findParentByType('form');
			if(Ext.isEmpty(Ext.getCmp('upcontent').getValue())) { return; }
			form.getForm().submit({
				method: 'POST',
				waitTitle: Ext.app.Localize.get('Connecting'),
				waitMsg: Ext.app.Localize.get('Sending data') + '...',
				success: function(form, action){
					var O = Ext.util.JSON.decode(action.response.responseText);
					payments = O.result.payments;
					if (payments.length > 0){
						Ext.getCmp('divisionCode').setValue(O.result.code);
						Ext.getCmp('searchPaymentRecipe').setValue(O.result.receipt);
						Ext.getCmp('searchPaymentSum').setValue(O.result.amount);
						Ext.getCmp('searchPaymentDate').setValue(O.result.paydate);
						object.Store.removeAll();
                        Ext.each(payments,function(record) {
							object.Store.insert(0, new object.Store.recordType({
								agrm:     record.number,
								recipe:   record.receipt,
								pay_date: record.paydate,
								pay_sum:  record.amount,
								order:    record.ordernum,
								status:   record.status,
								more:     record.more || '',
								comment:  record.comment || '',
								paymentordernumber:     record.paymentordernumber
							}));
						});
					}
					Ext.getCmp('searchPaymentBtn').enable();
					Ext.getCmp('registryControl').enable();
					Ext.getCmp('divisionCode').getEl().dom.removeAttribute('readOnly');
					Win.close();
				},
				failure: function(form, action){
                    if (action.failureType == 'server') {
						var O = Ext.util.JSON.decode(action.response.responseText);
						if (!Ext.isArray(O.reason)) {
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.errors.reason.detail);
						}
						else {
                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
						}
						Win.close();
					}
				}
			});
		}

		var Win = new Ext.Window({
			title: Ext.app.Localize.get('Upload file'),
			id: 'winUpCsv',
			width: 337,
			items: {
				xtype: 'form',
				url: 'config.php',
				width: 320,
				autoHeight: true,
				fileUpload: true,
				bodyStyle: 'padding: 3px 3px 0 3px;',
				labelWidth: 35,
				defaults: {
					anchor: '95%',
					allowBlank: false
				},
				frame: true,
				items: [
					{ xtype: 'hidden', name: 'devision',        value: 21 },
					{ xtype: 'hidden', name: 'async_call',      value: 1 },
					{ xtype: 'hidden', name: 'registryControl', value: object.manager.uid },
					{
						xtype: 'fileuploadfield',
						//emptyText: Ext.app.Localize.get('Select file'),
						allowBlank: false,
						fieldLabel: Ext.app.Localize.get('File'),
						name: 'upcontent',
						id: 'upcontent',
						buttonCfg: {
							text: '',
							iconCls: 'ext-upload'
						}
					}
				],
				buttons: [{
					text: Ext.app.Localize.get('Upload'),
					handler: sendData
				}, {
					text: Ext.app.Localize.get('Cancel'),
					handler: function(){
						Win.close();
					}
				}]
			}
		});
		Win.show();
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

function getRegistryPayments( managerId, type ){

	var feedWin;
	if(!feedWin){
        var PAGELIMIT = 100;
		var registryPaymentsStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
			reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
			[
				{ name: 'recordid',  type: 'int' 	},
				{ name: 'amount', 	 type: 'float' 	},
				{ name: 'date', 	 type: 'string' },
				{ name: 'recipe', 	 type: 'string' }
			]),
			autoLoad: true,
			baseParams: { async_call: 1, devision: 21, getregistrypayments: managerId, limit: PAGELIMIT, start: 0 }
		})
        var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:true, dataIndex: 'recordid' });
        feedWin = new Ext.Window({
            id: 'getRegPayWin',
			width: 550,
			title: Ext.app.Localize.get('Choose a payment'),
			buttonAlign: 'right',
            modal: true,
			items:[{
				xtype: 'grid',
				id: '_registryPayments',
				layout: 'fit',
				height: 300,
				store: registryPaymentsStore,
                autoExpandColumn: 'recipe',
                loadMask: true,
				sm: sm,
                cm: new Ext.grid.ColumnModel({
					defaults: {
						sortable: true,
						menuDisabled: true
					},
					columns: [
                        sm,
                        {
                            header: Ext.app.Localize.get('ID'),
                            dataIndex: 'recordid',
                            id: 'recordid',
                            width: 30
                        },
                        {
                            header: Ext.app.Localize.get('Amount'),
                            dataIndex: 'amount',
                            id: 'amount'
                        },
                        {
                            header: Ext.app.Localize.get('Date'),
                            dataIndex: 'date',
                            id: 'date',
							width: 145
                        },
                        {
                            header: Ext.app.Localize.get('Receipt'),
                            dataIndex: 'recipe',
                            id: 'recipe'
                        }
					]
				}),
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: registryPaymentsStore,
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
								['300'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								registryPaymentsStore.reload({ params: { limit: PAGELIMIT } });
							}
						}
					}]
				})
			}],
			buttons:[
                {
                    text: Ext.app.Localize.get('Choose'),
                    id: 'addRegPaymentBtn',
                    handler: function(){
                        grid = Ext.getCmp('_registryPayments');
                        if (Ext.isEmpty(grid.getSelectionModel().getSelected())) {
                            return false;
                        } else var record = grid.getSelectionModel().getSelected();
                        try {
                            Ext.getCmp('payment_id').setValue(record.data.recordid);
							Ext.getCmp('searchPaymentSum').setValue(record.data.amount);
							Ext.getCmp('searchPaymentDate').setValue(record.data.date);
							Ext.getCmp('searchPaymentRecipe').setValue(record.data.recipe);

							if (type == 1)
								Ext.getCmp('addPayment').enable();

							Ext.getCmp('commitPayments').disable();

							Ext.getCmp('payTip').hide();

                        } catch(e) {
                            return false;
                        }
                        feedWin.close();
                    }
                },
                { text: Ext.app.Localize.get('Cancel'), handler: function(){ feedWin.close();}}
            ]
		});
	}
	
  feedWin.show();
}



function loadPreviousRegistryPayments (registryid) {
	Ext.Ajax.request({
		url: 'config.php',
		method: 'POST',
		params: {
			devision: 21,
			async_call: 1,
			getRegPayments: registryid,
			unpassage: 1
		},
		scope: this,
		callback: function(opt, success, res) {
			if(!success) {
				return false;
			}
			if (Ext.isDefined(res['responseText'])) {
				var data = Ext.util.JSON.decode(res.responseText),
					payments = data.results,
					store = Ext.getCmp('registryPaymentsGrid').getStore();
				
                if (payments.length > 0){
                    store.removeAll();
                    Ext.each(payments,function(record) {
                    	
                    	if (record.paymentordernumber == "") {
                    		record.paymentordernumber = record.receipt;
                    		record.receipt = "";
                    	}
                    	
                        store.insert(0, new store.recordType({
                            agrm:    record.number,
                            recipe:  record.receipt,
                            pay_date: record.paydate,
                            pay_sum:  record.amount,
                            order:    record.ordernum,
                            status:  record.status,
                            more:    record.more || '',
                            comment:  record.comment || '',
                            recordid:  record.recordid,
                            paymentordernumber:    record.paymentordernumber
                        }));
                    });
                }
			}
		  return false;
		}
	});
}
