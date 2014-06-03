// Auto render
Ext.onReady(function() {
    Ext.QuickTips.init();
    
    renderPromotionPanel('ADPanel');
});

/**
 * Render promotion panel
 * @param   string, dom element ot render to
 * 
 */
function renderPromotionPanel( id ) {
    var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }
    
    var panel = getPromotionPanel({
        title: Ext.app.Localize.get('Promotions')
    });
    
    panel.render(id);
    panel.setHeight(800);
    panel.setWidth(900);
    panel.getStore().reload();
} // end renderPromotionPanel()


/**
 * Show promotion panel as window
 * @param   object
 */
function showPrmotionPanel(config)
{
    var config = config || {
        win: {},
        grid: {}
    };
    
    config.win = Ext.apply(config.win, {
        modal: true,
        constrain: true
    });
    
    new Ext.Window({
        title: config.win.title || Ext.app.Localize.get('Promotions'),
        layout: 'fit',
        width: 900,
        height: 600,
        modal: config.modal || false,
        items: getPromotionPanel(Ext.applyIf(config.grid, {
            editBtn: false,
            membersBtn: false,
            tarifsBtn: false,
            rmBtn: false,
            smChBox: true
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
        win.get(0).getStore().reload();
    });
} // end showPrmotionPanel()


/**
 * Get promotion panel element with the list of elements
 * @param    
 */
function getPromotionPanel( config )
{
    var config = config || {};
    
    if(!Ext.isDefined(config['title'])) {
        config.title = Ext.app.Localize.get('Promotions');
    }
    
    var editBtn = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Edit'),
        width: 22,
        iconCls: 'ext-edit'
    });
    
    editBtn.on('action', function(grid, record) {
        showPromotionForm({
            parent: grid,
            data: record.data
        });
    });
    
    var membersBtn = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Members'),
        width: 22,
        iconCls: 'ext-ugroup'
    });
    
    membersBtn.on('action', function(grid, record){
        setPromoTo({
            allUser: record.get('object') == 0 ? true : false,
            allAgrm: record.get('object') == 1 ? true : false,
            allVg: record.get('object') == 2 ? true : false,
            data: {
                actionid: record.get('recordid')
            }
        });
    });
    
    var tarifsBtn = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Tarifs'),
        width: 22,
        iconCls: 'ext-tariff'
    });
    
    tarifsBtn.on('action', function(grid, record) {
        showPromoTarifs({
            data: {
                actionid: record.get('recordid')
            }
        });
    });
    
    var removeBtn = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Remove'),
        width: 22,
        iconCls: 'ext-drop'
    });
    
    removeBtn.on('action', function(grid, record){
        Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 122,
                    delpromo: 1,
                    recordid: this.record.get('recordid')
                },
                scope: {
                    grid: this.grid
                },
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
            record: record,
            grid: grid
        });
    });
    
    var grid = new Ext.grid.GridPanel(Ext.copyTo({
        title: !config.title ? '' : config.title,
        listeners: {
            beforerender: function(grid) {
                // Synchronize filter with store
                grid.getStore().syncStore = function() {
                    this.getTopToolbar().syncToolStore();
                    return this.getStore().baseParams;
                }.createDelegate(grid);
                
                if(config.tbarHidden) {
                	grid.getTopToolbar().hide();
                }
            }.createDelegate(config)
        },
        tbar: [{
            xtype: 'button',
            iconCls: 'ext-add',
            disabled: !Ext.isDefined(config['newPromo']) || (Ext.isDefined(config['newPromo']) && config.newPromo) ? false : true,
            text: Ext.app.Localize.get('New promotion'),
            handler: function(Btn) {
                showPromotionForm({
                    parent: Btn.findParentByType('grid')
                });
            }
        }],
        bbar: [{
            xtype: 'button',
            text: '',
            iconCls: 'x-tbar-loading',
            handler: function(Btn) {
                Btn.findParentByType('grid').getStore().reload({
                    params: {
                        start: 0
                    }
                });
            }
        }],
        loadMask: true,
        autoExpandColumn: 'action-col-name-exp',
        sm: config.smChBox ? new Ext.grid.CheckboxSelectionModel({ singleSelect: config.singleSelect || false }) : 
            new Ext.grid.RowSelectionModel({ singleSelect: config.singleSelect || false }),
        plugins: [editBtn, membersBtn, tarifsBtn, removeBtn],
        columns: [],
        store: {
            xtype: 'jsonstore',
            root: 'results',
            fields: [
                { name: 'recordid',     type: 'int'},
                { name: 'name',         type: 'string' },
                { name: 'descr',        type: 'string' },
                { name: 'link',        type: 'string' },
                { name: 'dtfromstart',  type: 'date', dateFormat: 'Y-m-d' },
                { name: 'dtfromend',    type: 'date', dateFormat: 'Y-m-d' },
                { name: 'dtto',         type: 'date', dateFormat: 'Y-m-d' },
                { name: 'daycount',     type: 'int' },
                { name: 'type',         type: 'int' },
                { name: 'object',       type: 'int' },
                { name: 'archive',      type: 'int' },
                { name: 'uuid',				type: 'string' },
                { name: 'script',			type: 'string' },
                { name: 'forindividual',	type: 'int' },
                { name: 'forcorporation',	type: 'int' },
                { name: 'positivebalance',	type: 'int' },
                { name: 'notblocked1',	type: 'int' },
                { name: 'modifyrent',	type: 'int' },
                { name: 'modifyabove',	type: 'int' },
                { name: 'modifyshape',	type: 'int' },
                { name: 'available',	type: 'int' }
            ],
            baseParams: Ext.apply({
                async_call: 1,
                devision: 122,
                getpromo: 1
            }, config.filter || {})
        }
    }, config, 'height,itemId,disabled'));
    
    var cm = [{
        header: Ext.app.Localize.get('Name'),
        id: 'action-col-name-exp',
        dataIndex: 'name'
    }, {
        header: Ext.app.Localize.get('For'),
        dataIndex: 'object',
        width: 75,
        renderer: function(value) {
            switch(value) {
                case 0: return Ext.app.Localize.get('Usera');
                case 1: return Ext.app.Localize.get('agreement');
                case 2: return Ext.app.Localize.get('uz');
            }
        }
    }, {
        header: Ext.app.Localize.get('Type'),
        dataIndex: 'type',
        width: 75,
        renderer: function(value) {
            switch(value) {
                case 1: return Ext.app.Localize.get('conditional action');
                case 2: return Ext.app.Localize.get('unconditional action');
                case 3: return Ext.app.Localize.get('combined action');
            }
        }
    }, {
        header: Ext.app.Localize.get('May be applied since'),
        tooltip: Ext.app.Localize.get('May be applied since'),
        dataIndex: 'dtfromstart',
        width: 120,
        renderer: function(value) {
            try {
                return value.format('d.m.Y');
            }
            catch(e) { }
        }
    }, {
        header: Ext.app.Localize.get('May be applied till'),
        tooltip: Ext.app.Localize.get('May be applied till'),
        dataIndex: 'dtfromend',
        width: 120,
        renderer: function(value) {
            try {
                if(value.format('Y') < 1900) {
                    return Ext.app.Localize.get('No limits');
                }
                return value.format('d.m.Y');
            }
            catch(e) { }
        }
    }, {
        header: Ext.app.Localize.get('Actual finish'),
        tooltip: Ext.app.Localize.get('Actual finish'),
        dataIndex: 'dtto',
        width: 120,
        renderer: function(value) {
            try {
                if(value.format('Y') < 1900) {
                    return Ext.app.Localize.get('No limits');
                }
                return value.format('d.m.Y');
            }
            catch(e) { }
        }
    }, {
        header: Ext.app.Localize.get('Valid since activation') + ' (' + Ext.app.Localize.get('days') + ')',
        tooltip: Ext.app.Localize.get('Valid since activation') + ' (' + Ext.app.Localize.get('days') + ')',
        dataIndex: 'daycount'
    }, {
        header: Ext.app.Localize.get('Description'),
        dataIndex: 'descr',
        hidden: true
    }];
    
    if(!Ext.isDefined(config['editBtn']) || (Ext.isDefined(config['editBtn']) && config.editBtn)) {
        cm.unshift(editBtn);
    }
    
    if(!Ext.isDefined(config['membersBtn']) || (Ext.isDefined(config['membersBtn']) && config.membersBtn)) {
        cm.push(membersBtn);
    }
    
    if(!Ext.isDefined(config['tarifsBtn']) || (Ext.isDefined(config['tarifsBtn']) && config.tarifsBtn)) {
        cm.push(tarifsBtn);
    }
    
    if(!Ext.isDefined(config['rmBtn']) || (Ext.isDefined(config['rmBtn']) && config.rmBtn)) {
        cm.push(removeBtn);
    }
    
    if(config.smChBox) {
        cm.unshift(grid.getSelectionModel())
    }
    grid.getColumnModel().setConfig(cm);
    
    return grid;
} // end getPromotionPanel()


