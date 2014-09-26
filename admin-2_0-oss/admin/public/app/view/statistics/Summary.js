Ext.define( 'OSS.view.statistics.Summary', {
    extend: 'Ext.grid.Panel',
    mixins: ['OSS.view.statistics.Renderers'],
    region: 'south',
    title: OSS.Localize.get( 'Total' )
});
