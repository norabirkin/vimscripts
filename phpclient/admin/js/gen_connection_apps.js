/**
 * Agreements groups:
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	showGenAppsPanel('genAppsPanel');
});

function showGenAppsPanel(A) {
    if (!document.getElementById(A)) {
        return;
    }
	
	new Ext.Panel({
	    frame: false,
	    bodyStyle: 'padding: 0px;',
	    border: false,
	    layout: 'fit',
	    width: 900,
		height: 300,
	    renderTo: A,
		title: Ext.app.Localize.get('Generation of applications for connection'),
	    items: [{
			xtype: 'form',
			frame: true,
			border: false,
			padding: 15,
			layout: 'form',
			labelWidth: 150,
			defaults: {
				width: 350,
				allowBlank: false,
				editable: false
			},
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 112
			}, {
				xtype: 'hidden',
				name: 'genapps',
				value: 1
			}, {
				xtype: 'numberfield',
				fieldLabel: Ext.app.Localize.get('Amount of applications'),
				allowNegative: false,
				editable: true,
				name: 'count',
				minValue: 1
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Templates to generate agreement number'),
				mode: 'local',
				hiddenName: 'agrmnumtempl',
				triggerAction: 'all',
				valueField: 'template',
				displayField: 'name',
				store: {
					xtype: 'jsonstore',
					autoLoad: true,
	                root: 'results',
	                fields: ['template', 'name'],
	                baseParams: {
	                	async_call: 1,
	                	devision: 22,
	                	getagrmtpls: 1
	                }
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('User template'),
				mode: 'local',
				hiddenName: 'uidtempl',
				triggerAction: 'all',
				valueField: 'uid',
				displayField: 'name',
				store: {
					xtype: 'jsonstore',
					autoLoad: true,
	                root: 'results',
	                fields: ['uid', 'name'],
	                baseParams: {
	                	async_call: 1, // get user templates
	                	devision: 112,
	                	gettemplates: 1
	                }
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Responsible'), 
				mode: 'local',
				hiddenName: 'responsibleid',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'name',
				value: null,
				store: {
					xtype: 'jsonstore',
					autoLoad: true,
	                root: 'results',
	                fields: ['id', 'name'], // get managers
	                baseParams: {
	                	async_call: 1,
	                	devision: 112,
	                	getmanagers: 1
	                }
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Operator'), 
				mode: 'local',
				hiddenName: 'operid',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'descr',
				value: null,
				store: {
					xtype: 'jsonstore',
					autoLoad: true,
	                root: 'results',
	                fields: ['id', 'descr'], // get operators
	                baseParams: {
	                	async_call: 1,
	                	devision: 22,
	                	getoperlist: 1
	                }
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Payment method'),
				mode: 'local',
				hiddenName: 'paymentmethod',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'name',
				store: {
					xtype: 'arraystore',
	                fields: ['id', 'name'],
	                data: [
						[0, Ext.app.Localize.get('Advance')],
						[1, Ext.app.Localize.get('Credit acc')],
						[2, Ext.app.Localize.get('Mixed')]
					]
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Application type'), 
				mode: 'local',
				hiddenName: 'appltypeid',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'descr',
				store: {
					xtype: 'jsonstore',
					autoLoad: true,
	                root: 'results',
	                fields: ['id', 'descr'], // get app types
	                baseParams: {
	                	async_call: 1,
	                	devision: 111,
	                	getappltypes: 1
	                }
				}
			}],
			buttonAlign: 'center',
			buttons: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Form'),
				formBind: true,
				handler: function(Btn) {
					var form = Btn.findParentByType('form').getForm();
					
					form.submit({
						method: 'POST',
						timeout: 380000,
						waitTitle: Ext.app.Localize.get('Generate agreements'),
						waitMsg: Ext.app.Localize.get('Loading') + '...',
						success: function(form, action){
							var result = Ext.util.JSON.decode(action.response.responseText);
							if(result.success) Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Agreements generation task created'));		
						},
						failure: function(form, action){
							if (action.failureType == 'server') {
								obj = Ext.util.JSON.decode(action.response.responseText);
								Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.reason));
							}
						}
					});					
				}
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Cancel'),
				handler: function(Btn) {
			        Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Are you sure you want to clear this form'), function(B){
			            if (B != 'yes') { return; }
						Btn.findParentByType('form').getForm().reset();
					});
				}
			}]
		}]
	});
	
	
	var gridStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ 
			url: 'config.php', 
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader(
			{ root: 'results' }, [
			{ name: 'taskid', type: 'int' },
			{ name: 'createdate', type: 'string' },
			{ name: 'enddate', type: 'string' },
			{ name: 'comment', type: 'string' },
			{ name: 'status', type: 'int' },
			{ name: 'fio', type: 'string' }
		]),
		autoLoad: false,
		baseParams: {
			async_call: 1,
			devision: 112,
			getgeneratorstasks: 1
		}
	});
	
	
	var pagingBar = new Ext.PagingToolbar({
		pageSize: 50,
		store: gridStore,
		displayInfo: true,
		items: ['-', {
			xtype: 'combo',
			width: 70,
			displayField: 'id',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			value: 50,
			editable: false,
			store: new Ext.data.ArrayStore({
				data: [
					['50'],
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
	});
		
	var grid = new Ext.grid.GridPanel({
	    frame: false,
		id: 'gridPanel',
	    bodyStyle: 'padding: 0px;',
	    border: false,
	    layout: 'anchor',
	    width: 900,
		height: 400,
	    renderTo: A,
		title: Ext.app.Localize.get('Statuses of generation'),
		tbar: {
			xtype: 'toolbar',
			items: [{
				xtype: 'tbspacer',
				width: 7
			}, {
				xtype: 'tbtext', 
				text: Ext.app.Localize.get('Since') + ': '
			}, {
				xtype: 'datefield',
				itemId: 'datefrom',
				width: 90,
				format: 'd.m.Y',
				value: new Date().add(Date.MONTH, -1)
			}, {
				xtype: 'tbspacer',
				width: 7
			}, {
				xtype: 'tbtext', 
				text: Ext.app.Localize.get('Till') + ': '
			}, {
				xtype: 'datefield',
				itemId: 'dateto',
				width: 90,
				format: 'd.m.Y',
				value:  new Date()
			},{
				xtype: 'tbspacer',
				width: 5
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Show'),
				handler: function(Btn) {
					Btn.findParentByType('grid').getStore().reload({
						params: {
							datefrom: Btn.findParentByType('toolbar').items.get('datefrom').getValue(),
							dateto: Btn.findParentByType('toolbar').items.get('dateto').getValue()
						} 
					});
				}
			}]
		},
		columns: [{
			header: '#',
			dataIndex: 'taskid',
			width: 40
		}, {
			header: Ext.app.Localize.get('Date from'),
			dataIndex: 'createdate',
			width: 130
		}, {
			header: Ext.app.Localize.get('Date to'),
			dataIndex: 'enddate',
			width: 130
		}, {
			header: Ext.app.Localize.get('Full name'),
			dataIndex: 'fio',
			width: 350
		}, {
			header: Ext.app.Localize.get('Status'),
			dataIndex: 'status',
			width: 220,
			flex: 1,
			renderer: function(value) {
				switch(value) {
				case 0:
					return Ext.app.Localize.get('Complete');
					break;
				case 1:
					return Ext.app.Localize.get('Prepare for generation');
					break;
				case 2:
					return Ext.app.Localize.get('In progress');
					break;
				case 3:
					return Ext.app.Localize.get('Canceled');
					break;
				case 4:
					return Ext.app.Localize.get('Generation error');
					break;
				}
			}
		}],
		store: gridStore,
        bbar: pagingBar
	});
	
};
