<table cellpadding="0" cellspacing="0" border="0" width="980" align="center" style="border-top: none;">
  <tr>
    <td class="z11" width="40" bgcolor="#f5f5f5" align="center" 
        style="border-right: solid 1px #c0c0c0;">
      <font class="z11"><b>{FROM}</b></font>
    </td>
    
    <td class="z11" align="center" width="350" style="border-right: solid 1px #c0c0c0;">
      <table cellpadding="0" cellspacing="0" width="350" border="0">
        <tr>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="year" style="width: 100px;">
            {YEAR}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="month" style="width: 100px;">
            {MONTH}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="day" style="width: 100px;">
            {DAY}
            </select>
          </td>
        </tr>
        <tr>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="hour" style="width: 100px;">
            {HOUR}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="minute" style="width: 100px;">
            {MINUTE}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="secund" style="width: 100px;">
            {SECUND}
            </select>
          </td>
        </tr>
      </table>
    </td>
    
    <td class="z11" width="40" bgcolor="#f5f5f5" align="center" 
        style="border-right: solid 1px #c0c0c0;">
      <font class="z11"><b>{TO}</b></font>
    </td>
    
    <td class="z11" align="center" width="350" style="border-right: solid 1px #c0c0c0;">
      <table cellpadding="0" cellspacing="0" width="350" border="0">
        <tr>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_year" style="width: 100px;">
            {YEAR}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_month" style="width: 100px;">
            {MONTH}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_day" style="width: 100px;">
            {DAY}
            </select>
          </td>
        </tr>
        <tr>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_hour" style="width: 100px;">
            {HOUR}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_minute" style="width: 100px;">
            {MINUTE}
            </select>
          </td>
          <td class="z11" width="115" align="center" height="30">
            <select class="z11" name="t_secund" style="width: 100px;">
            {SECUND}
            </select>
          </td>
        </tr>
      </table>
    </td>
    
    <td class="z11" align="center" width="200" style="border-right: none;">
      <table cellpadding="0" cellspacing="0" width="200" border="0">
        <tr>
          <td width="100" class="z11" align="left" height="30">
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="fi"
            onClick="set_fixed_universal_seconds_new(4,this.form);">&nbsp;&nbsp;<font class="z11">{F_MONTH}</font>
          </td>
          <td width="100" class="z11" align="left" height="30" style="border-right: none;">
            <input type="radio" name="fi" 
            onClick="set_fixed_universal_seconds_new(3,this.form);">&nbsp;&nbsp;<font class="z11">{F_WEEK}</font>
          </td>
        </tr>
        <tr>
          <td width="100" class="z11" align="left" height="30">
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio"name="fi" 
            onClick="set_fixed_universal_seconds_new(2,this.form);">&nbsp;&nbsp;<font class="z11">{F_DAY}</font>
          </td>
          <td width="100" class="z11" align="left" height="30" style="border-right: none;">
            <input type="radio"name="fi" 
            onClick="set_fixed_universal_seconds_new(1,this.form);">&nbsp;&nbsp;<font class="z11">{F_HOUR}</font>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>