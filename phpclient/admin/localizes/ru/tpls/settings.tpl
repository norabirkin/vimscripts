<script type="text/javascript" src="js/settings.js"></script>
<script type="text/javascript" language="javascript">
	var Localize = { Add: '<%@ Add %>', Change: '<%@ Change %>', Search: '<%@ Search %>', Undefined: '<%@ Undefined %>', WindowHead: '<%@ Add %> <%@ agreement %>', UseTemplate: '<%@ Use template %>', AgrmNum: '<%@ Agreement number %>', AgrmNums: '<%@ Agreements %>', isDate: '<%@ Date %>', ButtAdd: '<%@ Add %>', SelectTemplate: '<%@ Select %> <%@ template %>', LoginError: '<%@ Incorrect login value %>', PassError: '<%@ Incorrect password value %>', UName: '<%@ User %>', Address: '<%@ Address %>', Consistent: '<%@ Consistent-s %> <%@ users %>', AddressBook: '<%@ Address book %>', Country: '<%@ Country %>', Region: '<%@ Region %>', District: '<%@ District %>', City: '<%@ City %>', Settlement: '<%@ Area %>', Save: '<%@ Save %>', Name: '<%@ Name %>', Type: '<%@ Type %>', WldAdd: '<%@ Whould You like to add %>', Street: '<%@ Street %>', Building: '<%@ Building %>', Block: '<%@ Block %>', PostCode: '<%@ Post code %>', Flat: '<%@ Flat %>', Office: '<%@ Office %>', Cancel: '<%@ Cancel %>', NewEntry: '<%@ New entry %>', NoMatch: '<%@ There is no matches for %>', Undefined: '<%@ Undefined %>', AutoNum: '<%@ Auto numbering %>', AgrmNoDel: '<%@ Cannot remove agreement there are accounts %>', Agreement: '<%@ Agreement %>', PersonFullName: '<%@ Person full name %>', UserType: '<%@ User type %>', Legal: '<%@ Legal person %>', Physic: '<%@ Physical person %>', SendingData: '<%@ Sending data %>', Connecting: '<%@ Connecting %>', Choose: '<%@ Choose %>', StreetY: '<%@ Street-y %>', Edit: '<%@ Edit %>', CountryY: '<%@ Country-y %>', FlatY: '<%@ Flat-y %>', AddNewRecord: '<%@ Add new record %>', Countries: '<%@ Countries %>', Regions: '<%@ Regions %>', Districts: '<%@ Districts %>', Cities: '<%@ Cities %>', Settlements: '<%@ Areas %>', Streets: '<%@ Streets %>', Buildings: '<%@ Buildings %>', Flats: '<%@ Flats %>', Offices: '<%@ Offices %>', UndefinedType: '<%@ There is undefined item type %>', LegalAddress: '<%@ Legal address %>', RegisteredAddress: '<%@ Registered address %>', PostAddress: '<%@ Post address %>', AddressDeliverInvoice: '<%@ Address to deliver invoice %>', Copy: '<%@ Copy %>', address: '<%@ address %>', ForAll: '<%@ For all %>', to: '<%@ to %>', CurBalance:  '<%@ Current Balance %>', SetBalance:  '<%@ Set balance value %>', PaymentSum:  '<%@ Payment sum%>', PaymentNumber:  '<%@ Pay document number %>', PaymentDate:  '<%@ Payment date %>', SavePayment:  '<%@ Save payment %>', PaymentsHistory:  '<%@ Show payments history %>', Currency:  '<%@ Currency %>', Comment:  '<%@ Comment %>', Default: '<%@ Default %>', SavePayment: '<%@ Save payment %>', Payments: '<%@ Payments %>', Payment: '<%@ Payment %>', user: '<%@ user %>', agreement: '<%@ agreement %>', Error: '<%@ Error %>', Warning: '<%@ Warning %>', Info: '<%@ Info %>', RequestSuccessfully: '<%@ Request done successfully %>', PromisedPayment: '<%@ Promised payment %>', DateOffSebt: '<%@ Date to pay off debt %>', MaxPayment: '<%@ Maximum %> <%@ payment %>', MinPayment: '<%@ Minimum %> <%@ payment %>', AllowedDebt: '<%@ Allowed debt %>', PaymentDoesNotDebt: '<%@ This payment does not write off debt %>', PromisedExists: '<%@ There is promised payment for this agreement %>', PromisedInCredit: '<%@ Attantion! There was promised payment %>', DeleteAccount: '<%@ Delete account %>', Field: '<%@ Field %>', Text: '<%@ Text %>', List: '<%@ List %>', DefinedValues: '<%@ Defined values %>', Description: '<%@ Description %>', AgreementProp: '<%@ Agreement properties %>', AgrmAddonFields: '<%@ Additional fields for agreements %>', Fields: '<%@ Fields %>', EmptyList: '<%@ Empty list %>', FlatsNum: '<%@ Number of apartments %>', ConnectionType: '<%@ Connection type %>' }
