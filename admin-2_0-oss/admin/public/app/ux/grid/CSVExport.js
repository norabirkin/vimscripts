/*
* Класс, формирующий зыпрос экспорта CSV. 
* При добавлении в mixins грида позволяет с помощью методов exportAll и 
* exportCurrentPage запрашивает экспорт всех или текущей страницы
*/
Ext.define('OSS.ux.grid.CSVExport', {
    getExportUrl: function() { throw 'define getExportUrl method'; },
    exportAll: function() {
        OSS.Download.get({
            url: this.getExportUrl(),
            params: Ext.apply(
                {
                    alldata: 1,
                    columns: Ext.JSON.encode(this.getVisibleColumns())
                },
                this.getStore().proxy.extraParams
            )
        });
    },
    getVisibleColumns: function() {
        var i,
            fields = [],
            names = [];
        for (i = 0; i < this.columns.length; i ++) {
            if ( !this.columns[i].hidden && this.columns[i].dataIndex ) {
                fields.push(this.columns[i].dataIndex);
                names.push(this.columns[i].text);
            }
        }
        return { names: names, fields: fields };
    },
    exportCurrentPage: function() {
        OSS.Download.get({
            url: this.getExportUrl(),
            params: Ext.apply(
                {
                    limit: this.getStore().pageSize, 
                    page: this.getStore().currentPage,
                    columns: Ext.JSON.encode(this.getVisibleColumns())
                }, 
                this.getStore().proxy.extraParams
            )
        });
    }
});
