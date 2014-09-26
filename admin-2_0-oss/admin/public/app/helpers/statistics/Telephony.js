Ext.define('OSS.helpers.statistics.Telephony', {
    extend: 'OSS.helpers.Statistics',
    getSummaryGridClass: function() {
        return 'OSS.view.statistics.telephony.Summary';
    },
    getSummaryFields: function() {
        return [
            'duration_out',
            'cnt_out',
            'duration_in',
            'cnt_in',
            'amount'
        ];
    },
    getGroupings: function() {
        return [{
            id: 3,
            name: i18n.get('by accounts'),
            grid: 'OSS.view.statistics.telephony.grouped.ByAccount'
        }, {
            id: 1,
            name: i18n.get('by hours'),
            grid: 'OSS.view.statistics.telephony.grouped.ByHours'
        }, {
            id: 2,
            name: i18n.get('by days'),
            grid: 'OSS.view.statistics.telephony.grouped.ByDays'
        }, {
            id: 0,
            name: i18n.get('by sessions'),
            grid: 'OSS.view.statistics.telephony.grouped.BySessions'
        }];
    },
    increaseSummaryValue: function(currency, record, field, summary) {
        if (
            field == 'cnt_out' &&
            !record.get('cnt_out') &&
            !record.get('cnt_in') &&
            record.get('direction') == 1
        ) {
            return summary[currency].cnt_out + 1;
        } else {
            if (
                field == 'cnt_in' &&
                !record.get('cnt_out') &&
                !record.get('cnt_in') &&
                !record.get('direction')
            ) {
                return summary[currency].cnt_in + 1;
            } else {
                return false;
            }
        }
    },
    isProperAgent: function(record) {
        var type = record.get('type');
        return type > 6 && type < 13;
    }
});
