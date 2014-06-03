<script type="text/javascript" src="js/holidays.js"></script>
<script type="text/javascript" src="js/tarifs.js"></script>
<form method="POST" action="config.php" id="_Tarif">
<input type="hidden" id="_devision_" name="devision" value="4">
</form>
<table align="center" width="900" class="table_comm" style="margin-top: 22px; border: none; background: none">
<tr><td class="td_comm" style="border:none;background:none;">
    <table align="center" width="100%" class="table_comm" style="margin-bottom: 16px;">
        <tr><td class="td_head_ext"><%@ Tarifs list %></td></tr>
        <tr height="40">
            <td class="td_comm">
                &nbsp;
                <button type="submit" title="<%@ Create %>" onClick="submitForm('_Tarif', 'tarif', 0)"><img border=0 src="images/new22.gif"></button>
                <b><%@ Create %></b>
                <!-- BEGIN CalendarControl -->&nbsp;&nbsp;<button type="button" id="calendar" title="<%@ Calendar holidays %>" onClick="holidayMonthPanel()"><img border=0 src="images/calendar22.png"></img></button>
                <b><%@ Calendar holidays %></b><!-- END CalendarControl -->
            </td>
        </tr>
    </table>
</td></tr>
<tr><td class="td_comm" id="TarifPanel" style="border: none; background: none"></td></tr>
</table>