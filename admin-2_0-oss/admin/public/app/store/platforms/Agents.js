/**
 * Хранилище для дерева агентов
 */
Ext.define('OSS.store.platforms.Agents', {
    extend: 'Ext.data.TreeStore',
    lazy: true,
    validity: ['agents', 'platformAgents'],
    fields: [{
        name: 'agent_id',
        type: 'int'
    }, {
        name: 'platform_id',
        type: 'int'
    }, {
        name: 'attached',
        type: 'int'
    }, {
        name: 'text',
        type: 'string'
    }, {
        name: 'disabled',
        type: 'int'
    }],
    proxy: {
        type: 'ajax',
        url: Ext.Ajax.getRestUrl('api/platforms/agents')
    }
});
