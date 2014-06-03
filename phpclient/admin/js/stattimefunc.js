var start_zero=0;

function aon_checked()
{
   if(document.forms[1].aon_on_off.checked == true)
   {
      document.forms[1].aon_pass.disabled = false;
      document.forms[1].aon_on_off_1.value = 1;
   }
   else
   {
      document.forms[1].aon_pass.disabled = true;
      document.forms[1].aon_on_off_1.value = 0;
   }
}

function activate_zero(formname)
{
    if(document.forms[1].start_from_zero.checked == false)
    {
    	  start_zero = 0;
    }
    else
    {
    	  start_zero = 1;
    	  set_fixed_universal_seconds(4, formname);
    }	
}

function set_fixed_universal_seconds(mode,formname)
{
var today = new Date();

    if(document.forms[0].devision.value == 104)
    {
	if(document.forms[1].start_from_zero.checked == false)
	{
		start_zero = 0;
	}
	else
	{
		start_zero = 1;
	}
    }
    
        if (mode == 4)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        if(start_zero)
        {
        	rd = '01';
        }
        else
        {
        	rd = today.getDate();
        }
        if(start_zero)
        {
        	rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        	rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        	rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }

        formname.t_year.value = ry;
        formname.t_month.value = convertToMonth(rm);
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;
        formname.t_secund.value = rs;

        cseconds = cseconds/1000 - 2592000;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        if(start_zero)
        {
        	if(rm > 1) rm = rm-1;
                else rm = 12;
        }
        else
        {
        	rm = today.getMonth()+1;
        }	
        
        if(start_zero)
        {
        	rd = '01';
        }
        else
        {
        	rd = today.getDate();
        }
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
        
        
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.value = convertToMonth(rm);
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 3)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
        
        
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.value = convertToMonth(rm);
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 604800;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.value = convertToMonth(rm);
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 2)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.value = convertToMonth(rm);
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.value = convertToMonth(rm);
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 1)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        	rh = today.getHours();
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.value = convertToMonth(rm);
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        	rh = today.getHours();
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.value = convertToMonth(rm);
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;
        }

        formname.t_month.disabled = false;
        formname.t_day.disabled = false;
        formname.t_hour.disabled = false;
        formname.t_minute.disabled = false;
        formname.t_secund.disabled = false;


        formname.month.disabled = false;
        formname.day.disabled = false;
        formname.hour.disabled = false;
        formname.minute.disabled = false;
        formname.secund.disabled = false;


}

function set_fixed_universal_seconds_new(mode,formname)
{
var today = new Date();

    if(document.forms[0].devision.value == 104)
    {
	if(document.forms[1].start_from_zero.checked == false)
	{
		start_zero = 0;
	}
	else
	{
		start_zero = 1;
	}
    }
    
        if (mode == 4)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        if(start_zero)
        {
        	rd = 1;
        }
        else
        {
        	rd = today.getDate();
        }
        if(start_zero)
        {
        	rh = 1;
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        	rmm =  1;
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        	rs = 1;
        }
        else
        {
        	rs = today.getSeconds();
        }

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;
        formname.t_secund.value = rs;

        cseconds = cseconds/1000 - 2592000;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        if(start_zero)
        {
        	rm = rm-1;
        }
        else
        {
        	rm = today.getMonth()+1;
        }	
        
        if(start_zero)
        {
        	rd = '01';
        }
        else
        {
        	rd = today.getDate();
        }
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
        
        
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 3)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
        
        
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 604800;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 2)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        if(start_zero)
        {
        rh = '00';
        }
        else
        {
        	rh = today.getHours();
        }
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;

        }
        else if(mode == 1)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        	rh = today.getHours();
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.t_secund.value = rs;

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.value = rd;
        formname.t_hour.value = rh;
        formname.t_minute.value = rmm;

        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        	rh = today.getHours();
        if(start_zero)
        {
        rmm =  '00';
        }
        else
        {
        	rmm =  today.getMinutes();
        }
        if(start_zero)
        {
        rs = '00';
        }
        else
        {
        	rs = today.getSeconds();
        }
         formname.secund.value = rs;

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.value = rd;
        formname.hour.value = rh;
        formname.minute.value = rmm;
        }
}

function convertToMonth(mode)
{
   var month_name = new String();
   if(mode == 1)
      month_name = JANUARY;
   else if(mode == 2)
      month_name = FEBRUARY;
   else if(mode == 3)
      month_name = MARCH;
   else if(mode == 4)
      month_name = APRIL;
   else if(mode == 5)
      month_name = MAY;
   else if(mode == 6)
      month_name = JUNE;
   else if(mode == 7)
      month_name = JULY;
   else if(mode == 8)
      month_name = AUGUST;
   else if(mode == 9)
      month_name = SEPTEMBER;
   else if(mode == 10)
      month_name = OCTOBER;
   else if(mode == 11)
      month_name = NOVEMBER;
   else if(mode == 12)
      month_name = DECEMBER;

   return month_name;
}

