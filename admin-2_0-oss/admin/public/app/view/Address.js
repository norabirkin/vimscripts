Ext.define('OSS.view.Address', {
    extend: 'Ext.window.Window',
    alias: 'widget.address',
    title: i18n.get('Address book'),
    width: 459,
    modal: true,
    turnedOn: true,
    tbar: [{ 
        xtype: 'button', 
        itemId: 'save', 
        text: i18n.get('Save')
    }],
    initComponent: function() {
        this.items = [Ext.create('OSS.view.addresses.Form', {
            items: [
                {
                    type: 'combo',
                    itemId: 'country_id',
                    fieldLabel: i18n.get('Country'),
                    buttonTooltip: i18n.get('Add')+ ' / ' + i18n.get('Edit')+ ': ' + i18n.get('Country-y'),
                    store: Ext.create('OSS.store.addresses.Countries')
                },
                {
                    type: 'grid',
                    itemId: 'region_id',
                    enabledIf: function() { this.isNotEmpty('country_id'); },
                    params: ['country_id'],
                    fieldLabel: i18n.get('Region'),
                    buttonTooltip: i18n.get('Choose') + ': ' + i18n.get('Region')
                },
                {
                    type: 'grid',
                    itemId: 'area_id',
                    enabledIf: function() { this.isNotEmpty('region_id'); },
                    params: ['region_id'],
                    fieldLabel: i18n.get('District'),
                    buttonTooltip: i18n.get('Choose') + ': ' + i18n.get('District')
                },
                {
                    type: 'grid',
                    itemId: 'city_id',
                    enabledIf: function() { this.isNotEmpty('region_id'); },
                    params: ['region_id', 'area_id'],
                    fieldLabel: i18n.get('City'),
                    buttonTooltip: i18n.get('Choose') + ': ' + i18n.get('City')
                },
                {
                    type: 'grid',
                    itemId: 'settl_id',
                    enabledIf: function() { this.isNotEmpty('region_id'); },
                    params: ['region_id', 'city_id', 'area_id'],
                    fieldLabel: i18n.get('Area'),
                    buttonTooltip: i18n.get('Choose') + ': ' + i18n.get('Area')
                },
                {
                    type: 'grid',
                    itemId: 'street_id',
                    enabledIf: function() { this.isNotEmpty('region_id'); },
                    params: ['region_id', 'city_id', 'settl_id'],
                    fieldLabel: i18n.get('Street'),
                    buttonTooltip: i18n.get('Choose') + ': ' + i18n.get('Street-y') + ' / ' + i18n.get('Post code'),
                    onChange: function() { this.setPostCode(); },
                    onValueRecordChanged: function() {
                        this.setPostCode();
                    }
                },
                {
                    type: 'combo',
                    itemId: 'building_id',
                    displayField: 'descr',
                    enabledIf: function() { this.atLeastOneIsNotEmpty(['city_id', 'settl_id', 'street_id']); },
                    params: ['street_id', 'settl_id', 'city_id', 'region_id'],
                    fieldLabel: i18n.get('Building') + ' / ' + i18n.get('Block'),
                    store: Ext.create( 'OSS.store.addresses.Buildings' ),
                    buttonTooltip: i18n.get('Add') + ' / ' + i18n.get('Edit') + ': ' + i18n.get('Building') + ' / ' + i18n.get('Block') + ' / ' + i18n.get('Post code'),
                    onChange: function() { this.setPostCode(); },
                    onValueRecordChanged: function() {
                        this.setPostCode();
                    }
                },
                {
                    type: 'combo',
                    itemId: 'flat_id',
                    displayField: 'descr',
                    enabledIf: function() { this.isNotEmpty('building_id'); },
                    params: ['region_id', 'building_id'],
                    fieldLabel: i18n.get('Flat') + ' / ' + i18n.get('Office'),
                    store: Ext.create( 'OSS.store.addresses.Flats' ),
                    buttonTooltip: i18n.get('Add') + ' / ' + i18n.get('Edit') + ': ' + i18n.get('Flat-y') + ' / ' + i18n.get('Office')
                }, 
                {
                    type: 'combo',
                    itemId: 'porch_id',
                    enabledIf: function() { this.isNotEmpty('building_id'); },
                    params: ['region_id', 'building_id'],
                    fieldLabel: i18n.get('Porch'),
                    store: Ext.create( 'OSS.store.addresses.Porches' ),
                    buttonTooltip: i18n.get('Add') + ' / ' + i18n.get('Edit') + ': ' + i18n.get('Porch')
                },
                {
                    type: 'combo',
                    itemId: 'floor_id',
                    enabledIf: function() { this.isNotEmpty('building_id'); },
                    params: ['region_id', 'building_id'],
                    fieldLabel: i18n.get('Floor'),
                    store: Ext.create( 'OSS.store.addresses.Floors' ),
                    buttonTooltip: i18n.get('Add') + ' / ' + i18n.get('Edit') + ': ' + i18n.get('Floor')
                },
                { classname: 'OSS.view.addresses.form.item.PostCode' }
            ]
        })];                
        this.callParent( arguments );
    },
    close: function() {
        this.hide();
    }
});
