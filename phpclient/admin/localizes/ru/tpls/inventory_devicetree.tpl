<script language="javascript">
	var Localize = { Name: '<%@ Name %>', Speed: '<%@ Speed %>', Media: '<%@ Media %>', Vlan: 'Vlan',
					 Status: '<%@ Status %>', DevPorts: '<%@ Device ports %>',
					 Device: '<%@ Device %>', Port: '<%@ Port %>', Ports: '<%@ Ports %>', Login: '<%@ Login %>', 					 
					 Devices: '<%@ Devices %>', HideOccupied: '<%@ Hide occupied %>', Comment: '<%@ Comment %>',
                     Policy: '<%@ Policy %>', DeviceList: '<%@ Devices List %>', Address: '<%@ Address %>',
					 Uptime: '<%@ Uptime %>', Account: '<%@ Account %>'};
</script>
<script type='text/javascript' src='js/treegrid/TreeGrid.packed.js'></script>
<script type="text/javascript" src="js/inventory_devicetree.js"></script>
<script type="text/javascript" >
Ext.onReady( function() { 
	Ext.QuickTips.init();			
	DeviceTree.show();		
});
</script>
<table align="center" style="margin-top: -2">	
	<tr>
		<td id="_devices_"></td>
	</tr>
</table>	
