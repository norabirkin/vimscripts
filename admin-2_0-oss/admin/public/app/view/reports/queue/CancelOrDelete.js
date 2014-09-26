/**
 * Колонка кнопки <Отменить> или <Удалить>
 */
Ext.define('OSS.view.reports.queue.CancelOrDelete', {
    extend: 'Ext.grid.column.Action',
    alias: 'widget.queuecancel',
    width: 20,
    getTip: function() {
        var record = arguments[2];
        return this.getParams(record).tooltip +
            this.hasRights(record) ?
            '' :
            (' ' + i18n.get('Not enough rights'));
    },
    getClass: function() {
        var record = arguments[2];
        return 'x-ibtn-def' +
            (
                this.hasRights(record) ?
                '' :
                '-dis'
            ) +
            ' ' + 
            this.getParams(record).iconCls;
    },
    handler: function(grid, rowIndex) {
        var record = grid.getStore().getAt(rowIndex);
        this.getParams(record).handler(record);
    },
    hasRights: function(record) {
        return record.get('person_id') === 0;
    },
    /**
     * Возвращает свойства колонки
     */
    getParams: function(record) {
        return record.get('status') == Ext.app.Application.instance.getController(
            'Reports'
        ).STATUS_LOADING ?
             {
                 iconCls: 'x-ibtn-remove',
                 tooltip: i18n.get('Cancel'),
                 handler: Ext.bind(
                     Ext.app.Application.instance.getController('Reports').cancel,
                     Ext.app.Application.instance.getController('Reports')
                 )
             } :
             {
                 iconCls: 'x-ibtn-delete',
                 tooltip: i18n.get('Delete'),
                 handler: Ext.bind(
                     Ext.app.Application.instance.getController('Reports').remove,
                     Ext.app.Application.instance.getController('Reports')
                 )
             };
    }
});
