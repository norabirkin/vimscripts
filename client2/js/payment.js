$(document).ready(function(){
	
	$('#wm-pay').click(function(event){
    	var wm = $('#LMI_PAYMENT_AMOUNT').val();
        if(!wm || !/\d+(\.\d+)?/.test(wm)){
        	alert('Укажите корректную сумму!');
            return false;
        }
        return true;
    });
	$('.promised-btn').click(function(event){
    	var id = $(this).attr('id');
        var wm = $('#promised_sum_' + id).val();
        if(!wm || !/\d+(\.\d+)?/.test(wm)){
        	alert('Укажите корректную сумму!');
            $('#promised_sum_' + id).focus();
            return false;
        }
        return true;
    });

    $('#visa-pay-btn').click(function(event){
    	event.preventDefault();
        var wm = $('#visa_summ').val();
        if(!wm || !/\d+(\.\d+)?/.test(wm)){
        	alert('Укажите корректную сумму!');
            $('#visa_summ').focus();
            return false;
        }
        window.location.href="https://secure.chronopay.com/index_shop.cgi?product_id="+ $('#payment-agreement').val() +"&product_price=" + wm;
        return true;
    });
    
    $("#payment-agreement").change(function(){
            if (this.agreement_arrears[$(this).val()] > 0) {
                $('.recomended_payment').addClass('has_arrears');
                $('.arrears_value').html(this.agreement_arrears[$(this).val()]);
            }
            else $('.recomended_payment').removeClass('has_arrears');
		$("#agreement-balance").html(this.agreement_balances[$(this).val()]);
		var agr=$("#payment-agreement :selected"),val=agr.val(),num=agr.html();
		$('#AgreementID').val(val);
		$(".LB_CONTRACT_NUMBER").val(num);
		$("#payment-history").html(num);
		$("#card_agrm").val(val);
		$(".LMI_PAYMENT_DESC_BASE64").val(base64($(".LMI_PAYMENT_BASE").val()+num));
		$(".payment-promised-block").hide();
		$(".input-text-promised").val("");

		$(".agreement-block-"+val).show();
		this.cur_agreement = val;
		//change history link
		hist = $("#get-history");
		if(hist.length){
		    link = hist.attr("href");
		    new_link = link.replace(/agreement=\d+&/ig, "agreement="+this.cur_agreement+"&");
		    hist.attr("href", new_link);
		}
	});
	
});