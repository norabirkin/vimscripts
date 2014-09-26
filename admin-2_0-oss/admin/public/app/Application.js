Ext.define('OSS.Application', {
    name: 'OSS',

    extend: 'Ext.app.Application',
    enableQuickTips: true,
    
    requires: [
        'Ext.data.Store',
        'Ext.layout.Context',
        'OSS.ux.data.store.JAPI',
        'OSS.component.Localize',
        'OSS.helpers.Ajax',
        'Ext.util.History',
        'OSS.component.License',
        'OSS.component.StoreValidity',
        'OSS.component.Profile'
    ],
    
    views: [
        'Viewport'
    ],

    controllers: [
        'Viewport',
        'viewport.Header',
        'viewport.Menu'
    ],
    launch: function() {
        this.getController('Viewport').identityRequest({
            callback: this.createViewport,
            scope: this
        });
    },
    createViewport: function() {
        Ext.get('oss-app-loading').hide();
        this.getView('Viewport').create();
    }
});
