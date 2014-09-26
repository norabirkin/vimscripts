Ext.define('OSS.view.Addresses', {
    extend: 'Ext.window.Window',
    alias: 'widget.addresses',
    
    addressType: 0,
    uid: 0,
    
    height: 380,
    width: 640,
    resizable: false,
    activeItem: 0,
    layout: {
        type: 'card'
    },
    title: i18n.get('Addresses'),

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
        /* First card: Address Searching form */
                xtype: 'gridpanel',
                autoScroll: true,
                dockedItems: [{
                xtype: 'toolbar',
                    dock: 'top',
                    height: 30,
                    items: [{
                        xtype: 'splitbutton',
                        itemId: 'actions',
                        text: i18n.get('Actions'),
                        menu: {
                            xtype: 'menu',
                            items: [{
                                xtype: 'menuitem',
                                itemId: 'createBtn',
                                text: i18n.get('Create new entry')
                            }, {
                                xtype: 'menuitem',
                                itemId: 'applyBtn',
                                text: i18n.get('Apply selected')
                            }]
                        },
                        handler: function(Btn) {
                            Btn.showMenu();
                        }
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'textfield',
                        labelAlign: 'right',
                        checkChangeBuffer: 500,
                        fieldLabel: i18n.get('Address'),
                        itemId: 'address_search',
                        labelWidth: 50,
                        flex: 1,
                        margin: '0 10 0 0'
                    }]
                }],
                columns: [{
                    xtype: 'actioncolumn',
                    iconCls: 'x-ibtn-edit',
                    itemId: 'editAddressBtn',
                    width: 27
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'value',
                    flex: 1,
                    text: i18n.get('Address')
                }],
                store: 'Addresses',
                selType: 'rowmodel',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    mode: 'SINGLE'
                })
            },
            /* Second card: Editing form */
                {
                    xtype: 'form',
                    frame: false,
                    bodyPadding: 10,
                    url: 'index.php/api/addressSearch/applyAddress',
                    bodyCls: 'x-fieldset-background',
                    defaults: {
                        labelWidth: 120
                    },
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        height: 30,
                        items: [{
                            xtype: 'back',
                            form: function() {
                                return [
                                    Ext.app.Application.instance.getController('Addresses').getAddressForm()
                                ];
                            }
                        }, '-', {
                            xtype: 'splitbutton',
                            text: i18n.get('Actions'),
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    xtype: 'menuitem',
                                    itemId: 'applyFormBtn',
                                    text: i18n.get('Save')
                                }]
                            },
                            handler: function(Btn) {
                                Btn.showMenu();
                            }
                        }]
                    }],
                    items: [{
                            xtype: 'fieldcontainer',
                            onRemove: ['region_id','area_id','city_id','settle_id','street_id','building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: ['region_id'],
                            itemId: 'country',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Country'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'country_new',
                                    value: 0
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'country_id',
                                    params: [],
                                    allowBlank: false,
                                    hiddenName: 'country_id',
                                    itemId: 'country_id',
                                    store: 'addresses.Countries'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['area_id','city_id','settle_id','street_id','building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: ['area_id','city_id','settle_id','street_id'],
                            disabled: true,
                            itemId: 'region',                           
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Region'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'region_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'region_meaning',
                                    hiddenName: 'region_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Regions',
                                    triggerAction: 'all',
                                    queryMode: 'local',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'region_id',
                                    hiddenName: 'region_id',
                                    params: ['country_id'],
                                    itemId: 'region_id',
                                    store: 'addresses.Regions'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['city_id','settle_id','street_id','building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: [],
                            disabled: true,
                            itemId: 'area',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Area'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'area_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'area_meaning',
                                    hiddenName: 'area_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Areas',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'area_id',
                                    params: ['region_id'],
                                    hiddenName: 'area_id',
                                    itemId: 'area_id',
                                    store: 'addresses.Areas'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['street_id','building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: [],
                            disabled: true,
                            itemId: 'city',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('City'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'city_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'city_meaning',
                                    hiddenName: 'city_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    store: 'addresses.meanings.Cities',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'city_id',
                                    params: ['region_id', 'area_id'],
                                    itemId: 'city_id',
                                    hiddenName: 'city_id',
                                    store: 'addresses.Cities'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['street_id','building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: [],
                            disabled: true,
                            itemId: 'settle',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Settle'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'settle_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'settle_meaning',
                                    hiddenName: 'settle_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    store: 'addresses.meanings.Settles',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'settle_id',
                                    params: ['region_id', 'city_id', 'area_id'],
                                    itemId: 'settle_id',
                                    hiddenName: 'settle_id',
                                    store: 'addresses.Settles'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['building_id','flat_id','entrance_id','floor_id','postcode'],
                            onSelect: ['building_id','postcode'],
                            disabled: true,
                            itemId: 'street',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Street'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'street_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'street_meaning',
                                    hiddenName: 'street_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    store: 'addresses.meanings.Streets',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'street_id',
                                    params: ['region_id', 'settle_id', 'city_id'],
                                    itemId: 'street_id',
                                    hiddenName: 'street_id',
                                    store: 'addresses.Streets'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: ['flat_id','entrance_id','floor_id','postcode'],
                            onSelect: ['flat_id','entrance_id','floor_id'],
                            disabled: true,
                            itemId: 'building',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Building') + ' / ' + i18n.get('Block'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'building_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'building_meaning',
                                    hiddenName: 'building_meaning',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Buildings',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                            // Building 
                                {
                                    xtype: 'searchcombo',
                                    name: 'building_id',
                                    minChars: 1,
                                    width: 50,
                                    params: ['street_id', 'settle_id', 'city_id', 'region_id'],
                                    itemId: 'building_id',
                                    hiddenName: 'building_id',
                                    store: 'addresses.Buildings'
                                },
                            
                            // Block    
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'tbtext',
                                    text: 'кор.'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'block',
                                    width: 50,
                                    hideLabel: true,
                                    //params: ['building_id', 'district_id', 'city_id', 'region_id'],
                                    itemId: 'block_id'
                                },
                                
                            // Construction 
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'tbtext',
                                    text: 'стр.'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'construction',
                                    width: 50,
                                    hideLabel: true,
                                //  params: ['building_id', 'district_id', 'city_id', 'region_id'],
                                    itemId: 'construction_id'
                                },
                                
                            // Ownership    
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'tbtext',
                                    text: 'вл.'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'ownership',
                                    width: 50,
                                    hideLabel: true,
                                //  params: ['building_id'],
                                    itemId: 'ownership_id'
                                },
                                
                            // Clear values btn 
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit',
                                    itemId: 'clearBuildingValues'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: [],
                            disabled: true,
                            itemId: 'flat',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Flat') + ' / ' + i18n.get('Office'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'flat_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'flat_meaning',
                                    hiddenName: 'flat_meaning',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Flats',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'flat_id',
                                    params: ['region_id', 'building_id'],
                                    itemId: 'flat_id',
                                    hiddenName: 'flat_id',
                                    minChars: 1,
                                    store: 'addresses.Flats'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: [],
                            disabled: true,
                            itemId: 'entrance',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Entrance'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'entrance_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'entrance_meaning',
                                    hiddenName: 'entrance_meaning',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Entrances',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'entrance_id',
                                    params: ['region_id', 'building_id'],
                                    itemId: 'entrance_id',
                                    hiddenName: 'entrance_id',
                                    minChars: 1,
                                    store: 'addresses.Porches'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            onRemove: [],
                            disabled: true,
                            itemId: 'floor',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Floor'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'floor_new',
                                    value: 0
                                },
                                {
                                    xtype: 'combobox',
                                    editable: false,
                                    name: 'floor_meaning',
                                    hiddenName: 'floor_meaning',
                                    tirggerAction: 'all',
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'record_id',
                                    store: 'addresses.meanings.Floors',
                                    width: 120
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'searchcombo',
                                    name: 'floor_id',
                                    minChars: 1,
                                    params: ['region_id', 'building_id'],
                                    itemId: 'floor_id',
                                    hiddenName: 'floor_id',
                                    store: 'addresses.Floors'
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            disabled: true,
                            onRemove: [],
                            itemId: 'postcode',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            fieldLabel: i18n.get('Post code'),
                            items: [{
                                    xtype: 'hidden',
                                    name: 'postcode_new',
                                    value: 0
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'postcode',
                                    itemId: 'postcode',
                                    flex: 1
                                },
                                {
                                    xtype: 'tbspacer',
                                    width: 5
                                },
                                {
                                    xtype: 'delsplit'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },
    close: function() {
        this.hide();
    }
});
