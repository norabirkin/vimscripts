function edit_form(id,data,route,html) {
    var me = this;
    this.id = id;
    this.html = html;
    this.initialized = false;
    this.data = data;
    this.route = route;
    this.open_button = $('#popup-edit-form-link-'+id);
    this.value_container = $('#editable-value-'+id);
    this.init = function () {
        if ($.edit_form_container_built != undefined) $('#edit-form-wrapper').html(this.html);
        else {
            $('body').append('<div id="edit-form-wrapper">'+this.html+'</div>');
            $.edit_form_container_built = true;
        }
        if (id != 'phone') $('.plus_seven').hide();
        var offset = this.open_button.offset();
        $('#edit-form-wrapper').css({'top':offset.top,'left':offset.left});
        this.close_button = $('#edit-form-popup-close-'+id);
        this.popup = $('#popup-edit-form-'+id);
        this.input = $('#edit-form-input-'+id)[0];
        this.submit_button = $('#edit-form-button-'+id);
        this.popup.hidden = true;
        this.input.value = this.value_container.text();
        this.submit_button.click(function(){
            me.data.value = me.input.value;
            $.post(me.route,me.data,function(response){
                if (response.error != undefined) { 
                    if ( response.error == false) {
                        if (me.value_container[0] != undefined) me.value_container.html(response.value);
                    } else {
                        for (var i = 0; i < response.error.length; i++) {
                            alert(response.error[i].detail);
                        }
                    }
                }
                me.destroy();
            },'json');
        });
        this.close_button.click(function(){
            me.destroy();
            return false;
        });
        this.initialized = true;
    }
    this.destroy = function() {
        if (this.initialized) {
            $('#edit-form-wrapper').html('');
            this.initialized = false;
        }
    }
    this.open_button.click(function(){
        if (!this.initialized) {
            me.init();
        }
        return false;
    });
    
}