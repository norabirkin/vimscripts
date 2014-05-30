$(document).ready(function() {
    window.Details = function (params) {
        var trigger,
            id,
            content = params.details,
            winCls = 'details-win',
            triggerCls = 'details-trigger';
        this.run = function() {
            this.id();
            this.createTrigger();
            this.createWindow();
            this.listenTriggerClick();
            this.listenToBodyClick();
            return trigger;
        };
        this.hideWindows = function() {
            $('.' + winCls).hide();
        };
        this.isWindowVisible = function() {
            return this.getWindow().is(':visible');
        };
        this.getTrigger = function() {
            return $('#' + this.triggerId());
        };
        this.showWindow = function() {
            this.getWindow()[0].detailsId = id;
            this.getWindow().show();
        };
        this.setWindowPosition = function() {
            var offset = this.getTrigger().offset();
            this.getWindow().css({
                top: offset.top + 17,
                left: offset.left
            });
        };
        this.setWindowContent = function() {
            this.getWindow().html(content);
        };
        this.windowIsOpenedByMe = function() {
            return this.getWindow()[0].detailsId == id;
        };
        this.onTriggerClick = function() {
            var visible = this.isWindowVisible();
            this.hideWindows();
            if (!visible || !this.windowIsOpenedByMe()) {
                this.setWindowPosition();
                this.setWindowContent();
                this.showWindow();
            }
        };
        this.getWindow = function() {
            return $('.'+winCls);
        };
        this.createWindow = function() {
            if (this.getWindow()[0]) {
                return;
            }
            $('body').append(new App.Tpl('<div class="{winCls}"></div>').render({
                winCls: winCls
            }));
        };
        this.triggerId = function() {
            return triggerCls + '-' + id;
        };
        this.id = function() {
            window.Details.id ++;
            id = window.Details.id;
        };
        this.createTrigger = function() {
            trigger = new App.Tpl(
                '<div>',
                    '<a id="{id}" class="{cls}" href="javascript:void(0)">{text}&nbsp;&#9662;</a>',
                '</div>'
            ).render({
                cls: triggerCls,
                id: this.triggerId(),
                text: params.text
            });
        };
        this.isInitialized = function() {
            return window.Details.initialized;
        };
        this.setInitialized = function() {
            window.Details.initialized = true;
        };
        this.listenToBodyClick = function() {
            var me = this;
            if (this.isInitialized()) {
                return;
            }
            $(document).on( 'click', '.' + winCls, function(){});
            $('body').click(function(event) {
                if (!$(event.target).is('.' + triggerCls)) {
                    me.hideWindows();
                }
            });
            this.setInitialized();
        };
        this.listenTriggerClick = function() {
            var me = this;
            $(document).on('click', '#' + this.triggerId(), function() {
                me.onTriggerClick(this);
                return false;
            });
        };
    };
    window.Details.id = 0;
    window.Details.initialized = false;
});
