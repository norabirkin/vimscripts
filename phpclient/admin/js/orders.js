/**
 * JavaScript engine for the billing financial documents
 *
 */

Ext.onReady(function(){
	Ext.QuickTips.init();
	// Show orders list panel & render Scanning Panel
	showPanel('ordPanelPlace');
	showScanPanel('scanPanelPlace');
});


var WorkSpace = {
	getPanel: function(){
		if (Ext.isEmpty(this.panel)) {
			this.panel = Ext.getCmp('docPanel');
		}
		return this.panel;
	},
	getGrid: function(){
	    return this.getPanel().items.get(0)
	},
	filter: {
	    items: [],
	    joinParams: function(){
		var B = {};
		if (Ext.isEmpty(this.items)) {
		    this.items = WorkSpace.findPanelChild('all');
		}
		for (i = 0, off = this.items.length; i < off; i++) {
		    try {
			var G = this.isGroupItem(this.items[i].pid, this.items[i]);
			if (!Ext.isEmpty(G)) {
			    if (typeof G == 'object') {
				B[G.name] = G.value;
			    }
			}
			else {
			    B[this.items[i].pid] = this.items[i].getValue();
			}
			if (typeof B[this.items[i].pid] == 'object') {
			    B[this.items[i].pid] = B[this.items[i].pid].format('Y-m-d');
			}
		    }
		    catch (e) {
		    }
		}
		return B
	    },
	    isGroupItem: function(A, B){
		var C = new RegExp('^paidgroup_');
		if (C.test(A)) {
		    if (B.getValue() == true) {
			return {
			    name: 'paidgroup',
			    value: A.replace(C, '')
			}
		    }
		    else {
			return false
		    }
		}
		return null;
	    }
	},
	setFilterItem: function(A){
	    if (Ext.isEmpty(A)) {
		return;
	    };
	    for (var i in A) {
		if (i == A[i]) {
		    continue
		};
		if (A[i] == null) {
		    continue;
		};
		this.filter[i] = A[i]
	    }
	},
	findPanelChild: function(A, T){
	    if (Ext.isEmpty(A)) {
		return []
	    };
	    if (Ext.isEmpty(T) || typeof T != 'object' || T.length == 0) {
		T = ['hidden', 'combo', 'textfield', 'numberfield', 'radio', 'checkbox', 'datefield'];
	    }
	    if (typeof A != 'object') {
		var A = [A];
	    }
	    var B = this.getPanel().getTopToolbar().items.first();
	    var C = B.findBy(function(A){
		try {
		    if (this.types.indexOf(A.xtype) >= 0) {
			if (this.is(A.pid) || this.is(A.name)) {
			    return true
			}
		    }
		}
		catch (e) {
		};
		return false;
	    }, {
		name: A,
		types: T,
		is: function(A){
		    for (i = 0, off = this.name.length; i < off; i++) {
			if (this.name[i] == A || this.name[i] == 'all') {
			    return true
			}
		    }
		}
	    });
	    C['get'] = function(A){
		for (i = 0, off = this.length; i < off; i++) {
		    try {
			if (this[i].pid == A) {
			    return this[i];
			}
		    }
		    catch (e) {
			return null;
		    }
		}
		return null;
	    };
	    C['getIndex'] = function(A){
		for (i = 0, off = this.length; i < off; i++) {
		    try {
			if (this[i].pid == A) {
			    return i
			}
		    }
		    catch (e) {
			return null;
		    }
		}
		return null;
	    };
	    return C;
	},
	findPanelContainer: function(A){
	    return this.findPanelChild(A, ['container', 'button', 'fieldset'])
	},
	unCheckGroup: function(A){
	    var B = this.findPanelChild(A);
	    for (var i = 0, off = B.length; i < off; i++) {
		B[i].setValue(false);
	    }
	},
	load: function(){
	    var T = this.getGrid().store;
	    var B = this.filter.joinParams();
	    for (var i in B) {
			T.baseParams[i] = B[i];
	    };
		T.baseParams = this.advSearch(T.baseParams);
	    T.reload({
			params: {
			    start: 0,
			    limit: 100
			}
	    })
	},
	// Function to compose storage base parameters for server list filtering
	// @param	object of parameters from storage (usually [Storage].baseParams)
	// @param	boolean, if pass true to function than call storage load
	// @return	object with parameters and their values
	advSearch: function(a,r){
		var c = this.findPanelChild('advSearchList').get('advSearchList');
		var n = new RegExp('searchtpl','i');

		if(r == true){
			c.setValue('');
		}

		if(Ext.isEmpty(a)) {
			var a = {};
		}
		else {
			var s = {};
			for (var i in a) {
				if (!n.test(i)) {
					s[i] = a[i];
				}
			}
			a = s;
		}


		if(c.mainStore.find('tplname', c.getValue()) > -1) {
			c.mainStore.each(function(r,idx){
				if(r.data.tplname != this.tplname) {
					return;
				}
				for(var i in r.data) {
					if(i == 'tplname') {
						continue;
					}
					this.store['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
				}
			}, { store: a, tplname: c.getValue() });
		}

		return a;
	}
} // end WorkSpace object

function showInfoPanel( renderTo )
{
	var infoPanel = new Ext.Panel({
		title: Localize.DocDetailTitle,
		id: '_infoPanel',
		preventBodyReset: false,
		renderTo: renderTo,
		width: 600,
		height: 195,
	    listeners: {
        'afterlayout': {
            fn: function(p){
	                p.hide();
	            },
	            single: true // important, as many layouts can occur
        	}
    	}
	});
}

function showScanPanel( renderTo )
{
	var pbar = new Ext.ProgressBar({
	    id: 'scanningpbar',
	    width: 300,
	    style: 'padding: 5px; margin: 5px;'
	});

	var scanForm = new Ext.form.FormPanel({
		renderTo: renderTo,
		title: Localize.Scanning_title,
	    id: '_scanForm',
	    disabled: false,
	    header: true,
	    layout: 'table',
		defaults: {
		    height: 28
		},
		layoutConfig: { columns: 1 },
		plain: true,
		bodyStyle: 'padding: 0px;',
		frame: false,
		border: false,
		width: 960,
	    listeners: {
		        'afterrender': {
	            fn: function(p){
								   pbar.wait({
								        interval: 100,
								        duration:0,
								        increment: 99
								    });
	            },
	            single: true // important, as many layouts can occur
			    },
		        'afterlayout': {
		            fn: function(p){
		                p.hide();
		            },
		            single: true // important, as many layouts can occur
		        }
	    },
	    items: [{
		    xtype: 'container',
		    autoEl: 'div',
		    width: 960,
		    layout: 'column',
		    items: [{
						xtype: 'fieldset',
						border: false,
						labelWidth: 105,
						width: 310,
						style: 'padding: 2px; margin: 2px;',
						items: [{
									fieldLabel: Localize.DocumentID,
								    xtype: 'textfield',
								    ref: 'defaultButton',
								    id: 'doc_id',
								    name: 'orderid',
								    validateOnBlur: false,
								    width: 110,
								    labelStyle: 'font-weight:bold;',
								    readOnly: false,
								    enableKeyEvents: true,
									maxLength: 29,
									autoCreate: {tag: 'input', type: 'text', size: '29', autocomplete: 'off', maxlength: '29'},
					            	maskRe: new RegExp('[0-9]'),
					    		    validator: function(v){
										      var checkval = new RegExp('^[0-9]');
										      if (checkval.test(v)) return true;
										      else
										      return false;
									    }
								}]
		    		},{
						xtype: 'fieldset',
						border: false,
						labelWidth: 80,
						width: 210,
						style: 'padding: 2px; margin: 2px;',
						items: [{
									xtype: 'datefield',
								    fieldLabel: Localize.PaymentDate,
								    id: 'payment_date',
								    name: 'payment_date',
								    format: 'd/m/Y',
								    value: new Date(),
								    width: 110,
								    minValue: '1980-01-01',
								    maskRe: new RegExp('[0-9\-]')
								}]
		    		},{
						xtype: 'fieldset',
						border: false,
						labelWidth: 140,
						width: 280,
						style: 'padding: 2px; margin: 2px;',
						items: [{
									fieldLabel: Localize.PaymentOrder,
								    xtype: 'textfield',
								    id: 'recipt_no',
								    name: 'recipt_no',
								    validateOnBlur: false,
								    width: 120,
								    labelStyle: 'font-weight:bold;',
								    readOnly: false,
								    enableKeyEvents: true,
					            	// maskRe: new RegExp('[0-9]'),
					    		    validator: function(v){
										if(PayFormat.length > 0)
										{
										      var checkval = new RegExp(PayFormat);
										      if (checkval.test(v)) {
											  return true;
										      }
										      else
										      return Localize.WrongFormat;
										}
										else {
										      // Ext.getCmp('_payForm').stopMonitoring();
										      return true;
										}
								    }
								}
						        ]
				    	},{
						xtype: 'fieldset',
						border: false,
						labelWidth: 10,
						width: 50,
						style: 'padding: 0px; padding-left: 2px; margin-top: 5px',
						items: [{
									xtype: 'checkbox',
							        id: 'dontconfirm',
							        fieldLabel: '',
									    listeners: {
					                        check: function(A, B){
												if (this.getValue()== true)
												{
												//paymentfield.clearInvalid();
												paymentfield.disable();

												orderidfield.setValue('');
												orderidfield.focus();
												orderidfield.addListener('blur', blurhandler, null, { delay: 500 });
												}
												else
												{
												paymentfield.enable();
												}
					                        }
					                    }
								}]
		    			},{
							xtype: 'fieldset',
							style: 'padding: 0px; padding-left: 2px; margin-top: 3px',
							border: false,
							width: 85,
							items: [{
												xtype: 'button',
												text: Localize.CloseForm,
												iconCls: 'ext-scanbarcode',
												id: 'close-scan-form',
												style: 'marginLeft: 10px',
												handler: function(){
												scanForm.hide();
											}
									},{
												xtype: 'button',
												text: Localize.MarkPayed,
												id: 'fix-pmnt-btn',
												iconCls: 'ext-save',
												hidden: true,
												style: 'marginLeft: 0px',
												handler: function(){
																	Ext.Ajax.request({
																		   url: 'config.php',
																		   success: onSuccessPayment,
																		   failure: onFailPayment,
																		   params: { async_call: 1, devision: 105, saveorderpaid: orderidfield.getValue(), payreceipt: paymentfield.getValue(), formattedDate: paydatefield.getValue() }
																		});
												}
										}
									]
						}
		    		] // End of container items
	    	}] // End of container tag && scan form items
		});	// End of form panel tag


	var no_confirm = new Ext.ToolTip({
		target: 'dontconfirm',
		id: 'dontconfirmtip',
		autoHide: true,
		html: Localize.DontConfirm
	    })


	scanForm.on('show', function() {
		Ext.getCmp('doc_id').focus();
	}, null, { delay: 500 });

	var orderidfield = Ext.getCmp('doc_id');
	var paymentfield = Ext.getCmp('recipt_no');
	var paydatefield = Ext.getCmp('payment_date');

	var OrderStore = WorkSpace.getGrid().store;

	function onSuccessPayment (Object, ReqOptions)
	{
	paymentfield.removeListener('valid', on_receiptcorrect);
	OrderStore.setBaseParam('exactorderid',orderidfield.getValue());
	WorkSpace.load();

	orderidfield.setValue('');
	paymentfield.setValue('');

	Ext.getCmp('close-scan-form').show();
	Ext.getCmp('fix-pmnt-btn').hide();
	orderidfield.focus();
	orderidfield.addListener('blur', blurhandler, null, { delay: 500 });
	Ext.MessageBox.show({
        msg: Localize.BillPayed,
        // progress: true,
        title: Localize.Message,
        // progressText: 'Saving...',
        width:130
        // wait:true,
        // waitConfig: {interval:200}
    });
	setTimeout(function(){
         Ext.MessageBox.hide();
     }, 1500);
	paymentfield.clearInvalid();

	}

	function onFailPayment (Object, ReqOptions)
	{
	Ext.MessageBox.alert('Error Ajax request paying invoice' + Object.responseText);
	}

	function on_receiptcorrect() {
		Ext.getCmp('close-scan-form').hide();
		Ext.getCmp('fix-pmnt-btn').show();
	};

	function blurhandler() {
		orderidfield.focus();
	};

	function storeloadhandler() {

		if (OrderStore.getTotalCount() < 1)
		{
			Ext.MessageBox.show({
		           msg: Localize.NoSuchDocument,
		           // progress: true,
		           title: Localize.Message,
		           // progressText: 'Saving...',
		           width:400
		           // wait:true,
		           // waitConfig: {interval:200}
		       });
		    setTimeout(function(){
		            Ext.MessageBox.hide();
		        }, 2000);
			orderidfield.focus();
			orderidfield.addListener('blur', blurhandler, null, { delay: 500 });
			orderidfield.setValue('');

		}
		else
		{
			if ( Ext.util.Format.date(OrderStore.getAt(0).get('paydate'),'Y') < 1970)
			{
				if (Ext.getCmp('dontconfirm').getValue() == true)
				Ext.Ajax.request({
					   url: 'config.php',
					   success: onSuccessPayment,
					   failure: onFailPayment,
					   params: { async_call: 1, devision: 105, saveorderpaid: orderidfield.getValue(), formattedDate: paydatefield.getValue() }
					});
				else
				{
				Ext.getCmp('recipt_no').focus();
				}
			}
			else
			{
			Ext.MessageBox.show({
		           msg: Localize.AlreadyPayed + ' ' + Ext.util.Format.date(OrderStore.getAt(0).get('paydate'),'d-m-Y'),
		           // progress: true,
		           title: Localize.Message,
		           // progressText: 'Saving...',
		           width:300
		           // wait:true,
		           // waitConfig: {interval:200}
		       });
		    setTimeout(function(){
		            Ext.MessageBox.hide();
		        }, 2000);

			Ext.getCmp('doc_id').setValue('');
			orderidfield.addListener('blur', blurhandler, null, { delay: 500 });
			}
		}

		OrderStore.removeListener('load', storeloadhandler);

	};

	orderidfield.on('blur', blurhandler, null, { delay: 500 });

	// Main handler on order_id validation event
	orderidfield.on('valid', function() {

		paymentfield.on('valid', on_receiptcorrect, null, { delay: 500 });
		OrderStore.addListener('load', storeloadhandler, null, { delay: 10 });
		orderidfield.removeListener('blur', blurhandler);

		OrderStore.setBaseParam('exactorderid',orderidfield.getValue());
		WorkSpace.load();

	});
	orderidfield.on('invalid', function() {
		orderidfield.addListener('blur', blurhandler, null, { delay: 500 });
	});

}

/**
 * show panel
 * @param	string, DOM Element render to
 */
function showPanel( renderTo )
{
	if(Ext.isEmpty(Ext.get(renderTo))){
		return false
	}

	var S = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
		paramNames: { sortdir: 'sortdir', sortfield: 'sortfield', limit: 'limit' },
		reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
				[{ name: 'orderid', type: 'int' },
				{ name: 'ordernum', type: 'int' },
				{ name: 'agrmid', type: 'int' },
				{ name: 'operid', type: 'int' },
				{ name: 'docid', type: 'int' },
				{ name: 'docpayable', type: 'int' },
				{ name: 'period', type: 'date', dateFormat: 'Y-m-d' },
				{ name: 'orderdate', type: 'date', dateFormat: 'Y-m-d' },
				{ name: 'creationdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'paydate', type: 'date', dateFormat: 'Y-m-d' },
				{ name: 'opername', type: 'string' },
				{ name: 'agrmnum', type: 'string' },
				{ name: 'currsumm', type: 'float' },
				{ name: 'taxsumm', type: 'float' },
				{ name: 'username', type: 'string' },
				{ name: 'payreceipt', type: 'string' },
				{ name: 'docsavepath', type: 'string' },
				{ name: 'filename', type: 'string' },
				{ name: 'docuploadext', type: 'string' },
				{ name: 'currsymbol', type: 'string' }
			]),
		baseParams: { async_call: 1, devision: 105, getdocument: 0, exactorderid: 0 },
		listeners: {
			beforeload: function(s, o){
				if(!Ext.isEmpty(s.lastOptions)) {
					for(var i in s.lastOptions.params)
					{
						switch(i){
							case 'sortdir':
								o[i] = s.lastOptions.params[i];
							break;
							case 'sortfield':
								o[i] = s.lastOptions.params[i];
							break;
						}
					}
				}
				
				if(!Ext.isEmpty(o.sortdir)) {
					o.start = s.lastOptions.params.start;
				}
				
				if(Ext.isEmpty(o.sortfield)) {
					o.sortfield = 'ordernum';
				}
				
				if(Ext.isEmpty(o.sortdir)) {
					o.sortdir = 'ASC';
				}
			}
		}
	});

	compactForm = function(items, object){ 
	if(Ext.isEmpty(items)){ return false; }; 
	items.push({ xtype: 'hidden', name:'devision', value: 105 }); 
	items.push({ xtype: 'hidden', name:'async_call', value: 1 }); 
	var form = new Ext.form.FormPanel({ id: 'compactForm', renderTo: Ext.getBody(), url: 'config.php', items: items });
	form.getForm().submit({ 
	method:'POST',
	timeout: 380000,
	waitTitle: Localize.Connecting, waitMsg: Localize.SendingData + '...', 
	success: function(form, action)
	{ 
	if(!Ext.isEmpty(object)){ try{ object.success(action); } catch(e){} }; form.destroy(); 
	}, 
	failure: function(form, action)
	{ if(action.failureType == 'server') 
		{ obj = Ext.util.JSON.decode(action.response.responseText); Ext.Msg.alert('Error!', obj.errors.reason); } form.destroy(); 
	} }) };

	var views = {
		items: {
			0: ['orderid', 'ordernum', 'username', 'agrmnum', 'opername', 'period', 'currsumm', 'paydate', 'currsymbol', 'payreceipt'],
			1: ['orderid', 'ordernum', 'username', 'agrmnum', 'opername', 'period', 'currsumm', 'currsymbol']
		},
		refresh: function(g, v){
			var C = g.getColumnModel();
			for (var i = 0, off = C.getColumnCount(); i < off; i++) {
				var idx = C.getDataIndex(i);
				if (this.items[v].indexOf(idx) > -1) {
					C.setHidden(i, false);
				}
				else {
					C.setHidden(i, true)
				}
			}
		}
	}

	var Pay = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.SavePayment, dataIndex: 'paydate', width: 22, iconCls: function(r){ if(r.data.paydate.format('Y')<1980){ return 'ext-payhistory' } else { return 'ext-pay-dis' } } });
	var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.DeleteUser, dataIndex: 'orderid', width: 22, iconCls: function(r){ if(r.data.paydate.format('Y')<1980){ return 'ext-drop' } else { return 'ext-drop-dis' } } });
	var PAGELIMIT = 100;
	var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:false, dataIndex: 'orderid' });
	var dp = new Ext.Panel({
	    title: Ext.app.Localize.get('Printing forms'),
	    id: 'docPanel',
	    width: 960,
	    autoHeight: true,
	    renderTo: renderTo,
		listeners: {
			show: function() {
				try {
					if (Ext.isDefined(DefaultView['period']) && !Ext.isEmpty(DefaultView['period'])) {
						WorkSpace.findPanelChild('datefor').get('datefor').setValue(Date.parseDate(DefaultView['period'] + '-01', 'Y-m-d'));
					}
				}
				catch(e) { }
			}
		},
	    tbar: [{
		xtype: 'panel',
		header: false,
		layout: 'table',
		autoHeight: true,
		defaults: {
		    height: 24
		},
		layoutConfig: { columns: 1 },
		plain: true,
		bodyStyle: 'background: none',
		frame: false,
		border: false,
		width: 954,
		items: [{
		    xtype: 'container',
		    autoEl: 'div',
		    width: 954,
		    layout: 'column',
		    items: [{
			xtype: 'fieldset',
			width: 314,
			height: 24,
			border: false,
			style: 'padding: 0px; border: none',
			items: {
			    xtype: 'combo',
			    width: 200,
			    fieldLabel: Localize.DocumentsTypes,
				tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 42)]}</div></tpl>',
				listWidth: 250,
			    pid: 'getdocument',
			    displayField: 'name',
			    lastValue: 0,
			    valueField: 'id',
			    store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
				    url: 'config.php',
				    method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
				    root: 'results'
				}, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'type', type: 'int' }]),
				baseParams: {
				    async_call: 1,
				    devision: 105,
				    getdoctypes: 1
				},
				sortInfo: {
				    field: 'id',
				    direction: 'ASC'
				},
				autoLoad: true,
				listeners: {
					load: function(store) {

						recordData = {id:0,name:Ext.app.Localize.get('All'),type:1};
						store.insert(0,new store.reader.recordType(recordData));

						if(!store['defaultLoaded']) {
							try {
								if (DefaultView['getdocument']) {
									WorkSpace.findPanelChild('getdocument').get('getdocument').setValue(DefaultView['getdocument'])
								}
							}
							catch(e) { }
							store['defaultLoaded'] = true;
						}
					}
				}
			    }),
			    editable: false,
			    typeAhead: true,
			    mode: 'local',
			    triggerAction: 'all',
			    listeners: {
				select: function(C, R){
				    var A = WorkSpace.findPanelChild('paidgroup');
				    if (R.data.type > 0) {
					A.get('paidgroup_1').enable();
					A.get('paidgroup_2').enable();
					views.refresh(Ext.getCmp('ordersGrid'), 0);
				    }
				    else {
					WorkSpace.unCheckGroup('paidgroup');
					A.get('paidgroup_1').disable();
					A.get('paidgroup_2').disable();
					A.get('paidgroup_0').setValue(true);
					views.refresh(Ext.getCmp('ordersGrid'), 1);
				    };
				    if (C.lastValue > 0 && C.lastValue != C.getValue()) {
					Ext.getCmp('ordersGrid').store.filter('orderid', 'A');
				    }
				    else {
					Ext.getCmp('ordersGrid').store.clearFilter();
				    }
				}
			    },
			    setLastValue: function(){
				this.lastValue = this.getValue()
			    }
			}
		    }, {
			xtype: 'fieldset',
			height: 24,
			width: 342,
			labelWidth: 129,
			border: false,
			style: 'padding: 0px; border: none',
			items: {
			    xtype: 'combo',
			    width: 200,
			    fieldLabel: Localize.UsersGroups,
			    pid: 'ugroup',
			    displayField: 'name',
			    valueField: 'id',
			    store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
                    reader: new Ext.data.JsonReader(
                        { root: 'results' },
                        [{ name: 'id', type: 'int'}, { name: 'name', type: 'string' }]
                    ),
                    baseParams: { async_call: 1, devision: 105, getugroups: 1 },
                    sortInfo: { field: 'id', direction: 'ASC'},
                    autoLoad: true,
                    listeners: {
                        load: function(store){
                            store.each(function(record){
                                record.data.name = Ext.util.Format.ellipsis(record.data.name, 26);
                            });
                            WorkSpace.findPanelChild('ugroup').get('ugroup').setValue(0);
                        }
                    }
			    }),
			    editable: false,
			    typeAhead: true,
			    mode: 'local',
			    triggerAction: 'all'
			}
		    }, {
			xtype: 'fieldset',
			height: 24,
			labelWidth: 67,
			border: false,
			style: 'padding: 0px; border: none',
			items: {
			    xtype: 'combo',
			    width: 200,
			    fieldLabel: Localize.Operators,
			    pid: 'operid',
			    displayField: 'name',
			    valueField: 'id',
			    id: 'operlist',
			    store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
				    url: 'config.php',
				    method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
				    root: 'results'
				}, [{
				    name: 'id',
				    type: 'int'
				}, {
				    name: 'name',
				    type: 'string'
				}]),
				baseParams: {
				    async_call: 1,
				    devision: 105,
				    getoperators: 1
				},
				sortInfo: {
				    field: 'id',
				    direction: 'ASC'
				},
				autoLoad: true,
				listeners: {
				    load: function(store){
					store.each(function(record){
					    record.data.name = Ext.util.Format.ellipsis(record.data.name, 26);
					});
					store.insert(0, new store.recordType({ id: 0, name: Localize.All }));
					Ext.getCmp('operlist').setValue(0);
				    }
				}
			    }),
			    editable: false,
			    typeAhead: true,
			    mode: 'local',
			    triggerAction: 'all'
			}
		    }]
		}, {
			xtype: 'container',
			autoEl: 'div',
			layout: 'hbox',
			items: [{
				xtype: 'fieldset',
				width: 211 + (Ext.isIE ? 2 : 0),
				height: 24,
				border: false,
				style: 'padding: 0px; border: none',
				items: [{
					xtype: 'datefield',
					fieldLabel: Localize.ReportingPeriod,
					pid: 'datefor',
					width: 98,
					format: 'Y-m-d',
					maskRe: new RegExp('[0-9\-]'),
					value: new Date().format('Y-m-01')
				}]
			}, {
				xtype: 'fieldset',
				defaultType: 'radio',
				layout: {
				    type: 'column'
				},
				border: false,
				style: 'padding: 0px; padding-left: 2px; margin: 0px',
				labelWidth: 1,
				height: 24,
				width: 265,
				items: [{
					xtype: 'radio',
					boxLabel: Localize.All,
					width: 55,
					name: 'paidgroup',
					pid: 'paidgroup_0',
					checked: true
				}, {
					xtype: 'radio',
					boxLabel: Localize.NotPaidInS,
					width: 115,
					name: 'paidgroup',
					pid: 'paidgroup_2',
					disabled: true
				}, {
					xtype: 'radio',
					boxLabel: Localize.PaidInS,
					width: 93,
					name: 'paidgroup',
					pid: 'paidgroup_1',
					disabled: true,
					handler: function(A, B){
						B ? WorkSpace.findPanelChild('paiddate').get('paiddate').enable() : WorkSpace.findPanelChild('paiddate').get('paiddate').disable()
					}
				}]
			}, {
				xtype: 'fieldset',
				height: 24,
				width: 107,
				border: false,
				style: 'padding: 0px; border: none',
				items: [{
					xtype: 'datefield',
					hideLabel: true,
					pid: 'paiddate',
					disabled: true,
					disabledDaysText: Localize.Date,
					width: 100,
					format: 'Y-m-d',
					maskRe: new RegExp('[0-9\-]')
				}]
			}, {
				xtype: 'fieldset',
				height: 24,
				width: 155,
				border: false,
				style: 'padding: 0px; border: none',
				items: [{
					xtype: 'combo',
					hideLabel: true,
					width: 150,
					displayField: 'name',
					pid: 'searchtype',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [['0', Localize.User], ['1', Localize.Agreement], ['3', Localize.AccountLogin]],
						fields: ['id', 'name']
					})
				}]
			}, {
				xtype: 'container',
				autoEl: 'div',
				height: 24,
				width: 201,
				style: 'padding-top: 2px;',
				items: [{
					xtype: 'textfield',
					hideLabel: true,
					pid: 'searchfield',
					width: 200
				}]
			}]
		}, {
		    xtype: 'container',
		    autoEl: 'div',
		    layout: 'column',
		    items: [{
				xtype: 'fieldset',
				height: 24,
				border: false,
				width: 320,
				style: 'padding: 0px; border: none',
				labelWidth: 110,
				items: [{
					xtype: 'combo',
					width: 200,
					pid: 'advSearchList',
					fieldLabel: Localize.AdvancedSearch,
					displayField: 'tplname',
					valueField: 'tplname',
					typeAhead: true,
					mode: 'local',
					lazyRender: true,
					triggerAction: 'all',
					editable: true,
					store: new Ext.data.ArrayStore({
						fields: [{ name: 'tplname', type: 'string' }],
						data: []
					}),
					mainStore: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'tplname', type: 'string' },
							{ name: 'property', type: 'string' },
							{ name: 'condition', type: 'string' },
							{ name: 'date', type: 'date', dateFormat: 'd-m-Y' },
							{ name: 'value', type: 'string' },
							{ name: 'logic', type: 'string' }
						]),
						baseParams: {
							async_call: 1,
							devision: 42,
							getallsearchtpl: ''
						},
						autoLoad: true,
						listeners: {
							add: function(s,r,i){
								var C = WorkSpace.findPanelChild('advSearchList').get('advSearchList');
								Ext.each(r, function(A){
									if(this.store.find('tplname', A.data.tplname) < 0) {
										this.store.add(A);
									}
								}, { store: C.store, mainStore: C.mainStore });
							},
							load: function(s,r,i){
								s.events.add.listeners[0].fn(s, r, i);
							},
							remove: function(s,r,i){
								var C = WorkSpace.findPanelChild('advSearchList').get('advSearchList');
								var f = C.store.find('tplsname', r.data.tplname);
								if(f > -1) {
									C.store.remove(C.store.getAt(f));
								}
							}
						}
					})
				}]
			}, {
				xtype: 'container',
				autoEl: 'div',
				//width: 210,
				items: [{
					xtype: 'button',
					//text: Localize.Change + '&nbsp;' + Localize.rules + ' / ' + Localize.Create + '&nbsp;' + Localize.rules,
					text: Ext.app.Localize.get('Create/Edit'),
					handler: function(){
						fn = function(A){
							var C = WorkSpace.findPanelChild('advSearchList').get('advSearchList');
							C.mainStore.each(function(r){
								if(r.data.tplname == this.tplname) {
									this.store.remove(r);
								}
							}, { store: C.mainStore, tplname: A.tplname});
							if(A.data.length > 0) {
								Ext.each(A.data, function(A){
									this.add(new this.recordType(A))
								}, C.mainStore);
								if(!Ext.isEmpty(A.data[0].tplname)) {
									C.setValue(A.data[0].tplname);
								}
							}
							else {
								var i = C.store.find('tplname', A.tplname);
								if(i > -1) {
									C.store.remove(C.store.getAt(i));
								}
								C.setValue('');
							}
						};
						var C = WorkSpace.findPanelChild('advSearchList').get('advSearchList');
						var rules = [];
						C.mainStore.each(function(R){
							if(this.tplname == R.data.tplname){
								this.rules.push(R.data);
							}
						}, { rules: rules, tplname: C.getValue() });
						new SearchTemplate.show({
							tplname: C.getValue(),
							onsearch: fn,
							onsave: fn,
							onSaveClose: true,
							rules: rules
						})
					}
				}]
			},
            {
				xtype: 'fieldset',
				height: 24,
				border: false,
				width: 230,
				style: 'padding: 0px; border: none',
				labelWidth: 60,
				items: [
                    {
                        xtype: 'combo',
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Postman'),
                        tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.postmanId + " - " + values.postmanFio, 32)]}</div></tpl>',
                        itemSelector: 'div.x-combo-list-item',
                        triggerAction:'all',
                        editable: false,
                        typeAhead: true,
                        mode: 'remote',
                        pid: 'postmanId',
                        //lastValue: 0,
                        forceSelection:true,
                        valueField:  'postmanId',
                        displayField:'postmanFio',
                        hiddenName:  'postmanid',
                        name:        'postmanid',
                        id:          'postmanid2',
                        //setLastValue: function(){
                        //    this.lastValue = this.getValue()
                        //},
                        allowBlank: false,
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
                            reader: new Ext.data.JsonReader( { root: 'results' }, [ { name: 'postmanId', type: 'int' }, { name: 'postmanFio', type: 'string' } ]),
                            autoLoad: false,
                            baseParams: { async_call: 1, devision: 15, getpostmans: 1 },
                            listeners: {
                                load: function(store) {
                                    store.insert(0, new store.recordType({ postmanId: 0, postmanFio: 'Все' }));
                                }
                            }
                        })
                    }

                ]
			},
            {
				xtype: 'container',
				autoEl: 'div',
				style: 'margin-left: 5px',
                qtip: Localize.SendChecked,
				//width: 155,
				items: [{
					xtype: 'button',
					qtip: Localize.SendChecked,
					text: '',
					iconCls: 'ext-mailto',
					handler: function(){
						var C = WorkSpace.findPanelChild('getdocument');
						var S = WorkSpace.getGrid().getSelectionModel();

						if (C.get('getdocument').getValue() < 0) {
						    return false
						}

						var list = [];
						S.each(function(A){
							this.push(A.data.orderid);
						}, list);

						if (S.getCount() > 0) {
							compactForm([{ xtype: 'hidden', name: 'sendbyemail', value: list.join(',')}], {
								success: function(a){
									Ext.Msg.alert(Localize.Info, Localize.ListInQueue);
								}
							});
						}
					}
				}]
		    }, {
			xtype: 'container',
			autoEl: 'div',
			width: 88,
			items: [{
				xtype: 'button',
				text: Localize.Download,
				iconCls: 'ext-save',
				handler: function(){
					var C = WorkSpace.findPanelChild('getdocument');
					//if (C.get('getdocument').getValue() <= 0) {
					//	return false
					//}
					var S = WorkSpace.getGrid().getSelectionModel();

					if (C.get('getdocument').getValue() == 0 && S.getCount() > 1) {
						Ext.Msg.alert(Ext.app.Localize.get('Attention'), Ext.app.Localize.get('Unable to export files.') + '<br/>' +Ext.app.Localize.get('Choose type of documents to export, please.'));
						return false;
					}
					if (S.getCount() > 1) {
						var I = [];
						var B = WorkSpace.filter.joinParams();
						B = WorkSpace.advSearch(B);
						
						for (var i in B) {
							if (typeof B[i] == 'undefined' || typeof B[i] == 'function' || typeof B[i] == 'object') {
								continue;
							};
							(i == 'getdocument') ? n = 'getmultiord' : n = i;
							I.push({
								xtype: 'hidden',
								name: n,
								value: B[i]
							})
						};
						var B = WorkSpace.advSearch();
						
						
					    S.each(function(A){
						  this.push({
						      xtype: 'hidden',
						      name: 'filesarray[]',
						      value: A.data.orderid
						  })
					    }, I);
					    
					    I.push({
						xtype: 'hidden',
						name: 'sortfield',
						value: WorkSpace.getGrid().store.getSortState() ? WorkSpace.getGrid().store.getSortState().field : 'ordernum'
					    });					    
					    
					    I.push({
						xtype: 'hidden',
						name: 'sortdir',
						value: WorkSpace.getGrid().store.getSortState() ? WorkSpace.getGrid().store.getSortState().direction : 'ASC'
					    });
					    
					    I.push({
						xtype: 'hidden',
						name: 'start',
						value: WorkSpace.getGrid().store.lastOptions.params.start
					    });
					    
					    compactForm(I, {
						success: function(A){
						    var C = Ext.util.JSON.decode(A.response.responseText);
						    if (!Ext.isEmpty(C.file.file)) {
							
							if (!document.getElementById('_DownFrame')) {
							    var B = document.createElement("IFRAME");
							    B.id = '_DownFrame';
							    B.style.display = "none";
							    document.body.appendChild(B);
							};
							
							if (typeof B != 'object') {
							    var B = document.getElementById('_DownFrame');
							};
							B.src = './config.php?devision=105&async_call=1&download=1&getmultifile=' + C.file.file + '&name=' + C.file.name + '&ext=' + C.file.ext + '&filename=' + S.getSelected().data.filename;
						    }
						}
					});
				}
				else
				    if (S.getCount() == 1) {
					if (!document.getElementById('_DownFrame')) {
					    var B = document.createElement("IFRAME");
					    B.id = '_DownFrame';
					    B.style.display = "none";
					    document.body.appendChild(B);
					};
					if (typeof B != 'object') {
					    var B = document.getElementById('_DownFrame');
					};
					B.src = './config.php?devision=105&async_call=1&download=1&getExt=1&getsingleord=' + S.getSelected().data.orderid + '&filename=' + S.getSelected().data.filename;
				    }
			    }
			}]
		    }, {
			xtype: 'container',
			width: 79,
			autoEl: 'div',
			items: {
				xtype: 'button',
				text: Localize.Show,
				iconCls: 'ext-table',
				handler: function(){
					var C = WorkSpace.findPanelChild('getdocument');
					if (C.get('getdocument').getValue() < 0) {
						return false
					}
					C.get('getdocument').setLastValue();
					WorkSpace.getGrid().store.setBaseParam('exactorderid',0);
					WorkSpace.load()
				}
			}
		    }, {
				xtype: 'container',
				autoEl: 'div',
				width: 85,
				items: [{
					xtype: 'button',
					text: Localize.Scan,
					iconCls: 'ext-scanbarcode',
					handler: function(){
					Ext.getCmp('_scanForm').show();
					Ext.getCmp('doc_id').setValue('');
					}
				}]
		    }
		    ]
		}]
	    }],
		items: [{
			xtype: 'grid',
			width: 959,
			height: 800,
			id: 'ordersGrid',
			loadMask: true,
			autoExpandColumn: 'username',
			sm: sm,
			plugins: [Pay, Remove],
			store: S,
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: S,
				displayInfo: true,
				items: ['-', {
					xtype: 'container',
					width: 400,
					layout: 'hbox',
					items: [{
						xtype: 'combo',
						width: 70,
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						value: PAGELIMIT,
						editable: false,
						store: new Ext.data.ArrayStore({
							data: [
								[100, '100'],
								[500, '500'],
								[1000, '1000'],
								[0, Ext.app.Localize.get('All')]],
							fields: ['id', 'name']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.ownerCt.pageSize = PAGELIMIT;
								S.setBaseParam('limit', PAGELIMIT);
								S.reload({
									params: {
										start: 0
									}
								});
							}
						}
					}]
				}]
			}),		
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: true,
					menuDisabled: true
				},
				columns: [sm, Pay, {
					header: Localize.Number,
					dataIndex: 'ordernum',
					width: 70
				}, {
					header: Localize.User,
					id: 'username',
					dataIndex: 'username',
					width: 160
				}, {
					header: Ext.app.Localize.get('Agreement number'),
					dataIndex: 'agrmnum',
					width: 110
				}, {
					header: Localize.Operator,
					dataIndex: 'opername',
					width: 175,
					sortable: false
				}, {
					header: Localize.Period,
					dataIndex: 'period',
					width: 90,
					sortable: false,
					renderer: function(v){
						try {
							if (v.format('Y') > 1980) {
								return v.format('Y-m-d')
							}
							else {
								return ''
							}
						}
						catch (e) {
						}
					}
				}, {
					header: Localize.Sum,
					dataIndex: 'currsumm',
					width: 100,
					renderer: function(value, metaData, record){
						try {
							metaData.attr = 'ext:qtip="' + value.toFixed(2) + ' ' + record.get('currsymbol') + '"'
							return value.toFixed(2) + ' ' + record.get('currsymbol');
						}
						catch (e) {
							return value + ' ' + record.get('currsymbol');
						}
					}
				}, {
					header: Localize.PayDate,
					dataIndex: 'paydate',
					width: 90,
					renderer: function(v){
						try {
							if (v.format('Y') > 1980) {
								return v.format('Y-m-d')
							}
							else {
								return ''
							}
						}
						catch (e) {
						}
					}
				}, {
					header: Localize.ReceiptNumber,
					dataIndex: 'payreceipt',
					width: 110
				}, Remove]
			}),
			listeners: {
				sortchange: function(g, o){
					if(g.store.getCount() > 0){
						if(g.store.getTotalCount() > g.store.lastOptions.params.limit) {
							g.store.reload({ params: {
								start: g.store.lastOptions.params.start,
								limit: g.store.lastOptions.params.limit,
								sortdir: o.direction,
								sortfield: o.field
							} })
						}
					}
				}
			}
		}]
	}).show();

	Pay.on('action', function(g, r, idx, e){
		if(r.data.paydate.format('Y')<1980){
			payForm.grid = g;
			payForm.record = r;
			payForm.idx = idx;
			payForm.setPosition(e.getXY()[0], e.getXY()[1]);
			payForm.isVisible() ? payForm.fireEvent('show') : payForm.show();
		}
		else {
			return false
		}
	});

	Remove.on('action', function(g, r, idx){ 
		if(r.data.paydate.format('Y')<1980){ 
			Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove document?'), function(Btn){
				if (Btn != 'yes') return;
				else { compactForm(
					[{ xtype: 'hidden', name: 'deldocid', value: r.data.orderid }], 
					{ grid: g, record: r, idx: idx, success: function(){ this.grid.store.remove(this.record) } }
				);}
			});
			 
		} else { return false } 
	});

	var payForm = new Ext.Window({
		xtype: 'window',
		frame: false,
		header: false,
		width: 290,
		closable: false,
		resizable: false,
		orderTpl: '',
		orderRegExp: '',
		grid: null,
		record: null,
		idx: null,
		items: [{
			xtype: 'form',
			url: './config.php',
			labelWidth: 135,
			monitorValid: true,
			buttonAlign: 'center',
			frame: true,
			buttons: [{
			    xtype: 'button',
			    text: Localize.Save,
			    formBind: true,
			    handler: function(B){
				B.findParentByType('form').getForm().submit({
				    method: 'POST',
				    waitTitle: Localize.Connecting,
				    waitMsg: Localize.SendingData + '...',
				    success: function(f, a){
					payForm.grid.store.getAt(payForm.idx).set('paydate', new Date());
					payForm.grid.store.getAt(payForm.idx).set('payreceipt', Ext.getCmp('pordnum').getValue());
					payForm.grid.store.getAt(payForm.idx).commit();
					payForm.hide();
					Ext.getCmp('pordnum').setValue('');
				    },
				    failure: function(f, a){
					if (a.failureType == 'server') {
					    obj = Ext.util.JSON.decode(a.response.responseText);
					    switch (obj.errors.code) {
						case 0:
						{
						    msg = Localize.CannotIdentifyDoc;
							break;
						}
						case 1:
						{
							msg = Localize.NoRights;
							break;
						}
						case 2:
						{
							msg = Localize.NotPayable;
							break;
						}
						default:
						    msg = Localize.ThereWasError;
					    }
					    Ext.Msg.alert(Localize.Error, msg);
					}
				    }
				})
			    }
			}, {
			    xtype: 'button',
			    text: Localize.Cancel,
			    handler: function(B){
				var F = B.findParentByType('form').findParentByType('window').hide()
			    }
			}],
			items: [{
			    xtype: 'hidden',
			    name: 'async_call',
			    value: 1
			}, {
			    xtype: 'hidden',
			    name: 'devision',
			    value: 105
			}, {
			    xtype: 'hidden',
			    id: 'pordertpl',
			    value: ''
			}, {
			    xtype: 'hidden',
			    id: 'saveorderpaid',
			    name: 'saveorderpaid',
			    value: 0
			}, {
			    xtype: 'textfield',
			    id: 'pordnum',
			    name: 'payreceipt',
			    fieldLabel: Localize.PaymentOrder,
			    validator: function(v){
				if(payForm.orderTpl.length > 0) {
				      return payForm.orderRegExp.test(v)
				}
				else {
				      payForm.findByType('form')[0].stopMonitoring();
				      return true;
				}
			    }
			}]
		}],
		listeners: {
		    show: function(f){
			if (Ext.isEmpty(Ext.getCmp('pordnumtip')) && payForm.orderTpl.length > 0) {
			    new Ext.ToolTip({
				target: 'pordnum',
				id: 'pordnumtip',
				autoHide: true,
				html: payForm.orderTpl
			    })
			};
			Ext.getCmp('saveorderpaid').setValue(payForm.record.data.orderid)
		    }
		}
	});

	payForm.items.get(0).getForm().load({
		method: 'POST',
		params: {
			devision: 105,
			async_call: 1,
			getpordertpl: 1
		},
		success: function(f, a){
			payForm.orderTpl = a.result.data.pordernum;
			if(payForm.orderTpl.length > 0) {
				payForm.orderRegExp = new RegExp('^' + a.result.data.pordertpl + '$')
			}
			else {
				payForm.orderRegExp = new RegExp('.')
			}
		}
	});
} // end showPanel()
