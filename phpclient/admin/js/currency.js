/**
 * JavaScript engine for the Currencies and rate values
 *
 * Repository information:
 * $Date: 2009-11-03 13:22:02 $
 * $Revision: 1.1.2.4 $
 */


/**
 * Run when document is already loaded
 *
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	// Show currency panel on page ready
	showCurrencyPanel('CurrencyPanel');
}); // end Ext.onReady()


/**
 * Currency panel
 *
 */
function showCurrencyPanel( renderTo )
{
	new Ext.Panel({
		id: 'CurPanel',
		frame: false,
		bodyStyle: 'padding:0px',
		border: false,
		layout: 'column',
		height: 312,
		//width: 960,
		title: Localize.Currency + ' / ' + Localize.Rate,
		renderTo: renderTo,
		tbar: [
			{
				xtype: 'button',
				iconCls: 'ext-add',
				text: Localize.CreateCurrency,
				handler: function() {
					CurrencyForm({})
				}
			}, {
				xtype: 'button',
				iconCls: 'ext-edit',
				text: Localize.ChangeCurrency,
				handler: function() {
					try {
						var A = this.ownerCt.ownerCt.findByType('treepanel')[0].getSelectionModel().getSelectedNode().attributes;
					}
					catch(e){
						A = {};
					}
					CurrencyForm(A)
				}
			}, {
				xtype: 'button',
				iconCls: 'ext-remove',
				text: Localize.Remove,
				handler: function() {
					try {
						var A = this.ownerCt.ownerCt.findByType('treepanel')[0].getSelectionModel().getSelectedNode();
						var F = new Ext.form.FormPanel({
							renderTo: Ext.getBody(),
							url: 'config.php',
							items: [
								{ xtype: 'hidden', id: 'devision', value: 14 },
								{ xtype: 'hidden', id: 'async_call', value: 1 },
								{ xtype: 'hidden', id: 'curr_remove', value: A.attributes.id }
							]
						});

						F.getForm().submit({
							url: 'config.php',
							method:'POST',
							scope: F,
							waitTitle: Localize.Connecting,
							waitMsg: Localize.SendingData + '...',
							success: function(form, action){
								try {
									Ext.getCmp('curList').root.reload();;
								}
								catch(e) { }
								this.destroy();
							},
							failure: function(form, action){
								if(action.failureType == 'server')
								{
									obj = Ext.util.JSON.decode(action.response.responseText)
									Ext.Msg.alert('Error!', obj.errors.reason);
								}
								this.destroy();
							}
						});
					}
					catch(e){ }
				}
			}
		],
		items:
			[{
				columnWidth: 0.20,
				layout: 'fit',
				items: {
					xtype: 'treepanel',
					id: 'curList',
					autoScroll: true,
					animate: true,
					border: false,
					width: 214,
					height: 257,
					containerScroll: true,
					selModel: new Ext.tree.DefaultSelectionModel(),
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({ iconCls: 'ext-book' }),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: { async_call: 1, devision: 14, getcurlist: 1 },
						listeners: { load: parseLeaves }
					}),
					listeners: {
						click: selectLeaf
					}
				}
			}, {
				columnWidth: 0.80,
				layout: 'fit',
				id: 'rateGrid'
			}]
	}).show();
} // end showCurrencyPanel()


/**
 * Parse Tree node and apply passed properties
 * @param	object, Tree store
 * @param	object, tree node model
 * @param	object, data
 */
function parseLeaves( store, node, data ) {
	node.eachChild(function(child) {
		child.setText(Ext.util.Format.ellipsis(child.attributes.text, 34))
	});
	selectLeaf();
} // end parseLeaves()


/**
 * Select leaf. if there is no passed arguments than frist valid child group
 * @param	object, child node to select
 */
