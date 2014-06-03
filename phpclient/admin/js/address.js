/**
 * Address book manipulation.
 * This function contain engine to return array object for the selected address items
 * Also you can add new items to the dictionary through this function
 *
 * Repository information:
 * @date        $Date: 2014-03-21 14:06:38 +0400 (Пт., 21 марта 2014) $
 * @revision    $Revision: 42296 $
 */


/**
 * Show address panel
 * @param    function, pass selected address to the specified function
 * @param    object, should contains two param
 *           code - address code number with 8 items
 *           string - address string with 8 items
 * @param    Mixed, arguments to pass to function
 */
function address(A, B, C) {
    if (!Ext.isEmpty(Ext.getCmp('Kladr'))) {
        return
    }
    Ext.QuickTips.init();

    // To return address result use Address.compile
    // Returns object with three params:
    // code - number code
    // full - full address line
    // clear - without empty items
    var Address = {
        getValue: function(A){
            try {
                return this.items[A].value;
            }
            catch (e) {
                return null
            }
        },
        items: {
            country:    {},
            region:     {},
            district:   {},
            city:       {},
            settle:     {},
            street:     {},
            building:   {},
            flat:       {},
            porch:      {},
            floor:      {},
            postcode:   {}
        },
		
        init: function(A, C) {
            if (Ext.isEmpty(C)) {
                var C = 'int';
            };
			
            var B = [];
            B = A.split(',');

            var F = 0;
            for (var i in this.items)
            {
                if (C == 'int') {
                    this.items[i].value = Ext.isEmpty(B[F]) ? 0 : (Ext.util.Format.trim(B[F]) * 1);
                };
				
				if (C == 'string') {
					/**
					 * Для корректного отображения индекса. Связано с отсутствием детализации адреса для расширеного набора кодов
					 */
					if (i == 'porch' || i == 'floor') {
						this.items[i].text = '';
					}  else if (i == 'postcode') {
						this.items[i].text = ((typeof B[F] == 'undefined') ? '' : Ext.util.Format.trim(B[F]));
					}  else if (i == 'flat') {
						this.items[i].text = ((typeof B[F] == 'undefined') ? '' : Ext.util.Format.trim(B[F]));
						if(this.items[i].text == "") this.items[i].text = ((typeof B[F+2] == 'undefined') ? '' : Ext.util.Format.trim(B[F+2]));
					}  else {
						this.items[i].text = ((typeof B[F] == 'undefined') ? '' : Ext.util.Format.trim(B[F]));
					}
			   };
						
                if (Ext.isEmpty(this.items[i].setValue)) {
                    this.items[i].setValue = function(A, B){

                        if (this.value != A) {
                            this.parent.unsetUnderIndex(this.index, (this.index > 5) ? true : false);
                        };

                        this.value = A;
                        this.text = B;
                        this.parent.syncText();
                    };
                    this.items[i].parent = this;
                };


                if (Ext.isEmpty(this.items[i].slaves)) {
                    switch (i) {
                        case 'country':
                            this.items[i].slaves = ['region'];
                            break;
                        case 'region':
                            this.items[i].slaves = ['district', 'city', 'settle', 'street'];
                            break;
                        case 'city':
                            this.items[i].slaves = ['building'];
                            break;
                        case 'settle':
                            this.items[i].slaves = ['building'];
                            break;
                        case 'street':
                            this.items[i].slaves = ['building'];
                            break;
                        case 'building':
                            this.items[i].slaves = ['flat','porch', 'floor'];
                            break;
                        default:
                        case 'region':
                            this.items[i].slaves = [];
                    }
                };


                if (Ext.isEmpty(this.items[i].setCombo)) {

                    this.items[i].setCombo = function(A, B, C){
                        if (this.value != A) {
                            this.parent.unsetUnderIndex(this.index);
                        };

                        this.value = A;
                        this.text = B;

                        if (typeof this.child != 'object') {
                            this.child = Ext.getCmp(this.child);
                        }
                        if (this.child.store.find('id', A) == -1) {
                            var O = {
                                id: A,
                                name: B
                            };
                            if (!Ext.isEmpty(C) && C > 0) {
                                O.postcode = C
                            };
                            this.child.store.insert(0, new this.child.store.recordType(O));
                        }
                        else {
                            this.child.store.getAt(this.child.store.find('id', A)).data.name = this.text;
                            if (!Ext.isEmpty(C) && C > 0) {
                                this.child.store.getAt(this.child.store.find('id', A)).data.postcode = C
                            };
                            this.child.store.commitChanges();
                            this.child.store.reload();
                        };
                        this.child.setValue(A);
                        this.parent.syncText();
                    };
                    this.items[i].child = i + '_cmb';
                };


                if (Ext.isEmpty(this.items[i].index)) {
                    this.items[i].index = F
                };

                F++;
            };
        },
        compile: function(){
            var A = {
                code: [],
                full: [],
                clear: [],
                get: function(A){
                    if (typeof A == 'object') {
                        return A.join(', ')
                    }
                }
            };
            for (var i in this.items) {
                // Включительно до postcode, с подъездом и этажом
                if (this.items[i].index < 10) {
                    A.code.push(this.items[i].value);
                }
                A.full.push(this.items[i].text);
                if (this.items[i].value > 0 && this.items[i].index != 9 && this.items[i].index != 8) {
                    A.clear.push(this.items[i].text)
                }
            }
            return A;
        },

        controls: function(A, B){
            if (Ext.isEmpty(A) || typeof A != 'object' || A.length == 0) {
            };
            if (Ext.isEmpty(B)) {
                B = false
            };
            for (var i = 0, off = A.length; i < off; i++) {
                if (B == true) {
                    try {
                        Ext.getCmp(A[i] + '_btn').enable();
                    }
                    catch (e) {
                    };
                    try {
                        Ext.getCmp(A[i] + '_cmb').enable();
                    }
                    catch (e) {
                    };
                }
                else {
                    try {
                        Ext.getCmp(A[i] + '_btn').disable();
                    }
                    catch (e) {
                    };
                    try {
                        Ext.getCmp(A[i] + '_cmb').disable();
                    }
                    catch (e) {
                    }
                }
            }
        },

        syncText: function(){
            for (var i in this.items) {
                try {
                    Ext.get(i + '_text').dom.innerHTML = Ext.util.Format.ellipsis(this.items[i].text, 32);
                }
                catch (e) {
                };
                try {
                    Ext.getCmp(i + '_cmb').setValue(this.items[i].value);
                    Ext.getCmp(i + '_cmb').setRawValue(this.items[i].text);
                }
                catch (e) {
                };
                if (this.items[i].value > 0) {
                    this.controls(this.items[i].slaves, true)
                };
            }
        },

        unsetUnderIndex: function(A, B){
            var A = A * 1;
            if (A >= 7) {
                return;
            };
            for (var i in this.items) {
                if (this.items[i].index > A) {
                    if (B == true && this.items[i].index == 10) {
                        continue
                    };
                    this.items[i].value = 0;
                    this.items[i].text = '';
                    this.controls(this.items[i].slaves, false);
                    try {
                        if (typeof this.items[i].child != 'object' && !Ext.isEmpty(Ext.getCmp(this.items[i].child))) {
                            this.items[i].child = Ext.getCmp(this.items[i].child);
                        }
                        this.items[i].child.store.removeAll();
                        this.items[i].child.reset();
                    }
                    catch (e) {
                    };
                }
            }
        }
    }

    if (typeof A == 'undefined') {
        A = function(){}
    }

    if (Ext.isEmpty(B)) {
        B = {
            code: {},
            string: {}
        }
    };

    Address.init(B.code, 'int');
    Address.init(B.string, 'string');

    var W = new Ext.Window({
        title: Ext.app.Localize.get('Address book'),
        id: 'Kladr',
        width: 459,
        resizable: false,
        border       : false,
        autoScroll   : true,
        layout:'table',
        defaults: {
            height: 25,
            border: false,
            baseCls: 'x-plain'
        },
        layoutConfig: {
            columns: 4,
            height: 249
        },
        tbar: [
            {
                xtype: 'button',
                iconCls: 'ext-accept',
                text: Ext.app.Localize.get('Choose'),
                handler: function(){
                    try {
                        A(Address.compile(), C);
                    }
                    catch (e) {
                    };
                    W.close();
                }
            }
        ],

        items: [
            {
                width: 130,
                html: '<div class="ext-address">' + Ext.app.Localize.get('Country') + ':</div> '
            },
            {
                xtype: 'combo',
                id: 'country_cmb',
                emptyText: Ext.app.Localize.get('Country'),
                width: 210,
                displayField: 'name',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader({
                        root: 'results'
                    }, [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }]),
                    baseParams: {
                        async_call: 1,
                        devision: 41,
                        gettype: 0
                    },
                    autoLoad: true,
                    sortInfo: {
                        field: 'name',
                        direction: "ASC"
                    },
                    listeners: {
                        load: function(A){
                            A.each(function(A){
                                A.data.name = Ext.util.Format.ellipsis(A.data.name, 32);
                            });
                        }
                    }
                }),
                listeners: {
					beforequery: function(queryEv){
						queryEv.combo.expand();
						queryEv.combo.store.reload();
						return false;
					},
                    beforeselect: function(A, B){
                        Address.items.country.setValue(B.data.id, B.data.name);
                    },
                    select: function(A){
                        if (!Ext.isEmpty(A.getValue())) {
                            Address.controls(Address.items.country.slaves, true);
                        }
                    }
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-add',
                tooltip: Ext.app.Localize.get('Add')+ ' / ' + Ext.app.Localize.get('Edit')+ ': ' + Ext.app.Localize.get('Country-y'),
                style: 'margin: 0 15px',
                handler: function(){
                    searchAddressItem({
                        country: false
                    }, {
                        gettype: 0,
                        country: 0,
                        search: ''
                    }, function(A){
                        Address.items.country.setCombo(A.id, A.country);
                        Address.controls(Address.items.country.slaves, true);
                    });
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.country.setValue(0, '');
                    Address.controls(Address.items.country.slaves, false);
                }
            },


            {
                html: '<div class="ext-address">' + Ext.app.Localize.get('Region') + ':</div> '
            },
            {
                html: '<div id="region_text" class="ext-address-data">&nbsp;<div>',
                width: 208
            },
            {
                xtype: 'button',
                width: 30,
                id: 'region_btn',
                text: '...',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('Region'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        region: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 1,
                        country: Ext.getCmp('country_cmb').getValue(),
                        region: 0,
                        area: 0,
                        city: 0,
                        settl: 0,
                        search: ''
                    }, function(A){
                        Address.items.region.setValue(A.id, A.shortname + ' ' + A.region);
                        Address.controls(Address.items.region.slaves, true);
                    });
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.region.setValue(0, '');
                    Address.controls(Address.items.region.slaves, false);
                }
            },


            {
                html: '<div class="ext-address">' + Ext.app.Localize.get('District') + ':</div> '
            },
            {
                html: '<div id="district_text" class="ext-address-data">&nbsp;</div>',
                width: 208
            },
            {
                xtype: 'button',
                width: 30,
                id: 'district_btn',
                text: '...',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('District'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        district: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 2,
                        country: 0,
                        region: Address.getValue('region'),
                        area: 0,
                        city: 0,
                        settl: 0,
                        search: ''
                    }, function(A){
                        Address.items.district.setValue(A.id, A.shortname + ' ' + A.district);
                    });
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.district.setValue(0, '');
                }
            },
            {
                html: '<div class="ext-address">' + Ext.app.Localize.get('City') + ':</div> '
            },
            {
                html: '<div id="city_text" class="ext-address-data">&nbsp;</div>',
                width: 208
            },
            {
                xtype: 'button',
                width: 30,
                id: 'city_btn',
                text: '...',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('City'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        city: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 3,
                        country: 0,
                        region: Address.getValue('region'),
                        area: Address.getValue('district'),
                        city: 0,
                        settl: 0,
                        search: ''
                    }, function(A){
                        Address.items.city.setValue(A.id, A.shortname + ' ' + A.city);
                    });
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.city.setValue(0, '');
                }
            },
            {
                html: '<div class="ext-address">' + Ext.app.Localize.get('Area') + ':</div> '
            },
            {
                html: '<div id="settle_text" class="ext-address-data">&nbsp;</div>',
                width: 208
            },
            {
                xtype: 'button',
                width: 30,
                id: 'settle_btn',
                text: '...',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('Area'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        settle: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 4,
                        country: 0,
                        region: Address.getValue('region'),
                        area: Address.getValue('district'),
                        city: Address.getValue('city'),
                        settl: 0,
                        search: ''
                    }, function(A){
                        Address.items.settle.setValue(A.id, A.shortname + ' ' + A.settlement);
                    });
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.settle.setValue(0, '');
                }
            },



            {
                html: '<div class="ext-address">' + Ext.app.Localize.get('Street') + ':</div> '
            },
            {
                html: '<div id="street_text" class="ext-address-data">&nbsp;</div>',
                width: 208
            },
            {
                xtype: 'button',
                width: 30,
                id: 'street_btn',
                text: '...',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('Street-y') + ' / ' + Ext.app.Localize.get('Post code'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        street: false,
                        postcode: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 5,
                        country: 0,
                        region: Address.getValue('region'),
                        area: Address.getValue('district'),
                        city: Address.getValue('city'),
                        settl: Address.getValue('settle'),
                        search: ''
                    }, function(A){
                        Address.items.street.setValue(A.id, A.shortname + ' ' + A.street);
                        Address.items.postcode.setValue(A.postcode, A.postcode);
                        Address.controls(Address.items.street.slaves, true);
                        Ext.getCmp('building_cmb').store.reload({
                            params: {
                                country: 0,
                                region: Address.getValue('region'),
                                area: Address.getValue('district'),
                                city: Address.getValue('city'),
                                settl: Address.getValue('settle'),
                                street: Address.getValue('street'),
                                search: ''
                            }
                        });
                    })
                }
            },
            {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.street.setValue(0, '');
                    Address.items.postcode.setValue(0, '');
                    if (Address.getValue('city') == 0) {
                        Address.controls(Address.items.street.slaves, false);
                    }
                    Ext.getCmp('building_cmb').getStore().removeAll();
                }
            },




            {
                html: '<div class="ext-address" class="ext-address">' + Ext.app.Localize.get('Building') + ' / ' + Ext.app.Localize.get('Block') + ':</div> '
            },
            {
                xtype: 'combo',
                tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                forceSelection: true,
                id: 'building_cmb',
                width: 210,
                displayField: 'name',
                disabled: true,
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader(
                        {root: 'results'},
                        [
                            {name: 'id',type: 'int'},
                            {name: 'name',type: 'string'},
                            {name: 'postcode',type: 'int'}
                        ]
                    ),
                    baseParams: {
                        async_call: 1,
                        devision: 41,
                        gettype: 6,
                        limit: 1000
                    },
                    sortInfo: {
                        field: 'name',
                        direction: "ASC"
                    }
                }),
                listeners: {
					beforequery: function(queryEv){
						queryEv.combo.expand();
						queryEv.combo.store.reload();
						return false;
					},
                    select: function(A, B){
                        Address.items.building.setValue(B.data.id, B.data.name);
                        if (!Ext.isEmpty(B.data.postcode) && B.data.postcode > 0) {
                            Address.items.postcode.setValue(B.data.postcode, B.data.postcode);
                        };
                        Ext.getCmp('flat_cmb').getStore().load({
                            params: {
                                gettype: 7,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });

                        Ext.getCmp('porch_cmb').getStore().load({
                            params: {
                                gettype: 8,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });
                        Ext.getCmp('floor_cmb').getStore().load({
                            params: {
                                gettype: 9,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });
                        Address.controls(Address.items.building.slaves, true);
                    }
                }
            }, {
                xtype: 'button',
                id: 'building_btn',
                width: 30,
                iconCls: 'ext-add',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Add') + ' / ' + Ext.app.Localize.get('Edit') + ': ' + Ext.app.Localize.get('Building') + ' / ' + Ext.app.Localize.get('Block') + ' / ' + Ext.app.Localize.get('Post code'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        sort: 'building',
                        building: false,
                        postcode: false,
                        block: false,
                        flats: false,
                        conn_type: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 6,
                        country: 0,
                        region: Address.getValue('region'),
                        area: Address.getValue('district'),
                        city: Address.getValue('city'),
                        settl: Address.getValue('settle'),
                        street: Address.getValue('street'),
                        search: ''
                    }, function(A){
                        var LastCode = Address.getValue('postcode') * 1;
                        Address.items.building.setCombo(A.id, A.shortname + ' ' + A.building + ((!Ext.isEmpty(A.block)) ? ' / ' + A.block : ''), A.postcode);
                        Address.controls(Address.items.building.slaves, true);

                        if (!Ext.isEmpty(A.postcode) && A.postcode > 0) {
                            Address.items.postcode.setValue(A.postcode, A.postcode);
                        }
                        else {
                            Address.items.postcode.setValue(LastCode, LastCode);
                        }

                        Ext.getCmp('flat_cmb').getStore().reload({
                            params: {
                                gettype: 7,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });
                        Ext.getCmp('porch_cmb').getStore().load({
                            params: {
                                gettype: 8,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });
                        Ext.getCmp('floor_cmb').getStore().load({
                            params: {
                                gettype: 9,
                                country: 0,
                                region: Address.getValue('region'),
                                building: Address.getValue('building'),
                                search: ''
                            }
                        });

                    })
                }
            }, {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.building.setCombo(0, '');
                    Address.controls(Address.items.building.slaves, false);
                    Ext.getCmp('flat_cmb').getStore().removeAll();
                    Ext.getCmp('porch_cmb').getStore().removeAll();
                    Ext.getCmp('floor_cmb').getStore().removeAll();
                }
            },



            {
                html: '<div class="ext-address" class="ext-address">' + Ext.app.Localize.get('Flat') + ' / ' + Ext.app.Localize.get('Office') + ':</div> '
            }, {
                xtype: 'combo',
                tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                forceSelection: true,
                id: 'flat_cmb',
                width: 210,
                displayField: 'name',
                disabled: true,
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader(
                        {root: 'results'},
                        [
                            {name: 'id',type: 'int'},
                            {name: 'name',type: 'string'}
                        ]
                    ),
                    baseParams: {
                        async_call: 1,
                        devision: 41,
                        gettype: 7,
                        limit: 1000
                    },
                    sortInfo: {
                        field: 'name',
                        direction: "ASC"
                    }
                }),
                listeners: {
					beforequery: function(queryEv){
						queryEv.combo.expand();
						queryEv.combo.store.reload();
						return false;
					},
                    select: function(A, B){						
                        Address.items.flat.setValue(B.data.id, B.data.name);
                    }
                }
            }, {
                xtype: 'button',
                width: 30,
                id: 'flat_btn',
                iconCls: 'ext-add',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Add') + ' / ' + Ext.app.Localize.get('Edit') + ': ' + Ext.app.Localize.get('Flat-y') + ' / ' + Ext.app.Localize.get('Office'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        flat: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 7,
                        country: 0,
                        region: Address.getValue('region'),
                        building: Address.getValue('building'),
                        search: ''
                    }, function(A){
                        Address.items.flat.setCombo(A.id, A.shortname + ' ' + A.flat);
                    })
                }
            }, {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.flat.setCombo(0, '');
                }
            },


            // Porch
            {
                html: '<div class="ext-address" class="ext-address">'+Ext.app.Localize.get('Porch')+':</div> '
            }, {
                xtype: 'combo',
                tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                forceSelection: true,
                id: 'porch_cmb',
                width: 210,
                displayField: 'name',
                disabled: true,
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({url: 'config.php',method: 'POST'}),
                    reader: new Ext.data.JsonReader(
                        {root: 'results'},
                        [
                            {name: 'id',type: 'int'},
                            {name: 'name',type: 'string'}
                        ]
                    ),
                    baseParams: {
                        async_call: 1,
                        devision: 41,
                        gettype: 8,
                        limit: 1000
                    },
                    sortInfo: {
                        field: 'name',
                        direction: "ASC"
                    }
                }),
                listeners: {
					beforequery: function(queryEv){
						queryEv.combo.expand();
						queryEv.combo.store.reload();
						return false;
					},
                    beforerender: function(combo){
                        combo.store.on('load', function(store){
                            if (store.getCount()>0){
                                var idx;
                                if ((idx = store.find('id',Address.items.porch.value)) > -1){
                                    this.combo.setValue(Address.items.porch.value);
                                }
                            }
                        },{combo:combo});
                        if (Address.getValue('building') > 0) {
                            combo.getStore().load({
                                params: {
                                    gettype: 8,
                                    country: 0,
                                    region: Address.getValue('region'),
                                    building: Address.getValue('building'),
                                    search: ''
                                }
                            });
                        }
                    },
                    select: function(A, B){
                        Address.items.porch.setValue(B.data.id, B.data.name);
                    }
                }
            }, {
                xtype: 'button',
                width: 30,
                id: 'porch_btn',
                iconCls: 'ext-add',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Add') + ' / ' + Ext.app.Localize.get('Edit') + ': ' + Ext.app.Localize.get('Porch'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        porch: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 8,
                        country: 0,
                        region: Address.getValue('region'),
                        building: Address.getValue('building'),
                        search: ''
                    }, function(A){
                        Address.items.porch.setCombo(A.id, A.shortname + ' ' + A.porches);
                    })
                }
            }, {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.porch.setCombo(0, '');
                }
            },



            // Floor

            {
                html: '<div class="ext-address" class="ext-address">'+Ext.app.Localize.get('Floor')+':</div> '
            }, {
                xtype: 'combo',
                tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                forceSelection: true,
                id: 'floor_cmb',
                width: 210,
                displayField: 'name',
                disabled: true,
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader(
                        {root: 'results'},
                        [
                            {name: 'id',type: 'int'},
                            {name: 'name',type: 'string'}
                        ]
                    ),
                    baseParams: {
                        async_call: 1,
                        devision: 41,
                        gettype: 9,
                        limit: 1000
                    },
                    sortInfo: {
                        field: 'name',
                        direction: "ASC"
                    }
                }),
                listeners: {
					beforequery: function(queryEv){
						queryEv.combo.expand();
						queryEv.combo.store.reload();
						return false;
					},
                    beforerender: function(combo){
                        combo.store.on('load', function(store){
                            if (store.getCount()>0){
                                var idx;
                                if ((idx = store.find('id',Address.items.floor.value)) > -1){
                                    this.combo.setValue(Address.items.floor.value);
                                }
                            }
                        },{combo:combo});
                        if (Address.getValue('building') > 0) {
                            combo.getStore().load({
                                params: {
                                    gettype: 9,
                                    country: 0,
                                    region: Address.getValue('region'),
                                    building: Address.getValue('building'),
                                    search: ''
                                }
                            });
                        }
                    },
                    select: function(A, B){
                        Address.items.floor.setValue(B.data.id, B.data.name);
                    }
                }
            }, {
                xtype: 'button',
                width: 30,
                id: 'floor_btn',
                iconCls: 'ext-add',
                style: 'margin: 0 15px',
                tooltip: Ext.app.Localize.get('Add') + ' / ' + Ext.app.Localize.get('Edit') + ': ' + Ext.app.Localize.get('Flat-y') + ' / ' + Ext.app.Localize.get('Office'),
                disabled: true,
                handler: function(){
                    searchAddressItem({
                        floor: false,
                        titlePath: Address.compile()
                    }, {
                        gettype: 9,
                        country: 0,
                        region: Address.getValue('region'),
                        building: Address.getValue('building'),
                        search: ''
                    }, function(A){
                        Address.items.floor.setCombo(A.id, A.shortname + ' ' + A.floors);
                    })
                }
            }, {
                xtype: 'button',
                width: 30,
                iconCls: 'ext-erase',
                tooltip: Ext.app.Localize.get('Clear'),
                handler: function() {
                    Address.items.floor.setCombo(0, '');
                }
            },



            {
                html: '<div class="ext-address" class="ext-address">' + Ext.app.Localize.get('Post code') + ':</div> '
            }, {
                html: '<div id="postcode_text" class="ext-address">&nbsp;</div>'
            }, {
                html: '<div class="ext-address">&nbsp;</div>'
            }, {
                html: '<div class="ext-address">&nbsp;</div>'
            }

        ]
    });
    W.show();
    if (Address.items.country.value == 0) {

        Address.unsetUnderIndex(0)
    };
    
    if (Address.getValue('street') > 0) {
        Ext.getCmp('building_cmb').store.reload({
            params: {
                country: 0,
                region: Address.getValue('region'),
                area: Address.getValue('district'),
                city: Address.getValue('city'),
                settl: Address.getValue('settle'),
                street: Address.getValue('street'),
                search: ''
            }
        });
    }
    if (Address.getValue('building') > 0) {
        Ext.getCmp('flat_cmb').getStore().reload({
            params: {
                gettype: 7,
                country: 0,
                region: Address.getValue('region'),
                building: Address.getValue('building'),
                search: ''
            }
        });
    }
    Address.syncText();
}


