/**
 * Форма агента
 */
Ext.define('OSS.view.agents.FormTabBase', {
    extend: 'Ext.form.Panel',
    border: false,
    autoScroll: true,
    initComponent: function() {
        this.tbar = Ext.create('OSS.view.agents.Toolbar');
        this.callParent(arguments);
    }
});
