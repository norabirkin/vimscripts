<script type="text/javascript" src="js/holidays.js"></script>
<script type="text/javascript" src="js/tarif.js"></script>
<script language="javascript">
	var Localize = { Since: '<%@ Since %>', Till: '<%@ Till %>', Add: '<%@ Add %>', SaveCat: '<%@ Save category %>', Save: '<%@ Save %>', Cancel: '<%@ Cancel %>', Remove: '<%@ Remove %>', MB: '<%@ Mb %>', min: '<%@ min %>', Sun: '<%@ Sun %>', Mon: '<%@ Mon %>', Tue: '<%@ Tue %>', Wed: '<%@ Wed %>', Thu: '<%@ Thu %>', Fri: '<%@ Fri %>', Sat: '<%@ Sat %>', Cal: '<%@ Cald-r %>', WeekD: '<%@ Week days %>', ShpRate: '<%@ Shape %>', ShpToDay: '<%@ According to day and time %>', ShpToSize: '<%@ According to size %>', Size: '<%@ Size %>', Categories: '<%@ Categories %>', TimeDisc: '<%@ Time discounts %>', SizeDisc: '<%@ Size discounts %>', Bonus: '<%@ Bonus %>', Descr: '<%@ Description %>', PriceAbove: '<%@ Price above %>', Included: '<%@ Included %>', IncludedTraffTo: '<%@ Include traffic to main %>', Connecting: '<%@ Connecting %>', SendingData: '<%@ Sending data %>', DiscPrior: '<%@ Discount priority logic %>', Less: '<%@ less %>', Most: '<%@ most %>', BySize: '<%@ by size %>', ByTime: '<%@ by time %>', Yes: '<%@ Yes %>', No: '<%@ None %>', cu: '<%@ c.u. %>', NewCategory: '<%@ New category %>', ChangeCategory: '<%@ Change category %>', Save: '<%@ Save %>', CatPropChanged: '<%@ Category properties were changed %>', Discount: '<%@ Discount %>', Type: '<%@ Type %>', Catalogue: '<%@ Catalogue %>', Protocol: '<%@ Protocol %>', Directions: '<%@ Directions %>', Direction: '<%@ Direction %>', Mask: '<%@ Mask %>', Port: '<%@ Port %>', Number: '<%@ Number %>', TarifNoCat: '<%@ Tarif should have assigned catalogue %>', denyRmDef: '<%@ Can not remove default category %>', Properties: '<%@ Properties %>', TarifUsed: '<%@ There is tariffied data by this tarif %>', NoProp: '<%@ You cant change properties %>', Create: '<%@ Create %>', ShouldSaveTar: '<%@ Should save tarif before add new category %>', inFactCall: '<%@ Charge in fact of call %>', sec: '<%@ sec-s %>', freeChrg: '<%@ Free of charge %>', Round: '<%@ Accuracy of rounding %>', RndBgCall: '<%@ Round the begining of call %>', IncE: '<%@ Incoming-e %>', OutE: '<%@ Outgoing-e %>', NoSelCategory: '<%@ No selected category %>', CatlgNotDef: '<%@ Not defined catalogue for this operator %>', DirClass: '<%@ Direction class %>', Protocol: '<%@ Protocol %>', Mask: '<%@ Mask %>', Port: '<%@ Port %>', Search: '<%@ Search %>', Address: '<%@ address %>', RouteW: '<%@ Routes weights %>', Route: '<%@ Route %>', Weight: '<%@ Weight %>', WriteOff: '<%@ Write-off-s %>', oneTime: '<%@ one-time-e %>', Periodic: '<%@ Periodic-e %>', daily: '<%@ daily %>', monthly: '<%@ monthly %>', equalparts: '<%@ equal parts %>', Cost: '<%@ Cost %>', CostWhileOff: '<%@ Cost while off %>', cerberMask: '<%@ CerberMask %>', AddRecordsFile: '<%@ Add records from file %>', FileFormatShouldBe: '<%@ File format should be %>', Error: '<%@ Error %>', ErrorUndef: '<%@ There was an error while sending data to server %>', UplFile: '<%@ File uploading %>', File: '<%@ File %>', SelectFile: '<%@ Select file to upload %>', Upload: '<%@ Upload %>', CSVformatDescr: '<%@ CSVformatDescription %>', Format: '<%@ Line format %>',
	 DescUrl: '<%@ Description url %>', FullDesc: '<%@ Full description %>'}
