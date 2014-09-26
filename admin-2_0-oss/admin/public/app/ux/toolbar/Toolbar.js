/**
 * Базовый класс тулбара с действиями и кнопкой <Вернуться к списку>
 */
Ext.define('OSS.ux.toolbar.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'tbar',
    dock: 'top',
    initComponent: function() {
        if (this.items && this.items.length > 0) {
            this.items = [{
                xtype: 'tbseparator'
            }].concat(this.items);
        } else {
            this.items = [];
        }
        this.items = [{
            xtype: 'button',
            itemId: 'actions',
            text: i18n.get('Actions'),
            menu: this.processActions()
        }].concat(this.items);
        if (this.back) {
            this.items = [Ext.apply({
                xtype: 'back'
            }, typeof this.back == 'object' ? this.back : {}), {
                xtype: 'tbseparator'
            }].concat(this.items);
        }
        this.callParent(arguments);
    },
    back: false,
    actions: [],
    /**
     * Создает часто используемые элементы меню <Действия>
     */
    processActions: function() {
        var i,
            actions = this.getActions(),
            items = [],
            item;
        for (i = 0; i < actions.length; i++) {
            item = actions[i];
            if (typeof item == 'string') {
                switch (item) {
                    case 'save':
                        item = {
                            itemId: 'save',
                            iconCls: 'x-ibtn-save',
                            text: i18n.get('Save')
                        };
                        break;
                    case 'add':
                        item = {
                            itemId:'add',
                            text: i18n.get('Add'),
                            iconCls: 'x-ibtn-add'
                        };
                        break;
                    case 'remove':
                        item = {
                            itemId:'remove', 
                            text: i18n.get('Delete'), 
                            iconCls: 'x-ibtn-def x-ibtn-delete'
                        };
                        break;
                    default:
                        throw 'Unknown button';
                }
            }
            items.push(item);
        }
        return items;
    },
    /**
     * Получает содержимое меню акций
     */
    getActions: function() {
        return this.actions;
    }
});
