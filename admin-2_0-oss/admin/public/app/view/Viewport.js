Ext.define('OSS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'OSS.view.viewport.Header',
        'OSS.view.viewport.Menu',
        'OSS.view.viewport.Footer'
    ],
    layout: 'border',
    border: false,
    statics: {
        ready: false
    },
    defaults: {
        border: false
    },
    items: [{
        region: 'north',
        placeholder: Ext.create('Ext.panel.Panel', {
            border: false,
            height: 5
        }),
        collapsible: true,
        collapseMode: 'mini',
        header: false,
        items: [{
            xtype: 'ossheader'
        }]
    }, {
        region: 'south',
        placeholder: Ext.create('Ext.panel.Panel', {
            border: false,
            height: 5
        }),
        collapsible: true,
        collapseMode: 'mini',
        header: false,
        items: [{
            xtype: 'ossfooter'
        }]
    }, {
        region: 'center',
        itemId: 'appBody',
        layout: 'card',
        bodyStyle: {
            padding: '5px'
        },
        dockedItems: [{
            dock: 'top',
            xtype: 'panel',
            ui: 'oss-app-menu',
            items: [{
                xtype: 'ossmenu'
            }]
        }]
    }]
});
