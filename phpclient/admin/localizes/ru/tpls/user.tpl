<script type="text/javascript" src="js/agreement.js"></script>
<script type="text/javascript" src="js/charges.js"></script>
<script type="text/javascript" src="js/address.js"></script>
<script type="text/javascript" src="js/user.js"></script>
<script type="text/javascript" src="js/client_devices.js"></script>
<script type="text/javascript" src="js/actions.js"></script>
<script type="text/javascript" src="js/services_packages.js"></script>
<script type="text/javascript" language="javascript">
    var Localize = {
        Add: '<%@ Add %>',
        Change: '<%@ Change %>',
        Search: '<%@ Search %>',
        WindowHead: '<%@ Add %> <%@ agreement %>',
        UseTemplate: '<%@ Use template %>',
        AgrmNum: '<%@ Agreement number %>',
        AgrmNums: '<%@ Agreements %>',
        isDate: '<%@ Date %>',
        ButtAdd: '<%@ Add %>',
        SelectTemplate: '<%@ Select %> <%@ template %>',
        LoginError: '<%@ Incorrect login value %>',
        PassError: '<%@ Incorrect password value %>',
        UName: '<%@ User %>',
        Address: '<%@ Address %>',
        Consistent: '<%@ Consistent-s %> <%@ users %>',
        AddressBook: '<%@ Address book %>',
        Country: '<%@ Country %>',
        Region: '<%@ Region %>',
        District: '<%@ District %>',
        City: '<%@ City %>',
        Settlement: '<%@ Area %>',
        Save: '<%@ Save %>',
        Name: '<%@ Name %>',
        Type: '<%@ Type %>',
        WldAdd: '<%@ Whould You like to add %>',
        Street: '<%@ Street %>',
        Building: '<%@ Building %>',
        Block: '<%@ Block %>',
        PostCode: '<%@ Post code %>',
        Flat: '<%@ Flat %>',
        Office: '<%@ Office %>',
        Cancel: '<%@ Cancel %>',
        NewEntry: '<%@ New entry %>',
        NoMatch: '<%@ There is no matches for %>',
        Undefined: '<%@ Undefined %>',
        AutoNum: '<%@ Auto numbering %>',
        AgrmNoDel: '<%@ Cannot remove agreement there are accounts %>',
        Agreement: '<%@ Agreement %>',
        PersonFullName: '<%@ Person full name %>',
        UserType: '<%@ User type %>',
        Legal: '<%@ Legal person %>',
        Physic: '<%@ Physical person %>',
        SendingData: '<%@ Sending data %>',
        Connecting: '<%@ Connecting %>',
        Choose: '<%@ Choose %>',
        StreetY: '<%@ Street-y %>',
        Edit: '<%@ Edit %>',
        CountryY: '<%@ Country-y %>',
        FlatY: '<%@ Flat-y %>',
        AddNewRecord: '<%@ Add new record %>',
        Countries: '<%@ Countries %>',
        Regions: '<%@ Regions %>',
        Districts: '<%@ Districts %>',
        Cities: '<%@ Cities %>',
        Settlements: '<%@ Areas %>',
        Streets: '<%@ Streets %>',
        Buildings: '<%@ Buildings %>',
        Flats: '<%@ Flats %>',
        Offices: '<%@ Offices %>',
        UndefinedType: '<%@ There is undefined item type %>',
        LegalAddress: '<%@ Legal address %>',
        RegisteredAddress: '<%@ Registered address %>',
        PostAddress: '<%@ Post address %>',
        AddressDeliverInvoice: '<%@ Address to deliver invoice %>',
        Copy: '<%@ Copy %>',
        address: '<%@ address %>',
        ForAll: '<%@ For all %>',
        to: '<%@ to %>',
        CurBalance: '<%@ Current Balance %>',
        SetBalance: '<%@ Set balance value %>',
        PaymentSum: '<%@ Payment sum%>',
        PaymentNumber: '<%@ Pay document number %>',
        PaymentDate: '<%@ Payment date %>',
        PaymentsHistory: '<%@ Show payments history %>',
        Currency: '<%@ Currency %>',
        Comment: '<%@ Comment %>',
        Default: '<%@ Default %>',
        SavePayment: '<%@ Save payment %>',
        Payments: '<%@ Payments %>',
        Payment: '<%@ Payment %>',
        user: '<%@ user %>',
        agreement: '<%@ agreement %>',
        Error: '<%@ Error %>',
        Warning: '<%@ Warning %>',
        Info: '<%@ Info %>',
        RequestSuccessfully: '<%@ Request done successfully %>',
        PromisedPayment: '<%@ Promised payment %>',
        DateOffSebt: '<%@ Date to pay off debt %>',
        MaxPayment: '<%@ Maximum %> <%@ payment %>',
        MinPayment: '<%@ Minimum %> <%@ payment %>',
        AllowedDebt: '<%@ Allowed debt %>',
        PaymentDoesNotDebt: '<%@ This payment does not write off debt %>',
        PromisedExists: '<%@ There is promised payment for this agreement %>',
        PromisedInCredit: '<%@ Attantion! There was promised payment %>',
        DeleteAccount: '<%@ Delete account %>',
        Field: '<%@ Field %>',
        Text: '<%@ Text %>',
        List: '<%@ List %>',
        DefinedValues: '<%@ Defined values %>',
        Description: '<%@ Description %>',
        AgreementProp: '<%@ Agreement properties %>',
        AgrmAddonFields: '<%@ Additional fields for agreements %>',
        Fields: '<%@ Fields %>',
        EmptyList: '<%@ Empty list %>',
        MobileError: '<%@ Mobile Error %>',
		Application: '<%@ Application %>'
}</script>
<form method="POST" action="config.php" id="_User" usecerber="{IFUSECERBER}">

<input type="hidden" id="_devision_" name="devision" value="22">
<input type="hidden" id="_uid_" name="uid" value="{USERID}">
<input type="hidden" id="_vgroups_" name="vgroups" value="">
<input type="hidden" id="_mobileformat_" name="mobileformat" value="{PFORMAT}">

