/**
 * Окно импорта категорий
 */
Ext.define('OSS.view.tariffs.form.categories.Import', {
    extend: 'Ext.window.Window',
    title: i18n.get('Import categories'),
    width: 700,
    layout: 'anchor',
    modal: true,
    buttonAlign: 'center',
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            border: false,
            items: [{
                xtype: 'fieldset',
                margin: '10 10 10 10',
                layout: 'anchor',
                style: {
                    backgroundColor: '#f0f0f0'
                },
                defaults: {
                    labelWidth: 150,
                    anchor: '100%'
                },
                items: [{
                    xtype: 'checkbox',
                    itemId: 'createCatalog',
                    fieldLabel: i18n.get('Create new catalog')
                }, Ext.create('OSS.view.tariffs.form.categories.Catalogs', {
                    labelWidth: 150,
                    store: Ext.app.Application.instance.getController('Tariffs').getCatalogStoreForImport(),
                    anchor: '100%',
                    allowBlank: false,
                    fieldLabel: i18n.get('Catalog'),
                    name: 'catalog_id',
                    width: 300
                }), {
                    xtype: 'filefield',
                    name: 'file',
                    fieldLabel: i18n.get('File'),
                    msgTarget: 'side',
                    allowBlank: false,
                    buttonText: i18n.get('Choose file')
                }]
            }]
        }];
        this.callParent(arguments);
    },
    buttons: [{
        xtype: 'button',
        disabled: true,
        text: i18n.get('Apply'),
        itemId: 'apply'
    }, {
        xtype: 'button',
        text: i18n.get('Cancel'),
        itemId: 'cancel'
    }]
});
