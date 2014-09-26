Ext.define( 'OSS.view.payments.tabs.fields.Class', {
    extend: 'Ext.form.field.ComboBox',
    labelWidth: 200,
    fieldLabel: OSS.Localize.get('Class of payment'),
    displayField: 'name',
    valueField: 'class_id',
    name: 'classid',
    queryMode: 'local',
    store: 'payments.Classes'
});
