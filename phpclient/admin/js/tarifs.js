/**
 * Works with tariff data
 * New version
 * @author LANBilling
 */


/**
 * Run when document is already loaded
 *
 */
Ext.onReady(function() {
    Ext.QuickTips.init();
    // Show catalogue control Panel to edit catalog and and or modify its entries
    getTarifGridPanel('TarifPanel');
}); // end Ext.onReady()


/**
 * Show window with tariffs
 * @param   object, config
 *          win: window config
 *          To process selected items pass { win: { callback: [FUNCTION] } }
 *              there will be passed grid object, use grid.getSelectionModel()[.getSelected(), .getSelection()]
 *          grid: grid config
 *          To pass filter use { grid: { filter: [OBJECT] } }
 * 
 */
function getTarifGridWindow( config )
{
    var config = config || {};
    config.win = config.win || {},
    config.grid = config.grid || {};
    
    config.win = Ext.apply(config.win, {
        modal: true,
        constrain: true
    });
    
    new Ext.Window({
        title: config.win.title || Ext.app.Localize.get('Tarifs'),
        layout: 'fit',
        width: 900,
        height: 600,
        modal: config.modal || true,
        items: getTarifGrid(Ext.applyIf(config.grid, {
            editBtn: false,
            cpBtn: false,
            rmBtn: false,
            sm: { singleSelect: true }
        })),
        buttonAlign: 'center',
        buttons: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Assign'),
            handler: function(Btn) {
                var win = Btn.findParentByType('window');
                if(this.callback) {
                    this.callback(win.get(0));
                }
                win.close();
            }.createDelegate(config.win)
        }]
    }).show(null, function(win){
        win.get(0).getStore().reload({
            params: {
                start: 0
            }
        });
    });
}


/**
 * Render grid panel
 * @param   string, render to
 */
function getTarifGridPanel( id )
{
    var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }
    
    new Ext.TabPanel({
        plain: true,
        activeItem: 0,
        renderTo: id,
        height: 744,
        width: 900,
        listeners: {
            afterrender: function(panel) {
                panel.get(0).getStore().reload({
                    params: {
                        start: 0
                    }
                });
            }
        },
        items: [getTarifGrid({
            title: Ext.app.Localize.get('Tarifs'),
            cookie: 'node4',
            editBtn: true,
            cpBtn: true,
            rmBtn: true
        })]
    })
}


/**
 * Get tariffs grid
 * @param   object, configuration data
 * 
 * @return  object (not rendered)
 */
