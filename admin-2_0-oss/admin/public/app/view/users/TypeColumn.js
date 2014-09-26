Ext.define('OSS.view.users.TypeColumn', {
    extend: 'Ext.grid.column.Column',
    hidden: true,
    dataIndex: 'type', 
    header: i18n.get( 'Type' ),
    renderer: function( value ) {
        return value == 2 ? i18n.get('Physical person') : i18n.get('Legal entity');
    }
});
