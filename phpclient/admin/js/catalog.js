function catalogSelected()
{
   document.forms[1].cat_id.value = document.forms[1].showcat.value;
   document.forms[1].page2show.value = 1;
   document.forms[1].catPage2Show.value = 1;
   document.forms[1].category.value = 0;
   document.forms[1].button_pressed.value = 0;
   document.forms[1].srch_ctgr_val.value = "";
}

function showPrevius(start, page)
{
   document.forms[1].page2show.value = start-15;
   document.forms[1].submit();
}

function showNext(start, page)
{
   document.forms[1].page2show.value = start+15;
   document.forms[1].submit();
}

function setCurrent(page)
{
   document.forms[1].page2show.value = page;
   document.forms[1].submit();
}

function showPrevius2(start, page)
{
   document.forms[1].catPage2Show.value = start-5;
   document.forms[1].submit();
}

function showNext2(start, page)
{
   document.forms[1].catPage2Show.value = start+5;
   document.forms[1].submit();
}

function setCurrent2(page)
{
   document.forms[1].catPage2Show.value = page;
   document.forms[1].submit();
}

function codeSelected(sss, tar)
{
   if(document.forms[1].code_selected2.value != 1)
   {
      document.forms[1].code_selected_c.value = tar;
      document.forms[1].code_selected.value = sss;
      document.forms[1].del_dir.disabled = false;
      document.forms[1].edit_dir.disabled = false;
   }
}

function codeSelected2()
{
   document.forms[1].code_selected2.value = 1;
   document.forms[1].edit_dir.disabled = false;
   document.forms[1].del_dir.disabled = false;   
}

function selectAll(num)
{
   var elem = new String();
   var elem1 = new String();
   elem = "code_sel2_";
   elem1 = "code_sel_";
   
   if(document.forms['catalog'].sel_all.checked)
   {
      for(var i=1; i<=num; i=i+1)
      {
         document.getElementById(elem+i).checked = true;
      }
      for(var i=1; i<=num; i=i+1)
      {
         document.getElementById(elem1+i).disabled = true;
      }
      document.forms[1].code_selected2.value = 1;
      document.forms[1].edit_dir.disabled = false;
      document.forms[1].del_dir.disabled = false;      
   }
   else
   {
      for(var i=1; i<=num; i=i+1)
      {
         document.getElementById(elem+i).checked = false;
      }
      for(var i=1; i<=num; i=i+1)
      {
         document.getElementById(elem1+i).disabled = false;
      }
      document.forms[1].code_selected2.value = 0;
   }
}

function catSelected(sss)
{
   document.forms[1].category_id.value = sss;
   document.forms[1].ctgrDelete.disabled = false;
   document.forms[1].ctgrEdit.disabled = false;
}

function btnCl(mode)
{
   if(mode == 7)
   {
      document.forms[1].page2show.value = 1;
   }
   document.forms[1].button_pressed.value = mode;
   document.forms[1].submit();
}

function sD()
{
   if(document.forms[1].show_deleted.checked == true)
   {
      document.forms[1].showDeleted_1.value = 1;
   }
   else
   {
      document.forms[1].showDeleted_1.value = 0;
   }
   
   document.forms[1].submit();
}

function cr_cat(mode)
{
   if(mode == 1)
   {
      if(document.forms[1].catalog2copy.selectedIndex != 0)
      {
         document.forms[1].catalog2copy.selectedIndex = 0;
      }
   }
   if(mode == 2)
   {
      if(document.forms[1].catalog_t.selectedIndex != 0)
      {
         document.forms[1].catalog_t.selectedIndex = 0;
         document.forms[1].cat2copy.value = document.forms[1].catalog2copy.value;
      }
   }
}

function saveBtn(mode, mode2)
{
   document.forms[1].button_pressed.value = mode;
   document.forms[1].save_ch.value = mode2;
   document.forms[1].submit();
}

function ab_plata()
{
   if(document.forms[1].cat_ap.checked == true)
   {
      document.forms[1].abon_pl.value = 1;
   }
   else
   {
      document.forms[1].abon_pl.value = 0;
   }
}

function showBon(mode)
{
   if(mode == 1)
   {
     if(document.forms[1].value_bon.checked == false)
     {
        hideValBon();
     }
     else
     {
        showValBon();
     }
   }
   if(mode == 2)
   {
     if(document.forms[1].time_bon.checked == false)
     {
        hideTimeBon();
     }
     else
     {
        showTimeBon();
     }
   }
   if(mode == 3)
   {
     if(document.forms[1].we_bon.checked == false)
     {
        hideWeBon();
     }
     else
     {
        showWeBon();
     }
   }
}

function hideValBon()
{
   document.forms[1].val_bon_num.value = 0;
   document.forms[1].val_bon_num1.value = 0;
   document.forms[1].submit();
}

function showValBon()
{
   document.forms[1].val_bon_num.value = 1;
   document.forms[1].val_bon_num1.value = 1;
   document.forms[1].submit();
}

function hideTimeBon()
{
   document.forms[1].time_bon_num.value = 0;
   document.forms[1].time_bon_num1.value = 0;
   document.forms[1].submit();
}

function showTimeBon()
{
   document.forms[1].time_bon_num.value = 1;
   document.forms[1].time_bon_num1.value = 1;
   document.forms[1].submit();
}

function hideWeBon()
{
   document.forms[1].week_ch.value = 0;
   document.forms[1].submit();
}

function showWeBon()
{
   document.forms[1].week_ch.value = 1;
   document.forms[1].submit();
}

function change_val_type(first, second)
{
   if(first.disabled == true)
   {
       second.value = '';
       second.disabled = true;
       first.disabled = false;
   }
   else
   {
       first.value = '';
       second.disabled = false;
       first.disabled = true;
   }
}