</script>
<script type="text/javascript" src="js/address.js"></script>

<form  method="POST" action="config.php" id="_Settings">
<input type="hidden" name="devision" value="331">
<input type="hidden" name="dropArgm" id="_dropArgm_" value="">
<input type="hidden" name="submenu" id="_submenu_" value="{SUBMENUSELECTED}">
<input type="hidden" name="defaultopname" id="_defaultopname_" value="{DEF_OPER_NAME}">

<table  class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0">
	<tr><td class="td_head_ext" height="22" colspan="5"><%@ Billing settings %></td></tr>
	<tr height=40>	
		<!-- BEGIN Change --><td width="150" class="td_comm" style="border-right: none">
			&nbsp;
			<!-- /*submitForm(this.form.id, 'save', 1)*/ -->
			<button type="button" onClick="if(Ext.getCmp('payclasses')){ Ext.getCmp('payclasses').getTopToolbar().items.items[0].handler(this.form); submitForm(this.form.id, 'save', 1); } else submitForm('_Settings', 'save', 1); "><img title="<%@ Change %>" border="0" title="<%@ Change %>" src="images1/save.png"></button>
			<b><%@ Save %></b>
		</td><!-- END Change -->
		
		
		
		<!-- BEGIN SetCloseDate --><td width="200" class="td_comm" style="border-right: none">
			&nbsp;
			<button type="button" onClick="LockPeriod();"><img border="0" title="<%@ Locked period %>" src="images/man_lock.gif"></button>
			<b><%@ Locked period %></b>
		</td><!-- END SetCloseDate -->
		
		
		
		<!-- BEGIN Activate --><td width="280" class="td_comm" id="_ReActivation" style="border-right: none; <!-- BEGIN KeyStart -->display: none<!-- END KeyStart -->">
			&nbsp;
			<button type="button" onClick="ActivationAsk(1)"><img title="<%@ Get lisence key %>" border="0" title="<%@ Get lisence key %>" src="images/Key.gif"></button>
			<b><%@ Get lisence key %></b>
		</td>
		<td width="190" class="td_comm" id="_SendActivation" style="border-right: none; <!-- BEGIN KeySend -->display: none<!-- END KeySend -->">
			&nbsp;
			<button type="submit" name="license"><img title="<%@ Get lisence key %>" border="0" title="<%@ Get lisence key %>" src="images/Key.gif"></button>
			<b><%@ Activate %></b>
		</td>
		<td width="150" class="td_comm" id="_CancelActivation" style="border-right: none; <!-- BEGIN KeyCancel -->display: none<!-- END KeyCancel -->">
			&nbsp;
			<button type="button" onClick="ActivationAsk(2)"><img title="<%@ Cancel %>" border="0" title="<%@ Cancel %>" src="images1/editdelete.gif"></button>
			<b><%@ Cancel %></b>
		</td><!-- END Activate -->
		<td class="td_comm">&nbsp;</td>
	</tr>
</table>

