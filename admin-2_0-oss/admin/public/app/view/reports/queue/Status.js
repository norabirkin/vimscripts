/**
 * Колонка статуса выполнения генерации документа
 */
Ext.define('OSS.view.reports.queue.Status', {
    extend: 'Ext.grid.column.Column',
    header: i18n.get('Status'),
    alias: 'widget.queuestatus',
    dataIndex: 'percent', 
    width:132,
    /**
     * Отображает значение колонки
     */
    defaultRenderer: function(percent, meta, record) {
        switch (record.get('status')) {
            case Ext.app.Application.instance.getController('Reports').STATUS_DONE:
                return this.progress(100000);
            case Ext.app.Application.instance.getController('Reports').STATUS_LOADING:
                return this.progress(percent);
            case Ext.app.Application.instance.getController('Reports').STATUS_CANCELED:
                return i18n.get('Canceled');
            case Ext.app.Application.instance.getController('Reports').STATUS_ERROR:
                meta.style = 'color:red;';
                return i18n.get('Error');
        }
    },
    /**
     * Возвращает индикатор прогресса
     */
    progress: function(percent) {
        return new Ext.XTemplate([
            '<div ',
                'style="',
                    'border: solid 1px #c0c0c0;',
                    'background-color: #ffffff;',
                    'width: 120px;',
                    'height: 10px;',
                '" ',
                'title="{percent}%"',
            '>',
                '<div ',
                    'style="',
                        'background-color: #9DC293;',
                        'width: {percent}%;',
                        'height: 100%;',
                    '"',
                '>',
                '</div>',
            '</div>'
        ]).apply({
            percent: percent / 1000
        });
    }
});
