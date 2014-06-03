<?php
/********************************************************************
   filename:   templates.php
   modified:   8/12/2005
   author:     Maria Basmanova
*********************************************************************/

include ("localize.php");
include ("template_func.inc");

if (!session_is_registered("auth"))
{
   exit;
}

// Показать список шаблонов

?>
<script language="JavaScript">
function EditTemplate(id)
{
	var F = document.forms.empty;

	F.template_id.value = id;
	F.submit();
}
function SelectAll(F, name)
{
	var chkAll, arrChk;

	chkAll = F.elements[name+"_all"];
	arrChk = F.elements[name+"[]"];

	if (arrChk.length)
	{
		for (i=0; i<arrChk.length; i++)
			arrChk[i].checked = chkAll.checked;
	}
	else
	{
		arrChk.checked = chkAll.checked;
	}

}
function DeleteTemplates(F, name)
{
	var arrChk, cnt;

	arrChk = F.elements[name+"[]"];
	cnt = 0;

	if (arrChk.length)
	{
		for (i=0; i<arrChk.length; i++)
			if (arrChk[i].checked)
			{
				cnt++;
				break;
			}
	}
	else
	{
		if (arrChk.checked) cnt++;
	}

	if (cnt > 0)
	{
		if (confirm("Вы действительно хотите удалить выбранные шаблоны?"))
		{
			F.act.value="del";
			F.submit();
		}
	}
	else
	{
		alert("Пожалуйста, выберите шаблоны, которые нужно удалить!");
		return;
	}
}
</script>
<form name="empty" action="config.php" method="post">
	<input type="hidden" name="devision" value="111">
	<input type="hidden" name="act" value="edit">
	<input type="hidden" name="template_id">
</form>
<form style="margin:0" action="config.php" method="post">
	<input type="hidden" name="devision" value="111"/>
	<input type="hidden" name="act" />

	<table class="table_comm" width="990"  align="center" style="border: solid 1px #c0c0c0; border-bottom:0px;">
		<tr >
			<td height="22" align="center" bgcolor="#E0E0E0" style="border-bottom: solid 1px #c0c0c0;">
				<b><font class=z11><?PHP echo OPT_TEMPLATES?></font></b>
			</td>
		</tr>
		<tr>
			<td align="center">&nbsp;</td>
		</tr>
<?php

	$document_types = array(ANY, DOGOV, ATTACHMENT3, ADDITION);
	$account_types = array(ANY, USERTYPE1, USERTYPE2);

	// Список шаблонов
	$query = sprintf("select t.*, s.descr as agent_name
		from templates t left join settings s on t.agent_id=s.id
		where template_name <> '%s'
		order by s.descr", TEMPLATEX_NAME);
	$res = mysql_query($query, $descriptor);
	if($res){

		// Показывать ли кнопку "Удалить"?
		$blnDelete = false;
		if (mysql_num_rows($res))
			$blnDelete = true;
?>
		<tr>
			<td align="center">
				<input class=z11 type="button" value="<?PHP echo CREATE2?>" onClick="var F=this.form; F.act.value='new'; F.submit();" />
				<?PHP if ($blnDelete) printf("<input class=z11 type=\"button\" value=\"%s\" onClick=\"DeleteTemplates(this.form, 'template_id')\"/>", DELETE3); ?>
				<input class=z11 type="button" style=\"width: 120px;\"
            value="<?PHP echo EDIT_ACCLISTITEM_TEMPLATE?>" onClick="var F=this.form; F.act.value='edit_templatex'; F.submit();"/>
			</td>
		</tr>
		<tr>
			<td width=990>
				<br/>
				<table cellspacing="0" cellpadding="2" align="center" width="100%">
					<tr align="center">
						<td class=z11 width=40 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none; border-left: none;">
						<input type="checkbox" name="template_id_all" onClick="SelectAll(this.form, 'template_id')"/></td>
						<td class=z11 width=220 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo TEMPLATE_NAME?></b></td>
						<td class=z11 width=110 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo DOCUMENT_TYPE?></b></td>
						<td class=z11 width=110 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo ACCOUNT_TYPE?></b></td>
						<td class=z11 width=200 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo AGENT?></b></td>
						<td class=z11 width=200 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo ORIGINAL_FILENAME?></b></td>
						<td class=z11 width=110 bgcolor="f5f5f5" style="border: solid 1px #c0c0c0; border-right: none;"><b><?PHP echo FILE_SIZE?></b></td>
					</tr>
<?php
		while ($row=mysql_fetch_object($res))
		{
			printf("<tr>
					<td height=22 class=z11 align=center><input type='checkbox' name='template_id[]' value='%d'/></td>
					<td height=22 class=z11 align=center><a href='javascript:EditTemplate(%d)'>%s</a></td>
					<td height=22 class=z11 align=center>%s</td>
					<td height=22 class=z11 align=center>%s</td>
					<td height=22 class=z11 align=center>%s</td>
					<td height=22 class=z11 align=center>%s</td>
					<td height=22 class=z11 align=center>%s</td>
				</tr>",
				$row->template_id,
				$row->template_id,
				$row->template_name,
				$document_types[$row->document_type],
				$account_types[$row->account_type],
				$row->agent_id == 0 ? ANY : $row->agent_name,
				$row->original_filename,
				number_format($row->template_filesize/1024, 1));
		}
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}
?>
				</table>
			</td>
		</tr>
		<tr>
			<td style="border-bottom: solid 1px #c0c0c0;">&nbsp;</td>
		</tr>
	</table>
</form>
