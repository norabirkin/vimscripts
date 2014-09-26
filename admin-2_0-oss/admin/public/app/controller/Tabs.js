Ext.define( 'OSS.controller.Tabs', {
    extend: 'Ext.app.Controller',
    getMainPanelAlias: function() { throw 'define getMainPanelAlias method'; },
    init: function() {
        this.addRefs([
            {
                selector: this.getMainPanelAlias(),
                ref: 'mainPanel'
            }, 
            {
                selector: this.getMainPanelAlias() + ' > #tabs',
                ref: 'tabs'
            },
            {
                selector: this.getMainPanelAlias() + ' > #wrapper > #agreements',
                ref: 'agreements'
            }
        ]);
        var c = {};
        c[this.getMainPanelAlias() + ' > #tabs'] = { tabchange: this.onTabChange };
        c[this.getMainPanelAlias() + ' > #wrapper > #agreements'] = { change: this.onAgreementChanged };
        this.control( c );
    },
    addRefs: function( refs ) {
        for (var i = 0; i < refs.length; i ++) {
            this.addRef( refs[i] );
        }
    },
    onTabChange: function() {
        arguments[1].fireEvent( 'tabactivated' );
    },
    beforeTabsEnabled: function() {},
    onAgreementChanged: function(field, value) {
        var record = this.getAgreements().find('agrm_id', value) || this.initialParams.agrm;
        this.beforeTabsEnabled( record, value );
        if ( value ) { 
            this.getTabs().enable(); 
            this.onAfterAgreementChanged();
        } else {
            this.getTabs().disable();
        }
    },
    onAfterAgreementChanged: function() {
        this.getTabs().items.each(function( item ) { 
            item.agrm_id = this.getAgreements().getValue();
            item.fireEvent('agreementchanged', this.getTabs().getActiveTab()); 
        }, this);
    },
    ucFirst: function( str ) { return str.charAt(0).toUpperCase() + str.slice(1); },
    openWindow: function( params ) {
        this.initialParams = params;
        Ext.app.Application.instance.getController('Users').getAgreementsStore().proxy.extraParams = { uid: (params.uid || 0) };
        if (!this.getMainPanel()) {
            this.getView( this.ucFirst(this.getMainPanelAlias()) ).create();
        }
        this.getMainPanel().show();
        if ( params.agrm ) {
            this.getAgreements().setValue( params.agrm.get('agrm_id') ); 
            if (this.getAgreements().getRawValue() === "") {
                this.getAgreements().setRawValue( params.agrm.get('agrm_num') );
            }
        }
    }
});
