$(document).ready(function() {
    window.TarShape = new function() {
        this.render = function(params) {
            var html = '',
                i,
                text = params.text,
                details = params.details;
            for (i = 0; i < details.length; i ++) {
                html += new App.Tpl('<div><strong>{descr}:</strong> {value}</div>').render(details[i]);
            }
            return (new Details({
                text: text,
                details: html
            })).run();
        };
    };
});
