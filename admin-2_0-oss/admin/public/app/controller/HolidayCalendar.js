Ext.define('OSS.controller.HolidayCalendar', {
    extend: 'Ext.app.Controller',
    views: ['HolidayCalendar'],
    init: function() {
        this.control({
            'holidayCalendar': {
                show: this.onShowMainForm,
                hide: this.onHideMainForm
            },
            'holidayCalendar > toolbar > combo' : {
                change: this.onDateChanged
            },
            'holidayCalendar > toolbar > #monthCmb' : {
                render: this.generateMonthValues
            },
            'holidayCalendar > toolbar > #yearCmb' : {
                render: this.generateYearValues
            },
            'holidayCalendar #saveBtn' : {
                click: this.saveFormData
            }
        });
    },

    showMainForm: function () {
        if (Ext.isEmpty(this.holidayCalendar)) {
            this.holidayCalendar = new Ext.widget('holidayCalendar');
        }
        this.holidayCalendar.show();
    },

    generateYearValues: function (combo) {
        for (var i = Ext.Date.format(new Date(), 'Y') - 3, off = Ext.Date.format(new Date(), 'Y'); i <= off; i++) {
            combo.store.add({
                name: i,
                id: Number(i)
            });
        }
    },

    generateMonthValues: function (combo) {
        for (var i = 0, off = 12; i < off; i++) {
            combo.store.add({
                id: i+1,
                name: i18n.get(Ext.Date.format(new Date(2000, i, 1), 'F'))
            });
        }
    },

    onShowMainForm: function (win) {
        win.down('toolbar').items.get('monthCmb').setValue( Number(Ext.Date.format(new Date(), 'm')) );
        win.down('toolbar').items.get('yearCmb').setValue( Ext.Date.format(new Date(), 'Y') );
    },

    onHideMainForm: function (win) {
        win.down('toolbar').items.get('yearCmb').setValue("");
    },

    onDateChanged: function (field) {

        var month = field.up('toolbar').items.get('monthCmb').getValue(),
            year = field.up('toolbar').items.get('yearCmb').getValue();

        if (Ext.isEmpty(year) || year == '') {
            return;
        }

        Ext.Ajax.request({
            url: 'index.php/api/holidaycalendar',
            method: 'GET',
            scope: this,
            params: {
                month: month,
                year: year
            },
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }               
                var data = response.results;
                this.buildMainFormFields(field.up('window'), data);
            },
            failure: this.failure
        });
    },

    buildMainFormFields: function (win, data) {

        var items = [];
        Ext.each(data, function(record) {
            var St = '<span style="',
                date = new Date(record.date);

            if (Ext.Date.format(date, 'n') == Ext.Date.format(this.now, 'n')) {
                St += 'font-weight: bold;';
                if (record.is_holiday == 1) {
                    St += 'color:red;';
                }
            } else {
                if (record.is_holiday == 1) {
                    St += 'color:red;';
                } else {
                    St += 'color:#a5a5a5;';
                }
            }
            St += '">';
            this.items.push({
                xtype: 'checkbox',
                boxLabel: St + Ext.Date.format(date, 'd') + '</span>',
                name: 'saveholidays[' + Ext.Date.format(date, 'Ymd') + ']',
                inputValue: '1',
                uncheckedValue: '0',
                checked: (record.is_holiday == 1) ? true : false
            });
        }, {
            items: items,
            now: new Date(
                win.down('toolbar').items.get('yearCmb').getValue(), 
                win.down('toolbar').items.get('monthCmb').getValue() - 1 , 
                '01'
            )
        });
        
        

        var form = win.down('form');
        if (!Ext.isEmpty(form.items.get('HolChkGroup'))) {
            form.remove(form.items.get('HolChkGroup'));
        }

        form.add(new Ext.form.CheckboxGroup({
            xtype: 'checkboxgroup',
            columns: 7,
            itemId: 'HolChkGroup',
            items: items
        }));

        form.doLayout();
    },


    saveFormData: function (Btn) {
        var form = Btn.up('window').down('form');
        form.submit({
            url: 'index.php/api/holidaycalendar/save',
            success: function(form, action) {
               Btn.up('window').close();
            },
            failure: this.failure,
            scope: this
        });
    }
});
