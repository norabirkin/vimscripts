<?PHP
/**
 *	filename: 	socket.class.php
 *	modified:	June 06 2007
 *	author:		LANBilling
 */

class DataTo_SOCKET
{
	/**
	 * Адрес сервера по умолчанию
	 * @var		char
	 */
	public $address = '127.0.0.1';
	
	/**
	 * Сокетный порт сервера по умолчанию
	 * @var		int
	 */
	var $port = 34010;
	
	/**
	 * Дескриптор соединения на сокет
	 * @var		object
	 */
	var $connect;
	
	/**
	 * Массив сформированых данных к отправке на сокет
	 * @var		array
	 */
	var $data_hash = array();
	
	/**
	 * Текущий ключ в массиве данных
	 * @var		int
	 */
	var $current;
	
	/**
	 * Статусные сообщения
	 * @var		array
	 */
	var $status = array();
	
	/**
	 * Текущий ключ в массиве статусов
	 *
	 */
	var $current_status;
	
	/**
	 * Массив хранения данных функции socket_read
	 * @var		array
	 */
	var $response = array();
	
	/**
	 * Возникновение ошибки при работе с сокетом
	 * @var		bool
	 */
	var $error = false;
	
	/**
	 * Прекращать выполнение функции,
	 * если предыдущее действие вызвало ошибку
	 * @var		bool
	 */
	var $restrict = true;
	
	
	/**
	 * Функция инициализации класса
	 * @var		Адрес сервер
	 * @var		Порт сервера
	 * @var		Влючить / отключить остановку функции,
	 *		если предыдущее действие вызвало ошибку
	 */
	function DataTo_SOCKET( $error_restrict = 1, $address = "", $port = "" )
	{
		if( !empty($address) ) $this->address = $address;
		if( !empty($port) ) $this->port = $port;
		
		// Ограничение на выполнение функций
		$this->restrict = ($error_restrict == 0) ? false : true;
		
		// Создание соединения если стоит автоподключение
		$this->createConnection();
		
	} // end DataTo_SOCKET()
	
	
	/**
	 * Функция создания соединения на сокет сервера
	 *
	 */
	function createConnection()
	{
		if( ($this->connect = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) ) > 0)
			$this->statusHash(MKSOCKET, "OK");
			
		else
		{
			$this->statusHash(MKSOCKET,R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		
		if( (socket_connect($this->connect, $this->address, $this->port)) <= 0 )
		{
			$this->statusHash(SOCKET_CONNECTED, R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		else
			$this->statusHash(SOCKET_CONNECTED, "OK");
		
	} // end createConnection()
	
	
	/**
	 * Инициализация данных для посылки
	 * @var	Номер функции
	 * @var
	 *	данные должны быть предоставлены в функцию
	 * 	ввиде массива. Последовательность ключей и значений
	 * 	будет выстроена в такую же линейную последовательность
	 * @var	Влючить экранирование символов
	 */
	function initData( $func_id = null, $data = null, $magic = 0 )
	{
		if($this->restrict && $this->error) return 0;
		
		if(is_null($data) || !is_array($data) || ( is_array($data) && count($data) == 0 ))
		{
			$this->statusHash(SOCKET_DATA_ERR, R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		
		if(is_null($func_id) || $func_id == "")
		{
			$this->statusHash(SOCKET_FUNC_ERR, R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		else
			$this->statusHash(ACT_REQUEST." ".$func_id, "OK");
		
		foreach($data as $_arr_key => $_arr_val)
		{
			if(strlen($_arr_val) == 0)
			{
				$this->statusHash(SOCKET_DATA_EMPT, "FOUND");
				$data[$_arr_key] = 0;
			}
			if($magic == 1) $data[$_arr_key] = addslashes($_arr_val);
		}
		
		$this->data_hash[] = sprintf("%d:%s\n", $func_id, implode(":", $data));
		$this->current = count($this->data_hash) - 1;
		
	} // end initData()
	
	
	/**
	 * Отправка данных
	 * @var	Использовать определенную запись в массиве по ключу для отправки
	 */
	function writeSocket( $key_use = null )
	{
		if($this->restrict && $this->error) return 0;
	
		if( (socket_write($this->connect, $this->data_hash[ (is_null($key_use) ? $this->current : $key_use) ])) <= 0)
		{
			$this->statusHash(SOCKET_DATA_SEND, R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		else
			$this->statusHash(SOCKET_DATA_SEND, "OK");
	} // end writeSocket()
	
	
	/**
	 * Чтение результата с сокета
	 *
	 */
	function readSocket( $read_length = 2048 )
	{
		if($this->restrict && $this->error) return 0;
		
		if( ($this->response[$this->current] = socket_read($this->connect, $read_length)) >= 0)
			$this->statusHash(SOCKET_DATA_READ, "OK");
				
		else
		{
			$this->statusHash(SOCKET_DATA_READ, R_ERROR);
			$this->error = true;
			if($this->restrict) return 0;
		}
		
		$this->response[$this->current] = preg_replace('/<FIN>$/', '', $this->response[$this->current]);
	} // end readSocket()
	
	
	/**
	 * Закрытие соединения 
	 *
	 */
	function closeSocket()
	{
		socket_close($this->connect);
		$this->connect = false;
	} // end closeSocket()
	
	
	/**
	 * Запись в массив статусов состояния и текущего ключа
	 * @var		Описание действия
	 * @var		Состояние
	 */
	function statusHash( $_desc = "", $_val = "" )
	{
		$this->status[] = array($_desc, $_val);
		$this->current_status = count($this->status) - 1;
	} // end statusHash
	
} // end DataTo_SOCKET class

?>