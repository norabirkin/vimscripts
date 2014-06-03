<!-- BEGIN javascript_functions -->
<link rel="stylesheet" type="text/css" href="resources/extjs/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="resources/extjs/resources/css/xtheme-gray-extend.css">
<script type="text/javascript" src="resources/extjs/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="resources/extjs/ext-all.js"></script>
<script language="javascript">

// BEGIN javascript manipultions on page
//

function show_vg_list(tar_id){
	
	var vgroups_datastore;
	var vgroups_ColumnModel;       								// this will be a columnmodel
	var vgroups_EditorGrid;
	var vgroups_ListingWindow;
	
	vgroups_datastore = new Ext.data.Store({
      id: 'vgroups_datastore',
      proxy: new Ext.data.HttpProxy({
                url: 'config.php',      					// File to connect to
                method: 'POST'
            }),
	    baseParams:{async_call: 1, tarif_id: tar_id}, 			// запрос распечатки учетных записей и идентификатор тарифа
		reader: new Ext.data.JsonReader({   					// we tell the datastore where to get his data from
        root: 'results',
        totalProperty: 'total',
        id: 'id'
      },[ 
        {name: 'vg_id', type: 'int', mapping: 'vg_id'},
        {name: 'login', type: 'string', mapping: 'login'},
        {name: 'descr', type: 'string', mapping: 'descr'},
        {name: 'acc_ondate', type: 'string', mapping: 'acc_ondate'},
		{name: 'username', type: 'string', mapping: 'username'},
		{name: 'usermail', type: 'string', mapping: 'usermail'}
      ]),
      sortInfo:{field: 'vg_id', direction: "ASC"}
    });
	
	vgroups_ColumnModel = new Ext.grid.ColumnModel(
    [{
        header: '#',
        readOnly: true,
        dataIndex: 'vg_id', // this is where the mapped name is important!
        width: 50,
        hidden: false
      },{
        header: '{EXTJS_VG_LOGIN}',
        dataIndex: 'login',
        width: 150,
		readOnly: true
      },{
        header: '{EXTJS_VG_DESCRIPTION}',
        dataIndex: 'descr',
        width: 200,
		readOnly: true
      },{
        header: '{EXTJS_CREATE_DATE}',
        readOnly: true,
        dataIndex: 'acc_ondate',
        width: 120,
        hidden: false     
      },{
        header: '{EXTJS_USERNAME}',
        readOnly: true,
        dataIndex: 'username',
        width: 180,
        hidden: false     
      },{
        header: '{EXTJS_MAIL}',
        readOnly: true,
        dataIndex: 'usermail',
        width: 130,
        hidden: false     
      }]
    );
	
	
	
    vgroups_ColumnModel.defaultSortable= true;


	vgroups_EditorGrid =  new Ext.grid.EditorGridPanel({
      id: 'vgroups_EditorGrid',
      store: vgroups_datastore,     // the datastore is defined here
      cm: vgroups_ColumnModel,      // the columnmodel is defined here
      enableColLock:false,
      clicksToEdit:2,
      selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
      bbar: new Ext.PagingToolbar({
                pageSize: 50,
                store: vgroups_datastore,
                displayInfo: true
            })
      
    });
    
  vgroups_ListingWindow = new Ext.Window({
      id: 'vgroups_ListingWindow',
      title: '{EXTJS_SHOW_VG}',
      closable:true,
      width:850,
      height:450,
      plain:true,
      layout: 'fit',
      items: vgroups_EditorGrid  // We'll just put the grid in for now...
    });
    
  // Load the data  
  loadresult = vgroups_datastore.reload({params: {start: 0, limit: 50}});

  
  vgroups_ListingWindow.show();   // Display our window

};

// Send form to POST
function submit_form(action,id_values)
{
var form = document.forms[1];

if(action==-1) form.devision.value = 4;
if(action==1) form.devision.value = 41;

// Edit Tariff
if(action==2) { form.devision.value = 43; form.tarif_id.value = id_values; }

if(action>2)
{
  form.devision.value = 4;
  form.tarif_id.value = id_values;
  
  if(action==3)
  {
     if(form.time_bon_count) form.time_bon_count.value = 0;
     if(form.traf_bon_count) form.traf_bon_count.value = 0;
  }
  
  if((action == 5 || action == 6 || action == 7) && !check_fields(form)){ alert("{TARIFDISC_ALERT}"); return false; }
  if((action == 5 || action == 6) && form.descr.value == ""){ alert("{SETDESCRIPTION_ALERT}"); return false; }
  if((action == 5 || action == 6) && form.hidden_use_operator.value > 0) SaveCatalogFromArrayToHidden(form);
  if(action == 5 && form.tarif_id.value>0) form.tarif_actions.value = 6
  else form.tarif_actions.value = action;
}
else { form.tarif_actions.value = action; }

if(action) form.submit();
}

