$(document).ready(function(){
    window.MonthField = function(params) {
        var year,
            month,
            text,
            form,
            hidden,
            me = this;
        this.value = params.value.split('-');
        text = $('#'+params.id+'_text')[0];
        form = $(text).parents('form')[0];
        $(form).append('<input type="hidden" id="'+params.id+'" name="'+params.name+'">');
        hidden = $('#'+params.id)[0];
        $('#month_field_next_'+params.id).click(function() {
            me.next();
            me.refreshField();
        });
        $('#month_field_prev_'+params.id).click(function() {
            me.prev();
            me.refreshField();
        });
        this.prev = function() {
            var month = parseInt(this.value[1]),
                year = parseInt(this.value[0]);
            if (month == 1) {
                month = 12;
                year = year - 1;
            } else {
                month = month - 1;
            }
            this.setYearAndMonth(year, month);
        };
        this.next = function() {
            var month = parseInt(this.value[1]),
                year = parseInt(this.value[0]);
            if (month == 12) {
                month = 1;
                year = year + 1;
            } else {
                month = month + 1;
            }
            this.setYearAndMonth(year, month);
        };
        this.setYearAndMonth = function(year, month) {
            this.value[0] = year + '';
            this.value[1] = (month < 10 ? '0' : '') + month;
        };
        this.setText = function() {
            text.value = params.dictionary[this.value[1]] + ' ' + this.value[0];
        };
        this.setValue = function() {
            hidden.value = this.value.join('-');
        };
        this.refreshField = function() {
            this.setText();
            this.setValue();
        };
        this.refreshField();
    };
});
