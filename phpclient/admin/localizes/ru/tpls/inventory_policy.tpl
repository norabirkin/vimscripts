<script language="javascript">
	var Localize = { Add: '<%@ Add %>', Change: '<%@ Change %>', Search: '<%@ Search %>', Remove: '<%@ Remove %>',
			 Choose: '<%@ Choose %>', Undefined: '<%@ Undefined %>', Save: '<%@ Save %>', Cancel: '<%@ Cancel %>', 					 
			 Name: '<%@ Name %>', Description: '<%@ Description %>', Script: '<%@ Script %>',					 
			 PortStates: '<%@ Port States %>', Icon: '<%@ Icon %>', 					 
			 Policies: '<%@ Control Policies %>', SaveChanges: '<%@ Save changes before action %>'};
	<!-- BEGIN STATES_ICON --> 
	var states_icon = [{ICONS}];
	<!-- END STATES_ICON -->
</script>
<script type="text/javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/inventory_policy.js"></script>
<script type="text/javascript" >
Ext.onReady( function() { 
	Ext.QuickTips.init();		
	show_grids();
});
</script>
<table align="center"  class="table_comm">	
	<!-- <tr>
		<td class="td_head_ext"><%@ Control Policies %></td>
	</tr> -->	
</table>
<table align="center"  style="margin-top: -2">	
	<tr>
		<td  id="_policies_"></td>
		<td  id="_states_"></td>
	</tr>
</table>	
