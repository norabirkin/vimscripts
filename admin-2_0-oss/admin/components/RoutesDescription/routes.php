<?php return array( 
    "agent" => array(
        "descr" => "Агенты",
        "routes" => array(
            "get" => array( 
                "route" => "/5",
                "descr" => "Получение агента с id = 5"
            ),
            "list" => array(
                "route" => "",
                "descr" => "Получение списка агентов"
            ),
            "delete" => array(
                "route" => "/5",
                "descr" => "Удаление агента с id = 5"
            )
        )
    ),
    "catalog" => array(
        "descr" => "Каталоги",
        "routes" => array(
            "get" => array( 
                "route" => "/5?type=1",
                "descr" => "Получение направлений каталога с id = 5, принадлежащего к типу 1"
            ),
            "list" => array(
                "route" => "",
                "descr" => "Получение списка каталогов"
            ),
            "delete" => array(
                "route" => "/5",
                "descr" => "Удаление каталога с id = 5"
            ),
            "import" => array(
                "route" => "/import?catalog_id=5&catalog_type=1",
                "descr" => "Импорт направлений в каталог с id = 5, принадлежащий к типу 1"
            ),
            "export" => array(
                "route" => "/export?catalog_id=5&catalog_type=1",
                "descr" => "Экспорт направлений из каталога с id = 5, принадлежащего к типу 1"
            )
        )
    ),
    "catalogzone" => array(
        "descr" => "Направления каталога",
        "routes" => array(
            "get" => array( 
                "route" => "/5?catalog_type=1&catalog_id=13",
                "descr" => "Получение направления с id = 5, каталога с id = 13, принадлежащего к типу 1"
            ),
            'delete' => array(
                "route" => "/5?catalog_type=1",
                "descr" => "Удаление направления с id = 5, каталога, принадлежащего к типу 1"
            )
        )
    ),
    "language" => array(
        "descr" => "Локализация",
        "routes" => array(
            "localize" => array(
                "route" => "/localize",
                "descr" => "Хэш JavaScript, использующийся для локализации"
            )
        )
    ),
    "login" => array(
        "descr" => "Авторизация",
        "routes" => array(
            "authorize" => array(
                "route" => "/authorize",
                "params" => array("login", "password"),
                "descr" => "Авторизация"
            ),
            "identity" => array(
                "route" => "/identity",
                "descr" => "Посылает права менеджера, если менеджер авторизован"
            )
        )
    ),
    "managergroups" => array(
        "descr" => "Менеджеры и группы менеджеров",
        "routes" => array(
            "list" => array(
                "route" => "",
                "descr" => "Список менеджеров и групп менеджеров, находящихся в корне"
            ),
            "get" => array(
                "route" => "/15",
                "descr" => "Список менеджеров группы с id = 15"
            )
        )
    ),
    "segment" => array(
        "descr" => "Сегменты",
        "routes" => array(
            "list" => array(
                "route" => "?agent=1",
                "descr" => "Список сегментов агента с id = 1"
            ),
            "get" => array(
                "route" => "/5?agent=1",
                "descr" => "Сегмент с id = 5, агента с id = 1"
            ),
            "delete" => array(
                "route" => "/5",
                "descr" => "Удалить сегмент с id = 5"
            )
        )
    ),
    "tarcategory" => array(
        "descr" => "Категории тарифов",
        "routes" => array(
            "list" => array(
                "route" => "?tarid=1",
                "descr" => "Список категорий тарифа с id = 1"
            ),
            "get" => array(
                "route" => "/5?tarid=1",
                "descr" => "Категория с id = 5, тарифа с id = 1"
            ),
            "delete" => array(
                "route" => "/5?tarid=1",
                "descr" => "Удалить категорию с id = 5, тарифа с id = 1"
            )
        )
    ),
    "telclass" => array(
        "descr" => "Классы направлений",
        "routes" => array(
            "list" => array(
                "route" => "",
                "descr" => "Список классов напрвлений"
            )
        )
    ),
    "usergroup" => array(
        "descr" => "Группы пользователей",
        "routes" => array(
            "list" => array(
                "route" => "",
                "descr" => "Список групп пользователей"
            )
        )
    ),
    "vgroup" => array(
        "descr" => "Учетные записи",
        "routes" => array(
            "list" => array(
                "route" => "",
                "descr" => "Список учетных записей"
            )
        )
    )
); ?>
