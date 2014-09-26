Ext.define('OSS.helpers.statistics.Dialup', {
    extend: 'OSS.helpers.Statistics',
    getSummaryGridClass: function() {
        return 'OSS.view.statistics.traffic.Summary';
    },
    getSummaryFields: function() {
        return [
            'volume_in',
            'volume_out',
            'volume',
            'amount'
        ];
    },
    getGroupings: function() {
        return [{
            id: 0,
            name: i18n.get('by accounts'),
            grid: 'OSS.view.statistics.traffic.grouped.ByAccount'
        }, {
            id: 1,
            name: i18n.get('by hours'),
            grid: 'OSS.view.statistics.traffic.grouped.ByHours'
        }, {
            id: 2,
            name: i18n.get('by days'),
            grid: 'OSS.view.statistics.traffic.grouped.ByDays'
        }, {
            id: 3,
            name: i18n.get('by sessions'),
            grid: 'OSS.view.statistics.traffic.grouped.BySessions'
        }, {
            id: 4,
            name: i18n.get('by categories'),
            grid: 'OSS.view.statistics.traffic.grouped.ByCategories'
        }];
    },
    isProperAgent: function(record) {
        return record.get('type') == 6;
    }
});
