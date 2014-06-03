<!-- BEGIN th_jsapp -->
<script type="text/javascript" src="js/trusted_hosts_app.js"></script>
<script language="javascript">
	var Localize = {Add: '<%@ Add %>', Save: '<%@ Save %>', Cancel: '<%@ Cancel %>', Remove: '<%@ Remove %>', TrustedTitle: '<%@ Trusted Hosts Control %>', Ip_mask: '<%@ Mask %>', Ip_address: '<%@ Network %>', Description: '<%@ Description %>'}
</script>
<!-- END th_jsapp -->
<!-- BEGIN main_body -->
<form method="POST" action="config.php" id="_TrustedHosts">
<input type="hidden" id="_devision_" name="devision" value="501">

<table align="center" width="800" class="table_comm">
	<tr>
		<td>
		<div id="th-editor-grid"></div>
		</td>
	</tr>
</table>
</form>

<!-- END main_body -->