<?php

return array(
    'Unauthorized' => 'Не авторизован',
    'You must be authorized to view this page.' => 'Вы должны быть авторизованы, чтобы видеть эту стараницу',
    'No route to host {host}:{port}' => 'Хост не найден {host}:{port}',
    'Tariff $1 is used in tarifs_rasp' => 'Тариф с ID $1 запланирован',
    'Tariff $1 is used in vgroups' => 'Тариф c ID $1 назначен на учетную запись',
    'Unassigned catalog for tariff($1)' => 'Каталог не назначен для тарифа с ID=$1',
    'Fatal error' => 'Фатальная ошибка',
    'Can not set state $1 for vgroup $2 (blocked $3)' => 'Невозможно установить состояние $1 для учетной записи $2 (текущее состояние $3)',
    'No vgroups for operation' => 'Учетные записи не найдены',
    'Required vg_id or agrm_id' => 'Необходимо передать параметр vg_id или agrm_id',
    'Incorrect state $1' => 'Некорректное состояние',
    'JAPI error' => 'Ошибка JAPI',
    'Invalid JAPI response' => 'Некорректный ответ JAPI',
    'Connection error' => 'Ошибка соединения с JAPI',
    'No logged person' => 'Менеджер не авторизован.',
    'invalid response' => 'Некорректный ответ сервера',
    'Operation timed out' => 'Истекло время ожидания',
    'Connection refused' => 'Подключение отклонено',
    'Access to rule <$1> with access level <$2> denied. $3' => 'Доступ к правилу <$1> с уровнем доступа <$2> запрещен. $3',
    'You can`t close the period. Current, requested and available values are $1, $2, $3, $4' => 'Вы не можете закрыть период указанной датой. Доступные варианты: $3, $4',
    'function $1 not found' => 'Функция $1 не найдена',
    'Internal Server Error' => 'Ошибка сервера',
    'Agreements currencies are different. Cannot change agreement' => 'Валюты договоров различаются. Невозможно сменить договор',
    'The agreement payment method not allowed for the assigned tariff. Cannot change agreement.' => 'Метод оплаты договора не подходит к выбранному договору. Нельзя сменить договор',
    'Assigned tariff has been found. Can\'t detach the agreement' => 'Невозможно отвязать договор. Был найден тариф, назначенный на него',
    'Invalid timefrom. You cannot set timefrom earlier than tariff start time' => 'Некорректная дата подключения услуги. Вы не можете назначть услугу раньше времени начала действия тарифа',
    'There is period lock. You cannot affect data earlier than $1' => 'Этот период закрыт. Вы не можете изменять данные ранее $1',
    'The server encountered an error processing your request.' => 'Произошла ошибка',
    'Invalid discount value' => 'Неверное значение коэффициента скидки',
    'No delete discount, service is used' => 'Нельзя удалить скидку, категория уже используется',
    'Connection failed. Server did not answer in time' => 'Ошибка подключения. Сервер не ответил вовремя',
    'Promised payment is misconfigured for this user' => 'Для данного пользователя отсутствуют настройки обещанного платежа',
    "Packet will be broken. Are you sure to continue" => "Все пакеты услуг на учетной записи будут сброшены! Продолжить?",
    'Catalog #$1 is not of type AS (it is $2)' => 'Каталог с id = $1 относится к типу $2',
    'Catalog #$1 is not of type IP (it is $2)' => 'Каталог с id = $1 относится к типу $2',
    'Failed to download document' => 'Невозможно выгрузить документ',
    "Password is empty or was not generated" => "Возникла ошибка генерации пароля или пароль слишком короткий",
    'This Mac is already assigned to the user $1' => 'Такой MAC адрес уже был назначен на учетную запись $1',
    'Requested equipment already without vgroup' => 'Указанное оборудование не привязано к учетной записи',
    'Agreement(agrm_id = $1) removed or terminated. Operation is not available.' => 'Операция не доступна. Договор был закрыт или удален (agrm_id = $1)',
    'Access denied to agreement $1 which access level $2' => 'Доступ к договору $1 невозможен с уровнем доступа $2',
    'login $1 already in use' => 'Логин $1 уже используется',
    'Agreements currencies are different. Cannot change agreement' => 'Операция не возможна, так как валюты на договорах различаются',
    'Unknown payment method for the agreement' => 'Неизвестный метод расчета на договоре',
    'The agreement payment method not allowed for the assigned tariff. Cannot change agreement.' => 'Операция невозможна. Метод расчета на договоре не поддерживается назначенным тарифом',
    'parent vgroup not found' => 'Родительская учетная запись не найдена',
    'Packet will be broken' => 'Все пакеты услуг на учетной записи будут сброшены!',
    'Tariff not found for vgroup ($1, $2)' => 'Тариф не найден на учетной записи ($1, $2)',
    'Tariff rate is out of tariff bounds ($1, $2, $3)' => 'Коэффициент скидки выходит за рамки, установленные тарифом ($1, $2, $3)',
    'Negative tariff price is forbidden' => 'Отрицательная стоимость запрещена',
    'Tariff discount is out of tariff bounds ($1, $2, $3)' => 'Cкидка выходит за рамки, установленные тарифом ($1, $2, $3)',
    'Negative category price is forbidden' => 'Отрицательная стоимость в категории запрещена',
    'Category rate is out of tariff bounds ($1, $2, $3)' => 'Коэффициент скидки категории выходит за рамки, установленные тарифом ($1, $2, $3)',
    'Unknown variable $1' => 'Переменная не поддерживается: $1',
    'Invalid Mask for IP' => 'Маска не валидна для этого IP',
    'Segment from unknown subnet' => 'Сегмент из неизвестной подсети',
    'Address $1 already used for login $2' => 'Адрес ($1) уже используется для логина $2',
    'Address $1 already used for device $2' => 'Адрес ($1) уже используется для устройства $2',
    'AS $1 already used for login $2' => 'АС $1 уже используется для логина $2',
    'Change of type (from $1 to $2) is not allowed' => 'Смена типа не поддерживается',
    'Vgroup network with record_id = $1 not found' => 'Учетная запись с таким id не найдена (record_id = $1)',
    'Invalid MAC address $1' => 'MAC адрес не валиден ($1)',
    'Invalid agent type' => 'Неподдерживаемый тип агента',
    'Unsupported device type $1' => 'Неподдерживаемый тип устройства ($1)',
    'Phone $1 is used for login $2' => 'Телефон $1 используется для логина $2'
);

?>