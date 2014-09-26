Ext.define('OSS.view.PrintingFormsStat', {
    extend: 'OSS.view.WithFilter',
    alias: 'widget.printingformsstat',
    title: i18n.get( 'Printing forms' ),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.printingformsstat.Grid'),
            Ext.create('OSS.view.printingformsstat.Form')
        ];
        this.callParent(arguments);
    }
});