<!-- BEGIN existAgrmDisCode -->
	<input type="hidden" name="agrms[{AGRMID}][code]" value="{D_CODE}">
<!-- END existAgrmDisCode -->

<!-- BEGIN docTypes -->
<input type="hidden" id="option_{DOCTYPEID}" value="{DOCTYPEVALUE}">
<!-- END docTypes -->

<!-- BEGIN uType_log_1 -->
<input type="hidden" id="_uidlog_" name="uidlog" value="{USERID}+{THISUSERNAMEL}">
<!-- END uType_log_1 -->
<!-- BEGIN uType_log_2 -->
<input type="hidden" id="_uidlog_" name="uidlog" value="{USERID}+{THISUSERNAME}">
<!-- END uType_log_2 -->

<!-- BEGIN isTemplate -->
    <input type="hidden" id="_templ_" name="templ" value="{TEMPLATEVALUE}">
<!-- END isTemplate -->

<!-- BEGIN EditUser -->
    <input type="hidden" name="pass_chg" value="{PASSCHG}">
<!-- END EditUser -->

<input type="hidden" name="disable_account_fields" value="{DISABLE_ACCOUNT_FIELDS}">
<!-- BEGIN DisableAccountFieldsForPhysical -->
    <input type="hidden" name="abonentsurname" value="{D_ABONENTSURNAME}">
    <input type="hidden" name="abonentname" value="{D_ABONENTNAME}">
    <input type="hidden" name="abonentpatronymic" value="{D_ABONENTPATRONYMIC}">
    <input type="hidden" name="passsernum" value="{D_PASSPORTSER}">
    <input type="hidden" name="passno" value="{D_PASSPORTNUM}">
    <input type="hidden" name="passissuedep" value="{D_PASSPORTDEP}">
    
<!-- END DisableAccountFieldsForPhysical -->
<!-- BEGIN DisableAccountFieldsForLegal -->
	<input type="hidden" name="name" value="{D_USERNAMEL}">
	<input type="hidden" name="inn" value="{D_INN}">
	<input type="hidden" name="kpp" value="{D_KPP}">
<!-- END DisableAccountFieldsForLegal -->

<!-- BEGIN DisableAccountFieldsForAddon -->
	<input type="hidden" name="addons[text][{D_ADDONTEXTNAME}]" value="{D_ADDONTEXTVALUE}">
<!-- END DisableAccountFieldsForAddon -->

<!-- BEGIN DisableUuid -->
	<input type="hidden" name="uuid" value="{D_UUID}">
<!-- END DisableUuid -->

<!-- BEGIN assignedUG -->
    <input type="hidden" name="user_assigned2group_1[]" value="{UG_ID}">
<!-- END assignedUG -->

<!-- BEGIN existAgrm -->
    <input type="hidden" name="agrms[{AGRMID}][friendagrmid]" value="{AGRM_FRIEND_AGRMID}">
    <input type="hidden" name="agrms[{AGRMID}][friendnumber]" value="{AGRM_FRIEND_NUMBER}">
    <input type="hidden" name="agrms[{AGRMID}][priority]" value="{PRIORITY}">
    <input type="hidden" name="agrms[{AGRMID}][closedon]" value="{CLOSEDON}">
    <input type="hidden" name="agrms[{AGRMID}][installments]" value="{INSTALLMENTS}">
    <input type="hidden" name="agrms[{AGRMID}][parentagrmid]" value="{AGRM_PARENT_AGRMID}">
    <input type="hidden" name="agrms[{AGRMID}][parentnumber]" value="{AGRM_PARENT_NUMBER}">
    <input type="hidden" name="agrms[{AGRMID}][penaltymethod]" value="{AGRM_PENI}">
    <input type="hidden" name="agrms[{AGRMID}][num]" value="{AGRM_STRING}">
    <input type="hidden" name="agrms[{AGRMID}][date]" value="{AGRM_DATE}">
    <input type="hidden" name="agrms[{AGRMID}][oper]" value="{AGRM_OPERID}">
    <input type="hidden" name="agrms[{AGRMID}][vgroups]" value="{AGRM_VGROUPS}">
    <input type="hidden" name="agrms[{AGRMID}][curid]" value="{AGRMCURID}">
    <input type="hidden" name="agrms[{AGRMID}][balance]" value="{AG_BAL}">
    <input type="hidden" name="agrms[{AGRMID}][orderpayday]" value="{AG_ORDERPAYDAY}">
    <input type="hidden" name="agrms[{AGRMID}][blockorders]" value="{AG_BLOCKORDERS}">
    <input type="hidden" name="agrms[{AGRMID}][ablocktype]" value="{AG_ABLOCKTYPE}">
    <input type="hidden" name="agrms[{AGRMID}][ablockvalue]" value="{AG_ABLOCKVALUE}">
    <input type="hidden" name="agrms[{AGRMID}][ownerid]" value="{AGRM_OWNERID}">

    <input type="hidden" id="_agrmpromised_{AGRMID}_" name="agrms[{AGRMID}][agrmpromised]" value="{AGRMPROMISED}">
<!-- END existAgrm -->

<!-- BEGIN existAgrmPromised -->
    <input type="hidden" id="_agrmpromised_{AGRMPROMISED}_" name="agrmpromised[{AGRMPROMISED}]" value="1">
<!-- END existAgrmPromised -->

