/**
 * Override main Element
 */
Ext.define('OSS.overrides.Element', function() {
    return {
        override: 'Ext.Element',
        
        /**
         * 
         */
        fireEvent: (function() {
            var HTMLEvts = /^(scroll|resize|load|unload|abort|error)$/,
                mouseEvts = /^(click|dblclick|mousedown|mouseup|mouseover|mouseout|contextmenu)$/,
                UIEvts = /^(focus|blur|select|change|reset|keypress|keydown|keyup)$/,
                onPref = /^on/;
    
            return Ext.isIE ? function(e) {
                e = e.toLowerCase();
                if (!onPref.test(e)) {
                    e = 'on' + e;
                }
                this.dom.fireEvent(e, document.createEventObject());
            } : function(e) {           
                e = e.toLowerCase();
                e.replace(onPref, '');
                var evt;
                if (mouseEvts.test(e)) {
                    var b = this.getBox(),
                        x = b.x + b.width / 2,
                        y = b.y + b.height / 2;
                    evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent(e, true, true, window, (e=='dblclick')?2:1, x, y, x, y, false, false, false, false, 0, null);
                } else if (UIEvts.test(e)) {
                    evt = document.createEvent("UIEvents");
                    evt.initUIEvent(e, true, true, window, 0);
                } else if (HTMLEvts.test(e)) {
                    evt = document.createEvent("HTMLEvents");
                    evt.initEvent(e, true, true);
                }
                if (evt) {
                    this.dom.dispatchEvent(evt);
                }
            };
        })()
    };
}());
