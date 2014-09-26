Ext.define( 'OSS.controller.Address', {
    extend: 'Ext.app.Controller',
    requires: ['OSS.ux.form.field.text.Search'],
    views: [
        'Address',
        'addresses.Form',
        'addresses.form.item.Combo',
        'addresses.form.item.Grid',
        'addresses.form.item.PostCode',
        'addresses.grid.Window',
        'addresses.grid.Regions',
        'addresses.grid.Areas',
        'addresses.grid.Cities',
        'addresses.grid.Settles',
        'addresses.grid.Streets',
        'addresses.grid.Countries',
        'addresses.grid.Buildings',
        'addresses.grid.Flat',
        'addresses.grid.Porches',
        'addresses.grid.Floors'
    ],
    stores: [
        'addresses.Countries',
        'addresses.Buildings',
        'addresses.Flats',
        'addresses.Porches',
        'addresses.Floors',
        'addresses.Meaning',
        'addresses.Regions',
        'addresses.Areas',
        'addresses.Cities',
        'addresses.Settles',
        'addresses.Streets'
    ],
    refs: [{
        selector: 'address > panel',
        ref: 'form'
    }],
    init: function() {
        this.control({
            'address': { show: this.load },
            'address > toolbar > #save': { click: this.save }
        });
    },
    save: function() {
        this.onSave( this.getForm().getAddress() );
        this.getWindow().hide();
    },
    load: function() {
        this.getForm().load( this.address );
    },
    getWindow: function() {
        if (!this.win) {
            this.win = Ext.create('OSS.view.Address');
        }
        return this.win;
    },
    openWindow: function( params ) {
        this.address = params.address;
        this.onSave = Ext.bind( params.onSave, params.scope );
        this.getWindow().show();
    },
    getAddressName: function( addresstype, usertype ) {
        switch (addresstype) {
            case 1:
                return usertype == 1 ? OSS.Localize.get('Legal address') : OSS.Localize.get('Registered address');
                break;
            case 2:
                return OSS.Localize.get('Post address');
                break;
            case 3:
                return OSS.Localize.get('Address deliver invoice');
                break;
        }
    }
});
