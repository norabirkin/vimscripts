/**
 * Дерево ролей
 */
Ext.define('OSS.view.managers.RulesTree', {
    extend: 'Ext.tree.Panel',
    requires: ['OSS.helpers.LeavesFilter'],
    rootVisible: false,
    store: 'managers.RulesTree',
    itemId: 'rulesForRoleGrid',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing')
    ],
    selModel: Ext.create('Ext.selection.RowModel', {
        mode: 'MULTI'
    }),
    initComponent: function() {
        var renderer = function(max_value) {
                return function (value, meta, record) {
                    if (!record.get('enabled') || !record.get(max_value)) {
                        meta.style += 'color:grey;';
                    }
                    return value ? i18n.get('Accept') : i18n.get('Reject');
                };
            },
            filter = Ext.create("OSS.helpers.LeavesFilter", {
                store: Ext.app.Application.instance.getController('Managers').getManagersRulesTreeStore(),
                checkFolders: true
            }),
            text = Ext.create('OSS.ux.form.field.SearchField', {
                name: 'text',
                parentContainerType: 'toolbar',
                searchButton: 'searchBtn'
            }),
            name = Ext.create('OSS.ux.form.field.SearchField', {
                name: 'name',
                parentContainerType: 'toolbar',
                searchButton: 'searchBtn'
            }),
            container = Ext.create('Ext.container.Container', {
                layout: 'card',
                items: [text, name]
            }),
            tbar = Ext.create('OSS.ux.toolbar.Toolbar', {
                back: true,
                actions: [{
                    text: i18n.get('Change rules'),
                    disabled: true,
                    itemId: 'change'
                }],
                items: [{
                    xtype: 'combo',
                    treeFilter: false,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }],
                        data: [{
                            id: 1,
                            name: i18n.get('Description')
                        }, {
                            id: 2,
                            name: i18n.get('Marker')
                        }]
                    }),
                    value: 1,
                    listeners: {
                        change: function() {
                            var value = arguments[1];
                            switch (value) {
                                case 1:
                                    container.getLayout().setActiveItem(text);
                                    name.setValue(null);
                                    break;
                                case 2:
                                    container.getLayout().setActiveItem(name);
                                    text.setValue(null);
                                    break;
                            }
                        }
                    }
                }, container, {
                    xtype: 'button',
                    text: i18n.get('Find'),
                    itemId: 'searchBtn',
                    iconCls: 'x-ibtn-search',
                    listeners: {
                        click: function() {
                            filter.run();
                        }
                    }
                }]
            });
        filter.setToolbar(tbar);
        this.dockedItems = [tbar];
        this.columns = [{
            header: i18n.get('Description'),
            sortable: false,
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'text'
        }, {
            header: 'ID',
            sortable: false,
            width: 30,
            dataIndex: 'record_id'
        }, {
            header: i18n.get('Marker'),
            sortable: false,
            width: 250,
            hidden: true,
            dataIndex: 'name'
        }, {
            header: i18n.get('Rights to create'),
            sortable: false,
            itemId: 'create',
            hideable: false,
            width: 70,
            dataIndex: 'value_create',
            editor: Ext.create('OSS.view.managers.RolesEditor'),
            renderer: renderer('max_value_create')
        }, {
            header: i18n.get('Rights to read'),
            sortable: false,
            itemId: 'read',
            hideable: false,
            width: 70,
            dataIndex: 'value_read',
            editor: Ext.create('OSS.view.managers.RolesEditor'),
            renderer: renderer('max_value_read')
        }, {
            header: i18n.get('Rights to update'),
            sortable: false,
            itemId: 'update',
            hideable: false,
            width: 70,
            dataIndex: 'value_update',
            editor: Ext.create('OSS.view.managers.RolesEditor'),
            renderer: renderer('max_value_update')
        }, {
            header: i18n.get('Rights to delete'),
            sortable: false,
            itemId: 'delete',
            hideable: false,
            width: 70,
            dataIndex: 'value_delete',
            editor: Ext.create('OSS.view.managers.RolesEditor'),
            renderer: renderer('max_value_delete')
        }];
        this.callParent(arguments);
    }
});
