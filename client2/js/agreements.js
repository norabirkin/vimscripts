$(document).ready(function(){
    App.Agreements = new function() {
        var grids = {},
            gridExists = function( agrmid ) {
                var i;
                if (!agrmid) { throw 'no agrmid'; }
                for ( i in grids ) {
                    if ( i == 'g-' + agrmid ) {
                        return grids[i];
                    }
                }
                return false;
            };
        this.getGrid = function(params) {
            var exists = gridExists(params.agrmid);
            if (exists) { return exists; }
            grids['g-' + params.agrmid] = new App.Grid($('#vgroups-container-' + params.agrmid));
            return grids['g-' + params.agrmid];
        }
    };
    $(document).on( 'click', '.actions-wrap > a', function(){
        var list = $('#actions-list-'+$(this).attr('id').split('-')[3]),
            offset = $(this).offset(),
            listIsVisible = list.is(':visible');
        $('.actions-list').hide();
		if (!listIsVisible) {
            list.css({
                top: offset.top + 17,
                left: offset.left
            });
            list.show();
		}
		return false;
    });
    $(document).on( 'click', '.actions-list', function(){});
	$('body').click(function(event) {
        if (!$(event.target).is('.actions-wrap > a')) {
            $('.actions-list').hide();
        }
	});
    $('.show-vgroups').click(function() {
    	var id = $(this).attr('id').split('-')[0],
            grid = App.Agreements.getGrid({
                agrmid: id
            }),
            strong = new App.Tpl('<strong>{val}</strong>'),
            stateChanging = [],
            stateChangingHandler = function(i) {
                var href = stateChanging[i].href;
                grid.getContainer().find('.' + stateChanging[i].id).find('.vgroups-change-status-link').click(function() {
                    grid.load(href);
                });
            },
            actionsContainer = new App.Tpl('<div id="actions-list-container-{agrm_id}"></div>');
        if ($('#actions-list-container-'+id)[0]) {
            $('#actions-list-container-'+id).html('');
        } else {
            $('#actions-list-container').append(actionsContainer.render({ agrm_id: id }));
        }
        grid.addColumnRenderer('login', function(data) {
            var item = new App.Tpl(
                    '<li>',
                        '<a href="{href}">{text}</a>',
                    '</li>'
                ),
                menu = new App.Tpl(
                    '<div class="actions-wrap">',
                        '<a id="actions-list-trigger-{vgid}" href="javascript:void(0)">{login}&nbsp;&#9662;</a>',
                    '</div>'
                ),
                i,
                list = new App.Tpl(
                    '<div class="actions-list" id="actions-list-{vgid}">',
                        '<ul>{actions}</ul>',
                    '</div>'
                ),
                actions = '';
            for ( i = 0; i < data.actions.length; i ++ ) {
                actions = actions + item.render(data.actions[i]);
            }
            data.actions = actions;
            $('#actions-list-container-'+id).append(list.render(data));
            return menu.render(data);
        });
        grid.addColumnRenderer('tarifdescr', function(data) {
            return (strong).render({val: data});
        });
        grid.addColumnRenderer('services', function(data) {
            return data.join('<br/>');
        });
        grid.addColumnRenderer('state', function(data, id) {
            var html = [data.state],
                change_tariff = new App.Tpl('<a href="{href}">{text}</a>'),
                change_status = new App.Tpl('<a class="vgroups-change-status-link">{text}</a>'),
                i;
            if (data.message) { html.push(strong.render({ val: data.message })); }
            if (data.change_tariff) { html.push(change_tariff.render(data.change_tariff)); }
            if (data.change_status) {
                html.push(change_status.render(data.change_status));
                stateChanging.push({ id: id, href: data.change_status.href });
            }
            return html.join('<br/>');
        });
        grid.bindLoadHandler(function() {
            var i;
            for ( i = 0; i < stateChanging.length; i ++ ) { stateChangingHandler(i); }
            stateChanging = [];
            $('.agreements-grid-row-' + id).addClass('agreement-opened');
        });
        if (!grid.loading) {
            if ( grid.isHidden() ) {
                grid.load( App.url('index.php?r=account/vgroups&agrmid=' + id) );
            } else {
                grid.hide();
                $('.agreements-grid-row-' + id).removeClass('agreement-opened');
            }
        }
    });
});
