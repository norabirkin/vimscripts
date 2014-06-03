<script type="text/javascript" src="js/client_devices.js"></script>
<script type="text/javascript" src="js/bind_account.js"></script>
<script type="text/javascript" src="js/actions.js"></script>
<script type="text/javascript" src="js/charges.js"></script>
<script type="text/javascript" src="js/vgroups.js"></script>
<script type="text/javascript" src="js/address.js"></script>
<script type="text/javascript" src="js/tarifs.js"></script>
<script type="text/javascript" src="js/usbox.js"></script>
<script type="text/javascript" src="js/user.js"></script>
<script type="text/javascript" src="js/device_ports.js"></script>
<form id="_vgroupForm" method="POST" url="config.php">
<input type="hidden" name="devision" value="7">
<input type="hidden" name="vgtpl" id="vgtpl" value="{VGTPL}">
<input type="hidden" name="vgid" id="vgid" value="{VGID}">
<input type="hidden" name="moduleids" id="moduleids" value="{MODULEID}">
<input type="hidden" name="oldagent" id="oldagent" value="{OLDAGENT}">
<input type="hidden" name="uid" id="uid" value="{UID}">
<input type="hidden" name="username" id="username" value="{USERNAME}">
<input type="hidden" id="_templ_" name="templ" value="{TEMPLATEVLUE}">
<input type="hidden" name="userlogin" id="userlogin" value="{THISVGLOGIN}">
<input type="hidden" name="userpass" id="userpass" value="{THISPASS}">
<input type="hidden" name="regpass" id="regpass" value="{REGPASS}">
<input type="hidden" name="autoagrmid" id="autoagrmid" value="{THISAGRMID}">
<input type="hidden" name="autoagrmnum" id="autoagrmnum" value="{THISAGRMNUM}">
<input type="hidden" name="autoagrmpaymentmethod" id="autoagrmpaymentmethod" value="{THISPAYMENTMETHOD}">
<input type="hidden" name="addrstr" id="addrstr" value="{ADDRSTR}">
<input type="hidden" name="addrcode" id="addrcode" value="{ADDRCODE}">
</form>

<table align="center" width="900" class="table_comm" style="margin-top: 22px; border: none; background: none">
<tr><td class="td_comm" id="VgroupPanel" style="border: none; background: none"></td></tr>
</table>
