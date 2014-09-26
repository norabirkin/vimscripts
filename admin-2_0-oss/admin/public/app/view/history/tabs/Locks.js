Ext.define( 'OSS.view.history.tabs.Locks', {
    extend: 'OSS.view.payments.tabs.History',
    title: OSS.Localize.get('Locks'),
    getGridStore: function() { return 'history.Locks'; },
    initComponent: function() {
        this.columns = [
            {
                header: OSS.Localize.get('Lock set'),
                dataIndex: 'timefrom',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Lock removed'),
                dataIndex: 'timeto',
                renderer: this.dateColumnRenderer
            }, 
            {
                header: OSS.Localize.get('Login'),
                dataIndex: 'vg_login'
            }, 
            {
                header: OSS.Localize.get('Manager'),
                dataIndex: 'manager_name',
                flex: 1
            }, 
            {
                header: OSS.Localize.get('Lock type'),
                flex: 1,
                dataIndex: 'block_type',
                renderer: function(value) {
                    var store = Ext.app.Application.instance.getController('History').getHistoryLocksTypesStore(),
                        index = store.findExact('id', value);
                    if (index == -1) {
                        return '';
                    }
                    return store.getAt(index).get('name');
                }
            }
        ];
        this.callParent( arguments );
    }
});
