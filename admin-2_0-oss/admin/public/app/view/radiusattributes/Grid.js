Ext.define("OSS.view.radiusattributes.Grid", {
    extend: 'Ext.grid.Panel',
    alias: "widget.radiusattributes_grid",
    itemId: 'attributsGrid',
    region: 'center',
    store: 'radiusattributes.List',
    minWidth: 600,
    columns: [{
        dataIndex: 'record_id',
        width: 40,
        text: i18n.get('ID')
    }, {
        dataIndex: 'dict_name',
        flex: 1,
        text: i18n.get('Attribute')
    }, {
        dataIndex: 'radius_code',
        width: 120,
        text: i18n.get('RADIUS code'),
        renderer: function(value) {
            switch(value) {
                case 2: return 'Access-Accept';
                case 3: return 'Access-Reject';
                default: return value;
            }
        }
    }, {
        dataIndex: 'value',
        flex: 1,
        text: i18n.get('Value')
    }, {
        dataIndex: 'description',
        flex: 2,
        text: i18n.get('Description')
    }, {
        dataIndex: 'link',
        flex: 1,
        text: i18n.get('Assign type'),
        renderer: function(value) {
            switch (value) {
                case 1: return i18n.get('Agent');
                case 2: return i18n.get('Accounts group');
                case 3: return i18n.get('Tariff');
                case 4: return i18n.get('Account');
                case 5: return i18n.get('Shape');
                default: return value;
            }
        }
    }/*, {
        dataIndex: 'service_for_list',
        flex: 1,
        text: i18n.get('Service')
    }, {
        dataIndex: 'cat_descr',
        flex: 2,
        text: i18n.get('Category')
    }*/],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        displayInfo: true,
        dock: 'bottom',
        store: 'radiusattributes.List'
    }]
});