<table  cellpadding="0" cellspacing="0" border="0" width="899" align="center" style="margin-top: 22px;">

	<tr>
		<td width="13%" class="x-tab-strip x-tab-strip-top" onClick="submitForm('_Settings', 'submenu', 0);">

 			  <div id="tab1" class="{COMMUN}">
   				 <a onclick="return false;" class="x-tab-strip-close">
    				<a onclick="return false;" href="#" class="x-tab-right">
      				<em class="x-tab-left">
      				  <span class="x-tab-strip-inner">
         			 <span class="x-tab-strip-text" id="tab1_tab"><%@ Common %></span>
        			</span>
      				</em>
					</a>
    			</a>
  			</div>
		</td>
		<td style="padding-left:3px;" width="19%" class="x-tab-strip x-tab-strip-top" onClick="submitForm('_Settings', 'submenu', 1);">
 			  <div id="tab2" class="{PMUN}">
   				 <a onclick="return false;" class="x-tab-strip-close"></a>
    				<a onclick="return false;" href="#" class="x-tab-right">
      				<em class="x-tab-left">
      				  <span class="x-tab-strip-inner">
         			 <span class="x-tab-strip-text" id="tab2_tab"><%@ Data life %></span>
        			</span>
      				</em>
    			</a>
  			</div>
		</td>
		<td style="padding-left:3px;" width="13%" class="x-tab-strip x-tab-strip-top" onClick="submitForm('_Settings', 'submenu', 2);">
 			  <div id="tab3" class="{ACTUN}">
   				 <a onclick="return false;" class="x-tab-strip-close"></a>
    				<a onclick="return false;" href="#" class="x-tab-right">
      				<em class="x-tab-left">
      				  <span class="x-tab-strip-inner">
         			 <span class="x-tab-strip-text" id="tab3_tab"><%@ Activation %></span>
        			</span>
      				</em>
    			</a>
  			</div>
		</td>


		<!-- BEGIN CerberMenu -->
		<td style="padding-left:3px;" width="13%" class="x-tab-strip x-tab-strip-top" onClick="submitForm('_Settings', 'submenu', 3);">
 			  <div id="tab3" class="{CERBUN}">
   				 <a onclick="return false;" class="x-tab-strip-close"></a>
    				<a onclick="return false;" href="#" class="x-tab-right">
      				<em class="x-tab-left">
      				  <span class="x-tab-strip-inner">
         			 <span class="x-tab-strip-text" id="tab3_tab"><%@ Cerber %></span>
        			</span>
      				</em>
    			</a>
  			</div>
		</td>
		<!-- END CerberMenu -->
		<td>&nbsp;</td>
	</tr>
	<tr><td colspan="5" class="x-tab-panel-header x-tab-strip-spacer"><img src="./images/dot.gif" /></td></tr>
</table>

<!-- BEGIN Common_Set -->

