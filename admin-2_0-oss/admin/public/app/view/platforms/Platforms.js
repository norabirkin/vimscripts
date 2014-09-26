/**
 * Таблица платформ
 */
Ext.define('OSS.view.platforms.Platforms', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    itemId: 'platforms',
    store: 'Platforms',
    columns: [{
        itemId: 'edit',
        xtype: 'actioncolumn',
        width: 20,
        tooltip: i18n.get('Edit agents'),
        iconCls: 'x-ibtn-def x-ibtn-list'
    }, {
        header: i18n.get('Name'),
        dataIndex: 'name',
        width: 150,
        editor: {
            xtype: 'textfield'
        }
    }, {
        header: i18n.get('Description'),
        flex: 1,
        dataIndex: 'descr',
        editor: {
            xtype: 'textfield'
        }
    }],
    bbar: {
        xtype: 'pagingtoolbar', 
        store: 'Platforms'
    }
});