function check_save_naid(formname,wm)
{
if (formname.vg_login.value == "")
{
        alert(VG_LOGIN);
        return;
}
if (formname.na_id.value >= 1)
{
formname.workmode.value = wm;
formname.devision.value=7;
formname.submit();
}
else
alert("Wrong net agent");
return;
}

function check_payment(formname,wm)
{
if (formname.naklno.value != false)
{
formname.workmode.value = wm;
formname.devision.value=7;
formname.submit();
}
else
return;
}

function check_reqs()
{
        amount = document.forms[1].cardsamount.value;
        nominal = document.forms[1].nominal.value;
        znachnost = document.forms[1].znachnost.value;

        dsel = document.forms[1].day.options[document.forms[1].day.selectedIndex].value;
        msel = document.forms[1].month.options[document.forms[1].month.selectedIndex].value;
        ysel = document.forms[1].year.options[document.forms[1].year.selectedIndex].value;

        if(dsel == -1 || msel == -1 || ysel == -1 || nominal <= 0 || amount <= 0 || amount > 2000 || znachnost < 8 || znachnost > 32)
        {
        alert("Wrong date or fields data in form"); // Не выбрана дата, или неверно заданы значения полей количества,номинала или значности
        return;
        }
        else
        {
        document.forms[1].whatpressed.value = 1;
        document.forms[1].submit();
        }
}

function date_set()
{

        dsel = document.rate_form.day.value;
        msel = document.rate_form.month.value;
        ysel = document.rate_form.year.value;
        if(dsel == -1 || msel == -1 || ysel == -1)
        {
        alert("Data is not selected");
        return;
        }
        else
        {
        document.rate_form.workmode.value=1;
        document.rate_form.submit();
        }
}

function backtogroup(vgid)
{
nextlocation='config.php#_'+vgid;
document.location=nextlocation;
}

function go_item_edit(showpage,startpage,mode,itemno,cs)
{
document.forms[1].devision.value=17;
document.forms[1].page2show.value=showpage;
document.forms[1].start_page.value=startpage;
document.forms[1].workmode.value=mode;
document.forms[1].catstart_page.value=cs;

if(itemno !=0)
{
document.forms[1].zone_id_bylink.value=itemno;
}

document.forms[1].submit();
}

function go_page(newpage,page,oldpage)
{
document.forms[1].devision.value=17;
document.forms[1].page2show.value=page;
        if (newpage == 1)
        {
        document.forms[1].start_page.value=page;
        }
        else
        {
        document.forms[1].start_page.value=oldpage;
        }
document.forms[1].submit();
}

function go_log_page(newpage,page,oldpage)
{
document.forms[1].devision.value=19;
document.forms[1].page2show.value=page;
        if (newpage == 1)
        {
        document.forms[1].start_page.value=page;
        }
        else
        {
        document.forms[1].start_page.value=oldpage;
        }
document.forms[1].submit();
}

function go_cat_page(newpage,page,oldpage,wm)
{
document.forms[1].devision.value=17;
document.forms[1].catpage2show.value=page;
        if (newpage == 1)
        {
        document.forms[1].catstart_page.value=page;
        }
        else
        {
        document.forms[1].catstart_page.value=oldpage;
        }
document.forms[1].workmode.value = wm;
document.forms[1].submit();
}

function go_cat(cat_id,page,cs)
{
document.forms[1].devision.value=17;
document.forms[1].cat2show.value=cat_id;
document.forms[1].catpage2show.value=page;
document.forms[1].catstart_page.value=cs;

document.forms[1].submit();
}

function go_edit(vgid)
{
document.forms[1].devision.value=7;
document.forms[1].fast_vg_id.value=vgid;
document.forms[1].submit();
}

function show_details(vgid,formname)
{
document.forms[1].devision.value=18;
document.forms[1].fast_vg_id.value=vgid;
dreport_called(2,formname);
// document.forms[1].submit();
}

function show_na_vg(naid2show,everything)
{
document.forms[1].devision.value=7;
document.forms[1].dropdown.value=everything;
document.forms[1].na_vg_2show.value=naid2show;
document.forms[1].submit();
}

function submit_stat(mode) {
document.forms[0].devision.value=mode;
document.forms[0].submit();
}

function agents_state_change(form_name, agent) {
        form_name.delete1.disabled=false;
        form_name.edit1.disabled=false;
        if(agent == 3 || agent == 4 || agent == 7)
        {
           form_name.replace_number.disabled = false;  
        }
        else
        {
           form_name.replace_number.disabled = true;
        }
}

function tariffbutton_change() {
        document.tariff_form.delete1.disabled=false;
        document.tariff_form.edit1.disabled=false;
        document.tariff_form.dis_add.disabled=false;
}

function delnas_state_change() {
        document.netagents_form.del_nas.disabled=false;
}

function deldis_state_change() {
        document.tariff_form.del_vdis.disabled=false;
        document.tariff_form.bonus_box.disabled=false;
}

