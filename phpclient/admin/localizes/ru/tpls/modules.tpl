<script type="text/javascript" src="js/modules.js"></script>

<script language="javascript">
	var Localize = { Network: '<%@ Network %>', Mask: '<%@ Mask %>', Ignore: '<%@ Ign-re %>', Add: '<%@ Add %>', Remove: '<%@ Remove %>', IgnLocalTraf: '<%@ Ignore %> <%@ local %> <%@ traffic %>', InterfaceName: '<%@ Interface name %>', Secret: '<%@ Secret %>', Guest: '<%@ Guest %>', Description: '<%@ Description %>', BlockUp: '<%@ Block up %>', NotUse: '<%@ Not use %>', All: '<%@ All %>', AclSet: '<%@ ACL settings %>', Account: '<%@ Account %>', Tarif: '<%@ Tarif %>', Union: '<%@ Union %>', Unions: '<%@ Unions %>', Tarifs: '<%@ Tarifs %>', BlockFor: '<%@ Block for %>', Cancel: '<%@ Cancel %>', Type: '<%@ Type %>', Value: '<%@ Value %>', Rule: '<%@ rule %>', DenyRule: '<%@ deny rule %>', always: '<%@ always %>' }
</script>
<form method="POST" action="config.php" id="_Modules">
<input type="hidden" id="_devision_" name="devision" value="1">
<input type="hidden" id="_module_" name="module" value="{MODULE}">
<!-- BEGIN smDis --><input type="hidden" id="" name="disabled_value_use_smartcards" value="{DISABLED_VALUE_USE_SMARTCARDS}"><!-- END smDis -->
<!-- BEGIN ignlocalHid --><input type="hidden" id="_ignorelocal_" name="ignorelocal" value="{MODIGNLOCAL}"><!-- END ignlocalHid -->

<table align="center" width="960" class="table_comm">
	<tr><td class="td_head_ext"  colspan="2"><%@ Modules settings %></td></tr>
	<tr height="40">
		<td class="td_comm" >

			<button type="submit" name="save" title="<%@ Save %>" onClick="Storages.extract(this.form.id);"><img border="0" src="images1/create1.gif" title="<%@ Save %>"></button><b><%@ Save %></b>

			<!-- BEGIN editNetw -->
            <a href='#' class="menuImgLink netw" onClick="networksEditor();return false;"><%@ Networks configuration %></a>
            <!-- END editNetw -->

			<!-- BEGIN editNas -->
            <a href='#' class="menuImgLink rnas" onClick="return nasEditor();return false;"><%@ Gateway servers %></a>
            <!-- END editNas -->

		</td>
	</tr>
</table>

<!-- BEGIN ErrorState -->
<table align="center" width="960" class="table_comm" style="border: none; margin-top: 22px;">
<!-- BEGIN errorCreateAgentOption --><tr><td class="td_comm td_bold td_padding_l7" style="color: red;">{ERROR_AGENT_OPTION_CREATE}</td></tr><!-- END errorCreateAgentOption -->
<!-- BEGIN SaveStateOk --><tr><td class="td_comm td_bold td_padding_l7" style="color: green;"><%@ Request done successfully %></td></tr><!-- END SaveStateOk -->
</table>
<!-- END ErrorState -->

