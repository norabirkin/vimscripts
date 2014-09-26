Ext.define('OSS.view.Tariffs', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tariffs',
    layout: 'card',
    frame: true,
    plain: true,
    title: i18n.get('Tariffs'),
    items: [
        { xtype: 'tariffs_list' }, 
        { xtype: 'tariff_form' }
    ]
});
