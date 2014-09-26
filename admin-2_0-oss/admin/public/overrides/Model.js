Ext.define('OSS.overrides.data.Model', function() {
    return {
        override: 'Ext.data.Model',
        save: function(options) {
            if (!options || !(options.ok && !options.callback)) {
                return this.callParent(arguments);
            }
            options.callback = function(record, operation, success) {
                if (!success) {
                    return;
                }
                Ext.bind(options.ok, (options.scope || {}))(record, Ext.JSON.decode(operation.response.responseText).results);
            };
            return this.callParent(arguments);
        }
    };
}());