//////////////////////////////////////////////////////////////////
// BEGIN: Check fields
function check_fields(form)
{
	var pattern1 = /^b_val_\d+$/;
	var pattern2 = /^\w_timefrom_\d+$/;
	var pattern3 = /^\w_timeto_\d+$/;
	var pattern4 = /^tsdisc_\d+$/;
	var pattern5 = /^vsdisc_\d+$/;
	var pattern6 = /^d_val_\d+$/;
	var times = new Array();
	var j=0;
	for(var i=0; i<form.length; i++)
	{
		if(form.elements[i].type == "text" && pattern1.test(form.elements[i].name))
		{
			if(form.elements[i].value < 0) return false;
			if(form.elements[i].value.length == 0) form.elements[i].value = 0;
		}
		
		if(form.elements[i].type == "text" && form.elements[i].value < 0 && pattern4.test(form.elements[i].name)) return false;
		if(form.elements[i].type == "text" && form.elements[i].value < 0 && pattern5.test(form.elements[i].name)) return false;
		if(form.elements[i].type == "text" && (form.elements[i].value < 0 || form.elements[i].value.length == 0) && pattern6.test(form.elements[i].name)) return false;
		
		if(form.elements[i].type == "select-one" && pattern2.test(form.elements[i].name))
		{
			if(form.elements[i].value == -1) return false;
			
			var token = form.elements[i].name.split("\_");
			j=token[2];
			
			if(!times[j])
			{
				times[j] = new Array( new String(1), new String(1) );
			}
			
			times[j][0] = times[j][0] + ((form.elements[i].value.length == 1) ? "0" + form.elements[i].value : form.elements[i].value);
		}
		
		if(form.elements[i].type == "select-one" && pattern3.test(form.elements[i].name))
		{
			if(form.elements[i].value == -1) return false;
			times[j][1] = times[j][1] + ((form.elements[i].value.length == 1) ? "0" + form.elements[i].value : form.elements[i].value);
		}
		
	}
	
	if(times.length > 0)
	{
		for(var i in times)
		{
			if(typeof times[i] != 'object') continue;
			if(times[i][0] == times[i][1]) return false
			for(var j in times)
			{
				if(typeof times[i] != 'object') continue;
				if(j==i) continue;
				if(times[j][0] == times[i][0]) return false;
				if(times[j][1] == times[i][1]) return false;
				if(parseInt(times[j][0]) > parseInt(times[i][0]) && parseInt(times[j][0]) < parseInt(times[i][1])) return false;
				if(parseInt(times[j][1]) > parseInt(times[i][0]) && parseInt(times[j][1]) < parseInt(times[i][1])) return false;
			}
		}
	}
	
	return true;
}
// END: Check fields
//////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////
// BEGIN: Show or hide active block input
function show_hide_active_block(form)
{
  if(form.rent_mode.value == 2 || form.rent_mode.value == 5) document.getElementById(27).style.display='';
  if(form.rent_mode.value>2 && form.rent_mode.value<5 && form.tariff_type.value<2)
  {
     document.getElementById(21).style.display='';
     if(form.rent_mode.value == 4) document.getElementById(27).style.display='none';
     else document.getElementById(27).style.display='';
  }
  else
  {
     document.getElementById(21).style.display='none';
     if(form.rent_mode.value != 2 && form.rent_mode.value != 5) document.getElementById(27).style.display='none';
  }
}
// END: Show or hide active block input
//////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////
// BEGIN: Change form view depending on tarif type
function change_tarif_type(form)
{
// Rebuild form if none cable agents are selected
if(form.tariff_type.value>1)
{
  for(var i=2;i<12;i++)
  {
    // Show all fields for phone agents
    if(document.getElementById(i))
       document.getElementById(i).style.display='';
    // If operator mode is on than show for ivox simple boxes catalog lits and hide others
    if(form.tariff_type.value==4 && form.hidden_use_operator.value > 0 && i<4)
    {
       document.getElementById(i).style.display='none';
       document.getElementById((i+20)).style.display='';
    }
    if(form.tariff_type.value!=4 && form.hidden_use_operator.value > 0 && i<4)
    {
       document.getElementById((i+20)).style.display='none';
    }
  }
  for(var i=12;i<22;i++)
  {
    if(document.getElementById(i)) document.getElementById(i).style.display='none';
  }  
    document.getElementById('1').style.display='none';
    document.getElementById('103').innerHTML = "(" + SEC + ")";
    document.getElementById('105').innerHTML = SECONDSFORFREE;
    document.getElementById('106').innerHTML = LOCALCALLCOST;
    document.getElementById('108').style.display='none';

  if(form.tariff_type.value==6)
  {
    document.getElementById('104').innerHTML = "(" + RE + " 3a " + HOUR + ")";
  }
  else
  {
    document.getElementById('104').innerHTML = "(" + RE + " 3a " + MIN + ")";
  }

  if(form.tariff_type.value==5) document.getElementById('vbl').style.display='';
  else document.getElementById('vbl').style.display='none';
  
  if(form.tariff_type.value!=4 && form.tariff_type.value!=6)
  {
      document.getElementById('120').style.display = "";
      document.getElementById('109').style.display='';
  }
  else
  {
      document.getElementById('120').style.display = "none";
      document.getElementById('109').style.display='none';
  }

  clear_scenery_list(form,-1);
}
if(form.tariff_type.value==4)
{
  for(var i=12;i<19;i++)
  {
    if(document.getElementById(i))
       document.getElementById(i).style.display='';
  }
    document.getElementById('1').style.display='none';
    document.getElementById('11').style.display='none';
    document.getElementById('120').style.display = "none";
    document.getElementById('103').innerHTML = "(" + SEC + ")";
    document.getElementById('104').innerHTML = "(" + RE + " 3a " + MIN + ")";
    document.getElementById('105').innerHTML = SECONDSFORFREE;
    document.getElementById('106').innerHTML = LOCALCALLCOST;
    document.getElementById('108').style.display='none';

  clear_scenery_list(form,-1);
}
// Selected cable agents
if(form.tariff_type.value<2 || form.tariff_type.value==6)
{
  for(var i=1;i<19;i++)
  {
    if(document.getElementById(i))
       document.getElementById(i).style.display='none';
    if(form.hidden_use_operator.value > 0 && i>1 && i<4)
    {
       document.getElementById((i+20)).style.display='none';
    }
  }

  if(form.tariff_type.value==1)
    document.getElementById('19').style.display='none';
  
  if(form.tariff_type.value==0)
    document.getElementById('19').style.display='';

    document.getElementById('1').style.display='';
    document.getElementById('108').style.display='';
    document.getElementById('109').style.display='none';
    document.getElementById('vbl').style.display='none';
    
  if(form.tariff_type.value==6)
  {
    document.getElementById('103').innerHTML = "(" + MIN + ")";
    document.getElementById('107').innerHTML = "(" + MIN + ")";
  }
  else
  {
    document.getElementById('103').innerHTML = "(" + MB + ")";
    document.getElementById('107').innerHTML = "(" + MB + ")";
  }
  if(form.tariff_type.value==6)
  {
    document.getElementById('104').innerHTML = "(" + RE + " 3a " + HOUR + ")";
  }
  else
  {
    document.getElementById('104').innerHTML = "(" + RE + " 3a " + MB + ")";
  }
  document.getElementById('105').innerHTML = PREPAYMENTTRAFFIC;
  document.getElementById('106').innerHTML = OVERCOST;
  document.getElementById('120').style.display = "none";
}

if(form.tariff_type.value == 5)
{
  if(document.getElementById(25)) document.getElementById(25).style.display='';
}
else
{
  if(document.getElementById(25)) document.getElementById(25).style.display='none';
}

if(form.tariff_type.value<2) clear_scenery_list(form,1);
}
// END: Change form view depending on tarif type
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// BEGIN: Clear scenery list and fill them again depending on
//        tarif type was selected
function clear_scenery_list(form,whatdo)
{
  if(whatdo == -1)
  {
    for(var i=0;i<form.rent_mode.length;i++)
    {
      if(form.rent_mode.options[i].value==3)
        form.rent_mode.options[i]=null;
    
      if(form.rent_mode.options[i].value==4)
         form.rent_mode.options[i]=null;
    }
  }

  if(whatdo == 1)
  {
    for(var i=0;i<5;i++)
    {
      form.rent_mode.options[i] = new Option(ScName + " " + (i+1),(i+1));
    }
  }

  document.getElementById(21).style.display='none';
  document.getElementById(27).style.display='none';
}
// END: Clear scenery list and fill them again depending on...
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// BEGIN: Catalog boxes manipulations
function SetRemove_PhoneCatalog(whatbox,whatdo)
{
var form=document.forms[1];
var object_set;
var object_free;
if(whatbox==1)
{
  object_set = document.forms[1].catout_set;
  object_free = document.forms[1].catout_free;
}
if(whatbox==2)
{
  object_set = document.forms[1].catin_set;
  object_free = document.forms[1].catin_free;
}

if(whatdo>0)
{
  for(var i=0;i<object_free.length;i++)
  {
    if(object_free.options[i].selected==true)
    {
       if(whatbox==1) ParseArrayCatOut(object_free.options[i].value,whatdo);
       if(whatbox==2) ParseArrayCatIn(object_free.options[i].value,whatdo);
    }
  }
}

if(whatdo<0)
{
  for(var i=0;i<object_set.length;i++)
  {
    if(object_set.options[i].selected==true)
    {
       if(whatbox==1) ParseArrayCatOut(object_set.options[i].value,whatdo);
       if(whatbox==2) ParseArrayCatIn(object_set.options[i].value,whatdo);
    }
  }
}
  ClearOptionList(object_set);
  ClearOptionList(object_free);
  DrawOptionsInBoxes(whatbox,object_set,object_free);

  if(whatbox==1) form.change_catlistout.value=1;
  if(whatbox==2) form.change_catlistin.value=1;
}
// END: Catalog boxes manipulations
//////////////////////////////////////////////////////////////////

