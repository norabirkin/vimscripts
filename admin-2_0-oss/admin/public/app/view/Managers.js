Ext.define('OSS.view.Managers', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.ossmanagers',
    activeTab: 0,
    plain: true,
    frame: true,
    initComponent: function() {
        this.items = [{
            title: i18n.get( 'Managers' ),
            xtype: 'panel',
            itemId: 'managersTab',
            layout: 'card',
            activeItem: 0,
            items: [{
                xtype: 'managerslist'
            }, {
                xtype: 'rolesformanager'
            }]
        }, {
            title: i18n.get( 'Roles' ),
            xtype: 'panel',
            itemId: 'rolesTab',
            layout: 'card',
            activeItem: 0,
            items: [{
                xtype: 'roleslist'
            }, Ext.create('OSS.view.managers.RulesTree')]
        }, {
            title: i18n.get('Tariffs'),
            xtype: 'panel',
            itemId: 'roleTariffsTab',
            layout: 'card',
            activeItem: 0,
            items: [{
                xtype: 'tgrolelist' // tg is Tariffs and Groups
            }, {
                xtype: 'roletariffs'
            }]
        }, {
            title: i18n.get('User groups'),
            xtype: 'panel',
            itemId: 'roleGroupsTab',
            layout: 'card',
            activeItem: 0,
            items: [{
                xtype: 'tgrolelist' // tg is Tariffs and Groups
            }, {
                xtype: 'rolegroups'
            }]
        }];
        this.callParent(arguments);
    }
});
