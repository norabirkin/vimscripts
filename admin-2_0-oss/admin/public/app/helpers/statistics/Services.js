Ext.define('OSS.helpers.statistics.Services', {
    extend: 'OSS.helpers.Statistics',
    getSummaryFields: function() {
        return ['amount'];
    },
    getSummaryGridClass: function() {
        return 'OSS.view.statistics.services.Summary';
    },
    getGroupings: function() {
        return [{
            id: 3,
            name: i18n.get('by accounts'),
            grid: 'OSS.view.statistics.services.grouped.ByAccount'
        }, {
            id: 1,
            name: i18n.get('by days'),
            grid: 'OSS.view.statistics.services.grouped.ByDays'
        }, {
            id: 2,
            name: i18n.get('by services'),
            grid: 'OSS.view.statistics.services.grouped.ByServices'
        }];
    },
    isProperAgent: function(record) {
        return record.get('type') == 13;
    }
});