function ParseArrayCatOut(set_value,whatdo)
{
 for(var j=0;j<PhoneCatalogsOut.length;j++)
 {
   if(PhoneCatalogsOut[j][1]==set_value)
   {
     if(whatdo>0 && PhoneCatalogsOut[j][0]!=-1)
     {
        PhoneCatalogsOut[j][0]=1;
        var key_set = PhoneCatalogsOut[j][2];
        for(var k=0;k<PhoneCatalogsOut.length;k++)
        {
           if(PhoneCatalogsOut[k][2]==key_set && PhoneCatalogsOut[k][0]!=1)
              PhoneCatalogsOut[k][0]=-1;
        }
     }
     if(whatdo<0)
     {
        var key_set = PhoneCatalogsOut[j][2];
        for(var k=0;k<PhoneCatalogsOut.length;k++)
        {
           if(PhoneCatalogsOut[k][2]==key_set)
              PhoneCatalogsOut[k][0]=0;
        }
     }
   }
 }
}

function ParseArrayCatIn(set_value,whatdo)
{
 for(var j=0;j<PhoneCatalogsIn.length;j++)
 {
   if(PhoneCatalogsIn[j][1]==set_value)
   {
     if(PhoneCatalogsIn[j][0]!=-1 && whatdo==1)
     {
        PhoneCatalogsIn[j][0]=1;
        var key_set = PhoneCatalogsIn[j][2];
        for(var k=0;k<PhoneCatalogsIn.length;k++)
        {
           if(PhoneCatalogsIn[k][2]==key_set && PhoneCatalogsIn[k][0]!=1)
              PhoneCatalogsIn[k][0]=-1;
        }
     }
     if(whatdo==-1)
     {
        PhoneCatalogsIn[j][0]=0;
        var key_set = PhoneCatalogsIn[j][2];
        for(var k=0;k<PhoneCatalogsIn.length;k++)
        {
           if(PhoneCatalogsIn[k][2]==key_set && PhoneCatalogsIn[k][0]==-1)
              PhoneCatalogsIn[k][0]=0;
        }
     }
   }
 }
}

function ClearOptionList(list_object)
{
  do
  {
    for(var i=0;i<(list_object.length + 1);i++)
    {
      list_object.options[i]=null;
    }
  } while(list_object.length!=0);
}

function DrawOptionsInBoxes(whatbox,whereadd,wheredrop)
{
if(whatbox==1)
{
  for(var j=0;j<PhoneCatalogsOut.length;j++)
  {
    if(PhoneCatalogsOut[j][0]==1)
    {
      whereadd.options[whereadd.length] = new Option(PhoneCatalogsOut[j][1] + ", " + PhoneCatalogsOut[j][3],PhoneCatalogsOut[j][1])
    }
    if(PhoneCatalogsOut[j][0]==0)
    {
      wheredrop.options[wheredrop.length] = new Option(PhoneCatalogsOut[j][1] + ", " + PhoneCatalogsOut[j][3],PhoneCatalogsOut[j][1])
    }
  }
}
if(whatbox==2)
{
  for(var j=0;j<PhoneCatalogsIn.length;j++)
  {
    if(PhoneCatalogsIn[j][0]==1)
    {
      whereadd.options[whereadd.length] = new Option(PhoneCatalogsIn[j][1] + ", " + PhoneCatalogsIn[j][3],PhoneCatalogsIn[j][1])
    }
    if(PhoneCatalogsIn[j][0]==0)
    {
      wheredrop.options[wheredrop.length] = new Option(PhoneCatalogsIn[j][1] + ", " + PhoneCatalogsIn[j][3],PhoneCatalogsIn[j][1])
    }
  }
}
}

