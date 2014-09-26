Ext.define('OSS.view.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.users',
    layout: 'card',
    frame: true,
    plain: true,
    title: i18n.get('Users'),
    items: [{ xtype: 'users_list' }, { xtype: 'users_agreements' }, { xtype: 'user_form' }]
});
