Ext.define('OSS.ux.form.field.SearchCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.searchcombo',
    hideTrigger: true,
    triggerAction: 'query',
    queryMode: 'remote',
    typeAhead: true,
    queryParam: 'name',
    flex: 1,
    valueField: 'record_id',
    displayField: 'name'
});