/**
 * Add new or edit existing promotion
 * @param   
 */
function showPromotionForm( config )
{
    var config = config || {
        data: {}
    };
    
    new Ext.Window({
        title: Ext.app.Localize.get('Add'),
        layout: 'fit',
        width: 400,
        height: 710,
        modal: true,
        parent: config.parent || null,
        items: [{
            xtype: 'form',
            url: 'config.php',
            frame: true,
            monitorValid: true,
            fieldLabel: 120,
            defaults: {
                anchor: '100%'
            },
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                bindForm: true,
                handler: function(Btn){
                    var form = Btn.findParentByType('form');
                    
                    if(!form.getForm().isValid()) {
                        return;
                    }
                    
                    form.getForm().submit({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            setpromo: 1
                        },
                        scope: {
                            win: form.findParentByType('window')
                        },
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action){
                            try {
                                if(this.win['parent']) {
                                    this.win.parent.getStore().reload({
                                        params: {
                                            start: 0
                                        }
                                    });
                                }
                                this.win.close();
                            }
                            catch(e) {
                                Ext.Msg.error(e);
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.error(action.result.error);
                        }
                    });
                }
            }],
            items: [{
                xtype: 'hidden',
                name: 'recordid'
            }, {
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 122
            }, {
                xtype: 'textfield',
                name: 'name',
                allowBlank: false,
                fieldLabel: Ext.app.Localize.get('Name')
            }, {
                xtype: 'textarea',
                name: 'descr',
                fieldLabel: Ext.app.Localize.get('Description')
            },{
                xtype: 'textfield',
                name: 'link',
                fieldLabel: Ext.app.Localize.get('Description url')
            }, {
                xtype: 'combo',
                triggerAction: 'all',
                fieldLabel: Ext.app.Localize.get('PutsOn'),
                valueField: 'id',
                hiddenName: 'object',
                displayField: 'name',
                typeAhead: true,
                forceSelection: true,
                mode: 'local',
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [
                        [0, Ext.app.Localize.get('Usera')],
                        [1, Ext.app.Localize.get('agreement')],
                        [2, Ext.app.Localize.get('uz')]
                    ]
                }
            }, {
                xtype: 'datefield',
                name: 'dtfromstart',
                allowBlank: false,
                fieldLabel: Ext.app.Localize.get('May be applied since'),
                format: 'd.m.Y',
                anchor: '70%'
            }, {
                xtype: 'datefield',
                name: 'dtfromend',
                fieldLabel: Ext.app.Localize.get('Till'),
                format: 'd.m.Y',
                anchor: '70%'
            }, {
                xtype: 'datefield',
                name: 'dtto',
                fieldLabel: Ext.app.Localize.get('Actual finish'),
                format: 'd.m.Y',
                anchor: '70%'
            }, {
                xtype: 'numberfield',
                name: 'daycount',
                minValue: 0,
                fieldLabel: Ext.app.Localize.get('Duration') + ' (' + Ext.app.Localize.get('days') + ')',
                allowBlank: false
            },{
                xtype: 'combo',
                hiddenName: 'type',
                forceSelection: true,
                triggerAction: 'all',
                fieldLabel: Ext.app.Localize.get('Type'),
                valueField: 'id',
                displayField: 'name',
                typeAhead: true,
                mode: 'local',
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [
                           
                        [1, Ext.app.Localize.get('conditional action')],
                        [2, Ext.app.Localize.get('unconditional action')],
                        [3, Ext.app.Localize.get('combined action')]
                    ]
                }
            },
            {
                xtype: 'textfield',
                name: 'uuid',
                allowBlank: false,
                fieldLabel: Ext.app.Localize.get('Action code')
            },
            {
                xtype: 'textfield',
                name: 'script',
                allowBlank: true,
                fieldLabel: Ext.app.Localize.get('Validate script')
            },
            
            {
            	xtype: 'fieldset',
                title: Ext.app.Localize.get('Involves conditions'),
                defaultType: 'textfield',
                layout: 'anchor',
                /*defaults: {
                    anchor: '100%'
                },*/
                items: [{
			                xtype: 'checkbox',
			                name: 'forcorporation',
			                boxLabel: Ext.app.Localize.get('For legal entities')
			            }
			            ,
			            {
			                xtype: 'checkbox',
			                name: 'forindividual',
			                boxLabel: Ext.app.Localize.get('For individual persons')
			            },
			            {
			                xtype: 'checkbox',
			                name: 'positivebalance',
			                boxLabel: Ext.app.Localize.get('Positive balance')
			            }
			            ,
			            {
			                xtype: 'checkbox',
			                name: 'notblocked1',
			                boxLabel: Ext.app.Localize.get('Block is absent')
			            }]
            },
            {
            	xtype: 'fieldset',
                title: Ext.app.Localize.get('Actions'),
                defaultType: 'textfield',
                layout: 'anchor',
                /*defaults: {
                    anchor: '100%'
                },*/
                items: [{
		                xtype: 'checkbox',
		                name: 'modifyrent',
		                boxLabel: Ext.app.Localize.get('Modify rent')
		            },
		            {
		                xtype: 'checkbox',
		                name: 'modifyabove',
		                boxLabel: Ext.app.Localize.get('Modify above')
		            }
		            ,
		            {
		                xtype: 'checkbox',
		                name: 'modifyshape',
		                boxLabel: Ext.app.Localize.get('Modify shape')
		        }]
            },
            
            
            {
            	xtype: 'fieldset',
                title: Ext.app.Localize.get('Access settings'),
                defaultType: 'textfield',
                layout: 'anchor',

                items: [{
	                xtype: 'checkbox',
	                name: 'available',
	                boxLabel: Ext.app.Localize.get('Allow user to manage this action')
				}]
            }]
        }]
    }).show(null, function(win) {
        this.data.dtfromend = !Ext.isDate(this.data.dtfromend) || this.data.dtfromend.format('Y') <= 1900 ? null : this.data.dtfromend;
        this.data.dtto = !Ext.isDate(this.data.dtto) || this.data.dtto.format('Y') <= 1900 ? null : this.data.dtto;
        win.get(0).getForm().setValues(this.data);
    }, {
        data: Ext.apply({}, config.data)
    });
} // end showPromotionForm()


