/**
 * Кнопка "Назад" в форме тарифов
 */
Ext.define('OSS.view.tariffs.form.Back', {
    extend: 'OSS.ux.button.Back',
    form: function() {
        return [
            Ext.app.Application.instance.getController('Tariffs').getForm(),
            Ext.app.Application.instance.getController('Tariffs').getCategoryDataForm()
        ];
    }
});
