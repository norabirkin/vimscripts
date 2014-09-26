/**
 * Контроллер раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.controller.AuthLog', {
    extend: 'Ext.app.Controller',
    view: 'AuthLog',
    requires: [
    ],
    stores: [
        'Agents',
        'authlog.Data'
    ],
    views: [
        'AuthLog',
        'authlog.Filter',
        'authlog.Grid'
    ],
    refs: [{
        selector: 'authlog',
        ref: 'authLog'
    }, {
        selector: 'authlog > #rightGrid',
        ref: 'mainGrid'
    }, {
        selector: 'authlog > #filterPanel',
        ref: 'filter'
    }, {
        selector: 'authlog > form',
        ref: 'filterForm'
    }, {
        selector: 'authlog > form #searchBtn ',
        ref: 'searchBtn'
    }],
    init: function() {
        this.control({
            "authlog": {
                afterrender: this.onPanelRender
            },
            "authlog > form #searchBtn": {
                click: this.submitSearchForm
            }
        });
    },
    
    onPanelRender: function() {
        var p = this.getMainGrid().getStore().getProxy(),
            f = this.getFilterForm().getForm();
        p.setExtraParam('dt_from', f.findField('dtfrom').getValue());
        p.setExtraParam('dt_to', f.findField('dtto').getValue());
        this.getMainGrid().getStore().reload();
    },
    
    submitSearchForm: function(Btn) {
        var p = this.getMainGrid().getStore().getProxy(),
            f = this.getFilterForm().getForm();
        p.setExtraParam('dt_from', f.findField('dtfrom').getValue());
        p.setExtraParam('dt_to', f.findField('dtto').getValue());
        p.setExtraParam('event', f.findField('event').getValue());
        p.setExtraParam('agent', f.findField('agent').getValue());
        p.setExtraParam('flt', f.findField('filter').getValue());
        p.setExtraParam('filtertext', f.findField('filtertext').getValue());
        
        this.getMainGrid().getStore().reload();
    },
});
