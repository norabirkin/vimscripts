   var opened = 0;
   var what_opened = 0;

   function CheckEvent(menu_num)
   {
      if(opened == 0 && what_opened == 0)
      {
         ShowSubMenu(menu_num);
         opened = 1;
         what_opened = menu_num;
      }
      else if(opened == 1 && what_opened != menu_num)
      {
         HideSubMenu(what_opened);
         ShowSubMenu(menu_num);
         opened = 1;
         what_opened = menu_num;
      }
      else
      {
         HideSubMenu(menu_num);
         opened = 0;
         what_opened = 0;
      }
   }

   function ShowSubMenu(menu_num)
   {
      var menu_name = "sm"+menu_num;
      var element_name = document.getElementById(menu_name);
      element_name.style.display = 'block';
      document.getElementById("m"+menu_num).style.background = "#575757";
      document.getElementById("m"+menu_num).style.color = "Red";
   }

   function HideSubMenu(menu_num)
   {
      var menu_name = new String();
      menu_name = 'sm'+menu_num;
      document.getElementById(menu_name).style.display = 'none';
      document.getElementById("m"+menu_num).style.background = "#E1E1E1";
      document.getElementById("m"+menu_num).style.color = "Black";
   }

   function mOver(menu_num)
   {
      var menu_name = new String();
      menu_name = "m"+menu_num;
      document.getElementById(menu_name).style.background = "#575757";
      document.getElementById(menu_name).style.color = "Red";
   }

   function mOut(menu_num)
   {
      var menu_name = new String();
      menu_name = "m"+menu_num;
      document.getElementById(menu_name).style.background = "#E1E1E1";
      document.getElementById(menu_name).style.color = "#000000";
   }

   function smbOver(s_menu_num)
   {
         var smb_name = new String();
         smb_name = ('smb'+what_opened)+s_menu_num;
         var element_name = document.getElementById(smb_name);
         element_name.style.background = "#E1E1E1";
         element_name.style.color = "Black";
   }

   function smbOut(s_menu_num)
   {
         var smb_name = new String();
         var smb = new String();
         smb_name = ('smb'+what_opened)+s_menu_num;
         var element_name = document.getElementById(smb_name);
         element_name.style.background = "#575757";
         element_name.style.color = "#FFFFFF";
   }

   function smbClicked(punkt)
   {
      var val = 0;

      if(punkt == 'agents') { val= 10;}
      if(punkt == 'users') { val= 22;}
      if(punkt == 'groups') { val= 7;}
      if(punkt == 'accounts') { val= 23;}
      if(punkt == 'unions') { val= 16;}
      if(punkt == 'pay_card') { val= 103;}
      if(punkt == 'managers') { val= 13;}
      if(punkt == 'postmans') { val= 15;}
      if(punkt == 'bso') { val= 18;}
      if(punkt == 'registry') { val= 21;}
      if(punkt == 'rate') { val= 14;}
      if(punkt == 'tars') { val= 4;}
      if(punkt == 'tarcat') { val= 25;}
      if(punkt == 'catalog') { val= 17;}
      if(punkt == 'politics') { val= 102;}
      if(punkt == 'gen_card') { val= 109;}
      if(punkt == 'gen_schet') { val= 108;}
      if(punkt == 'gen_report') { val= 107;}
      if(punkt == 'statistic') { val= 104;}
      if(punkt == 'schet') { val= 105;}
      if(punkt == 'documes') { val= 106;}
      if(punkt == 'logs') { val= 19;}
      if(punkt == 'authlog') { val= 20;}
      if(punkt == 'comm_options') { val= 331;}
      if(punkt == 'oper_properties') { val= 332;}
      if(punkt == 'pays_properties') { val= 333;}
      if(punkt == 'exit') { val= 99;}
      if(punkt == 'empty') { val= 100;}
      if(punkt == 'hd_c') { val= 101;}
      if(punkt == 'hd_create') { val= 1111;}
      if(punkt == 'hd_statuses') { val= 1121;}
      if(punkt == 'export_schet') { val= 90;}
      if(punkt == 'payments2') { val= 199;}
      if(punkt == 'predstav') { val= 201;}
	   if(punkt == 'gen_tolink') {val = 110;}	//Revision #2
	   if(punkt == 'templates') {val = 111;}	//Revision #3
	   if(punkt == 'old_users') {val = 113;}	//Revision #5
	   if(punkt == 'oper_schet') {val = 66;}
	   if(punkt == 'recalc') {val = 67;}

      document.forms[0].devision.value = val;
      document.forms[0].submit();
   }

var im1=new Image();
var im2=new Image();
im1.src = "images/sel_open.gif";
im2.src = "images/sel_close.gif";
var sel_opened = 0;
var what_sel = new String();
what_sel = "";

function checkClicked(mode)
{
      if(sel_opened == 0 && what_sel == 0)
      {
         showSel(mode);
         sel_opened = 1;
         what_sel = mode;
      }
      else if(sel_opened == 1 && what_sel != mode)
      {
         hideSel(what_sel);
         showSel(mode);
         sel_opened = 1;
         what_sel = mode;
      }
      else
      {
         hideSel(mode);
         sel_opened = 0;
         what_sel = "";
      }
}

