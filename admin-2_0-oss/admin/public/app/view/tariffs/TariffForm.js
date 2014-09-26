Ext.define('OSS.view.tariffs.TariffForm', {
    extend: 'Ext.tab.Panel',
    requires: ['OSS.ux.form.field.SafeCombo'],
    alias: 'widget.tariff_form',
    activeTab: 0,
    plain: true,
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.tariffs.form.General'),
            Ext.create('OSS.view.tariffs.form.BandPass'),
            Ext.create('OSS.view.tariffs.form.Categories')
        ];
        this.callParent(arguments);
    }

});
