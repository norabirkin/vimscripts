/**
 * Вкладка "Направления" категорий тарифов
 */
Ext.define('OSS.view.tariffs.form.categories.tabs.Directions', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    createParams: function(records, gridId) {
        var i,
            ids = [],
            item;
        if (records) {
            if (!records.length) {
                return false;
            }
            for (i = 0; i < records.length; i ++) {
                item = records[i];
                ids.push(item.get(item.idProperty));
            }
            return {
                ids: ids.join(',')
            };
        } else {
            return {
                fullsearch: this.down('#'+gridId+' > toolbar > searchtext').getValue()
            };
        }
    },
    params: {},
    request: {
        attach: {},
        detach: {}
    },
    setParams: function(params) {
        this.params = params;
    },
    attach: function(records) {
        var params = this.createParams(records, 'available');
        if (!params) {
            return;
        }
        Ext.Ajax.request({
            url: 'index.php/api/tarCategoryCatalogZones/attach',
            params: Ext.apply(
                params,
                this.params
            ),
            callback: this.done,
            scope: this
        });
    },
    detach: function(records) {
        var params = this.createParams(records, 'assigned');
        if (!params) {
            return;
        }
        Ext.Ajax.request({
            url: 'index.php/api/tarCategoryCatalogZones/detach',
            params: Ext.apply(
                params,
                this.params
            ),
            callback: this.done,
            scope: this
        });
    },
    done: function() {
        this.assigned.getStore().load({
            force: true
        });
        this.available.getStore().load({
            force: true
        });
    },
    createToolbar: function(actions) {
        var fullsearch = Ext.create('OSS.ux.form.field.SearchField', {
                searchButton: 'find',
                parentContainerType: 'toolbar'
            }),
            find = Ext.create('Ext.button.Button', {
                text: i18n.get('Find'),
                itemId: 'find',
                iconCls: 'x-ibtn-search'
            }),
            tbar = [{
                itemId: 'actions',
                handler: function(Btn) {
                    Btn.showMenu();
                },
                xtype: 'splitbutton',
                text: i18n.get('Actions'),
                menu: actions
            }, '-', fullsearch, find];
        find.on('click', function() {
            var store = find.up('gridpanel').getStore();
            store.addExtraParams({
                fullsearch: fullsearch.getValue()
            });
            store.load();
        });
        return tbar;    
    },
    initComponent: function() {
        var delCurrent = Ext.create('Ext.menu.Item', {
                iconCls: 'x-ibtn-delete',
                itemId: 'deleteCurrent',
                text: i18n.get('Delete current page')
            }),
            delAll = Ext.create('Ext.menu.Item', {
                iconCls: 'x-ibtn-delete',
                itemId: 'deleteAll',
                text: i18n.get('Delete all')
            }),
            assigned = Ext.apply(
                Ext.apply(
                    {
                        itemId: 'assigned',
                        split: true,
                        title: i18n.get('Assigned directions'),
                        region: 'west',
                        width: '50%',
                        selModel: {
                            mode: 'MULTI'
                        },
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'list',
                                dropGroup: 'order'
                            }
                        },
                        tbar: this.createToolbar([delCurrent, delAll])
                    },
                    this.common
                ),
                this.assigned
            ),
            add = Ext.create('Ext.menu.Item', {
                iconCls: 'x-ibtn-add',
                itemId: 'add',
                text: i18n.get('Add current page')
            }),
            addAll = Ext.create('Ext.menu.Item', {
                iconCls: 'x-ibtn-add',
                itemId: 'addAll',
                text: i18n.get('Add all')
            }),
            available = Ext.apply(
                Ext.apply(
                    {
                        itemId: 'available',
                        region: 'center',
                        title: i18n.get('Free directions'),
                        width: '50%',
                        selModel: {
                            mode: 'MULTI'
                        },
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'order',
                                dropGroup: 'list'
                            }
                        },
                        tbar: this.createToolbar([add, addAll])
                    },
                    this.common
                ),
                this.available
            );
        assigned.bbar = {
            xtype: 'pagingtoolbar',
            store: assigned.store
        };
        available.bbar = {
            xtype: 'pagingtoolbar',
            store: available.store
        };
        this.assigned = Ext.create('Ext.grid.Panel', assigned);
        this.available = Ext.create('Ext.grid.Panel', available);
        this.assigned.down('gridview').on('drop', function() {
            this.attach(arguments[1].records);
        }, this);
        this.available.down('gridview').on('drop', function() {
            this.detach(arguments[1].records);
        }, this);
        add.on('click', function() {
            this.attach(this.available.getStore().data.items);
        }, this);
        addAll.on('click', function() {
            this.attach();
        }, this);
        delAll.on('click', function() {
            this.detach();
        }, this);
        delCurrent.on('click', function() {
            this.detach(this.assigned.getStore().data.items);
        }, this);
        this.items = [
            this.assigned,
            this.available
        ];
        this.callParent(arguments);
    }
});
