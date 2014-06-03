/**
 * @author Vlad B. Pinzhenin
 * 
 * Repository information:
 * $Date: 2009-11-23 14:43:21 $
 * $Revision: 1.1.2.14 $
 */

/**
 * Storages collection object
 * An implementation of hidden values creation to be able to save changes over form submittion
 * Result: there will be a hidden elements created 
 */

var Storages = {
	store: false, 
	agrm_store: false,
	pay_history_st: false,
	grid: false,
	agrm_grid: false,
	pay_history_grid: false,
	user_properties: false,
	extract: function( _formId ){}
} // end Storages{ }

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	var userslist_cm = new Ext.grid.ColumnModel([
		{ id:'name', header: Localize.PersonFullName, dataIndex: 'name', width: 220 },
		{ id:'descr', header: Localize.Description, dataIndex: 'descr', width: 175 },
		{ id: 'email', header: Localize.Email, dataIndex: 'email', width: 150 }
	]);
	userslist_cm.defaultSortable = true;
	
	var agreements_cm = new Ext.grid.ColumnModel([
		{ id: 'id', header: 'ID', dataIndex: 'id', width: 30 },
		{ id: 'num', header: Localize.AgrmntNumber, dataIndex: 'num', width: 150 },
		{ id: 'date', header: Localize.Date, dataIndex: 'date', width: 100 },
		{ id: 'balance', header: Localize.Balance, dataIndex: 'balance', width: 75, renderer: function(data, metadata, record, rowIndex, columnIndex, store){ return data.toFixed(2); } },
		{ id: 'cursymbol', header: Localize.Currency, dataIndex: 'cursymbol', width: 75 }
	]);
	agreements_cm.defaultSortable = true;
	
	var PrintDoc = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.PrintReceipt, width: 22, /*dataIndex: 'orderid',*/ iconCls: 'ext-table' });
	
	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, { width:280, initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); }, validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search', onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } }, onTrigger2Click : function(){ var v = this.getRawValue(); if(v.length < 1){ this.onTrigger1Click(); return; } var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); } });
	
	// Create the Data Store for Users list
	
	Storages.store = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), baseParams: { async_call: 1, devision: 22, getusers: 0, searchtype: 0 }, reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total', id: 'usersList' }, Ext.data.Record.create([{ name: 'uid', type: 'int' }, { name: 'name', type: 'string' }, { name: 'descr', type: 'string' }, { name: 'email', type: 'string' }, { name: 'phone', type: 'string' }, { name: 'addrtype', type: 'int' }, { name: 'addrcode', type: 'string' }, { name: 'address', type: 'string' }, { name: 'vgcnt', type: 'int' }, { name: 'login', type: 'string' }, { name: 'type', type: 'int' } ])), sortInfo:{field: 'name', direction: "ASC"}, autoLoad: true });
	
	// Create the Data Store for selected user agreements list
	Storages.agrm_store = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), baseParams: { async_call: 1, devision: 199, getAgrmList: 1, uid: 0 }, reader: new Ext.data.JsonReader({ root: 'results', id: 'agrmList' }, Ext.data.Record.create([{ name: 'id', type: 'int' }, { name: 'oper', type: 'int' }, { name: 'num', type: 'string' }, { name: 'date', type: 'string' }, { name: 'balance', type: 'float' }, { name: 'credit', type: 'int' }, { name: 'curid', type: 'int' }, { name: 'code', type: 'string'}, { name: 'cursymbol', type: 'string'}])), sortInfo:{field: 'num', direction: "ASC"}, autoLoad: false });
	
	// Create the Data Store for "selected user agreement" payments list
	Storages.pay_history_st = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), baseParams: { async_call: 1, devision: 199, getPayHistory: 1, agrm_id: 0 }, reader: new Ext.data.JsonReader({ root: 'results', id: 'payhistoryList' }, Ext.data.Record.create([ { name: 'amount', type: 'float' }, { name: 'cursymbol', type: 'string' }, { name: 'ordernum', type: 'string' }, { name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s' }, { name: 'recipe', type: 'string' }, { name: 'comment', type: 'string' }, { name: 'mgr', type: 'string' }, { name: 'recordid', type: 'int'}, { name: 'uid', type: 'int'}, { name: 'classid', type: 'int' }, { name: 'classname', type: 'string' }, { name: 'localdate', type: 'date', dateFormat: 'Y-m-d H:i:s' }, { name: 'agrmid', type: 'int'}])), sortInfo:{field: 'date', direction: "DESC"}, autoLoad: false });
	
	// Create the users list grid (readonly, single select)
	Storages.grid = new Ext.grid.GridPanel({
		tbar: [Localize.Search + ':&nbsp;', {
			xtype: 'combo',
			id: '_listCombo',
			width: 194,
			displayField: 'name',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			value: 0,
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [['0', Localize.PersonFullName], ['1', Localize.Agreement], ['2', Localize.Login], ['4', 'E-mail'], ['5', Localize.Phone]],
				fields: ['id', 'name']
			}),
			listeners: {
				select: function(){
					Storages.store.baseParams.searchtype = this.getValue();
				}
			}
		}, '&nbsp;', 
		new Ext.app.SearchField({
			store: Storages.store,
			params: { start: 0, limit: 50 },
			width: 227
		})],
		store: Storages.store,
		cm: userslist_cm,
		sm: new Ext.grid.RowSelectionModel({ sigleSelect: true }),
		loadMask: true,
		width: 550,
		height: 300,
		border: false,
		viewConfig: { forceFit: true },
		title: Localize.UsersListTitle,
		bbar: new Ext.PagingToolbar({
			pageSize: 50,
			store: Storages.store,
			displayInfo: true
		})
	});
	
	// Create the user agreements list grid (readonly, single select)
	Storages.agrm_grid = new Ext.grid.GridPanel({
		id: '_agrmPanel',
		store: Storages.agrm_store,
		cm: agreements_cm,
		sm: new Ext.grid.RowSelectionModel({ sigleSelect: true }),
		loadMask: true,
		width: 450,
		border: false,
		title: Localize.AgreementsTitle
	});
	
	// Create the users payments list grid (readonly, single select)
    Storages.pay_history_grid = new Ext.grid.GridPanel({
        renderTo: 'pay-history',
        id: '_payhistoryPanel',
        plugins: PrintDoc,
        store: Storages.pay_history_st,
        cm: new Ext.grid.ColumnModel([PrintDoc, {
            id: 'amount',
            header: Localize.Sum,
            dataIndex: 'amount',
            width: 100,
            renderer: function(data, metadata, record, rowIndex, columnIndex, store){
                return data.toFixed(2);
            }
        }, {
            id: 'cursymbol',
            header: Localize.Currency,
            dataIndex: 'cursymbol',
            width: 70
        }, {
            id: 'ordernum',
            header: Localize.OrderNumber,
            dataIndex: 'ordernum',
            width: 100
        }, {
            id: 'date',
            header: Localize.PaymentDate,
            dataIndex: 'date',
            width: 117,
			renderer: function(value, metaData, record) {
				try {
					metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
					return value.format('d.m.Y');
				}
				catch(e){
					return value
				}
			}
        }, {
			header: Ext.app.Localize.get('Payment commited'),
			dataIndex: 'localdate',
			width: 127,
			renderer: function(value, metaData, record) {
				try {
					metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
					return value.format('d.m.Y');
				}
				catch(e){
					return value
				}
			}
		}, {
			header: Ext.app.Localize.get('Class of payment'),
			dataIndex: 'classname',
			width: 120
		}, {
            id: 'recipe',
            header: Localize.PaymentNumber,
            dataIndex: 'recipe',
            width: 184
        }, {
            id: 'comment',
            header: Localize.Comment,
			hidden: true,
            dataIndex: 'comment',
            width: 200
        }, {
            id: 'mgr',
            header: Localize.ManagerName,
            dataIndex: 'mgr',
            width: 130
        }]),
        loadMask: true,
        width: 1000,
        height: 300,
        border: true,
        title: Localize.PaymentsHistoryTitle,
        collapsed: true
    });
	
	var userDetailsMarkup = [ '<center><font size=+1>' + Localize.FUI + ':</font> </center><br>', Localize.PersonFullName + ': {name} <br>', Localize.Description + ': {descr} <br>', Localize.Email + ': {email} <br>', Localize.Phone + ': {phone} <br>', Localize.Address + ': {address} <br>', Localize.AgrmntNumber + ': {num} <br>', Localize.LastUserRecipe + ': {lastuserrecipe} <br>', Localize.LastDbRecipe + ': {lastdbrecipe} <br>' ];
	
	var userdetailsTpl = new Ext.Template(userDetailsMarkup);
	
	var paymentsForm = new Ext.form.FormPanel({
	    id: '_payForm',
	    disabled: true,
	    frame: true,
	    width: 550,
	    height: 226 + (Ext.isIE ? 17 : 0),
	    title: Localize.Paymentctrl,
	    layout: 'column',
	    tbar: [{
		id: 'fix_payment_btn',
		text: Localize.SavePayment,
		iconCls: 'ext-save',
		disabled: true,
		handler: function(){
		    if(this.ownerCt.ownerCt.find('id', 'payment_sum')[0].getValue() == 0) {
			    return;
		    }
		    var payment_date_field = Ext.getCmp('payment_date');
		    var dt = new Date(payment_date_field.getValue());
		    var formatted_date_field = Ext.getCmp('formattedDate');
		    formatted_date_field.setValue(dt.format('Ymd'));
		    paymentsForm.form.submit({
			method: 'POST',
			url: 'config.php',
			waitMsg: Localize.SaveProcess,
			waitTitle: Localize.WaitForComplete,
			timeout: 600000,
			success: function(form, action){
			    Ext.getCmp('_payhistoryPanel').store.reload();
			    Storages.store.reload();
			    Storages.agrm_store.reload();
			},
			failure: function(form, action){
			    Ext.MessageBox.alert('Fix Payment', 'Save error occured');
			}
		    });
		}
	    }],
	    items: [{
		xtype: 'fieldset',
		border: false,
		labelWidth: 180,
		width: 380,
		style: 'padding: 0px; padding-left: 2px; margin: 0px; margin-top: 3px;',
		items: [{
		    xtype: 'textfield',
		    id: 'agrm_balance',
		    fieldLabel: Localize.CurBalance,
		    style: 'font-weight:bold;',
		    width: 190,
		    name: 'agrm_balance',
		    readOnly: true
		}, {
		    xtype: 'numberfield',
		    fieldLabel: Localize.PaymentSum,
		    allowBlank: true,
		    name: 'payment_sum',
		    id: 'payment_sum',
		    width: 190,
		    listeners: {
			change: function(fieldobj, newval, oldval){
			    Storages.paymentSum = newval;
			    var balance_cur_field = Ext.getCmp('agrm_balance');
			    var bv = balance_cur_field.getValue();
			    var setBalanceVal = bv * 1 + newval * 1;
			    var balance_set_field = Ext.getCmp('balance_value');
			    balance_set_field.setValue(setBalanceVal);
			}
		    }
		}, {
		    xtype: 'numberfield',
		    fieldLabel: Localize.SetBalance,
		    width: 190,
		    id: 'balance_value',
		    name: 'balance_value',
		    listeners: {
			change: function(fieldobj, newval, oldval){
			    var balance_cur_field = Ext.getCmp('agrm_balance');
			    var bv = balance_cur_field.getValue();
			    var addBalanceVal = newval * 1 - bv * 1;
			    var payment_sum_field = Ext.getCmp('payment_sum');
			    payment_sum_field.setValue(addBalanceVal);
			    Storages.paymentSum = addBalanceVal;
			}
		    },
		    allowBlank: true
		}, {
		    xtype: 'textfield',
		    fieldLabel: Localize.PaymentNumber,
		    width: 190,
		    id: 'payment_number',
		    name: 'payment_number',
		    validator: function(v){
			if(PayFormat.length > 0)
			{
			      var pay_form_tbar = Ext.getCmp('_payForm').getTopToolbar();
			      var fix_payment_btn = pay_form_tbar.items.first();
			      var checkval = new RegExp(PayFormat);
			      if (checkval.test(v)) {
				  fix_payment_btn.enable();
				  Storages.paymentConf = v;
				  return true;
			      }
			      else 
				  fix_payment_btn.disable();
			      return Localize.WrongFormat;
			}
			else {
			      fix_payment_btn.enable();
			      Ext.getCmp('_payForm').stopMonitoring();
			      return true;
			}
		    }
		}, new Ext.form.DateField({
		    fieldLabel: Localize.PaymentDate,
		    labelStyle: 'font-weight:bold;',
		    id: 'payment_date',
		    name: 'payment_date',
		    format: 'd/m/Y',
		    value: new Date(),
		    minValue: '1980-01-01',
		    width: 190
		}), {
			xtype: 'combo',
			fieldLabel: Ext.app.Localize.get('Class of payment'),
			id: 'pclasscombo',
			width: 190,
			displayField: 'classname',
			valueField: 'classid',
			hiddenName: 'classid',
			mode: 'local',
			value: 0,
			triggerAction: 'all',
			editable: false,
			tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.classname} :: {values.descr}">{[Ext.util.Format.ellipsis(values.classname, 22)]}</div></tpl>',
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [{
					name: 'classid',
					type: 'int'
				}, {
					name: 'classname',
					type: 'string'
				}, {
					name: 'descr',
					type: 'string'
				}]),
				autoLoad: true,
				baseParams: {
					async_call: 1,
					devision: 331,
					getpayclass: 1
				},
				sortInfo: {
					field: 'classname',
					direction: "ASC"
				},
				listeners: {
					load: function(store) {
						Ext.getCmp('pclasscombo').setValue(0);
					}
				}
			})
		}, {
		    xtype: 'textfield',
		    id: 'payment_comment',
		    fieldLabel: Localize.Comment,
		    width: 190,
		    name: 'payment_comment',
		    readOnly: false
		}, 
		{ xtype: 'hidden', id: 'fixPayment', name: 'fixPayment', value: 1 }, 
		{ xtype: 'hidden', id: 'async_call', name: 'async_call', value: 1 }, 
		{ xtype: 'hidden', id: 'devision', name: 'devision', value: 199 }, 
		{ xtype: 'hidden', id: 'agrm_id', name: 'agrm_id', value: 0 }, 
		{ xtype: 'hidden', id: 'formattedDate', name: 'formattedDate', value: '' }]
	    }, {
		xtype: 'fieldset',
		border: false,
		style: 'padding: 0px; padding-left: 10px; margin: 0px',
		items: [{ html: '<p></p>', style: 'padding-top: 7px', id: 'currency_sym_0' }, 
			{ html: '<p></p>', style: 'padding-top: 12px', id: 'currency_sym_1' }, 
			{ html: '<p></p>', style: 'padding-top: 13px', id: 'currency_sym_2' }]
	    }]
	});
	
	Ext.override(Ext.form.TextField, { onRender : function(ct, position){ Ext.form.TextField.superclass.onRender.call(this, ct, position); if(/^[0-9]{1,}$/.test(this.maxLength)) this.el.dom.setAttribute('maxLength', this.maxLength); } });
	
	var paypanel = new Ext.Panel({ renderTo: 'payments-container', layout: 'table', title: Localize.PaymentsTitle, width: 1000, defaults: { bodyStyle:'padding:0px' }, layoutConfig: { columns: 2 }, items: [
		{ items: Storages.grid },
		{ items: Storages.agrm_grid },
		{ items: paymentsForm },
		{ id: 'userdetails_panel', bodyStyle: 'padding: 3px', height: 240 }]
	});
	
	// Let us syncronize objects height
	var Box = Storages.agrm_grid.getBox();
	Box.height = Storages.grid.getBox().height;
	Storages.agrm_grid.updateBox(Box);
	Box = Ext.getCmp('userdetails_panel').getBox();
	Box.height = paymentsForm.getBox().height + 1;
	Ext.getCmp('userdetails_panel').updateBox(Box);
	
	if(PayFormatLength > 0) {
		Ext.getCmp('payment_number').getEl().dom.setAttribute('maxLength', PayFormatLength);
	}
	
	Storages.grid.getSelectionModel().on('rowselect',function(sm,rowIdx,r){
		paymentsForm.disable();
		
		var payments_history_panel = Ext.getCmp('_payhistoryPanel');
		payments_history_panel.collapse(false);
		
		Storages.agrm_store.baseParams = { async_call: 1, devision: 199, getAgrmList: 1, uid:  r.data.uid};
		Storages.agrm_store.reload();
		
		Storages.user_properties = r.data;
		Storages.user_properties.num = '';
		Storages.user_properties.lastuserrecipe = '';
		Storages.user_properties.lastdbrecipe= '';
		
		var detailsPanel = Ext.getCmp('userdetails_panel');
		userdetailsTpl.overwrite(detailsPanel.body, r.data);
		detailsPanel.body.highlight('#d8d8d8', {block:true});

	});	
	
	Storages.agrm_grid.getSelectionModel().on('rowselect',function(sm,rowIdx,r){
		Storages.user_properties.lastuserrecipe = '&nbsp;';
		Storages.user_properties.lastdbrecipe = '&nbsp;';
		paymentsForm.enable();
		
		var payments_history_panel = Ext.getCmp('_payhistoryPanel');
		
		payments_history_panel.expand();
		Storages.pay_history_st.baseParams = { async_call: 1, devision: 199, getPayHistory: 1, agrm_id: r.data.id, datefrom: new Date().add(Date.MONTH, -12).format('Y-m-01')};
		Storages.pay_history_st.reload();
		
		
		var pay_form_tbar = Ext.getCmp('_payForm').getTopToolbar();
		var fix_payment_btn = pay_form_tbar.items.first();
		fix_payment_btn.disable();
		
		// Aplly currency symbol to label containers
		currencySymbols(paymentsForm, r.data.cursymbol);
		
		var balance_cur_field = Ext.getCmp('agrm_balance');
		balance_cur_field.setValue(r.data.balance.toFixed(2));
		
		// Clear valuable fields in the form
		var payment_sum_field = Ext.getCmp('payment_sum');
		payment_sum_field.setValue('');
		var payment_number_field = Ext.getCmp('payment_number');
		payment_number_field.setValue('');
		var payment_comment_field = Ext.getCmp('payment_comment');
		payment_comment_field.setValue('');
		var balance_value_field = Ext.getCmp('balance_value');
		balance_value_field.setValue('');
		// End clear form data				
		
		var agrm_id_hidden = Ext.getCmp('agrm_id');
		agrm_id_hidden.setValue(r.data.id);
		// Get last kvittence number for user information only (for current agreement and for the whole database)
		
		Ext.Ajax.request({
		   url: 'config.php',
		   success: onReturnKvittence,
		   failure: onFailKvittence,
		   params: { async_call: 1, devision: 199, getLastKvittence: 1, agrm_id: r.data.id }
		});
		
		function onReturnKvittence (Object, ReqOptions)
		{
		// alert(Object.responseText);
		
		try { var rq = Ext.util.JSON.decode(Object.responseText); } catch(e){ alert ('Try JSON decode error occured:'+e); return; }; 
		
		if (rq.success != false && !Ext.isEmpty(rq.results)) {
			Storages.user_properties.lastuserrecipe = rq.results[0].recipe;
							
			var detailsPanel = Ext.getCmp('userdetails_panel');
			Storages.user_properties.num = r.data.num;
			userdetailsTpl.overwrite(detailsPanel.body, Storages.user_properties);
			
			detailsPanel.body.highlight('#d8d8d8', {
				block: true
			});
		}
		else
		Storages.user_properties.lastuserrecipe = '&nbsp;';
	
		}
		
		function onFailKvittence (Object, ReqOptions) {
			alert('Error Ajax request getting recipe no');
		}
	});
	
	var Receipts = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), baseParams: { async_call: 1, devision: 199, getdoctpls: 3 }, reader: new Ext.data.JsonReader({ root: 'results' }, Ext.data.Record.create([{ name: 'docid', type: 'int' }, { name: 'name', type: 'string'}])), autoLoad: true });
	
	PrintDoc.on('action', function(g, r, idx, e){ payForm.grid = g; payForm.record = r; payForm.idx = idx; switch(Receipts.getCount()){ case 0: Ext.Msg.alert('Stop', Localize.NoAvailableTemplate); break; default: payForm.setPosition(e.getXY()[0], e.getXY()[1]); payForm.isVisible() ? payForm.fireEvent('show') : payForm.show(); } });
	
    var payForm = new Ext.Window({
        frame: false,
        header: false,
        width: 339,
        closable: false,
        resizable: false,
        orderTpl: '',
        orderRegExp: '',
        grid: null,
        record: null,
        idx: null,
        items: [{
            xtype: 'form',
            url: 'config.php',
            labelWidth: 135,
            monitorValid: true,
            frame: true,
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Localize.Print,
                formBind: true,
                handler: function(B){
                    B.findParentByType('form').getForm().submit({
                        method: 'POST',
                        waitTitle: Localize.Connecting,
                        waitMsg: Localize.SendingData + '...',
                        success: function(f, a){
                            var A = Ext.util.JSON.decode(a.response.responseText);
                            Download({
                                devision: 199,
                                docid: A.docid,
                                getrcptfile: A.fileid
                            });
                            payForm.hide();
                        },
                        failure: function(f, a){
                            if (a.failureType == 'server') {
                                obj = Ext.util.JSON.decode(a.response.responseText);
                                Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
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
                value: 199
            }, {
                xtype: 'hidden',
                id: 'receiptid',
                value: 0
            }, {
                xtype: 'hidden',
                id: 'receiptdate',
                value: ''
            }, {
                xtype: 'hidden',
                id: 'receiptsum',
                value: 0
            }, {
                xtype: 'hidden',
                id: 'receiptnum',
                value: 0
            }, {
                xtype: 'hidden',
                id: 'receiptuid',
                value: 0
            }, {
                xtype: 'hidden',
                id: 'receiptagrm',
                value: 0
            }, {
                xtype: 'combo',
                id: 'getrpt',
                hiddenValue: 'docid',
                lazyRender: true,
                hiddenName: 'getreceipt',
                fieldLabel: Localize.DocumentsTemplates,
                allowBlank: false,
                store: Receipts,
                displayField: 'name',
                valueField: 'docid',
                editable: false,
                mode: 'local',
                triggerAction: 'all'
            }]
        }],
        listeners: {
            show: function(f){
                Ext.getCmp('receiptid').setValue(payForm.record.data.recordid);
                Ext.getCmp('receiptsum').setValue(payForm.record.data.amount);
                Ext.getCmp('receiptnum').setValue(payForm.record.data.recipe);
                Ext.getCmp('receiptdate').setValue(!Ext.isPrimitive(payForm.record.data.date) ? payForm.record.data.date.format('Y-m-d H:i:s') : payForm.record.data.date);
                Ext.getCmp('receiptuid').setValue(payForm.record.data.uid);
                Ext.getCmp('receiptagrm').setValue(payForm.record.data.agrmid);
            }
        }
    });
});




/**
 * Create and replace currency symbols child in the payment form
 * @param	object, formObject
 * @param	string, currency symbol
 */
function currencySymbols( A, B )
{
	for(var i = 0, off = 3; i < 3; i++){ 
		var C = new Ext.Element(document.createElement('p'));
		C.dom.innerHTML = B;
		C.replace(A.findById('currency_sym_' + i).body.first());
	}
} // end currencySymbols

