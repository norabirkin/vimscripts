<script language="javascript">
	<!-- BEGIN DEVICE_PARAMS -->
	var device_id = {DEVICE_ID};
	var group_id = {GROUP_ID};
	<!-- END DEVICE_PARAMS -->
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
					 Properties: '<%@ Properties %>', Ports: '<%@ Ports %>', Template: '<%@ Template %>',
					 Groups: '<%@ Groups %>',  Login: '<%@ Login %>', Agreement: '<%@ Agreement %>',
					 PersonFullName: '<%@ Person full name %>', SaveAlert: '<%@ Save changes before action %>',
					 InGroups: '<%@ In groups %>', EditPorts: '<%@ Edit ports %>', Agent: '<%@ Agent %>',
					 DevicesConnection: '<%@ Devices connection %>', Devices: '<%@ Devices %>',
					 PortIsBind: '<%@ bind to account %>', Continue: '<%@ Continue %>',
					 PortIsConnected: '<%@ connected to device %>', HideOccupied: '<%@ Hide occupied %>', Comment: '<%@ Comment %>',
                     Template: '<%@ Template %>', Policy: '<%@ Policy %>', Number: '<%@ Number%>',
                     ReturnMsg: '<%@ Return to device list %>', NumerationFromZero: '<%@ Numeration from zero %>'};
</script>
<script type="text/javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/address.js"></script>
<script type="text/javascript" src="js/bind_account.js"></script>
<script type="text/javascript" src="js/vlans.js"></script>
<script type="text/javascript" src="js/inventory.js"></script>
<script type="text/javascript" >
Ext.onReady(function() {
	Inventory.ShowEditDeviceForm();
});
</script>

<input type="hidden" name="address_str" id="Address_0-str" value="">
<input type="hidden" name="address_idx" id="Address_0-hid" value="">

<table align="center" width="960">
	<tr>
		<td id="_device_"></td>
	</tr>
</table>