<table align="center" width="960" class="table_comm" style="margin-top: 22px">
	<tr><td colspan="2" class="td_head_ext"><%@ Common %> <%@ settings %></td></tr>
	<tr>
		<td <!-- BEGIN hideHeadDB -->colspan="2"<!-- END hideHeadDB -->class="td_head" width="50%"><%@ Module type %> / <%@ Description %></td>
		<!-- BEGIN showHeadDB --><td class="td_head" width="50%"><%@ Database access %></td><!-- END showHeadDB -->
	</tr>
	<tr>
		<td <!-- BEGIN hideFieldsDB -->colspan="2"<!-- END hideFieldsDB --> class="td_comm td_padding_l7" width="50%" valign="top">
			<table class="table_comm" style="border: none; margin-bottom: 5px"  <!-- BEGIN hideWidthDB -->width="50%"<!-- END hideWidthDB --> <!-- BEGIN showWidthDB -->width="85%"<!-- END showWidthDB -->>
			<tr><td class="td_comm" style="border: none" width="40%"><%@ Type %>:</td>
			<td class="td_comm" style="border: none" width="60%">
				<select name="moduleType" id="_moduleType_" style="width: 220px" onChange="ifGroup(this.form.id, this);">
				<!-- BEGIN moduleOpt --><option value="{MODULETYPE}" group="{MODULEGRP}" <!-- BEGIN moduleOptSel -->selected<!-- END moduleOptSel -->>{MODULEDESCR}</option><!-- END moduleOpt -->
				</select>
			</td></tr>
			<tr><td class="td_comm" style="border: none" width="40%"><%@ Service name %>:</td>
			<td class="td_comm" style="border: none" width="60%">
				<input type="text" id="_servicename_" name="servicename" style="width: 220px" value="{SERVICENAME}"></td></tr>
			<tr>
                <td class="td_comm" style="border: none" width="40%"><%@ Description %>:</td>
                <td class="td_comm" style="border: none" width="60%">
                    <input type="text" id="_descr_" name="descr" style="width: 220px;" value="{MDDESCR}">
                </td>
            </tr>
            <!-- BEGIN isUsbox --><tr>
                <td class="td_comm" style="border: none" width="40%"><%@ Module %> <%@ D-TV %> :</td>
                <td class="td_comm" style="border: none" width="60%">
                    <input type="checkbox" name="use_cas" onClick="changeVar(this); this.form.submit();" value="{USECAS}" <!-- BEGIN usingCas -->checked<!-- END usingCas --> <!-- BEGIN usingCasDis -->disabled<!-- END usingCasDis -->>
                </td>
            </tr><!-- END isUsbox -->
			</table>
		</td>
		<!-- BEGIN showFieldsDB -->
		<td class="td_comm td_padding_l7" width="50%" valign="top">
			<table class="table_comm" style="border: none" width="83%">
                <tr><td class="td_comm" style="border: none" width="50%"><%@ Database %>, IP:</td>
                <td class="td_comm" style="border: none" width="50%"><input type="text" id="_naip_" name="naip" value="{NAIP}"></td></tr>
                <tr><td class="td_comm" style="border: none" width="50%"><%@ Database %>, <%@ name %>:</td>
                <td class="td_comm" style="border: none" width="50%"><input type="text" id="_nadb_" name="nadb" value="{NADB}"></td></tr>
                <tr><td class="td_comm" style="border: none" width="50%"><%@ Database %>, <%@ user %>:</td>
                <td class="td_comm" style="border: none" width="50%"><input type="text" id="_nausername_" name="nausername" value="{NAUSERNAME}"></td></tr>
                <tr><td class="td_comm" style="border: none" width="50%"><%@ Database %>, <%@ password %>:</td>
                <td class="td_comm" style="border: none" width="50%"><input type="text" id="_napass_" name="napass" value="{NAPASS}"></td></tr>
			</table>
		</td>
		<!-- END showFieldsDB -->
	</tr>
	<!-- BEGIN moduleGroup_1 -->
<!--	<tr>
		<td class="td_head" width="100%" colspan=2><%@ Networks %> / <%@ Description %></td>
	</tr>

	<tr>
        <td class="td_comm" width="100%" colspan=2 style="border-right: none" valign="top" id="_NasSegList"></td>
    </tr>
