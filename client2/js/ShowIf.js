$(document).ready(function(){
    window.ShowIf = function(params) {
        var conditionField = $('#'+params.condition.id)[0],
            field = $('#'+params.id),
            row,
            name,
            me = this;
        if (!field || !conditionField) {
            throw 'No field';
        }
        name = field.attr('name');
        row = $(field).parents('tr');
        this.show = function() {
            $(field).attr('name', name);
            row.show();
        };
        this.hide = function() {
            $(field).attr('name', '');
            row.hide();
        };
        this.onChange = function() {
            if (conditionField.value == params.condition.value) {
                this.show();
            } else {
                this.hide();
            }
        }
        $(conditionField).on('change', function() {
            me.onChange();
        });
        this.onChange();
    };
});
