/**
 * Вкладка направлений телефонии
 */
Ext.define('OSS.view.tariffs.form.categories.tabs.directions.Tel', {
    extend: 'OSS.view.tariffs.form.categories.tabs.Directions',
    tartypes: [3,4],
    common: {
        columns: [
            {
                header: i18n.get( "Description" ),
                dataIndex: 'descr',
                flex: 1
            },
            {
                header: i18n.get("Number"),
                dataIndex: 'zone_num'
            },
            {
                header: i18n.get("Zone class"),
                dataIndex: 'class', 
                width: 125,
                renderer: function(value) {
                    var store = Ext.app.Application.instance.getController('Catalogs').
                                getCatalogZonesClassesStore(),
                        index  = store.
                                 findExact('id', value);
                    if (index < 0) {
                        return value;
                    }
                    return store.getAt(index).get('name');
                }
            }
        ]
    }
});
