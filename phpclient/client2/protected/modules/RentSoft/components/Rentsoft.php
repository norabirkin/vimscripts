<?php
class Rentsoft
{
    const VERSION = "2.01";

    /**
     * Вызывается на стороне Агента.
     * 
     * Возвращает код генерации элемента iframe для размещения в личном кабинете Агента.
     * Через iframe пользователю доступен интерфейс управления услугами Рентсофт.
     *
     * @param string $rsUri             GET-параметр самой верхней страницы, открытой в браузере
     * @param string $agRef             Аргумент сохранён для обратной совместимости (передавайте null)
     * @param string $agName            Системное имя Агента
     * @param string $agUuid            ID пользователя в системе Агента
     * @param string $agApi             Полный URL API Агента, который позволяет работать с этим пользователем
     * @param string $agSecret          Секретный ключ, используется для цифровой подписи
     * @param string $devDomainSuffix   Используется для отладки (по умолчанию '')
     * @param int $width                Ширина IFRAME (по умолчанию 100%)
     * @return string                   Код генерации элемента iframe
     */
    public static function getIframe($rsUri, $agRef, $agName, $agUuid, $agApi, $agSecret, $devDomainSuffix = '', $width = null)
    {
        // Since 2010-11-15 $agRef is not used, but it is still in the 
        // interface to keep function prototype backward-compatible.
                    
        // Build and sign response params.
        $rsSignedParams = 
            "ag_uuid=" . urlencode($agUuid) . "&" .               // agent's user ID
            ($agApi? "ag_api=" . urlencode($agApi) . "&" : "") .  // agent's API for this user
            "ag_timestamp=" . time() . "&" .                      // timestamp of this request creation WITH MILLISECONDS
            "ag_rnd=" . mt_rand();                                // a random number to get unique URL
        $rsSignedParams .= "&ag_sign=" . md5($agSecret . $rsSignedParams);

        // Build response URI.
        $rsResponseUri = '/' . self::VERSION . "/iframe/" . ltrim($rsUri, '/')
            . (false !== strpos($rsUri, '?')? '&' : '?') 
            . $rsSignedParams;

        // Build IFRAME hostname.
        $rsHostname = "{$agName}.ag.rentsoft.ru{$devDomainSuffix}";
        
        // Build IFRAME full URL.
        // Note that width must be set by JS together with height due to IE bug.
        $proto = preg_match('/\.(dev|test|prod)\./si', $rsHostname) ? "http" : "https";
        return self::getStretchingIframe('rentsoft_ag', "{$proto}://{$rsHostname}{$rsResponseUri}", $width);
    }