function showSel(sel)
{
var sel_name = new String();
var i_name = new String();

i_name = "i_"+sel;
sel_name = "f_"+sel;

document.images[i_name].src = im2.src;
document.getElementById(sel_name).style.display = 'block';
}

function hideSel(sel)
{
var sel_name = new String();
var i_name = new String();

i_name = "i_"+sel;
sel_name = "f_"+sel;

document.images[i_name].src = im1.src;
document.getElementById(sel_name).style.display = 'none';
if(document.forms[1].devision.value == 14)
{
   document.forms[1].submit();
}
}

function sel_clicked(param, field_name)
{
var parameter = new String();
var field = new String();

parameter = param;
field = field_name;

document.getElementById(field).value = parameter;
hideSel(field);
isTimeRight();
}

function isTimeRight()
{
   if(document.forms[1].devision.value != 90 && document.forms[1].devision.value != 108 && document.forms[1].devision.value != 107 && document.forms[1].devision.value != 67)
   {
   var year=document.forms[1].year.value;
   var month=document.forms[1].month.value;
   month = aconvertMonth(month);
   var day=document.forms[1].day.value;
   var hour=document.forms[1].hour.value;
   var minute=document.forms[1].minute.value;
   var secund=0;

   var tyear=document.forms[1].t_year.value;
   var tmonth=document.forms[1].t_month.value;
   tmonth = aconvertMonth(tmonth);
   var tday=document.forms[1].t_day.value;
   var thour=document.forms[1].t_hour.value;
   var tminute=document.forms[1].t_minute.value;
   var tsecund=0;

   if(year == yearC) year=2000;
   if(tyear==yearC) tyear=2010;
   if(day==dayC) day=0;
   if(hour==hourC) hour=0;
   if(minute==minuteC) minute=0;
   if(tday==dayC) tday=0;
   if(thour==hourC) thour=0;
   if(tminute==minuteC) tminute=0;

   month--; tmonth--;

   var leftlimit = new Date(year,month,day,hour,minute,00);
   var lal = leftlimit.getTime()/1000;
   var rightlimit = new Date(tyear,tmonth,tday,thour,tminute,00);
   var ral = rightlimit.getTime()/1000;

   if(lal > ral)
   {
      alert("Правая временная граница меньше левой!");
      disable_right1();
   }
   }

   return;
}

function aconvertMonth(mname)
{
   var name_f = new String();
   name_f = mname;

   if(mname == monthC)
   {
      return 0;
   }
   else if(mname == JANUARY)
   {
      return 1;
   }
   else if(mname == FEBRUARY)
   {
      return 2;
   }
   else if(mname == MARCH)
   {
      return 3;
   }
   else if(mname == APRIL)
   {
      return 4;
   }
   else if(mname == MAY)
   {
      return 5;
   }
   else if(mname == JUNE)
   {
      return 6;
   }
   else if(mname == JULY)
   {
      return 7;
   }
   else if(mname == AUGUST)
   {
      return 8;
   }
   else if(mname == SEPTEMBER)
   {
      return 9;
   }
   else if(mname == OCTOBER)
   {
      return 10;
   }
   else if(mname == NOVEMBER)
   {
      return 11;
   }
   else if(mname == DECEMBER)
   {
      return 12;
   }
   else
   {
      return 0;
   }
}

function disable_right1()
{
document.forms[1].t_year.value = yearC;
document.forms[1].t_month.value = monthC;

document.forms[1].t_day.value = dayC;
document.forms[1].t_hour.value = hourC;
document.forms[1].t_minute.value = minuteC;
document.forms[1].t_secund.value = secundC;
}


function dgal(formname)
{
hsel = formname.hour.value;
dsel = formname.day.value;
msel = formname.month.value;
ysel = formname.year.value;
mmsel = formname.minute.value;

ly=formname.year.value;
lm=formname.month.value-1;
ld=formname.day.value;
lh=formname.hour.value;
lmm=formname.minute.value;

 if (mmsel != minuteC)
 {
 var leftlimit = new Date(ly,lm,ld,lh,lmm,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(hsel != hourC)
 {
 var leftlimit = new Date(ly,lm,ld,lh,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(dsel != dayC)
 {
 var leftlimit = new Date(ly,lm,ld,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(msel != monthC)
 {
 var leftlimit = new Date(ly,lm,1,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(ysel != yearC)
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

function dgar(formname)
{
tmmsel = formname.t_minute.value;
thsel = formname.t_hour.value;
tdsel = formname.t_day.value;
tmsel = formname.t_month.value;
tysel = formname.t_year.value;

ry=formname.t_year.value;
rm=formname.t_month.value-1;
rd=formname.t_day.value;
rh=formname.t_hour.value;
rmm=formname.t_minute.value;

 if (tmmsel != minuteC)
 {
 var rightlimit = new Date(ry,rm,rd,rh,rmm,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(thsel != hourC)
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