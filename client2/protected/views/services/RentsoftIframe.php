		<div id='<?php echo $divId; ?>'></div>
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
                var div = document.getElementById('<?php echo $divId; ?>');
                var id = '<?php echo $id; ?>_iframe';
                var src = '<?php echo $src; ?>';
                // Creation via innerHTML is the ONLY way for IE to pass window.name inside.
                div.innerHTML = '<iframe name=\"' + id + '\" frameBorder=no scrolling=no allowTransparency=true></iframe>';
                var ifr = div.firstChild;
                ifr.id = id;
                ifr.style.padding = ifr.style.margin = '0';
                ifr.style.overflow = 'hidden';
                ifr.style.height = '<?php echo $height; ?>'; // initial height
                ifr.style.width = '<?php echo $width; ?>';
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
                            h = location.hash.match(/^#h(\d+)/)? RegExp.$1 : null;
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
                            ifr.style.width = '<?php echo $width; ?>';
                            prevH = h;
                        }
                    } catch (e) {
                        if (window.console) console.log(e);
                    }
                }, 100);
            })();
            </script>