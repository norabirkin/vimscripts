Ext.define('OSS.store.radiusattributes.RadiusAgents', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.radiusattributes.RadiusAgents',
    model: 'OSS.model.radiusattributes.RadiusAgents',
    proxy: {
        type: 'rest',
        url: 'index.php/api/agents',
        extraParams: {
            types: '6,12'
        },
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
