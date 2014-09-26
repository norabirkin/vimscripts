/**
 * Контроллер раздела <Статистика>
 */
Ext.define('OSS.controller.Statistics', {
    extend: 'Ext.app.Controller',
    view: 'Statistics',
    controllers: [
        'statistics.Period',
        'statistics.Summary'
    ],
    requires: [
        'Ext.state.CookieProvider',
        'OSS.ux.form.field.date.WithTime',
        'OSS.helpers.Statistics',
        'OSS.helpers.statistics.Services',
        'OSS.helpers.statistics.Telephony',
        'OSS.helpers.statistics.Internet',
        'OSS.helpers.statistics.Dialup'
    ],
    views: [
        'statistics.Filter',
        'statistics.Main',
        'Agreements',
        'Statistics',
        'statistics.Renderers',
        'statistics.Summary',
        'statistics.services.Summary',
        'statistics.telephony.Summary',
        'statistics.traffic.Summary',
        'statistics.services.Summary',
        'statistics.Grid',
        'statistics.traffic.grouped.ByAccount',
        'statistics.traffic.grouped.ByAddresses',
        'statistics.traffic.grouped.ByCategories',
        'statistics.traffic.grouped.ByDays',
        'statistics.traffic.grouped.ByHours',
        'statistics.traffic.grouped.ByProtocol',
        'statistics.traffic.grouped.BySessions',
        'statistics.telephony.grouped.ByAccount',
        'statistics.telephony.grouped.ByDays',
        'statistics.telephony.grouped.ByHours',
        'statistics.telephony.grouped.BySessions',
        'statistics.services.grouped.ByAccount',
        'statistics.services.grouped.ByDays',
        'statistics.services.grouped.ByServices',
        'statistics.traffic.ActiveSessions'
    ],
    stores: [
        'statistics.Agreements',
        'Users',
        'Statistics',
        'statistics.Agents',
        'users.Groups',
        'statistics.Vgroups'
    ],
    refs: [{
        selector: 'statistics > #filter > #filter > #value',
        ref: 'value'
    }, {
        selector: 'statistics > #filter',
        ref: 'filter'
    }, {
        selector: 'statistics > #filter > #filter > #property',
        ref: 'property'
    }, {
        selector: 'statistics > #main > #grids',
        ref: 'grids'
    }, {
        selector: 'statistics > #filter > #basic > combo[name=repdetail]',
        ref: 'group'
    }, {
        selector: 'statistics > #filter > #filter > combo[name=agentid]',
        ref: 'agent'
    }, {
        selector: 'statistics > #filter > #phone',
        ref: 'phone'
    }, {
        selector: 'statistics > #filter > toolbar > #actions > menu > #find',
        ref: 'find'
    }, {
        selector: 'statistics > #filter > toolbar > #actions > menu > #sessions',
        ref: 'sessions'
    }, {
        selector: 'statistics > #filter > #basic > combo[name=repnum]',
        ref: 'repnumField'
    }, {
        selector: 'statistics > #main > #grids > #services > headercontainer > gridcolumn[dataIndex=external_data]',
        ref: 'external'
    }, {
        selector: 'statistics > #main > #grids > #services > headercontainer > gridcolumn[dataIndex=timefrom]',
        ref: 'timefrom'
    }],
    init: function() {
        this.control({
            'statistics > #filter > #basic > combo[name=repnum]': {
                change: 'onRepnumChange'
            },
            'statistics > #filter > #filter > combo[name=agentid]': {
                change: 'manageActiveSessionsButtonState'
            },
            'statistics > #filter > #basic > combo[name=repdetail]': {
                change: 'onGroupChange'
            },
            'statistics > #filter > #filter > #property': {
                change: 'onPropertyChange'
            },
            'statistics > #filter > toolbar > #actions > menu > #download > #current': {
                click: 'exportCurrentPage'
            },
            'statistics > #filter > toolbar > #actions > menu > #download > #all': {
                click: 'exportAll'
            },
            'statistics > #filter > toolbar > #actions > menu > #sessions': {
                click: 'showSessions'
            },
            'statistics > #filter > toolbar > #actions > menu > #find': {
                click: 'find'
            },
            'statistics > #main > #grids > #services': {
                added: 'showOrHideZkhColumns'
            }
        });
        OSS.component.Profile.onChanged(
            'zkh_configuration',
            this.showOrHideZkhColumns,
            this
        );
    },
    /**
     * Выполняется при изменении значения в комбобоксе "Тип услуги"
     */
    onRepnumChange: function() {
        this.managePhoneFilterVisibility();
        this.manageActiveSessionsButtonState();
        this.setGroupings();
        this.getFind().enable();
        this.filterAgents();
    },
    /**
     * Делает видимым филдсет "Телефония" в фильтре, если выбран тип услуги
     * "Телефония", и скрывает его в противном случае.
     */
    managePhoneFilterVisibility: function() {
        var type = this.getRepnum(),
            phone = this.getPhone(),
            h = OSS.helpers.Statistics;

        if (
            type == h.REPNUM_TELEPHONY
        ) {
            phone.show();
        } else {
            phone.hide();
        }
    },
    /**
     * Делает доступной кнопку "Активные сессии" в меню "Действия" фильтра, если
     * выбрана статистика Radius или VoIP, и делает ее недоступной в противном
     * случае.
     */
    manageActiveSessionsButtonState: function() {
        var type = this.getRepnum(),
            sessions = this.getSessions(),
            h = OSS.helpers.Statistics;

        if (
            type == h.REPNUM_DIALUP ||
            (
                type == h.REPNUM_TELEPHONY &&
                this.isVoIPAgentSelected()
            )
        ) {
            sessions.enable();
        } else {
            sessions.disable();
        }
    },
    /**
     * Заполняет хранилище комбобокса "Группировать по" группировками,
     * соответствующими выбранному типу услуги
     */
   setGroupings: function() {
        var items =
            this.getHelper().getGroupings(),

            field = this.getGroup(),
            store = field.getStore(),
            grid,
            first,
            item,
            i;

        field.reset();
        store.removeAll();

        for (i = 0; i < items.length; i ++) {
            item = items[i];
            grid = this.getGrid(item.grid);
            
            grid.getStore().
                 removeAll();

            store.add(item);

            if (i === 0) {
                first = item.id;
            }
        }

        field.setValue(first);
    },
    /**
     * Убирает из опций комбобокса "Агент" агенты, которые не подходят к
     * выбранному типу услуг
     */
    filterAgents: function() {
        var field = this.getAgent();

        field.reset();
        field.getStore().
              filter();
    },
    /**
     * При смене значения комбобокса "Группировать по" показывает
     * соответствующую выбранной группировке таблицу статистики
     */
    onGroupChange: function() {
        var record = this.getGroup().getRecord();

        if (record) {
            this.getGrids().
                 getLayout().
                 setActiveItem(
                     this.getGrid(
                         record.get('grid')
                     )
                 );
        }
    },
    /**
     * При смене значения комбобокса параметров поиска, показывает
     * соответствующее выбранному параметру поле ввода значения параметра поиска
     *
     * @param combo {Ext.form.field.ComboBox}
     */
    onPropertyChange: function(combo) {
        var field = combo.getRecord().
                          get('formfield');

        this.getValue().
             getLayout().
             setActiveItem(
                 this.getValue().down('#'+field)
             );
    },
    /**
     * Открывает окно "Активные сессии"
     */
    showSessions: function() {
        this.sessions = Ext.create(
            'OSS.view.statistics.traffic.ActiveSessions'
        );
        this.sessions.show();
        this.sessions.setTitle(
            i18n.get('Active sessions')+
            ': '+
            this.getAgent().getRawValue()
        );
    },
    /**
     * Совершает запрос статистики
     */
    find: function() {
        var params = this.getFilter().getValues(),
            store = this.getCurrentGrid().getStore();

        params[
            this.getSearchType()
        ] = this.getSearchValue();

        store.proxy.extraParams = params;
        store.load();
    },
    /**
     * Останавливает активную сессию Radius
     */
    stopSessions: function() {
        var grid = this.sessions.down('gridpanel'),
            selected = grid.getSelectionModel().selected,
            ids = [],
            i;

        if (!selected || !selected.getCount()) {
            return;
        }
        selected.each(function(record) {
            ids.push(
                record.get('session_id')
            );
        });
        Ext.Ajax.request({
            url: 'index.php/api/statistics/stopsession',
            params: {
                agentid: this.getAgent().getValue(),
                list: ids.join('.')
            },
            success: function() {
                OSS.ux.HeadMsg.show(
                    i18n.get('Request done successfully')
                );
                grid.getStore().load();
            }
        });
    },
    /**
     * Показавает определенные колонки при просмотре детальной статистики по 
     * услугам в зависимости от значения опции "Коммунальное обслуживание"
     */
    showOrHideZkhColumns: function() {
        var property = this.getSearchType(),
            zkh = OSS.component.Profile.get('zkh_configuration'),
            columns = [
                'getExternal',
                'getTimefrom'
            ],
            i,

            value = this.getSearchValue(),

            method = (
                property == 'vglogin' &&
                value &&
                zkh
            ) ? 'show' : 'hide';

        for (i = 0; i < columns.length; i ++) {
            column = this[columns[i]]();
            if (column) {
                column[method]();
            }
        }
    },
    /**
     * Возвращает таблицу статистики
     *
     * @param className {String} имя класса таблицы статистики
     * @return {OSS.view.statistics.Grid}
     */
    getGrid: function(className) {
        if (!this.grids) {
            this.grids = {};
        }
        if (!this.grids[className]) {
            this.grids[className] = Ext.create(className);
            this.getGrids().add(
                this.grids[className]
            );
        }
        return this.grids[className];
    },
    /**
     * Возвращает хелпер статистики для определенного типа услуг. Если не указан
     * параметр repnum, то используется тип услуги, выбранный в комбобоксе
     * "Тип услуги"
     *
     * @param repnum {Integer} тип услуги
     * @return {OSS.helpers.Statistics}
     */
    getHelper: function(repnum) {
        if (!this.helper) {
            this.helper = Ext.create('OSS.helpers.Statistics');
        }
        return this.helper.getInstance(repnum);
    },
    /**
     * Возвращает TRUE, если агент соответствует выбранному типу услуги и
     * возвращает FALSE в противном случае
     *
     * @param item {OSS.model.account.Agent} агент
     * @return {Boolean}
     */
    isProperAgent: function(item) {
        try {
            return this.getHelper().isProperAgent(item);
        } catch (e) {
            return false;
        }
    },
    /**
     * Возвращает TRUE, если выбран агент VoIP и возвращает FALSE в противном
     * случае
     *
     * @return {Boolean}
     */
    isVoIPAgentSelected: function() {
        var agent = this.getAgent().getRecord(),
            h = OSS.helpers.Statistics;

        return agent &&
               agent.get('type') == h.AGENT_TYPE_VOIP;
    },
    /**
     * Выгружает текущую страницу статистики
     */
    exportCurrentPage: function() {
        this.getCurrentGrid().exportCurrentPage();
    },
    /**
     * Выгружает всю статистику
     */
    exportAll: function() {
        this.getCurrentGrid().exportAll();
    },
    /**
     * Возвращает активную таблицу статистики
     * 
     * @return {OSS.view.statistics.Grid}
     */
    getCurrentGrid: function() {
        return this.getGrids().
                    getLayout().
                    getActiveItem();
    },
    /**
     * Возвращает значение поля поиска
     *
     * @return {String/Integer}
     */
    getSearchValue: function() {
        return this.getValue().
                    getLayout().
                    getActiveItem().
                    getValue();
    },
    /**
     * Возвращает выбранный тип поиска
     */
    getSearchType: function() {
        return this.getProperty().getValue();
    },
    /**
     * Возвращает выбранный тип услуги
     *
     * @return {Integer}
     */
    getRepnum: function() {
        return this.getRepnumField().getValue();
    }
});
