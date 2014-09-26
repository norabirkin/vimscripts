Ext.define('OSS.view.UserGroups', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.usergrp',
    layout: 'card',
    frame: true,
    plain: true,
    title: OSS.Localize.get('User groups'),
    items: [{ xtype: 'usergroups_list' }, { xtype: 'usergroups_form' }]
});
