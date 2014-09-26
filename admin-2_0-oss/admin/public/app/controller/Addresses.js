Ext.define( 'OSS.controller.Addresses', {
    extend: 'Ext.app.Controller',
    requires: ['OSS.ux.form.field.text.Search', 'OSS.ux.form.field.SearchCombo', 'OSS.ux.form.button.DeleteSplit'],
    views: [
        'Addresses'
    ],
    stores: [
        'Addresses',
        'addresses.meanings.Areas',
        'addresses.meanings.Buildings',
        'addresses.meanings.Cities',
        'addresses.meanings.Settles',
        'addresses.meanings.Entrances',
        'addresses.meanings.Flats',
        'addresses.meanings.Floors',
        'addresses.meanings.Regions',
        'addresses.meanings.Streets',
        'addresses.Areas',
        'addresses.Buildings',
        'addresses.Cities',
        'addresses.Countries',
        'addresses.Flats',
        'addresses.Floors',
        'addresses.Porches',
        'addresses.Regions',
        'addresses.Settles',
        'addresses.Streets'
    ],
    refs: [{
        selector: 'addresses',
        ref: 'mainWindow'
    }, {
        selector: 'addresses > gridpanel',
        ref: 'mainGrid'
    }, {
        selector: 'addresses > form',
        ref: 'addressForm'
    }],
    init: function() {
        this.control({
            'addresses > gridpanel > toolbar #actions': {
                click: this.onExpandMenu,
                arrowclick: this.onExpandMenu
            },
            'addresses > gridpanel > toolbar #address_search': {
                change: this.startSearch
            },
            'addresses > gridpanel > toolbar #createBtn': {
                click: this.createNewAddress
            },
            'addresses > gridpanel > toolbar #editBtn': {
                click: this.editAddress
            },
            'addresses > gridpanel > toolbar #applyBtn': {
                click: this.applyAddressFromGrid
            },
            'addresses > gridpanel': {
                itemdblclick: this.applyByDoubleClick
            },
            'addresses > gridpanel #editAddressBtn': {
                click: this.editAddress
            },
            'addresses > form > toolbar #back': {
                click: this.backToSearch
            },
            'addresses > form > toolbar #applyFormBtn': {
                click: this.applyAddress
            },
            'addresses > form > fieldcontainer > splitbutton': {
                menushow: this.onShowMenu
            },
            'addresses > form > fieldcontainer > splitbutton #clearAddress': {
                click: this.clearAddressValue
            },
            'addresses > form > fieldcontainer > splitbutton #removeAddrEl': {
                click: this.removeAddressElement
            },
            'addresses > form > fieldcontainer > combo[hideTrigger=true]': {
                beforequery: this.startLocalSearch,
                select: this.localSearchSelect,
                change: this.elementChange
            },
            'addresses > form > fieldcontainer > textfield': {
                change: this.fillBuildingFields
            }
            
            
        });
    },
    
    
    onExpandMenu: function(Btn) {
        var tbar = Btn.up('toolbar'),
            records = this.getMainGrid().getSelectionModel().getSelection();
        
        tbar.down('menuitem[itemId=applyBtn]')[records.length>0 ? 'enable' : 'disable']();
    },
    
    createNewAddress: function() {
        var address = {};
        this.loadMeanings(address);
        this.getMainWindow().getLayout().setActiveItem(1);
        this.showOrHideFields(this.getAddressForm().items.get(0).onRemove, 0);
        this.getAddressForm().items.get(0).enable();
    },
    
    applyAddress: function() {
        if(!this.formValidate()) {
            return false;
        }
        
        this.getAddressForm().getForm().submit({
            scope: this,
            success: function(form, action) {
                var data = Ext.JSON.decode(action.response.responseText),
                    result = data.results;
                if(!data.success) {
                    return;
                }
                                
                this.save(result, 1);
            }
        });
    },
    
    applyAddressFromGrid: function(Btn) {
        var records = this.getMainGrid().getSelectionModel().getSelection();
        if(records.length == 0) return;
        var data = {
            address: records[0].get('value'),
            code: records[0].get('code'),
            type: this.getWindow().addressType,
            uid: this.getWindow().uid
        };
        
        this.save(data, 0);
    },
    
    applyByDoubleClick: function(grid, record) {
        var data = {
            address: record.get('value'),
            code: record.get('code'),
            type: this.getWindow().addressType,
            uid: this.getWindow().uid
        };
        
        this.save(data, 0);
    },
    
    loadMeanings: function(address) {
        ajax.request({
            url: 'addressSearch/Meanings',
            method: 'GET',
            scope: this,
            success: function(result) {
                var i = 0;
                
                // Перебираем все поля формы, а затем и все значения, 
                // и присваиваем нужным полям свои значения для store
                
                Ext.each(this.getAddressForm().items.items, function(field) {
                    var el = field.down('combo[editable=false]');
                    if(el) {
                        i++;
                        el.getStore().removeAll();
                        var p = [];             
                        Ext.each(result, function(data){
                            if(data['level'+i] == 1) {
                                p.push(data)
                            }
                        }, this);
                        el.getStore().loadData(p);  
                    }           
                }, this);
                
                this.fillTheFields( address );      
            },
            noAlert: true
        });
    },
    
    startSearch: function(field, value) {
        if(value.length > 3) {
            this.getMainGrid().getStore().load({
                params: {
                    query: value
                }
            });
        }
    },
    
    clearAddressValue: function(Btn) {
        
        Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Value will be removed. Continue") + '?',
            function( button ) {
                if (button != "yes") {
                    return;
                }
                
                if(Btn.up('fieldcontainer').down('combo[editable=false]')) {
                    Btn.up('fieldcontainer').down('combo[editable=false]').setValue(null);
                }
                if(Btn.up('fieldcontainer').down('combo[hideTrigger=true]')) {
                    Btn.up('fieldcontainer').down('combo[hideTrigger=true]').setValue(null); 
                }
                Ext.each(Btn.up('fieldcontainer').items.items, function(field){
                    if(field.xtype == 'textfield') {
                        field.setValue(null);
                    }
                });
                
                // hide 
                var list = Btn.up('fieldcontainer').onRemove;
                this.showOrHideFields(list, 0);

            }, this);
    },  
    
    removeAddressElement: function(Btn) {
        Ext.Msg.confirm(
            i18n.get( "Warning" ),
            i18n.get( "This address element and its child elements will be IRREVOCABLY removed. Continue")  + '?',
            function( button ) {
                if (button != "yes") {
                    return;
                }
                
                var cnt = Btn.up('fieldcontainer'),
                    edited = cnt.down('[xtype=hidden]'),
                    record_id = 0,
                    name = '';
                    
                if(cnt.down('[xtype=searchcombo]')) {
                    record_id = cnt.down('[xtype=searchcombo]').getValue();
                    name = cnt.down('[xtype=searchcombo]').name;
                }
                
                if(edited.getValue()>0) return;
                                
                ajax.request({
                    url: 'addressSearch/RemoveAddressElement',
                    method: 'POST',
                    params: {
                        item: cnt.itemId,
                        record_id: record_id
                    },
                    scope: this,
                    success: function(result) {
                        var rArr = cnt.onRemove;
                        if(name != '') {
                            this.getAddressForm().getForm().findField(name).setValue(null);
                        }
                        this.clearSelectedFields(rArr);
                        this.showOrHideFields(cnt.onRemove, 0);
                    },
                    noAlert: true
                });
                
        }, this);
    },
    
    
    editAddress: function() {
        var data = {},
            record = arguments[5];

            data.address = record.get('full_value');
            data.code = record.get('code');
            
        this.loadMeanings(data);    
        this.getMainWindow().getLayout().setActiveItem(1);
    },
    
    backToSearch: function() {
        this.getMainWindow().getLayout().setActiveItem(0);
        this.getMainGrid().getStore().reload();
        this.getAddressForm().getForm().reset();
    },
    
    startLocalSearch: function(obj) {
        var params = obj.combo.params;
        if(!params) return;

        obj.combo.setValue(-1);
        obj.combo.setRawValue(obj.query);
        
        obj.combo.up('fieldcontainer').down('hidden').setValue(1);
        
        
        Ext.each(params, function(param){
            Ext.each(this.getAddressForm().items.items, function(field) {
                
                var el = field.down('[xtype=searchcombo]');
                if(el) {
                    if(param == el.itemId) {                        
                        obj.combo.getStore().getProxy().setExtraParam(param, el.getValue());
                    }
                }               
            }, this);
        }, this);
        
    },
    
    elementChange: function(el) {
        if(el.getValue() == null) return;
        this.clearSelectedFields(el.up('fieldcontainer').onRemove);
        this.showOrHideFields(el.up('fieldcontainer').onSelect, 1);
    },
    
    clearSelectedFields: function(fields) {
        Ext.each(fields, function(field){ 
            if(!field) return;
            var el = this.getAddressForm().getForm().findField(field);
            
            el.setValue(null); // clear value of searchcombo
            if(el.xtype == 'searchcombo') {
                el.getStore().removeAll();
            }
            
            if(field == 'building_id') {
                Ext.each(el.up('fieldcontainer').items.items, function(f){
                    if(f.xtype == 'textfield') {
                        f.setValue(null); // clear values of building's elements
                    }
                });
            }
            if(el.up('fieldcontainer').down('[xtype=combobox]')) {
                el.up('fieldcontainer').down('[xtype=combobox]').setValue(null);
            }
            
        }, this);
    },
    
    
    fillBuildingFields: function(field, newVal, oldVal) {
        
        if(field.itemId == 'postcode') {
            this.fillPostcode(field, newVal, oldVal);
            return;
        }
        
        var combo = field.up('fieldcontainer').down('searchcombo'),
            hidden = field.up('fieldcontainer').down('hidden'),
            store = combo.getStore();
        if(field.xtype != 'textfield') {
            return;
        }

        // Advanced check: compare field value with original (from combo)
        if(combo.getValue() > 0) {
            var record = store.findRecord('record_id', combo.getValue());
            // check ALL fields in container to know whether it was edited
            if(!record || record.get('record_id') != combo.getValue()) {
                hidden.setValue(2);
            } else if(record.get('construction') != field.up('fieldcontainer').down('textfield[name=construction]').getValue()) {
                hidden.setValue(1);
            } else if(record.get('block') != field.up('fieldcontainer').down('textfield[name=block]').getValue()) {
                hidden.setValue(1);
            } else if(record.get('ownership') != field.up('fieldcontainer').down('textfield[name=ownership]').getValue()) {
                hidden.setValue(1);
            } else {
                hidden.setValue(0);
            }
            
        }
        
        
    },
    
    
    fillPostcode: function(field, newVal, oldVal) {
        var hidden = field.up('fieldcontainer').down('hidden'),
            building = field.up('form').getForm().findField('building_id'),
            records = building.getStore().findRecord('postcode', newVal);
            
        hidden.setValue(0);             
        if(!records || records.length == 0) {
            hidden.setValue(1);
        }
    },
    
    localSearchSelect: function(combo, record) {
        combo.up('fieldcontainer').down('hidden').setValue(0);
        var mc = combo.up('fieldcontainer').down('combo[editable=false]');
        if(mc) {
            var rec = mc.getStore().findRecord('short', record[0].get('short'));
            mc.setValue( rec ? rec.get('record_id') : null);
        }
        
        
        this.clearSelectedFields(combo.up('fieldcontainer').onRemove);
        
        if(combo.itemId == 'building_id') {
            var form = combo.up('form').getForm();
            form.findField('block').setValue(record[0].get('block'));
            form.findField('construction').setValue(record[0].get('construction'));
            form.findField('ownership').setValue(record[0].get('ownership'));
            form.findField('postcode').setValue(record[0].get('postcode'));
        }
        
        this.showOrHideFields(combo.up('fieldcontainer').onSelect, 1);      
    },
    
    
    formValidate: function() {
        var i = 0;
        
        if( this.getAddressForm().getForm().findField('country_id').getValue() == null) return;
        
        Ext.each(this.getAddressForm().items.items, function(field) {
            var meaning = field.down('combo[editable=false]');
            var el = field.down('combo[hideTrigger=true]');
            
            if(meaning && el) {
                if(el.getValue() != '' && el.getValue() != 0 && el.getValue() != null && meaning.getValue() <= 0) {
                    i++;
                }
            }               
        }, this);

        if(i > 0) {
            Ext.Msg.showError({
                msg: { 
                    error: { 
                        code: 0100, 
                        message: i18n.get('Please fill the meanings!')
                    }
                }, 
                title: i18n.get('Error')  
            });
            
            return false;
        }
        return true;
    },
    
    /* Older methods */
    
    save: function(data, fromForm) {
        if(!fromForm) fromForm = 0;
        if(fromForm > 0) {
            this.onSave( this.getAddress(data) );
        } else {
            this.onSave(data);
        }
        this.getWindow().hide();
    },
    load: function() {
        this.getForm().load( this.address );
    },
    getWindow: function() {
        if (!this.win) {
            this.win = Ext.create('OSS.view.Addresses');
        }
        return this.win;
    },
    openWindow: function( params ) {
        var win = this.getWindow(),
            grid = win.items.get(0),
            form = win.items.get(1);
            
        this.address = params.address;
        this.onSave = Ext.bind( params.onSave, params.scope );
        
        grid.down('toolbar').down('textfield').setValue(null);
        form.getForm().reset();
        grid.getStore().removeAll();
                
        // 1 - Override value to show in grid
        // 2,3 - Load data to record and switch layout to first item
        this.address.value = this.address.address;
        if(this.address.value != '') grid.getStore().loadData([this.address]);
        win.getLayout().setActiveItem(0);    
        
        
        // Comment three strings ahead, uncomment and use strings below to load 
        // data into addresses form with form opening (2nd card item, it'll be loaded only if address code is not empty)
        //win.getLayout().setActiveItem(this.address.code == '' ? 0 : 1);
        //this.loadMeanings(this.address);
        
        win.addressType = params.address.type;
        win.uid = params.address.uid;       
        win.show();
    },
    
    fillTheFields: function(address) {
        if(address && address.code != '' && address.code != null) {
            var codes = address.code.split(','),
                form = this.getAddressForm();

            
            ajax.request({
                url: 'addressSearch/FindByCode',
                method: 'GET',
                scope: this,
                params: {
                    code: address.code
                },
                success: function(result) {
                    var i = -1;

                    Ext.each(form.items.items, function(field) {
                        i++;
                        if(field.down('[xtype=searchcombo]')) {
                            if(result[i] == null) return;
    
                            var cmb = field.down('[xtype=searchcombo]');
                            
                            var r = {
                                record_id: result[i]['id'],
                                name: result[i]['name']
                            };
                            
                            if(field.items.items.length > 10) {
                                // container with building and constructions
                                Ext.each(field.items.items, function(item) {
                                    switch(item.name) {
                                        case 'block': 
                                            item.setValue(result[i]['block']);
                                        break;
                                        case 'construction': 
                                            item.setValue(result[i]['construction']);
                                        break;
                                        case 'ownership': 
                                            item.setValue(result[i]['ownership']);
                                        break;
                                    }
                                }, this);
                                
                                r.block = result[i]['block'];
                                r.ownership = result[i]['ownership'];
                                r.construction = result[i]['construction'];
                                
                            }
                            
                            cmb.getStore().loadData([r]);
                            cmb.setValue(r.record_id);
                            cmb.setRawValue(r.name);
                        }
                        
                        if(field.down('combo[editable=false]')) {
                            var combo = field.down('combo[editable=false]');
                            combo.setRawValue(result[i]['short']);
                            
                            if(result[i]['short'] != '') {
                                var rec = combo.getStore().findRecord('short', result[i]['short']);
                                if(rec == null) return;

                                combo.setValue(rec.get('record_id'));
                                combo.setRawValue(rec.get('name'));
                            }
                            
                        }
                        
                        if(field.down('[name=postcode]')) {
                            var field = field.down('[xtype=textfield]');
                            field.setValue(result[i]['name']);
                            field.up('fieldcontainer').down('hidden').setValue(0);
                        }
                    });
                    
                },
                noAlert: true
            });
            
        }
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
    },
    
    showOrHideFields: function(fields, show) {
        if(!show) show = 0;
        if(show == 0) {
            Ext.each(fields, function(rm){
                if(!rm) return;
                var field = this.getAddressForm().getForm().findField(rm).up('fieldcontainer');
                field.disable();
                
                
                // clear values for hided fields
                if(field.down('combo[editable=false]')) {
                    field.down('combo[editable=false]').setValue(null);
                }
                if(field.down('combo[hideTrigger=true]')) {
                    field.down('combo[hideTrigger=true]').setValue(null); 
                }
                Ext.each(field.items.items, function(field){
                    if(field.xtype == 'textfield') {
                        field.setValue(null);
                    }
                });
                
                
            }, this);
        } else {
            Ext.each(fields, function(rm){ 
                if(!rm) return;
                var field = this.getAddressForm().getForm().findField(rm).up('fieldcontainer');
                field.enable();
            }, this);
        }
    },
    
    
    getAddress: function(result) {
        
        var code = [],
            address = [],
            codeItem,
            i;
        for (i = 0; i < result.length; i++) { 
            codeItem = result[i]['id'];
            if (codeItem !== null) {
                code.push( codeItem );
            }
            var str = (result[i]['short'] != '') ? result[i]['short'] + ' ' + result[i]['name'] : result[i]['name'];
            address.push( str );
        }
        return {
            address: address.join(','),
            code: code.join(','),
            type: this.getWindow().addressType,
            uid: this.getWindow().uid
        };
    },
    
    inArray: function(item, array) {
        for(var i in array) {
            if(array[i] == item) return true;
        }
        return false;
    },
    
    
    onShowMenu: function(btn, menu) {
        var cnt = menu.up('fieldcontainer');
        
        if(cnt.down('[xtype=hidden]')) {
            menu.items.get(1)[ (cnt.down('[xtype=hidden]').getValue() > 0) ? 'disable' : 'enable']();
        }
        if(cnt.down('[xtype=searchcombo]')) {
            menu.items.get(1)[ (cnt.down('[xtype=searchcombo]').getValue() != 0 && cnt.down('[xtype=searchcombo]').getValue() != null) ? 'enable' : 'disable']();
        }
        if(cnt.itemId == 'postcode') {
            menu.items.get(1).disable();
        }
    }
    
        
     
});
