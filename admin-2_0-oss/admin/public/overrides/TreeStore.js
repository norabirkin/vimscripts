/**
 * Хранилище дерева
 */
Ext.define('OSS.overrides.data.TreeStore', function() {
    return {
        override: 'Ext.data.TreeStore',
        load: function() {
            if (this.lazy) {
                this.rootSnapshotForLazy = this.getRootNode().copy(null, true);
            }
            this.callParent(arguments);
            if (this.lazy) {
                this.rootSnapshotForLazy = null;
            }
        },
        onLoadNotNeccesary: function() {
            this.setRootNode(this.rootSnapshotForLazy);
        }
    };
}());
