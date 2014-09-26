/**
 * Редактор правил
 */
Ext.define('OSS.view.managers.RolesEditor', {
    extend: 'Ext.form.ComboBox',
    valueField: 'value',
    editable: false,
    displayField: 'name',
    store: 'managers.RulesEditor'
});
