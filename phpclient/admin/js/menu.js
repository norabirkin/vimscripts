/**
 * ExtJS base system menu
 *
 */

// Объект для хранения доступов пользователя к элементам интерфейса

var Access={}

Ext.onReady(function() {

	// Currency rate ToolTip
	var ratesStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'}),
		reader: new Ext.data.JsonReader({ root: 'rates' },[ { name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }, { name: 'rate', type: 'float' } ]),
		baseParams:{ async_call: 1, devision: 14, getrates: 1 },
		autoLoad: true
	});

	new Ext.ToolTip({ target: 'lbHead_current', title: Menu.Currencies + ', ' + Menu.Rate + ' (' + ServerTime + ')',
		autoHide: false, closable: true, draggable:true,
		items: new Ext.grid.EditorGridPanel({
			store: ratesStore,
			cm: new Ext.grid.ColumnModel([ { dataIndex: 'name', width: 80 }, { dataIndex: 'rate', width: 80 }, { dataIndex: 'symbol', width: 40 } ]),
			width: 220, autoHeight: true, hideHeaders: true, frame: true, hideLabel: true
		})
	});

	clickHandler = function(el)
	{
		//console.log(el.getId());
		//console.log(menuStore);
		var fire = menuStore.getAt(menuStore.find('id', el.getId())).data;
		if(fire.access > 0)
		{
			formPanel.getComponent('lbmenu-devision').setValue(fire.devision);
			formPanel.getForm().getEl().dom.submit();
		}
		else formPanel.getComponent('lbmenu-devision').setValue(0);
	}

	var lbMenu = new Array('<span class="x-menufirst">' + ServerTime + '</span>', '-');
	for(var i = 0; i < 7; i++)
	{
		var lbBtnConf = {
			text: '', icon: '',
			iconCls: 'bmenu',
			minWidth: 110,
			menu: { xtype: 'menu', items: '' }
		};

		switch(i*1)
		{
			case 0:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Objects;
				lbBtnConf.icon = 'images/icon_objects.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Agents'), id: 'lbmenu-agents', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Users'), id: 'lbmenu-users', handler: function() { clickHandler(this) }, disabled: true, menu: [
						{ text: Ext.app.Localize.get('Agreements'), id: 'lbmenu-agrms', handler: function(){ clickHandler(this) }} ] },
					{ text: Ext.app.Localize.get('Accounts'), id: 'lbmenu-accounts', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Users groups'), id: 'lbmenu-usersgroups', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Agreements groups'), id: 'lbmenu-agrmgroups', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Unions'), id: 'lbmenu-unions',  handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Pre-paid cards'), id: 'lbmenu-cards', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Managers'), id: 'lbmenu-managers', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Postmans'), id: 'lbmenu-postmans', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Strict reporting forms'), id: 'lbmenu-bso', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Registry'), id: 'lbmenu-registry', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Inventory'), id: 'lbmenu-inventory', menu: [
                            { text: Ext.app.Localize.get('Edit devices'), id: 'lbmenu-invmdfdev', handler: function() { clickHandler(this) }, disabled: true },
                            { text: Ext.app.Localize.get('Control Policies'), id: 'lbmenu-invcntplc', handler: function() { clickHandler(this) }, disabled: true },
                            { text: Ext.app.Localize.get('Devices List'), id: 'lbmenu-invdevlst', handler: function() { clickHandler(this) }, disabled: true },
                            { text: Ext.app.Localize.get('Vlans'), id: 'lbmenu-vlans', handler: function() { clickHandler(this) }, disabled: true },
                            { text: Ext.app.Localize.get('Client devices'), id: 'lbmenu-clientdevices', handler: function() { clickHandler(this) }, disabled: true }
                        ]
                    },
					{ text: Ext.app.Localize.get('Currency rate'), id: 'lbmenu-currency', handler: function() { clickHandler(this) }, disabled: true }];
			break;

			case 1:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Properties;
				lbBtnConf.icon = 'images/icon_properties.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Tarifs'), id: 'lbmenu-tarifs', handler: function() { clickHandler(this) }, disabled: true, menu: [{
						text: Ext.app.Localize.get('Service Codes'), id: 'lbmenu-serv_codes', handler: function() { clickHandler(this) }, disabled: false
					}, {
						text: Ext.app.Localize.get('Installment setup'), id: 'lbmenu-installments', handler: function() { clickHandler(this) }, disabled: false
					}] },
					{ text: Ext.app.Localize.get('Catalogues'), id: 'lbmenu-catalogues', handler: function() { clickHandler(this) }, disabled: true, menu: [
                        { text: Ext.app.Localize.get('Master categories'), id: 'lbmenu-tarcat', handler: function() { clickHandler(this) }} ] },
                    { text: Ext.app.Localize.get('Services packages'), id: 'lbmenu-servpacks', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Payments'), id: 'lbmenu-cashonhand', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Cards groups'), id: 'lbmenu-cardsets', handler: function() { clickHandler(this) }, disabled: true },
					{ text: 'RADIUS-' + Ext.app.Localize.get('attributes'), id: 'lbmenu-radattr', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Services'), id: 'lbmenu-services', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Promotions'), id: 'lbmenu-actions', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Matrix discounts'), id: 'lbmenu-matrixdisc', handler: function() { clickHandler(this) }, disabled: true }
					];
			break;

			case 2:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Actions;
				lbBtnConf.icon = 'images/icon_actions.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Generate') + ' ' + Ext.app.Localize.get('pre-paid cards'), id: 'lbmenu-createcards', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Generate') + ' ' + Ext.app.Localize.get('printing forms'), id: 'lbmenu-createbills', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Generate') + ' ' + Ext.app.Localize.get('users reports'), id: 'lbmenu-createreports', handler: function() { clickHandler(this) }, disabled: true },
                    { text: Ext.app.Localize.get('Generate') + ' ' + Ext.app.Localize.get('sales'), id: 'lbmenu-createsales', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Generate') + ' ' + Ext.app.Localize.get('applications for connection'), id: 'lbmenu-genconnectionapps', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Re-count'), id: 'lbmenu-re-count', handler: function() { clickHandler(this) }, disabled: true }];
			break;

			case 3:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Reports;
				lbBtnConf.icon = 'images/icon_reports.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Statistics'), id: 'lbmenu-statistics', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Printing forms'), id: 'lbmenu-accountancy', handler: function() { clickHandler(this) }, disabled: true, menu: [{
						text: 'Documents of charges', id: 'lbmenu-accountancydocs', handler: function() { clickHandler(this) }, disabled: false
					}]},
					{ text: Ext.app.Localize.get('Groupped invoice'), id: 'lbmenu-grouppedorders', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Events log'), id: 'lbmenu-eventslog', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Authorization log'), id: 'lbmenu-authlog', handler: function() { clickHandler(this) }, disabled: true }
				];
			break;

			case 4:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Options;
				lbBtnConf.icon = 'images/icon_options.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Common'), id: 'lbmenu-common', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Operator details'), id: 'lbmenu-operdetails', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Documents settings'), id: 'lbmenu-documentset', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Trusted hosts'), id: 'lbmenu-trustedhosts', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Service functions'), id: 'lbmenu-servicefunc', handler: function() { clickHandler(this) }, disabled: true }];
			break;

			case 5:
				lbBtnConf.text = '&nbsp;&nbsp;Helpdesk';
				lbBtnConf.icon = 'images/icon_helpdesk.gif';
				lbBtnConf.menu.items = [
					{ text: Ext.app.Localize.get('Applications'), id: 'lbmenu-applications', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Requests'), id: 'lbmenu-hdrequests', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Knowledges'), id: 'lbmenu-hdknowledges', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Settings'), id: 'lbmenu-hdsettings', handler: function() { clickHandler(this) }, disabled: true },
					{ text: Ext.app.Localize.get('Messages'), id: 'lbmenu-broadcast', handler: function() { clickHandler(this) }, disabled: true }];
			break;

			case 6:
				lbBtnConf.text = '&nbsp;&nbsp;' + Menu.Logout;
				lbBtnConf.icon = 'images/icon_logout.gif';
				lbBtnConf.menu = false;
				lbBtnConf.handler = function() { formPanel.getComponent('lbmenu-devision').setValue(99); formPanel.getForm().getEl().dom.submit(); }
			break;
		}

		lbMenu[lbMenu.length] = lbBtnConf;
		lbMenu[lbMenu.length] = '-';
	}



	var menuStore;

	Ext.Ajax.request({
		   url: 'config.php',
		   method: 'POST',
		   success: function(a){

				row=Ext.util.JSON.decode(a.responseText);
				menuData=Ext.data.Record.create(row.items);

				menuStore = new Ext.data.Store({
			    	reader: new Ext.data.JsonReader({
			    		fields: [
									{ name: 'id', type: 'string' },
									{ name: 'access', type: 'int' },
									{ name: 'text', type: 'string' },
									{ name: 'devision', type: 'int' }
								]
			    	}),
			        proxy: new Ext.data.MemoryProxy(row.items),
			        listeners: { load: function(store, data, object) {
					//console.log(data);return;
						Ext.each(data, function(record) {
							try {
								if(record.data.access > 0) {
									if(Ext.getCmp(record.data.id)) Ext.getCmp(record.data.id).enable();
								} else {
									 if(Ext.getCmp(record.data.id)) Ext.getCmp(record.data.id).disable();
								}
								if(!Ext.isEmpty(record.data.text)) Ext.getCmp(record.data.id).text = record.data.text;
							} catch(e) { }
						});

					}},
			        autoLoad: true
			    });

				Access=row.access;
				if (typeof(accessReady)=='function'){
					accessReady();
				}
		   },

		   params: { async_call: 1, devision: 0 }
		});





	var formPanel = new Ext.form.FormPanel({
			id: 'ext-lbMenu',
			frame: false,
			height: 28,
			width: 1024,
			cls: 'x-menuform',
			items: [ {xtype: 'hidden', id: 'lbmenu-devision', name: 'devision', value: 0} ],
			tbar: new Ext.Toolbar({ cls: 'x-menubar', items: lbMenu }),
			renderTo: 'lbMenu'
	});
});
