// This file is part of Revision #1

//var months = Array('������', '�������', '����', '������', '���', '����', '����', '������', '��������', '�������', '������', '�������');
var months = Array('���.', '���.', '����', '���.', '���', '����', '����', '���.', '����.', '���.', '���.', '���.');
function DisplayDateControl(controlName, d, m, y, minY, maxY)
{
	var i, doc;

	doc = document;

	//����
	doc.write("<select name='" + controlName + "_dd' class=z11>");
	for (i=1; i<=31; i++)
		doc.write("<option value='" + i + "'" + (i==d ? " selected" : "") + ">" + i + "</option>");
	doc.write("</select>");

	//�����
	doc.write("<select name='" + controlName + "_mm' class=z11>");
	for (i=0; i<12; i++)
		doc.write("<option value='" + i + "'" + (i==m ? " selected" : "") + ">" + months[i] + "</option>");
	doc.write("</select>");

	//���
	
	doc.write("<select name='" + controlName + "_yyyy' class=z11>");
	for (i=minY; i<=maxY; i++)
		doc.write("<option value='" + i + "'" + (i==y ? " selected" : "") + ">" + i + "</option>");
	doc.write("</select>");
	
}


// ��������� ���� �����������
function check_acc_onplandate(F)
{
	var dd, mm, yyyy, dt;
	dd = F.vg_acc_onplandate_dd.value;
	mm = F.vg_acc_onplandate_mm.value;
	yyyy = F.vg_acc_onplandate_yyyy.value;
	dt = new Date(yyyy, mm, dd);
	if (dt.getDate() != dd)
	{
		alert("�������� �������� � ���� '���� �����������'! ���� "+dd+"."+(parseInt(mm)+1)+"."+yyyy+" �� ����������.");
		F.vg_acc_onplandate_dd.focus();
		return false;
	}
	return true;
}
