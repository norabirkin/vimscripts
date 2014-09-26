/*
* Кнопка <Сохранить>
*/
Ext.define( 'OSS.ux.button.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.save',
    itemId: 'save',
    iconCls: 'x-ibtn-save',
    text: i18n.get( 'Save' )
});