function SaveCatalogFromArrayToHidden(form)
{
  for(var i=0;i<PhoneCatalogsOut.length;i++)
  {
     var tmpName = "hidden_catout_" + PhoneCatalogsOut[i][1];
     for(var j=0;j<form.length;j++)
     {
        if(form.elements[j].type == "hidden" && form.elements[j].name == tmpName)
        {
           if(PhoneCatalogsOut[i][0]>0) { form.elements[j].value = PhoneCatalogsOut[i][0] }
           else { form.elements[j].value = 0 }
        }
     }
  }
  for(var i=0;i<PhoneCatalogsIn.length;i++)
  {
     var tmpName = "hidden_catin_" + PhoneCatalogsIn[i][1];
     for(var j=0;j<form.length;j++)
     {
        if(form.elements[j].type == "hidden" && form.elements[j].name == tmpName)
        {
           if(PhoneCatalogsIn[i][0]>0) { form.elements[j].value = PhoneCatalogsIn[i][0] }
           else { form.elements[j].value = 0 }
        }
     }
  }
}

  var ScName = "{SCENERY_NAME}";
  var RE = "{JRE}";
  var MB = "{JMB}";
  var MIN = "{JMIN}";
  var SEC = "{JSEC}";
  var HOUR = "{JHOUR}";
  var PREPAYMENTTRAFFIC = "{JPREPAYMENTTRAFFIC}";
  var OVERCOST = "{JOVERCOST}";
  var SECONDSFORFREE = "{JSECONDSFORFREE}";
  var LOCALCALLCOST = "{JLOCALCALLCOST}";
  var PhoneCatalogsOut = new Array()
<!-- BEGIN phone_catalog_list_array_1 -->
      PhoneCatalogsOut[{KEY}] = new Array({SET_TO_USE},{CAT_ID},{OPER_ID},"{CAT_NAME}")
<!-- END phone_catalog_list_array_1 -->
  var PhoneCatalogsIn = new Array()
<!-- BEGIN phone_catalog_list_array_2 -->
      PhoneCatalogsIn[{KEY}] = new Array({SET_TO_USE},{CAT_ID},{OPER_ID},"{CAT_NAME}")
<!-- END phone_catalog_list_array_2 -->
</script>
<!-- END javascript_functions -->

<!-- BEGIN create_edit_form -->
<form action="config.php" method=post>
<input type=hidden name=devision value="0">
<input type=hidden name=tarif_id value={TARIFFIDENTITFICATION}>
<input type=hidden name=tarif_actions value="0">
<table align=center cellspacing=0 cellpadding=0 border=0  width=850 style="border: solid 1px #c0c0c0;">
  <tr>
    <td colspan=2 height=25 align=center bgcolor=e0e0e0 style="border-bottom: solid 1px #c0c0c0;">
      <b>{TARIFFS}</b>
    </td>
  </tr>
  <tr>
    <td width=200 height=40 align="left" style="border-bottom: solid 1px #c0c0c0;border-bottom: none;" class="z11">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="width: 150px;">
      <!-- BEGIN create_edit_button -->
      <img src="images1/create1.gif" align="middle" height="25" hspace="0" vspace="0" width="25" Onclick="javascript: submit_form({CREATEEDITVALUE})" style="cursor: pointer;">&nbsp;&nbsp;
      <!-- END create_edit_button -->
      <b>{CREATE2}</b>
      </span>
    </td>
   <td height=40 align="left" style="border-bottom: solid 1px #c0c0c0;border-bottom: none;" class="z11">
     &nbsp;
     <!-- BEGIN show_back_message -->
     <span style="width: 200px;">
     <img src="images1/list1.ico" align="middle" height="32" hspace="0" vspace="0" width="32" Onclick="javascript: submit_form(-1)" style="cursor: pointer;">&nbsp;&nbsp;
     <b>{GOBACK}</b>
     </span>
     <!-- END show_back_message -->
   </td>
  </tr>
</table>

