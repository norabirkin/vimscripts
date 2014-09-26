/**
 * Контроллер раздела Действия / Генерировать / Отчеты
 */
Ext.define('OSS.controller.Reports', {
    extend: 'Ext.app.Controller',
    STATUS_DONE: 0,
    STATUS_LOADING: 1,
    STATUS_CANCELED: 3,
    STATUS_ERROR: 4,
    requires: [
        'OSS.helpers.reports.Reloading'
    ],
    stores: [
        'reports.ReportsDocuments',
        'reports.documents.ReportsQueue',
        'managers.Managers'
    ],
    view: 'reports',
    views: [
        'Reports',
        'reports.Queue',
        'reports.list.Grid',
        'reports.list.Filter',
        'reports.queue.Status',
        'reports.queue.CancelOrDelete',
        'reports.queue.ErrorOrSave',
        'reports.filter.AdvancedSearch'
    ],
    refs: [{
        selector: 'reports > #filter',
        ref: 'filter'
    }, {
        selector: 'reports > #filter > #val > #date',
        ref: 'dateContainer'
    }, {
        selector: '#filter > #additional',
        ref: 'additional'
    }, {
        selector: 'reports > #filter > #filter > advsearch',
        ref: 'addvancedFilter'
    }, {
        selector: 'reports > #queue > toolbar > #toggleReload',
        ref: 'toggleReload'
    }, {
        selector: 'reports > #queue > toolbar',
        ref: 'toolbar'
    }],
    init: function() {
        this.control({
            'reports': {
                render: 'onPanelRender'
            },
            'reports > #queue': {
                afterrender: 'initReloading'
            },
            'reports > #filter > toolbar > #add': {
                click: 'enqueue'
            },
            'reports > #filter > #val > combogrid1[name=doc_id]': {
                change: 'documentChange'
            },
            'reports > #queue > toolbar > #find': {
                click: 'find'
            }
        });
    },
    /**
     * Поиск по фильтру
     */
    find: function() {
        this.getToolbar().refreshGrid();
    },
    /**
     * Выполняется при изменении значения комбогрида шаблонов документов
     */
    documentChange: function() {
        var record = this.getFilter().getForm().findField('doc_id').getRecord();
        if (!record) {
            return;
        }
        this.getDateContainer().getLayout().setActiveItem(
            this.getDateContainer().down('component[document_period='+record.get('document_period')+']')
        );
        this.getAdditional()[record.get('on_fly') == 7 ? 'show' : 'hide']();
    },
    /**
     * Сохраняет документ
     */
    save: function(record) {
        OSS.Download.get({
            url: "index.php/api/documentsqueue/download",
            params: {
                last_order_id: record.get('last_order_id')
            }
        });
    },
    /**
     * Отменяет генерацию документа
     */
    cancel: function(record) {
        ajax.request({
            url: 'documentsqueue/cancel',
            params: {
                record_id: record.get('record_id')
            },
            success: this.loadQueue,
            scope: this
        });
    },
    /**
     * Удалает документ
     */
    remove: function(record) {
        ajax.request({
            url: 'documentsqueue/'+record.get('record_id'),
            method: 'DELETE',
            success: this.loadQueue,
            scope: this,
            confirmation: OSS.Localize.get('Do you realy want to delete this entry?')
        });
    },
    /**
     * Выполняется при рендере панели отчетов
     */
    onPanelRender: function() {
        this.loadQueue();
    },
    /**
     * Инициализирует автоматическое обновление таблицы задач
     */
    initReloading: function() {
        Ext.create('OSS.helpers.reports.Reloading', {
            button: this.getToggleReload(),
            callback: this.loadQueue,
            reloadingStateParamName: 'reports_autoload',
            scope: this
        }).start();
    },
    /**
     * Загружает очередь
     */
    loadQueue: function() {
        this.getReportsDocumentsReportsQueueStore().load();
    },
    /**
     * Добавляет в очередь
     */
    enqueue: function() {
        var form = this.getFilter().getForm(),
            filter = form.getValues(),
            record = form.findField('doc_id').getRecord(),
            params;
        if (!record) {
            return;
        }
        params = {
            since: filter.since,
            to: filter.to,
            date: filter.date,
            period: filter.period,
            category: filter.category,
            code: filter.code,
            receipt: filter.receipt,
            upload_ext: record.get('upload_ext'),
            doc_template: record.get('doc_template'),
            document_period: record.get('document_period'),
            on_fly: record.get('on_fly'),
            doc_id: record.get('doc_id'),
            group_id: filter.group_id,
            include_group: filter.include_group,
            search_template: this.getAddvancedFilter().getValue()
        };
        ajax.request({
            url: 'documentsqueue',
            method: 'POST',
            params: params,
            success: function(result) {
                this.loadQueue();
            },
            scope: this
        });
    }
});
