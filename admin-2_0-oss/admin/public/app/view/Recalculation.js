Ext.define("OSS.view.Recalculation", {
    extend: "OSS.view.WithFilter",
    alias: 'widget.recalculation',
    title: i18n.get('Recalculation'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.recalculation.Filter'),
            Ext.create('OSS.view.recalculation.Grid')
        ];
        this.callParent(arguments);
    }
});