<!-- BEGIN NewAgrm -->
    <input type="hidden" id="_newAgrmPenaltymethod-{NAG_ID}_" name="new_agrms[{NAG_ID}][penaltymethod]" value="{NAG_PENI}">
    <input type="hidden" id="_newAgrmType-{NAG_ID}_" name="new_agrms[{NAG_ID}][paymentmethod]" value="{NAG_TYPE}">
    <input type="hidden" id="_newAgrmNum-{NAG_ID}_" name="new_agrms[{NAG_ID}][num]" value="{NAG_NUM}">
    <input type="hidden" id="_newAgrmDate-{NAG_ID}_" name="new_agrms[{NAG_ID}][date]" value="{NAG_DATE}">
  
    <input type="hidden" id="_newAgrmOrderpayday-{NAG_ID}_"name="new_agrms[{NAG_ID}][orderpayday]" value="{NAG_ORDERPAYDAY}">
    <input type="hidden" id="_newAgrmBlockorders-{NAG_ID}_"name="new_agrms[{NAG_ID}][blockorders]" value="{NAG_BLOCKORDERS}">
    <input type="hidden" id="_newAgrmAblocktype-{NAG_ID}_"name="new_agrms[{NAG_ID}][ablocktype]" value="{NAG_ABLOCKTYPE}">
    <input type="hidden" id="_newAgrmAblockvalue-{NAG_ID}_"name="new_agrms[{NAG_ID}][ablockvalue]" value="{NAG_ABLOCKVALUE}">
     <input type="hidden" id="_newAgrmOwnerid-{NAG_ID}_" name="new_agrms[{NAG_ID}][ownerid]" value="{NAG_OWNERID}">
<!-- END NewAgrm -->



<!-- BEGIN agrmListDel --><input type="hidden" name="agrmListDel" value="{AGRMLISTDEL}"><!-- END agrmListDel -->
<!-- BEGIN agrmAddons --><input type="hidden" name="<!-- BEGIN ifAgrmAddonNew -->new_<!-- END ifAgrmAddonNew -->aaddons[{AADDON_ID}][{AADDON_NAME}]" fieldname="{AADDON_NAME}" value="{AADDON_VALUE}"><!-- END agrmAddons -->
<!-- BEGIN authPersonToPost --><input type="hidden" name="auth_person" value="{THISAUTHPERSON}"><!-- END authPersonToPost -->


<input type="hidden" name="address_idx[0]" id="Address_0-hid" value="{ADDRESS_IDX_0}">
<input type="hidden" name="address_idx[1]" id="Address_1-hid" value="{ADDRESS_IDX_1}">
<input type="hidden" name="address_idx[2]" id="Address_2-hid" value="{ADDRESS_IDX_2}">
<input type="hidden" name="address_str[0]" id="Address_0-str" value="{ADDRESS_STR_0}">
<input type="hidden" name="address_str[1]" id="Address_1-str" value="{ADDRESS_STR_1}">
<input type="hidden" name="address_str[2]" id="Address_2-str" value="{ADDRESS_STR_2}">

<table class="table_comm" width="960" align="center" cellpadding="0" cellspacing="0" style="border: none;">
<tr><td>
    <table class="table_comm" width="100%">
    <tr><td class="td_head_ext" ><!-- BEGIN newUHead --><%@ Create new user %><!-- END newUHead --><!-- BEGIN editUHead --><%@ Edit user %><!-- END editUHead --></td></tr>
    <tr height="40">
        <td class="td_comm">
            <!-- BEGIN saveData -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="<!-- BEGIN ifCheckBeforeSave -->if(checkUserAttributes({SAVEMODEVALUE},this.form))<!-- END ifCheckBeforeSave --> sumbitMainForm();" title="<%@Save%>"><img title="<%@Save%>"  border=0 src="images1/create1.gif"></img></button><b><%@Save%></b><!-- END saveData -->
            <!-- BEGIN createVgroup -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="<!-- BEGIN createVgClearPass -->createHidOrUpdate('_User', 'pass', '');<!-- END createVgClearPass -->createHidOrUpdate('_User', 'devision', '7'); submitForm('_User', 'vgid', '0')" title="<%@ Create account %>"><img title="<%@ Create account %>"  border=0 src="images/new22.gif"></img></button>
            <b><%@ Create account %></b><!-- END createVgroup -->
            <!-- BEGIN returnUsersList -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="Ext.get('_uid_').remove(); submitForm('_User', 'devision', this.form.devision.value)" title="<%@ Users list %>"><img title="<%@ Users list %>"  border=0 src="images1/acclist.gif"></img></button>
            <b><%@ Users %></b><!-- END returnUsersList -->
            <!-- BEGIN returnVgroupsList -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="submitForm('_User', 'devision', '7')" title="<%@ Accounts list %>"><img title="<%@ Accounts list %>"  border=0 src="images1/user_vgs.gif"></img></button>
            <b><%@ Accounts %></b><!-- END returnVgroupsList -->
            <!-- BEGIN returnEventsLog -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="submitForm('_User', 'devision', 19 )" title="<%@ Events log %>"><img title="<%@ Events log %>"  border=0 src="images1/show_all.gif"></img></button>
            <b><%@ Logs %></b><!-- END returnEventsLog -->
            <!-- BEGIN returnApplications -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="submitForm('_User', 'devision', 110)" title="<%@ Return to the application %>"><img title="<%@ Return to the application %>"  border=0 src="images/statistics.png"></img></button>
            <b><%@ Return to the application %></b><!-- END returnApplications -->
            <!-- BEGIN returnPackages -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="showAccountPackages({ filter: { userid: Ext.get('_uid_').getValue() } })" title="<%@ Services Packages %>"><img title="<%@ Services Packages %>"  border=0 src="images1/show_all.gif"></img></button>
            <b><%@ Packages %></b><!-- END returnPackages -->
        </td>
    </tr></table>
</td></tr>
</table>

<!-- BEGIN SaveStat -->
<table align="center" width="960" class="table_comm" style="margin-top: 22px;">
    <!-- BEGIN SaveStatFalse --><tr><td class="td_comm td_bold td_padding_l7" style="color: red;"><%@ There was an error while sending data to server %>{SAVESTATERR}</td></tr><!-- END SaveStatFalse -->
    <!-- BEGIN UnknownDefOperator --><tr><td class="td_comm td_bold td_padding_l7" style="color: red;"><%@ Undefined %> "<%@ Default operator %>"! <%@ You must modify %>: <%@ Common %> <%@ settings %></td></tr><!-- END UnknownDefOperator -->
    <!-- BEGIN SaveStatOk --><tr><td class="td_comm td_bold td_padding_l7" style="color: green;"><%@ Request done successfully %></td></tr><!-- END SaveStatOk -->
