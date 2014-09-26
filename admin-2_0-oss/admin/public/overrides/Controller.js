Ext.define('OSS.overrides.app.Controller', function() {
    return {
        override: 'Ext.app.Controller',
        ref: function(refs) {
            refs = Ext.Array.from(refs);
            this.callParent( arguments );
        },
        programActivated: function() {
        },
        getMaskTarget: function() {
            return null;
        },
        mask: function(state) {
            if (typeof state == 'undefined') {
                state = true;
            }
            if (this.getMaskTarget()) {
                if (state) {
                    this.__mask = new Ext.LoadMask({
                        target: this.getMaskTarget()
                    });
                    this.__mask.show();
                } else {
                    if (!this.__mask) {
                        return;
                    }
                    this.__mask.hide();
                }
            }
        },
        unmask: function() {
            this.mask(false);
        }
    };
}());