<!-- BEGIN create_edit_bonuces -->
<script language="javascript">
function AddRemoveBonus(whatdo,type,line_id)
{
  document.forms[1].devision.value = 4;
  document.forms[1].tarif_actions.value = 3;

if(whatdo==1)
{
  document.forms[1].disc_action.value++;
  if(document.forms[1].bonus_type.value == 0) document.forms[1].disc_type.value = 0;
  if(document.forms[1].bonus_type.value == 1) document.forms[1].disc_type.value = 1;
}

if(whatdo==-1)
{
  document.forms[1].disc_line.value = line_id;
  document.forms[1].disc_type.value = type;
  document.forms[1].disc_action.value--;
}

  document.forms[1].submit();
}
</script>
<input type=hidden name=t_disc_count value={TIMEBONCOUNT}>
<input type=hidden name=v_disc_count value={TRAFBONCOUNT}>
<input type=hidden name=disc_line value="">
<input type=hidden name=disc_type value="">
<input type=hidden name=disc_action value="">
<table id="bonuses" align=center cellspacing=0 cellpadding=0 border=0  width=850 style="border: solid 1px #c0c0c0;border-bottom: none;">

  <tr>
    <td colspan=8 height=25 align=center bgcolor=e0e0e0 style="border-bottom: solid 1px #c0c0c0;font-weight: bold;">{CARD_TARIFTYPE_NAME}</td>
  </tr>

  <!-- BEGIN warn_message_bonuces -->
  <tr>
    <td class="tarif_table_grid_2" width=15>&nbsp;</td>
    <td class="tarif_table_grid_2"><div style="margin: 6px;">{REASSIGNTARIFFORBONUCES}:</div></td>
    <td class="tarif_table_grid_1" colspan=5><input type="checkbox" name=clone class=z11 size=15 style="margin: 6px;" {REASSIGNCHECKED}></td>
  </tr>
  <!-- END warn_message_bonuces -->

  <!-- BEGIN tariff_properties_card_in_discounts -->
  <tr class=z11>
    <td class="tarif_table_grid_2" width=15>&nbsp;</td>
    <td class="tarif_table_grid_2" width=200><div style="margin: 6px;"><b>{CARDLINENAME}:</b><div></td>
    <td class="tarif_table_grid_1" colspan=5><div style="margin: 6px;">{CARDLINEVALUE}<div></td>
  </tr>
  <!-- END tariff_properties_card_in_discounts -->

  <tr>
    <td class="tarif_table_grid_2" width=15 align=center><input type="checkbox" name=webonus class=z11 size=15 style="margin: 6px;" {WEDISCCHECKED}></td>
    <td class="tarif_table_grid_2"><div style="margin: 6px;">{WEEKENDDIS}:</div></td>
    
    <!-- BEGIN weshape -->
    <td colspan=2 class="tarif_table_grid_1" align="right">
       <div style="margin: 6px;"><b>{WESHAPESPEED}:</b> <input type="text" name=weshapeval class=z11 style="margin-left: 6px; width: 50px; text-align: right;" value="{SHAPEVALUE}"></div>
    </td>
    
    <td class="tarif_table_grid_1" width=30><div style="margin: 6px;">
      <select class=z11 name=we_disc_shape>
         <!-- BEGIN weshape_type -->
         <option value={SHAPETYPEVAL} {SHAPETYPESEL}>{SHAPETEXT}</option>
         <!-- END weshape_type -->
      </select></div>
    </td>
    <!-- END weshape -->
    
    <!-- BEGIN empty_weshape -->
    <td colspan=3 class="tarif_table_grid_1">&nbsp;</td>
    <!-- END empty_weshape -->
    
    <td class="tarif_table_grid_2" align="right">
       <div style="margin: 6px;"><b>{WEBONUSISTEXT}:</b> <input type="text" name=wediscount class=z11 style="margin-left: 6px; width: 50px; text-align: right;" value="{WEDISCOUNTVALUE}"></div>
    </td>

    <!-- BEGIN wediscount_selector -->
    <td class="tarif_table_grid_1" width=30><div style="margin: 6px;">
      <select class=z11 name=we_disc_type>
         <!-- BEGIN we_disc_selector_block -->
         <option value={WEDISCOUNTSELECTORVALUE} {WEDISCOUNTSELECTORSELECTED}>{WEDISCOUNTSELECTORTEXT}</option>
         <!-- END we_disc_selector_block -->
      </select></div>
    </td>
    <!-- END wediscount_selector -->
  </tr>

  <tr>
   <td class="tarif_table_grid_2" width=15>&nbsp;</td>
   <td class="tarif_table_grid_2"><div style="margin: 6px;">{TYPEOFDISCOUNT}:</div></td>
   <td class="tarif_table_grid_1" colspan=5><div style="margin: 6px;">
    <select class=z11 name=bonus_type>
      <!-- BEGIN bonuce_type_option -->
        <option value={BONUCETYPESELECTVALUE}>{BONUCETYPESELECT}</option>
      <!-- END bonuce_type_option -->
     </select>&nbsp;&nbsp;<img src="images/left.gif" onclick="javascript: AddRemoveBonus(1,0,0)" style="cursor: pointer;">
  </div></td>
  </tr>

  <!-- BEGIN bonuses_block -->

  <!-- BEGIN bonuses_line -->

  <!-- BEGIN bonus_type_title -->
  <tr>
    <td class="tarif_table_grid_2" colspan=8 height=25 align=center bgcolor=e0e0e0 style="border-bottom: solid 1px #c0c0c0;font-weight: bold;">{BONUSTYPETITLE}</td>
  </tr>
  <!-- END bonus_type_title -->

  <tr>
    <td class="tarif_table_grid_2" width="15"><div style="margin: 6px;">
      <!-- BEGIN drop_bonus_line -->
      <img src="images1/delete.gif" onclick="javascript: AddRemoveBonus(-1,{DISCOUNTTYPE},{DISCOUNTNUM})" style="cursor: pointer;">
      <!-- END drop_bonus_line -->
    </div></td>

    <!-- BEGIN bonus_trafic_size -->
    <td class="tarif_table_grid_1" align="center"><div style="margin: 6px;">
      <b>{VOLUME} ({VOLTYPE}):</b> <input type="text" name=d_val_{DISCLINE} class=z11 style="margin-left: 2px; width: 60px;" value="{BONUSTRAFVALUE}">
    </div></td>
    <!-- END bonus_trafic_size -->

    <!-- BEGIN bonus_plus -->
    <td class="tarif_table_grid_1" align="center"><div style="margin: 5px;" align="center">
      <b>{BONUSPLUSTEXT}:</b> <input type="text" name=b_val_{DISCLINE} class=z11 style="margin-left: 2px; width: 60px;" value="{BONUSPLUSVALUE}">
    </div></td>
    <!-- END bonus_plus -->

    <!-- BEGIN clocks -->
    <td class="tarif_table_grid_1" align="center"><div style="margin: 6px;">
      <!-- BEGIN clock_selector -->
      <b>{TEMPVAL1}</b>
      <select class=z11 name={TIMESELECTORNAME}>
        <!-- BEGIN clock_option -->
        <option value={CLOCKVALUE} {CLOCLVALUESELECTED}>{CLOCKTEXT}</option>
        <!-- END clock_option -->
      </select>
      <b>{TEMPVAL2}</b>
      <!-- END clock_selector -->
    </div></td>
    <!-- END clocks -->
    
    <!-- BEGIN shape_rate -->
    <td class="tarif_table_grid_1" align="right">
    <div style="margin: 6px;">
      <b>{SHAPESPEED}:</b> <input type="text" name={SHAPEDISNAME} class=z11 style="margin-left: 6px; width: 50px; text-align: right;" value="{SHAPEDISVALUE}">
    </div>
    </td>
    
    <td class="tarif_table_grid_1" width=30><div style="margin: 6px;">
       <select class=z11 style="width: 75px;" name=d_sel_{SDISCLINE}>
         <!-- BEGIN shape_type -->
         <option value={SHAPEDISSELVALUE} {SHAPEDISSEL}>{SHAPEDISSELTEXT}</option>
         <!-- END shape_type -->
       </select>
    </div></td>
    <!-- END shape_rate -->
    
    <!-- BEGIN empty_shape -->
    <td colspan=2 class="tarif_table_grid_1" width=20%>&nbsp;</td>
    <!-- END empty_shape -->
    
    <td class="tarif_table_grid_1" align="right">
    <div style="margin: 6px;">
      <b>{BONUSISTEXT}:</b> <input type="text" name={DISCOUNTNAME} class=z11 style="margin-left: 6px; width: 50px; text-align: right;" value="{DISCOUNTVALUE}">
    </div>
    </td>

    <td class="tarif_table_grid_1" width=30><div style="margin: 6px;">
       <select class=z11 style="width: 50px;" name=d_sel_{DISCLINE}>
         <!-- BEGIN disc_selector_block -->
         <option value={DISCOUNTSELECTORVALUE} {DISCOUNTSELECTORSELECTED}>{DISCOUNTSELECTORTEXT}</option>
         <!-- END disc_selector_block -->
       </select>
    </div></td>

  </tr>
  <!-- END bonuses_line -->
  <!-- END bonuses_block -->

