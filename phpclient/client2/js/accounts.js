$(document).ready(function() {
    App.Accounts = new function() {
        var main = this;


        this.id = function(el) {
            var id = $(el).attr('id').split('-'),
                result = {
                    agrmid: id[id.length - 1]
                };
            result.id = '-' + result.agrmid;
            return result;
        };
        

        this.Grids = new function() {
            var grids = {},

                exists = function(id) {
                    var i;
                    if (!id) { throw 'no id'; }
                    for ( i in grids ) {
                        if ( i == 'g-' + id ) {
                            return grids[i];
                        }
                    }
                    return false;
                };

            this.get = function(id) {
                var grid = exists(id);
                if (grid) { return grid; }
                grids['g-' + id] = new App.Grid($('#vgroups-container' + id));
                return grids['g-' + id];
            };
        }();


        this.Grid = function(id) {
            var grid = main.Grids.get(id),
                strong = new App.Tpl('<strong>{val}</strong>');

            var renderers = {
                login: function(data) {
                    var item = new App.Tpl(
                            '<li>',
                                '<a{first} href="{href}">{text}</a>',
                            '</li>'
                        ),
                        i,
                        actions = '';
                    for ( i = 0; i < data.actions.length; i ++ ) {
                        if (i === 0) {
                            data.actions[i].first = ' class="account-menu-item-first"';
                        } else {
                            data.actions[i].first = '';
                        }
                        actions = actions + item.render(data.actions[i]);
                    }
                    data.actions = actions;
                    return (new Details({
                        text: data.login,
                        details: new App.Tpl('<ul>{actions}</ul>').render(data)
                    })).run();
                },

                tarifdescr: function(data) {
                    if (typeof data == 'string') {
                        return strong.render({val: data});
                    } else {
                        return TarShape.render({
                            text: data.descr,
                            details: data.shape
                        });
                    }
                },

                services: function(data) {
                    return data.join('<br/>');
                },

                state: function(data) {
                    if (data.link) {
                        return new App.Tpl('<a href="{link}">{state}</a>').render(data);
                    } else {
                        return data.state;
                    }
                }
            };

            this.addRenderers = function() {
                var i;
                for (i in renderers) {
                    grid.addColumnRenderer(i, renderers[i]);
                }
            };

            this.bindLoadHandler = function() {
                grid.bindLoadHandler(function() {
                    $('.agreements-grid-row' + id).addClass('agreement-opened');
                });
            };

            this.load = function(params) {
                if (!grid.loading) {
                    if ( grid.isHidden() ) {
                        grid.load( App.url('index.php?r=account/vgroups&agrmid=' + params.agrmid) );
                    } else {
                        grid.hide();
                        $('.agreements-grid-row' + id).removeClass('agreement-opened');
                    }
                }
            };
        };

        this.onAccountTypeLinkClick = function(link) {
            var params = this.id(link),
                grid = new this.Grid(params.id);
            grid.addRenderers();
            grid.bindLoadHandler();
            grid.load(params);
        };

        this.listenAccountTypeLinks = function() {
            $('.show-vgroups').click(function() {
                main.onAccountTypeLinkClick(this);
            });
        };

        this.run = function() {
            this.listenAccountTypeLinks();
        };
    }();

    App.Accounts.run();
});
