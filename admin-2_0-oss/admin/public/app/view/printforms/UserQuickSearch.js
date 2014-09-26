Ext.define('OSS.view.printforms.UserQuickSearch', {
    extend: 'OSS.view.users.Combogrid',
    alias: 'widget.userquicksearch',
    name: 'uid',
    width: '100%',
    store: 'Users',
    loadOnRender: false,
    valueField: 'uid',
    displayField: 'name',
    columns: [{
        header: i18n.get('ID'),
        dataIndex: 'uid',
        width: 50 
    }, {
        header: i18n.get('User name'),
        dataIndex: 'name',
        flex: 1
    }]
});
