Ext.define( 'OSS.view.addresses.Form', {
    extend: 'Ext.panel.Panel',
    frame: 1,
    padding: '10 10 10 10',
    fields: {},
    params: {},
    names: [],
    loadingValues: false,
    initComponent: function() {
        for (var i = 0; i < this.items.length; i ++) {
            this.items[i] = this.createItem( this.items[i] );
        }
        this.onItemsCreated();
        this.callParent( arguments );
    },
    getAddress: function() {
        var code = [],
            address = [],
            codeItem,
            i;
        for (i = 0; i < this.names.length; i ++) { 
            codeItem = this.fields[this.names[i]].getCode(); 
            if (codeItem !== null) {
                code.push( codeItem );
            }
            address.push( this.fields[this.names[i]].getValueDescription() );
        }
        return {
            address: address.join(','),
            code: code.join(','),
            type: this.type,
            uid: this.uid
        };
    },
    setValues: function( address ) {
        var values = address.code.split(','),
            descrs = address.address.split(',');
        for (var i = 0; i < this.names.length; i ++) {
            this.fields[this.names[i]].setValue( parseInt(values[i]), descrs[i] );
        }
    },
    load: function( address ) {
        this.type = address.type;
        this.uid = address.uid;
        this.loadingValues = true;
        if (address.address == '' || address.code == '') {
            this.clear();
        } else {
            this.setValues(address);
        }
        this.loadingValues = false;
    },
    clear: function() {
        var name;
        for (name in this.fields) {
            this.fields[name].setValue( null );
        }
    },
    getEditWindow: function( field ) {
        if (!this.editWindow) {
            this.editWindow = Ext.create('OSS.view.addresses.grid.Window');
        }
        if (field) {
            this.editWindow.activateGrid(field);
        }
        return this.editWindow;
    },
    onItemsCreated: function() {
        var name;
        for (name in this.fields) {
            this.fields[name].enabledIf();
            this.params[name] = null;
        }
        for (name in this.fields) {
            this.fields[name].setParamsChangingHandler();
        }
    },
    setParam: function( name, value ) {
        this.params[name] = value;
    },
    getParam: function( name ) {
        return this.params[name];
    },
    getParams: function() {
        return this.params;
    },
    createItem: function( item ) {
        return this.createField( item );
    },
    getItem: function( id ) {
        return this.fields[id];
    },
    createField: function( item ) {
        var me = this,
            field = Ext.create( this.getItemClass(item), Ext.apply({
                getItem: function( name ) { return me.getItem( name ); },
                getEditWindow: function( field ) { return me.getEditWindow( field ); },
                setParam: function( name, value ) { me.setParam( name, value ); },
                getParam: function( name ) { return me.getParam(name); },
                getParams: function() { return me.params; },
                loadingValues: function() { return me.loadingValues; }
            }, item)),
            id = field.getItemId();
        this.fields[ id ] = field;
        this.names.push( id );
        return field;
    },
    getItemClass: function( item ) {
        if (item.classname) {
            return item.classname;
        }
        var types = {
            combo: 'OSS.view.addresses.form.item.Combo',
            grid: 'OSS.view.addresses.form.item.Grid'
        };
        return types[item.type];
    }
});
