Ext.define( 'OSS.ux.form.field.date.withTime.Time', {
    extend: 'Ext.form.field.Number',
    value: 0,
    minValue: 0,
    width: 50,
    padding: '0 5 0 0',
    bindToolTip: function() {
        Ext.create( 'Ext.tip.ToolTip', {
            target: this.el.dom,
            trackMouse: true,
            renderTo: Ext.getBody(),
            showDelay: 100,
            hideDelay: 0,
            html: this.tip
        });
    },
    initComponent: function() {
        this.callParent( arguments );
        this.on('render', this.bindToolTip);
    },
    valueToRaw: function( value ){
        if (value < 10) {
            return '0' + value;
        }
        return this.callParent( [value] );
    }
});
