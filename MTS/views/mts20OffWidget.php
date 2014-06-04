
<script type='text/javascript'>
    $(document).ready(function(){
        $('#20off-get-btn').click(function(event){
            event.preventDefault();
            window.location.href = $('#vgr').val();
        });

        $("#20off-btn").fancybox({
        'scrolling'		: 'no',
        'titleShow'		: false,
        'onStart'       : function(){
            $('#20off-frm').show();
        },
        'onClosed'		: function() {
            $("#20off-frm").hide();
	    }
      });
    });
</script>


<a href='#20off-frm' id='20off-btn'>
  <img src="<?php echo $image; ?>">
</a>


<div id='20off-frm' style='display:none;'>
    <b>20% возвращается.</b>
	<p>Выберите договор</p>
    <?php echo CHtml::dropDownList('vgr','',$data); ?>
    <?php echo CHtml::button('Продолжить',array('id' => '20off-get-btn'));?>
</div>