Ext.define('OSS.view.addresses.grid.Window', {
    extend: 'Ext.window.Window',
    width: 800,
    layout: 'card',
    grids: {},
    initComponent: function() {
        this.items = [
            this.addGrid( 'region_id', 'OSS.view.addresses.grid.Regions' ),
            this.addGrid( 'area_id', 'OSS.view.addresses.grid.Areas' ),
            this.addGrid( 'city_id', 'OSS.view.addresses.grid.Cities' ),
            this.addGrid( 'settl_id', 'OSS.view.addresses.grid.Settles' ),
            this.addGrid( 'street_id', 'OSS.view.addresses.grid.Streets' ),
            this.addGrid( 'country_id', 'OSS.view.addresses.grid.Countries' ),
            this.addGrid( 'building_id', 'OSS.view.addresses.grid.Buildings' ),
            this.addGrid( 'flat_id', 'OSS.view.addresses.grid.Flat' ),
            this.addGrid( 'porch_id', 'OSS.view.addresses.grid.Porches' ),
            this.addGrid( 'floor_id', 'OSS.view.addresses.grid.Floors' )
        ];
        this.callParent( arguments );
    },
    activateGrid: function( field ) {
        this.getLayout().setActiveItem( this.getGrid(field) );
    },
    getGrid: function( field ) {
        if (!this.grids[field]) {
            throw 'no grid';
        }
        return this.grids[field];
    },
    addGrid: function( field, classname ) {
        this.grids[field] = Ext.create( classname );
        return this.grids[field];
    },
    close: function() {
        this.hide();
    }
});
