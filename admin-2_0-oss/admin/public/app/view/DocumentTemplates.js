Ext.define('OSS.view.DocumentTemplates', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.doctempl',
    layout: 'card',
    frame: true,
    plain: true,
    title: OSS.Localize.get('Document templates'),
    items: [{ xtype: 'documenttemplates_list' }, { xtype: 'documenttemplates_form' }]
});
