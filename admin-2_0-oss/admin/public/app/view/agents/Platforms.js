/**
 * Таблица платформ дла раздела Объекты/Агенты
 */
Ext.define('OSS.view.agents.Platforms', {
    extend: 'Ext.grid.Panel',
    store: 'agents.Platforms',
    title: i18n.get('Platforms'),
    itemId: 'platforms',
    statics: {
        editModeOnly: true
    },
    viewConfig:{
        markDirty:false
    },
    initComponent: function() {
        this.columns = [Ext.create('OSS.view.platforms.CheckColumn', {
            controller: Ext.app.Application.instance.getController('Agents'),
            validity: 'platformAgents'
        }), {
            header: i18n.get('Name'),
            dataIndex: 'name',
            width: 150
        }, {
            header: i18n.get('Description'),
            flex: 1,
            dataIndex: 'descr'
        }];
        this.tbar = Ext.create('OSS.view.agents.Toolbar');
        this.callParent(arguments);
    }
});