function delbonus_state_change() {
        document.tariff_form.del_tdis.disabled=false;
}

function switch_state(control1,control2)
{
        if (control1.disabled == false)
        {
        control1.disabled = true;
        control2.disabled = false;
        }
        else
        {
        control1.disabled = false;
        control2.disabled = true;
        }
}

function type_state_change(vgname)
{
        document.stats_form.byaddr.disabled = false;

        year = document.stats_form.year.value;

        month = document.stats_form.month.value;
        day = document.stats_form.day.value;
        hour = document.stats_form.hour.value;

        if(hour > 0)
                return;

        if(day > 0){
                document.stats_form.r_hour.disabled = false;
                return;
        }
        if(month > 0){
                document.stats_form.r_hour.disabled = false;
                document.stats_form.r_day.disabled = false;

                return;
        }
        if(year > 0){
                document.stats_form.r_hour.disabled = false;
                document.stats_form.r_day.disabled = false;

                document.stats_form.r_month.disabled = false;
                return;
        }
}

function old_fixed(mode)
{

var today = new Date();

        if (mode == 4)
        {
        ry = today.getFullYear();
        rm = today.getMonth();

        if(rm == 0){
                document.stats_form.year.value = ry-1;
                document.stats_form.month.selectedIndex = rm+12;
        }else{
                document.stats_form.year.value = ry;
                document.stats_form.month.selectedIndex = rm;
        }

        document.stats_form.t_year.value = ry;
        document.stats_form.t_month.selectedIndex = rm+1;

        stats_form.t_month.disabled = false;

        stats_form.month.disabled = false;
        stats_form.day.disabled = true;
        document.stats_form.day.selectedIndex = 0;
        stats_form.t_day.disabled = true;
        document.stats_form.t_day.selectedIndex = 0;

        stats_form.hour.disabled = true;
        document.stats_form.hour.selectedIndex = 0;
        stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.selectedIndex = 0;
        }
        else if(mode == 3)
        {
        cseconds = today.getTime();
        cseconds = cseconds/1000 - 604800;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();



                if(rd < 7)
                rw = 1;
                else if (rd < 15)
                rw = 2;
                else if (rd < 22)
                rw = 3;
                else
                rw = 4;

        document.stats_form.t_year.value = ry;
        document.stats_form.t_month.selectedIndex = rm;
        if(rw == 4)
        {
                document.stats_form.t_month.selectedIndex = rm+1;

        }
        document.stats_form.year.value = ry;
        document.stats_form.month.selectedIndex = rm;


        stats_form.month.disabled = false;


        stats_form.t_month.disabled = false;



        stats_form.day.disabled = true;
        document.stats_form.day.selectedIndex = 0;
        stats_form.t_day.disabled = true;
        document.stats_form.t_day.selectedIndex = 0;

        stats_form.hour.disabled = true;
        document.stats_form.hour.selectedIndex = 0;
        stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.selectedIndex = 0;
        }
        else if(mode == 2)
        {
        cseconds = today.getTime();
        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();

        document.stats_form.t_year.value = ry;
        document.stats_form.t_month.selectedIndex = rm;
        document.stats_form.t_day.selectedIndex = rd+1;

        document.stats_form.year.value = ry;
        document.stats_form.month.selectedIndex = rm;
        document.stats_form.day.selectedIndex = rd;

        if(rd+1>31)
        {
                // эначит наступил следующий месяц
                document.stats_form.t_month.selectedIndex = rm+1;
                document.stats_form.t_day.selectedIndex = 1;
        }

        stats_form.month.disabled = false;


        stats_form.t_month.disabled = false;



        stats_form.day.disabled = false;
        stats_form.t_day.disabled = false;

        stats_form.hour.disabled = true;
        document.stats_form.hour.selectedIndex = 0;

        stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.selectedIndex = 0;

        }
        else if(mode == 1)
        {
        cseconds = today.getTime();
        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000)

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();

        document.stats_form.t_year.value = ry;
        document.stats_form.t_month.selectedIndex = rm;
        document.stats_form.t_day.selectedIndex = rd;
        document.stats_form.t_hour.selectedIndex = rh+2;

        document.stats_form.year.value = ry;
        document.stats_form.month.selectedIndex = rm;
        document.stats_form.day.selectedIndex = rd;
        document.stats_form.hour.selectedIndex = rh+1;

        stats_form.month.disabled = false;


        stats_form.t_month.disabled = false;



        stats_form.day.disabled = false;
        stats_form.t_day.disabled = false;

        stats_form.hour.disabled = false;
        stats_form.t_hour.disabled = false;
        }


}