-->
	<tr>
		<td class="td_head" width="100%" colspan=2><%@ Ignore %> <%@ networks %></td>
	</tr>
    <tr>
		<!--<td class="td_comm" width="50%" style="border-right: none" valign="top" id="_NetworksList"></td>-->
        <!--<td class="td_comm" width="50%" style="border-right: none" valign="top" id="_NasSegList"></td>-->
		<td class="td_comm" colspan=2 valign="top" id="_IgnoreNetworksList"></td>
	</tr>
    <!-- END moduleGroup_1 -->

	<!-- BEGIN moduleGroup_2 -->
	<!--<tr>-->
	<!--	<td class="td_head" width="100%" colspan=2><%@ Gateway servers %></td>-->
	<!--</tr>-->
	<!--<tr>-->
	<!--	<td class="td_comm" width="100%" colspan=2 style="border-right: none" valign="top" id="_NasList"></td>-->
	<!--</tr>-->
	<!--<tr>-->
	<!--	<td class="td_head" width="100%" colspan=2><%@ Networks %></td>-->
	<!--</tr>-->
	<!--<tr>-->
	<!--	<td class="td_comm" width="100%" colspan=2 valign="top" id="_NasSegList"></td>-->
	<!--</tr>-->

    <!-- END moduleGroup_2 -->

	<!-- BEGIN moduleSpecGroup_1 -->
    <tr>
        <td colspan="2" class="td_head_ext"><%@ Specific %> <%@ settings %></td>
    </tr>
    <tr id="_ETH_" <!-- BEGIN ETH -->style="display: none"<!-- END ETH -->>
		<td class="td_comm td_padding_l7" width="50%" valign="top">
			<table class="table_common" style="border: none; <!-- BEGIN UlogTee -->display: none"<!-- END UlogTee -->" width="80%" id="_UlogTee_">
			<tr id="_NetLink_" <!-- BEGIN NetLink -->style="display: none"<!-- END NetLink -->><td class="td_comm" style="border: none" width="30%">Netlink <%@ group %>:</td>
			<td class="td_comm" style="border: none" width="70%"><input type="text" id="_netgrp_" name="netgrp" style="width: 80px" value="{NETGRP}"></td></tr>
			<tr id="_Divert_" <!-- BEGIN Divert -->style="display: none"<!-- END Divert -->><td class="td_comm" style="border: none" width="30%">Divert <%@ port %>:</td>
			<td class="td_comm" style="border: none" width="70%"><input type="text" id="_dvport_" name="dvport" style="width: 80px" value="{DIVERTPORT}"></td></tr>
			</table>
			<table class="table_common" style="border: none;" width="100%">
			<tr><td class="td_comm" style="border: none" width="87%"><%@ Ignore traffic for blocked accounts %>:</td>
			<td class="td_comm" style="border: none" width="13%"><input type="checkbox" id="_ethblockedacc_" name="ethblockedacc" value="1" <!-- BEGIN ETHBLOCKEDACC -->checked<!-- END ETHBLOCKEDACC -->></td></tr>
			<tr><td class="td_comm" style="border: none" width="87%"><%@ Ignore local traffic %>:</td>
                <td class="td_comm" style="border: none" width="13%"><input type="checkbox" id="_ignorelocal_" name="ignorelocal" value="1" <!-- BEGIN ETHIgnoreLocalCheck -->checked<!-- END ETHIgnoreLocalCheck -->></td></tr>
			</table>
		</td>
		<td class="td_comm" width="50%" valign="top" id="_NetFaces"></td>
	</tr>
	<tr id="_NetFlowSflow_" <!-- BEGIN NetFlowSflow -->style="display: none"<!-- END NetFlowSflow -->>
		<td class="td_comm td_padding_l7" width="50%" valign="top" height="50">

			<table class="table_common" style="border: none" width="80%">
                <tr id="_LocalAS_" <!-- BEGIN LocalAS -->style="display: none"<!-- END LocalAS -->>
                    <td class="td_comm" style="border: none" width="60%">
                        <%@ Local AS %>:
                    </td>
                    <td class="td_comm" style="border: none" width="40%">
                        <input type="text" id="_localasnum_" name="localasnum" style="width: 80px" value="{LOCALASNUM}">
                    </td>
                </tr>
			</table>

			<table class="table_common" style="border: none;" width="100%">
                <tr><td class="td_comm" style="border: none" width="87%"><%@ Ignore traffic for blocked accounts %>:</td>
                <td class="td_comm" style="border: none" width="13%"><input type="checkbox" id="_flowblockedacc_" name="flowblockedacc" value="1" <!-- BEGIN FLOWBLOCKEDACC -->checked<!-- END FLOWBLOCKEDACC -->></td></tr>
                <tr><td class="td_comm" style="border: none" width="87%"><%@ Ignore local traffic %>:</td>
                <td class="td_comm" style="border: none" width="13%"><input type="checkbox" id="_ignorelocal_" name="ignorelocal" value="1" <!-- BEGIN FLOWIgnoreLocalCheck -->checked<!-- END FLOWIgnoreLocalCheck -->></td></tr>
			</table>
		</td>
		<td class="td_comm td_padding_l7" width="50%" valign="top" height="50">
			<table class="table_common" style="border: none" width="83%">
			<tr><td class="td_comm" style="border: none" width="33%"><%@ Listen %> IP:</td>
			<td class="td_comm" style="border: none" width="67%"><input type="text" id="_nfhost_" name="nfhost" style="width: 180px" value="{NFHOST}"></td></tr>
			<tr><td class="td_comm" style="border: none" width="33%"><%@ Listen %> Port:</td>
			<td class="td_comm" style="border: none" width="67%"><input type="text" id="_nfport_" name="nfport" style="width: 80px" value="{NFPORT}"></td></tr>
			</table>
		</td>
	</tr><!-- END moduleSpecGroup_1 -->
	<!-- BEGIN moduleSpecGroup_2 --><tr><td colspan="2" class="td_head_ext"><%@ Specific %> <%@ settings %></td></tr>
	<tr><td class="td_comm td_padding_l7" width="50%" valign="top">
		<table class="table_common" style="border: none" width="98%">
		<tr><td class="td_comm" style="border: none" width="33%"><%@ Listen %> IP:</td>
		<td class="td_comm" style="border: none" width="67%"><input type="text" id="_nfhost_" name="nfhost" style="width: 180px" value="{NFHOST}"></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Port %> RADIUS authentication:</td>
		<td class="td_comm" style="border: none"><input type="text" id="_rauthport_" name="rauthport" style="width: 80px" value="{RAUTHPORT}"></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Port %> RADIUS accounting:</td>
		<td class="td_comm" style="border: none" width="30%"><input type="text" id="_raccport_" name="raccport" style="width: 80px" value="{RACCPORT}"></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Module accounts manipulate %>:</td>
		<td class="td_comm" style="border: none">
		<select name="remulateonnaid" id="_remulateonnaid_" style="width: 120px" onChange="onEmulUpdate(this.value)"><!-- BEGIN remulItem --><option value="{REMULID}" <!-- BEGIN remulSel -->selected<!-- END remulSel -->>{REMULNAME}</option><!-- END remulItem --></select></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Authorize no existing users to guest network %>:</td>
		<td class="td_comm" style="border: none" width="30%"><input type="checkbox" id="_authunknown_" name="authunknown" value="1" <!-- BEGIN AuthUnknown -->checked<!-- END AuthUnknown -->></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Do not send attribute %> Framed-IP-Address:</td>
		<td class="td_comm" style="border: none" width="30%"><input type="checkbox" id="_noframedip_" name="noframedip" value="1" <!-- BEGIN NoFramedIP -->checked<!-- END NoFramedIP -->></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Save MAC-address from RADIUS-requests %>:</td>
		<td class="td_comm" style="border: none" width="30%"><input type="checkbox" id="_radius_insert_mac_staff_" name="radius_insert_mac_staff" value="1" <!-- BEGIN RadiusInsertMacStaff -->checked<!-- END RadiusInsertMacStaff -->></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Keep only last auth info %>:</td>
		<td class="td_comm" style="border: none" width="30%"><input type="checkbox" id="_radius_keep_only_last_auth_info_" name="radius_keep_only_last_auth_info" value="1" <!-- BEGIN RadiusKeepOnlyLastauthInfo -->checked<!-- END RadiusKeepOnlyLastauthInfo -->></td></tr>
        <tr><td class="td_comm" style="border:none" colspan="2">
            <fieldset>
                <legend>DHCP <%@ Server %></legend>
                <table class="table_common" style="border: none" width="100%">
                <tr><td class="td_comm" style="border:none;" width="33%"><%@ Port %><td>
                <td class="td_comm" style="border:none;"><input type="text" id="_dhcpd_port_" name="dhcpd_port" value="{DHCPPORT}" onblur="DHCPFields(this)"></td></tr>
                <tr><td class="td_comm" style="border:none;" width="33%"><%@ Address %><td>
                <td class="td_comm" style="border:none;"><input type="text" id="_dhcpd_ip_" name="dhcpd_ip" value="{DHCPIP}"></td></tr>
                <tr <!-- BEGIN dhcp_domain_name -->style="display:none;"<!-- END dhcp_domain_name -->><td class="td_comm" style="border:none;" width="33%">"dhcp-domain-name"<td>
                <td class="td_comm" style="border:none;"><input type="text" name="dhcp-domain-name" value="{DHCPDOMAINNAME}"></td></tr>
                <tr <!-- BEGIN dhcp_identifier -->style="display:none;"<!-- END dhcp_identifier -->><td class="td_comm" style="border:none;" width="33%">"dhcp-identifier"<td>
                <td class="td_comm" style="border:none;"><input type="text" name="dhcp-identifier" value="{DHCPIDENTIFIER}"></td></tr>
                <tr <!-- BEGIN dhcp_lease_time -->style="display:none;"<!-- END dhcp_lease_time -->><td class="td_comm" style="border:none;" width="33%">"dhcp-lease-time"<td>
                <td class="td_comm" style="border:none;"><input type="text" name="dhcp-lease-time" value="{DHCPLEASETIME}"></td></tr>
                <tr <!-- BEGIN radius_nameserver -->style="display:none;"<!-- END radius_nameserver -->><td class="td_comm" style="border:none;" width="33%">"radius-nameserver"<td>
                <td class="td_comm" style="border:none;"><input type="text" name="radius-nameserver" value="{RADIUSNAMESERVER}"></td></tr>
                <tr <!-- BEGIN radius_nameserver2 -->style="display:none;"<!-- END radius_nameserver2 -->><td class="td_comm" style="border:none;" width="33%">"radius-nameserver2"<td>
                <td class="td_comm" style="border:none;"><input type="text" name="radius-nameserver2" value="{RADIUSNAMESERVER2}"></td></tr>
                </table>
            </fieldset>
        </td></tr>
		</table>
	</td><td class="td_comm td_padding_l7" width="50%" valign="top">
		<table class="table_common" style="border: none" width="98%">
		<tr><td class="td_comm" style="border: none"><%@ Execute script_stop for the buzz sessions %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_radstopexpired_" name="radstopexpired" value="1" <!-- BEGIN radstopexpired -->checked<!-- END radstopexpired -->></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Execute script_stop when shape rate was changed %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_restartshape_" name="restartshape" value="1" <!-- BEGIN restartshape -->checked<!-- END restartshape -->></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Dynamic address pool %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_raddrpool_" name="raddrpool" value="1" <!-- BEGIN raddrpool -->checked<!-- END raddrpool --> onClick="if(this.checked) { elementState('_savestataddr_', false); elementState('_nobroadcast_', false); } else { elementState('_savestataddr_', true); elementState('_nobroadcast_', true); }"></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Keep in mind static addresses %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_savestataddr_" name="savestataddr" value="1" <!-- BEGIN savestataddr -->checked<!-- END savestataddr --> <!-- BEGIN savestataddr_dis -->disabled<!-- END savestataddr_dis -->></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Exclude broadcast addresses %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_nobroadcast_" name="nobroadcast" value="1" <!-- BEGIN nobroadcast -->checked<!-- END nobroadcast --> <!-- BEGIN nobroadcast_dis -->disabled<!-- END nobroadcast_dis -->></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Ignore traffic for blocked accounts %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_radblockedacc_" name="radblockedacc" value="1" <!-- BEGIN RADBLOCKEDACC -->checked<!-- END RADBLOCKEDACC -->></td></tr>
		<tr><td class="td_comm" style="border: none" width="70%"><%@ Dead session timeout %> (<%@ sec-s %>):</td>
		<td class="td_comm" style="border: none" width="30%"><input type="text" id="_sessionlifetime_" name="sessionlifetime" style="width: 80px" value="{SESSIONLIFETIME}"></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Session time to live %> (<%@ sec-s %>):</td>
		<td class="td_comm" style="border: none"><input type="text" id="_maxradiustimeout_" name="maxradiustimeout" style="width: 80px" value="{MAXRADIUSTIMEOUT}"></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Certification EAP password %>:</td>
		<td class="td_comm" style="border: none"><input type="password" id="_eapcertpassword_" name="eapcertpassword" style="width: 120px" value="{EAPCERTPASSWORD}"></td></tr>
		</table>
	</td></tr><!-- END moduleSpecGroup_2 -->
	<!-- BEGIN moduleSpecGroup_3 --><tr><td colspan="2" class="td_head_ext"><%@ Specific %> <%@ settings %></td></tr>
	<tr><td class="td_comm td_padding_l7" width="50%" valign="top">
		<table class="table_common" style="border: none" width="98%">
		<!-- BEGIN ifRawCopy --><tr><td class="td_comm" style="border: none" width="45%"><%@ Dump stream to file %>:</td>
		<td class="td_comm" style="border: none" width="55%"><input type="text" id="_telrawcopy_" name="telrawcopy" style="width: 205px" value="{TELRAWCOPY}"></td></tr><!-- END ifRawCopy -->
		<tr><td class="td_comm" style="border: none"><%@ Algorithm to identify call direction %>:</td>
		<td class="td_comm" style="border: none">
		<select name="teldirectionmode" id="_teldirectionmode_" style="width: 205px" onChange="if(this.value == 3 && this.form.opercat.value != 0){ this.value = 1 }"><option value="0" <!-- BEGIN teldirSel_0 -->selected<!-- END teldirSel_0 -->><%@ Default %></option><option value="1" <!-- BEGIN teldirSel_1 -->selected<!-- END teldirSel_1 -->><%@ Phone numbers %></option></select></td></tr>
		<tr><td class="td_comm" style="border: none"><%@ Take stock of broken calls %>:</td>
		<td class="td_comm" style="border: none"><input type="checkbox" id="_failedcalls_" name="failedcalls" value="1" <!-- BEGIN failcallsCheck -->checked<!-- END failcallsCheck -->></td></tr>
        <tr><td class="td_comm" style="border: none" width="70%"><%@ Delayed tarification %>:</td>
        <td class="td_comm" style="border: none" width="30%"><input type="checkbox" id="_instantly_amount_" name="instantly_amount" value="0" <!-- BEGIN InstantlyAmount -->checked<!-- END InstantlyAmount -->></td></tr>
		<!-- BEGIN ifAGPhone --><tr><td class="td_comm" style="border: none"><%@ Identify operator %>:</td>
		<td class="td_comm" style="border: none"><select name="opercat" id="_opercat_" style="width: 205px" onChange="if(this.value != 0){ this.form.teldirectionmode.value = 0 }"><option value="0" <!-- BEGIN opercatSel_0 -->selected<!-- END opercatSel_0 -->><%@ Operator attribute %></option><option value="1" <!-- BEGIN opercatSel_1 -->selected<!-- END opercatSel_1 -->><%@ Catalogue ph. numbers %></option></select></td></tr><!-- END ifAGPhone -->
		</table>
	</td><td class="td_comm td_padding_l7" width="50%" valign="top">
		
	</td></tr>
    <!-- END moduleSpecGroup_3 -->
	<!-- BEGIN moduleSpecGroup_4 -->
    <tr><td class="td_head_ext"><%@ Specific %> <%@ settings %></td><td class="td_head_ext"><%@ Options %></td></tr>
	<tr>
        <td class="td_comm td_padding_l7" width="50%" valign="top">
            <table class="table_common" style="border: none" width="98%">
            <tr><td class="td_comm" style="border: none"><%@ Port %> RADIUS authentication:</td>
            <td class="td_comm" style="border: none"><input type="text" id="_rauthport_" name="rauthport" style="width: 80px" value="{RAUTHPORT}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="70%"><%@ Port %> RADIUS accounting:</td>
            <td class="td_comm" style="border: none" width="30%"><input type="text" id="_raccport_" name="raccport" style="width: 80px" value="{RACCPORT}"></td></tr>
            <tr>
            <td class="td_comm" style="border: none" width="65%"><%@ Save unsuccessful calls %>:</td>
            <td class="td_comm" style="border: none" width="35%"><input type="checkbox" id="_failedcalls_" name="failedcalls" value="1" <!-- BEGIN failedCalls -->checked<!-- END failedCalls -->></td>
            </tr>
            <tr>
            <td class="td_comm" style="border: none"><%@ Timeout of dead session %> (<%@ sec-s %>):</td>
            <td class="td_comm" style="border: none"><input type="text" id="_sessionlifetime_" name="sessionlifetime" style="width: 80px;" value="{SESSIONLIFETIME}"></td>
            </tr>
            <tr>
            <td class="td_comm" style="border: none"><%@ Call maximum duration %> (<%@ sec-s %>):</td>
            <td class="td_comm" style="border: none"><input type="text" id="_maxradiustimeout_" name="maxradiustimeout" style="width: 80px;" value="{MAXRADIUSTIMEOUT}"></td>
            </tr>
            <td class="td_comm" style="border: none"><%@ Activated card common User-Name %>:</td>
            <td class="td_comm" style="border: none"><input type="text" id="_voipcarduser_" name="voipcarduser" style="width: 150px;" value="{VOIPCARDUSER}"></td>
            </tr>
            <!-- BEGIN ifAGVoip --><tr><td class="td_comm" style="border: none"><%@ Identify operator %>:</td>
            <td class="td_comm" style="border: none"><select name="opercat" id="_opercat_" style="width: 205px"><option value="0" <!-- BEGIN ifAGVoipSel_0 -->selected<!-- END ifAGVoipSel_0 -->><%@ Operator attribute %></option><option value="1" <!-- BEGIN ifAGVoipSel_1 -->selected<!-- END ifAGVoipSel_1 -->><%@ Catalogue ph. numbers %></option></select></td></tr><!-- END ifAGVoip -->
            </table>
        </td>
        <td class="td_comm td_padding_l7" width="50%" valign="top">
            <table class="table_common" style="border: none" width="88%">
            <tr><td class="td_comm" style="border: none" width="60%"><%@ Timeout to store data %>:</td>
            <td class="td_comm" style="border: none" width="30%"><input type="text" id="_flush_" name="flush" style="width: 80px" value="{FLUSH}"></td><td class="td_comm" style="border: none" width="10%">(<%@ sec-s %>.)</td></tr>
            <tr><td class="td_comm" style="border: none" width="60%"><%@ Timeout to check status off %>:</td>
            <td class="td_comm" style="border: none" width="30%"><input type="text" id="_timer_" name="timer" style="width: 80px" value="{TIMER}"><td class="td_comm" style="border: none" width="10%">(<%@ sec-s %>.)</td></td></tr>
            <tr><td class="td_comm" style="border: none" width="60%"><%@ Keep detail data in the storage %>:</td>
            <td class="td_comm" style="border: none" width="30%"><input type="text" id="_keepdetail_" name="keepdetail" style="width: 80px" onFocus="keepDtField(this)" onBlur="keepDtField(this, 1)" value="{KEEPDETAIL}"><td class="td_comm" style="border: none" width="10%">(<%@ days %>)</td></td></tr>
            </table>
        </td>
    </tr>
    <!-- END moduleSpecGroup_4 -->
	<!-- BEGIN moduleSpecGroup_5 --><tr><td class="td_head_ext"><%@ Specific %> <%@ settings %></td><td class="td_head_ext">&nbsp;</td></tr>
	<tr><td class="td_comm td_padding_l7" width="50%" valign="top">
		<table class="table_common" style="border: none" width="98%">
		<tr><td class="td_comm" style="border: none" width="80%"><%@ Assign services of the tariff which was scheduled %>:</td>
		<td class="td_comm" style="border: none" width="20%"><input type="checkbox" id="_ignorelocal_" name="ignorelocal" value="1" <!-- BEGIN UServOnRasp -->checked<!-- END UServOnRasp -->></td></tr>
		</table>
	</td><td class="td_comm td_padding_l7" width="50%" valign="top">
	<!-- BEGIN use_dtv -->
		<fieldset>
            <legend><%@ D-TV %></legend>
            <table class="table_comm" style="border: none" width="100%">
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Use smartcards %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="checkbox" onClick="changeVar(this); " id="use_smartcards" name="use_smartcards" value="{USESMCARDS}" <!-- BEGIN usingSmcards -->checked<!-- END usingSmcards --> <!-- BEGIN usingSmcardsDis -->disabled<!-- END usingSmcardsDis -->></td></tr>            
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Address %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="cas_host" value="{CASHOST}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Port %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="cas_port" value="{CASPORT}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Operator %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="operator_tag" value="{OPERATORTAG}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Country %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="nationality" value="{NATIOANLITY}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Region %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="region" value="{CASREGION}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Period to refresh package list %> (<%@ sec-s %>):</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="refresh_sec" value="{CASREFRESHSEC}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ City code %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="city_code" value="{CASCITYCODE}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Channels filter %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="channels_filter" value="{CHANNELS_FILTER}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Do not turn off required channels %>, <%@ months %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="keep_turned_on_month" value="{KEEPTURNEDON}"></td></tr>            
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Login %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="middleware_login" value="{MDLOGIN}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Password %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="middleware_password" value="{MDPASS}"></td></tr>
            <!-- BEGIN not_hybrid -->
            <tr><td class="td_comm" style="border: none" width="80%"><%@ HTTP endpoint %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="middleware_http_endpoint" value="{MDENDPOINT}"></td></tr>
            <!-- END not_hybrid -->
            
            <!-- BEGIN use_hybrid -->
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Middleware session endpoint %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="middleware_session_endpoint" value="{MDSESSIONENDPOINT}"></td></tr>
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Middleware provisioning endpoint %>:</td>
            <td class="td_comm" style="border: none" width="20%"><input type="text" name="middleware_provisioning_endpoint" value="{MDPROVISENDPOINT}"></td></tr>
            <!-- END use_hybrid -->
            
            
            <tr><td class="td_comm" style="border: none" width="80%"><%@ Type %>:</td>
            <td class="td_comm" style="border: none" width="20%">
            
			<select name="dtv_type" id="dtv_type" style="width: 130px" onChange="changeDtvType(this.form.id, this); ">
				<!-- BEGIN dtvOpt --><option value="{DTVTYPE}" <!-- BEGIN dtvOptSel -->selected<!-- END dtvOptSel -->>{DTVTYPEDESCR}</option><!-- END dtvOpt -->
			</select>
			
			</td></tr>
            </table>
        </fieldset>
        <!-- END use_dtv -->
	</td></tr><!-- END moduleSpecGroup_5 -->
	<!-- BEGIN moduleOptions --><tr><td colspan="2" class="td_head_ext"><%@ Options %></td></tr>
	<tr>
		<td class="td_comm td_padding_l7" style="border-right: none" width="50%" valign="top" height="50">
			<table class="table_common" style="border: none" width="88%">
			<tr><td class="td_comm" style="border: none" width="60%"><%@ Timeout to store data %>:</td>
			<td class="td_comm" style="border: none" width="30%"><input type="text" id="_flush_" name="flush" style="width: 80px" value="{FLUSH}"></td><td class="td_comm" style="border: none" width="10%">(<%@ sec-s %>.)</td></tr>
			<tr><td class="td_comm" style="border: none" width="60%"><%@ Timeout to check status off %>:</td>
			<td class="td_comm" style="border: none" width="30%"><input type="text" id="_timer_" name="timer" style="width: 80px" value="{TIMER}"><td class="td_comm" style="border: none" width="10%">(<%@ sec-s %>.)</td></td></tr>
			<tr><td class="td_comm" style="border: none" width="60%"><%@ Keep detail data in the storage %>:</td>
			<td class="td_comm" style="border: none" width="30%"><input type="text" id="_keepdetail_" onFocus="keepDtField(this)" onBlur="keepDtField(this, 1)" name="keepdetail" style="width: 80px" value="{KEEPDETAIL}"><td class="td_comm" style="border: none" width="10%">(<%@ days %>)</td></td></tr>
			</table>
		</td>
		<td class="td_comm" width="50%" align="center" valign="top">&nbsp;</td>
	</tr><!-- END moduleOptions -->
</table>
</form>

<table class="table_comm" width="960" align="center" style="margin-top: 22px; border: none; background: none;">
	<tr><td id="_LBPhone"></td></tr>
</table>