<table  class="table_comm" width="900" align="center"  cellpadding="0" cellspacing="0" style="border-top: none;">
	<tr >
		<td width="50%" class="td_comm" style="border-right: none" valign="top">
		<fieldset class="x-fieldset">
			<legend><%@ Common %></legend>
			<table style="border: none" width="100%">
				<tr>
					<td width="55%" class="td_comm" style="border: none;"><b><%@ Default operator %>:</b></td>
					<td width="40%" class="td_comm" style="border: none"><select name="default_operator" style="width: 180px"><!-- BEGIN operOpt --><option value="{THISOP_ID}" <!-- BEGIN operOptSel -->selected<!-- END operOptSel -->>{THISOP_NAME}</option><!-- END operOpt --></select></td>          
				</tr>
				<tr>
					<td width="55%" class="td_comm" style="border: none;"><%@ Default matrix discounts %>:</td>
					<td width="40%" class="td_comm" style="border: none">
					<select style="width: 180px" name="default_discount_method">
						<option value="1" <!-- BEGIN matrix_not_sum -->selected<!-- END matrix_not_sum -->><%@ Do not sum %></option>
						<option value="0" <!-- BEGIN matrix_sum -->selected<!-- END matrix_sum -->><%@ Sum %></option>
					</select>
					</td>          
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Dont allow to chage user type %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" name="change_usertype" value="1" <!-- BEGIN ChgUT -->checked<!-- END ChgUT -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Dont allow to chage user agreement %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" name="disable_change_user_agreement" value="1" <!-- BEGIN ChgUA -->checked<!-- END ChgUA -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Deny users to view documents %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" name="user_viewpayed" value="1" <!-- BEGIN UserPD -->checked<!-- END UserPD -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Allow users to generate prepayed documents %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" name="user_gendoc" value="1" <!-- BEGIN UserGD -->checked<!-- END UserGD -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Default prepayed document for the physical person %>:</td>
					<td class="td_comm" style="border: none"><select style="width: 180px" name="default_physical"><!-- BEGIN defPhysOpt --><option value="{DEFPHYZID}" <!-- BEGIN defPhysSel -->selected<!-- END defPhysSel -->>{DEFPHYZNAME}</option><!-- END defPhysOpt --></select></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Default prepayed document for the legal person %>:</td>
					<td class="td_comm" style="border: none"><select style="width: 180px" name="default_legal"><!-- BEGIN defLegalOpt --><option value="{DEFLEGID}" <!-- BEGIN defLegalSel -->selected<!-- END defLegalSel -->>{DEFLEGNAME}</option><!-- END defLegalOpt --></select></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Templates path %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="templates_dir" value="{TEMPLATESDIR}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Restrict wrong payment card activation %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="wrong_active" value="{WRONGACTIVE}"></td>
				</tr>

				<tr>
					<td class="td_comm" style="border: none"><%@ Import file delimiter %>:<span class="info"><%@ ASCII-code for pay import delimiter %></span></td>
					<td class="td_comm" style="border: none"><input type="text" maxlength="2" style="width: 40px" id="_pay_import_delim" name="pay_import_delim" value="{IMPORTDELIMITER}"></td>
				</tr>

				<tr>
					<td class="td_comm" style="border: none"><%@ Restrict  passive time of  managers session %> (<%@ sec-s %>):</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="session_lifetime" value="{SESSIONLIFETIME}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Unload statistics data to file in charset %>:</td>
					<td class="td_comm td_bold" style="border: none;">
						<select style="width: 180px" name="export_character">
							<option <!-- BEGIN ExportStat_UTF-8 -->selected<!-- END ExportStat_UTF-8 -->>UTF-8</option>
							<option <!-- BEGIN ExportStat_CP1251 -->selected<!-- END ExportStat_CP1251 -->>CP1251</option>
							<option <!-- BEGIN ExportStat_KOI8-R -->selected<!-- END ExportStat_KOI8-R -->>KOI8-R</option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td class="td_comm" style="border: none"><%@ Default country %>:</td>
					<td class="td_comm" style="border: none">
                        <select name="default_country" style="width: 180px">
                            <!-- BEGIN countryOpt --><option value="{THISCOUNTRY_ID}" <!-- BEGIN countryOptSel -->selected<!-- END countryOptSel -->>{THISCOUNTRY_NAME}</option><!-- END countryOpt -->
                        </select>
                    </td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Load lists of users and accounts when open divisions %>:</td>
					<td class="td_comm td_bold" style="border: none;"><input type="checkbox" name="autoload_accounts" value="1" <!-- BEGIN autoAccounts -->checked<!-- END autoAccounts -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Make payments cash only to current date %>:</td>
					<td class="td_comm td_bold" style="border: none;"><input type="checkbox" name="payments_cash_now" value="1" <!-- BEGIN paymentsCahsNow -->checked<!-- END paymentsCahsNow -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@Start numbering documents from the beginning of the year%>:</td>
					<td class="td_comm td_bold" style="border: none;"><input type="checkbox" name="reset_ord_numbers" value="1" <!-- BEGIN resetOrdNumbers -->checked<!-- END resetOrdNumbers -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Public service %>:</td>
					<td class="td_comm td_bold" style="border: none;"><input type="checkbox" name="zkh_configuration" value="1" <!-- BEGIN zkhConfiguration -->checked<!-- END zkhConfiguration -->></td>
				</tr>
				<!--
				<tr>
					<td class="td_comm" style="border: none"><%@ Адрес по-умолчанию %>:</td>
					<td class="td_comm td_bold" style="border: none;">
						<input type="hidden" name="default_addr" id="_default_addr_" value="{DEFAULTADDRVAL}">
						<a href="javascript:void(0)" id="_defaddr" onclick="DefaultAddrPicker(this)">1<%@ {DEFAULTADDR} %></a>
					</td>
				</tr>
				-->
				<tr>
					<td class="td_comm" style="border: none"><%@ Use VGroup activation period %>:</td>
					<td class="td_comm td_bold" style="border: none">
						<input 
							type="checkbox" 
							name="use_vgroup_activation_period" 
							value="1" 
							<!-- BEGIN useVgroupActivationPeriod -->checked<!-- END useVgroupActivationPeriod -->
						/>
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ External script %> "<%@ Invite friend %>":</td>
					<td class="td_comm td_bold" style="border: none;"><input type="text" style="width: 180px" name="bring_friend_script" value="{BRINGFRIENDSCRIPT}"></td>
                </tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ User phone format %>:</td>
					<td class="td_comm td_bold" style="border: none;"><input type="text" style="width: 180px" name="user_mobile_format" value="{PFORMAT}"></td>
                </tr>
			</table>
		</fieldset>
		<fieldset class="x-fieldset">
			<legend><%@ Universal gateway of payment %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Agreement %>:</td>
					<td width="45%" class="td_comm" style="border: none">
						<input type="hidden" name="uprs_common_agreement" id="uprs_common_agreement" value="{UPRSCOMMONAGRM}">
						<a href="javascript:void(0)" onClick="selectUprsAgrm(this);">{UPRSCOMMONAGRMNAME}</a>
					</td>
				</tr>
			</table>
		</fieldset>
		<fieldset class="x-fieldset">
			<legend><%@ Cyberplat %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Cyberplat common agreement %>:</td>
					<td width="45%" class="td_comm" style="border: none">
						<input type="hidden" name="cyberplat_common_agreement" id="cyberplat_common_agreement" value="{CYBCOMMAGRMID}">
						<a href="javascript:void(0)" onClick="selectCyberplatAgrm(this);">{CYBCOMMAGRMNAME}</a>
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Cyberplat agreement regexp %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" style="width: 180px" name="cyberplat_agreement_regexp" value="{CYBAGRMREGEXP}">
					</td>
				</tr>
			</table>
		</fieldset>
        <fieldset class="x-fieldset">
            <legend><%@ Smart cards %></legend>
            <table class="table_comm" style="border: none" width="100%">
                <tr>
                    <td width="55%" class="td_comm" style="border: none"><%@ Mobility %> (<%@ Tag of category %> "uuid"):</td>
                    <td width="45%" class="td_comm" style="border: none">
                        <input type="text" style="width: 180px" name="smartcard_usbox_tag" value="{SMCARDUSBOXTAG}">
                    </td>
                </tr>
                <tr>
                    <td class="td_comm" style="border: none"><%@ Maximum number of equipments linked to a smart card %>:</td>
                    <td class="td_comm" style="border: none">
                        <input type="text" style="width: 180px" name="smartcard_eqip_max" value="{SMEQUIPMAX}">
                    </td>
                </tr>
                <tr>
                    <td class="td_comm" style="border: none"><%@ Prompt USBox service if number of equipment exceeded %>:</td>
                    <td class="td_comm" style="border: none">
                        <input type="text" style="width: 180px" name="usbox_eqip_min" value="{SMEQUIPMINUSBOX}">
                    </td>
                </tr>
            </table>
        </fieldset>
		</td>
		<td width="50%" class="td_comm" valign="top">
		<fieldset class="x-fieldset">
			<legend><%@ Login %> / <%@ Password %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Allowed symbols in the user password %>:</td>
					<td width="45%" class="td_comm" style="border: none"><input type="text" style="width: 180px" name="user_pass_symb" value="{USERPASSSYMB}" title="'RegExp' <%@ rule %>"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Allowed symbols in the account password %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="acc_pass_symb" value="{ACCPASSSYMB}" title="'RegExp' <%@ rule %>"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Generate password %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" value="1" name="generate_pass" <!-- BEGIN GenPass -->checked<!-- END GenPass -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Password length %>:</td>
					<td class="td_comm" style="border: none"><input type="text" name="pass_length" value="{PASSLEN}" style="width: 80px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Only numbers %>:</td>
					<td class="td_comm" style="border: none"><input type="checkbox" name="pass_numbers" value="1" <!-- BEGIN PassNum -->checked<!-- END PassNum -->></td>
				</tr>
			</table>
		</fieldset>
		<fieldset class="x-fieldset">
			<legend><%@ Payments %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Auto transfer payment %>:</td>  
					<td width="45%" class="td_comm" style="border: none"><input type="checkbox" name="auto_transfer_payment" value="1" <!-- BEGIN AutoTransfer -->checked<!-- END AutoTransfer -->></td>  
				</tr>
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Payment document format %>:</td>
					<td width="45%" class="td_comm" style="border: none"><input type="text" style="width: 180px" name="payment_format" value="{PAYMENTFORMAT}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Import files path %>:</td>
					<td class="td_comm" style="border: none"><input type="text" name="pay_import" style="width: 180px" value="{PAYIMPORT}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Payment script path %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" name="payment_script_path" style="width: 180px" value="{PAYSCRIPT}" title="<%@ Print payment instruction %>" >
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Tax value %> (%):</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 80px" name="tax_value" value="{TAXVALUE}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none" colspan="2" id="_pclasses"></td>
				</tr>
			</table>
		</fieldset>

		<fieldset class="x-fieldset">
			<legend><%@ Print sales settings %></legend>
			<table class="table_comm" style="border: none;" width="400">
				<tr>
					<td class="td_comm" style="border: none"><%@ Cash register like Mebius %>:</td>
					<td class="td_comm" style="border: none">
						<input type="checkbox" value="1" name="print_sales_mebius" <!-- BEGIN printSalesMebius -->checked<!-- END printSalesMebius --> onClick="isMebius();">
					</td>
				</tr>
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Department code for businesses %>:</td>
					<td width="45%" class="td_comm" style="border: none"><input type="text" style="width: 180px" name="print_sales_ocur" value="{PAYMENTKUR}"></td>
				</tr>
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Department code for individuals %>:</td>
					<td width="45%" class="td_comm" style="border: none"><input type="text" style="width: 180px" name="print_sales_ocfiz" value="{PAYMENTKFIZ}"></td>
				</tr>

				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Print sales template %>:</td>
					<td width="45%" class="td_comm" style="border: none">
						<textarea style="width: 180px" rows="2" name="print_sales_template" onkeypress="return imposeMaxLength(event, this, 1023);">{SAILSTEMPLATE}</textarea>
						<span class="info warning"><%@ Print sales attention %></span>
						<br/><a href="javascript:void(0);" onClick="showSalesHelp();" style="color:navy;"><%@ available templates %></a>

					</td>
				</tr>
			</table>
		</fieldset>

		<fieldset class="x-fieldset">
			<legend><%@ Broadcast messages %></legend>
			<table class="table_comm" style="border: none;" width="400">
				<tr>
					<td class="td_comm" style="border: none"><%@ Email title %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" value="{CRM_EMAIL_SUBJECT}" name="crm_email_subject" />
					</td>
				</tr>
			</table>
		</fieldset>

		<fieldset class="x-fieldset">
			<legend><%@ Antivirus %></legend>
			<table class="table_comm" style="border: none;" width="400">
				<tr>
					<td class="td_comm" style="border: none"><%@ Promo period %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" value="{ANTIVIRUS_PROMO_PERIOD}" name="antivirus_promo_period" />
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Activation period %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" value="{ANTIVIRUS_ACTIVATION_PERIOD}" name="antivirus_activation_period" />
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Notify activation expire %>:</td>
					<td class="td_comm" style="border: none">
						<input type="text" value="{ANTIVIRUS_NOTIFY_ACTIVATION_EXPIRE}" name="antivirus_notify_activation_expire" />
					</td>
				</tr>
			</table>
		</fieldset>
		
		</td>
	</tr>
