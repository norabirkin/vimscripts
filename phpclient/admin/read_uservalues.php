<?php
/********************************************************************
	filename: 	read_uservalues.php
	modified:	November 04 2004 20:38:40.
	author:		LANBilling

	version:    LANBilling 1.8
*********************************************************************/
if (!session_is_registered("auth"))
{
	exit;
}

if($_POST['workmode'] != 2)
{
	if($_POST['uid1'] > 0) $_POST['uid'] = $_POST['uid1'];
	
$qstring=sprintf("select 
				descr, 
				name,
				phone,
				fax,
				email,
				agrm_num,
				bik,
				settl,
				corr,
				inn,
				country,
				city,
				street,
				bnum,
				bknum,
				apart,
				addr,
				country_u,
				city_u,
				street_u,
				bnum_u,
				bknum_u,
				apart_u,
				addr_u,
				pass_sernum,
				pass_no,
				pass_issuedate,
				pass_issuedep,
				pass_issueplace,
				birthdate,
				type, 
				login, 
				pass, 
				ogrn, 
				yu_index, 
				fa_index, 
				kod_1c,
				gen_dir_u, 
				gl_buhg_u, 
				kont_person, 
				act_on_what,  
				bank_name, 
				agrm_date,
				bill_delivery,
				category,
				branch_bank_name,
				kpp,
				treasury_name,
				treasury_account, 
				region_u, 
				district_u,
				settle_area_u, 
				region, 
				district, 
				settle_area, 
				b_index, 
				country_b, 
				city_b, 
				region_b,
				district_b,
				settle_area_b, 
				street_b, 
				bnum_b, 
				bknum_b, 
				apart_b, 
				addr_b, 
				birthplace,
				okpo,
				okved,
				wrong_active,
				wrong_date,
				ipaccess
				from accounts where uid=%d",$_POST['uid']);
printf("<input type=hidden name=uid value=%d>",$_POST['uid']);

$result=mysql_query($qstring) or die(mysql_error());
$cur_row=mysql_fetch_row($result);

	$_POST['user_descr'] = htmlspecialchars($cur_row[0]);
	printf("<input type=hidden name=user_descr_orig value=\"%s\">",$_POST['user_descr']);

	$_POST['user_name'] = htmlspecialchars($cur_row[1]);
	printf("<input type=hidden name=user_name_orig value=\"%s\">",$_POST['user_name']);
	$_POST['user_name'] = $cur_row[1];

	$_POST['user_phone'] = htmlspecialchars($cur_row[2]);
	printf("<input type=hidden name=user_phone_orig value=\"%s\">",$_POST['user_phone']);
	$_POST['user_phone'] = $cur_row[2];

	$_POST['user_fax'] = htmlspecialchars($cur_row[3]);
	printf("<input type=hidden name=user_fax_orig value=\"%s\">",$_POST['user_fax']);
	$_POST['user_fax'] = $cur_row[3];

	$_POST['user_email'] = htmlspecialchars($cur_row[4]);
	printf("<input type=hidden name=user_email_orig value=\"%s\">",$_POST['user_email']);
	$_POST['user_email'] = $cur_row[4];

	$_POST['agreement_num'] = htmlspecialchars($cur_row[5]);
	printf("<input type=hidden name=agreement_num_orig value=\"%s\">",$_POST['agreement_num']);
	$_POST['agreement_num'] = $cur_row[5];

	$_POST['user_rek1'] = htmlspecialchars($cur_row[6]);
	printf("<input type=hidden name=user_rek1_orig value=\"%s\">",$_POST['user_rek1']);
	$_POST['user_rek1'] = $cur_row[6];

	$_POST['user_rek2'] = htmlspecialchars($cur_row[7]);
	printf("<input type=hidden name=user_rek2_orig value=\"%s\">",$_POST['user_rek2']);
	$_POST['user_rek2'] = $cur_row[7];

	$_POST['user_rek3'] = htmlspecialchars($cur_row[8]);
	printf("<input type=hidden name=user_rek3_orig value=\"%s\">",$_POST['user_rek3']);
	$_POST['user_rek3'] = $cur_row[8];
	
	$_POST['user_inn'] = $cur_row[9];
	printf("<input type=hidden name=user_inn_orig value=\"%s\">",$_POST['user_inn']);	

	$_POST['user_country_f'] = $cur_row[10];
	printf("<input type=hidden name=user_country_f_orig value=\"%s\">",$_POST['user_country_f']);

	$_POST['user_city_f'] = $cur_row[11];
	printf("<input type=hidden name=user_city_f_orig value=\"%s\">",$_POST['user_city_f']);

	$_POST['user_street_f'] = $cur_row[12];
	printf("<input type=hidden name=user_street_f_orig value=\"%s\">",$_POST['user_street_f']);

	$_POST['user_bnum_f'] = $cur_row[13];
	printf("<input type=hidden name=user_bnum_f_orig value=\"%s\">",$_POST['user_bnum_f']);

	$_POST['user_bknum_f'] = $cur_row[14];
	printf("<input type=hidden name=user_bknum_f_orig value=\"%s\">",$_POST['user_bknum_f']);

	$_POST['user_apart_f'] = $cur_row[15];
	printf("<input type=hidden name=user_apart_f_orig value=\"%s\">",$_POST['user_apart_f']);

	$_POST['user_addr_f'] = $cur_row[16];
	printf("<input type=hidden name=user_addr_f_orig value=\"%s\">",$_POST['user_addr_f']);

	$_POST['user_country_u'] = $cur_row[17];
	printf("<input type=hidden name=user_country_u_orig value=\"%s\">",$_POST['user_country_u']);

	$_POST['user_city_u'] = $cur_row[18];
	printf("<input type=hidden name=user_city_u_orig value=\"%s\">",$_POST['user_city_u']);

	$_POST['user_street_u'] = $cur_row[19];
	printf("<input type=hidden name=user_street_u_orig value=\"%s\">",$_POST['user_street_u']);

	$_POST['user_bnum_u'] = $cur_row[20];
	printf("<input type=hidden name=user_bnum_u_orig value=\"%s\">",$_POST['user_bnum_u']);

	$_POST['user_bknum_u'] = $cur_row[21];
	printf("<input type=hidden name=user_bknum_u_orig value=\"%s\">",$_POST['user_bknum_u']);

	$_POST['user_apart_u'] = $cur_row[22];
	printf("<input type=hidden name=user_apart_u_orig value=\"%s\">",$_POST['user_apart_u']);

	$_POST['user_addr_u'] = $cur_row[23];
	printf("<input type=hidden name=user_addr_u_orig value=\"%s\">",$_POST['user_addr_u']);

	$_POST['user_pass_ser'] = $cur_row[24];
	printf("<input type=hidden name=user_pass_ser_orig value=\"%s\">",$_POST['user_pass_ser']);

	$_POST['user_pass_no'] = $cur_row[25];
	printf("<input type=hidden name=user_pass_no_orig value=\"%s\">",$_POST['user_pass_no']);

	$_POST['user_pass_issuedate'] = $cur_row[26];
	printf("<input type=hidden name=user_pass_issuedate_orig value=\"%s\">",$_POST['user_pass_issuedate']);

	$_POST['user_pass_issuedep'] = $cur_row[27];
	printf("<input type=hidden name=user_pass_issuedep_orig value=\"%s\">",$_POST['user_pass_issuedep']);

	$_POST['user_pass_issueplace'] = $cur_row[28];
	printf("<input type=hidden name=user_pass_issueplace_orig value=\"%s\">",$_POST['user_pass_issueplace']);

	$_POST['user_birthdate'] = $cur_row[29];
	printf("<input type=hidden name=user_birthdate_orig value=\"%s\">",$_POST['user_birthdate']);

	$_POST['user_type'] = $cur_row[30];
	printf("<input type=hidden name=user_type_orig value=\"%s\">",$_POST['user_type']);

	$_POST['user_login'] = $cur_row[31];
	printf("<input type=hidden name=user_login_orig value=\"%s\">",$_POST['user_login']);

	$_POST['user_pass'] = $cur_row[32];
	printf("<input type=hidden name=user_pass_orig value=\"%s\">",$_POST['user_pass']);
	
	$_POST['user_rek5'] = htmlspecialchars($cur_row[33]);
	printf("<input type=hidden name=user_rek5_orig value=\"%s\">",$_POST['user_rek5']);
	$_POST['user_rek5'] = $cur_row[33];
	
	$_POST['yu_index'] = htmlspecialchars($cur_row[34]);
	printf("<input type=hidden name=yu_index_orig value=\"%s\">",$_POST['yu_index']);
	$_POST['yu_index'] = $cur_row[34];
	
	$_POST['fa_index'] = htmlspecialchars($cur_row[35]);
	printf("<input type=hidden name=fa_index_orig value=\"%s\">",$_POST['fa_index']);
	$_POST['fa_index'] = $cur_row[35];
		
	$_POST['kod_1c'] = htmlspecialchars($cur_row[36]);
	printf("<input type=hidden name=kod_1c_orig value=\"%s\">",$_POST['kod_1c']);
	$_POST['kod_1c'] = $cur_row[36];
	
	$_POST['gen_dir_u'] = $cur_row[37];
	printf("<input type=hidden name=gen_dir_u_orig value=\"%s\">",$_POST['gen_dir_u']);
	
	$_POST['gl_buhg_u'] = $cur_row[38];
	printf("<input type=hidden name=gl_buhg_u_orig value=\"%s\">",$_POST['gl_buhg_u']);
	
	$_POST['kont_person'] = $cur_row[39];
	printf("<input type=hidden name=kont_person_orig value=\"%s\">",$_POST['kont_person']);
	
	$_POST['act_on_what'] = $cur_row[40];
	printf("<input type=hidden name=act_on_what_orig value=\"%s\">",$_POST['act_on_what']);
	
	$_POST['bank_name'] = $cur_row[41];
	printf("<input type=hidden name=bank_name_orig value=\"%s\">",$_POST['bank_name']);
	
	printf("<input type=hidden name=argeement_date_orig value=\"%s\">",htmlspecialchars($cur_row[42]));
	$_POST['agreement_date'] = $cur_row[42];
	
	printf("<input type=hidden name=bill_delivery_orig value=\"%s\">",htmlspecialchars($cur_row[43]));
	$_POST['bill_delivery'] = $cur_row[43];
		
	printf("<input type=hidden name=customer_category_orig value=\"%s\">",htmlspecialchars($cur_row[44]));
	$_POST['customer_category'] = $cur_row[44];
	
	printf("<input type=hidden name=branch_bank_name_orig value=\"%s\">",htmlspecialchars($cur_row[45]));
	$_POST['branch_bank_name'] = $cur_row[45];	
	
	printf("<input type=hidden name=kpp_orig value=\"%s\">",htmlspecialchars($cur_row[46]));
	$_POST['kpp'] = $cur_row[46];
	
	printf("<input type=hidden name=treasury_name_orig value=\"%s\">",htmlspecialchars($cur_row[47]));
	$_POST['treasury_name'] = $cur_row[47];
	
	printf("<input type=hidden name=treasury_account_orig value=\"%s\">",htmlspecialchars($cur_row[48]));
	$_POST['treasury_account'] = $cur_row[48];
	
	printf("<input type=hidden name=user_region_u_orig value=\"%s\">",htmlspecialchars($cur_row[49]));
	$_POST['user_region_u'] = $cur_row[49];
	
	printf("<input type=hidden name=user_district_u_orig value=\"%s\">",htmlspecialchars($cur_row[50]));
	$_POST['user_district_u'] = $cur_row[50];
	
	printf("<input type=hidden name=user_area_u_orig value=\"%s\">",htmlspecialchars($cur_row[51]));
	$_POST['user_area_u'] = $cur_row[51];
	
	printf("<input type=hidden name=user_region_f_orig value=\"%s\">",htmlspecialchars($cur_row[52]));
	$_POST['user_region_f'] = $cur_row[52];
	
	printf("<input type=hidden name=user_district_f_orig value=\"%s\">",htmlspecialchars($cur_row[53]));
	$_POST['user_district_f'] = $cur_row[53];
	
	printf("<input type=hidden name=user_area_f_orig value=\"%s\">",htmlspecialchars($cur_row[54]));
	$_POST['user_area_f'] = $cur_row[54];
	
	printf("<input type=hidden name=b_index_orig value=\"%s\">",htmlspecialchars($cur_row[55]));
	$_POST['b_index'] = $cur_row[55];
	
	printf("<input type=hidden name=user_country_b_orig value=\"%s\">",htmlspecialchars($cur_row[56]));
	$_POST['user_country_b'] = $cur_row[56];
	
	printf("<input type=hidden name=user_city_b_orig value=\"%s\">",htmlspecialchars($cur_row[57]));
	$_POST['user_city_b'] = $cur_row[57];
	
	printf("<input type=hidden name=user_region_b_orig value=\"%s\">",htmlspecialchars($cur_row[58]));
	$_POST['user_region_b'] = $cur_row[58];
	
	printf("<input type=hidden name=user_district_b_orig value=\"%s\">",htmlspecialchars($cur_row[59]));
	$_POST['user_district_b'] = $cur_row[59];
	
	printf("<input type=hidden name=user_area_b_orig value=\"%s\">",htmlspecialchars($cur_row[60]));
	$_POST['user_area_b'] = $cur_row[60];
	
	printf("<input type=hidden name=user_street_b_orig value=\"%s\">",htmlspecialchars($cur_row[61]));
	$_POST['user_street_b'] = $cur_row[61];
	
	printf("<input type=hidden name=user_bnum_b_orig value=\"%s\">",htmlspecialchars($cur_row[62]));
	$_POST['user_bnum_b'] = $cur_row[62];
	
	printf("<input type=hidden name=user_bknum_b_orig value=\"%s\">",htmlspecialchars($cur_row[63]));
	$_POST['user_bknum_b'] = $cur_row[63];
	
	printf("<input type=hidden name=user_apart_b_orig value=\"%s\">",htmlspecialchars($cur_row[64]));
	$_POST['user_apart_b'] = $cur_row[64];
	
	printf("<input type=hidden name=user_addr_b_orig value=\"%s\">",htmlspecialchars($cur_row[65]));
	$_POST['user_addr_b'] = $cur_row[65];
	
	printf("<input type=hidden name=user_birthplace_orig value=\"%s\">",htmlspecialchars($cur_row[66]));
	$_POST['user_birthplace'] = $cur_row[66];
	
	printf("<input type=hidden name=okpo_orig value=\"%s\">",htmlspecialchars($cur_row[67]));
	$_POST['okpo'] = $cur_row[67];
	
	printf("<input type=hidden name=okved_orig value=\"%s\">",htmlspecialchars($cur_row[68]));
	$_POST['okved'] = $cur_row[68];
	
	if($cur_row[71] == 1) $_POST["ipaccess"] = $cur_row[71];
	if ($cur_row[69] >=10)  $_POST['card_activation_flag'] = 1;	

	$_POST['card_deactivation_date'] = $cur_row[70];	
	
	/*
	$REAL_USER_ADDR = explode("|", stripslashes($cur_row[44]));
	$_POST['user_country_p'] = $REAL_USER_ADDR[0];
	$_POST['user_city_p'] = $REAL_USER_ADDR[1];
	$_POST['user_street_p'] = $REAL_USER_ADDR[2];
	$_POST['user_bnum_p'] = $REAL_USER_ADDR[3];
	$_POST['user_bknum_p'] = $REAL_USER_ADDR[4];
	$_POST['user_apart_p'] = $REAL_USER_ADDR[5];
	$_POST['us_index_p'] = $REAL_USER_ADDR[6];
	
	$_POST['user_addr_p'] = stripslashes($cur_row[45]); */
	
	

$qstring=sprintf("select group_id from usergroups_staff where uid=%d",$_POST['uid']);
$result=mysql_query($qstring);
do
{
$cur_row=mysql_fetch_row($result);
if($cur_row!=false)
$_POST['user_assigned2group_1'][] = $cur_row[0];
}while($cur_row != false);

} // конец if(workmode)

?>
