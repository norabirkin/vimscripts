<script language="javaScript" type="text/javascript" src="js/sbss_crm.js"></script>
<script type="text/javascript">
var Localize = { UsersLIst: '\{LOOKUSERS\}', ClientName: '\{USER_TIT\}', 
AgreementNumber: '\{AGREEMENT\}', SearchByName: '\{USER_S_FIO\}', 
Address: '\{ABON_ADDRESS\}', ToVgroup: '\{ASSOCWITHVGROUP\}', 
ServiceName: '\{SERV_SERV\}', UserVbroups: '\{USER_VGS_LIST\}', 
Login: '<%@ Login %>', Search: '<%@ Search %>', Agreement: '<%@ Agreement %>', 
Add: '<%@ OK %>', Cancel: '<%@ Cancel %>', Accounts: '<%@ Accounts %>',
 PersonFullName: '<%@ Person full name %>', 
 Blocking: '<%@ Blocking %>', Balance: '<%@ Balance %>', Device: '<%@ Device %>', 
 Port: '<%@ Port %>', Status: '<%@ Status %>', User: '<%@ User %>', Addr: '<%@ Address %>' }
</script>
<form method="POST" id="_sbssForm" action="config.php" enctype="multipart/form-data">
<input type="hidden" name="devision" value="1001">
<input type="hidden" name="ticketId" id="_ticketId_" value="{TICKETID}">
<!-- BEGIN allowAddPost --><input type="hidden" name="blocked" id="_blocked_" value="1">
<input type="hidden" name="defStatus" id="_defStatus_" value="{CURT_STATUS}">
<input type="hidden" name="defMan" id="_defMan_" value="{CURT_MAN}"><!-- END allowAddPost -->
<!-- BEGIN ticketEditHid --><input type="hidden" name="editPostId" id="_editPostId_" value="{EDITPOST}"><!-- END ticketEditHid -->
<!-- BEGIN fileToEdit --><input type="hidden" name="fileId" id="_fileId_" value="{EDITFILEID}"><!-- END fileToEdit -->

<!-- BEGIN errorShow -->
<table class="table_comm" width="950" align="center" cellpadding="0" cellspacing="0" style="margin-bottom: 17px">
	<tr height="22"><td colspan="2" class="td_head">{WHILESAVEERROR}</tr>
	<!-- BEGIN erroRow --><tr height="22" style="color: red"><td class="td_comm" style="padding-left: 5px;">{ERRORMESSAGE}</td>
	<td class="td_comm" width="80" align="center">{ERROR}</td></tr><!-- END erroRow -->
</table>
<!-- END errorShow -->

<!-- BEGIN postsList -->
<table class="table_comm" width="950" align="center" cellpadding="0" cellspacing="0" style="margin-bottom: 17px">
<tr><td class="td_head_ext" colspan="4">{T_TITLE}: {TICKET_TITLE} ({HD_STATUSE}: {STATUSNAME}<!-- BEGIN ToVG -->; {ISASSOCWITHVGROUP}: {ASSOCVALUE}<!-- END ToVG -->)</td></tr>
<!-- BEGIN row -->
<!-- BEGIN rowTitle -->
<tr height="22" bgcolor="#e0e0e0">
	<td width="400" class="td_comm" style="border-right: none; padding-left: 5px;">{T_AUTHOR}: <!-- BEGIN userInfo --><img src="images/16info.gif" onclick="getUserInfo({THISPERSONID}, '{AUTHORNAME}')"> <!-- END userInfo -->{AUTHORNAME}</td>
	<td width="60%" class="td_comm" style="border-right: none; padding-right: 5px; text-align: right;">{HD_DATE}: {CREATEDDATE}</td>
	<td width="30" class="td_comm" style="border-right: none; text-align: center;"><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','editPostId','{THISPOSTID}')"><img border="0" src="images/edit16.gif"></button></td>
	<td width="30" class="td_comm" align="center"><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','dropPostId','{THISPOSTID}')" title="{BROADCASRDROP}"><img border="0" src="images1/delete.gif" title="{BROADCASRDROP}"></button></td>
