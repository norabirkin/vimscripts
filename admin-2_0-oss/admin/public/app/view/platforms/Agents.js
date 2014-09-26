/**
 * Таблица агентов для раздела Объекты/Платформы
 */
Ext.define('OSS.view.platforms.Agents', {
    extend: 'Ext.tree.Panel',
    itemId: 'agents',
    rootVisible: false,
    viewConfig:{
        markDirty:false
    },
    tbar: {
        items: [{
            xtype: 'back'
        }]
    },
    initComponent: function() {
        this.columns = [Ext.create('OSS.view.platforms.CheckColumn', {
            isActive: function(record) {
                return record.get('agent_id') && !record.get('disabled');
            },
            controller: Ext.app.Application.instance.getController('Platforms'),
            validity: 'agentPlatforms'
        }), {
            xtype: 'treecolumn',
            flex: 1,
            header: i18n.get('Text'),
            dataIndex: 'text'
        }];
        this.callParent(arguments);
    },
    store: 'platforms.Agents'
});