function selectLeaf( child )
{
	if(Ext.isEmpty(child)) {
		if(Ext.getCmp('curList').root.childNodes.length == 0) {
			return false;
		}

		Ext.getCmp('curList').root.eachChild(function(node){
			if(node.attributes.def > 0) {
				node.select();
				child = node;
			}
		});

		if(Ext.isEmpty(child)) {
			child = Ext.getCmp('curList').root.firstChild;
			child.select();
		}
	}

	Ext.Ajax.request({
		url: 'config.php',
		params: { async_call: 1, devision: 14, getrate: child.attributes.id },
		scope: child,
		success: function(A) {
			var TB = document.createElement('tbody');

			Date.dayNames = [
				Localize.Mon,
				Localize.Tue,
				Localize.Wed,
				Localize.Thu,
				Localize.Fri,
				Localize.Sat,
				Localize.Sun
			];

			var TR = document.createElement('tr');
			for(var d = 0; d < 7; d++) {
				var TD = document.createElement('td');
				TD.className = 'td_comm td_bold';
				TD.setAttribute('align', 'center');
				TD.style.cursor = 'default';

				if(d > 4) {
					TD.style.color = 'red';
				}

				TD.innerHTML = Date.dayNames[d];
				TR.appendChild(TD);
			}

			TB.appendChild(TR);

			try {
				var R = Ext.util.JSON.decode(A.responseText);
				var currentDate = Date.parseDate(R.current, 'Ymd');
				for(var i in R.period) {
					var d = Date.parseDate(i, 'Ymd');

					if(Ext.isEmpty(_TR)) {
						var _TR = document.createElement('tr');
					}

					var _TD = document.createElement('td');

					var H = document.createElement('input');
					H.type = 'hidden';
					H.id = 'curr_id';
					H.value = this.attributes.id;
					_TD.appendChild(H);

					var H = document.createElement('input');
					H.type = 'hidden';
					H.id = 'rate_date';
					H.value = d.format('Y-m-d');
					_TD.appendChild(H);

					var D = document.createElement('div');
					D.innerHTML = d.format('d-m-Y');
					D.style.paddingTop = '4px';
					D.style.fontStyle = 'italic';
					_TD.appendChild(D);


					var H = document.createElement('input');
					H.type = 'hidden';
					H.id = 'rate_value';

					var D = document.createElement('div');
					D.style.paddingTop = '4px';
					if(Ext.isEmpty(R.rates[i])) {
						D.innerHTML = Localize.Undefined;
						H.value = 1;
					}
					else {
						D.innerHTML = R.rates[i][0];
						H.value = R.rates[i][0];
					}
					_TD.appendChild(H);
					_TD.appendChild(D);

					_TD.className = 'td_comm';
					_TD.setAttribute('align', 'right');
					_TD.style.cursor = 'pointer';
					_TD.onmouseover = function(){ this.style.backgroundColor = '#dadfec' };
					_TD.onmouseout = function(){ this.style.backgroundColor = '' };
					_TD.onclick = function(){
						var A = { currency: 0, date: '', value: 1 };
						Ext.each(this.childNodes, function(node){
							if(node.id == 'curr_id') {
								this.currency = node.value;
							}

							if(node.id == 'rate_date') {
								this.date = node.value;
							}

							if(node.id == 'rate_value') {
								this.value = node.value;
							}
						}, A);

						rateForm(A);
					}

					if(d.format('m') != currentDate.format('m')) {
						_TD.style.color = '#a0a0a0';
					}

					_TR.appendChild(_TD);

					if(d.format('w') == 0) {
						TB.appendChild(_TR);
						var _TR = document.createElement('tr');
					}
				}
			}
			catch(e) { }

			var T = document.createElement('table');
			T.appendChild(TB);
			T.className = 'table_comm';
			T.width = '100%';
			Ext.getCmp('rateGrid').body.dom.innerHTML = '';
			Ext.getCmp('rateGrid').body.dom.appendChild(T);
		}
	})
} // end selectLeaf()


/**
 * Create new currency or edtit existing
 * @param	object, selected leaf attributes
 */
