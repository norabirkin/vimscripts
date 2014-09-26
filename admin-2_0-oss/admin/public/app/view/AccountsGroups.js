Ext.define('OSS.view.AccountsGroups', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.accountsgroups',
    layout: 'card',
    frame: true,
    plain: true,
    title: OSS.Localize.get("Accounts groups"),
    items: [{ xtype: 'groupslist' }, { xtype: 'groupaccounts' }, { xtype: 'grouptariffs' }]
});
