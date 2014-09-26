Ext.define('OSS.ux.form.field.combogrid.WithSearchToolbar', {
    extend: 'OSS.ux.form.field.ComboGrid',
    requires: 'OSS.ux.form.field.combogrid.grid.WithSearchToolbar',
    editable: false,
    toolbar: {
        value: '',
        data: []
    },
    params: {
        property: 'property',
        value: 'value'
    },
    initSearch: function() {
    },
    getGridClassName: function() {
        return 'OSS.ux.form.field.combogrid.grid.WithSearchToolbar';
    },
    createPicker: function() {
        var property = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'name',
                displayField: 'descr',
                editable: false,
                value: this.toolbar.value,
                store: Ext.create( 'Ext.data.Store', {
                    fields: ['descr', 'name'],
                    data: this.toolbar.data
                })
            }),
            search = Ext.create('OSS.ux.form.field.text.Search', {
                xtype: 'delayedsearchfield', 
                name: 'search',
                flex: 1,
                beforeQuery: Ext.bind(this.beforeQuery, this),
                getQueryObject: function() {
                    var params = {};
                    params[me.params.property] = property.getValue();
                    params[me.params.value] = this.getValue();
                    return params;
                }
            }),
            me = this;
        this.tbar = [
            property,
            search
        ];
        property.on('change', function() {
            search.query();
        }, this);
        return this.callParent( arguments );
    },
    getGridConfig: function() {
        var params = this.callParent(arguments);
        params.height += 25;
        return params;
    },
    afterSelectChoosenItem: function() {
    }
});