</table>



<table  class=table_comm width="900" style="margin-top: 22px;" align=center>
	<tr>
        <td colspan="2" class="td_head_ext" style="border-right: none;"><%@ Templates to generate agreement number %></td>
        <td width="30" class="td_head_ext">
            <button type="button" title="<%@ Add %>" {CANDEL_ANUM} onClick="submitForm(this.form.id, 'newAgrmANum', 1)" ><img title="<%@ Add %>" src="images/{ADDIMG}"></button>
        </td>
    </tr>
	<tr>
		<td class="td_head" width="435"><%@ Description %></td>
		<td class="td_head" width="435" style="border-right: none;"><%@ Template %></td>
		<td class="td_head" width="30"></td>
	</tr>
	<!-- BEGIN Template_Agrm -->
	<tr align="center">
		<td class="td_comm"><input type="text" name="agrmANum[{TEMPLINDEX}][0]" value="{TEMPLDESCR}" style="width: 250px"></td>
		<td class="td_comm"><input type="text" name="agrmANum[{TEMPLINDEX}][1]" value="{TEMPLVALUE}" style="width: 250px"></td>
		<td class="td_comm" width="30"><button type="button" onClick="submitForm(this.form.id, 'dropAgrmANum', '{TEMPLINDEX}')" {CANDEL_ANUM}><img src="images1/{DELIMG}"></button></td>
	</tr>
	<!-- END Template_Agrm -->
