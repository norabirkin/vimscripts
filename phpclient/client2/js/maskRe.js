$(document).ready(function(){
    window.MaskRe = function(field, pattern, onKeyup) {
        if (typeof field == 'string') {
            field = $(field);
        }
        if (onKeyup === undefined) {
            onKeyup = [];
        }
        var tester = function(e) {
            this.keyCode = e.which;
            this.getChar = function() {
                return String.fromCharCode(this.keyCode);
            };
            this.testChar = function() {
                if (typeof e.charCode != 'undefined' && e.charCode === 0) {
                    return true;
                }
                return pattern.test(this.getChar());
            };
        };
        field.keypress(function(e) {
            return (new tester(e)).testChar();
        });
        field.keyup(function(e) {
            var i;
            for (i = 0; i < onKeyup.length; i ++) {
                onKeyup[i](field);
            }
        });
    };
    window.MaskRe.NUMERIC = /^[0-9\.]$/;
    window.MaskRe.INTEGER = /^[0-9]$/;
    window.MaskRe.minValue = function(min) {
        return function(field) {
            if (parseInt(field[0].value, 0) < min) {
                field[0].value = min;
            }
        };
    };
    window.MaskRe.maxValue = function(max) {
        return function(field) {
            if (parseInt(field[0].value, 0) > max) {
                field[0].value = max;
            }
        };
    };
});
