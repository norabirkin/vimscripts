<?php 

/**
 * JAPI Клиент
 * @package JAPIClient
 */

/**
 * Обертка на функции php, работающие с сокетом. Реализует интерфейс JAPISocketInterface
 */
interface JAPISocketInterface {
    /**
     * Открывает сокет
     * @param string $host хост для подключения к API
     * @param integer $port порт для подключения к API
     */
    public function open($host, $port);
    /**
     * Проверяет успешность открытия сокета
     * @return boolean успешность открытия сокета
     */
    public function hasError();
    /**
     * Пишет в сокет
     * @param string $message строка, передаваемая в сокет
     */
    public function write( $message );
    /**
     * Получает сообщение об ошибке
     * @return string сообщение об ошибке
     */
    public function getError();
    /**
     * Закрывает сокет
     */
    public function close();
    /**
     * Проверяет, достигнут ли конец сокета
     */
    public function EOF();
    /**
     * Читает строчку из сокета
     * @return string строчка из сокета
     */
    public function readLine();
    
} ?>
