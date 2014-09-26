/**
 * Allow to add custom css to the modal mask
 */
Ext.define('OSS.overrides.ZIndexManager', function() {
    return {
        override: 'Ext.ZIndexManager',
        
        _showModalMask:function(comp) {
            var maskCls = [];
            this.callParent(arguments);
            if (comp.getMaskCls && comp.getMaskCls()) {
                maskCls = 'x-mask-modal-' + comp.getMaskCls();
            } else if (comp.ui) {
                maskCls = 'x-mask-modal-' + comp.ui;
            }
            if (this.customMaskCls) {
                this.mask.removeCls(this.customMaskCls);
            }
            // mask is a reusable element, so each time it needs to accept only the relevant style
            if(maskCls) {
                this.customMaskCls = maskCls;
                this.mask.addCls(this.customMaskCls);
            }
        }
    };
}());
