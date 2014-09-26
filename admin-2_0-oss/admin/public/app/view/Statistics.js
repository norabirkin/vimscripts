Ext.define('OSS.view.Statistics', {
    extend: 'OSS.view.WithFilter',
    alias: 'widget.statistics',
    title: OSS.Localize.get('Statistics'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.statistics.Filter'),
            Ext.create('OSS.view.statistics.Main')
        ];
        this.callParent( arguments );
    }
});
