Ext.define('OSS.store.recalculation.Agents', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: [
        'OSS.model.recalculation.Agents'
    ],
    model: 'OSS.model.recalculation.Agents',
    proxy: {
        type: 'rest',
        url: 'api/recalculation/agentsList',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
