/**
 * Installment Planning:
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	InstallmentsPanel('installmentsPanel');
});

function InstallmentsPanel(A) {
    if (!document.getElementById(A)) {
        return;
    }
	var PAGELIMIT = 100;
	
	// Grid buttons
	var insDelete = new Ext.grid.RowButton({ 
		header: '&nbsp;', 
		qtip: Ext.app.Localize.get('Remove'), 
		width: 25, 
		iconCls: 'ext-drop',
        iconCls: function(record) {
        	return record.get('inuse')>0 ? 'ext-drop-dis' : 'ext-drop'; // Disable icon if installment already in use
        }
	});
	
    insDelete.on('action', function(grid, record, idx) {
		if(record.get('inuse')>0) return;  // Disable remove action if installment already in use
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('DelConfirm'), function(B){
            if (B != 'yes') { return; }
			Ext.Ajax.request({
				url: 'config.php',
				method: 'POST',
				timeout: 380000,
				params: Ext.apply({
					async_call: 1,
					devision: 29,
					delinstallment: 1,
					planid: record.get('planid')
				}),
				callback: function(opt, success, res) {
					try {
						var result = Ext.decode(res.responseText);
						if(!result.success && result.error) {
							throw(result.error);
						}
						grid.getStore().reload();
					}
					catch(e) {
						Ext.Msg.error(e);
					}
				}
			});
        });		
    });		
	// END grid buttons
	
	
	/*
	 * Generate main panel
	 */
	new Ext.Panel({
	    frame: false,
	    bodyStyle: 'padding:0px',
	    border: false,
	    layout: 'fit',
	    width: 900,
		height: 500,
	    renderTo: A,
	    items: [{ // First card start here
			xtype: 'editorgrid',
			title: Ext.app.Localize.get('Installment setup'),
			anchor: '100%',
			tbar: [{
				xtype: 'button',
				iconCls: 'ext-add',
                text: Ext.app.Localize.get('Add'),
                handler: function(Btn){
					var store = Btn.findParentByType('editorgrid').getStore();
					store.insert(0, new store.recordType({
						planid: 0,
						name: '',
						descr: '',
						duration: 6,
						firstpayment: 0
					}))
				}
			}],
			clicksToEdit: 1,
			autoCancel: false,
			listeners: {
				beforerender: function(grid) {
                    // Set paging bar
                    grid.getStore().setBaseParam('limit', PAGELIMIT);
                    var bbar = grid.getBottomToolbar();
                    bbar.pageSize = PAGELIMIT;
                    bbar.bindStore(grid.store);
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
                },
				afteredit: function(F) {
					var r = F.record;
					Ext.Ajax.request({
						url: 'config.php',
						method: 'POST',
						timeout: 380000,
						params: Ext.apply({
							async_call: 1,
							devision: 29,
							setinstallment: 1,
							planid: r.get('planid'),
							name: r.get('name'),
							descr: r.get('descr'),
							duration: r.get('duration'),
							firstpayment: r.get('firstpayment')
						}),
						callback: function(opt, success, res) {
							try {
								var result = Ext.decode(res.responseText);
								if(!result.success && result.error) {
									throw(result.error);
								}
								F.grid.getStore().reload();
							}
							catch(e) {
								Ext.Msg.error(e);
							}
						}
					});
				},
			},
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
			plugins: [insDelete],
			columns: [{
				header: Ext.app.Localize.get('ID'),
				dataIndex: 'planid',
				width: 35,
			}, {
				header: Ext.app.Localize.get('Name'),
				dataIndex: 'name',
				width: 170,
				editor: {
					xtype: 'textfield',
					name: 'name'
				}
			}, {
				header: Ext.app.Localize.get('Description'),
				dataIndex: 'descr',
				width: 385,
				editor: {
					xtype: 'textfield',
					name: 'descr'
				}
			}, {
				header: Ext.app.Localize.get('Duration') + ', ' + Ext.app.Localize.get('months'),
				dataIndex: 'duration',
				width: 150,
				editor: {
					xtype: 'numberfield',
					name: 'duration',
					minValue: 1
				}
			}, {
				header: Ext.app.Localize.get('First payment')+', %',
				dataIndex: 'firstpayment',
				width: 130,
				editor: {
					xtype: 'numberfield',
					name: 'firstpayment',
					minValue: 0,
					maxValue: 100
				}
			}, insDelete],
            store: {
            	xtype: 'jsonstore',
                root: 'results',
				autoLoad: true,
                totalProperty: 'total',
                fields: ['planid', 'name', 'descr', 'createdate', 'duration', 'firstpayment', 'inuse'],
                baseParams: {
                    async_call: 1,
                    devision: 29,
                    getinstallments: 1,
					limit: PAGELIMIT,
					start: 0
                }
            }
		}]
	});
	
}