</script>
<form method="POST" action="config.php" id="_Tarif">
<input type="hidden" id="_devision_" name="devision" value="4">
<input type="hidden" id="_tarif_" name="tarif" value="{TARIFID}">
<input type="hidden" id="_tartype_" name="tartype" value="{TARTYPE}">
<!-- BEGIN CatOperMode --><input type="hidden" id="_catnumbers_" name="catnumbers" value="{CATIDS}"><!-- END CatOperMode -->
<!-- BEGIN TarifUsed --><input type="hidden" id="_used_" name="used" value="1"><!-- END TarifUsed -->
<!-- BEGIN ifOperators --><input type="hidden" id="_operators_" name="operators" value="1"><!-- END ifOperators -->
<!-- BEGIN ifCerber --><input type="hidden" id="_cerber_" name="cerber" value="{USE_CERBER}"><!-- END ifCerber -->
<!-- BEGIN DTVSettings --><input type="hidden" id="_isdtv_" name="isdtv" value="1"><!-- END DTVSettings -->
<span id="_Extras"></span>

<!-- BEGIN SaveStatFalse -->
<table align="center" width="800" class="table_comm" style="margin-top: 22px;">
    <tr><td class="td_comm td_bold td_padding_l7" style="color: red;"><%@ There was an error while sending data to server %>: {SAVESTATERR}</td></tr>
</table>
<!-- END SaveStatFalse -->

<table align="center" width="800" class="table_comm">
	<tr><td class="td_head_ext"><%@ Tarif settings %></td></tr>
	<tr height="40">
		<td class="td_comm">
			&nbsp;
			<button type="submit" id="savebtn" title="<%@ Save %>" onClick="Storages.extract(this.form.id); createHidOrUpdate(this.form, 'save', 1); return saveNodeData(Storages.currNode, true)" >
				<img border=0 src="images1/create1.gif"></img>
			</button>
			<b><%@ Save %></b>
			<!-- BEGIN TarPermControl -->&nbsp;&nbsp;<button type="button" id="tarperm" title="<%@ Permissions to access tariff %>" onClick="tariffPermission({TARIFID})"><img border=0 src="images1/user_vgs.gif"></img></button>
			<b><%@ Permissions to access tariff %></b><!-- END TarPermControl -->
			<!-- BEGIN CalendarControl -->&nbsp;&nbsp;<button type="button" id="calendar" title="<%@ Calendar holidays %>" onClick="holidayMonthPanel()"><img border=0 src="images/calendar22.png"></img></button>
			<b><%@ Calendar holidays %></b><!-- END CalendarControl -->
		</td>
	</tr>