function CurrencyForm( currency )
{
	if(Ext.getCmp('CurrencyForm')) return;

	if(Ext.isEmpty(currency.id)) {
		currency = { id: 0, def: 0, symbol: '', name: '', text: '' };
	}


    var curStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader( { root: 'results' }, [ { name: 'recordid', type: 'int' }, { name: 'name', type: 'string' } ]),
        baseParams: { async_call: 1, devision: 14, getDefCurr: 1 },
        autoLoad: true,
        sortInfo: {
            field:     'name',
            direction: 'ASC'
        }
    });
    curStore.load({
       callback: function() {
          curCombo.setValue(currency.codeokv);
       }
    });

    var curCombo = new Ext.form.ComboBox({
        xtype: 'combo',
        width: 165,
        fieldLabel: Ext.app.Localize.get('Currency from dictionary'),
        tpl: '<tpl for="."><div class="x-combo-list-item">{[values.recordid + ". " + values.name]}</div></tpl>',
        itemSelector: 'div.x-combo-list-item',
        triggerAction:'all',
        editable:false,
        forceSelection:true,
        valueField:'recordid',
        displayField:'name',
        hiddenName:'codeokv',
        name: 'codeokv',
        lazyInit: false,
        listWidth: 300,
        allowBlank: false,
        value: currency.codeokv,
        emptyText: Ext.app.Localize.get('Select a currency...'),
        loadingText: Ext.app.Localize.get('Receiving currency list...'),
        selectOnFocus:true,
        store: curStore
    });




    var currForm = new Ext.form.FormPanel({
		frame: true,
		buttonAlign: 'center',
		monitorValid: true,
		items:[ { xtype: 'hidden', name: 'async_call', value: 1 },
			{ xtype: 'hidden', name: 'devision', value: 14 },
			{ xtype: 'hidden', id: 'savecurr', value: currency.id },
			{ xtype: 'textfield',width: 165, fieldLabel: Localize.Name, id: 'currname', allowBlank: false, value: currency.name },
			{ xtype: 'textfield',width: 165, fieldLabel: Localize.Symbol, id: 'currsymb', allowBlank: false, value: currency.symbol },
			{ xtype: 'checkbox', fieldLabel: Localize.Default, id: 'currdef', checked: currency.def },
            curCombo
		],
		buttons: [{
				text: Localize.Save,
				formBind: true,
				handler: function(){
					currForm.getForm().submit({
						url: 'config.php',
						method:'POST',
						waitTitle: Localize.Connecting,
						waitMsg: Localize.SendingData + '...',
						success: function(form, action){
							try {
								Ext.getCmp('curList').root.reload();;
							}
							catch(e) { }
							Win.destroy();
						},
						failure: function(form, action){
							if(action.failureType == 'server')
							{
								obj = Ext.util.JSON.decode(action.response.responseText)
								Ext.Msg.alert('Error!', obj.errors.reason);
							}
							Win.destroy();
						}
					})
				}
			},{
				text: Localize.Cancel,
				handler: function(){
					this.ownerCt.ownerCt.findParentByType('window').close();
				}
			}]
	});


	var Win = new Ext.Window({
		id: 'CurrencyForm',
		shadow: false,
		title: (currency.id == 0) ? Localize.CreateCurrency : Localize.ChangeCurrency + ': ' + currency.name,
		width: 300,
		defaults: { labelWidth: 100 },
		items: currForm
	}).show();
} // end CurrencyForm()


/**
 * Set rate value for the selected currency
 * @param	object, { cuurency, period }
 */
function rateForm( object )
{
	if(Ext.getCmp('rateForm')) return;

	object = object || { currency: 0, date: '', value: 1 };

	var rateForm = new Ext.form.FormPanel({
		frame: true,
		buttonAlign: 'center',
		monitorValid: true,
		items:[ { xtype: 'hidden', name: 'async_call', value: 1 },
			{ xtype: 'hidden', name: 'devision', value: 14 },
			{ xtype: 'hidden', name: 'saverate', value: object.currency },
			{
				xtype: 'datefield',
				fieldLabel: Localize.Since,
				name: 'startdate',
				width: 100,
				format: 'Y-m-d',
				value: Date.parseDate(object.date, 'Y-m-d'),
				allowBlank: false
			}, {
				xtype: 'datefield',
				fieldLabel: Localize.Till,
				name: 'enddate',
				width: 100,
				format:'Y-m-d'
			}, {
				xtype: 'textfield',
				fieldLabel: Localize.Value,
				name: 'rate',
				value: object.value
			}],
		buttons: [{
				text: Localize.Save,
				formBind: true,
				handler: function(){
					rateForm.getForm().submit({
						url: 'config.php',
						method:'POST',
						waitTitle: Localize.Connecting,
						waitMsg: Localize.SendingData + '...',
						success: function(form, action){
							try {
								selectLeaf(Ext.getCmp('curList').getSelectionModel().getSelectedNode());
							}
							catch(e) { }

							Win.destroy();
						},
						failure: function(form, action){
							if(action.failureType == 'server')
							{
								obj = Ext.util.JSON.decode(action.response.responseText)
								Ext.Msg.alert('Error!', obj.errors.reason);
							}
							Win.destroy();
						}
					})
				}
			},{
				text: Localize.Cancel,
				handler: function(){
					this.ownerCt.ownerCt.findParentByType('window').close();
				}
			}]
	});

	var Win = new Ext.Window({
		id: 'rateForm',
		shadow: false,
		title: Localize.CurrencyRate,
		width: 300,
		defaults: { labelWidth: 100 },
		items: rateForm
	}).show();
} // end rateForm()