/**
 * Show form to apply promotion tariff
 */
function showPromoTarifs( config )
{
    var config = config || {
        data: {}
    };
    
    new Ext.Window({
        title: Ext.app.Localize.get('Tarifs'),
        modal: true,
        layout: 'border',
        width: 900,
        height: 600,
        sendItems: function(params, scope) {
            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                params: Ext.apply(params, {
                    async_call: 1,
                    devision: 122
                }),
                scope: scope || {},
                callback: function(options, success, resp) {
                    try {
                        if(this.panel) {
                            this.panel.getEl().unmask();
                        }
                        
                        if(!success) {
                            throw(Ext.app.Localize.get('Unknown error'));
                        }
                        
                        var data = Ext.decode(resp.responseText);
                        
                        if(!data['success']) {
                            throw(data.error);
                        }
                        
                        if(this.source) {
                            this.source.getStore().reload({
                                params: {
                                    start: 0
                                }
                            });
                        }
                        if(this.target) {
                            this.target.getStore().reload({
                                params: {
                                    start: 0
                                }
                            });
                        }
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        },
        setPB: function(grid) {
            grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
            var bbar = grid.getBottomToolbar();
            bbar.pageSize = grid.PAGELIMIT;
            bbar.bindStore(grid.store);
            bbar.add(['-', {
                xtype: 'combo',
                width: 70,
                displayField: 'id',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                value: grid.PAGELIMIT,
                editable: false,
                store: {
                    xtype: 'arraystore',
                    data: [[20], [50], [100], [500]],
                    fields: ['id']
                },
                listeners: {
                    select: function(c){
                        this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
                        this.store.reload({
                            params: {
                                limit: this.PAGELIMIT
                            }
                        });
                    }.createDelegate(grid)
                }
            }]);
            // Synchronize filter with store
            grid.getStore().syncStore = function() {
                this.getTopToolbar().syncToolStore();
                return this.getStore().baseParams;
            }.createDelegate(grid);
        },
        items: [{
            region: 'west',
            itemId: 'tarset',
            split: true,
            minSize: 200,
            maxSize: 600,
            width: 400,
            xtype: 'grid',
            title: Ext.app.Localize.get("Assigned"),
            PAGELIMIT: 100,
            enableDragDrop: true,
            ddGroup: 'asignedTarifs',
            autoExpandColumn: 'tar-name-col-exp',
            stripeRows: true,
            loadMask: true,
            listeners: {
                beforerender: function(grid) {
                    grid.ownerCt.setPB(grid);
                },
                render: function(grid) {
                    var DD = grid.getView().el.dom.childNodes[0].childNodes[1];
                    new Ext.dd.DropTarget(DD, {
                        ddGroup: 'freeTarifs',
                        copy: true,
                        target: grid,
                        source: grid.ownerCt.get('tarfree'),
                        panel: grid.ownerCt,
                        notifyDrop: function(ddSource, e, data) {
                            var params = {};
                            
                            Ext.each(ddSource.dragData.selections, function(record, index, allItems){
                                Ext.iterate(record.data, function(key, value){
                                    if(key == 'recordid' || key == 'tarid') {
                                        this.params['promotar[' + this.idx + '][' + key + ']'] = value;
                                    }
                                }, {
                                    params: this.params,
                                    idx: index
                                });
                            }, {
                                params: params
                            });
                            
                            this.panel.getEl().mask();
                            this.target.ownerCt.sendItems(Ext.apply(params, {
                                actionid: this.source.getStore().baseParams.actionid,
                                setpromotars: 1
                            }), {
                                target: this.target,
                                source: this.source,
                                panel: this.panel
                            });
                            
                            return(true);
                        }
                    });
                }
            },
            tbar: [{
                xtype: 'textfield',
                name: 'fullsearch',
                width: 200,
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
                text: Ext.app.Localize.get('Show'),
                iconCls: 'ext-search',
                itemId: 'searchBtn',
                handler: function(Btn) {
                    Btn.findParentByType('grid').getStore().reload({
                        start: 0
                    });
                }
            }],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            columns: [{
                header: Ext.app.Localize.get('Description'),
                id: 'tar-name-col-exp',
                dataIndex: 'tardescr'
            }],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: ['recordid', 'actionid', 'tarid', 'tardescr', 'actionname'],
                baseParams: {
                    async_call: 1,
                    devision: 122,
                    getpromotarifs: 1,
                    start: 0,
                    actionid: config.data.actionid || 0
                }
            }
        }, {
            region: 'center',
            itemId: 'tarfree',
            xtype: 'grid',
            title: Ext.app.Localize.get('Free'),
            PAGELIMIT: 100,
            enableDragDrop: true,
            ddGroup: 'freeTarifs',
            autoExpandColumn: 'free-tar-name-col-exp',
            loadMask: true,
            stripeRows: true,
            listeners: {
                beforerender: function(grid) {
                    grid.ownerCt.setPB(grid);
                },
                render: function(grid) {
                    var DD = grid.getView().el.dom.childNodes[0].childNodes[1];
                    new Ext.dd.DropTarget(DD, {
                        ddGroup: 'asignedTarifs',
                        target: grid,
                        source: grid.ownerCt.get('tarset'),
                        panel: grid.ownerCt,
                        copy: true,
                        notifyDrop: function(ddSource, e, data) {
                            var params = {};
                            
                            Ext.each(ddSource.dragData.selections, function(record, index, allItems){
                                Ext.iterate(record.data, function(key, value){
                                    if(key == 'recordid') {
                                        this.params['promotar[' + this.idx + '][' + key + ']'] = value;
                                    }
                                }, {
                                    params: this.params,
                                    idx: index
                                });
                            }, {
                                params: params
                            });
                            
                            this.panel.getEl().mask();
                            this.target.ownerCt.sendItems(Ext.apply(params, {
                                actionid: this.source.getStore().baseParams.actionid,
                                delpromotars: 1
                            }), {
                                target: this.target,
                                source: this.source,
                                panel: this.panel
                            });
                            
                            return(true);
                        }
                    });
                }
            },
            tbar: [{
                xtype: 'textfield',
                name: 'fullsearch',
                width: 200,
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
                text: Ext.app.Localize.get('Show'),
                iconCls: 'ext-search',
                itemId: 'searchBtn',
                handler: function(Btn) {
                    Btn.findParentByType('grid').getStore().reload({
                        start: 0
                    });
                }
            }],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            columns: [{
                header: Ext.app.Localize.get('Description'),
                id: 'free-tar-name-col-exp',
                dataIndex: 'tardescr'
            }],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: ['recordid', 'actionid', 'tarid', 'tardescr', 'actionname'],
                baseParams: {
                    async_call: 1,
                    devision: 122,
                    getpromotarifs: 1,
                    notgroups: 1,
                    start: 0,
                    actionid: config.data.actionid || 0
                }
            }
        }]
    }).show(null, function(win) {
        win.get('tarset').getStore().reload();
        win.get('tarfree').getStore().reload();
    });
} // end showPromoTarifss()


