Ext.define( "OSS.view.agents.ComplexAgentParamGrid", {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    toolbarClassName: 'OSS.view.agents.Toolbar',
    
    removeItems: function() {
        me = this;
        this.getSelectionModel().selected.each(function( record ){
            me.getStore().remove( record );
        });
        this.fireEvent( "datachanged" );
    },
    
    saveItem: function() {
        this.getStore().data.each(function( record ) {
            record.isNewRecord = false;
        });
        this.fireEvent( "datachanged" );
        return true;
    },

    deleteNewItem: function( p1, options ) {
        var record = options.record;
        var store = options.store;
        if ("isNewRecord" in record && record.isNewRecord == true) {
            store.remove( record );
        }
    },

    onNewNodeCreated: function( node ) {
        node.isNewRecord = true;
    },

    beforeGettingItem: function( data ) {
        return data;
    },

    restoreLocallyStoredDataIfPossible: function( values ) {
        var param = values[this.paramName];
        if (param != "") {
            this.onValuesRecieved(Ext.JSON.decode( param )); return true;
        } else {
            return false;
        }
    },

    handleExtendedAgentData: function( data ) {
        this.onValuesRecieved( data[this.paramName] );
        this.fireEvent( "datachanged" );
    },
    
    requestExtendedAgentData: function( values, callback ) {
         Ext.Ajax.request({
            url: "index.php/api/agents/" + values.id,
            success: function( response ) {
                values.extended = Ext.JSON.decode(response.responseText).results;
                Ext.bind( callback, this )(values.extended);
            },
            scope: this
        });
    },

    onTabsActivated: function( values ) {
        if (this.getStore().dataLoaded) {
            return;
        }
        if ( !this.restoreLocallyStoredDataIfPossible(values) && values.id != 0 ) { 
            if (!values.extended) {
                this.requestExtendedAgentData( values, this.handleExtendedAgentData );
            } else {
                this.handleExtendedAgentData( values.extended );
            }
        }
        this.getStore().dataLoaded = true;
    },

    listeners: {
        tabactivated: function( values ) {
            this.onTabsActivated( values );
        },
        addedtotabs: function( panel, agentData ) {
            this.on( "datachanged", function() {
                var data = [];
                this.getStore().data.each(function( record ) {
                    data.push( this.beforeGettingItem(record.data) );
                }, this);
                var params = {};
                agentData[ this.paramName ] = Ext.JSON.encode(data);
                //console.log( this.paramName + " : " + agentData[ this.paramName ] );
            });
        },
        editagent: function() {
            this.getStore().removeAll();
            this.getStore().dataLoaded = false;
        },
        createagent: function() {
            this.getStore().removeAll();
            this.getStore().dataLoaded = false;
        }
    }
});
