Ext.define( 'OSS.ux.button.Sprite', {
    extend: 'Ext.button.Button',
    disable: function() {
        this.callParent( arguments );
        this.removeClsWithUI('disabled');
        this.setIconCls('x-ibtn-def-dis ' + this.baseIconCls);
    },
    enable: function() {
        this.callParent( arguments );
        this.setIconCls('x-ibtn-def ' + this.baseIconCls);
    }
});
