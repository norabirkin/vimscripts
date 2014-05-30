$(document).ready(function(){
    window.CookieManager = new function() {
        var cookies;
        this.parseCookies = function() {
            var cookie = document.cookie.split('; '),
                parsed = {},
                item,
                i;
            for (i = 0; i < cookie.length; i ++) {
                item = cookie[i].split('=');
                parsed[item[0]] = item[1];
            }
            return parsed;
        };
        this.get = function(name) {
            return cookies[name];
        };
        this.set = function(name, value) {
            document.cookie = name + '=' + value;
            this.parseCookies();
        };
        cookies = this.parseCookies();
    };
    $('.paging-limit').change(function() {
        CookieManager.set('pg-size', this.value);
        document.location.reload();
    });
});
