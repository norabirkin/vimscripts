<?PHP
/**
 *	filename: 	debug.class.php
 *	modified:	June 13 2007
 *	author:		LANBilling
 */

class debug_PRINT
{
	/**
	 * Бысрый вывод строки в браузер
	 * @var		bool
	 */
	var $fast_show = 1;
	
	/**
	 * Путь к HTML-шаблонам
	 * @var		char
	 */
	var $tpl_path;
	
	/**
	 * Подгружаемый файл шаблона
	 * @var		char
	 */
	var $tpl_file = "debug.tpl";
	
	/**
	 * Ссылка для хранения созданого шалона
	 * @var		object
	 */
	var $tpl;
	
	/**
	 * Ширина таблицы
	 * @var		char
	 */
	var $table_width = 980;
	
	/**
	 * Глобальная: рисовать границу в таблице
	 * Рисуется всегда только верхняя и левая
	 * Отключено
	 * @var		bool
	 */
	var $table_border = 0;
	
	/**
	 * Использовать класс каскадных стилей
	 * @var		char
	 */
	var $style_class = "z11";
	
	/**
	 * Хранение свойст таблицы
	 * @var		char
	 */
	var $table_prop;
	
	/**
	 * Глобальная: рисовать границу в ячейке
	 * Рисуется только нижняя и правая
	 * Отключено
	 * @var		bool
	 */
	var $td_border = 0;
	
	/**
	 * Хранение свойств колонки
	 * @var		char
	 */
	var $td_prop;
	
	
	/**
	 * Основная функция класса
	 *
	 */
	function debug_PRINT( $_fast = 1, $_loc = 0, $_tpl_path = null, $_tpl_file = null )
	{
		// Выводить строку немедленно в браузер
		if($_fast)
			$this->fast(1);
		else
			$this->fast(0);
		
		// Загрузка localize.php по запросу
		if($_loc)
			require_once('localize.php');
		
		// Если директория к шаблонам переопределена
		if(is_null($_tpl_path))
			$this->tpl_path = TPLS_PATH;
		
		// Если переопределен загружаемый файл
		if(!is_null($_tpl_file))
			$this->tpl_file = $_tpl_file;
		
		// Инициализировать шаблон
		$this->initTPL();
		
		// Инициализация свойств таблицы
		$this->tableProp();
		
	} // end debug_PRINT
	
	
	/**
	 * Влючение / Отключение быстрого вывода
	 *
	 */
	function fast( $_fast = 1 )
	{
		$this->fast_show = $_fast;
	} // end fast()
	
	
	/**
	 * Инициализация шаблона
	 *
	 */
	function initTPL()
	{
		// Создание объекта
		$this->tpl = new HTML_Template_IT($this->tpl_path);
		$this->tpl->loadTemplatefile($this->tpl_file, true, true);
	} // end initTPL()
	
	
	/**
	 * Установить свойства таблицы
	 * @var		Отрисовать границы верхнюю и левую
	 */
	function tableProp( $_border = 0, $_align = "center" )
	{
		$this->table_prop = sprintf("border=0 cellspacing=0 cellpadding=0 width=%s %s align=%s", 
						$this->table_width, 
						($_border) ? "style='margin-top: 0px; margin-bottom: 0px; border: solid 1px #c0c0c0; border-top: none;'" : 
							(($this->table_border) ? "style='margin-top: 0px; margin-bottom: 0px; border: solid 1px #c0c0c0; border-top: none;'" : "style='margin-top: 0px; margin-bottom: 0px;'"), 
						$_align);
	} // end tableProp()
	
	
	/**
	 * Установка свойств колонки
	 *
	 */
	function tdProp( $_width = null, $_align = "center", $_border = 0, $_class = null, $_bg = 0, $_colspan = 0 )
	{
		$this->td_prop = sprintf("%s %s align=%s class=%s %s %s", 
			($_border) ? "style='border-top: solid 1px #c0c0c0; %s'" : 
				(($this->td_border) ? "style='border-top: solid 1px #c0c0c0;'" : ""), 
			!is_null($_width) ? sprintf("width=%s", $_width) : "", 
			$_align, 
			is_null($_class) ? $this->style_class : $_class, 
			($_bg) ? "bgcolor=e0e0e0" : "", 
			!empty($_colspan) ? sprintf("colspan=%d", $_colspan) : "");
	} // end tdProp()
	
	
	/**
	 * Отрисовка строки по заданому результату
	 * @var		Действие
	 * @var		Результат
	 * @var		Статус
	 */
	function sock_drawLine( $_deb = array(null, null), $_stat = 0 )
	{
		$this->tpl->setVariable("TAB_PROP", $this->table_prop);
		$this->tpl->setCurrentBlock("line");
		
		for($i = 0; $i <= 1; $i++)
		{
			if($i == 0) $this->tdProp("87%", "left");
			else $this->tdProp(null, "center");
			
			$this->tpl->setCurrentBlock("col");
			$this->tpl->setVariable("TD_PROP", $this->td_prop);
			$this->tpl->setVariable("TD_VAL", sprintf("<span style='font-weight: bold; color: %s;'>%s</span>", (($i > 0) ? (($_stat) ? "red": "lime") : "black"), $_deb[$i]));
			$this->tpl->parseCurrentBlock();
		}
		
		$this->tpl->parse("line");
		
		if($this->fast_show)
			$this->show();
		
	} // end drawLine
	
	
	/**
	 * Заголовок
	 *
	 */
	function head_drawLine( $_mess, $_colspan = 2, $_border = 0 )
	{
		$this->tpl->setVariable("TAB_PROP", $this->table_prop);
		$this->tpl->setCurrentBlock("line");
		
		$this->tdProp(null, "left", $_border, null, 1, $_colspan);
			
		$this->tpl->setCurrentBlock("col");
		$this->tpl->setVariable("TD_PROP", $this->td_prop);
		$this->tpl->setVariable("TD_VAL", sprintf("<span style='font-weight: bold;'>%s</span>", $_mess));
		$this->tpl->parseCurrentBlock();
		
		$this->tpl->parse("line");
		
		if($this->fast_show)
			$this->show();
			
		$this->tdProp(null, "center", 0, null, 0, 0);
	} // end head_drawLine()


	/**
	 * Вывести информацию в браузер
	 *
	 */
	function show()
	{
		$this->tpl->show();
		$this->initTPL();
	} // end show()

} // end debug_PRINT
?>