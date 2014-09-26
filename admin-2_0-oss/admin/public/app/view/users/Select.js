Ext.define('OSS.view.users.Select', {
    singleton: true,
    requires: [
        'OSS.view.users.Search',
        'OSS.view.users.TypeColumn'
    ],
    columns: function() {
        return [];
    },
    props: function() {
        return OSS.view.users.Search.props();
    }
});