</table>
<!-- END SaveStat -->

<table class="table_comm" width="960" align="center" style="margin-top: 22px;">
    <!-- BEGIN ifEditAndCRM --><tr><td colspan="3" class="td_head_ext">CRM / Helpdesk</td></tr>
    <tr><td colspan="3" class="td_comm">
    <table class="table_comm" style="border: none" id="the-table">
        <tr>
            <td width="40" align="center"><button type="button" class="img_button" onClick="newWindow('helpdesk/sbssCrmData.php?uid={CRMOPENUID}',890,600)"><img border="0" src="images/folder.gif"></button></td>
            <td width="190" class="td_padding_l7 td_noborder"><%@ Attached documents %>: {CRMFILES_ATTCH}</td>
            <td width="180" class="td_padding_l7 td_noborder"><%@ Attached %> E-mail: {CRMEMAIL_ATTCH}</td>
            <td width="140" class="td_padding_l7 td_noborder"><%@ New requests %>: {HDNEWREQ}</td>
            <td width="160" class="td_padding_l7 td_noborder"><%@ Need reaction %>: {HDRAECTION}</td>
            <td width="130" class="td_padding_l7 td_noborder"><%@ Others %>: {HDOTHERS}</td>
        </tr>
    </table></td></tr><!-- END ifEditAndCRM -->

    <!-- BEGIN ifAgreement --><tr><td class="td_head_ext" colspan="3"><%@ Agreements %></td></tr>
    <tr>
        <td class="td_comm" style="border-bottom: none; padding: 0px" valign="top" colspan="3">
        <table class="table_comm" style="border: none" width="100%" cellpadding="0" cellspacing="0">
        <tr align="center">
            <td class="td_bold" width="22">&nbsp;</td>
            <td class="td_bold" width="196"><%@ Operator %></td>
            <td class="td_bold" width="166"><%@ Agreement %></td>
            <td class="td_bold" width="90"><%@ Type %></td>
            <td class="td_bold" width="112"><%@ Paycode %></td>
            <td class="td_bold" width="109"><%@ Balance %></td>
            <td class="td_bold" width="83"><%@ Currency %></td>
            <td class="td_bold" width="80"><%@ Credit %></td>
			<td class="td_comm" width="40" style="border-right: none;">
				