function fixed(mode)
{

var today = new Date();

        if (mode == 4)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].t_year.value = ry;
        document.forms[1].t_month.value = convertToMonth(rm);
        document.forms[1].t_day.value = rd;
        document.forms[1].t_hour.value = rh;
        document.forms[1].t_minute.value = rmm;
        document.forms[1].t_secund.value = rss;

        cseconds = cseconds/1000 - 2592000;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].year.value = ry;
        document.forms[1].month.value = convertToMonth(rm);
        document.forms[1].day.value = rd;
        document.forms[1].hour.value = rh;
        document.forms[1].minute.value = rmm;
        document.forms[1].secund.value = rss;
        }
        else if(mode == 3)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].t_year.value = ry;
        document.forms[1].t_month.value = convertToMonth(rm);
        document.forms[1].t_day.value = rd;
        document.forms[1].t_hour.value = rh;
        document.forms[1].t_minute.value = rmm;
        document.forms[1].secund.value = rss;

        cseconds = cseconds/1000 - 604800;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].year.value = ry;
        document.forms[1].month.value = convertToMonth(rm);
        document.forms[1].day.value = rd;
        document.forms[1].hour.value = rh;
        document.forms[1].minute.value = rmm;
        document.forms[1].secund.value = rss;
        }
        else if(mode == 2)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].t_year.value = ry;
        document.forms[1].t_month.value = convertToMonth(rm);
        document.forms[1].t_day.value = rd;
        document.forms[1].t_hour.value = rh;
        document.forms[1].t_minute.value = rmm;
        document.forms[1].secund.value = rss;

        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].year.value = ry;
        document.forms[1].month.value = convertToMonth(rm);
        document.forms[1].day.value = rd;
        document.forms[1].hour.value = rh;
        document.forms[1].minute.value = rmm;
        document.forms[1].secund.value = rss;
        }
        else if(mode == 1)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].t_year.value = ry;
        document.forms[1].t_month.value = convertToMonth(rm);
        document.forms[1].t_day.value = rd;
        document.forms[1].t_hour.value = rh;
        document.forms[1].t_minute.value = rmm;
        document.forms[1].secund.value = rss;

        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes()+1;
        rss = today.getSeconds()+1;

        document.forms[1].year.value = ry;
        document.forms[1].month.value = convertToMonth(rm);
        document.forms[1].day.value = rd;
        document.forms[1].hour.value = rh;
        document.forms[1].minute.value = rmm;
        document.forms[1].secund.value = rss;
        }

        document.forms[1].t_month.disabled = false;
        document.forms[1].t_day.disabled = false;
        document.forms[1].t_hour.disabled = false;
        document.forms[1].t_minute.disabled = false;

        document.forms[1].month.disabled = false;
        document.forms[1].day.disabled = false;
        document.forms[1].hour.disabled = false;
        document.forms[1].minute.disabled = false;


}

function s_fixed(form, mode)
{

var today = new Date();

        if (mode == 4)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        form.t_year.value = ry;
        form.t_month.value = convertToMonth(rm);
        form.t_day.value = dayC;
        form.t_hour.value = hourC;
        form.t_minute.value = minuteC;
        form.t_secund.value = secundC;

        cseconds = cseconds/1000 - 2592000;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        document.forms[1].year.value = ry;
        form.month.value = convertToMonth(rm);
        form.day.value = dayC;
        form.hour.value = hourC;
        form.minute.value = minuteC;
        form.secund.value = secundC;
        }
        else if(mode == 2)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        form.t_year.value = ry;
        form.t_month.value = convertToMonth(rm);
        form.t_day.value = rd;
        form.t_hour.value = hourC;
        form.t_minute.value = minuteC;
        form.t_secund.value = secundC;

        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        form.year.value = ry;
        form.month.value = convertToMonth(rm);
        form.day.value = rd;
        form.hour.value = hourC;
        form.minute.value = minuteC;
        form.secund.value = secundC;
        }
        else if(mode == 1)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        form.t_year.value = ry;
        form.t_month.value = convertToMonth(rm);
        form.t_day.value = rd;
        form.t_hour.value = rh;
        form.t_minute.value = minuteC;
        form.t_secund.value = secundC;

        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();
        rss = today.getSeconds();

        form.year.value = ry;
        form.month.value = convertToMonth(rm);
        form.day.value = rd;
        form.hour.value = rh;
        form.minute.value = minuteC;
        form.secund.value = secundC;
        }

        form.t_month.disabled = false;
        form.t_day.disabled = false;
        form.t_hour.disabled = false;
        form.t_minute.disabled = false;

        form.month.disabled = false;
        form.day.disabled = false;
        form.hour.disabled = false;
        form.minute.disabled = false;


}

function report_called()
{
        if(gal() > gar())
        {
        alert("First date interval could not be more than second");
        disable_right();
        return;
        }
        else
        {
        document.stats_form.submit();
        }

}

function disable_right()
{
document.stats_form.t_year.value = yearC;
document.stats_form.t_month.value = monthC;

document.stats_form.t_day.value = dayC;
document.stats_form.t_hour.value = hourC;
document.stats_form.t_minute.value = minuteC;
document.stats_form.t_secund.value = secundC;
document.stats_form.t_month.disabled = true;

document.stats_form.t_day.disabled = true;
document.stats_form.t_hour.disabled = true;
}

