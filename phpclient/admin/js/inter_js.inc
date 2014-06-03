<?php
echo "<SCRIPT language=\"JavaScript\">
<!--";

echo "
function isTimeRight()
{
   if(document.forms[1].devision.value != 90 && document.forms[1].devision.value != 108 && document.forms[1].devision.value != 107)
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

   if(year == ".YEAR.") year=2000;
   if(tyear==".YEAR.") tyear=2010;
   if(day==".DAY.") day=0;
   if(hour==".HOUR.") hour=0;
   if(minute==".MINUTE.") minute=0;
   if(tday==".DAY.") tday=0;
   if(thour==".HOUR.") thour=0;
   if(tminute==".MINUTE.") tminute=0;

   var leftlimit = new Date(year,month,day,hour,minute,00);
   var lal = leftlimit.getTime()/1000;
   var rightlimit = new Date(tyear,tmonth,tday,thour,tminute,00);
   var ral = rightlimit.getTime()/1000;

   if(lal > ral)
   {
      alert(\"ѕрава€ временна€ граница меньше левой!\");
      disable_right1();
   }
   }

   return;
}
";

echo "
function aconvertMonth(mname)
{
   var name_f = new String();
   name_f = mname;

   if(mname == ".MONTH.")
   {
      return 0;
   }
   else if(mname == ".JANUARY.")
   {
      return 1;
   }
   else if(mname == ".FEBRUARY.")
   {
      return 2;
   }
   else if(mname == ".MARCH.")
   {
      return 3;
   }
   else if(mname == ".APRIL.")
   {
      return 4;
   }
   else if(mname == ".MAY.")
   {
      return 5;
   }
   else if(mname == ".JUNE.")
   {
      return 6;
   }
   else if(mname == ".JULY.")
   {
      return 7;
   }
   else if(mname == ".AUGUST.")
   {
      return 8;
   }
   else if(mname == ".SEPTEMBER.")
   {
      return 9;
   }
   else if(mname == ".OCTOBER.")
   {
      return 10;
   }
   else if(mname == ".NOVEMBER.")
   {
      return 11;
   }
   else if(mname == ".DECEMBER.")
   {
      return 12;
   }
   else
   {
      return 0;
   }
}
";

echo "
function disable_right1()
{
document.forms[1].t_year.value = ".YEAR.";
document.forms[1].t_month.value = ".MONTH.";

document.forms[1].t_day.value = ".DAY.";
document.forms[1].t_hour.value = ".HOUR.";
document.forms[1].t_minute.value = ".MINUTE.";
document.forms[1].t_secund.value = ".SECUND.";
}
";

echo "
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

 if (mmsel != ".MINUTE.")
 {
 var leftlimit = new Date(ly,lm,ld,lh,lmm,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(hsel != ".HOUR.")
 {
 var leftlimit = new Date(ly,lm,ld,lh,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(dsel != ".DAY.")
 {
 var leftlimit = new Date(ly,lm,ld,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(msel != ".MONTH.")
 {
 var leftlimit = new Date(ly,lm,1,00,00,00);
 var lal = leftlimit.getTime()/1000;
 return(lal);
 }
 else if(ysel != ".YEAR.")
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
";

echo "
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

 if (tmmsel != ".MINUTE.")
 {
 var rightlimit = new Date(ry,rm,rd,rh,rmm,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(thsel != ".HOUR.")
 {
 var rightlimit = new Date(ry,rm,rd,rh,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tdsel != ".DAY.")
 {
 var rightlimit = new Date(ry,rm,rd,00,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tmsel != ".MONTH.")
 {
 var rightlimit = new Date(ry,rm,1,00,00,00);
 var ral = rightlimit.getTime()/1000;
 return(ral);
 }
 else if(tysel != ".YEAR.")
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
";

echo "
//-->
</SCRIPT>";
?>