    /**
     * Вызывается на стороне Агента.
     *
     * Возвращает код генерации элемента iframe с поддержкой автоматической подстройки высоты.
     * Может использоваться для размещения витрины Рентсофт внутри iframe'а
     *
     * @param  string $id          Префикс атрибута id элемента iframe и его контейнера (например, 'rentsoft_showcase')
     * @param  string $src         Полный URL страницы, которая будет открыта в iframe (значени атрибута src)
     * @param  string $width       Ширина iframe (по умолчанию 100%)
     * @param  string $height      Изначальная высота iframe.
     * @return string              HTML-код, который при вставке превращается в IFRAME.
     */
    public static function getStretchingIframe($id, $src, $width, $height = "500px")
    {
        if (!$width) $width = '100%';
        if (!$id) {
            // Try to make IFRAME ID variation as small as possible.
            static $numIframe = null, $uniqIframe = null;
            if (!$numIframe) $numIframe = 0;
            if (!$uniqIframe) $uniqIframe = uniqid('');
            $id = 'rs_' . $uniqIframe . "_" . ($numIframe++);
        }
        $src = addcslashes($src, "\\'\"\n\r/"); // note '/' at the end to avoid XSS!!!
        $divId = 'rs_' . uniqid('') . '_div';
        return rtrim("
            <div id='{$divId}'></div>
            <script type='text/javascript'>
            function cookieTransportGet(k) {
                var ns = arguments.callee;
                var key = 'cookietransport_' + k;
                if (document.cookie.match(new RegExp('(?:^|;\\\\s*)' + key + '=([^;]+)'))) {
                    var v = unescape(RegExp.$1);
                    document.cookie = key + '=; path=/; expires=Thu, 01-Jan-70 00:00:01 GMT';
                    return v;
                }
                return null;
            }
            (function () {
                var div = document.getElementById('{$divId}');
                var id = '{$id}_iframe';
                var src = '{$src}';
                // Creation via innerHTML is the ONLY way for IE to pass window.name inside.
                div.innerHTML = '<iframe name=\"' + id + '\" frameBorder=no scrolling=no allowTransparency=true></iframe>';
                var ifr = div.firstChild;
                ifr.id = id;
                ifr.style.padding = ifr.style.margin = '0';
                ifr.style.overflow = 'hidden';
                ifr.style.height = '{$height}'; // initial height
                ifr.style.width = '{$width}';
                ifr.src = src + (src.indexOf('?') >= 0? '&' : '?') + 'ag_ref=' + escape(location.href.replace(/#.*/, ''));
                var prevH = null;
                setInterval(function() {
                    try {
                        var h = null;
                        if (!h) {
                            // Try to extract height from the cookie transport.
                            h = cookieTransportGet('h_' + ifr.name);
                        }
                        if (!h) {
                            // Try to extract height from the hash.
                            h = location.hash.match(/^#h([0-9]+)/)? RegExp.$1 : null;
                        }
                        if (!h) {
                            // Try to use window.name transport.
                            try { delete(frames['h' + prevH]) } catch (e) {} // delete frame if it has changed its window.name.
                            if (frames['h' + prevH]) {
                                // Cross-domain magic: if the marker still exists, it is real.
                                h = prevH;
                            } else for (var i = 0; i < 10000; i += 30) if (frames['h' + i]) {
                                // Previous marker disappeared: found a new one.
                                h = i;
                                break;
                            }
                        }
                        if (h && h != prevH) {
                            ifr.style.height = parseInt(h) + 'px';
                            ifr.style.width = '{$width}';
                            prevH = h;
                        }
                    } catch (e) {
                        if (window.console) console.log(e);
                    }
                }, 100);
            })();
            </script>
        ");
    }

    /**
     * Вызывается на стороне RentSoft.
     * Исходный код приведён для примера
     *
     * Возвращает javascript-код, реализующий поддержку автоматической подстройки высоты,
     * если страница открыта через iframe
     *
     * @param  bool $useCookieTransport  Если true, для передачи высоты используется CookieTransport.
     * @return string                    HTML-код, подстраивающий высоту IFRAME на стороне Рентсофт.
     */
    public static function getStretchingIframeRSSide($useCookieTransport = false)
    {
        $useCookieTransport = intval($useCookieTransport);
        return trim("
            <script type='text/javascript'>
            function cookieTransportSet(k, v) {
                var ns = arguments.callee;
                if (ns.url && !ns.ifr) {
                    var ifr = document.createElement('iframe');
                    ifr.style.position = 'absolute';
                    ifr.style.left = '-5000px';
                    ifr.style.top = '-5000px';
                    document.body.appendChild(ifr);
                    ns.ifr = ifr.contentWindow || ifr.contentDocument.window; // for IE
                }
                if (ns.ifr) {
                    ns.ifr.location.replace(ns.url + '#' + escape(k) + '=' + escape(v) + '&ncrnd=' + new Date().getTime());
                }
            }
            (function() {
                if (location.href.match(/[?&]in_frame=1/)) return; // only for frameset cabinet
                var ie = 0 /*@cc_on + @_jscript_version @*/;
                var dt = 100;
                var prevH = null;
                var timeout = null;
                var agRef = null;
                // Read ag_ref from query string?
                if (!agRef) {
                    agRef = location.search.match(/[?&]ag_ref=([^&?]*)/)? unescape(RegExp.$1) : null;
                }
                // Use ag_ref to initialize cookie transport.
                if ($useCookieTransport && agRef) {
                    cookieTransportSet.url = agRef.match(/^(\w+:\/\/[^\/]+)/)? RegExp.$1 + '/cookietransport.html?13': null;
                }
                // Read agRef from cookie?
                if (!agRef) {
                    agRef = document.cookie.match(/(?:^|;\s*)ag_ref=([^;]*)/)? unescape(RegExp.$1) : null;
                }
                // We don't know agRef. Do nothing (for IE we MUST have agRef in any case).
                if (!agRef) {
                    return;
                }
                // We know agRef. Store it in cookie.
                document.cookie = 'ag_ref=' + escape(agRef) + '; path=/';
                // Proceed with height monitoring.
                var callback = function(first) {
                    setTimeout(callback, dt / 2);
                    // Find bottom point of the page.
                    var bp = document.getElementById('bottom_point');
                    if (!bp) return;
                    // If nothing is changed, do nothing.
                    var hOrig = Math.round(bp.offsetTop);
                    if (prevH === hOrig) return;
                    // Use setTimeout to reduce continuous smooth resize
                    // (e.g. jQuery effects) into one parent window signal.
                    var h = Math.ceil(hOrig / 30) * 30;
                    var innerCallback = function() {
                        if (cookieTransportSet.url) {
                            // Pass height over the cookie transport.
                            cookieTransportSet('h_' + window.name, hOrig);
                        } else if (!ie) {
                            // For non-IE use window.name transport.
                            window.name = 'h' + h;
                        } else {
                            // For IE use hash transport (works only for 1-level nested iframes).
                            parent.location.replace(agRef + '#h' + h);
                        }
                    };
                    if (timeout) clearTimeout(timeout);
                    if (first) innerCallback(); else timeout = setTimeout(innerCallback, dt);
                    // Save the height which was currently sent.
                    prevH = hOrig;
                };
                callback(1); // it is IMPORTANT to call it synchronously
            })();
            </script>
        ");
    }

    /**
     * Вызывается на стороне RentSoft.
     * Исходный код приведён для примера.
     *
     * Разбирает REQUEST_URI и HTTP_HOST, проверяет цифровую подпись iframe и т.д.
     *
     * @param string $httpHost
     * @param string $requestUri
     * @param string $rsSecretCallback  Callback для получения секретного ключа по имени агента
     * @param callback $nonceCallback   Callback для контроля повторной отправки запросов
     * @return array                    Разобранные аргументы
     * @throws Exception
     */
    public static function readArgs($httpHost, $requestUri, $rsSecretCallback, $nonceCallback)
    {
        $agName = preg_replace('/\..*$/s', '', $httpHost);
        $rsSecret = call_user_func($rsSecretCallback, $agName);

        $expireDelta = 2 * 24 * 3600; // must be > 2 days, because we know nothing about time zone here
        $args = array();
        parse_str(parse_url($requestUri, PHP_URL_QUERY), $args);
        $prefix = preg_replace('/&ag_sign=.*$/s', '', $requestUri);

        if (md5($rsSecret . $prefix) !== @$args['ag_sign']) {
            throw new Exception("Invalid digital signature!");
        }
        $agTimestamp = @$args['ag_timestamp'];
        $dt = time() - $agTimestamp;
        // Check if the request is knowingly expired.
        if ($dt > $expireDelta) {
            throw new Exception("The request is expired (age is $dt seconds which is more than $expireDelta seconds)");
        }
        // Check nonce (typically all used URIs are stored in DB).
        if (!call_user_func($nonceCallback, $prefix)) {
            throw new Exception("This request was already used: $prefix");
        }
        return array(
            'agName' => $agName,
            'agUuid' => @$args['ag_uuid'],
            'agWsdl' => @$args['ag_wsdl'],
            'agRef'  => @$args['ag_ref'],
            'agTimestamp' => $agTimestamp,
            'agSign' => @$args['ag_sign'],
        );
    }

    /**
     * Вызывается на стороне Агента.
     *
     * Реализует mutex, препятствующий осуществлению параллельных списаний по одному пользователю.
     * Файлы mutex'ов создаются в session_save_path, поэтому удаление устаревших файлов
     * будет осуществляться автоматически.
     *
     * @param string $id
     * @return resource $mutex
     */
    public static function aquireMutex($id)
    {
        if (!ctype_alnum($id)) $id = md5($id);
        // We create the lock file in session directory, because it is 
        // auto-cleaned by PHP session engine on expiration.
        $fname = session_save_path() . "/sess_rs_{$id}.lck";
        $f = @fopen($fname, "a+");
        if (!$f) {
            die(
                "Cannot create a lock file at $fname: make sure you have a writable " .
                "directory in session.save_path of php.ini " .
                "(current value: \"" . session_save_path() . "\" is invalid)."
            );
        }
        flock($f, LOCK_EX);
        return $f;
    }

    /**
     * Вызывается на стороне Агента.
     *
     * Отпускает mutex.
     * Метод необходим для версий PHP 5.3.x - более ранние версии
     * отпускали mutex автоматически при уничтожении переменной с ресурсом.
     *
     * @param resource $mutex
     */
    public static function releaseMutex($mutex)
    {
        flock($mutex, LOCK_UN);
        fclose($mutex);
    }
}
