var ga_product = "";
var ga_section = "";
var ga_subsection = "";
var ga_region = "";
var ga_HasMSISDN = false;

// Получаем номер телефона из URL
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

// Проверяем доступность номера телефона
var msisdn;
var msisdnParam = "MSISDN";
if (typeof getCookieBalance == 'function') {
    // функция существует, ее можно вызывать
    msisdn = getCookieBalance(labelMsisdnId);
    if (msisdn == "" || msisdn == "null" || msisdn == "undefined" || msisdn == null || msisdn == undefined)
        msisdn = getURLParameter(msisdnParam);
}
else {
    msisdn = getURLParameter(msisdnParam);
}

// Получили номер телефона?
if (msisdn == "" || msisdn == "null" || msisdn == "undefined" || msisdn == null || msisdn == undefined)
    ga_HasMSISDN = false;
else
    ga_HasMSISDN = true;

var metaCollection = $('head meta');

metaCollection.each(function (index) {
    switch ($(this)[0].name) {
        case 'ga_section':
            ga_section = $(this)[0].content;
            break;
        case 'ga_subsection':
            ga_subsection = $(this)[0].content;
            break;
        case 'ga_region':
            ga_region = $(this)[0].content;
            break;
    }
});

metaCollection.each(function (index) {
    if ($(this).attr('property') == "og:title")
        ga_product = $(this)[0].content;
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-47313009-1']);
//_gaq.push(['_setDomainName', '.mts.ru']);
_gaq.push(['_setAllowHash', false]);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageLoadTime']);

// Переменные для всех страниц сайта:
if (ga_region != "")
    _gaq.push(['_setCustomVar', 3, 'Region', ga_region, 3]);
else
    _gaq.push(['_setCustomVar', 3, 'Region', 'moscow', 3]);
if (ga_HasMSISDN)
    _gaq.push(['_setCustomVar', 4, 'Customer', 'Yes', 2]);
else
    _gaq.push(['_setCustomVar', 4, 'Customer', 'No', 2]);

// Переменные для избранных страниц сайта (устанавливать, только
// в специально обозначенных местах):
if (ga_section != "")
    _gaq.push(['_setCustomVar', 1, 'Section', ga_section, 3]);
if (ga_subsection != "")
    _gaq.push(['_setCustomVar', 2, 'Sub-Section', ga_subsection, 3]);

_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