</table>
<!-- END create_edit_bonuces -->

<!-- BEGIN create_edit_table -->
<input type=hidden name=change_catlistout value=0>
<input type=hidden name=change_catlistin value=0>
<input type=hidden name=hidden_tariff_type value={HIDDENTARIFFTYPE}>
<input type=hidden name=hidden_rent_mode value={HIDDENRENTMODE}>
<input type=hidden name=hidden_use_operator value={HIDDENOPERUSE}>
<!-- BEGIN hidden_cat_in_oper -->
<input type=hidden name={HIDDENCATINOPERUSENAME} value={HIDDENCATINOPERUSEVALUE}>
<!-- END hidden_cat_in_oper -->
<table align=center cellspacing=0 cellpadding=0 border=0  width=850 style="border: solid 1px #c0c0c0;">
  <tr>
    <td colspan=2 height=25 align=center bgcolor=e0e0e0 style="border-bottom: solid 1px #c0c0c0;">
       <b>{CREATEBASICTARIFF}</b>
    </td>
  </tr>
  
  <!-- BEGIN warn_message -->
  <tr>
    <td class="tarif_table_grid_2" colspan=2 align=center style="color:red;" height=25>
     {TARIFFABOUTTOCLONE}
    </td>
  </tr>
  <!-- END warn_message -->
  <!-- BEGIN show_unavaliable -->
  <tr>
    <td class="tarif_table_grid_2"  width="290"><div style="margin: 7px;margin-left: 10px;">{HIDETARIFSTOADD}:</div></td>
    <td class="tarif_table_grid_1"><input type="checkbox" name="unavaliable" value="1" class=z11 size=15 style="margin-left: 10px;" <!-- BEGIN unavl_chk -->checked<!-- END unavl_chk -->></td>
  </tr>
  <!-- END show_unavaliable -->
  <!-- BEGIN show_clone_message -->
  <tr style="display: {VISIBILITYIFTARIFEDIT};">
    <td class="tarif_table_grid_2"  width="290"><div style="margin: 7px;margin-left: 10px;">{REASSIGNTARIF}:</div></td>
    <td class="tarif_table_grid_1"><input type="checkbox" name=clone class=z11 size=15 style="margin-left: 10px;"></td>
  </tr>
  <!-- END show_clone_message -->
  <tr>
    <td class="tarif_table_grid_2" width="290"><div id=105 style="margin: 7px;margin-left: 10px;">{LINE1}:</div></td>
    <td class="tarif_table_grid_1"><input type="text" name=includes class=z11 size=15 value="{INCLUDES}" style="margin-left: 10px;">&nbsp;<span id=103>{UNITVALUE1}</span></td>
  </tr>
 
  <tr>
    <td class="tarif_table_grid_2" width="290"><div id=106 style="margin: 7px;margin-left: 10px;">{LINE2}:</div></td>
    <td class="tarif_table_grid_1"><input type="text" name=above class=z11 size=15 value="{ABOVE}" style="margin-left: 10px;">&nbsp;<span id=104>{UNITVALUE2}</span></td>
  </tr>

  <tr id="vbl" style='display: {VBL_VISIBLE}'>
    <td class="tarif_table_grid_2" width="290"><div id=106 style="margin: 7px;margin-left: 10px;">{BLOCKLOCALCALLS}:</div></td>
    <td class="tarif_table_grid_1"><input type="checkbox" name=voip_block_local value="1" {VBL_CHECKED} style="margin-left: 10px;"></td>
  </tr>

  <tr>
    <td class="tarif_table_grid_2" width="290"><div style="margin: 7px;margin-left: 10px;">{COSTFORUSE}:</div></td>
    <td class="tarif_table_grid_1"><input type="text" name=rent class=z11 size=15 value="{RENT}" style="margin-left: 10px;">&nbsp;{UNITVALUE3}</td>
  </tr>

  <tr id="109" <!-- BEGIN multiple_rent -->style="display: none;"<!-- END multiple_rent -->>
    <td class="tarif_table_grid_2" width="290"><div style="margin: 7px;margin-left: 10px;">{RENTMULTIPLY}:</div></td>
    <td class="tarif_table_grid_1"><input type="checkbox" name="rent_multiply" value="1" <!-- BEGIN rentMcheck -->checked<!-- END rentMcheck --> style="margin-left: 10px;"></td>
  </tr>

  <tr id=27 style='display: {VISIBILITYBLOCK_RENT}'>
    <td class="tarif_table_grid_2" width="290"><div style="margin: 7px;margin-left: 10px;">{COSTFORUSE_INBLOCK}:</div></td>
    <td class="tarif_table_grid_1"><input type="text" name=block_rent class=z11 size=15 value="{BLOCK_RENT}" style="margin-left: 10px;">&nbsp;{UNITVALUE3}</td>
  </tr>
 
  <tr>
    <td class="tarif_table_grid_2" width="290"><div style="margin: 7px;margin-left: 10px;">{DESCRIPTION}:</div></td>
    <td class="tarif_table_grid_1"><input type="text" name=descr class=z11 size=55 value="{DESCR}" style="margin-left: 10px;"></td>
  </tr>

  <tr>
    <td class="tarif_table_grid_2" width="290"><span style="margin-left: 10px;">{AB_PLATA_WHILE_BLOK}:</span></td>
    <td class="tarif_table_grid_1">
      <select class=z11 name=rent_mode style="width: 240px;margin: 4px;margin-left:10px;" onchange="javascript: show_hide_active_block(this.form)" {SELECTBLOCKS}>
        <!-- BEGIN scenery_options -->
        <option value={SCENERY_OPTIONS} {OPTIONSCENERYSPECL}>{SCENERY} {SCENERY_VALUE}</option>
        <!-- END scenery_options -->
    </td>
  </tr>

  <tr id=21 style="display: {VISIBILITYACTBLOCK};">
    <td class="tarif_table_grid_2" width="290"><div style="margin: 7px;margin-left: 10px;">{USE_ACTIVE_BLOCKING}:</div></td>
    <td class="tarif_table_grid_1"><input type="checkbox" name=act_block class=z11 size=15 style="margin-left: 10px;" {ACTBLOCKCHECKED}></td>
  </tr>

  <tr>
    <td class="tarif_table_grid_2" width="290"><span style="margin-left: 10px;">{TARIFFTYPE}:</span></td>
    <td class="tarif_table_grid_1">
      <select class=z11 name=tariff_type style="width: 240px;margin: 4px;margin-left:10px;" onchange="javascript: change_tarif_type(this.form)" {SELECTBLOCKS}>
       <!-- BEGIN tariftype_options -->
       <option value={TARIFTYPE_VALUE} {TARIFTYPESELECT}>{TARIFTYPE_NAME}</option>
       <!-- END tariftype_options -->
    </td>
  </tr>

  <!-- BEGIN voip_route -->
  <tr id=25 style="display: {VOIPROUTEDISPLAY}">
    <td class="tarif_table_grid_2" width="290"><span style="margin-left: 10px;">{VOIPROUTETITLE}</span></td>
    <td class="tarif_table_grid_1">
      <select class=z11 name=dyn_route style="width: 240px;margin: 4px;margin-left:10px;">
        <!-- BEGIN voip_route_options -->
        <option value={VOIPROUTEOPTION}>{VOIPROUTENAME}</option>
        <!-- END voip_route_options -->
      </select>
    </td>
  </tr>
  <!-- END voip_route -->

  <tr id="1" <!-- BEGIN shape_hide -->style="display: none;"<!-- END shape_hide -->>
	<td class="tarif_table_grid_2" width="290"><div style="margin: 7px; margin-left: 10px;">{SHAPE}</div></td>
    <td class="tarif_table_grid_1">
	<input type=text class=z11 name="shape" size=15 style="margin-left:10px;" title="{SHAPETITLE}" value="{SHAPEVALUE}">
    </td>
  </tr>

  <tr id="108" <!-- BEGIN expense_hide -->style="display: none;"<!-- END expense_hide -->>
	<td class="tarif_table_grid_2" width="290"><div style="margin: 7px; margin-left: 10px;">{RESTRICTPERIODTRAFFIC}:</div></td>
    <td class="tarif_table_grid_1">
	<input type=text class=z11 name="traff_limit" size=15 style="margin-left:10px;" value="{TRAFFLIMIT}">&nbsp;&nbsp;<span id=107>{UNITVALUE1}</span>&nbsp;
	<input type=text class=z11 name="traff_limit_per" size=11 style="margin-left:10px;" value="{TRAFFLIMITPER}" <!-- BEGIN traffLimitP -->disabled<!-- END traffLimitP -->>&nbsp;
	<select class="z11" name="traff_limit_flag" style='width: 80px' onChange='if(this.value==1) this.form.traff_limit_per.disabled=false; else this.form.traff_limit_per.disabled=true;'>
	<option value="0" <!-- BEGIN traffLimitFlag_0 -->selected<!-- END traffLimitFlag_0 -->>{MONTH}</option>
	<option value="1" <!-- BEGIN traffLimitFlag_1 -->selected<!-- END traffLimitFlag_1 -->>{DAYS}</option></select>
    </td>
  </tr>

  <!-- BEGIN simple_catalog_down_box -->
  <tr id={IDVALUE} style="display: {VISIBILITYCATALOG};">
    <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{LINEVALUE}:</div></td>
    <td class="tarif_table_grid_1">
      <select class=z11 name={ELEMENTNAME} style="width: 240px;margin: 4px;margin-left:10px;">
        <!-- BEGIN simple_catalog_option -->
        <option value={OPTIONVALUE} {OPTIONVALUESELECTED}>{OPTIONTEXT}</option>
        <!-- END simple_catalog_option -->
    </td>
  </tr>
  <!-- END simple_catalog_down_box -->

  <!-- BEGIN ifuse_operators -->
  <tr id={IDVALUE_IFOPER} style="display: {VISIBILITYCATALOG_IFOPER};">
    <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{TARIFICATIONBYCATALOG_IFOPER}:</div></td>
    <td class="tarif_table_grid_1">
    <table border=0 cellpadding=0 cellspacing=0 align="center" width="100%">
      <tr class=z11>
       <td align=center>{CAT_ASIGN_IFOPER}</td>
       <td align=center>&nbsp;</td>
       <td align=center>{CAT_FREE_IFOPER}</td>
      </tr>
      <tr>
       <td>
        <select class=z11 name=cat{NAMEVALUE_IFOPER}_set style="width: 240px;margin: 4px;margin-left:10px;" multiple size=6>
          <!-- BEGIN phone_catalog_option_in_use -->
          <option value={PHONE_CAT_VAL_SET}>{PHONE_CAT_NAME_SET}</option>
          <!-- END phone_catalog_option_in_use -->
        </select>
       </td>
       <td>
       <table border=0 cellpadding=7 cellspacing=0 width="100%" align="center">
         <tr><td>
           <a href="javascript: SetRemove_PhoneCatalog({JAVADIRECTION},1)"><img src="images/left.gif" border=0></a>
         </td></tr>
         <tr><td>
           <a href="javascript: SetRemove_PhoneCatalog({JAVADIRECTION},-1)"><img src="images/right.gif" border=0></a>
         </td></tr></table>
       </td>
       <td>
        <select class=z11 name=cat{NAMEVALUE_IFOPER}_free style="width: 240px;margin: 4px;margin-left:10px;" multiple size=6>
          <!-- BEGIN phone_catalog_option_free -->
          <option value={PHONE_CAT_VAL_FREE}>{PHONE_CAT_NAME_FREE}</option>
          <!-- END phone_catalog_option_free -->
        </select>
       </td>
      </tr>
    </table>
    </td>
  </tr>
  <!-- END ifuse_operators -->

  <tr id=120 style="display: {PHONE_B_DISPL};">
     <td class="tarif_table_grid_2" width="290"><div style="margin: 7px; margin-left: 10px; ">{INITBYPHONE_B}:</div></td>
     <td class="tarif_table_grid_1"><input type="checkbox" name=reverse_incoming class=z11 size=15 style="margin-left: 10px;" value=1 {PHONE_B_CHECK}>&nbsp;</td>
  </tr>

  <tr id=5 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{AB_PLATA_COST_INCLUDES}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=use_includes class=z11 size=15 style="margin-left: 10px;" value={USEINCLUDES}>&nbsp;{UNITREGLOB}</td>
  </tr>

  <tr id=4 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{AB_PLATA_COST_CONF}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=conf_above class=z11 size=15 style="margin: 5px;margin-left: 10px;" value={CONFABOVE}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr id=6 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{TARIFICATION}:</div></td>
     <td class="tarif_table_grid_1">
        <select class=z11 name=call_mode style="width: 140px;margin: 4px;margin-left: 10px;">
         <!-- BEGIN trafphone_options -->
         <option value={TRAFPHONE_VALUE} {TRAFPHONE_VALUE_SELECTED}>{TRAFPHONE_NAME}</option>
         <!-- END trafphone_options -->
     </td>
  </tr>

  <tr id=7 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{PRECISION}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=round_seconds class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={ROUNDSECONDS}>&nbsp;{UNITSECGLOB}</td>
  </tr>
  <tr id=8 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{PRECISION_LOC}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=local_round_seconds class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={LOCALROUNDSECONDS}>&nbsp;{UNITSECGLOB}</td>
  </tr>
  <tr id=9 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{LOCAL_FREE_SECONDS}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=local_free_seconds class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={LOCALFREESECONDS}>&nbsp;{UNITSECGLOB}</td>
  </tr>

  <tr id=10 style="display: {TELEPHONYVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{INCOMING_COST}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=incoming_cost class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={INCOMINGCOST}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr id=11 style="display: {TELEPHONYVISIBILITY_PLANFORMONEY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{PLANFORMONEY}:</div></td>
     <td class="tarif_table_grid_1">
       <select class=z11 name=price_plan style="width: 140px;margin: 4px;margin-left: 10px;">
         <!-- BEGIN denezhnyj_plan -->
         <option value={DENPLANOPTVALUE} {DENPLANOPTVALUESELECTED}>{DENPLANOPTTEXT}</option>
         <!-- END denezhnyj_plan -->
       </select>
     </td> 
  </tr>

  <tr id=12 style="display: {IVOXVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{REDIRECT_COST}:</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=redirect_cost class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={REDIRECTCOST}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr  id=13 style="display: {IVOXVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{IVOXIVR}</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=ivr_charge class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={IVRCHARGE}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr id=14 style="display: {IVOXVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{IVOXVOICEMAIL}</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=voicemail_charge class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={VOICEMAILCHARGE}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr id=15 style="display: {IVOXVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{IVOXOPCALL}</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=opcall_charge class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={OPCALLCHARGE}>&nbsp;{UNITREMINGLOB}</td>
  </tr>

  <tr id=16 style="display: {IVOXVISIBILITY};">
     <td class="tarif_table_grid_2" width="290"><div style="margin-left: 10px;">{IVOXNULL}</div></td>
     <td class="tarif_table_grid_1"><input type="text" name=emptycall_charge class=z11 size=15 style="margin: 4px;margin-left: 10px;" value={EMPTYCALLCHARGE}>&nbsp;{UNITREGLOB}</td>
  </tr>
</table>
<!-- END create_edit_table -->
</form>
<!-- END create_edit_form -->

<!-- BEGIN tariff_list -->
<table align=center cellspacing=0 cellpadding=0 border=0 width=850 style="border: solid 1px #c0c0c0;">
  <tr>
    <td colspan=10 height=25 align=center bgcolor=e0e0e0 style="border-bottom: solid 1px #c0c0c0;">
       <b>{TARIFFSLIST}</b>
    </td>
  </tr>
  
  <!-- BEGIN tariff_type_list -->
  <tr {SPECIFIC_VAL}>

    <!-- BEGIN tariff_colm -->
     <td class=z11 {SPECIFIC_COL_VAL}>
       {COLUMNVALUE}
     </td>
    <!-- END tariff_colm -->

  </tr>
  <!-- END tariff_type_list -->

  <!-- BEGIN notarifs -->
  <tr>
    <td colspan=10 height=40 align=center style="border-bottom: solid 1px #c0c0c0;">
       <span class=z11 style="color: red;">{NOTARIFFSLIST}</span>
    </td>
  </tr>
  <!-- END notarifs -->
</table>
<!-- END tariff_list -->
