Ext.define('OSS.view.PrintingForms', {
    extend: 'OSS.view.WithFilter',
    alias: 'widget.printing_forms',
    title: i18n.get('Printing forms'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.printforms.Filter'),
            Ext.create('OSS.view.printforms.Grid')
        ];
        this.callParent(arguments);
    }
});
