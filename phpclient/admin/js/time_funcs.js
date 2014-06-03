function check_day_month(F)
{
	var dd, mm, yyyy, dt;
	dd = F.pl_date.value;
	mm = F.pl_month.value-1;
	yyyy = F.pl_year.value;
	dt = new Date(yyyy, mm, dd);
	if (dt.getDate() != dd)
	{
		alert(Ext.app.Localize.get("Invalid date value str") +dd+"."+(parseInt(mm)+1)+"."+yyyy+ Ext.app.Localize.get("not exist str"));
		F.pl_date.focus();
		return false;
	}
	return true;
}