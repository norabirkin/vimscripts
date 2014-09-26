Ext.define( 'OSS.ux.button.sprite.Export', {
    extend: 'OSS.ux.button.sprite.List',
    alias: 'widget.export',
    text: OSS.Localize.get('Export'),
    itemId: 'download',
    menu: [
        {
            text: OSS.Localize.get('Current page'),
            itemId: 'current'
        },
        {
            text: OSS.Localize.get('All'),
            itemId: 'all'
        }
    ]
});