function getTarifGrid (config)
{
    var config = config || {}, 
        filter = config['filter'] || {},
        cookie = config['cookie'] || null,
        sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: (!Ext.isDefined(config['sm']) || !config['sm']) ? false : true }),
        
        editBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Edit'),
            width: 22,
            iconCls: 'ext-edit'
        }),
        
        copyBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Copy') + ' ' + Ext.app.Localize.get('tarif'),
            width: 26,
            iconCls: 'ext-tarif-copy'
        }),
        
        rmBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Remove'),
            width: 22,
            iconCls: function(record) {
                return (record.get('vgroups') == 0 ? 'ext-drop' : 'ext-drop-dis');
            }
        });
    
    config.toolbar = config.toolbar || {};
    
    if(config['filter']) {
        delete config.filter;
    }
    
    if(config['cookie']) {
        delete config.cookie;
    }
    
    editBtn.on('action', function(grid, record){
        submitForm('_Tarif', 'tarif', record.get('tarid'));
    });
    
    copyBtn.on('action', function(grid, record){
		var gridmask = new Ext.LoadMask(grid.getEl(), { 
			msg: 'Loading...'
		});
		gridmask.show();	
		
        Ext.Ajax.request({
            url: 'config.php',
            timeout: 380000,
            method: 'POST',
            params: {
                async_call: 1,
                devision: 4,
                tarifcopy: record.get('tarid')
            },
            scope: {
                grid: grid,
                record: record
            },
            callback: function(opt, success, res) {
                try {
                    var data = Ext.decode(res.responseText);
                    gridmask.hide();
					
                    if(!data.success) {
                        throw(data.error);
                    }
                    
                    Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully') + '<br>' + Ext.app.Localize.get('Edit') + ' ' + Ext.app.Localize.get('tarif') + '?', function(Btn){
                        if(Btn != 'yes') {
                            this.grid.getStore().reload({
                                params: {
                                    start: 0
                                }
                            });
                        }
                        else {
                            submitForm('_Tarif', 'tarif', this.data.results);
                        }
                    }, Ext.apply(this, { data: data }));
                }
                catch(e) {
                    Ext.Msg.error(e);
                }
            }
        });
    });
    
    rmBtn.on('action', function(grid, record){
        if(record.get('vgroups') > 0) {
            return;
        }
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 4,
                    tardelete: record.get('tarid')
                },
                scope: this,
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);
                                        
                        if(!data.success) {
                            throw(data.error);
                        }
                        
                        this.grid.getStore().reload();
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record
        });
    });
    
    var columns = [{
        header: Ext.app.Localize.get('ID'),
        width: 80,
		sortable: true,
        dataIndex: 'tarid'
    }, {
        header: Ext.app.Localize.get('Description'),
        dataIndex: 'descr',
		sortable: true,
        id: 'tar-descr-col-exp',
        renderer: function(value, meta, record) {
        	meta.style += record.get('unaval') > 0 ? 'color:red;' : '';
        	return value;
        }
    }, {
        header: Ext.app.Localize.get('Write rent off'),
        dataIndex: 'type',
		sortable: true,
        width: 140,
        renderer: function(value, meta, record) {
            if(value < 5) {
                if(value == 3 || value == 4) {
                    if(record.get('dailyrent') == 0 && record.get('actblock')) {
                        return Ext.app.Localize.get('Month');
                    }
                    else {
                        return Ext.app.Localize.get(record.get('dailyrent') == 1 ? 'Day' : 'Month')
                    }
                }
                else {
                    return Ext.app.Localize.get(record.get('dailyrent') == 1 ? 'Day' : 'Month');
                }
            }
            return '-';
        }
    }, {
        header: Ext.app.Localize.get('Rent'),
        width: 120,
		sortable: true,
        dataIndex: 'rent',
        renderer: function(value, meta, record) {
            return (record.get('type') < 5 ? value : '-') + ' (' + record.get('symbol') + ')';
        }
    }, {
        header: Ext.app.Localize.get('Accounts'),
        width: 110,
		sortable: true,
        dataIndex: 'vgroups',
        renderer: function(value, meta) {
        	if(value > 0) {
        		return '<a href="#">' + value + '</a>';
        	}
        	return value;
        }
    }];
    
    if(config['cpBtn']) {
        columns.unshift(copyBtn);
        delete config.cpBtn;
    }
    
    if(config['editBtn']) {
        columns.unshift(editBtn);
        delete config.editBtn;
    }
    
    if(config['sm']) {
        columns.unshift(sm);
        delete config.sm;
    }
    
    if(config['rmBtn']) {
        columns.push(rmBtn);
        delete config.rmBtn;
    }

    var grid = new Ext.grid.GridPanel(Ext.apply({
        PAGELIMIT: 100,
        loadMask: true,
        autoExpandColumn: 'tar-descr-col-exp',
        stateful: true,
        stateId: 'TarGrid',
        listeners: {
            beforerender: function(grid) {
                grid.setPagePanel();
                // Synchronize filter with store
                grid.getStore().syncStore = function() {
                    this.getTopToolbar().syncToolStore();
                    return this.getStore().baseParams;
                }.createDelegate(grid);
            },
            cellclick: function(grid, rowIndex, columnIndex, e) {
            	var record = grid.getStore().getAt(rowIndex);
            	if(e.getTarget('a')) {
            		showAccounts({filter: {tarid: record.get('tarid')}});
            	}
            }
        },
        tbar: [Ext.apply({
            xtype: 'combo',
            valueField: 'id',
            displayField: 'name',
            name: 'tartype',
            mode: 'local',
            typeAhead: true,
            forceSelection: true,
            triggerAction: 'all',
            value: cookie && Ext.app.DefaultView.exists(cookie) ? Ext.app.DefaultView.get(cookie, 'x1', 0) : config.moduletype,
            listeners: {
                select: function(combo) {
                    if(this.config.cookie) {
                        Ext.app.DefaultView.set(this.config.cookie, {
                            x1: combo.getValue()
                        });
                    }
                    combo.findParentByType('grid').getStore().reload({
						params: {
							start: 0
						}
					});
                }.createDelegate({
                    config: {
                        cookie: cookie
                    }
                })
            },
            store: {
                xtype: 'arraystore',
                fields: ['id', 'name'],
                data: [
                    [-1, Ext.app.Localize.get('All')],
                    [0, Ext.app.Localize.get('Leased line')],
                    [1, 'Dialup (' + Ext.app.Localize.get('by size') + ')'],
                    [2, 'Dialup (' + Ext.app.Localize.get('by time') + ')'],
                    [3, Ext.app.Localize.get('Telephony')],
                    [4, 'IP ' + Ext.app.Localize.get('Telephony')],
                    [5, Ext.app.Localize.get('Services')]
                ]
            }
        }, config.toolbar.tartype || {}), {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'textfield',
            itemId: 'tarname',
            name: 'tarname',
            width: 200,
            value: cookie && Ext.app.DefaultView.exists(cookie) ? Ext.app.DefaultView.get(cookie, 'x2', '') : '',
            listeners: {
                afterrender: function() {
                    this.on('specialkey', function(f, e){
                        if (e.getKey() == e.ENTER) {
                            var Btn = this.ownerCt.get('searchBtn');
                            Btn.handler(Btn);
                        }
                    }, this);
                }
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            iconCls: 'ext-search',
            itemId: 'searchBtn',
            text: Ext.app.Localize.get('Show'),
            handler: function(Btn) {
                Ext.app.DefaultView.set(this.config.cookie, {
                    x2: Btn.ownerCt.get('tarname').getValue()
                });
                Btn.findParentByType('grid').getStore().reload({
                    params: {
                        start: 0
                    }
                });
            }.createDelegate({
                config: {
                    cookie: cookie
                }
            })
        }],
        bbar: {
            xtype: 'paging',
            pageSize: 0,
            displayInfo: true
        },
        viewConfig: {
        	getRowClass: function(record, rowIndex, rp) {
        		return record.get('additional') ? 'x-type-multitarif' : '';
        	}
        },
        columns: columns,
        plugins: [editBtn, copyBtn, rmBtn],
        sm: sm,
        store: {
            xtype: 'jsonstore',
            root: 'results',
            totalProperty: 'total',
            fields: [
                'tarid', 'descr', 'type', 'actblock', 'dailyrent', 'unaval',
                'rent', 'symbol', 'vgroups', 'additional'
            ],
            remoteSort: true,
            sortInfo: {
                field: 'descr',
                direction: 'ASC'
            },
            baseParams: Ext.apply({
                async_call: 1,
                devision: 4,
                gettariffs: 1,
                limit: 100
            }, filter)
        }
    }, config || {}));
    
    return grid;
} // end getTarifGrid()