</table>
<table align="center" width="800" class="table_comm" style="margin-top: 22px">
	<tr>
		<td class="td_comm" style="border-right: none;" width="50%" valign="top">
		<fieldset>
		<legend><%@ Common %> <%@ settings %></legend>
			<table class="table_comm" style="border: none" width="100%">
			<!-- BEGIN existAdditional -->
			<tr><td class="td_comm" style="border: none" width="30%"><%@ Additional tarif %>:</td>
			<td class="td_comm" style="border: none" width="70%"><input type="checkbox" name="additional" value="1" <!-- BEGIN additional -->checked<!-- END additional -->></td></tr>
			<!-- END existAdditional -->
			<tr><td class="td_comm" style="border: none" width="30%"><%@ Dont allow to assign %>:</td>
			<td class="td_comm" style="border: none" width="70%"><input type="checkbox" name="unavaliable" value="1" <!-- BEGIN unavaliable -->checked<!-- END unavaliable -->></td></tr>
			

			<tr><td class="td_comm" style="border: none"><%@ Tarif type %>:</td>
			<td class="td_comm" style="border: none">
				<select onChange="this.form.submit()" style="width: 250px" id="_type_" name="type" <!-- BEGIN typedisabled -->disabled<!-- END typedisabled -->>
					
				<option value="0" <!-- BEGIN type_0 -->selected<!-- END type_0 -->><%@ Leased line %></option>
				<option value="1" <!-- BEGIN type_1 -->selected<!-- END type_1 -->>Dialup (<%@ by size %>)</option>
				<option value="2" <!-- BEGIN type_2 -->selected<!-- END type_2 -->>Dialup (<%@ by time %>)</option>
				<option value="3" <!-- BEGIN type_3 -->selected<!-- END type_3 -->><%@ Telephony %></option>
				<option value="4" <!-- BEGIN type_4 -->selected<!-- END type_4 -->>IP <%@ Telephony %></option>
				<option value="5" <!-- BEGIN type_5 -->selected<!-- END type_5 -->><%@ Services %></option>
				
				</select>
			</td></tr>

		
			<tr><td class="td_comm" style="border: none"><%@ Description %>:</td>
			<td class="td_comm" style="border: none"><textarea style="width: 250px; height: 35px" id="_descr_" data-cucumber='tarifdescr' name="descr">{DESCR}</textarea></td></tr>
			<tr>
				<td class="td_comm" style="border: none" width="60%"><%@ Description url %>:</td>
				<td class="td_comm" style="border: none" width="40"><input type="text" name="link" value="{LINK}"></td>
			</tr>		
			<tr>
				<td class="td_comm" style="border: none"><%@ Full description %>:</td>
				<td class="td_comm" style="border: none"><textarea style="width: 250px; height: 35px" id="_descr_" data-cucumber='tariffulldescr' name="descrfull">{DESCRFULL}</textarea></td>
			</tr>
				
			<tr><td class="td_comm" style="border: none"><%@ Currency %>:</td>
			<td class="td_comm" style="border: none"><select name="curid" id="_curid_" onChange="syncSymbolDisplay()" style="width: 150px" <!-- BEGIN currdisabled -->disabled<!-- END currdisabled -->><!-- BEGIN tarCurOpt --><option symbol="{CURRENCYSYMBOL}" value="{CURRENCYID}" <!-- BEGIN tarCurOptSel -->selected<!-- END tarCurOptSel -->>{CURRENCYNAME}</option><!-- END tarCurOpt --></option></td></tr>
			</table>
			<!-- BEGIN ifLimitTraff --><table class="table_comm" style="border: none" width="100%">
			<tr><td class="td_comm" style="border: none" width="30%"><%@ Traffic restriction %>:</td>
			<td class="td_comm" style="border: none" width="21%"><input type="text" style="width: 70px" name="trafflimit" value="{TRAFFLIMIT}"></td>
			<td class="td_comm" style="border: none" width="10%"><!-- BEGIN ifTarfLimMb -->(<%@ Mb %>)<!-- END ifTarfLimMb --><!-- BEGIN ifTarfLimMin -->(<%@ min %>)<!-- END ifTarfLimMin --></td>
			<td class="td_comm" style="border: none"><input type="text" style="width: 60px" id="_trafflimitper_" name="trafflimitper" value="{TRAFFLIMITPER}" <!-- BEGIN traffperdis -->disabled<!-- END traffperdis -->></td>
			<td class="td_comm" style="border: none"><select style="width: 70px" name="" onChange="if(this.value ==0){ try { document.getElementById('_trafflimitper_').disabled=true } catch(e) { }  } else { try { document.getElementById('_trafflimitper_').disabled=false } catch(e) { } }">
			<option value="0" <!-- BEGIN traffpersel_0 -->selected<!-- END traffpersel_0 -->><%@ Month %></option>
			<option value="1" <!-- BEGIN traffpersel_1 -->selected<!-- END traffpersel_1 -->><%@ Days %></option></select></td></tr>
			</table><!-- END ifLimitTraff -->
			<!-- BEGIN ifNotOperMode --><table class="table_comm" style="border: none" width="100%">
			<tr><td class="td_comm" style="border: none" width="30%"><%@ Catalogue %>:</td>
			<td class="td_comm" style="border: none"><select style="width: 250px" id="_catnumbers_" name="catnumbers" <!-- BEGIN catdisabled -->disabled<!-- END catdisabled -->>
			<!-- BEGIN catopt --><option type="{CATTYPE}" ownerid="{CATOWNERID}" value="{CATNUM}" <!-- BEGIN catoptsel -->selected<!-- END catoptsel -->>{CATNAME}</option><!-- END catopt -->
			</select></td></tr>
			</table><!-- END ifNotOperMode -->
			<!-- BEGIN ifTelephony --><table class="table_comm" style="border: none" width="100%">
			<tr><td class="td_comm" style="border: none" width="30%"><%@ Incoming-e %> <%@ calls %>:</td>
			<td class="td_comm" style="border: none"><select style="width: 250px" id="_chargeincoming_" name="chargeincoming">
			<option value="0" <!-- BEGIN incChargeSel_0 -->selected<!-- END incChargeSel_0 -->><%@ Do not tariff %></option><option value="1" <!-- BEGIN incChargeSel_1 -->selected<!-- END incChargeSel_1 -->><%@ Calling station number %></option><option value="2" <!-- BEGIN incChargeSel_2 -->selected<!-- END incChargeSel_2 -->><%@ Dialed number %></option>
			</select></td></tr>
			<!-- BEGIN ifVoIPRoute --><tr><td class="td_comm" style="border: none"><%@ Use dynamic routing %>:</td>
			<td class="td_comm" style="border: none"><select style="width: 250px" name="dynroute" id="_dynroute_"><option value="0" <!-- BEGIN VoIPRoute_0 -->selected<!-- END VoIPRoute_0 -->><%@ Not use %></option><option value="1" <!-- BEGIN VoIPRoute_1 -->selected<!-- END VoIPRoute_1 -->>LCR <%@ Least cost %></option><option value="2" <!-- BEGIN VoIPRoute_2 -->selected<!-- END VoIPRoute_2 -->>MWR <%@ Static %></option></select></td>
			</tr><!-- END ifVoIPRoute -->
			</table><!-- END ifTelephony -->

            <table class="table_comm" style="border: none" width="100%">
                <tr>
                <td>
                    <input type="hidden" name="saledictionaryid" id="_saledictionaryid_" value="{SALEDICTIONARYID}">
                    <fieldset style="border:none;padding:0;margins:0;">
                        <legend style="font-weight:normal;color:black;"><%@ Service code %>&nbsp;
                            <button type="button" style="width:22" onClick="clearFields('input#_saledictionaryid_,a#_saledictionarylink')" title="<%@ Clear %>"><img border="0" src="images/erase.png" title="<%@ Clear %>"></button>
                            <span style="padding-left:15px;"><a href="#" onClick="saleDictionary('_saledictionaryid_','_saledictionarylink','_Tarif')" id="_saledictionarylink" title="<%@ Change %>">
                            <!-- BEGIN saleDictionaryLinkUndef --><%@ Undefined %><!-- END saleDictionaryLinkUndef -->
                            {SALEDICTIONARYLINK}
                        </a></span>
                        </legend>
                    </fieldset>
                </td>
                </tr>
            </table>

        </fieldset>


		</td>
		<td class="td_comm" width="50%" valign="top">
		<!-- BEGIN ifChargeSettings --><fieldset>
		<legend><%@ Charge settings %></legend>
			<table class="table_comm" style="border: none" width="100%">
			<!-- BEGIN RentControl --><tr><td class="td_comm" style="border: none" width="58%"><%@ Rent %> (<span id="current"></span>):</td>
			<td class="td_comm" style="border: none" width="42%"><input type="text" name="rent" value="{RENT}" <!-- BEGIN rentreadonly -->readonly<!-- END rentreadonly -->></td></tr><!-- END RentControl -->
			<!-- BEGIN RentOffControl --><tr><td class="td_comm" style="border: none"><%@ Rent while off %> (<span id="currentoff"></span>):</td>
			<td class="td_comm" style="border: none"><input type="text" name="blockrent" value="{BLOCKRENT}" <!-- BEGIN blockrentreadonly -->readonly<!-- END blockrentreadonly -->></td></tr><!-- END RentOffControl -->
			<!-- BEGIN RentOffControl2 --><tr><td class="td_comm" style="border: none"><%@ User rent while off %>:</td>
			<td class="td_comm" style="border: none"><input type="text" name="usrblockrent" value="{USRBLOCKRENT}" <!-- BEGIN blockusrrentreadonly -->readonly<!-- END blockusrrentreadonly -->></td></tr><!-- END RentOffControl2 -->
			<!-- BEGIN RentOffControl3 --><tr><td class="td_comm" style="border: none"><%@ Admin rent while off %>:</td>
			<td class="td_comm" style="border: none"><input type="text" name="admblockrent" value="{ADMBLOCKRENT}" <!-- BEGIN blockadmrentreadonly -->readonly<!-- END blockadmrentreadonly -->></td></tr><!-- END RentOffControl3 -->


			<!-- BEGIN DiscountControl -->
			<tr>
				<td class="td_comm" style="border: none" colspan="2">
					<fieldset>
						<legend><%@ Cost range %></legend>
						<%@ Since %>&nbsp;<input type="text" id="coeflow" name="coeflow" style="width:50px;" value="{COEFLOW}" <!-- BEGIN coeflowreadonly -->readonly<!-- END coeflowreadonly -->>&nbsp;
						<%@ Till %>&nbsp;<input type="text" id="coefhigh" name="coefhigh" style="width:50px;" value="{COEFHIGH}" <!-- BEGIN coefhighreadonly -->readonly<!-- END coefhighreadonly -->>
						<div class="info"><%@ Coefficients relative to the base cost of the tariff %></div>
					</fieldset>
				</td>
			</tr>
			<!-- END DiscountControl -->

			<!-- BEGIN DailyRentControl --><tr><td class="td_comm" style="border: none"><%@ Write rent off %>:</td>
			<td class="td_comm" style="border: none"><select style="width: 150px" name="dailyrent">
			<option value="1" <!-- BEGIN dailyrent_1 -->selected<!-- END dailyrent_1 -->><%@ daily %></option>
			<option value="0" <!-- BEGIN dailyrent_0 -->selected<!-- END dailyrent_0 -->><%@ monthly %></option>
			</select></td></tr><!-- END DailyRentControl -->
			<tr><td class="td_comm" style="border: none" width="58%"><%@ Write prepayed service off %>:</td>
			<td class="td_comm" style="border: none"><select style="width: 150px" name="dynamicrent">
			<option value="0" <!-- BEGIN dynamicrent_0 -->selected<!-- END dynamicrent_0 -->><%@ fix %></option>
			<option value="1" <!-- BEGIN dynamicrent_1 -->selected<!-- END dynamicrent_1 -->><%@ dynamic %></option>
			<option value="2" <!-- BEGIN dynamicrent_2 -->selected<!-- END dynamicrent_2 -->><%@ combined %></option>
			</select></td></tr>
			<!-- BEGIN ifTelRent --><tr><td class="td_comm" style="border: none"><%@ Rent charges multiple to account phone numbers %>:</td>
			<td class="td_comm" style="border: none"><input type="checkbox" name="rentmultiply" value="1" <!-- BEGIN rentMultiple -->checked<!-- END rentMultiple -->></td>
			</tr><!-- END ifTelRent -->

			<!-- BEGIN TimeDurationControl -->
			<tr>
				<td class="td_comm" style="border: none"><%@ Duration rent fee %> (<%@ Days %>):</td>
				<td class="td_comm" style="border: none">
					<input type="text" name="blockrentduration" value="{BLOCKRENTDURATION}" >
				</td>
			</tr>
			<!-- END TimeDurationControl -->


			</table>
		</fieldset><!-- END ifChargeSettings -->
		<fieldset>
		<legend><%@ More %></legend>
			<table class="table_comm" style="border: none" width="100%">
			<tr><td class="td_comm" style="border: none" width="60%"><%@ Service blocking %>:</td>
			<td class="td_comm" style="border: none" width="40%"><select name="actblock" style="width: 150px">
			<option value="0" <!-- BEGIN actblock_0 -->selected<!-- END actblock_0 -->><%@ NonePrepaid %></option>
			<option value="1" <!-- BEGIN actblock_1 -->selected<!-- END actblock_1 -->><%@ Automatically %></option>
			<option value="2" <!-- BEGIN actblock_2 -->selected<!-- END actblock_2 -->><%@ Aggressive %></option>
			</select></td></tr>
			<!-- BEGIN ifTrafDir --><tr><td class="td_comm" style="border: none"><%@ Traffic direction %>:</td>
			<td class="td_comm" style="border: none"><select name="trafftype" style="width: 150px">
			<option value="1" <!-- BEGIN trafftype_1 -->selected<!-- END trafftype_1 -->><%@ Incoming %></option>
			<option value="2" <!-- BEGIN trafftype_2 -->selected<!-- END trafftype_2 -->><%@ Outgoing %></option>
			<option value="3" <!-- BEGIN trafftype_3 -->selected<!-- END trafftype_3 -->><%@ Sum %></option>
			<option value="4" <!-- BEGIN trafftype_4 -->selected<!-- END trafftype_4 -->><%@ Prevalent %></option>
			</select></td></tr><!-- END ifTrafDir -->
			<!-- BEGIN ifVoIPDropUnk --><tr><td class="td_comm" style="border: none"><%@ Drop unknown directions %>:</td>
			<td class="td_comm" style="border: none"><input type="checkbox" name="voipblocklocal" id="_voipblocklocal_" value="1" <!-- BEGIN BlkLocal -->checked<!-- END BlkLocal -->></td>
			</tr><!-- END ifVoIPDropUnk -->
			</table>
		</fieldset>
		</td>
	</tr>
	<!-- BEGIN ifRateControl --><tr><td class="td_head" colspan="2"><%@ Shape rate settings %></td></tr>
	<tr><td class="td_comm td_padding_l7" style="border: none" valign="top">
	<%@ Shape rate %>: <input type="text" style="width: 100px; margin-left: 10px; margin-right: 10px" name="shape" value="{SHAPE}"> (Kbit/<%@ sec %>)
	</td>
	<td class="td_comm td_padding_l7" style="border-bottom: none" valign="top">
	<%@ Shape rate priority logic %>: <select style="width: 150px; margin-left: 10px; margin-right: 10px" name="shapeprior">
		<option value="0" <!-- BEGIN shapeprior_0 -->selected<!-- END shapeprior_0 -->><%@ less %></option>
		<option value="3" <!-- BEGIN shapeprior_3 -->selected<!-- END shapeprior_3 -->><%@ most %></option>
		<option value="1" <!-- BEGIN shapeprior_1 -->selected<!-- END shapeprior_1 -->><%@ by size %></option>
		<option value="2" <!-- BEGIN shapeprior_2 -->selected<!-- END shapeprior_2 -->><%@ by time %></option>
	</select>
	</td></tr>
	<tr><td class="td_comm" colspan="2" valign="top" id="_ShaperTime"><div style="float: right" id="_ShaperSize"></div></td></tr><!-- END ifRateControl -->
</table>
</form>
<table align="center" width="800" class="table_comm" style="margin-top: 22px; border: none; background: none">
	<tr><td class="td_comm" valign="top" id="_Categories" style="padding: 0px; border: none"></td></tr>
</table>
