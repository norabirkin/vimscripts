/**
 * JS Engine to view authorization log
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load List object
	showAuthLogPanel('AuthLogsList');
});
/**
 * Show log table panel
 * @param	string, DOM element id to render to
 */
function showAuthLogPanel( renderTo )
{
	var PAGELIMIT = 100;
	/**
	 * Данные процедуры (по auth_history)
	 */
	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST',
			timeout: 380000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'dt',          type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'vg_login',    type: 'string' },
			{ name: 'result',      type: 'int' },
			{ name: 'comment',     type: 'string' },
            { name: 'nas_ip',      type: 'string' },
            { name: 'session_id',  type: 'string' },
            { name: 'auth_id',     type: 'int' },
            { name: 'nas_id',      type: 'int' },
            { name: 'duration',    type: 'string' },
            { name: 'ip',          type: 'string' },
            { name: 'mac',         type: 'string' },
            { name: 'radiusAttr',  type: 'array'  }
		]),
		baseParams:{
			async_call: 1,
			devision: 20,
			getauthlogs: 1,
			// Дата
			dtfrom: new Date().format('Y-m-d'),
			dtto: new Date().add(Date.DAY, 1).format('Y-m-d'),
			// Фильтр
			searchfield: '',
			// 0-user,1-agreement,2-account
			searchtype: 0,
			// Пагинатор
			start: 0,
			limit: PAGELIMIT,
			// Статус сообщений
			typecombo: 'ALL'
		},
		remoteSort: true,
		sortInfo: {
			field: 'dt',
			direction: "DESC"
		}
	});

	new Ext.grid.GridPanel({
		renderTo: renderTo,
		title: Ext.app.Localize.get('Authorization log'),
        id: '_authGrid',
		height: 720,
		width: 980,
		loadMask: true,
		stateful: true,
		stateId: 'authorizelogs',
		tbar: new Ext.Toolbar({
			layout: 'form',
			height: 25,
			items: [{
				xtype: 'container',
				width: 975,
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [{
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '4px',
						textAlign: 'left'
					},
					html: Ext.app.Localize.get('Since') + ':'
				}, {
					xtype: 'datefield',
					id: 'dtfrom',
					format: 'Y-m-d',
					value: new Date().format('Y-m-d')
				}, {
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Till') + ':'
				}, {
					xtype: 'datefield',
					id: 'dtto',
					format: 'Y-m-d',
					value:  new Date().add(Date.DAY, 1).format('Y-m-d')
				}, {
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Events') + ':'
				}, {
					xtype: 'combo',
					id: 'typecombo',
					width: 160,
					displayField: 'name',
					valueField: 'type',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 'ALL',
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['ALL', Ext.app.Localize.get('All')],
							['ERR', Ext.app.Localize.get('All errors')],
							['OK', Ext.app.Localize.get('All successful')],
							['11', Ext.app.Localize.get('User not found')],
							['12', Ext.app.Localize.get('Blacklist')],
                            ['13', Ext.app.Localize.get('Wrong port')],
                            ['14', Ext.app.Localize.get('Wrong password')],
                            ['15', Ext.app.Localize.get('Blocked')],
                            ['16', Ext.app.Localize.get('Already connected')],
                            ['17', Ext.app.Localize.get('No free IP')]
						],
						fields: ['type', 'name']
					})
				},
				{
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Filter') + ':'
				},
				{
					xtype: 'combo',
					IE8Fix: false,
					width: 140,
					id: 'searchtype',
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('Account login')],
							['1', Ext.app.Localize.get('User')],
							['2', Ext.app.Localize.get('Agreement')],
							['3', Ext.app.Localize.get('MAC')],
							['4', Ext.app.Localize.get('Device name')]
						],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							//Store.baseParams.searchtype = this.getValue();
							//console.log(this.getValue());
							//console.log(Store.baseParams);
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'textfield',
					width: 194,
					id: 'searchfield',
					listeners: {
						afterrender: function() {
							this.on('specialkey', function(f, e){
								if (e.getKey() == e.ENTER) {
									this.ownerCt.getGrid().store.baseParams.dtfrom = this.ownerCt.findById('dtfrom').getValue().format('Y-m-d');
									this.ownerCt.getGrid().store.baseParams.dtto = this.ownerCt.findById('dtto').getValue().format('Y-m-d');
									this.ownerCt.getGrid().store.baseParams.searchtype = this.ownerCt.findById('searchtype').getValue();
									this.ownerCt.getGrid().store.baseParams.searchfield = this.ownerCt.findById('searchfield').getValue();
									this.ownerCt.getGrid().store.baseParams.typecombo = this.ownerCt.findById('typecombo').getValue();

									this.ownerCt.getGrid().store.reload({
										params: {
											start: 0,
											dtfrom: this.ownerCt.findById('dtfrom').getValue().format('Y-m-d'),
											dtto: this.ownerCt.findById('dtto').getValue().format('Y-m-d'),
											searchtype: this.ownerCt.findById('searchtype').getValue(),
											searchfield: this.getValue(),
											typecombo: this.ownerCt.findById('typecombo').getValue()
										}
									})
								}
							}, this);
						}
					}
				},
				{
					xtype: 'tbspacer',
					width: 3
				},{
					xtype: 'button',
					id : 'btn-search-vg',
					text: Ext.app.Localize.get('Show'),
					iconCls: 'ext-search',
					handler: function() {
						Ext.getCmp('_authGrid').getStore().baseParams.dtfrom = Ext.getCmp('dtfrom').getValue().format('Y-m-d');
						Ext.getCmp('_authGrid').getStore().baseParams.dtto = Ext.getCmp('dtto').getValue().format('Y-m-d');
						Ext.getCmp('_authGrid').getStore().baseParams.searchtype = Ext.getCmp('searchtype').getValue();
						Ext.getCmp('_authGrid').getStore().baseParams.searchfield = Ext.getCmp('searchfield').getValue();
						Ext.getCmp('_authGrid').getStore().baseParams.typecombo = Ext.getCmp('typecombo').getValue();

						Ext.getCmp('_authGrid').getStore().reload({
							params: {
								start: 0
							}
						})
					}
				}]
			}]
		}),
		view: new Ext.grid.GridView({
			forceFit: false,
            enableRowBody: true,
			enableNoGroups: false,
			deferEmptyText: false,
			getRowClass: function(record, index, rowBody) {
                if(record.json['radiusAttr']) {
                    rowBody.body = ['<ul class="x-line"><li><span class="x-line-sub-header">' + Ext.app.Localize.get('Saved Radius-attributes') + ':</span></li>'];
                    Ext.each(record.json['radiusAttr'], function(item){
                        for (var key in item) {
                            this.push([
                                '<li>',
                                '<b>' + key + ':</b> ' + item[key],
                                '</li>'
                            ].join(''));
                        }
                    }, rowBody.body);
                    rowBody.body.push('</ul>');
                } else {
                    rowBody.body = [];
                }
                rowBody.body.push('<div style="clear:left;height:10px"><b class="x-post-top-corner"><b class="x-post-corner-1" style="border-color:#A8C2E6"></b></b></div>');
                rowBody.body = rowBody.body.join('');
				if (record.get('result') != 0 /*|| record.get('vg_login') == ''*/) return 'x-type-payment-canceled';
				else return '';
            },
			emptyText: Ext.app.Localize.get('Check params and press Show')
		}),

		store: Store,
		cm: new Ext.grid.ColumnModel({
			columns: [{
				header: Ext.app.Localize.get('Date'),
				dataIndex: 'dt',
				width: 120,
				renderer: function(value, metaData, record) {
					try {
						return value.format('d.m.Y H:i');
					}
					catch(e) {
						return value;
					}
				}
			}, {
				header: Ext.app.Localize.get('Account'),
				dataIndex: 'vg_login'
			}, {
				header: Ext.app.Localize.get('Events'),
				dataIndex: 'result',
				renderer: function(value, metaData, record) {
					/* Пока только 2 типа: 1-есть ошибка, см.коммнтарий, 0 - ошибок нет*/
					if(record.get('result') != 0 /*|| record.get('vg_login') == 0*/) {
						return  Ext.app.Localize.get('Auth error') + ' (' + value + ')';
					}
					return '<font color="green">OK</font>';
				}
			}, {
				header: Ext.app.Localize.get('Comment'),
				id: 'comment',
                width: 150,
				dataIndex: 'comment',
                sortable: false,
				renderer: function(value, metaData, record) {
					if (record.get('vg_login') == '' && record.get("result") != 0)
						return Ext.app.Localize.get('Wrong user login');
					else
						return value.replace('<','').replace('>','');
				}
			}, {
				header: Ext.app.Localize.get('IP NAS'),
				dataIndex: 'nas_ip'
			}, {
				header: Ext.app.Localize.get('Session ID'),
				dataIndex: 'session_id'
			}, /*{
				header: Ext.app.Localize.get('auth_id'),
				dataIndex: 'auth_id'
			}, {
				header: Ext.app.Localize.get('nas_id'),
				dataIndex: 'nas_id'
			}, */{
				header: Ext.app.Localize.get('Duration'),
				dataIndex: 'duration',
                sortable: false
			}, {
				header: Ext.app.Localize.get('IP address'),
				dataIndex: 'ip'
			}, {
				header: Ext.app.Localize.get('MAC'),
				dataIndex: 'mac'
			}
//          { name: 'radiusAttr',  type: 'array'  }
            ],
			defaults: {
				sortable: true,
				menuDisabled: false
			}
		}),
		//autoExpandColumn: 'comment',
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
			}]
		})
	});
} // end showLogPanel()
