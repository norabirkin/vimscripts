/**
 * Выбор месяца
 */
Ext.define('OSS.ux.form.field.date.Month', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.monthfield',
    sumbitFormat: 'Y-m-01',
    format: 'F Y',
    editable: false,
    createPicker: function() {
        return new Ext.picker.Month({
            renderTo: document.body,
            pickerField: this,
            ownerCt: this.ownerCt,
            floating: true,
            hidden: true,
            shadow: false,
            width: 177,
            height: 200,
            listeners: {
                scope: this,
                cancelclick: this.onCancelClick,
                okclick: this.onOkClick,
                yeardblclick: this.onOkClick,
                monthdblclick: this.onOkClick
            }
        });
    },
    onCancelClick: function(){
        this.collapse();
    },
    setValue: function(value) {
        this.callParent(arguments);
    },
    onOkClick: function(picker, value){
        var month = value[0],
            year = value[1],
            date = new Date(year, month, 1);
        this.setValue(date);
        this.collapse();
    }
});
