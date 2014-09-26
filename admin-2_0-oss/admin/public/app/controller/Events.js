/**
 * Контроллер раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.controller.Events', {
    extend: 'Ext.app.Controller',
    view: 'Events',
    requires: [
    ],
    stores: [
        'events.Details',
        'Events',
        'managers.Managers'
    ],
    views: [
        'events.Details',
        'Events',
        'events.Filter',
        'events.Grid'
    ],
    refs: [{
        selector: 'events > #filter',
        ref: 'filter'
    }],
    init: function() {
        this.control({
            'events > #filter > toolbar > #show': {
                click: 'show'
            },
            'events > #list > headercontainer > actioncolumn[dataIndex=more]': {
                click: 'details'
            }
        });
    },
    show: function() {
        var store = this.getEventsStore();
        store.proxy.extraParams =
            this.getFilter().
                getForm().
                getValues();
        store.load();
    },
    details: function() {
        var record = arguments[5],
            store = this.getEventsDetailsStore();
        if (!record.get('more')) {
            return;
        }
        Ext.create('OSS.view.events.Details').show();
        store.proxy.extraParams = {
            record_id: record.get('record_id')
        };
        store.load();
    }
});
