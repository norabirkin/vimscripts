Ext.define( 'OSS.view.users.searchtemplate.toolbar.Combo', {
    extend: 'Ext.form.field.ComboBox',
    name: 'search_template',
    displayField: 'tpl_name',
    valueField: 'tpl_name',
    width: 400,
    queryMode: 'local',
    padding: '0 10 0 0',
    initComponent: function() {
        this.store = Ext.create('OSS.store.SearchTemplates');
        this.callParent( arguments );
    },
    addConditions: function( name, conditions ) {
        var index = this.getStore().findExact('tpl_name', name),
            record;
        if (index != -1) {
            record = this.getStore().getAt(index);
        } else {
            record = Ext.create('OSS.model.SearchTemplate', {tpl_name: name});
            this.getStore().add(record);
        }
        record.set('rules', Ext.JSON.encode(conditions));
    },
    eachRule: function( callback, scope ) {
        var i,
            index = this.getStore().findExact('tpl_name', this.getValue()),
            record,
            scope = scope || {},
            data;
        if (index == -1) {
            return;
        }
        record = this.getStore().getAt(index);
        data = Ext.JSON.decode(record.get('rules'));
        for (i = 0; i < data.length; i ++) {
            Ext.bind(callback, scope)(data[i]);
        }
    },
    getToolbarValue: function() {
        var index = this.getStore().findExact('tpl_name', this.getValue()),
            record;
        if (index == -1) {
            return null;
        }
        record = this.getStore().getAt(index);
        return record.get('rules');
    }
});