<!-- BEGIN isNotTpl --><button type="button" onClick="attachAgreement({USERID})" class="img_button" title="<%@ Transfer agreement %>"><img align="center" src="images/agreement.png" border="0"></button><!-- END isNotTpl -->
<!-- BEGIN isTpl --><button type="button" class="img_button" title="<%@ Transfer agreement %>"><img align="center" src="images/agreement-disabled.png" border="0"></button><!-- END isTpl -->
				
			</td> 
            <td class="td_comm" width="20" style="border-right: none;">
				<button type="button" onClick="submitForm('_User','addAgrm',1)" class="img_button"><img align="center" src="images/ext-add.gif" border="0"></button>
			</td>
        </tr>
        <!-- BEGIN agrmLine -->
        <tr height="30"  <!-- BEGIN GrayCloseAgrm -->style="color: grey"<!-- END GrayCloseAgrm -->>  
            <td class="td_comm" align="center"><button type="button" class="img_button" vchild="vpanel_" style="width: 20px; <!-- BEGIN ifANewCursor -->cursor: default;<!-- END ifANewCursor -->" onClick="vgroupPanel('{AG_ID}', Ext.get(this))" <!-- BEGIN ifANew -->disabled<!-- END ifANew -->><img src="images/plus.gif" border="0"></button></td>
            
            <td class="td_comm td_padding_l7" height="30">
            	{AGRM_OSTRING}
            	<!-- BEGIN operSel -->
            		<select id="new_agrms_oper_{NAG_ID}" name="new_agrms[{NAG_ID}][oper]" style="width: 203px">
	            		<!-- BEGIN operOpt -->
	            			<option value="{THISOP_ID}" 
	            				<!-- BEGIN operOptSel -->
	            					selected
	            				<!-- END operOptSel -->
	            			>{NAG_OSTRING}
	            			</option>
	            		<!-- END operOpt -->
            		</select>
            	<!-- END operSel -->
            </td>
            
            <td class="td_comm" align="center"><a id="<!-- BEGIN OperAgrmDispl -->agrmsdispl-<!-- END OperAgrmDispl --><!-- BEGIN newAgrmDispl -->new_agrmsdispl-<!-- END newAgrmDispl -->{AG_ID}" <!-- BEGIN GrayCloseAgrmHref -->style="color: grey"<!-- END GrayCloseAgrmHref --> onClick="AgrmProperties('_User', '{AG_ID}');" href="#">{AGREEMENT_NUM}</a></td>
            
            <td class="td_comm td_padding_l7" height="30">
            
            	<!-- BEGIN existTypeSel -->
            		<select id="agrms_type_{AGRMID}" name="agrms[{AGRMID}][paymentmethod]" style="width: 90px">
	            		<!-- BEGIN existTypeOpt -->
	            			<option value="{THISTYPE_ID}" 
	            				<!-- BEGIN typeOptSel -->
	            					selected
	            				<!-- END typeOptSel -->
	            			>{AG_TSTRING}
	            			</option>
	            		<!-- END existTypeOpt -->
            		</select>
            	<!-- END existTypeSel -->

            	<!-- BEGIN typeSel -->
            		<select id="new_agrms_type_{NAG_ID}" name="new_agrms[{NAG_ID}][paymentmethod]" style="width: 90px">
	            		<!-- BEGIN typeOpt -->
	            			<option value="{THISTYPE_ID}" 
	            				<!-- BEGIN typeOptSel -->
	            					selected
	            				<!-- END typeOptSel -->
	            			>{NAG_TSTRING}
	            			</option>
	            		<!-- END typeOpt -->
            		</select>
            	<!-- END typeSel -->
            </td>
            
            <td class="td_comm" align="center"><!-- BEGIN agrmCode --><input type="text" name="agrms[{AGRMC_ID}][code]" style="width: 107px" <!-- BEGIN code_dis -->disabled<!-- END code_dis --> value="{AGRM_CODE}"><!-- END agrmCode --><!-- BEGIN agrmCodeNew --><input type="text" name="new_agrms[{NAG_ID}][code]" style="width: 107px" value="{NAG_CODE}"><!-- END agrmCodeNew --></td>
            <td class="td_comm" align="center" style="font-weight: bold; color: <!-- BEGIN agrmBalMin -->red<!-- END agrmBalMin --><!-- BEGIN agrmBalNorm -->green<!-- END agrmBalNorm -->"><span <!-- BEGIN agrmBalModify -->id="_aBalance_{BAG_ID}" style="text-decoration: underline; cursor: pointer" title="<%@ Change balance %>" onmouseover="this.className='selected'" onmouseout="this.className='link'" onClick="setPayment({ uid: Ext.get('_uid_').getValue(), agrmid: '{BAG_ID}', onpayment: function(o){ this.innerHTML = Ext.util.Format.numberFormat(o.newBalance, 2, ',', ' '); try{ var P = Ext.get('_agrmCredit_' + o.agrmid); if(Ext.get('_agrmpromised_' + o.agrmid + '_').getValue() > 0 && o.payment >= P.getValue()){ Ext.get('_agrmpromised_' + o.agrmid + '_').dom.value = 0; P.dom.value = 0; P.dom.style.color = 'black' } } catch(e){ } }, onpromised: function(o){ createHidOrUpdate('_User', 'agrmpromised_'+o.agrmid, 1); var f = Ext.get('_agrmCredit_'+o.agrmid); f.dom.value = (f.dom.value*1+o.newValue); f.dom.style.color='red'}, scope: this })"<!-- END agrmBalModify -->>{AG_BAL}</span></td>
            <td class="td_comm" align="center"><!-- BEGIN CurrencyNew --><select name="new_agrms[{NAG_ID}][curid]" style="width: 76px" id="_newAgrmCur-{NAG_ID}"><!-- BEGIN CurOptNew --><option value="{NAG_CURID}" <!-- BEGIN CurOptNewSel -->selected<!-- END CurOptNewSel -->>{NAG_CUR}</optin><!-- END CurOptNew --></select><!-- END CurrencyNew -->{AGRMCURSYMBOL}</td>
            <td class="td_comm" colspan="2" align="center"><!-- BEGIN Credit --><input type="text" id="_agrmCredit_{AGRM_ID}" style="width: 70px; text-align: right; <!-- BEGIN PromisedColor -->color: red<!-- END PromisedColor -->" name="agrms[{AGRM_ID}][credit]" onClick="try{ if(Ext.get('_agrmpromised_{AGRM_ID}_').getValue() > 0){ alert(Localize.PromisedInCredit) } }catch(e){ }" value="{AGRM_CRD}"><!-- END Credit --><!-- BEGIN CreditNew --><input type="text" id="_newAgrmCrd-{NAG_ID}" style="width: 70px; text-align: right;" name="new_agrms[{NAG_ID}][credit]" value="{NAG_CRD}"><!-- END CreditNew --></td>
            <td class="td_comm" align="center" style="border-right: none;">
                <button type="button" class="img_button"
                        onClick="
                            <!-- BEGIN delAgrmDis -->
                                alert(Localize.AgrmNoDel);
                                return false;
                            <!-- END delAgrmDis -->
                            createHidOrUpdate('_User', 'agrmToRemove', '{AG_ID}');
                            submitForm('_User', <!-- BEGIN delNewAgrm -->'delNewAgrm'<!-- END delNewAgrm --> <!-- BEGIN delAgrm -->'delAgrm'<!-- END delAgrm -->, 1 )
                        "
                >
                    <img src="images/delete.gif" border="0">
                </button>
            </td>
        </tr>
        <tr><td class="td_comm" style="display: none" colspan="11" id="vpanel_{AG_ID}"></td></tr>
        <!-- END agrmLine -->
        </table>
        </td>
    </tr><!-- END ifAgreement -->
	
	<!-- BEGIN Application -->
    <tr>
        <td colspan="3" class="td_head_ext" width="960"><span style="font-size: 16px;"><%@ Application %>: <a href="#" style="font-size: 15px;" onClick="submitForm('_User', 'devision', 110);">{APPNUMBER}</a></td>
    </tr>
	<!-- END Application -->
    <tr>
        <td class="td_head_ext" width="220"><%@ Common %></td>
        <td class="td_head_ext" width="400"><%@ Registry data %></td>
        <td class="td_head_ext" width="320"><%@ Addresses %></td>
    </tr>

    <tr>
        <td class="td_comm" width="220" valign="top">
        <fieldset class="x-fieldset">
        <legend style="color: red">&nbsp;<%@ Category %>:&nbsp;</legend>
        <select name="category" style="width: 190px" onChange="modifyOperListNewAgrm(this)"><!-- BEGIN CategoryOpt --><option value="{CATEGORY_VAL}" <!-- BEGIN CategoryOptSel -->selected<!-- END CategoryOptSel -->><%@ {CATEGORY_NAME} %></option><!-- END CategoryOpt --></select>
        <!-- BEGIN OperTellStaff --><button type="button" onClick='operTellStaff("{USEROPERID}")' style="margin-top:5px; padding-left:0;"><span class="ext-cdrpabx" style="padding-left: 20px; text-decoration:underline;"><%@ Number capacity %></span></button><!-- END OperTellStaff -->
        </fieldset>
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ User type %>:&nbsp;</legend>
        <table class="table_comm" width="100%" style="border: none">
        <tr><td width="25"><input type="radio" onclick="this.form.submit();" id="_uType_1_" name="type" value="1" style="margin-bottom: 7px" <!-- BEGIN uType_1 -->checked<!-- END uType_1 --><!-- BEGIN uTypeDsbl_1 -->disabled<!-- END uTypeDsbl_1 -->></td><td><%@ Legal person %></td></tr>
        <tr><td width="25"><input type="radio" onclick="this.form.submit();" id="_uType_2_" name="type" value="2" <!-- BEGIN uType_2 -->checked<!-- END uType_2 --><!-- BEGIN uTypeDsbl_2 -->disabled<!-- END uTypeDsbl_2 -->></td><td><%@ Physical person %></td></tr></table>
        </fieldset>
        <!-- BEGIN ifAccessData --><fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Access %>:&nbsp;</legend>
        <%@ Login %>
        <input type="text" name="login" maxlength="32" style="width: 190px;" tpl="{THISUSERLOGINTPL}" value="{THISUSERLOGIN}"><br/>
        <%@ Password %>:
        <input type="<!-- BEGIN hidePass -->password<!-- END hidePass --><!-- BEGIN showPass -->text<!-- END showPass -->" id="_pass_" name="pass" maxlength="19" onfocus="if(this.type == 'password') { this.value='';} createHidOrUpdate(this.form, 'pass_chg', 1);" style="width: 190px;" value="{THISPASS}"><br/>

        <%@ User ID %>:
        <input type="text" id="_uuid_" name="uuid" maxlength="40" style="width: 190px;" value="{THISUUID}" <!-- BEGIN uuid_dis -->disabled<!-- END uuid_dis --> ><br/>

        <div style="margin-top: 4px"><input type="checkbox" name="ipaccess" value="1" <!-- BEGIN ipAccess -->checked<!-- END ipAccess -->>&nbsp;<%@ Check User IP to allow access %></div>
        </fieldset><!-- END ifAccessData -->
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Description %>:&nbsp;</legend>
        <textarea name="descr" id="_descr_" style="width: 188px" rows="5">{THISUSERDESCR}</textarea>
        </fieldset>
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ In groups %>:&nbsp;</legend>
        <select multiple size="6" name="groups2Remove[]" style="width: 191px">
        <!-- BEGIN optUG --><option value="{OPTUG_ID}"><!-- BEGIN prefixNameUG --><%@ System %>: <!-- END prefixNameUG -->{OPTUG_NAME}</option><!-- END optUG -->
        </select>
        <div style="width: 192px; text-align: center; margin-top: 5px"><input type="submit" name="removeGroup" value="<%@Remove%>" style="width: 70px"></div>
        <select name="newGroup" style="width: 192px; margin-top: 7px" onChange="submitForm('_User', 'addGroup', this.value)">
        <option value="null">-- <%@ Free groups %> --</option>
        <!-- BEGIN groupsFree --><option value="{FREEGROUPID}"><!-- BEGIN prefixNameUGFree --><%@ System %>: <!-- END prefixNameUGFree -->{FREEGROUPNAME}</option><!-- END groupsFree -->
        </select>
        </fieldset>
        <!-- BEGIN ifEditAndPay --><fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Advanced payment %>:&nbsp;</legend>
        <%@ Sum %>:&nbsp;<input type="text" name="inv_summ" value="0" style="width: 80px; text-align: right; margin-botton: 5px"><br/><br/>
        <%@ Document %>:
        <select name="inv_docid" style="width: 192px; margin-bottom: 7px">
        <!-- BEGIN payOption --><option value="{THISDOCID}" <!-- BEGIN payOptionSel -->selected<!-- END payOptionSel -->>{THISDOCNAME}</option><!-- END payOption -->
        </select>
        <%@ Agreement %>:
        <select name="inv_agrmid" style="width: 192px; margin-bottom: 7px">
        <!-- BEGIN optPayAgrmEmpty --><option value="0"><%@ Empty list %></option><!-- END optPayAgrmEmpty -->
        <!-- BEGIN payOptionVG --><option value="{DOCVGID}">{DOCVGNAME}</option><!-- END payOptionVG -->
        </select>
        <div style="width: 192px; text-align: center"><input type="button" style="width: 70px" value="<%@ Create %>" onClick="if(parseInt(this.form.inv_summ.value) > 0 && parseInt(this.form.inv_agrmid.value) > 0){ createInvoice({ uid: this.form.uid.value, agrmid: this.form.inv_agrmid.value, sum: this.form.inv_summ.value, docid: this.form.inv_docid.value }) }"></div>
        </fieldset><!-- END ifEditAndPay -->
        <!-- BEGIN ifEditAndDoc --><fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Documents templates %>:&nbsp;</legend>
        <span id="templatedatelabel"><!-- BEGIN docType_0 --><%@ Period %><!-- END docType_0 --><!-- BEGIN docType_1 --><%@ Since %><!-- END docType_1 --><!-- BEGIN docType_2 --><%@ Date %><!-- END docType_2 -->:</span><br/>
        <input type="text" name="templatedate" style="width: 192px; margin-bottom: 5px" value="{THISTEMPLDATE}"><br/>
        <%@ Till %>:<br/>
        <input type="text" name="templatedatetill" <!-- BEGIN disableDateTill -->disabled<!-- END disableDateTill --> style="width: 192px; margin-bottom: 5px" value="{THISTEMPLDATETILL}"><br/>
        <select name="template_id" style="width: 192px; margin-bottom: 5px" onChange="refreshDateFiedlsView(this.value, this)">
        <!-- BEGIN docOptionEmpty --><option value="0"><%@ Empty list %></option><!-- END docOptionEmpty -->
        <!-- BEGIN docOption --><option value="{THISTEMPLID}">{THISTEMPLNAME}</option><!-- END docOption -->
        </select>
        <%@ Agreement %>:
        <select name="template_vg" style="width: 192px; margin-bottom: 5px">
        <!-- BEGIN docOptionVG --><option value="{VGID}">{VGNAME}</option><!-- END docOptionVG -->
        </select>
        
        <div style="width: 192px; text-align: left; margin-bottom: 10px">
        	<input type="button" style="width: 192px" value="<%@ More %>" onClick="showOptionsForm({ uid: this.form.uid.value, form: '_User'})">
        </div>
        
        <div style="width: 192px; text-align: center"><input type="button" style="width: 70px" value="<%@ Create %>" onClick="createDocument({ uid: this.form.uid.value, agrmid: this.form.template_vg.value, docid: this.form.template_id.value, templatedate: this.form.templatedate.value, vgroups: this.form.vgroups.value, templatedatetill: this.form.templatedatetill.value })"></div>
        </fieldset><!-- END ifEditAndDoc -->
        <!-- BEGIN ifEditAndCard --><fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Pre-paid cards %>:&nbsp;</legend>
        <input type="checkbox" name="wrongactive" value="10" <!-- BEGIN cardBlock -->checked<!-- END cardBlock -->>&nbsp;<%@ Do not allow user to use cards %>
        <div style="margin-top: 12px"><%@ This option was blocked last time at %>: <b>{THISLASTCARDWRONG}</b></div>
        <input type="hidden" name="wrongdate" value="{THISLASTCARDWRONG}">
        </fieldset><!-- END ifEditAndCard -->
        </td>
		
        <td class="td_comm" valign="top">

        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Contacts %>:&nbsp;</legend>

            <table class="table_comm" width="100%" style="border: none;">
                <tr>
                <!-- BEGIN legalName -->
                    <td>
                        <input type="hidden" name="abonentsurname" value="{THISABONENTSURNAMEL}">
                        <input type="hidden" name="abonentname" value="{THISABONENTNAMEL}">
                        <input type="hidden" name="abonentpatronymic" value="{THISABONENTPATRONYMICL}">
                        <%@ Company name %>:<br/>
                        <input type="text" name="name" style="width: 320px" value="{THISUSERNAMEL}" <!-- BEGIN ab_namel_dis -->disabled<!-- END ab_namel_dis -->>
                    </td>
                <!-- END legalName -->
                <!-- BEGIN physName -->
                    <td>
                        <!-- BEGIN physNameCommon --><b><%@ Name of user %></b> {COMMONUSERNAME}<br/><!-- END physNameCommon -->
                        <input type="hidden" name="name" value="{THISUSERNAME}">
                        <%@ Surname %>:<br/>
                        <input type="text" name="abonentsurname" style="width: 320px" value="{THISABONENTSURNAME}" <!-- BEGIN ab_surname_dis -->disabled<!-- END ab_surname_dis -->><br/>
                        <%@ Person name %>:<br/>
                        <input type="text" name="abonentname" style="width: 320px" value="{THISABONENTNAME}" <!-- BEGIN ab_name_dis -->disabled<!-- END ab_name_dis -->><br/>
                        <%@ Middle name %>:<br/>
                        <input type="text" name="abonentpatronymic" style="width: 320px" value="{THISABONENTPATRONYMIC}" <!-- BEGIN ab_patrname_dis -->disabled<!-- END ab_patrname_dis -->><br/>
                    </td>
                <!-- END physName -->
                    <td align="center"><!-- BEGIN ifContactGrp --><button type="button" class="img_button" onClick="showUsers({ title: '<%@ Similar-s %> <%@ users %>', tbSearch: false, filter: { searchtype: 10, search: this.form.name.value }})" title="<%@ Similar-s %> <%@ users %>"><img src="images/contact_group.gif" border="0" title="<%@ Similar-s %> <%@ users %>"></button><!-- END ifContactGrp --><!-- BEGIN elseContactGrp -->&nbsp;<!-- END elseContactGrp --></td>
                </tr>
            </table>


        <%@ Phone %>:<br/>
        <input type="text" name="phone" style="width: 360px" maxlength="10" value="{THISUSERPHONE}"><br/>
        <%@ Fax %>:<br/>
        <input type="text" name="fax" style="width: 360px" value="{THISUSERFAX}"><br/>
        <%@ E-mail %>:<br/>
        <input type="text" name="email" style="width: 360px" value="{THISUSERMAIL}"><br/>
        <%@ Mobile %>:<br/>
        <input type="text" name="mobile" style="width: 360px" maxlength="11" value="{THISUSERMOBILE}">
        <input type="hidden" name="check_mobile" value="{THISUSERCHECKMOBILE}"><br/>
        <!-- BEGIN leaders -->
        <%@ Director %>:<br/>
        <input type="text" style="width: 360px" name="gendiru" value="{THISDIRECTOR}"><br/>
        <%@ Chief accountant %>:<br/>
        <input type="text" style="width: 360px" name="glbuhgu" value="{THISCHIEFACC}"><br/>
        <%@ Contact person %>:<br/>
        <input type="text" style="width: 360px" name="kontperson" value="{THISKONTACT}"><br/>
        <%@ Operates on the basis %>:<br/>
        <input type="text" style="width: 360px" name="actonwhat" value="{THISACTONWHAT}"><br/>
        <!-- END leaders -->
        <table width="100%" class="table_comm" style="border: none; margin-top: 5px"><tr>
        <td><%@ The Way to deliver issued invoices %>:</td>
        <td width="146"><select name="billdelivery" style="width: 140px; margin-bottom: 4px;">
        <option value="4" <!-- BEGIN wayDelacc_4 -->selected<!-- END wayDelacc_4 -->>E-mail</option>
        <option value="0" <!-- BEGIN wayDelacc_0 -->selected<!-- END wayDelacc_0 -->><%@ By courier %></option>
        <option value="1" <!-- BEGIN wayDelacc_1 -->selected<!-- END wayDelacc_1 -->><%@ By post %></option>
        <option value="2" <!-- BEGIN wayDelacc_2 -->selected<!-- END wayDelacc_2 -->><%@ By self %></option>
        <option value="3" <!-- BEGIN wayDelacc_3 -->selected<!-- END wayDelacc_3 -->><%@ Other %></option>
        </select></td></tr></table>
        </fieldset>
        <!-- BEGIN AddonFields -->
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ More %>:&nbsp;</legend>
        <table class="table_comm" width="100%" style="border: none">
        <!-- BEGIN AddOnTextRow --><tr><td width="50%" style="height: 24px">{ADDONTEXTDESCR}:</td><td width="50%" valign="top"><input type="text" style="width: 180px" name="addons[text][{ADDONTEXTNAME}]" value="{ADDONTEXTVALUE}" <!-- BEGIN AddOnTextRowDis -->disabled<!-- END AddOnTextRowDis -->  ></td></tr><!-- END AddOnTextRow -->
        <!-- BEGIN AddonBoolRow -->
            <tr>
                <td width="50%" style="height: 24px">{ADDONBOOLDESCR}:</td>
                <td width="50%" valign="top">
                        <input type="checkbox" name="addons[bool][{ADDONBOOLNAME}]" {ADDONBOOLVALUE} value="1" />
                </td>
            </tr>
        <!-- END AddonBoolRow -->
        <!-- BEGIN AddonComboRow -->
                <tr>
                        <td width="50%" style="height: 24px">{ADDONCOMBODESCR}:</td>
                <td width="50%" valign="top">
                    <select style="width: 180px" name="addons[combo][{ADDONCOMBONAME}]">
                        <option value="-1"><%@ Undefined %></option>
                        <!-- BEGIN AddonComboOpt -->
                        <option value="{ADDONCOMBOSELVAL}" <!-- BEGIN AddonComboOptSel -->selected<!-- END AddonComboOptSel -->>{ADDONCOMBOSELNAME}</option>
                        <!-- END AddonComboOpt -->
                    </select>
                </td>
            </tr>
        <!-- END AddonComboRow -->
        </table>
        </fieldset>
        <!-- END AddonFields -->
        <!-- BEGIN bank -->
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Bank details %>:&nbsp;</legend>
        <%@ Bank name %>:<br/>
        <input type="text" name="bankname" style="width: 360px" value="{THISBANKNAME}"><br/>
        <%@ Branch of bank %>:<br/>
        <input type="text" name="branchbankname" style="width: 360px" value="{THISBANKBRANCH}"><br/>
        <%@ BIK %>:<br/>
        <input type="text" name="bik" style="width: 360px" value="{THISBIK}"><br/>
        <%@ Charge account %>:<br/>
        <input type="text" name="settl" style="width: 360px" value="{THISSETTLACC}"><br/>
        <%@ Correspondent account %>:<br/>
        <input type="text" name="corr" style="width: 360px" value="{THISCORRACC}"><br/>
        <%@ TIN %><br/>
        <input type="text" name="inn" style="width: 360px" value="{THISINN}" <!-- BEGIN ab_inn_dis -->disabled<!-- END ab_inn_dis --> ><br/>
        <%@ OGRN %>:<br/>
        <input type="text" name="ogrn" style="width: 360px" value="{THISOGRN}"><br/>
        <%@ KPP %>:<br/>
        <input type="text" name="kpp" style="width: 360px" value="{THISKPP}" <!-- BEGIN ab_kpp_dis -->disabled<!-- END ab_kpp_dis --> ><br/>
        <%@ OKPO %>:<br/>
        <input type="text" name="okpo" style="width: 360px" value="{THISOKPO}"><br/>
        <%@ OKVED %>:<br/>
        <input type="text" name="okved" style="width: 360px" value="{THISOKVED}"><br/>
        <%@ Treasury name %>:<br/>
        <input type="text" name="treasuryname" style="width: 360px" value="{THISTREASURYNAME}"><br/>
        <%@ Treasury personal account %>:<br/>
        <input type="text" name="treasuryaccount" style="width: 360px" value="{THISTREASURYACC}"><br/>
        </fieldset>
        <!-- END bank -->
        <!-- BEGIN passport -->
        <fieldset class="x-fieldset">
        <legend>&nbsp;<%@ Passport %>:&nbsp;</legend>
        <%@ Series %>:<br/>
        <input type="text" name="passsernum" style="width: 360px" value="{THISPASSPORTSER}" <!-- BEGIN ab_pass_ser_dis -->disabled<!-- END ab_pass_ser_dis --> ><br/>
        <%@ Number %>:<br/>
        <input type="text" name="passno" style="width: 360px" value="{THISPASSPORTNUM}" <!-- BEGIN ab_pass_num_dis -->disabled<!-- END ab_pass_num_dis --> ><br/>
        <%@ Date %>:<br/>
        <input type="text" name="passissuedate" style="width: 360px" value="{THISPASSPORTDATE}" ><br/>
        <%@ Passport Office name %>:<br/>
        <input type="text" name="passissuedep" style="width: 360px" value="{THISPASSPORTDEP}" <!-- BEGIN ab_pass_dep_dis -->disabled<!-- END ab_pass_dep_dis --> ><br/>
        <%@ Passport Office location %>:<br/>
        <input type="text" name="passissueplace" style="width: 360px" value="{THISPASSPORTPLACE}"><br/>
        <%@ Birthday %>:<br/>
        <input type="text" name="birthdate" style="width: 360px" value="{THISBIRTHDAY}"><br/>
        <%@ Birth place %>:<br/>
        <input type="text" name="birthplace" style="width: 360px" value="{THISBIRTHPLACE}"><br/>
        <%@ ITN %>:<br/>
        <input type="text" name="inn" style="width: 360px" value="{THISINN}"><br/>
        </fieldset>
        <!-- END passport -->
        </td>

        <td class="td_comm" valign="top">
        <div id="Address_0" style="margin: 4px"></div>
        <div id="Address_1" style="margin: 4px; margin-top: 8px"></div>
        <div id="Address_2" style="margin: 4px; margin-top: 8px"></div>
        </td>
    </tr>
</table><br/>
</form>
