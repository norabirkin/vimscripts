/**
 * Контроллер раздела Свойства/каталоги
 */
Ext.define('OSS.controller.Catalogs', {
    extend: 'Ext.app.Controller',
    requires: [ 
       'OSS.helpers.Download',
       'OSS.view.catalog.Zones', 
       'OSS.model.catalog.Catalog'
    ],
    views: [
        'catalog.Types',
        'Catalogs',
        'catalog.Tree', 
        'Catalogs', 
        'catalog.zones.IP', 
        'catalog.zones.AS', 
        'catalog.zones.Tel', 
        'catalog.edit.Window', 
        'catalog.edit.Form', 
        'catalog.zones.csvimport.Window', 
        'catalog.zones.csvimport.Form',
        'catalog.zones.classes.Window',
        'catalog.zones.classes.Grid'
    ],
    view: 'Catalogs',
    stores: [
        'catalog.Tree', 
        'catalog.zones.IP', 
        'catalog.zones.AS', 
        'catalog.zones.Tel', 
        'OperatorsList',
        'catalog.zones.Classes',
        'catalog.Types'
    ],
    // Запись хранилища, соответствующая выделенному в дереве каталогу
    selectedCatalog: null,
    // Iframe, содержащий выгружаемый csv-файл, при экспорте каталога
    fileUploadingIframe: null,
    // Классы направлений загружены в хранилище
    classesLoaded: false,
    // Операторы загружены в хранилище
    operatorsLoaded: false,
    refs: [
        {
            selector: 'osscatalogs',
            ref: 'catalogsPanel'
        },
        {
            selector: 'osscatalogs > osscatalogzones',
            ref: 'zonesGrid'
        },
        {
            selector: "osscatalogs > osscatalogzones > toolbar > combo",
            ref: "searchFieldCombo"
        },
        {
            selector: "osscatalogs > osscatalogzones > toolbar > #searchText",
            ref: "searchText"
        },
        {
            selector: "catalogwindow",
            ref: "catalogWindow"
        },
        {
            selector: "catalogwindow > catalogform",
            ref: "catalogForm"
        },
        {
            selector: "catalogwindow > catalogform > fieldset > #operatorCombo",
            ref: "operatorCombo"
        },
        {
            selector: "osscatalogs > osscatalogstree",
            ref: "catalogsTree"
        },
        {
            selector: "zonesimportwindow",
            ref: "importWindow"
        },
        {
            selector: "zonesimportwindow > zonesimportform",
            ref: "importForm"
        },
        {
            selector: "telclasseswindow > telclassesgrid",
            ref: "classesGrid"
        },
        {
            selector: "osscatalogs > toolbar > #actions > menu > #removeBtn",
            ref: 'removeCatalogButton'
        },
        {
            selector: "osscatalogs > osscatalogzones #telClass",
            ref: "telClassColumn"
        },
        {
            selector: "osscatalogs > toolbar",
            ref: "treeFilterToolbar"
        },
        {
            selector: 'osscatalogs > toolbar > #actions > menu > #clone > menu',
            ref: 'cloneMenu'
        },
        {
            selector: 'osscatalogs > toolbar > #actions > menu > #clone',
            ref: 'cloneItem'
        }
    ],

    init: function() { this.control({
        "osscatalogs > osscatalogzones > toolbar > combo": {
            specialkey: this.applyZonesFilterOnEnterPressed
        },
        "osscatalogs > osscatalogzones > toolbar > #searchText": {
            specialkey: this.applyZonesFilterOnEnterPressed
        },
        "osscatalogs > toolbar > #name": {
            specialkey: this.applyCatalogFilterOnEnterPressed
        },
        "osscatalogs > toolbar > #types": {
            specialkey: this.applyCatalogFilterOnEnterPressed
        },
        "osscatalogs > osscatalogstree treecolumn": {
            click: this.getZones
        },
        "osscatalogs > osscatalogzones > toolbar > #actions > menu > #importBtn": {
            click: this.importZones
        },
        "osscatalogs > osscatalogzones > toolbar > #actions > menu > #exportBtn": {
            click: this.exportZones
        },
        "osscatalogs > osscatalogzones": {
            afterrender: this.setSearchFieldsList,
            aftersave: this.zoneSaved,
            itemsremoved: this.zonesRemoved
        },
        "osscatalogs > osscatalogzones > toolbar > #searchBtn": {
            click: this.search
        },
        "catalogwindow > toolbar > #saveBtn": {
            click: this.saveCatalog
        },
        "catalogwindow > toolbar > #cancelBtn": {
            click: this.closeCatalogWindow
        },
        "zonesimportwindow > toolbar > #uplBtn": {
            click: this.uploadZones
        },
        "osscatalogs > toolbar > #searchBtn": {
            click: this.searchCatalog
        },
        "osscatalogs > toolbar > #actions > menu > #classes": {
            click: this.classesWindow
        },
        "osscatalogs": {
            beforeadd: this.beforeAddToMainPanel,
            render: this.initOperatorsList
        },
        "osscatalogtelzones": {
            beforeaddtomainpanel: this.beforeAddTelZones,
            classcolumnrender: this.getTelClassName,
            beforeedit: this.addTelClassEditor
        },
        "osscatalogs > toolbar > #actions > menu > #removeBtn": {
            click: this.confirmRemovingCatalog
        },
        "osscatalogs > osscatalogstree actioncolumn": {
            click: this.updateCatalog
        },
        "osscatalogs > osscatalogstree" : {
            beforerender: this.setTreeFilterToolbar,
            itemchoose: this.enableCloneButton
        },
        'osscatalogs > toolbar > #actions > menu > #clone > menu': {
            show: 'cloneMenuExpanded',
            hide: 'cloneMenuCollapsed'
        },
        'osscatalogs > toolbar > #actions > menu > #clone > menu > menuitem': {
            click: 'cloneCatalog'
        }
        
    });},
    /**
     * Вызывается при удвлении направления
     */
    zonesRemoved: function() {
        if (arguments[0].validity) {
            OSS.component.StoreValidity.setInvalid(arguments[0].validity);
        }
    },
    /**
     * Вызывается при сохраниении напрвления
     */
    zoneSaved: function() {
        if (arguments[1].validity) {
            OSS.component.StoreValidity.setInvalid(arguments[1].validity);
        }
    },
    cloneMenuCollapsed: function() {
        this.getCloneMenu().skipLoad = true;
        this.getController('Users').getOperatorsListStore().clearFilter();
        this.getCloneMenu().skipLoad = false;
    },
    cloneMenuExpanded: function() {
        var me = this;
        this.getController('Users').getOperatorsListStore().filter({
            filterFn: function(item) {
                return item.get('uid') != me.selectedCatalog.get('operator_id');
            }
        });
    },
    cloneCatalog: function(item) {
        Ext.Ajax.request({
            url: 'index.php/api/catalogs/clone',
            msg: i18n.get('Catalog cloned'),
            params: {
                catalog_id: this.selectedCatalog.get('id'),
                name: this.selectedCatalog.get('text'),
                new_operator_id: item.value,
                operator_id: this.selectedCatalog.get('operator_id'),
                type: this.selectedCatalog.get('type')
            },
            scope: this,
            success: function(response) {
                var record = Ext.create('OSS.model.catalog.Catalog', {
                    name: this.selectedCatalog.get('text'),
                    operator_id: item.value,
                    operator_name: item.text,
                    type: this.selectedCatalog.get('type'),
                    user: this.selectedCatalog.get('used')
                });
                this.openCatalog(record, response.JSONResults);
            }
        });
    },
    initOperatorsList: function() {
        this.getCloneMenu().initialLoad();
    },
    
    /**
     * Применяет фильтр дерева каталогов при нажатии клавиши Enter в поле формы фильтра
     * @param {Object} field Поле, на котором была нажата клавиша
     * @param {Object} e Событие нажатия клавиши
     */
    applyCatalogFilterOnEnterPressed: function(field, e){
        this.applyFilterOnEnterPressed( e, this.searchCatalog );
    },
    /**
     * Применяет фильтр направлений при нажатии клавиши Enter в поле формы фильтра
     * @param {Object} field Поле, на котором была нажата клавиша
     * @param {Object} e Событие нажатия клавиши
     */
    applyZonesFilterOnEnterPressed: function(field, e){
        this.applyFilterOnEnterPressed( e, this.search );
    },
    /**
     * Применяет фильтр при нажатии клавиши Enter в поле формы фильтра
     * @param {Object} e - Событие нажатия клавиши
     * @param {Function} applyFilterFunction - Функция, фильтрующая хранилище
     */
    applyFilterOnEnterPressed: function( e, applyFilterFunction){
        if (e.getKey() == e.ENTER) {
            Ext.Function.bind( applyFilterFunction, this)();
        }
    },
    /**
     * Устанавливает тулбар, значения полей которого, используется для фильтрации дерева каталогов
     */
    setTreeFilterToolbar: function() {
        var tree = this.getCatalogsTree();
        tree.setTreeToolbar( this.getTreeFilterToolbar() );
        tree.setAddBtnHandler( this.createCatalog, this );  
    },
    /**
     * Делает активной кнопку "Клонировать каталог" в дереве каталогов
     */
    enableCloneButton: function() {
        this.getCloneItem().enable();
    },
    /**
     * Делает неактивной кнопку "Удалить" в дереве каталогов
     */
    disableCatalogButtons: function() {
        this.getRemoveCatalogButton().disable();
        this.getRemoveCatalogButton().setIconCls( 'x-ibtn-def-dis x-ibtn-delete' );
        this.getCloneItem().disable();
    },
    /**
     * Показывает окно с подтверждением удаления каталога
     */
    confirmRemovingCatalog: function() {
        if (this.selectedCatalog == null) {
            return;
        }
        Ext.Msg.confirm( OSS.Localize.get( "Confirmation" ), OSS.Localize.get('Do you realy want to delete this catalogue?') + "\"" + this.selectedCatalog.get( "text" ) + "\"", this.removeCatalog, this );
        
    },
    /**
     * Удаляет каталог
     * @param {Object} buttonId Идентификатор, нажатой в окне подтверждения, кнопки ( yes или no )
     */
    removeCatalog: function( buttonId ) {
        if (buttonId == "no") {
            return;
        }
        new OSS.model.catalog.Catalog({ id: this.selectedCatalog.get( "id" ), operator_id: this.selectedCatalog.get( "operator_id" ) }).destroy({
            callback: function( record, operation ) {
                if (!operation.wasSuccessful()) {
                    return;
                }
                var operator = this.getOperatorNode( record );
                var node = operator.findChild( "id", record.get("id") );
                node.remove();
                this.getCatalogsTree().leavesFilter.run();
                this.deselectCatalog();
            },
            scope: this
        });
    },
    /**
     * Добавляет выпадающий список классов направлений при редактировании направлений, если направление не используется
     */
    addTelClassEditor: function() {
        var column = this.getTelClassColumn();
        var editor = Ext.create( "Ext.form.ComboBox", {
            queryMode: 'local',
            store: "catalog.zones.Classes", 
            displayField: 'name',
            valueField: 'id'
        });
        if (!this.selectedCatalog.get("used")) {
            column.setEditor(editor);
        }
    },
    /**
     * Находит название класса направлений по его идентификатору
     * @param {Object} options
     *      {Mixed} options.value Идентификатор класса направлений
     */
    getTelClassName: function( options ) {
        var telClassName = this.getCatalogZonesClassesStore().findRecord("id", options.value).get("name");
        options.name = telClassName;
    },
    /**
     * Загружает классы направлений в хранилище
     * @param {Object} options
     * @return {Boolean} Добавить таблицу направлений в главную панель каталогов
     */
    beforeAddTelZones: function( options ) {
        
        var panel = options.panel;
        var item = options.item;
        var store = this.getCatalogZonesClassesStore();
        if ( !this.classesLoaded || store.isLoading() ) {
            this.classesLoaded = true;
            store.load({ callback: function() {
                panel.add( item );
            }});
            return false;
        } else {
            return true;
        }
        
    },
    /**
     * Инициирует событие beforeaddtomainpanel добавляемого компонента перед добавлением компонента в главную панель каталогов
     * @param {Object} panel Главная панель каталогов
     * @param {Object} item Добавляемый компонент
     */
    beforeAddToMainPanel: function( panel, item ) {
        return item.fireEvent( "beforeaddtomainpanel", { panel: panel, item: item } );
    },
    /**
     * Сохраняет новый или обновленный класс направлений
     */
    saveClass: function() {
        this.getClassesGrid().getStore().sync();
    },
    /**
     * Открывает окно классов направлений
     */
    classesWindow: function() {
        Ext.widget( "telclasseswindow" ).show();
        this.getClassesGrid().getStore().load();
    },
    /**
     * Снимает выделение с каталога
     */
    deselectCatalog: function() {
        this.getCatalogsPanel().remove( this.getZonesGrid() );
        this.selectedCatalog = null;
        this.disableCatalogButtons();
    },
    /**
     * Фильтрует каталоги
     */
    searchCatalog: function() {
        this.getCatalogsTree().leavesFilter.run();
    },
    /**
     * Экспортирует каталог в CSV файл
     */
    exportZones: function() {
        OSS.Download.get({
            url: "index.php/api/catalogs/export",
            params: {
                catalog_id: this.getZonesStore().proxy.extraParams.catalog_id,
                catalog_type: this.getZonesStore().proxy.extraParams.catalog_type
            }
        });
    },
    /**
     * Загружает CSV файл для импорта каталога
     */
    uploadZones: function() {
        this.getImportForm().submit({
            url: 'index.php/api/catalogs/import',
            params: {
                catalog_id: this.getZonesStore().proxy.extraParams.catalog_id,
                catalog_type: this.getZonesStore().proxy.extraParams.catalog_type
            },
            waitMsg: OSS.Localize.get( 'File loading' ),
            success: this.onZonesImport,
            msg: i18n.get('Import of zones is successfuly completed.'),
            failure: this.onZonesImportError,
            silent: true,
            scope: this
        });
    },
    /**
     * Выводит сообщение об успешном импорте каталога и перезагружает хранилище направлений
     */
    onZonesImport: function() {
        this.getZonesStore().reload();
        this.getImportWindow().close();
    },
    /**
     * Выводит сообщение об ошибке импорта каталога
     */
    onZonesImportError: function() {
        this.getImportWindow().close();
        Ext.Msg.alert(OSS.Localize.get( 'Error' ), OSS.Localize.get( 'Loading error' ));
    },
    /**
     * Открывает окно с формой загрузки CSV файла для импорта каталога
     */
    importZones: function() {
        Ext.widget('zonesimportwindow').show();
    },
    /**
     * Открывает окно обновления каталога
     * @param {Object} p1
     * @param {Object} p2
     * @param {Object} p3
     * @param {Object} p4
     * @param {Object} p5
     * @param {Object} record Обновляемая запись
     */
    updateCatalog: function( p1, p2, p3, p4, p5, record ) {
        if (record === undefined || !record.get( "clickable" )) {
            return;
        }
        Ext.widget('catalogwindow').show();
        this.getCatalogWindow().setTitle( OSS.Localize.get( 'Update', 'catalogue') );
        var form = this.getCatalogForm();
        
        var treeItem = record;
        if (Ext.isEmpty( treeItem )) {
            return;
        }
        var catalog = new OSS.model.catalog.Catalog({
            id: treeItem.get( 'id' ),
            operator_id: treeItem.get( 'operator_id' ),
            name: treeItem.get( 'text' ),
            type: treeItem.get( 'type' )
        });
        
        var store = this.getOperatorCombo().getStore();
        if ( !this.operatorsLoaded || store.isLoading() ) {
            this.operatorsLoaded = true;
            store.load({ callback: function() {
                form.loadRecord( catalog );
            }});
        } else {
            form.loadRecord(catalog);
        }
    },
    /**
     * Закрывает окно обновления/создания каталога
     */
    closeCatalogWindow: function() {
        this.getCatalogWindow().close();
    },
    /**
     * Находит по каталогу связанного с ним оператора в копии хранилища дерева каталогов( свойство snapshot класса OSS.helpers.LeavesFilter )
     * @param {Object} record
     */ 
    getOperatorNode: function( record ) {
        return this.getCatalogsTree().leavesFilter.snapshot.findChild( "operator_id", record.get( "operator_id" ) ); 
    },
    openCatalog: function(record, id) {
        var operator = this.getOperatorNode( record );
        if ( record.get("id") != 0 && this.getCatalogForm().getRecord().get("operator_id") != record.get( 'operator_id' ) ) {
            this.getOperatorNode( this.getCatalogForm().getRecord() ).findChild( "id", id ).remove();
        }
        var node = operator.findChild( "id", id );
        if ( !node ) {
            var create = true;
            node =  new OSS.model.catalog.Tree;
        } else {
            var create = false;
        }
        node.set( "clickable", true );
        node.set( "id", id );
        node.set( "operator_id", record.get( 'operator_id' ) );
        node.set( "text", record.get( 'name' ) );
        node.set( "type", record.get( 'type' ) );
        node.set( "used", record.get( 'used' ) );
        node.set( "leaf", true );
        if (create) {
            operator.appendChild(node);
        }
        this.getCatalogsTree().leavesFilter.run();
        if ( create ) {
            var operatorOfCreatedNode = this.getCatalogsTree().getStore().getRootNode().findChild( "operator_id", record.get( 'operator_id' ) );
            if ( operatorOfCreatedNode ) {
                operatorOfCreatedNode.expand();
                var newnode = operatorOfCreatedNode.findChild("id", id);
                if (newnode) {
                    this.getCatalogsTree().getSelectionModel().select(operatorOfCreatedNode.findChild("id", id));
                }
                this.getZones( null, null, null, null, null, node );
            }
        }
    },
    /**
     * Сохраняет каталог
    */
    saveCatalog: function() {
        var record = this.getCatalogForm().getRecord();
        var values = this.getCatalogForm().getValues();     
        if (record) {
            values.id = record.get("id");
        }
        var model = new OSS.model.catalog.Catalog( values );
        if (!this.getCatalogForm().getForm().isValid()) {
            return;
        }
        model.save({
            scope: this,
            callback: function( record, operation ) {
                if (!operation.wasSuccessful()) {
                    return;
                }
                var id = Ext.JSON.decode( operation.response.responseText ).results;
                this.openCatalog(record, id);
                this.closeCatalogWindow();
            }
        });
    },
    /**
     * Открывает окно создания нового каталога
     */
    createCatalog: function() {
        Ext.widget('catalogwindow').show();
        this.getCatalogWindow().setTitle( OSS.Localize.get( 'New', 'catalogue') );
    },
    getZonesStore: function() {
        return this.getZonesGrid().getStore();
    },
    /**
     * Фильтрует направления
     */
    search: function() {
        var field = this.getSearchFieldCombo().getValue();
        var text = this.getSearchText().getValue().trim();
        var store = this.getZonesGrid().getStore();     
        for (i in store.proxy.extraParams) {
            if (i != "catalog_id" && i != "catalog_type") {
                delete(store.proxy.extraParams[i]);
            }
        }
        if (!Ext.isEmpty( text ) && !Ext.isEmpty( field )) {
            store.proxy.extraParams[field] = text;
        }
        this.getZonesGrid().getStore().load();
    },
    /**
     * Устанавливает список полей для фильтрации в комбо фильтра направлений
     */
    setSearchFieldsList: function() {
        var combo = this.getSearchFieldCombo();
        var store = combo.store;
        var grid = this.getZonesGrid();
        store.removeAll();
        Ext.each(grid.columns, function( column ){
            if (Ext.Array.contains( grid.searchFields, column.dataIndex )) {
                store.add({ text: column.text, name: column.dataIndex });
                if (!combo.getValue()) {
                    combo.setValue(column.dataIndex);
                }
            }
        });
    },
    /**
     * Сохраняет направление
     * @param {Object} editor
     * @param {Object} options
     *      options.record Сохраняемая запись
     */
    saveZones: function( editor, options ) {
        var record = options.record;
        this.getZonesGrid().getStore().sync();
    },
    /**
     * Загружает направления в хранилище
     * @param {Object} zonesGrid
     * @param {Object} record
     */
    getZonesRequest: function( zonesGrid, record ) {
        var zonesProxy = zonesGrid.getStore().proxy;

        //Очищает параметры поиска вручную
        Ext.each(zonesGrid.columns, function( column ){
            if(!Ext.isEmpty(zonesProxy.extraParams[column.dataIndex])) {
                zonesProxy.setExtraParam(column.dataIndex, '');
            }
        }, this);

        zonesProxy.setExtraParam( "catalog_id", record.get( 'id' ) );
        zonesGrid.getStore().load();
    },
    /**
     * Показывает таблицу направлений
     * @param {Object} p1
     * @param {Object} p2
     * @param {Object} p3
     * @param {Object} p4
     * @param {Object} p5
     * @param {Object} record Выделенный каталог
     */
    getZones: function( p1, p2, p3, p4, p5, record ) {
        if (record == undefined || !record.get('clickable')) {
            return;
        }

        this.selectedCatalog = record;
        var zonesGridExists = true;
        var zonesGrid = this.getZonesGrid();
        if (!Ext.isEmpty( zonesGrid )) {
            if ( zonesGrid.type != record.get('type') ) {
                this.getCatalogsPanel().remove( zonesGrid );
                zonesGridExists = false;
            }
        } else {
            zonesGridExists = false;
        }
            
        if ( !zonesGridExists ) {
            zonesGrid = OSS.view.catalog.Zones.factory( record.get('type') );
            this.getZonesRequest( zonesGrid, record );
            this.getCatalogsPanel().add( zonesGrid );
        } else {
            this.getZonesRequest(zonesGrid, record);
        }
    }
    
});
