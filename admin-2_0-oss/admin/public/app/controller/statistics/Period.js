/**
 * Контроллер управляющий установкой временного периода просмотра статистики
 */
Ext.define('OSS.controller.statistics.Period', {
    extend: 'Ext.app.Controller',
    refs: [{
        selector: 'statistics > #filter > #basic > container[name=date_to]',
        ref: 'to'
    }, {
        selector: 'statistics > #filter > #basic > container[name=date_from]',
        ref: 'from'
    }, {
        selector: 'statistics > #filter > #basic > #hold',
        ref: 'hold'
    }],
    init: function() {
        this.control({
            'statistics': {
                afterrender: this.today
            },
            'statistics > #filter > #basic > #wrap > #today': {
                click: this.today
            },
            'statistics > #filter > #basic > #wrap > #period': {
                change: this.onIntervalChanged
            },
            'statistics > #filter > #basic > #wrap > #backward': {
                click: this.moveBackward
            },
            'statistics > #filter > #basic > #wrap > #forward': {
                click: this.moveForward
            },
            'statistics > #filter > #basic > #hold': {
                change: this.onHoldChanged
            }
        });
        this.initPeriodOptions();
    }, 
    /**
     * @property {Integer} Значение опции <Месяц> комбобокса периодов
     */
    MONTH: 0,
    /**
     * @property {Integer} Значение опции <День> комбобокса периодов
     */
    DAY: 1,
    /**
     * @property {Integer} Значение опции <Неделя> комбобокса периодов
     */
    WEEK: 2,
    /**
     * @property {Integer} Значение опции <Час> комбобокса периодов
     */
    HOUR: 3,
    /**
     * Устанавливает временной период в тулбаре поиска статистики
     * в зависимости от выбранного значения комбобокса периодов
     *
     * @param combo {Ext.form.field.ComboBox}
     * @param value {Integer}
     */
    onIntervalChanged: function( combo, value ) {
        this.interval = value;
        this.getIntervalOptions().setPeriod();
    },
    /**
     * Устанавливает временной период в тулбаре поиска для получения
     * статистики за месяц
     */
    setMonthPeriod: function() {
        var to = this.getTo().getDate();
        if (this.getHold().getValue()) {
            to.setDate(1);
            this.getTo().setDate( to );
        }
        this.getFrom().setDate( Ext.Date.add(to, Ext.Date.MONTH, -1) );
        if (this.getHold().getValue()) {
            this.clearTime();
        }
    },
    /**
     * Устанавливает временной период в тулбаре поиска для получения
     * статистики за час
     */
    setHourPeriod: function() {
        var to = this.getTo().getDate();
        if ( this.getHold().getValue() ) {
            to.setMinutes(0); 
            this.getTo().setDate( to );
        }
        this.getFrom().setDate( Ext.Date.add(to, Ext.Date.HOUR, -1) );
    },
    /**
     * Устанавливает временной период в тулбаре поиска для получения
     * статистики за день
     *
     * @param [days=1] {Integer} количество дней
     */
    setDayPeriod: function( days ) {
        if (!days) {
            days = 1;
        }
        this.getFrom().setDate( Ext.Date.add(this.getTo().getDate(), Ext.Date.DAY, (-1 * days)) );
        if (this.getHold().getValue()) {
            this.clearTime();
        }
    },
    /**
     * Устанавливает временной период в тулбаре поиска для получения
     * статистики за неделю
     */
    setWeekPeriod: function() {
        this.setDayPeriod( 7 );
    },
    /**
     * Сдвигает вперед временной период в тулбаре поиска
     */
    moveForward: function() {
        this.movePeriod();
    },
    /**
     * Сдвигает назад временной период в тулбаре поиска
     */
    moveBackward: function() {
        this.movePeriod(1);
    },
    /**
     * Сдвигает временной период в тулбаре поиска
     *
     * @param [direction=1]
     * направление сдвига. значение 1 соответствует
     * сдвигу вперед, значение -1 соответствует сдвигу назад
     */
    movePeriod: function( direction ) {
        var options = this.getIntervalOptions(),
            from = this.getFrom().getDate(),
            to = this.getTo().getDate();
        if (!options) {
            return;
        }
        if (!direction) {
            direction = 1;
        } else {
            direction = -1;
        }
        this.getFrom().setDate( Ext.Date.add(from, options.interval, options.value * direction) );
        this.getTo().setDate( Ext.Date.add(to, options.interval, options.value * direction) );
        if (this.getHold().getValue()) {
            this.clearTime();
        }
    },
    /**
     * Привязывает временной период в тулбаре поиска к сегодняшней дате
     */
    today: function() {
        if (this.getHold().getValue()) {
            this.nextDateTo();
        } else {
            this.getTo().setDate( new Date );
        }
        this.getIntervalOptions().setPeriod();
        this.clearTime();
    },
    /**
     * Сдвигает вперед конечную границу временного перода в тулбаре поиска на интервал, 
     * соответствующий выбранному элементу в комбобоксе периодов
     */
    nextDateTo: function() {
        this.getTo().setDate( Ext.Date.add(new Date, this.getIntervalOptions().interval, 1) );
    },
    /**
     * Инициализирует массив параметров, определяющий логику действия комбобокса периодов
     * Элементы массива имеют следующие параметры:
     *
     * @param interval {String} интервал сдвига временного периода
     * @param value {Integer} количество интервалов сдвига временного периода
     * @param setPeriod {Function} функция устанавливающая временной период, соответствующий выбранному элементу комбобокса периодов
     */
    initPeriodOptions: function() {
        this.interval = this.DAY;
        this.periodOptions = [];
        this.periodOptions[ this.MONTH ] = {
            interval: Ext.Date.MONTH,
            value: 1,
            setPeriod: Ext.bind( this.setMonthPeriod, this )
        };
        this.periodOptions[ this.WEEK ] = {
            interval: Ext.Date.DAY,
            value: 7,
            setPeriod: Ext.bind( this.setWeekPeriod, this )
        };
        this.periodOptions[ this.DAY ] = {
            interval: Ext.Date.DAY,
            value: 1,
            setPeriod: Ext.bind( this.setDayPeriod, this )
        };
        this.periodOptions[ this.HOUR ] = {
            interval: Ext.Date.HOUR,
            value: 1,
            setPeriod: Ext.bind( this.setHourPeriod, this )
        };
    },
    /**
     * Возвращает параметры, определяющие логику действия комбобокса периодов
     *
     * @return {Object}
     */
    getIntervalOptions: function() {
        return this.periodOptions[this.interval];
    },
    /**
     * Вызывается при изменении значения чекбокса <Удерживать начало границы>
     *
     * @param checkbox {Ext.form.field.Checkbox} чекбокс
     * @param value {Boolean} значение чекбокса
     */
    onHoldChanged: function( checkbox, value ) {
        if (value) {
            this.clearTime();
        }
    },
    /**
     * Обнуляет время во временном периоде в тулбаре поиска
     */
    clearTime: function() {
        var from = this.getFrom().getDate();
        var to = this.getTo().getDate();
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        this.getFrom().setDate( from );
        this.getTo().setDate( to );
    }
});
