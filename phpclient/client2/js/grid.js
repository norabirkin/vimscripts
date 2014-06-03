$(document).ready(function(){
    window.App = new function() {
        this.url = function(url) {
            return $('meta[name="application-url"]').attr("content") + '/' + url;
        };
        this.Tpl = function() {
            var args = Array.prototype.slice.call(arguments, 0),
                tpl = args.length == 1 ? args[0] : args.join('');
            this.render = function(data) {
                var str = tpl,
                    i;
                for ( i in data ) {
                    str = str.split('{'+i+'}').join(data[i]);
                }
                return str;
            };
        };
        this.Grid = function(container) {
            var renderers = {},
                head = new App.Tpl('<th class="{cls}">{value}</th>'),
                cell = new App.Tpl('<td class="{cls}">{value}</td>'),
                row = new App.Tpl('<tr class="{id} {cls}">{cells}</tr>'),
                empty = new App.Tpl('<tr class="odd"><td class="first_col" colspan="{colspan}">{message}</td></tr>'),
                page = new App.Tpl(
                    '<li class="page{page_selected}">',
                        '<a class="vgroups-pager-link vgroups-pager-link-page">{page_number}</a>',
                    '</li>'
                ),
                pager = new App.Tpl(
                    '<div class="pager">',
                        '<ul class="yiiPager">',
                            '<li class="first{first_hidden}">',
                                '<a class="vgroups-pager-link vgroups-pager-link-first">&lt;&lt; Первая</a>',
                            '</li>',
                            '<li class="previous{previous_hidden}">',
                                '<a class="vgroups-pager-link vgroups-pager-link-previous">&lt; Предыдущая</a>',
                            '</li>',
                            '{pages}',
                            '<li class="next{next_hidden}">',
                                '<a class="vgroups-pager-link vgroups-pager-link-next">Следующая &gt;</a>',
                            '</li>',
                            '<li class="last{last_hidden}">',
                                '<a class="vgroups-pager-link vgroups-pager-link-last">Последняя &gt;&gt;</a>',
                            '</li>',
                        '</ul>',
                    '</div>'
                ),
                title = new App.Tpl('<h4>{title}</h4>'),
                table = new App.Tpl('<table><thead>{head}</thead><tbody>{body}</tbody></table>{pager}'),
                hidden = true,
                pagerData,
                pagesData,
                loadHandler = { callback: function() {}, scope: {} },
                img = new App.Tpl('<img src="{src}" />');
            container.hide();
            this.getContainer = function() {
                return container;
            };
            this.isHidden = function() {
                return hidden;
            };
            this.show = function() {
                container.show();
                hidden = false;
            };
            this.hide = function() {
                container.hide();
                hidden = true;
            };
            this.bindLoadHandler = function(callback, scope) {
                callback = callback || function() {},
                scope = scope || {};
                loadHandler = { callback: callback, scope: scope }
            };
            this.loadingIcon = function() {
                return img.render({ src: App.url("i/ajax-loader.gif") });
            };
            this.load = function(url, callback, scope) {
                if ( this.loading ) { return; }
                if (!url || url == '') { return; }
                var me = this,
                    callback = callback || function() {},
                    scope = scope || {};
                this.show();
                container.html( this.loadingIcon() );
                this.loading = true;
                $.post(url, function(data) {
                    data = $.parseJSON(data);
                    if (data.unauthorized) { window.location.reload(); return; }
                    container.html( me.render(data) );
                    callback.call(scope);
                    loadHandler.callback.call(loadHandler.scope);
                    me.setPagerEventHandlers();
                    me.loading = false;
                });
            };
            this.setPagerEventHandlers = function() {
                var me = this,
                    i,
                    pages;
                if (!pagerData || !pagesData) { return; }
                container.find('.vgroups-pager-link-first').click(function() {me.visitFirst();});
                container.find('.vgroups-pager-link-previous').click(function() {me.visitPrevious();});
                container.find('.vgroups-pager-link-next').click(function() {me.visitNext();});
                container.find('.vgroups-pager-link-last').click(function() {me.visitLast();});
                pages = container.find('.vgroups-pager-link-page');
                for ( i = 0; i < pages.length; i ++ ) {
                    this.bindPageClickHandler(pages, i);
                }
            };
            this.bindPageClickHandler = function(pages, i) {
                var me = this;
                $(pages[i]).click(function() {me.visitPage(i)});
            };
            this.visitPage = function(i) {
                this.load( pagesData[i].page_href );
            };
            this.visitLast = function() {
                this.load( pagerData.last_href );
            };
            this.visitNext = function() {
                this.load( pagerData.next_href );
            };
            this.visitFirst = function() {
                this.load( pagerData.first_href );
            };
            this.visitPrevious = function() {
                this.load( pagerData.previous_href );
            };
            this.head = function(data) {
                return row.render({ id: 'grid-head-row', cls: 'grid-head', cells: this.row(data, head) })
            };
            this.empty = function(data) {
                return empty.render({ message: data.empty, colspan: data.head.length });
            };
            this.body = function( data ) {
                var rows = '',
                    i,
                    odd = true,
                    id;
                if (data.body.length == 0) { return this.empty(data); }
                data = data.body;
                for ( i = 0; i < data.length; i ++ ) {
                    id = 'vgroups-grid-row-' + i;
                    rows = rows + row.render({ id: id, cls: (odd ? 'odd' : 'even'), cells: this.row(data[i], cell, id) });
                    odd = !odd;
                }
                return rows;
            };
            this.addColumnRenderer = function( prop, renderer ) {
                renderers[prop] = renderer;
            };
            this.row = function(data, tpl, id) {
                var i,
                    row = '',
                    first = true;
                for ( i in data ) {
                    row = row + tpl.render({ cls: (first ? 'first_col' : 'grid-column'), value: (i in renderers) ? renderers[i](data[i], id) : data[i] });
                    first = false;
                }
                return row;
            };
            this.render = function(data) {
                var html = table.render({ head: this.head(data.head), body: this.body(data), pager: this.getPager(data.pager) });
                if (data.title) { html = title.render({ title: data.title }) + html; }
                return html;
            };
            this.getPager = function(data) {
                var i,
                    pages;
                if (!data) { return ''; }
                pagerData = data;
                pagesData = data.pages;
                data.pages = this.getPages(data.pages);
                return pager.render(data);
            };
            this.getPages = function(data) {
                var pages = '',
                    i;
                for ( i = 0; i < data.length; i ++ ) { pages = pages + page.render(data[i]); }
                return pages;
            };
        };
    };
});
