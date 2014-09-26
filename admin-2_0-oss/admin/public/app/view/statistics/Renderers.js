Ext.define('OSS.view.statistics.Renderers', {
    /**
     * Форматирует дату используя определенный шаблон
     *
     * @param value {Date} дата
     * @param tpl {String} шаблон
     */
    dateHighlight: function(value, tpl) {
       var data = {
            Y: Ext.Date.format(value, 'Y'),
            m: Ext.Date.format(value, 'm'),
            d: Ext.Date.format(value, 'd'),
            H: Ext.Date.format(value, 'H'),
            i: Ext.Date.format(value, 'i'),
            s: Ext.Date.format(value, 's')
        };
        return new Ext.XTemplate(tpl).apply(data)
    },
    /**
     * @property {String} шаблон для визуализации колонки даты с выделением дней красным цветом
     */
    daysHighlightTpl: '<span style="color:red;">{d}</span>.{m}.{Y}',
    /**
     * @property {String} шаблон для визуализации колонки даты с выделением часов красным цветом
     */
    hoursHighlightTpl: '{Y}.{m}.{d} <span style="color:red;">{H}</span>:{i}:{s}',
    /**
     * Визуализует данные для колонки даты, выделяя красным часы
     *
     * @param value {Date} дата
     * @return {String}
     */
    hoursHighlight: function( value ) {
        return this.dateHighlight(value, this.hoursHighlightTpl);
    },
    /**
     * Визуализует данные для колонки даты, выделяя красным дни
     *
     * @param value {Date} дата
     * @return {String}
     */
    daysHighlight: function( value ) {
        return this.dateHighlight(value, this.daysHighlightTpl);
    },
    /**
     * Визуализует данные для колонки длительности
     *
     * @param value {Integer} длительность
     * @return {String}
     */
    durationRenerer: function( v ) {
        var sprintf = function(v){ return (v < 10) ? ('0' + v) : v; };
        var h = (v - (v % 3600)) / 3600;
        v = v - (h * 3600);
        var m = (v - (v % 60)) / 60;
        var s = v - m * 60;
        return sprintf(h) + ':' + sprintf(m) + ':' + sprintf(s);
    },
    /**
     * Визуализует данные для колонки описания тарифа или категории
     *
     * @param value {String} описание
     * @return {String}
     */
    descrRenderer: function( value ) {
        return (value == '') ? OSS.Localize.get('Undefined') : value;
    },
    /**
     * Визуализует данные для колонки даты
     *
     * @param value {Integer} дата
     * @return {String}
     */
    dateRenderer: function( value ) {
        if (Ext.Date.format(value, 'Y') < 1900) {
            return '-';
        } else {
            return Ext.Date.format( value, 'd.m.Y H:i' );
        }
    },
    /**
     * Визуализует данные для колонки периода
     *
     * @param value {Integer} дата
     * @return {String}
     */
    periodRenderer: function(value) {
        return Ext.Date.format(value, 'Y-m-d');
    },
    /**
     * Визуализует данные для колонок длительности исходящих
     *
     * @param value {Integer} длительность
     * @param record {Ext.data.Model} запись таблицы статистики
     * @param field {String} имя поля длительности
     * @return {String}
     */
    durationInRenderer: function( value, record, field ) {
        if (this.isDetailsMode()) {
            if (record.get('direction') == 0) {
                return this.durationRenerer(value);
            } else {
                return this.durationRenerer(record.get(field));
            }
        } else {
            return this.durationRenerer(record.get(field));
        }
    },
    /**
     * Визуализует данные для колонки округленной длительности исходящих
     *
     * @param value {Integer} длительность
     * @param meta {Object} свойства колонки
     * @param record {Ext.data.Model} запись таблицы статистики
     * @return {String}
     */
    durationInRoundRenderer: function( value, meta, record ) {
        return this.durationInRenderer( value, record, 'duration_out' );
    },
    /**
     * Визуализует данные для колонки неокругленной длительности исходящих
     *
     * @param value {Integer} длительность
     * @param meta {Object} свойства колонки
     * @param record {Ext.data.Model} запись таблицы статистики
     * @return {String}
     */
    durationInRawRenderer: function( value, meta, record ) {
        return this.durationInRenderer( value, record, 'duration_out' );
    },
    /**
     * Визуализует данные для колонки суммы
     *
     * @param value {Float} сумма
     * @param meta {Object} свойства колонки
     * @param record {Ext.data.Model} запись таблицы статистики
     * @return {String}
     */
    sumRenderer: function( value, meta, record ) {
        return Ext.Number.toFixed(value, 2) + ' (' + record.get('curr_symbol') + ')';
    },
    /**
     * Визуализует данные для колонки имени пользователя
     *
     * @param value {String} имя пользователя
     * @param meta {Object} свойства колонки
     * @param record {Ext.data.Model} запись таблицы статистики
     * @return {String}
     */
    userNameRenderer: function( value, meta, record ) {
        if (record.get('vg_id') > 0) {
            return value;
        } else {
            return '-';
        }
    },
    /**
     * Визуализует данные для колонки логина учетной записи
     *
     * @param value {String} логин учетной записи
     * @param meta {Object} свойства колонки
     * @param record {Ext.data.Model} запись таблицы статистики
     * @return {String}
     */
    vgroupLoginRenderer: function ( value, meta, record ) {
        if (record.get('vg_id') > 0) {
            return '<span ext:qtip="' + Ext.util.Format.htmlEncode(record.get('user_name')) + '">' + value + '</span>';
        } else {
            return '-';
        }
    }
});
