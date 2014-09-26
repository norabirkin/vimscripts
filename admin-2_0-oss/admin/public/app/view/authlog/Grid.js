/**
 * Таблица событий раздела "Отчеты/Журнал авторизаций"
 */
Ext.define('OSS.view.authlog.Grid', {
    extend: 'Ext.grid.Panel',
    itemId: 'rightGrid',
    region: 'center',
    columns: [{
        header: i18n.get('Date'),
        dataIndex: 'dt',
        width: 120,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('Account'),
        dataIndex: 'vg_login',
        width: 140,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('Event'),
        dataIndex: 'result',
        width: 140,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
                return i18n.get('Auth error') + ' (' + record.get('result') + ')';
            }            
            return '<span style="color:green">OK</span>';
        }
    }, {
        header: i18n.get('Comment'),
        dataIndex: 'comment',
        flex: 1,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('IP NAS'),
        dataIndex: 'nas_ip',
        width: 110,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('Session ID'),
        dataIndex: 'session_id',
        width: 110,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('Duration'),
        dataIndex: 'duration',
        width: 100,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            if (Ext.isEmpty(value) || !Ext.isDefined(value)) {
                value = 0;
            }
            var sprintf = function(A){
                if (A < 10) {
                    return new String('0' + A);
                };
                return new String(A);
            };
            var h = (value - (value % 3600)) / 3600;
            v = value - (h * 3600);
            var m = (v - (v % 60)) / 60;
            var s = v - m * 60;
            return (sprintf(h) + ':' + sprintf(m) + ':' + sprintf(s));
        }
    }, {
        header: i18n.get('IP address'),
        dataIndex: 'ip',
        width: 110,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }, {
        header: i18n.get('MAC address'),
        dataIndex: 'mac',
        width: 110,
        renderer: function(value, meta, record){
            if(record.get('result') > 0) {
                meta.tdCls += ' x-type-payment-canceled';
            }            
            return value;
        }
    }],
    store: 'authlog.Data',
    bbar: {
        xtype: 'pagingtoolbar',
        store: 'authlog.Data'
    }
});
