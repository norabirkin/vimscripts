<script language="javascript">
	var Localize = { Add: '<%@ Add %>', Change: '<%@ Change %>', Search: '<%@ Search %>', Remove: '<%@ Remove %>',
					 Choose: '<%@ Choose %>', Undefined: '<%@ Undefined %>', Address: '<%@ Address %>', AddressBook: '<%@ Address book %>',
					 Country: '<%@ Country %>', Region: '<%@ Region %>', District: '<%@ District %>',
					 City: '<%@ City %>', Settlement: '<%@ Area %>', Save: '<%@ Save %>',
					 Type: '<%@ Type %>', WldAdd: '<%@ Whould You like to add %>', Street: '<%@ Street %>',
					 Building: '<%@ Building %>', Block: '<%@ Block %>', PostCode: '<%@ Post code %>',
					 Flat: '<%@ Flat %>', Office: '<%@ Office %>', Cancel: '<%@ Cancel %>',
					 NewEntry: '<%@ New entry %>', NoMatch: '<%@ There is no matches for %>',
					 Undefined: '<%@ Undefined %>', AutoNum: '<%@ Auto numbering %>',
					 AddNewRecord: '<%@ Add new record %>', Countries: '<%@ Countries %>', Regions: '<%@ Regions %>',
					 Districts: '<%@ Districts %>', Cities: '<%@ Cities %>', Settlements: '<%@ Areas %>',
					 Streets: '<%@ Streets %>', Buildings: '<%@ Buildings %>', Flats: '<%@ Flats %>',
					 Offices: '<%@ Offices %>', UndefinedType: '<%@ There is undefined item type %>',
					 Address: '<%@ Address %>', DeviceTpl: '<%@ Device template %>',
					 Name: '<%@ Name %>', Description: '<%@ Description %>', Value: '<%@ Value %>',
					 Speed: '<%@ Speed %>', Media: '<%@ Media %>', Vlan: 'Vlan', NotBlank: '<%@ Blank is not allowed %>',
					 Status: '<%@ Status %>', fromTpl: '<%@ Create from template %>', editTpl: '<%@ Edit template %>',
					 Edit: '<%@ Edit %>', Properties: '<%@ Properties %>', PortTpl: '<%@ Port template %>',
					 DevGroups: '<%@ Device groups %>', DevName: '<%@ Device name %>', All: '<%@ All %>',
					 GroupOfDev: '<%@ Group of devices %>', AllDevices: '<%@ All devices %>',
					 Account: '<%@ Account %>', BindAccountToPort: '<%@ Bind account to port %>' ,
					 Address: '<%@ Address %>', Next: '<%@ Next %>', Accounts: '<%@ Accounts %>', DevPorts: '<%@ Device ports %>',
					 AccountIsBind: '<%@ Account is already bind %>', Device: '<%@ Device %>', Port: '<%@ Port %>',
					 ChangePortAccount: '<%@ Change account's port %>', CreateGroup: '<%@ Create group %>',
					 ChangeGroup: '<%@ Change group %>', DeleteGroup: '<%@ Delete group %>', Save: '<%@ Save %>',
                     GroupFields: '<%@ Group fields %>',Description: '<%@ Description %>', Field: '<%@ Field %>', Value: '<%@ Value %>',
                     Text: '<%@ Text %>', List: '<%@ List %>',
					 Properties: '<%@ Properties %>', Ports: '<%@ Ports %>', Template: '<%@ Template %>',
					 Groups: '<%@ Groups %>',  Login: '<%@ Login %>', Agreement: '<%@ Agreement %>',
					 PersonFullName: '<%@ Person full name %>', SaveAlert: '<%@ Save changes before action %>',
					 InGroups: '<%@ In groups %>', EditPorts: '<%@ Edit ports %>', Agent: '<%@ Agent %>',
					 DevicesConnection: '<%@ Devices connection %>', Devices: '<%@ Devices %>',
					 PortIsBind: '<%@ bind to account %>', Continue: '<%@ Continue %>',
					 PortIsConnected: '<%@ connected to device %>', HideOccupied: '<%@ Hide occupied %>', Comment: '<%@ Comment %>',
                     Template: '<%@ Template %>', Policy: '<%@ Policy %>', Number: '<%@ Number %>'};
</script>
<script type="text/javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/address.js"></script>
<script type="text/javascript" src="js/bind_account.js"></script>
<script type="text/javascript" src="js/vlans.js"></script>
<script type="text/javascript" src="js/inventory.js"></script>
<script type="text/javascript" >
Ext.onReady( function() {
	Ext.QuickTips.init();
	var p = new Inventory.EditDevicesPanel();
	p.render("_devices_");
});
</script>

<!--<table align="center" width="960" class="table_comm">
	<tr>
		<td class="td_head_ext"><%@ Edit devices %></td>
	</tr>
</table>-->
<table align="center" style="margin-top: -2">
	<tr>
		<td id="_devices_"></td>
	</tr>
</table>
<form method="POST" action="config.php" name="inventory_add_device" id="_inventory_add_device_">
<input type="hidden" id="_devision_" name="devision" value="207">
<input type="hidden" id="_device_" name="device" value="">
<input type="hidden" id="_group_id_" name="group_id" value="">
</form>
