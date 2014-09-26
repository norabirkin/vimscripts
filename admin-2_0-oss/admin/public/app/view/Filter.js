/**
 * Базовый класс для фильтров, располагающихся слева от таблиц.
 */
Ext.define('OSS.view.Filter', {
    extend: 'Ext.form.Panel',
    itemId: 'filter',
    region: 'west',
    bodyPadding: 5,
    frame: true,
    split: true, 
    autoScroll: true,
    layout: 'anchor',
    initComponent: function() {
        this.callParent(arguments);
        this.initAction();
    },
    initAction: function() {
        if (!this.actions) {
            return;
        }
        if (!Ext.isArray(this.actions)) {
            this.actions = [this.actions];
        }
        if (this.actions.length === 0) {
            return;
        }
        if (this.actions.length == 1) {
            this.getTopToolbar().insert(0, this.actions[0]);
        } else {
            this.getTopToolbar().insert(0, {
                xtype: 'button',
                text: i18n.get('Operations'),
                itemId: 'actions',
                menu: this.actions
            });
        }
    },
    getTopToolbar: function() {
        var tbar;
        if (!this.actions) {
            return;
        }
        tbar = this.getDockedItems('component[dock="top"]')[0];
        if (tbar) {
            return tbar;
        } else {
            tbar = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top'
            });
            this.addDocked(tbar);
            return tbar;
        }
    }
});
