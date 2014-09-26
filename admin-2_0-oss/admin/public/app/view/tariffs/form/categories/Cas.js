/**
 * Окно выбора CAS
 */
Ext.define('OSS.view.tariffs.form.categories.Cas', {
    extend: 'Ext.window.Window',
    title: i18n.get('CAS Packages'),
    constrain: true,
    modal: true,
    layout: 'fit',
    height: 400,
    width: 600,
    items: [{
        xtype: 'gridpanel',
        tbar: [i18n.get('Search') + ': ', {
            xtype: 'searchtext',
            parentContainerType: 'toolbar',
            searchButton: 'show',
            name: 'fullsearch',
            width: 180
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            itemId: 'show',
            iconCls: 'x-ibtn-search',
            text: i18n.get('Show')
        }],
        columns: [{
            header: i18n.get('Tag'),
            dataIndex: 'tag',
            width: 80
        }, {
            header: i18n.get('Name'),
            dataIndex: 'name',
            flex: 1
        }],
        store: 'tariffs.CAS',
        bbar: {
            xtype: 'pagingtoolbar',
            store: 'tariffs.CAS'
        }
    }]
});
