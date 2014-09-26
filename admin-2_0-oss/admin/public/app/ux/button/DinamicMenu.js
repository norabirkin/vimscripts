/**
 * Кнопка с динамическим меню
 */
Ext.define('OSS.ux.button.DinamicMenu', {
    extend: 'Ext.button.Button',
    requires: 'OSS.ux.menu.Dinamic',
    store: null,
    valueField: 'id',
    displayField: 'name',
    displayTpl: null,
    initComponent: function() {
        this.menu = Ext.create('OSS.ux.menu.Dinamic', {
            store: this.store,
            valueField: this.valueField,
            displayField: this.displayField,
            displayTpl: this.displayTpl
        });
        this.on('render', this.menu.initialLoad, this.menu);
        this.callParent(arguments);
    }
});
