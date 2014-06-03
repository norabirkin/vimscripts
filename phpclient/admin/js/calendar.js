/**
 * Create Calendar object to manipulate date units YYYY MMM DD
 * @param	string, target control to link to
 * @param	string, year id control
 * @param	string, month id control
 * @param	string, day id contr
 */
function Calendar( target, year, month, day, drawdate, fulldate ) {
	if (Ext.isEmpty(target) || !document.getElementById(target)) {
		return false;
	}
	if (Ext.getCmp(target + '_Ext-Cal')) {
		Ext.getCmp(target + '_Ext-Cal').close();
		return;
	}
	var picker = new Ext.DatePicker({
		hideOnClick: false,
		format: 'Y-m-d',
		handler: function(){
			pushDate(this.getValue(), year, month, day, drawdate, fulldate);
			win.close();
		}
	})
	var win = new Ext.Window({
		id: target + '_Ext-Cal',
		shadow: false,
		border: false,
		bodyBorder: false,
		closable: false,
		header: false,
		frame: false,
		draggable: false,
		resizable: false,
		items: picker
	});
	
	var datevalue = pickupDate(year, month, day, drawdate);
	picker.setValue(datevalue);
	win.show();
	win.alignTo(target, 'tr');
} // Calendar()


/**
 * Pick up date values from DOM controls
 * @param	string, year id control
 * @param	string, month id control
 * @param	string, day id control
 */
function pickupDate( year, month, day, drawdate )
{
	var dt = new Date();
	
	if(!Ext.isEmpty(drawdate)) {
		try {
			var date_arr = document.getElementById(drawdate).innerHTML.split('.');
			dt.setFullYear(date_arr[2]);
			dt.setMonth(date_arr[1] - 1);
			dt.setDate(date_arr[0]);
		}
		catch (e) {}
	}
	
	else {
		try {
			var year = document.getElementById(year).value;
			if (parseInt(year) > 1970) {
				dt.setFullYear(year)
			}
		} 
		catch (e) { }
		try {
			var month = document.getElementById(month).value;
			if (parseInt(month) > 0) {
				dt.setMonth(parseInt(month) - 1)
			}
		} 
		catch (e) { }
		try {
			var day = document.getElementById(day).value;
			if (parseInt(day) > 0) {
				dt.setDate(day)
			}
		}
		catch (e) { }
	}
	
	return dt;
} // end pickupDate()


/**
 * Push date value to the controls
 * @param	object, Date
 * @param	string, year id control
 * @param	string, month id control
 * @param	string, day id control
 */
function pushDate( date, year, month, day, drawdate, fulldate )
{
	try {
	    document.getElementById(year).value = parseInt(date.format('Y'))
	} 
	catch (e) { }
	try {
	    document.getElementById(month).value = parseInt(date.format('n'));
	} 
	catch (e) { }
	try {
	    document.getElementById(day).value = parseInt(date.format('d'))
	} 
	catch (e) { }
	try {
		document.getElementById(fulldate).value = date.format('Ymd');
	    document.getElementById(drawdate).innerHTML = date.format('d.m.Y');
	} 
	catch (e) { }
} // end pushDate()