</tr>
<!-- END rowTitle -->
<!-- BEGIN rowSpec --><tr height="22" bgcolor="#FFF3F3"><td class="td_comm" colspan="4" style="padding: 5px;">{SPECTEXT}</td></tr><!-- END rowSpec -->
<!-- BEGIN rowMess --><tr><td class="td_comm" colspan="4" style="padding: 5px;" height="40">{ROWTEXT}</td></tr><!-- END rowMess -->
<!-- BEGIN rowFile --><tr height="22" bgcolor="#f0f0f0"><td class="td_comm" colspan="4" align="center">{THEREAREATTACHED}: {ISATTACHED}</td></tr>
<tr><td class="td_comm" colspan="4"><table width="100%" class="table_comm" style="border: none">
<tr height="22" bgcolor="#f0f0f0" align="center">
<td class="td_comm" style="border: none" width="130">{CARDCREATED}</td><td class="td_comm" style="border: none" width="130">{DATEOFEDIT}</td>
<td class="td_comm" style="border: none" width="140">{T_AUTHOR}</td><td class="td_comm" style="border: none">{HD_CRMFILE_DESCR}</td>
<td class="td_comm" style="border: none" width="130">{HD_CRMFILE}</td><td class="td_comm" style="border: none" width="70">{FILE_SIZE}</td>
<td class="td_comm" style="border: none" width="30">&nbsp;</td>
</tr><tr height="22" bgcolor="#f0f0f0" align="center">
<td class="td_comm" style="border: none" width="130">{THIS_FL_CREATED}</td><td class="td_comm" style="border: none" width="130">{THIS_FL_EDIT}</td>
<td class="td_comm" style="border: none" width="140">{THIS_FL_AUTHOR}</td><td class="td_comm" style="border: none">{THIS_FL_DESCR}</td>
<td class="td_comm" style="border: none" width="130">{THIS_FL_FILE}</td><td class="td_comm" style="border: none" width="70">{THIS_FL_SIZE}</td>
<td class="td_comm" style="border: none" width="30"><button type="button" class="img_button" title="{HD_SAVE}" onClick="location.href='helpdesk/sbssFiles.php?for=0&tid={THIS_FL_TID}&fid={THIS_FL_ID}'"><img border="0" src="images/fileexport.gif" title="{HD_SAVE}"></button></td>
</tr></table></td></tr><!-- END rowFile -->
<!-- BEGIN rowPostEmpty --><tr align="center" height="30"><td class="td_comm" colspan="4">{NODATA}</td></tr><!-- END rowPostEmpty -->
<!-- END row -->
</table>
<!-- END postsList -->



<table class="table_comm" width="950" align="center" cellpadding="0" cellspacing="0" style="border: none">
<tr><td>
	<table class="table_comm" width="100%">
	<tr><td class="td_head_ext">{HD_CREATE_TIKET}</td></tr>
	<tr height=40>
		<td class="td_comm">
			<!-- BEGIN setBlock -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm', 'blockTicket', 1)" title="{BLOCKTICKETTOEDIT}"><img title="{BLOCKTICKETTOEDIT}" border=0 src="images/man_lock.gif"></img></button>
			<b>{BLOCKTICKETTOEDIT}</b><!-- END setBlock -->
			<!-- BEGIN saveData -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm', 'save', 1)" title="{SAVE}"><img title="{SAVE}"  border=0 src="images1/create1.gif"></img></button>
			<b>{SAVE}</b><!-- END saveData -->
			<!-- BEGIN attachData -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="attachFormView('_UplFile')" title="{ATTACHFILE}"><img title="{ATTACHFILE}" name="create_new" border=0 src="images/attach.gif"></img></button>
			<b>{ATTACHFILE}</b><!-- END attachData -->
			<!-- BEGIN setKBCopy -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="attachFormView('_KBCopy')" title="{COPYALLTOKNOWLEDGES}"><img title="{COPYALLTOKNOWLEDGES}" border=0 src="images/editcopy.gif"></img></button>
			<b>{COPYALLTOKNOWLEDGES}</b><!-- END setKBCopy -->
			<!-- BEGIN assocToUser -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="showAccounts({ callbackok: linkVgToTicket})" title="{LIKEUSER}"><img title="{LIKEUSER}" border=0 src="images1/user_vgs.gif"></img></button>
			<b>{LIKEUSER}</b><!-- END assocToUser -->
			<!-- BEGIN setUnBlock -->&nbsp;&nbsp;<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm', 'blockTicket', 1)" title="{UNBLOCKTICKETTOEDIT}"><img title="{UNBLOCKTICKETTOEDIT}" border=0 src="images/unman_lock.gif"></img></button>
			<b>{UNBLOCKTICKETTOEDIT}</b><!-- END setUnBlock -->
		</td>
	</tr></table>
</td></tr>
<tr height="20"><td class="empty_back" colspan="2" style="border: none">&nbsp;</td></tr>
</table>
<!-- BEGIN newPost -->
<table class="table_comm" width="950" align="center" cellpadding="0" cellspacing="0">
<tr height="27">
	<td class="td_comm" align="center"><input type="text" name="name" style="width: 580px" value="{TICKETSUBJ}"></td>
	<td width="40" align="center"><input type="checkbox" name="spec" value="1" <!-- BEGIN isSpec -->checked<!-- END isSpec -->></td>
	<td class="td_comm" style="border-bottom: none" width="310">{IS_SERV}</td>
</tr>
<tr>
	<td class="td_comm" rowspan="{ROWSPANVALUE}" align="center">
	<textarea class="sbssTextArea" name="text">{POSTTEXT}</textarea>
	</td>
