<?php
// +----------------------------------------------------------------------
// | PHP Source
// +----------------------------------------------------------------------
// | Copyright (C) 2005 by  <diver@diver>
// +----------------------------------------------------------------------
// |
// | Copyright: See COPYING file that comes with this distribution
// +----------------------------------------------------------------------
//
//  ласс постраничного вывода

class page_class
{
   var $total;
   var $mode;
   var $descriptor;
   var $tables_arr; //ѕри одиночной таблице - им€ таблицы, иначе, массив
   var $rows_on_page;
   var $rop_arr; //ƒопустимые значени€ дл€ количества страниц
   var $pages_num; //ќбщее количество страниц
   var $page_current; //“екуща€ страница
   var $row_start; //—тартова€ строка данной страницы
   var $row_end; // онечна€ строка данной страницы
   var $summ_arr; //ƒл€ суммирующей выборки содержит массив элементов, по которым осуществл€етс€ выборка
   var $page_row; // оличество номеров строниц в линейке
   var $pr;
   var $ne;
   var $cu;
   var $whatpressed;

   //конструктор
   //$mode - режим: 1 - одна таблица, 2 - из многих таблиц
   //3-не детализаци€, а суммирование
   function page_class($descriptor, $mode=1, $params=0)
   {
      $this->mode = $mode;
      $this->descriptor = $descriptor;
      $this->rows_on_page = 25;
      $this->rop_arr = array(10, 25, 50, 100, 500, 100000);
      $this->pages_num = 1;
      unset($this->summ_arr);
      $this->page_row = 15;
      $this->make_init($params);
      $this->whatpressed = 0;

   }

   function count_rows($query, $ad_val=1)
   //ѕодсчет общего количества строк
   //$st_query - стартовый запрос, с помощью которого можно определить общее кол-во строк
   //$adds - дополнительный параметр дл€ режима 2
   {
      if(is_array($this->tables_arr))
      {
         unset($temp_arr);
         foreach($this->tables_arr as $key=>$value)
         {
            $query1 = sprintf($query, $key);

            unset($temp1_arr);
            if(!($qres = mysql_query($query1, $this->descriptor))) return 0;
            if($this->mode != 2)
            {
               while(($res = mysql_fetch_row($qres)) != false)
               {
                  $temp_arr[] = $res[0];
                  $temp1_arr[] = $res[0];
               }
               if($this->mode != 3)
               {
                  $temp1_arr = array_unique($temp1_arr);
                  $this->tables_arr[$key] = count($temp1_arr);
               }
            }
            else
            {
               $res = mysql_fetch_row($qres);
               $this->tables_arr[$key] = empty($res[0])?0:$res[0];
               $this->total += $res[0];
            }
         }
         if($this->mode != 2 && is_array($temp_arr))
            $temp_arr = array_unique($temp_arr);
         if($this->mode != 2)
            $this->total = count($temp_arr);
         if($this->mode == 3 && is_array($temp_arr))
            foreach($temp_arr as $value)
               $this->summ_arr[] = $value;
         unset($temp_arr);
      }
      elseif(isset($this->tables_arr) && !is_array($this->tables_arr))
      {
//          echo $query;
         $query = sprintf($query, $this->tables_arr);
         // echo $query;
         if(!($qres = mysql_query($query, $this->descriptor))) return 0;
         if($ad_val == 1)
         {
            if(($res = mysql_num_rows($qres)) > 0)
            {
               $this->total = $res;
            }
         }
         else
         {
            $res = mysql_fetch_row($qres);
            $this->total = $res[0];
         }
         
//          printf($this->total);
      }
   }

   function get_tables($query, $num=1)
   //ѕолучаем список таблиц при мультитабличном запросе
   //$num - пор€дковый номер, где хранитс€ название таблицы
   {
      if(false == ($qres = mysql_query($query, $this->descriptor))) return 0;

      if(mysql_num_rows($qres) > 0) {
         while(($res = mysql_fetch_row($qres))) {
            $this->tables_arr[$res[$num-1]] = 0;
         }
      }
   }

   function countPages()
   //ѕодсчет страниц
   {
      $this->pages_num = (integer)(ceil($this->total / $this->rows_on_page));
//       printf("%s--%s---%s", $this->total, $this->rows_on_page, $this->pages_num);
   }

   function countCurrent($num=1)
   //¬ычисление текущей страницы
   {
   	//printf($num);
      $this->page_current = $num;
      if($num == 1)
      {
         $this->row_start = 0;
         $this->row_end = $this->rows_on_page;
      }
      elseif($num == $this->pages_num)
      {
         $this->row_start = ($num * $this->rows_on_page) - $this->rows_on_page;
         $this->row_end = $this->total;
      }
      else
      {
         $this->row_start = ($num * $this->rows_on_page) - $this->rows_on_page;
         $this->row_end = ($num * $this->rows_on_page);
      }
   }

