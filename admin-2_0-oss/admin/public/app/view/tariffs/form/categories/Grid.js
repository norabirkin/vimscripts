/**
 * Таблица категорий тарифов
 */
Ext.define('OSS.view.tariffs.form.categories.Grid', {
    extend: 'Ext.grid.Panel',
    itemId: 'categoriesGrid',
    region: 'west',
    split: true, 
    collapsible: false,
    minWidth: 320,
    width: 350,
    store: 'tariffs.CategoriesList',
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: i18n.get('Operator') + ': {name}'
    }],
    columns: [{
        xtype: 'actioncolumn',
        width: 25
    }, {
        dataIndex: 'descr',
        flex: 1,
        text: i18n.get('Category name')
    }],
    dockedItems: [{
        xtype: 'toolbar',
        hidden: true,
        dock: 'top',
        items: [{
            xtype: 'textfield',
            width: 150,
            fieldLabel: 'Label',
            hideLabel: true
        },
        {
            xtype: 'combo',
            width: 100,
            editable: false,
            fieldLabel: 'Label',
            hideLabel: true,
            hiddenName: '',
            displayField: 'id',
            valueField: 'name',
            store:  []
        },
        {
            xtype: 'button',
            text: 'Найти'
        }]
    }, {
        xtype: 'pagingtoolbar',
        displayInfo: false,
        dock: 'bottom',
        store: 'tariffs.CategoriesList'
    }],
    selModel: Ext.create('Ext.selection.RowModel', {
        mode: 'MULTI'
    })
});
