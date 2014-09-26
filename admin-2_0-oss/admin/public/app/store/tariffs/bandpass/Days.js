/**
 * Хранилище дней недели
 */
Ext.define('OSS.store.tariffs.bandpass.Days', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'descr',
        type: 'string'
    }],
    data: [{
        name: 'mon',
        descr: i18n.get('Mon')
    }, {
        name: 'tue',
        descr: i18n.get('Tue')
    }, {
        name: 'wed',
        descr: i18n.get('Wed')
    }, {
        name: 'thu',
        descr: i18n.get('Thu')
    }, {
        name: 'fri',
        descr: i18n.get('Fri')
    }, {
        name: 'sat',
        descr: i18n.get('Sat')
    }, {
        name: 'sun',
        descr: i18n.get('Sun')
    }]
});
