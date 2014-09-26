Ext.define( "OSS.view.agents.FormTab", {
    listeners: {
        tabactivated: function( data ) {
            this.onTabActivated( data );
        },
        createagent: function( data, validation ) {
            this.onCreateAgent( data, validation );
        },
        editagent: function( data, validation ) {
            this.onEditAgent( data, validation );
        },
        addedtotabs: function( panel, data ) {
            this.onAddedToTabs( panel, data );
        },
        tabenable: function() {
            this.validateTab();
        },
        disable: function() {
            this.onTabDisable();
        }
    },
    onCreateAgent: function( data, validation ) {
        this.dataChanged( data, validation );
    },
    onEditAgent: function( data, validation ) {
        this.dataChanged( data, validation );
    },
    dataChanged: function( data, validation ) {
        this.getForm().setValues( data );
        if (!validation.valid) {
            return;
        }
        var valid = this.getForm().isValid();
        this.lastValidation = valid;
        validation.valid = valid;
        validation.step = this.step;
    },
    modifyData: function() {
        var name = arguments[0].getName();
        var value = arguments[1];
        if (value === true) {
            value = 1;
        }
        if (value === false) {
            value = 0;
        }
        this.data[ name ] = value;
        this.me.validateTab();
        //console.log( name + " : " + value );
    },
    onAddedToTabs: function( panel, data ) {
        var fields = this.query( "field" ),
            params = {
                me: this,
                data: data
            },
            i;
        for (i = 0; i < fields.length; i ++) {
            Ext.bind(this.modifyData, params)(fields[i], fields[i].getValue());
            fields[i].on( "change", this.modifyData, params);
        }
        if (this.lastValidation) {
            this.onSuccessfullValidation();
        } else {
            this.onUnsuccessfulValidation();
        }
    },
    onTabDisable: function() {
        delete( this.lastValidation );
    },
    validateTab: function() {
        var valid = this.getForm().isValid();
        if ( this.lastValidation !== valid ) { 
            this.lastValidation = valid;
            this.fireEvent( "formvaluechanged", this.step, valid ); 
            if (valid) {
                this.onSuccessfullValidation();
            } else {
                this.onUnsuccessfulValidation();
            }
        }
    },
    onSuccessfullValidation: function() { this.fireEvent( "alltabsvalid" ); },
    onUnsuccessfulValidation: function() { this.fireEvent( "invaliddata" ); },
    onTabActivated: function( data ) {}
});