/**
 * Object grid to view whole level data, add new or edit existing
 * @param    object, columns view.
 *         By default columns are hidden, to show selected there should be column name with false booling
 *         Columns: country, region, district, city, settle, street, building, flat, postcode
 *         titlePath may be used to visualize called point
 * @param    object, address code to select
 *         gettype - address level to work with
 *         country - country id,
 *         region - region,
 *         district - district id,
 *         city - city id,
 *         settle: settle id,
 *         street - street id,
 *         building - building id,
 *         flat - flat id
 * @param    callback function, pass obeject with address code
 */
function searchAddressItem(A, B, C){

    if (Ext.isEmpty(A)) {
        var A = {}
    };
    if (Ext.isEmpty(B)) {
        var B = {}
    };
    if (Ext.isEmpty(C)) {
        var C = function(){
        }
    }
    var S = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [{
            name: 'id',
            type: 'int'
        }, {
            name: 'country',
            type: 'string'
        }, {
            name: 'region',
            type: 'string'
        }, {
            name: 'district',
            type: 'string'
        }, {
            name: 'city',
            type: 'string'
        }, {
            name: 'settlement',
            type: 'string'
        }, {
            name: 'street',
            type: 'string'
        }, {
            name: 'building',
            type: 'string'
        }, {
            name: 'block',
            type: 'string'
        }, {
            name: 'flat',
            type: 'string'
        }, {
            name: 'postcode',
            type: 'int'
        }, {
            name: 'shortname',
            type: 'string'
        }, {
            name: 'flats',
            type: 'int'
        }
        , {
            name: 'porches',
            type: 'int'
        }
        , {
            name: 'floors',
            type: 'int'
        }
        , {
            name: 'conn_type',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 41,
            gettype: 1,
            country: 0,
            region: 0,
            area: 0,
            city: 0,
            settl: 0,
            street: 0,
            building: 0,
            flat: 0,
            flats: 0,
            conn_type: 0
        },
        sortInfo: {
            field: 'id',
            direction: "ASC"
        }
    });
    var delItem = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        width: 22,
        iconCls: 'ext-drop',
        disabled: Access.kladr < 2 ? true : false,
        menuDisabled: true
    });
    var Combo = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'shortname',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 41,
            getmeaning: Ext.isEmpty(B.gettype) ? 0 : B.gettype
        },
        autoLoad: true,
        sortInfo: {
            field: 'name',
            direction: "ASC"
        },
        listeners: {
            load: function(A){
                A.each(function(A){
                    A.data.name = Ext.util.Format.ellipsis(A.data.name, 32);
                });
            }
        }
    });
    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        width: 280,
        initComponent: function(){
            Ext.app.SearchField.superclass.initComponent.call(this);
            this.on('specialkey', function(f, e){
                if (e.getKey() == e.ENTER) {
                    this.onTrigger2Click();
                }
            }, this);
        },
        validationEvent: false,
        validateOnBlur: false,
        trigger1Class: 'x-form-clear-trigger',
        trigger2Class: 'x-form-search-trigger',
        hideTrigger1: true,
        hasSearch: false,
        paramName: 'search',
        onTrigger1Click: function(){
            if (this.hasSearch) {
                this.el.dom.value = '';
                var o = {
                    start: 0,
                    limit: 50
                };
                this.store.baseParams = this.store.baseParams ||
                {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({
                    params: o
                });
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click: function(){
            var v = this.getRawValue();
            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            }
            var o = {
                start: 0,
                limit: 50
            };
            this.store.baseParams = this.store.baseParams ||
            {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({
                params: o
            });
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });

    compactForm = function(items, store){
        if (Ext.isEmpty(items)) {
            return false;
        };
        var form = new Ext.form.FormPanel({
            id: 'compactForm',
            renderTo: Ext.getBody(),
            url: 'config.php',
            items: items
        });
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                try {
                    var O = Ext.util.JSON.decode(action.response.responseText);
                    if (!Ext.isEmpty(O.checked)) {
                        try {
                            C(O.checked);
                        }
                        catch (e) {
                        };
                        Ext.getCmp('AddressList').close();
                    }
                }
                catch (e) {
                };
                form.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.errors.reason);
                }
                form.destroy();
            }
        })
    }
    addItem = function(A){

        var T = Ext.getCmp('searchGrid');
        var SM = T.getSelectionModel();
        var callC = true;
        if (!Ext.isEmpty(T.store.getModifiedRecords()) && T.store.getModifiedRecords().length > 0) {
            var D = T.store.getModifiedRecords();
            var B = [{
                xtype: 'hidden',
                name: 'level',
                value: S.baseParams.gettype
            }];
            for (var i in S.baseParams) {
                if (i == 'gettype') {
                    continue
                };
                B.push({
                    xtype: 'hidden',
                    name: i,
                    value: S.baseParams[i]
                });
            }
            for (var i = 0, off = D.length; i < off; i++) {
                if (A.country != false && A.porch!=false && A.floor!=false && Ext.util.Format.trim(D[i].data.shortname) == '') {
                    alert(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('type'));
                    return false;
                }
                for (var j in D[i].data) {
                    B.push({
                        xtype: 'hidden',
                        name: 'saveaddress[' + i + '][' + j + ']',
                        value: D[i].data[j]
                    });
                };
                if (SM.isSelected(D[i]) == true) {
                    callC = false;
                    B.push({
                        xtype: 'hidden',
                        name: 'saveaddress[' + i + '][checked]',
                        value: 1
                    });
                } else {
                    B.push({
                        xtype: 'hidden',
                        name: 'saveaddress[' + i + '][checked]',
                        value: 0
                    });
                }
            };
            compactForm(B);
        }
        if (callC == true) {
            C(Ext.getCmp('searchGrid').getSelectionModel().getSelected().data);
            W.close();
        }
    }
    addLine = function(item){
        var A = Ext.getCmp('searchGrid'),
            shortname = '';
        if (item.porch === false) {
            shortname = Ext.app.Localize.get('p.');
        } else if (item.floor === false) {
            shortname = Ext.app.Localize.get('fl.');
        }
        A.store.insert(0, new A.store.recordType({
            id: 0,
            country: '',
            region: '',
            district: '',
            city: '',
            settlement: '',
            street: '',
            building: '',
            block: '',
            flat: '',
            postcode: 0,
            flats: '',
            conn_type: '',
            shortname: shortname
        }));
    }
    Title = function(A){
        if (!Ext.isEmpty(A.titlePath) && typeof A.titlePath == 'object') {
            var T = ': ' + A.titlePath.get(A.titlePath.clear)
        }
        else {
            var T = ''
        };
        if (!Ext.isEmpty(A.country) && A.country == false) {
            return Ext.app.Localize.get('Countries') + T;
        };
        if (!Ext.isEmpty(A.region) && A.region == false) {
            return Ext.app.Localize.get('Regions') + T;
        };
        if (!Ext.isEmpty(A.district) && A.district == false) {
            return Ext.app.Localize.get('Districts') + T;
        };
        if (!Ext.isEmpty(A.city) && A.city == false) {
            return Ext.app.Localize.get('Cities') + T;
        };
        if (!Ext.isEmpty(A.settle) && A.settle == false) {
            return Ext.app.Localize.get('Areas') + T;
        };
        if (!Ext.isEmpty(A.street) && A.street == false) {
            return Ext.app.Localize.get('Streets') + T;
        };
        if (!Ext.isEmpty(A.building) && A.building == false) {
            return Ext.app.Localize.get('Buildings') + T;
        };
        if (!Ext.isEmpty(A.flat) && A.flat == false) {
            return Ext.app.Localize.get('Flats') + ' / ' + Ext.app.Localize.get('Offices') + T;
        };
    }

    var ConnStore = new Ext.data.SimpleStore({
        fields:    ['id','name'],
        data: [
            ['UNKNOWN', Ext.app.Localize.get('Not set')],
            ['HFC', 'HFC'],
            ['FTTB', 'FTTB']
        ]
    });


    var W = new Ext.Window({
        title: Title(A),
        id: 'AddressList',
        width: 800,
        height: 462,
        modal: true,
        plain:true,
        layout:'fit',
        border:false,
        items: [
        {
            xtype: 'editorgrid',
            stateful: false,
            id: 'searchGrid',
            forceFit: false,
            clicksToEdit: 1,
            loadMask: true,
            tbar: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Choose'),
                iconCls: 'ext-accept',
                handler: function(){
                    if (Ext.isEmpty(Ext.getCmp('searchGrid').getSelectionModel().getSelected())) {
                        return
                    };
                    addItem(A);
                }
            }, '-', Ext.app.Localize.get('Search') + ':&nbsp;', new Ext.app.SearchField({
                store: S,
                params: {
                    start: 0,
                    limit: 50
                },
                width: 227
            }), '&nbsp;', '-', {
                xtype: 'button',
                text: Ext.app.Localize.get('Add new record'),
                iconCls: 'ext-add',
                disabled: Access.kladr<2 ? true : false,
                handler: function() {
                    addLine(A);
                }
            }],
            plugins: [delItem],
            sm: new Ext.grid.CheckboxSelectionModel({
                singleSelect: true
            }),
            cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
                singleSelect: true
            }), {
                header: Ext.app.Localize.get('Type'),
                dataIndex: 'shortname',
                id: 'shortname_col',
                width: 104,
                sortable: true,
                hidden: (!Ext.isEmpty(A.country) || !Ext.isEmpty(A.floor) || !Ext.isEmpty(A.porch)) ? true : false,
                editor: new Ext.form.ComboBox({
                    displayField: 'name',
                    valueField: 'shortname',
                    mode: 'local',
                    listWidth: 140,
                    lazyRender: true,
                    triggerAction: 'all',
                    disabled: Access.kladr<2 ? true : false,
                    store: Combo
                })
            }, {
                header: Ext.app.Localize.get('Country'),
                dataIndex: 'country',
                id: 'country_col',
                width: 591,
                hidden: (Ext.isEmpty(A.country)) ? true : A.country,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Region'),
                dataIndex: 'region',
                id: 'region_col',
                width: 487,
                hidden: (Ext.isEmpty(A.region)) ? true : A.region,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('District'),
                dataIndex: 'district',
                id: 'district_col',
                width: 487,
                hidden: (Ext.isEmpty(A.district)) ? true : A.district,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('City'),
                dataIndex: 'city',
                id: 'city_col',
                width: 487,
                hidden: (Ext.isEmpty(A.city)) ? true : A.city,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Area'),
                dataIndex: 'settlement',
                id: 'settlement_col',
                width: 487,
                hidden: (Ext.isEmpty(A.settle)) ? true : A.settle,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Street'),
                dataIndex: 'street',
                id: 'street_col',
                width: 382,
                hidden: (Ext.isEmpty(A.street)) ? true : A.street,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Building'),
                dataIndex: 'building',
                width: 202,
                id: 'building_col',
                hidden: (Ext.isEmpty(A.building)) ? true : A.building,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Block'),
                dataIndex: 'block',
                width: 180,
                id: 'block_col',
                hidden: (Ext.isEmpty(A.block)) ? true : A.block,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false
                })
            }, {
                header: Ext.app.Localize.get('Flat') + ' / ' + Ext.app.Localize.get('Office'),
                dataIndex: 'flat',
                width: 487,
                id: 'flat_col',
                hidden: (Ext.isEmpty(A.flat)) ? true : A.flat,
                sortable: true,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('Post code'),
                dataIndex: 'postcode',
                width: 104,
                id: 'postcode_col',
                hidden: (Ext.isEmpty(A.postcode)) ? true : A.block,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }, {
                header: Ext.app.Localize.get('FlatsNum'),
                dataIndex: 'flats',
                width: 60,
                id: 'flats_col',
                hidden: (Ext.isEmpty(A.flats)) ? true : A.flats,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            },
            {
                header: Ext.app.Localize.get('Porch'),
                dataIndex: 'porches',
                width: 60,
                id: 'porch_col',
                hidden: (Ext.isEmpty(A.porch)) ? true : A.porch,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            },
            {
                header: Ext.app.Localize.get('Floor'),
                dataIndex: 'floors',
                width: 60,
                id: 'floor_col',
                hidden: (Ext.isEmpty(A.floor)) ? true : A.floor,
                editor: new Ext.form.TextField({
                	disabled: Access.kladr<2 ? true : false,
                    allowBlank: false
                })
            }
            , {
                header: Ext.app.Localize.get('ConnectionType'),
                dataIndex:     'conn_type',
                id:         'conn_type_col',
                width:         65,
                hidden:     (Ext.isEmpty(A.conn_type)) ? true : A.conn_type,
                renderer:    function (val) {
                                if ( !Ext.isEmpty(A.conn_type) ) {
                                    var matching = ConnStore.queryBy(
                                        function(record, id) { return record.data.id == val; }
                                    );
                                    return matching.items[0] ? matching.items[0].data.name : '';
                                }
                            },
                editor: new Ext.form.ComboBox({
                    displayField:    'name',
                    valueField:        'id',
                    mode:            'local',
                    triggerAction:    'all',
                    queryMode:        'local',
                    typeAhead:        true,
                    editable:        false,
                    lazyRender:        true,
                    store:            ConnStore
                })
            }, delItem]),
            store: S,
            bbar: new Ext.PagingToolbar({
                pageSize: 100,
                store: S,
                displayInfo: true
            })
        }]
    });

    if (Ext.isEmpty(B) || typeof B != 'object') {
        return false;
    };
    for (var i in B) {
        if (!Ext.isEmpty(S.baseParams[i])) {
            S.baseParams[i] = B[i];
        };
    };
    delItem.on('action',function(grid, record, rowIndex, e){
        if (Access.kladr<2) return;
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Attantion, this action will remove all the nested elements'), function(Btn){
            if(Btn != 'yes') {
                return;
            }

            if(record.get('id') == 0) {
                grid.getStore().remove(record);
                return;
            }

            var params = {
                async_call: 1,
                devision: 41,
                level: S.baseParams.gettype
            };

            Ext.iterate(record.data, function(key, item){
                this['removeaddress['+key+']'] = item
            }, params);

            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: params,
                scope: {
                    load: Ext.Msg.wait(Ext.app.Localize.get('Sending data') + "...",Ext.app.Localize.get('Connecting'), {
                        autoShow: true
                    }),
                    grid: grid
                },
                callback: function(opt, success, res) {
                    this.load.hide();
                    if(!success) {
                        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                        return false;
                    }
                    if (Ext.isDefined(res['responseText'])) {
                        var data = Ext.util.JSON.decode(res.responseText);
                        Ext.Msg.alert(Ext.app.Localize.get(data['success'] ? 'Info' : 'Error'), data['reason']);
                        this.grid.getStore().reload();
                    }
                }
            });
        }.createDelegate(grid));
    });
    W.show();
    S.load();
    if (!Ext.isEmpty(A.sort)){
        S.setDefaultSort(A.sort, 'ASC');
    }
} // end searchAddressItem()