   function modifyQuery()
   //ƒобавление к запросу дополнительных параметров выборки
   //ѕри мультитабличной выборке - указываем таблицы из которых производитс€ выборка
   //ј также в любом случае добавл€ем LIMIT
   {
      if($this->mode == 1) //ќдна таблица
      {
         $res[0]['query'] = sprintf(" LIMIT %d,%d", $this->row_start, $this->rows_on_page);
         $res[0]['table'] = $this->tables_arr;
      }
      elseif($this->mode == 2) //ћного таблиц детальных
      {
         $num_r = 0; $iter = 0; $end = 0; $start = -1; $tot = 0;
         if($this->page_current != 1)
            $this->row_start = ($this->page_current * $this->rows_on_page)-$this->rows_on_page;
         else
            $this->row_start = 0;

         foreach($this->tables_arr as $key=>$value)
         {
            if($tot >= $this->rows_on_page) break;
            $num_r += $value;
            if($this->row_start > $num_r)
               continue;
            elseif($this->row_start <= $num_r)
            {
               if($this->row_start != 0)
                  $start = $this->row_start - ($num_r-$value);
               else
                  $start = 0;
            }

            if($start >= 0)
            {
               $x = $this->rows_on_page - $tot;
               $y = $value - $start;
               if(($x - $y) >= 0) $end = $y;
               else $end = $x;
            }

            if($start >= 0 && $end > 0)
            {
               $res[$iter]['query'] = sprintf(" LIMIT %d, %d ", $start, $end);
               $res[$iter]['table'] = $key;
               $iter++;
            }

            $this->row_start = 0;
            $tot += $end;
         }
      }
      elseif($this->mode == 3) //ћного таблиц с суммируемыми данными
      {
         unset($temp_arr);
         for($i = ($this->row_start); $i < $this->row_end; $i++)
         {
            if(isset($this->summ_arr[$i]))
               $temp_arr[] = $this->summ_arr[$i];
         }
         if(is_array($temp_arr))
         {
            foreach($temp_arr as $key=>$value)
            {
               if(!is_numeric($value)) $temp_arr[$key] = "'".$value."'";
            }
            $diapozon = implode($temp_arr, ",");
         }
         if(empty($diapozon)) $diapozon = 0;
         $res[0]['query'] = " %s IN (".$diapozon.") ";
         $res[0]['table'] = $this->tables_arr;
      }

      return $res;
   }

   function setRowsOnPage($rows)
   //”станавливаем кол-во записей на странице
   {
      if(in_array($rows, $this->rop_arr))
         $this->rows_on_page = (integer)$rows;
      else
         $this->rows_on_page = 25;
   }

   function make_init($params)
   //ѕроизводим все вычислени€ до момента возврата допольнительного запроса
   {
   //0-запрос на кол-во таблиц (дл€ мульти) иначе ""
   //1-название таблицы (если одиночно) иначе ""
   //2-запрос на кол-во строк
   //3-текуща€ страница
   //4-кол-во строк на странице
      if($params != 0)
      {
         $this->setRowsOnPage($params[4]);
         if($params[0] !== "")
            $this->get_tables($params[0]);
         else
            $this->tables_arr = $params[1];
         $this->count_rows($params[2]);
         $this->countPages();
      }
   }

   function show_set_pages($pr='pr_p_n', $ne='n_p_n', $cu='c_p_n')
   //¬ыводим список страниц
   {
      $wp = $this->whatpressed;
      $this->pr = $pr; $this->ne = $ne; $this->cu = $cu;
      $num = $this->pages_num;
      $curr = $this->page_current;
      if(!isset($_POST[$cu]) || $_POST[$cu] > $num)  $_POST[$cu] = 1;
      $result = "<input type=hidden name=$pr>";
      $result .= "<input type=hidden name=$cu value=".$_POST[$cu].">";
      $result .= "<input type=hidden name=$ne>";

      if($curr <= $this->page_row)
      {
         $start_page = 1;
         $end_page = $this->page_row;
      }
      elseif($curr > $this->page_row)
      {
         $start_page = ((integer)(floor($curr / $this->page_row))) * $this->page_row + 1;
         $end_page = $start_page + $this->page_row;
      }

      if($wp != 0)
       $www1 = "document.forms[1].whatpressed.value = ".$wp.";";
      else $www1 = "";
      if($end_page > $this->pages_num) $end_page = $num;
      if($start_page != 1)
      {
         $prev = $start_page - $this->page_row;
         $result .= "<a href=\"JavaScript: document.forms[1].$cu.value=$prev;
                     $www1
                     document.forms[1].submit();\" class=z11>
                     <<&nbsp;</a>";
      }
      for($i=$start_page; $i <= $end_page; $i++)
      {
         if($i == $curr)
            $result .= "<font class=z11><b>$i</b></font>&nbsp;";
         else
            $result .= "<a href=\"JavaScript: document.forms[1].$cu.value=$i;
                     $www1
                     document.forms[1].submit();\" class=z11>
                     $i</a>&nbsp;";
      }
      if($end_page < $this->pages_num)
      {
         $next = $start_page + $this->page_row;
         $result .= "<a href=\"JavaScript: document.forms[1].$cu.value=$next;
                     $www1
                     document.forms[1].submit();\" class=z11>
                     >></a>";
      }
      return $result;
   }
}
?>
