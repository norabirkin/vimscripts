Ext.define( 'OSS.ux.form.field.date.WithTime', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.datetime',
    mixins: ['Ext.form.field.Field'],
    layout: 'hbox',
    allowBlank: true,
    initComponent: function() {
        var me = this,
            value = this.value || (typeof this.defaultDate == 'function' ? this.defaultDate() : this.defaultDate),
            date = Ext.create( 'Ext.form.field.Date', {
                format: this.dateFormat,
                allowBlank: this.allowBlank,
                width: 90,
                padding: '0 10 0 0',
                value: value
            }),
            time = Ext.create('Ext.form.field.Time', {
                format: 'H:i' + (this.showSeconds ? ':s' : ''),
                maskRe: /^[0-9:]$/,
                increment: 5,
                allowBlank: this.allowBlank,
                width: this.showSeconds ? 80 : 60,
                value: value,
                listConfig: {
                    minWidth: this.showSeconds ? 80 : 60
                }
            }),
            fireChangeEvent;
        this.items = [
            date,
            time
        ];
        this.getValue = function() {
            if (!date.getValue()) {
                return '';
            }
            return this.format(date.getValue()) + ' ' + (time.getRawValue() || '00:00') + (this.showSeconds ? '' : ':00');
        };
        this.getDate = function( value ) {
            if (value instanceof Date) {
                return Ext.Date.clone(value);
            }
            if (!value) {
                value = this.getValue();
            }
            if (!value) {
                return null;
            }
            return Ext.Date.parse( value, this.fullFormat );
        };
        this.setDate = function( value ) {
            date.setValue( value );
            time.setValue( value );
        };
        fireChangeEvent = Ext.bind(function() {
            this.fireEvent(
                'change',
                this.getValue(),
                this.getDate(),
                this
            );
            this.isValid();
        }, this);
        this.isValid = function() {
            var dateValid,
                timeValid;
            dateValid = date.isValid();
            timeValid = time.isValid();
            return dateValid && timeValid;
        };
        this.setValue = function( value ) {
            this.dontHandleChangeEvent = true;
            this.setDate( this.getDate(value) );
            this.dontHandleChangeEvent = false;
            this.setTimeMinValue();
            this.setTimeMaxValue();
            fireChangeEvent();
        };
        date.on('change', function() {
            if (this.dontHandleChangeEvent) {
                return;
            }
            this.setTimeMinValue();
            this.setTimeMaxValue();
            fireChangeEvent();
        }, this);
        time.on('change', function() {
            if (this.dontHandleChangeEvent) {
                return;
            }
            fireChangeEvent();
        }, this);
        /**
         * Устанавливает минимальное значение поля времени
         */
        this.setTimeMinValue = function() {
            this.setTimeLimitValue({
                property: 'minValue',
                limitSetter: 'setMinValue'
            });
        };
        /**
         * Устанавливает максимальное значение поля времени
         */
        this.setTimeMaxValue = function() {
            this.setTimeLimitValue({
                property: 'maxValue',
                limitSetter: 'setMaxValue'
            });
        };
        /**
         * Устанавливает границу значения поля времени
         *
         * @param params.property {String} Имя свойства поля даты со временем
         * @param params.limitSetter {String} Имя метода поля времени, устанавливающего границу значения
         */
        this.setTimeLimitValue = function(params) {
            if (!this[params.property]) {
                time[params.limitSetter](null);
            } else {
                if (this.format(this.getDate()) == this.format(Ext.Date.parse(this[params.property], this.fullFormat))) {
                    /*if (this.getName() == 'time_to') {
                        console.log(params.property, this[params.property]);
                    }*/
                    time[params.limitSetter](Ext.Date.parse(this[params.property], this.fullFormat));
                } else {
                    time[params.limitSetter](null);
                }
            }
        };
        /**
         * Уствнавливает минимальное значение
         *
         * @param min {Date} минимальное значение 
         */
        this.setMinValue = function(min) {
            this.setValueLimit(min, {
                property: 'minValue',
                dateLimitSetter: 'setMinValue',
                timeLimitSetter: 'setTimeMinValue'
            });
        };
        /**
         * Уствнавливает максимальное значение
         *
         * @param max {Date} максимальное значение 
         */
        this.setMaxValue = function(max) {
            this.setValueLimit(max, {
                property: 'maxValue',
                dateLimitSetter: 'setMaxValue',
                timeLimitSetter: 'setTimeMaxValue'
            });
        };
        /**
         * Устанавливает границу значения
         *
         * @param lim {Date} граница значения
         * @param params.property {String} Имя устанавливаемого свойства поля даты со временем
         * @param params.dateLimitSetter {String} Имя метода поля даты, устанавливащего границу значения
         * @param params.timeLimitSetter {String} Имя метода поля даты со временем, устанавливающего границу значения времени
         */
        this.setValueLimit = function(lim, params) {
            var limDate = lim ? Ext.Date.format(lim, this.fullFormat) : null;
            this[params.property] = limDate;
            date[params.dateLimitSetter](lim ? Ext.Date.parse(limDate, this.fullFormat) : null);
            this[params.timeLimitSetter]();
        };
        if (this.minValue) {
            this.setMinValue(this.minValue);
        }
        if (this.maxValue) {
            this.setMaxValue(this.maxValue);
        }
        this.callParent( arguments );
    },
    /**
     * Возвращает дату по умолчанию
     *
     * @return {Date}
     */
    defaultDate: function() {
        return new Date;
    },
    dateFormat: 'Y-m-d',
    fullFormat: 'Y-m-d H:i:s',
    format: function( date ) {
        if (!(date instanceof Date)) {
            return null;
        }
        var newDate = date ? Ext.Date.clone(date) : null;
        return Ext.Date.format(newDate, this.dateFormat);
    }
});