</table>
<!-- END Common_Set -->
<!-- BEGIN Store_Set -->

<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0" style="border-top: none">
	<tr><td class="td_comm" style="border: none"><fieldset class="x-fieldset">
			<legend><%@ Data life %></legend>
		<table class="table_comm" width="96%" align="center" cellpadding="0" cellspacing="0" style="border: none">
		<tr>
		<td colspan="4" class="td_comm" style="border: none; color: red;"><%@ Attention! Minimum data retention should be at least 32 days. %></td>
		</tr>
		<tr>
		<td width="35%" class="td_comm" style="border: none"><%@ Keep balance history data %>, <%@ days %>:</td>
		<td width="15%" class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="balances" value="{BALANCES}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1);"></td>
		<td class="td_comm" style="border: none"><%@ Keep day data in the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="day" value="{DAY}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		</tr>
		<tr>
		<td class="td_comm" style="border: none"><%@ Keep payments data int the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="bills" value="{BILLS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		<td class="td_comm" style="border: none"><%@ Keep month data in the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="month" value="{MONTH}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		</tr>
		<tr>
		<td class="td_comm" style="border: none"><%@ Keep reports data in the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="orders" value="{ORDERS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		<td class="td_comm" style="border: none"><%@ Keep blocks history data %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="vg_blocks" value="{VGBLOCKS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		</tr>
		<tr>
		<td class="td_comm" style="border: none"><%@ Keep rent charges data in the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="rentcharge" value="{RENTCHARGE}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		<td class="td_comm" style="border: none"><%@ Keep event logs data %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="eventlog" value="{EVENTLOG}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		</tr>
		<tr>
		<td class="td_comm" style="border: none"><%@ Keep activated cards data in the storage %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="pay_cards" value="{PAYCARDS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		<td class="td_comm" style="border: none"><%@ Keep auth history %>, <%@ days %>:</td>
		<td class="td_comm" style="border: none"><input type="text" style="width: 70px;" name="auth_history" value="{AUTHHISTORY}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"></td>
		</tr>
		</table>
	</fieldset></td></tr>
</table>

<!-- END Store_Set -->
<!-- BEGIN Activation -->

<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0" style="border-top: none">

<!-- BEGIN notGranted --><tr height="50"><td class="td_comm td_bold" height="50" style="color: red" align="center"><%@ Access is restricted to this section %></td></tr><!-- END notGranted -->
<!-- BEGIN ActivationForm -->
<!-- BEGIN defOperAtt --><tr><td class="td_comm" style="border: none; text-align: center; color: red"><%@ Attantion! Do not change default operator! %></td></tr><!-- END defOperAtt -->
<!-- BEGIN defOperError --><tr><td class="td_comm" style="border: none; text-align: center; color: red"><b><%@ Undefined %> "<%@ Default operator %>"!</b></td></tr><!-- END defOperError -->
<!-- BEGIN LisenceError --><tr><td class="td_comm" style="border: none; text-align: center; color: red"><%@ Can not get lisence %> <%@ See logs for details %></td></tr><!-- END LisenceError -->
<!-- BEGIN KeyFormatError --><tr><td class="td_comm" style="border: none; text-align: center; color: red"><%@ Wrong format of licence key. Must be XXXX-XXXX-XXXX-XXXX-XXXX %></td></tr><!-- END KeyFormatError -->
<tr>
	<td class="td_comm" style="border-bottom: none" align="center">

	<table class="table_comm" width="70%">
		<tr>
			<td class="td_comm td_bold td_padding_l7" width="50%"><%@ System version %></td>
			<td class="td_comm td_padding_l7" width="50%">{VERSION}</td>
		</tr>
		<tr>
			<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Organization name %></td>
			<td class="td_comm td_padding_l7" width="50%">
				<table border="0" cellspacing="0" cellpadding="4">
					<tr>
						<td width="80%" >
							<div id="a1" <!-- BEGIN A1 --><!-- END A1 -->>{PROGOWNER}</div>
							<div id="a2" <!-- BEGIN A2 -->style="display: none"<!-- END A2 -->><input type="text" name="liccomp" value="{PROGOWNER}" style="width: 220px"></div>		
						</td>
						<td>
							<button type="button" id="a8" <!-- BEGIN A8 --> style="display: none" <!-- END A8 --> class="img_button" onClick="getDefaultOperator()" title="<%@ Input current name %>"><img src="images/refresh.gif" border="0" title="<%@ Input current name %>"></button>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Activation key %></td>
			<td class="td_comm td_padding_l7" width="50%">
				<div id="a5" <!-- BEGIN A5 -->style="display: none"<!-- END A5 -->>{CDKEYFULL}</div>
				<div id="a6" <!-- BEGIN A6 -->style="display: none"<!-- END A6 -->><input type="text" name="keyfull" value="{CDKEYFULL}" style="width: 220px"></div>
			</td>
		</tr>
	</table>

	</td>
</tr>
<!-- BEGIN LiOptions -->
<tr><td class="td_comm" align="center">
	<table class="table_comm" width="70%">
		
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ License issue date %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {GENDATE} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ License validity term %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {EXPIRE} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Expire %> (<%@ days %>)</td>
		<td class="td_comm td_padding_l7" width="50%">{TILLDATE}</td>
	</tr>
	
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Maximum users %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {USERLIMIT} %></td>
	</tr>	
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Platform Services %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {PLSERV} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Platform Telephony %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {PLTEL} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Platform Internet %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {PLINT} %></td>
	</tr>	
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Agents schema %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {USEOPER} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Fidelio integration %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {FIDELIO} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Module EC %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {MODULEEC} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ Inventory module %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {INVENTORY} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%">AV-Desk</td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {AVDESK} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%">CerberCrypt</td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {CERBERC} %></td>
	</tr>
	<tr>
		<td class="td_comm td_bold td_padding_l7" width="50%"><%@ External pay-systems %></td>
		<td class="td_comm td_padding_l7" width="50%"><%@ {PAYSYSTEMS} %> <!-- BEGIN ifPayExtCount -->({PCOUNT})<!-- END ifPayExtCount --></td>
	</tr>
	</table>

</td></tr>
<!-- END LiOptions -->
<!-- END ActivationForm -->
</table>

<!-- END Activation -->
<!-- BEGIN CerberCrypt -->
<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0" style="border-top: none">
	<tr>
		<td>
		<fieldset class="x-fieldset">
			<legend><%@ Cerber %></legend>
			<table class="table_comm" style="border: none" width="400">
				<tr>
					<td width="55%" class="td_comm" style="border: none"><%@ Use CerberCrypt %>:</td>
					<td width="45%" class="td_comm" style="border: none"><input type="checkbox" value="1" name="use_cerbercrypt" <!-- BEGIN UseCerber -->checked<!-- END UseCerber -->></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ CerberHost %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="cerber_host" value="{CERBERHOST}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ CerberLogin %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="cerber_login" value="{CERBERLOGIN}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ CerberPass %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="cerber_pass" value="{CERBERPASS}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ CerberPort %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="cerber_port" value="{CERBERPORT}"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ CerberCardsAmount %>:</td>
					<td class="td_comm" style="border: none"><input type="text" style="width: 180px" name="cerber_subscribers_amount" value="{CERBERCARDSAMOUNT}"></td>
				</tr>
			</table>
		</fieldset>
		</td>
	<tr>
</table>
<!-- END CerberCrypt -->
</form>
