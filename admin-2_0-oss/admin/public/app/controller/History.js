Ext.define('OSS.controller.History', {
    extend: 'OSS.controller.Tabs',
    getMainPanelAlias: function() { return 'history'; },
    views: [
        'History',
        'Agreements',
        'history.Tabs',
        'history.tabs.Rent',
        'history.tabs.Balance',
        'history.tabs.Locks',
        'history.tabs.Services',
        'history.tabs.Discounts'
    ],
    stores: [
        'Agreements', 
        'history.Rent',
        'history.Balance',
        'history.Locks',
        'history.Services',
        'history.Discounts',
        'history.locks.Types'
    ],
    init: function() {
        this.callParent( arguments );
    },
    showPanel: function( params ) {
        this.openWindow( params );
    }
});
