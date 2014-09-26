/**
 * Кнопка <Вернуться к списку>
 */
Ext.define('OSS.ux.button.Back', {
    extend: 'Ext.button.Button',
    alias: 'widget.back',
    itemId: 'back', 
    iconCls: 'x-ibtn-def x-ibtn-prev',
    config: {
        form: null,
        grid: null
    },
    initComponent: function() {
        this.callParent(arguments);
    },
    /**
     * Запускает обработчик клика
     */
    fireHandler: function(e) {
        if (
            !this.skipCheckDirty &&
            this.isDirty()
        ) {
            this.askConfirmation(e);
        } else {
            this.reloadGrid();
            this.callParent(arguments);
        }
    },
    /**
     * Обновляет грид
     */
    reloadGrid: function() {
        var grid = this.grid;
        if (typeof grid == 'function') {
            grid = this.grid();
        }
        if (grid) {
            grid.getStore().load({
                force: true
            });
        }
    },
    /**
     * Возвращает TRUE если поля формы были изменены
     */
    isDirty: function() {
        var i,
            dirty = false,
            forms = this.getForm();
        if (!forms) {
            return false;
        }
        for (i = 0; i < forms.length; i ++) {
            if (forms[i] && forms[i].isDirty()) {
                dirty = true;
                break;
            }
        }
        return dirty;
    },
    /**
     * Возвращает форму
     */
    getForm: function() {
        var form;
        if (!this.form) {
            return null;
        } else {
            if (typeof this.form == 'function') {
                form = this.form();
            } else {
                form = this.form;
            }
            if (form instanceof Array){
                return form;
            } else {
                return [form];
            }
        }
    },
    /**
     * Показывает окно подтверждения перехода к списку
     */
    askConfirmation: function(e) {
        Ext.Msg.confirm(i18n.get('Going to list'), i18n.get('You will loose all you form data'), function(btn) {
             if (btn == 'yes') {
                 this.onConfirmed(e);
             }
        }, this);
    },
    /**
     * Выполняется при подтверждении перехода к списку
     */
    onConfirmed: function(e) {
        this.skipCheckDirty = true;
        this.fireHandler(e);
        this.skipCheckDirty = false;
    }
});
