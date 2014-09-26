/**
 * Controller: ViewportMenu
 * 
 */
Ext.define('OSS.controller.viewport.Menu', {
    extend: 'Ext.app.Controller',
    
    controllers: [
        'Agents',
        'Paycards',
        'Statistics',
        'Currency',
        'Catalogs',
        'Users',
        'Accounts',
        'Payments',
        'History',
        'Address',
        'MatrixDiscounts',
        'SearchTemplates',
        'AccountsGroups',
        'UserGroups',
        'Tariffs',
        'PaymentsForm',
        'Managers',
        'Settings',
        'DocumentTemplates',
        'Reports',
        'Recalculation',
        'PrintingForms',
        'RadiusAttributes',
        'PrintingFormsStat',
        'Events',
        'AuthLog',
        'Platforms'
    ],
    
    init: function() {
        this.control({
            'ossmenu > button': {
                click: this.LaunchProgram,
                menushow: this.setButtonBorder,
                menuhide: this.setButtonBorder
            },
            'ossmenu menu': {
                click: this.LaunchMenuProgram
            }
        });
    },
    
    /**
     * Launch widget program to the main viewport body
     * @param {} item
     */
    LaunchProgram: function(item) {
        if (!item) {
            return;
        }
        if (item.menu) {
            return;
        }
        if (item.itemId == 'logout') {
            this.getController('Viewport').Logout();
        } else if (item.itemId == 'hide') {
            this.getController('Viewport').setHeadersState(item.pressed ? false : true);
        } else {
            if (item.controller) {
                this.addProgram(item.controller, item.text);
            }
        }
    },

    /**
     * Add program and add item to history
     */
    addProgram: function(name, title) {
        this.getController('Viewport').addProgram({
            name: name,
            title: title ? title : undefined
        });
        Ext.History.add(name);
    },
    
    
    /**
     * Run LaunchProgram function
     * @param {} menu
     * @param {} menu item
     */
    LaunchMenuProgram: function(menu, item) {
        this.LaunchProgram(item);
    },
    
    
    /**
     * Change border visibility for the pressed button if it has menu
     * @param   {object} this button
     * @param   {object} menu
     */
    setButtonBorder: function(button, menu) {
        //button.setBorder('1px 1px ' + (menu.isVisible() ? 0 : 1) + 'px 1px');
    },

    onRenderMenu: function(menu) {
        menu.syncWithPermissions(menu);
    }
    
});
