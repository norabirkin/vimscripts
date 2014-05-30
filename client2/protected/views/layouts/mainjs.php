<script type="text/javascript">
	var base64 = function (string){
		var b64="",c,n,k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		for (n=0; n<string.length; n++) {
			c = string.charCodeAt(n);
			if (c < 128) {
				b64 += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				b64 += String.fromCharCode((c >> 6) | 192);
				b64 += String.fromCharCode((c & 63) | 128);
			} else {
				b64 += String.fromCharCode((c >> 12) | 224);
				b64 += String.fromCharCode(((c >> 6) & 63) | 128);
				b64 += String.fromCharCode((c & 63) | 128);
			}
		}
		string=b64;
		b64='';
		var chr1,chr2,chr3,enc1,enc2,enc3,enc4,i=0;
		while (i < string.length) {
			chr1 = string.charCodeAt(i++);
			chr2 = string.charCodeAt(i++);
			chr3 = string.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			b64 += k.charAt(enc1) + k.charAt(enc2) + k.charAt(enc3) + k.charAt(enc4);
		}
		return b64;
	};

	function setDateRange(range1,range2,el) {
		$('#input-date-from').datepicker('setDate', range1);
		$('#input-date-to').datepicker('setDate', range2);
		$('.form-dates a').removeClass('active');
		$(el).addClass('active');
		return false;
	}

$(document).ready(function() {
    var submit_btn = $("#lbantivirus_confirm_submit");
    var checkbox = $("#lbantivirus_confirm_agreecheckbox");
    var shouldBeDisabled = false;
    submit_btn.click(function() {
			if (shouldBeDisabled && !submit_btn[0].disabled) {
                submit_btn[0].disabled = true;
                submit_btn.addClass( "disabled" );
            }
            shouldBeDisabled = true;
    });
	checkbox.change(function() {
		if (!checkbox[0].checked) {
			submit_btn[0].disabled = true;
			submit_btn.addClass( "disabled" );
		}
		else {
			submit_btn[0].disabled = false;
			submit_btn.removeClass( "disabled" );
		}
	});
	
        $('.other-cards-link').click(function(){
            $('#other_cards_block').show();
            $('.other-cards-link').hide();
            return false;
        });
        
	/* Darkbox widh additional call for calendar*/
	$(".popup-tariff-change").fancybox({
	'onComplete': function() {
		$("#fancybox-wrap .input-date").datepicker( );
		var dates = $( "#fancybox-wrap .input-date-from, #fancybox-wrap .input-date-to" ).datepicker({
			defaultDate: "+1D",
			minDate: "+1D",
			//changeMonth: true,
			numberOfMonths: 2,
			onSelect: function( selectedDate ) {
				var option = $(this).hasClass("input-date-from") ? "minDate" : "maxDate",
					instance = $( this ).data( "datepicker" ),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat ||
						$.datepicker._defaults.dateFormat,
						selectedDate, instance.settings );
				dates.not( this ).datepicker( "option", option, date );
			}
		});
		$("#fancybox-wrap .input-cancel").click(function(){
			$.fancybox.close();
		});
	}
	});

	/* Open and close dropdown */
	$(".actions-wrap > a").click(function(){
		if($(this).parent().hasClass("active") == false) {
			$(".actions-wrap.active").removeClass("active");
			$(this).parent().addClass("active");
		} else {
			$(".actions-wrap.active").removeClass("active");
		}
		return false;
	});
	/* Close dropdowns */
	$("body").click(function(event){
		$(".actions-wrap.active").removeClass("active");
	});
	/* Prevent closing dropdowns when clicked on its content */
	$(".actions-list").click(function(event){
		//return false;
	});

	/* Select payment form */
	$('.payment-list-titles dt').click(function(){
		$('.payment-list-titles dt').removeClass('selected');
		$('.payment-list-titles dd').removeClass('selected');
	/* list of allowed actions for payment form */
		var actions = {
			'pm': '<?php echo yii::app()->params['paymaster']['merchant_url']; ?>',
			'wm':'<?php echo yii::app()->params['webmoney']['merchant_url']; ?>',
			'pr':'<?php echo $this->createUrl('payment/index',array("action"=>"promised"));?>',
			'in':'<?php echo $this->createUrl('payment/index',array("action"=>"internal"));?>',
			'cd':'<?php echo $this->createUrl('payment/index',array("action"=>"card"));?>'
		}, cl = $(this).attr('class').replace(/\s?emphasized\s?/,'');
		$('#payform').attr('action',actions[cl]);
		//alert(actions[cl] + ' ' + cl);
		$('#paytype').val(cl);
		$(this).addClass('selected');
		$(this).next().addClass('selected');
	});

	/* Select account settings section */
	$('.account-list-titles li').click(function(){
		$('.account-list-titles li').removeClass('selected');
		$('.account-list-fields li').removeClass('selected');
		$(this).addClass('selected');
		$('.account-list-fields li').eq($(this).index()).addClass('selected');
	});

	/* Toggle support blocks */
	$(".support-toggle").click(function(event){
		if($(this).parent().hasClass("active") == false) {
			$(".support-thread").removeClass("active");
			$(this).parent().addClass("active");
		} else {
			$(".support-thread").removeClass("active");
		}
		return false;
	});
	$(".support-new-message").click(function(event){
		$(".support-new-message-form").toggleClass('active');
		return false;
	});
	$(".support-old-messages").click(function(event){
		$(".support-old-messages-wrap").toggleClass('active');
		return false;
	});

	/*setTimeout(function () {
		if ($(".page-message").hasClass('active')) {
			$(".page-message").removeClass('active');
		}
	}, 5000);*/

	// Dates range changes


	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
    };
	$.datepicker.setDefaults($.datepicker.regional['ru']);
    $(".input-date").datepicker();
    var dates = $( ".input-date-from, .input-date-to" ).datepicker({
		changeMonth: true,
		//numberOfMonths: 1,
		onSelect: function( selectedDate ) {
			//$(".content").addClass("loading");
			$('.form-dates a').removeClass('active');
			var option = $(this).hasClass("input-date-from") ? "minDate" : "maxDate",
				instance = $( this ).data( "datepicker" ),
				date = $.datepicker.parseDate(
					instance.settings.dateFormat ||
					$.datepicker._defaults.dateFormat,
					selectedDate, instance.settings );
			dates.not( this ).datepicker( "option", option, date );
		}
	});
	if(!$(".input-date-from").val()) {
		$(".input-date-from").datepicker("setDate", '<?php echo date('d.m.Y', strtotime('-7 days')); ?>');
	}
	if(!$(".input-date-to").val()) {
		$(".input-date-to").datepicker("setDate", '<?php echo date('d.m.Y'); ?>');
	}
});
</script>