</tr>

<!-- BEGIN fullPostControl --><tr height="25">
	<td class="td_comm" colspan="2" style="border-bottom: none; padding-left: 14px; padding-bottom: 2px">
	{HD_STATUSE}:<br><select style="width: 322px; margin-top: 2px" name="status">
	<!-- BEGIN statusList --><option value="{STATUSID}" <!-- BEGIN statusListSel -->selected<!-- END statusListSel -->>{STATUSNAME}</option><!-- END statusList -->
	</select></td>
</tr>
<tr height="25">
	<td class="td_comm" colspan="2" style="border-bottom: none; padding-left: 14px; padding-bottom: 2px">
	{HD_CHANGE_MAN}:<br><select style="width: 322px; margin-top: 2px" name="man">
	<!-- BEGIN manList --><option value="{MANID}" <!-- BEGIN manListSel -->selected<!-- END manListSel -->>{MANNAME}</option><!-- END manList -->
	</select></td>
</tr>
<tr height="25">
	<td class="td_comm" colspan="2" style="border-bottom: none; padding-left: 14px; padding-bottom: 2px">
	{HD_REQUESTCLASS}:<br><select style="width: 322px; margin-top: 2px" name="reqClass">
	<!-- BEGIN requestList --><option value="{REQUESTID}" <!-- BEGIN requestListSel -->selected<!-- END requestListSel -->>{REQUESTNAME}</option><!-- END requestList -->
	</select></td>
</tr><!-- END fullPostControl -->

<!-- BEGIN nonePostControl --><tr height="75">
	<td class="td_comm" colspan="2" style="border-bottom: none; padding-left: 8px; padding-bottom: 2px">&nbsp;
	<!-- BEGIN fileInfo --><div style="background-color: #F5F7FA; border: 1px solid black; padding: 6px; width: 322px;">
	{HD_CRMFILE_DESCR}: {THISCRMFILEDESRC}<br><br>
	{HD_CRMFILE}: {THISFILEORIGINALNAME}<br><br>
	{FILE_SIZE}: {THISFILESIZE}
	</div><!-- END fileInfo --></td>
</tr><!-- END nonePostControl -->

<tr height="145">
	<td class="td_comm" colspan="2" valign="top" style="padding-left: 8px; padding-bottom: 2px">&nbsp;
	<div id="_UplFile" style="background-color: #F5F7FA; border: 1px solid black; padding: 6px; width: 322px;<!-- BEGIN attachFormNone -->display: none;<!-- END attachFormNone -->">
	{HD_CRMFILE_DESCR}:<br><input  class="input_comm" type="text" style="width: 322px;" name="fileDescr" value="{FILEDESCR}">
	{HD_CRMFILE}:<br><input class="input_comm" type="file" size="34" name="attach">
	</div>
	
	<div id="_KBCopy" style="margin-top: 7px; background-color: #F5F7FA; border: 1px solid black; padding: 6px; width: 322px;<!-- BEGIN KBCopyNone -->display: none;<!-- END KBCopyNone -->">
	<!-- BEGIN emptySubj --><b>[ <a href="#" onClick="newWindow('helpdesk/kbList.php', 750,600)">{CHOOSESUBJECT}</a> ]</b><!-- END emptySubj --><div id="_kbName" style="margin-top: 5px">{SUBJECTVALUE}</div>
	</div>
	
	<!-- BEGIN asClient --><div id="_asClient" style="margin-top: 7px; background-color: #F5F7FA; border: 1px solid black; padding: 6px; width: 322px;<!-- BEGIN asClientHid -->display: none;<!-- END asClientHid -->">
	<div>{TICKETASUSERREQUEST}: <span id="_Uname"></span></div>
	<div>{ASSOCWITHVGROUP}: <span id="_VnameUndef">[<i>{NOASSOCWITH}</i>]</span><span id="_Vname" style="display: none;"></span></div>
	</div><!-- END asClient -->
	</td>
</tr>
</table>

<!-- BEGIN showMailCopy --><table class="table_comm" width="950" align="center" cellpadding="0" cellspacing="0" style="margin-top: 20px; margin-bottom: 20px; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0">
<tr height="22"><td class="td_head" colspan="3">{DUPLICATEANSWER}</td></tr>
<!-- BEGIN mailDup --><tr height="22">
<!-- BEGIN dupCol --><td class="td_comm" style="border: none"><!-- BEGIN dupColCheck --><input type="checkbox" name="emailTo[]" value="{MANAGERID}" style="margin-left: 7px">&nbsp;{MANAGERNAME}<!-- END dupColCheck --><!-- BEGIN emptyDupCol -->&nbsp;<!-- END emptyDupCol --></td><!-- END dupCol -->
</tr><!-- END mailDup -->
</table><!-- END showMailCopy -->
<!-- END newPost -->
</form>
