/**
 * Колонка дней недели для гридов "Скидки по времени" и "В зависимости от дня и времени" раздела тарифов
 */
Ext.define('OSS.view.tariffs.form.column.WeekDays', {
    extend: 'Ext.grid.column.Column',
    header: i18n.get('Week days'), 
    dataIndex: 'inline',
    flex: 1,
    initComponent: function() {
        this.editor = Ext.create('OSS.view.tariffs.form.bandpass.time.Week');
        this.callParent(arguments);
    },
    renderer: function(value) {
        var i,
            days,
            str = [],
            findDay = function(day) {
                var store = Ext.app.Application.instance.
                            getController(
                                'Tariffs'
                            ).getTariffsBandpassDaysStore(),
                    index = store.findExact('name', day);
                if (index == -1) {
                    throw 'Invalid string';
                }
                return store.getAt(index).get('descr');
            };
        if (!value) {
            return '';
        }
        days = value.split(',');
        for (i = 0; i < days.length; i ++) {
            str.push(findDay(days[i]));
        }
        return str.join(',');
    }
});
