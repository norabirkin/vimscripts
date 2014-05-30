
<script type='text/javascript'>
    $(document).ready(function(){
        $('#bonus-get-btn').click(function(event){
            event.preventDefault();
            window.location.href = $('#tarif').val();
        });

        $("#bonus-btn").fancybox({
        'scrolling'		: 'no',
        'titleShow'		: false,
        'onStart'       : function(){
            $('#bonus-frm').show();
        },
        'onClosed'		: function() {
            $("#bonus-frm").hide();
	    }
      });
    });
</script>


<a href='#bonus-frm' id='bonus-btn'>
  <img src="<?php echo $image; ?>">
</a>


<div id='bonus-frm' style='display:none;'>
    <p>Выберите договор</p>
    <?php echo CHtml::dropDownList('tarif','',$data); ?>
    <?php echo CHtml::button('Продолжить',array('id' => 'bonus-get-btn'));?>
</div>