function year_changed()
{

if(gal() > gar()) disable_right();

ysel = document.stats_form.year.value;
if(ysel == yearC && ysel==0)
{
document.stats_form.month.disabled = true;

document.stats_form.day.disabled = true;
document.stats_form.hour.disabled = true;
document.stats_form.t_month.disabled = true;

document.stats_form.t_day.disabled = true;
document.stats_form.t_hour.disabled = true;

document.stats_form.month.value = monthC;

document.stats_form.day.value = dayC;
document.stats_form.hour.value = hourC;
document.stats_form.t_month.value = monthC;

document.stats_form.t_day.value = dayC;
document.stats_form.t_hour.value = hourC;
}
else
{

cy=document.stats_form.year.value;
cm=document.stats_form.month.value-1;
cd=document.stats_form.day.value;
var leftlimit = new Date(cy,cm,cd);

        if( leftlimit.getTime()/1000 < document.stats_form.actuality.value )
        {
        document.stats_form.hour.disabled = true;
        document.stats_form.hour.value = hourC;
        document.stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.value = hourC;
        }

document.stats_form.month.disabled = false;
}
return;
}

function month_changed()
{

if(gal() > gar()) disable_right();

msel = document.stats_form.month.value;
if(msel == monthC)
{

document.stats_form.day.disabled = true;
document.stats_form.hour.disabled = true;


document.stats_form.t_day.disabled = true;
document.stats_form.t_hour.disabled = true;


document.stats_form.day.value = dayC;
document.stats_form.hour.value = hourC;

document.stats_form.t_month.value = monthC;

document.stats_form.t_day.value = dayC;
document.stats_form.t_hour.value = hourC;
}
else
{
cy=document.stats_form.year.value;
cm=document.stats_form.month.value-1;
cd=document.stats_form.day.value;
var leftlimit = new Date(cy,cm,cd);

        if( leftlimit.getTime()/1000 < document.stats_form.actuality.value )
        {
        document.stats_form.hour.disabled = true;
        document.stats_form.hour.value = hourC;
        document.stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.value = hourC;
        }


document.stats_form.day.disabled = false;
}
return;
}


function day_changed()
{

if(gal() > gar()) disable_right();

dsel = document.stats_form.day.value;
tmsel = document.stats_form.t_month.value;
if(dsel == dayC)
{

document.stats_form.hour.disabled = true;
document.stats_form.t_day.value = dayC;
document.stats_form.hour.value = hourC;
}
else
{
cy=document.stats_form.year.value;
cm=document.stats_form.month.value-1;
cd=document.stats_form.day.value;
var leftlimit = new Date(cy,cm,cd);

        if( leftlimit.getTime()/1000 >= document.stats_form.actuality.value )
        {
        document.stats_form.hour.disabled = false;
        }
        else
        {
        document.stats_form.hour.disabled = true;
        document.stats_form.hour.value = hourC;
        document.stats_form.t_hour.disabled = true;
        document.stats_form.t_hour.value = hourC;
        }


}
return;
}

function tyear_changed()
{

tysel = document.stats_form.t_year.value;

if(tysel == yearC)
{
document.stats_form.t_month.disabled = true;

document.stats_form.t_day.disabled = true;
document.stats_form.t_hour.disabled = true;

document.stats_form.t_month.value = monthC;

document.stats_form.t_day.value = dayC;
document.stats_form.t_hour.value = hourC;
}
else
{
document.stats_form.t_month.disabled = false;
}
return;
}

function tmonth_changed()
{
tmsel = document.stats_form.t_month.value;
msel = document.stats_form.month.value;
if(msel == monthC)
{
alert("Please choose a month at left side of interval form"); // Вначале необходимо выбрать месяц левой границы интервала
document.stats_form.t_month.value = monthC;
return;
}

if(tmsel == monthC)
{

document.stats_form.t_day.disabled = true;
document.stats_form.t_hour.disabled = true;

document.stats_form.t_day.value = dayC;
document.stats_form.t_hour.value = hourC;
}
else
{

document.stats_form.t_day.disabled = false;
}
return;
}


function tday_changed()
{
tdsel = document.stats_form.t_day.value;
dsel = document.stats_form.day.value;
if(dsel == dayC)
{
alert("Please choose a day at first");
document.stats_form.t_day.value = dayC;
return;
}

if(tdsel == dayC)
{
document.stats_form.t_hour.disabled = true;
}
else
{
        if(document.stats_form.hour.disabled == false)
        {
        document.stats_form.t_hour.disabled = false;
        }
        else
        {
        document.stats_form.t_hour.disabled = true;
        }


}
return;
}

