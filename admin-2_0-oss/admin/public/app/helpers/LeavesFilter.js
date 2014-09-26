Ext.define("OSS.helpers.LeavesFilter", {
    
    constructor: function( config ) { this.initConfig(config); }, 
    
    applyStore: function( store ) {
        
        if (typeof store == "string") {
            store = Ext.data.StoreManager.lookup(store);
        }
        store.on( "load", function(){
            this.snapshot = this.store.getRootNode();
        }, this);
        return store;
        
    },
    
    config: {
        
        checkFolders: false,
        store: null,
        snapshot: null,
        toolbar: null,
        params: {},
        checkValue: function( actual, expected ) {
            if (!expected) {
                return true;
            }
            if ( typeof expected == "string" ) {
                expected = new RegExp( expected,"i" );
                return expected.test( actual ); 
            }
            return actual == expected;
        },
        filter: function( node ) {
            var field;
            for (field in this.params) {
                if (!this.checkValue( node.get(field), this.params[field] )) {
                    return false;
                }
            }
            return true;
        },
        cloneNode: function( record ) {
            var data = {},
                i,
                cloned;
            for (i in record.data) {
                if (i != "children") {
                    data[i] = record.data[i];
                }
            }
            cloned = Ext.create( record.$className, data );
            cloned.on( "beforeexpand", function(){
                record.set( "expanded", true );
            });
            cloned.on( "beforecollapse", function(){
                record.set( "expanded", false );
            });
            return cloned;
        },
        traverse: function( root, nodes ) {
            var hasValidItem = false,
                hasValidDescendant = false,
                index,
                i,
                node;
            for (i in nodes) {
                node = this.cloneNode( nodes[i] );
                if (this.checkFolders || !nodes[i].childNodes.length) {
                    if (this.filter(node)) {
                        root.appendChild( node );
                        hasValidItem = true;
                    }
                }
                if (nodes[i].childNodes.length > 0) {
                    if (this.traverse(node, nodes[i].childNodes)) {
                        root.appendChild( node );
                        hasValidDescendant = true;
                    }
                }
            }
            return hasValidItem || hasValidDescendant;
        },
        getParamsFromToolbar: function() {
            var fields = this.toolbar.query( "field" );
            var params = {};
            for (var i in fields) {
                if (fields[i].treeFilter !== false) {
                    params[ fields[i].name ] = fields[i].getValue();
                }
            }
            return params;
        },
        run: function( params ) {
            var root = Ext.create( this.snapshot.$className ),
                nodes = this.snapshot.childNodes,
                i,
                filter = false;
            this.params = (this.toolbar) ? this.getParamsFromToolbar(): params;
            for (i in this.params) {
                if (this.params[i]) {
                    filter = true;
                    break;
                }
            }
            if (filter) {
                this.traverse( root, nodes );
                if (root.childNodes.length === 0) {
                    root.set("leaf", true);
                }
                this.store.setRootNode( root );
            } else {
                this.store.setRootNode(this.snapshot);
            }
        }
        
    }

});
