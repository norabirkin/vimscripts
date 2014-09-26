/**
 * Расширенный фильтр
 */
Ext.define('OSS.view.reports.filter.AdvancedSearch', {
    extend: 'OSS.view.AdvancedSearch',
    alias: 'widget.advancedsearch',
    getItems: function() {
        return [
            this.getComboBox(),
            this.getButton()
        ];
    },
    getComboBoxConfig: function() {
        return {
            fieldLabel: i18n.get('Advanced filter'),
            flex: 1,
            labelWidth: this.labelWidth
        };
    },
    getValue: function() {
        return this.getComboBox().getToolbarValue();
    }
});