function gal()
{
hsel = document.stats_form.hour.value;
dsel = document.stats_form.day.value;

msel = document.stats_form.month.value;
ysel = document.stats_form.year.value;

ly=document.stats_form.year.value;
lm=document.stats_form.month.value-1;

ld=document.stats_form.day.value;
lh=document.stats_form.hour.value;

 if(hsel != hourC)
 {
 var leftlimit = new Date(ly,lm,ld,lh,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(dsel != hourC)
 {
 var leftlimit = new Date(ly,lm,ld,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(msel != hourC)
 {
 var leftlimit = new Date(ly,lm,1,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(ysel != hourC)
 {
 var leftlimit = new Date(ly,0,1,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else
 {
 var leftlimit = new Date();
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }

}

function gar()
{
thsel = document.stats_form.t_hour.value;
tdsel = document.stats_form.t_day.value;

tmsel = document.stats_form.t_month.value;
tysel = document.stats_form.t_year.value;

ry=document.stats_form.t_year.value;
rm=document.stats_form.t_month.value-1;

rd=document.stats_form.t_day.value;
rh=document.stats_form.t_hour.value;

 if(thsel != hourC)
 {
 var rightlimit = new Date(ry,rm,rd,rh,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tdsel != dayC)
 {
 var rightlimit = new Date(ry,rm,rd,00,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tmsel != monthC)
 {
 var rightlimit = new Date(ry,rm,1,00,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tysel != yearC)
 {
 var rightlimit = new Date(ry,0,1,00,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else
 {
 var rightlimit = new Date();
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }

}

function checkoctet(control)
{
var mess
mess="Wrong data"
if(control.value < 0 || control.value > 255 || isNaN(parseInt(control.value)) == true )
{
mess = mess + control.value
control.focus()
control.select()
alert(mess)
return
}
}
// Функции для Dial Stat

function show_dial() {
document.forms['dial_stat'].pokazat.disabled=false;
}

function set_fixed_universal(mode,formname)
{

var today = new Date();

        if (mode == 4)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.selectedIndex = rd;
        formname.t_hour.selectedIndex = rh;
        formname.t_minute.selectedIndex = rmm;

        cseconds = cseconds/1000 - 2592000;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.selectedIndex = rd;
        formname.hour.selectedIndex = rh;
        formname.minute.selectedIndex = rmm;

        }
        else if(mode == 3)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.selectedIndex = rd;
        formname.t_hour.selectedIndex = rh;
        formname.t_minute.selectedIndex = rmm;

        cseconds = cseconds/1000 - 604800;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.selectedIndex = rd;
        formname.hour.selectedIndex = rh;
        formname.minute.selectedIndex = rmm;

        }
        else if(mode == 2)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.selectedIndex = rd;
        formname.t_hour.selectedIndex = rh;
        formname.t_minute.selectedIndex = rmm;

        cseconds = cseconds/1000 - 86400;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.selectedIndex = rd;
        formname.hour.selectedIndex = rh;
        formname.minute.selectedIndex = rmm;

        }
        else if(mode == 1)
        {
        cseconds = today.getTime();

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.t_year.value = ry;
        formname.t_month.selectedIndex = rm;
        formname.t_day.selectedIndex = rd;
        formname.t_hour.selectedIndex = rh;
        formname.t_minute.selectedIndex = rmm;

        cseconds = cseconds/1000 - 3600;
        today.setTime(cseconds*1000);

        ry = today.getFullYear();
        rm = today.getMonth()+1;
        rd = today.getDate();
        rh = today.getHours();
        rmm =  today.getMinutes();

        formname.year.value = ry;
        formname.month.selectedIndex = rm;
        formname.day.selectedIndex = rd;
        formname.hour.selectedIndex = rh;
        formname.minute.selectedIndex = rmm;
        }

        formname.t_month.disabled = false;
        formname.t_day.disabled = false;
        formname.t_hour.disabled = false;
        formname.t_minute.disabled = false;

        formname.month.disabled = false;
        formname.day.disabled = false;
        formname.hour.disabled = false;
        formname.minute.disabled = false;


}

// Функции для detail_stat

function inname_selected()
{
document.forms['detailed_stat'].inname.disabled = false;
}

function remote_selected()
{
document.forms['detailed_stat'].byservice.disabled = false;
}

function ip_selected()
{
document.forms['detailed_stat'].byremote.disabled = false;
}

function grp_selected()
{
document.forms['detailed_stat'].byaddr.disabled = false;
document.forms['detailed_stat'].by_cat.disabled = false;
}

function dialreprt() {
document.forms['dial_stat'].pokazat.disabled=false;
}

function phonereprt() {
document.forms['phone_stat'].pokazat.disabled=false;
}

function ip_reprt() {
document.forms['detailed_stat'].pokazat.disabled=false;
}

function en_sessions_btn() {
document.forms['dial_stat'].showsessions.disabled=false;
document.forms['dial_stat'].show_numbers.disabled=false;
}

function en_phsessions_btn() {
document.forms['phone_stat'].showsessions.disabled=false;
}

function en_ip_sessions_btn(vgid) {
document.forms['detailed_stat'].showsessions.disabled=false;
document.forms['detailed_stat'].vg_id.value=vgid;
}

function reprt() {
document.forms['detailed_stat'].pokazat.disabled=false;
}

function dreport_called(mode,formname)
{
        if(dgal(formname) > dgar(formname))
        {
        alert("Wrong interval settings"); //Левая граница интервала не может быть больше правой
        ddisable_right(formname);
        return;
        }
        else
        {
          if(mode == 9)
          {
            formname.radius_ch.value=1;
            mode = 1;
          }
          if(mode == 11)
          {
            formname.radius_ch.value=2;
          }
          if(mode == 1)
          {
            asdf = formname.stat1_method.value;
            if(asdf == 4)
            {
               mode=2;
            }
          }
          formname.whatpressed.value=mode;
          formname.submit();
        }

}

function ddisable_right(formname)
{
formname.t_year.value = yearC;
formname.t_month.value = monthC;
formname.t_day.value = dayC;
formname.t_hour.value = hourC;
formname.t_minute.value = minuteC;

formname.t_month.disabled = true;
formname.t_day.disabled = true;
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;
}

function dyear_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

ysel = formname.year.options[formname.year.selectedIndex].value;

if(ysel == -1)
{

formname.month.disabled = true;
formname.day.disabled = true;
formname.hour.disabled = true;
formname.minute.disabled = true;

formname.t_month.disabled = true;
formname.t_day.disabled = true;
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;

formname.month.selectedIndex = 0;
formname.day.selectedIndex = 0;
formname.hour.selectedIndex = 0;
formname.minute.selectedIndex = 0;

formname.t_month.selectedIndex = 0;
formname.t_day.selectedIndex = 0;
formname.t_hour.selectedIndex = 0;
formname.t_minute.selectedIndex = 0;
}
else
{
formname.month.disabled = false;
}

return;
}

function dmonth_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

msel = formname.month.options[formname.month.selectedIndex].value;
if(msel == -1)
{
formname.day.disabled = true;
formname.hour.disabled = true;
formname.minute.disabled = true;

formname.t_day.disabled = true;
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;

formname.day.selectedIndex = 0;
formname.hour.selectedIndex = 0;
formname.minute.selectedIndex = 0;

formname.t_month.selectedIndex = 0;
formname.t_day.selectedIndex = 0;
formname.t_hour.selectedIndex = 0;
formname.t_minute.selectedIndex = 0;
}
else
{
formname.day.disabled = false;
}
return;
}

function dday_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

dsel = formname.day.options[formname.day.selectedIndex].value;
tmsel = formname.t_month.options[formname.t_month.selectedIndex].value;
if(dsel == -1)
{
formname.hour.disabled = true;
formname.minute.disabled = true;

formname.t_day.selectedIndex = 0;
formname.hour.selectedIndex = 0;
        if(tmsel != -1)
        {
        formname.t_day.disabled = false;
        }
}
else
{
formname.hour.disabled = false;
}
return;
}

function dhour_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

hsel = formname.hour.options[formname.hour.selectedIndex].value;
if(hsel == -1)
{
formname.minute.selectedIndex = 0;
formname.minute.disabled = true;
}
else
{
formname.minute.disabled = false;
}
return;
}

function dminute_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

hsel = formname.minute.options[formname.minute.selectedIndex].value;
if(hsel == -1)
{
formname.secund.selectedIndex = 0;
formname.secund.disabled = true;
}
else
{
formname.secund.disabled = false;
}
return;
}

function dtyear_changed(formname)
{

tysel = formname.t_year.options[formname.t_year.selectedIndex].value;

if(tysel == -1)
{
formname.t_month.disabled = true;
formname.t_day.disabled = true;
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;

formname.t_month.selectedIndex = 0;
formname.t_day.selectedIndex = 0;
formname.t_hour.selectedIndex = 0;
formname.t_minute.selectedIndex = 0;
}
else
{
formname.t_month.disabled = false;
}
return;
}

function dtmonth_changed(formname)
{
tmsel = formname.t_month.options[formname.t_month.selectedIndex].value;
msel = formname.month.options[formname.month.selectedIndex].value;
if(msel == -1)
{
alert("Wrong interval settings"); //Вначале необходимо выбрать месяц левой границы интервала
formname.t_month.selectedIndex = 0;
return;
}

if(tmsel == -1)
{
formname.t_day.disabled = true;
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;

formname.t_day.selectedIndex = 0;
formname.t_hour.selectedIndex = 0;
formname.t_minute.selectedIndex = 0;
}
else
{
formname.t_day.disabled = false;
}
return;
}

function dtday_changed(formname)
{

tdsel = formname.t_day.options[formname.t_day.selectedIndex].value;
dsel = formname.day.options[formname.day.selectedIndex].value;

if(dsel == -1)
{
alert("Wrong interval settings"); // Вначале необходимо выбрать день левой границы интервала
formname.t_day.selectedIndex = 0;
return;
}

if(tdsel == -1)
{
formname.t_hour.disabled = true;
formname.t_minute.disabled = true;
}
else
{
        if(formname.hour.disabled == false)
        {
        formname.t_hour.disabled = false;
        }
        else
        {
        formname.t_hour.disabled = true;
        }
}
return;
}

function dthour_changed(formname)
{

hsel = formname.hour.options[formname.hour.selectedIndex].value;
thsel = formname.t_hour.options[formname.t_hour.selectedIndex].value;

if(hsel == -1)
{
alert("Wrong interval settings");
formname.t_hour.selectedIndex = 0;
return;
}

if(thsel == -1)
{
formname.minute.selectedIndex = 0;
formname.minute.disabled = true;
}
else
{
formname.t_minute.disabled = false;
}
return;
}

function dtminute_changed(formname)
{

if(dgal(formname) > dgar(formname)) ddisable_right(formname);

hsel = formname.t_minute.options[formname.t_minute.selectedIndex].value;
if(hsel == -1)
{
formname.t_secund.selectedIndex = 0;
formname.t_secund.disabled = true;
}
else
{
formname.t_secund.disabled = false;
}
return;
}


function onHover(what) {what.style.backgroundColor='#AAAAFF';}
function offHover(what)        {what.style.backgroundColor='#BFBFFF';}
function setPointer(theRow, thePointerColor, bdr)
{
    if (thePointerColor == '' || typeof(theRow.style) == 'undefined') {
        return false;
    }
    if (typeof(document.getElementsByTagName) != 'undefined') {
        var theCells = theRow.getElementsByTagName('td');
    }
    else if (typeof(theRow.cells) != 'undefined') {
        var theCells = theRow.cells;
    }
    else {
        return false;
    }

    var rowCellsCnt  = theCells.length;
    for (var c = 0; c < rowCellsCnt; c++) {
        theCells[c].style.backgroundColor = thePointerColor;
                theCells[c].style.borderTop = bdr;
                if(c==0) {theCells[c].style.borderLeft = bdr; }
                if(c==rowCellsCnt-1) { theCells[c].style.borderRight = bdr; }
                theCells[c].style.borderBottom = bdr;
    }

    return true;
}

function tarif_union()
{
   if(document.forms[1].tariffs_ug.value != 0)
   {
      document.getElementById('vg_ass').disabled = "true";
      document.getElementById('vg_1').disabled = "true";
      document.getElementById('vg_2').disabled = "true";
      document.getElementById('vg_av').disabled = "true";
      document.getElementById('u_t_id').disabled = "true";
   }  
   else
   {
      document.getElementById('vg_ass').disabled = false;
      document.getElementById('vg_1').disabled = false;
      document.getElementById('vg_2').disabled = false;
      document.getElementById('vg_av').disabled = false;
      document.getElementById('u_t_id').disabled = false;
   } 
   
   return true;
}

function utype_union()
{
   if(document.forms[1].user_type_ug.value != 0)
   {
      document.getElementById('vg_ass').disabled = "true";
      document.getElementById('vg_1').disabled = "true";
      document.getElementById('vg_2').disabled = "true";
      document.getElementById('vg_av').disabled = "true";
      document.getElementById('t_ug_id').disabled = "true";
   }  
   else
   {
      document.getElementById('vg_ass').disabled = false;
      document.getElementById('vg_1').disabled = false;
      document.getElementById('vg_2').disabled = false;
      document.getElementById('vg_av').disabled = false;
      document.getElementById('t_ug_id').disabled = false;
   } 
   
   return true;
}

function inter_report()
{
      var year = new String();
      var month = new String();
      var new_val = new String();
      year = document.forms[1].inter_year.value;
      month = document.forms[1].inter_month.value;      
      new_val = "year="+year+"&month="+month;
      
      w1=window.open ('inter_report.php?'+new_val,'_ord','width=950,height=800,resizable=no,status=no,menubar=no,scrollbars=yes');
      w1.focus();
}

function show_only_groups()
{
	if(document.forms[1].choose_groups.checked == true)
	{
		document.getElementById('only_groups').disabled = false;	
	}
	else
	{
		document.getElementById('only_groups').disabled = true;	
	}
}

function show_excel_stat ( url )
{
    w1=window.open (url,'_ord','width=980,height=600,resizable=yes,status=no,menubar=no,scrollbars=yes');
   w1.focus();
}

function checkUnit( is_unit, if_null, if_undef, if_empty, if_eq_0, if_min_0, if_max_0 )
{
	if(if_null == 1 && is_unit == null) return false;
	if(if_undef == 1 && typeof is_unit == "undefined") return false;
	if(if_empty == 1 && is_unit == "") return false;
	if(if_eq_0 == 1 && is_unit == 0) return false;
	if(if_min_0 == 1 && is_unit < 0) return false;
	if(if_max_0 == 1 && is_unit > 0) return false;
	
	return true;
}