/**
 * Show promotions window
 * @param   object, common configuration 
 */
function setPromoTo( config )
{
    var config = config || {
        data: null
    },
        title = Ext.app.Localize.get('Assigned promotions') + ': ';
    
    if(!config.allUser && !config.allAgrm && !config.allVg && !config.data.agrmid && !config.data.vgid) {
        Ext.Msg.error(Ext.app.Localize.get("Data mismatch"));
        return false;
    }
    
    if(config.allUser || config.allAgrm || config.allVg) {
        if(!config.data.actionid) {
            Ext.Msg.error(Ext.app.Localize.get("Data mismatch"));
            return false;
        }
        
        delete config.data.agrmid;
        delete config.data.vgid;
        
        title += (config.allVg ? Ext.app.Localize.get('Accounts') : (config.allAgrm ? Ext.app.Localize.get('Agreements') : Ext.app.Localize.get('Users')));
    }
    else {
        title += (config.data['vgid'] ? Ext.app.Localize.get('Account') : Ext.app.Localize.get('Agreement'));
    }
    
	var smDeleteBtn = new Ext.grid.RowButton({ 
		    header: '&nbsp;',
		    tplModel: true,
		    qtip: Ext.app.Localize.get('Delete'),
		    width: 22,
		    dataIndex: 'id',
		    iconCls: 'ext-drop'
		});
		
	smDeleteBtn.on('action', function(grid, record) {
		Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
	            if(Btn != 'yes') {
	                return;
	            };
	            
	            Ext.Ajax.request({
	                url: 'config.php',
	                method: 'POST',
	                params: {
	                    async_call: 1,
	                    devision: 122,
	                    delpromostaff: 1,
	                    recordid: this.record.get('recordid')
	                },
	                scope: {
	                    grid: this.grid
	                },
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
	            record: record,
	            grid: grid
	        });
	});
    
    var win = new Ext.Window({
        title: title,
        modal: true,
        width: 920,
        height: 600,
        resizable: false,
        constrain: true,
        layout: 'fit',
        items: [{
            xtype: 'editorgrid',
            PAGELIMIT: 100,
            plugins: [smDeleteBtn], 
            clicksToEdit: 1,
            autoExpandColumn: 'promo-name-col-exp',
            loadMask: true,
            signPromotions: function(grid) {
                var record = (config.allUser || config.allAgrm || config.allVg) ? grid.getSelectionModel().getSelections() : 
                             grid.getSelectionModel().getSelected();
                
                if(!record || (Ext.isArray(record) && record.length == 0)) {
                    return;
                }
                
                new Ext.Window({
                    title: Ext.app.Localize.get('Time of action'),
                    constrain: true,
                    modal: true,
                    layout: 'fit',
                    width: 250,
                    height: 130,
                    items: {
                        xtype: 'form',
                        url: 'config.php',
                        frame: true,
                        monitorValid: true,
                        labelWidth: 50,
                        buttonAlign: 'center',
                        defaults: {
                            anchor: '100%',
                            xtype: 'hidden'
                        },
                        buttons: [{
                            xtype: 'button',
                            text: Ext.app.Localize.get('Save'),
                            bindForm: true,
                            handler: function(Btn) {
                                var form = Btn.findParentByType('form'),
                                    params = {};
                                
                                if(!form.getForm().isValid()) {
                                    return
                                }
                                
                                if(Ext.isArray(this.record)) {
                                    Ext.each(this.record, function(rec, idx){
                                        Ext.iterate(rec.data, function(key, value){
                                            if(key == 'vgid' || key == 'agrmid' || key == 'uid') {
                                                this.params['members[' + idx + '][' + key + ']'] = value;
                                            }
                                        }, {
                                            params: this.params
                                        });
                                    }, {
                                        params: params
                                    })
                                }
                                else {
                                    params['members[0][agrmid]'] = this.config.data.agrmid || 0;
                                    params['members[0][vgid]'] = this.config.data.vgid || 0;
                                }
                                
                                form.getForm().submit({
                                    url: 'config.php',
                                    method: 'POST',
                                    scope: {
                                        win: form.ownerCt
                                    },
                                    params: Ext.applyIf({
                                        async_call: 1,
                                        devision: 122,
                                        setpromostaff: 1
                                    }, params),
                                    waitTitle: Ext.app.Localize.get('Connecting'),
                                    waitMsg: Ext.app.Localize.get('Sending data') + '...',
                                    success: function(form, action) {
                                        if(this.win.parent.store) {
                                            this.win.parent.store.reload({
                                                params: {
                                                    start: 0
                                                }
                                            });
                                        }
										if(Ext.getCmp('MainVgroupTabPanel').getActiveTab().itemId == 'periodic-service') {
											Ext.getCmp('MainVgroupTabPanel').getActiveTab().getStore().reload();
										}
                                        this.win.close();
                                    },
                                    failure: function(form, action) {
                                        Ext.Msg.error(action.result.error);
                                    }
                                });
                            }.createDelegate({
                                config: config,
                                record: record
                            })
                        }],
                        items: [{
                            name: 'actionid'
                        }, {
                            xtype: 'datefield',
                            fieldLabel: Ext.app.Localize.get('Since'),
                            name: 'dtfrom',
                            allowBlank: false,
                            format: 'd.m.Y'
                        }, {
                            xtype: 'datefield',
                            fieldLabel: Ext.app.Localize.get('Till'),
                            name: 'dtto',
                            allowBlank: true,
                            format: 'd.m.Y'
                        }]
                    }
                }).show(null, function(win) {
                    var data = {
                        record: 0,
                        dtfrom: new Date()
                    };
                    
                    if(this.config.allVg || this.config.allAgrm || this.config.allUser) {
                        data = Ext.applyIf(data, {
                            dtto: null,
                            actionid: this.config.data.actionid
                        })
                    }
                    else {
                        data = Ext.applyIf(data, {
                            actionid: this.record.get('recordid'),
                            dtto: !Ext.isDate(this.record.get('dtto')) || this.record.get('dtto').format('Y') <= 1900 ? null : this.record.get('dtto')
                        });
                    }
                    
                    win.get(0).getForm().setValues(data);
                    win.parent = this.grid;
                }, {
                    record: record,
                    config: config,
                    grid: this.grid
                });
            },
            listeners: {
                afterrender: function(grid) {
                    grid.getStore().on('update', function(store, record, action){
                        if(action == Ext.data.Record.EDIT) {
                            var params = Ext.copyTo({}, record.data, ['actionid', 'dtfrom', 'dtto', 'recordid']);
                            
                            params['members[0][uid]'] = record.get('uid');
                            params['members[0][agrmid]'] = record.get('agrmid');
                            params['members[0][vgid]'] = record.get('vgid');
                            
                            Ext.Ajax.request({
                                url: 'config.php',
                                timeout: 3800000,
                                method: 'POST',
                                params: Ext.apply({
                                    async_call: 1,
                                    devision: 122,
                                    setpromostaff: 1
                                }, params),
                                scope: {
                                    record: record,
                                    store: store
                                },
                                callback: function(opt, success, resp){
                                    try {
                                        // Decode JSON data
                                        var data = Ext.decode(resp.responseText)
                                        
                                        if(!data['success']) {
                                            throw(data.error);
                                        }
										
										if(Ext.getCmp('MainVgroupTabPanel').getActiveTab().itemId == 'periodic-service') {
											Ext.getCmp('MainVgroupTabPanel').getActiveTab().getStore().reload();
										}

                                        this.store.commitChanges();
                                        Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                                    }
                                    catch(e) {
                                        Ext.Msg.error(e);
                                    }
                                }
                            });
                        }
                    });
                },
                beforerender: function(grid) {
                    // Set paging bar
                    grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                    var bbar = grid.getBottomToolbar();
                    bbar.pageSize = grid.PAGELIMIT;
                    bbar.bindStore(grid.store);
                    bbar.add(['-', {
                        xtype: 'combo',
                        width: 70,
                        displayField: 'id',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all',
                        value: grid.PAGELIMIT,
                        editable: false,
                        store: {
                            xtype: 'arraystore',
                            data: [[20], [50], [100], [500]],
                            fields: ['id']
                        },
                        listeners: {
                            select: function(c){
                                this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
                                this.store.reload({
                                    params: {
                                        limit: this.PAGELIMIT
                                    }
                                });
                            }.createDelegate(grid)
                        }
                    }]);
                }
            },
            tbar: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Add'),
                iconCls: 'ext-add',
                handler: function(Btn) {
                    var fn = Btn.findParentByType('editorgrid').signPromotions;
                    if(this.allVg) {
                        showAccounts({
                            sm: false,
                            callbackok: fn.createDelegate({
                                grid: Btn.findParentByType('editorgrid')
                            })
                        });
                    }
                    else if(this.allAgrm) {
                        selectAgreements({
                            sm: false,
                            callbackok: fn.createDelegate({
                                grid: Btn.findParentByType('editorgrid')
                            })
                        })
                    }
                    else if(this.allUser) {
                        showUsers({sm: false,
                            callbackok: fn.createDelegate({
                                grid: Btn.findParentByType('editorgrid')
                            })
                        });
                    }
                    else {
                        showPrmotionPanel({
                            grid: {
                                singleSelect: true,
                                editBtn: false,
                                rmBtn: false,
                                newPromo: false,
                                filter: {
                                    category: config.data.vgid ? 2 : -1
                                }
                            },
                            win: {
                                callback: fn.createDelegate({
                                    grid: Btn.findParentByType('editorgrid')
                                })
                            }
                        });
                    }
                }.createDelegate(config)
            }],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            columns: [],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: [
                    { name: 'actionid', type: 'int' },
                    { name: 'recordid', type: 'int' },
                    { name: 'uid', type: 'int' },
                    { name: 'userlogin', type: 'string' },
                    { name: 'username', type: 'string' },
                    { name: 'tarid', type: 'int' },
                    { name: 'tardescr', type: 'string' },
                    { name: 'agrmnum', type: 'string' },
                    { name: 'agrmid', type: 'int' },
                    { name: 'vglogin', type: 'string' },
                    { name: 'vgid', type: 'int' },
                    { name: 'actionname', type: 'string' },
                    { name: 'personid', type: 'string' },
                    { name: 'mgrname', type: 'string' },
                    { name: 'dtfrom', type: 'date', dateFormat: 'Y-m-d' },
                    { name: 'dtto', type: 'date', dateFormat: 'Y-m-d' }
                ],
                baseParams: Ext.applyIf({
                    async_call: 1,
                    devision: 122,
                    getpromostaff: 1
                }, config.data || {})
            }
        }]
    });
    
    var cm = win.get(0).getColumnModel();
    
    if(config.allVg) {
        cm.config.unshift({
            header: Ext.app.Localize.get('Account'),
            dataIndex: 'vglogin',
            width: 100
        });
        
        cm.config.unshift({
            header: Ext.app.Localize.get('Agreement'),
            dataIndex: 'agrmnum',
            width: 100
        });
        
        cm.config.unshift({
            header: Ext.app.Localize.get('User'),
            dataIndex: 'username',
            id: 'promo-name-col-exp'
        });
    }
    else if(config.allAgrm) {
        cm.config.unshift({
            header: Ext.app.Localize.get('Agreement'),
            dataIndex: 'agrmnum',
            width: 100
        });
        
        cm.config.unshift({
            header: Ext.app.Localize.get('User'),
            dataIndex: 'username',
            id: 'promo-name-col-exp'
        });
    }
    else if(config.allUser) {
        cm.config.unshift({
            header: Ext.app.Localize.get('User'),
            dataIndex: 'username',
            id: 'promo-name-col-exp'
        });
    }
    else if(config.vgroup) {
        cm.config.unshift({
            header: Ext.app.Localize.get('Promotion'),
            dataIndex: 'actionname',
            id: 'promo-name-col-exp'
        });
        cm.config.unshift({
            header: Ext.app.Localize.get('Account'),
            dataIndex: 'vglogin',
            width: 100
        });
        
        cm.config.unshift({
            header: Ext.app.Localize.get('Agreement'),
            dataIndex: 'agrmnum',
            width: 100
        });
        
        cm.config.unshift({
            header: Ext.app.Localize.get('User'),
            dataIndex: 'username',
            id: 'promo-name-col-exp'
        });
    }
    else {
        cm.config.unshift({
            header: Ext.app.Localize.get('Promotion'),
            dataIndex: 'actionname',
            id: 'promo-name-col-exp'
        });
    }
    
    cm.config.push({ 
        header: Ext.app.Localize.get('Assigned by'),
        dataIndex: 'mgrname',
        renderer: function (value, meta, record) {
        	if (record.get('personid') < 0) {
        		return record.get('username');
        	}
        	return value;
        },
        width: 220
     }, {
        header: Ext.app.Localize.get('Since'),
        dataIndex: 'dtfrom',
        width: 110,
        editor: {
            xtype: 'datefield',
            format: 'd.m.Y',
            allowBlank: false
        },
        renderer: function(value) {
            try {
                return value.format('d.m.Y');
            }
            catch(e) { }
        }
     }, {
        header: Ext.app.Localize.get('Till'),
        dataIndex: 'dtto',
        width: 110,
        editor: {
            xtype: 'datefield',
            format: 'd.m.Y'
        },
        renderer: function(value) {
            try {
                if(value.format('Y') < 1900) {
                    return Ext.app.Localize.get('No limits');
                }
                return value.format('d.m.Y');
            }
            catch(e) { }
        }
    }, smDeleteBtn);
    
    cm.setConfig(cm.config);
    
    
    win.show(null, function(win){
        win.get(0).getStore().reload({
            params: {
                start: 0
            }
        });
    });   
	
} // setPromoTo()

	