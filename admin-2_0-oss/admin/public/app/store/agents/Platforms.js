/**
 * Хранилище для таблицы платформ в разделе Объекты/Агенты
 */
Ext.define('OSS.store.agents.Platforms', {
    extend: 'Ext.data.Store',
    lazy: true,
    validity: ['platforms', 'agentPlatforms'],
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
        name: 'name',
        type: 'string'
    }, {
        name: 'descr',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agentPlatforms'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
