/**
 * Колонка, которая может содержать кнопку сохранения документа или информацию об ошибке
 */
Ext.define('OSS.view.reports.queue.ErrorOrSave', {
    extend: 'Ext.grid.column.Action',
    alias: 'widget.queueerror',
    width: 20,
    getTip: function() {
        return this.getParams(arguments[2]).tooltip;
    },
    getClass: function() {
        return this.getParams(arguments[2]).iconCls;
    },
    handler: function(grid, rowIndex) {
        var record = grid.getStore().getAt(rowIndex),
            handler = this.getParams(record).handler;
        if (handler) {
            handler(record);
        }
    },
    getParams: function(record) {
        var dis,
            handler = null;
        if (record.get('status') == Ext.app.Application.instance.getController('Reports').STATUS_DONE) {
            dis = '';
            handler = Ext.bind(
                Ext.app.Application.instance.getController('Reports').save,
                Ext.app.Application.instance.getController('Reports')
            );
        } else {
            dis = '-dis';
        }
        return record.get('status') == Ext.app.Application.instance.getController('Reports').STATUS_ERROR ?
            {
                tooltip: Ext.String.htmlEncode(record.get('message')),
                iconCls: 'x-ibtn-info'
            }:
            {
                tooltip: i18n.get('Save report'),
                iconCls: 'x-ibtn-def'+dis+' x-ibtn-save',
                handler: handler
            };
    }
});
