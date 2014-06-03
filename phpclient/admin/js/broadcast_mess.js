Ext.layout.FormLayout.prototype.trackLabels = true;

SharedPosts.request = function( params ) {
    var items = [],
        i;
    for ( i in params ) items.push( { name: i, xtype: 'hidden', value: params[i] } );
    (new Ext.form.FormPanel({
        renderTo: Ext.getBody(),
        hidden: true,
        standardSubmit: true,
        items: items
    })).getForm().submit();
};

SharedPosts.ajax = function( conf ) {
    conf.params.async_call = 1;
    if(!conf.scope) conf.scope = {};
    if(!conf.onSuccess) conf.onSuccess = function(){};
    var callback = function() {
            try {
                    var data = Ext.decode(arguments[2].responseText);
                    if(!data.success) {
                        throw(data.errors.reason);
                    }
                    conf.onSuccess( data );
            }
            catch(e) {
                Ext.Msg.error(e);
            }
    };
    Ext.Ajax.request({
            url: 'config.php',
            timeout: 380000,
            method: 'POST',
            params: conf.params,
        scope: conf.scope,
            callback: callback
        });
};

SharedPosts.allowPlanEmailSending = false;

SharedPosts.initGrid = function() { 
    var createMessage = function() {
        SharedPosts.request({
            devision: 1150,
            task: 'createForm',
            post_id: 0  
        });
    };
    var editMessage = function( record ) {
        SharedPosts.request({
            devision: 1150,
            task: 'editForm',
            post_id: record.get('edit_this')
        });
    };
    var deleteMessage = function( record, panel ) {
        SharedPosts.ajax({
            params: {
                devision: 1150,
                task: 'deleteMessage',
                post_id: record.get('edit_this')
            },
            onSuccess: function() {
                Ext.Msg.alert( Ext.app.Localize.get('Message is deleted'), Ext.app.Localize.get('Message is successfully deleted') );
                panel.getStore().reload();
            }
        });
    };
    var changeMessageStatus = function( record, panel ) {
        SharedPosts.ajax({
            params: {
                devision: 1150,
                task: 'setStatus', 
                text: record.get('mess_text'),
                сategory: record.get('сategory'),
                pid: record.get('edit_this'),
                uid: record.get('uid'),
                groupid: record.get('groupid'),
                postto: 0,
                status: record.get('statusid') == 1 ? 2 : 1,
                created: record.get('created')
            },
            onSuccess: function() {
                panel.getStore().reload();
            }
        });
    };
    var getList = function( act, title ) {
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            baseParams: {
                async_call: 1,
                devision: 1150,
                task: act
            },
            totalProperty: 'total',
            reader: new Ext.data.JsonReader(
                { root: 'results' },
                [
                    { name: 'created', type: 'string' },
                    { name: 'manager', type: 'string' },
                    { name: 'sent', type: 'string' },
                    { name: 'edit_this', type: 'int' },
                    { name: 'mess_text', type: 'string' },
                    { name: 'category', type: 'int' },
                    { name: 'statusid', type: 'int' },
                    { name: 'statusname', type: 'string' },
                    { name: 'groupid', type: 'int' },
                    { name: 'uid', type: 'int' }
                ]
            )
        });
        
        var columns = [];
        if (act == 'getEmailMessages') columns.push({ type: "checkbox" });
        columns.push(
            {
                type: 'imageBtn',
                cls: "editmsgbtn",
                title: Ext.app.Localize.get('Edit this message'),
                img: 'images1/edit_15.gif',
                handler: editMessage
            },
            {
                type: 'infoCol',
                width: "30%",
                label: Ext.app.Localize.get('Creation date'),
                dataIndex: "created"
            }
        );
        if (act == 'getEmailMessages') columns.push({
            type: 'infoCol',
            width: "40%",
            label: Ext.app.Localize.get('Status'),
            dataIndex: "sent"
        });
        
        if (act == 'getClientMessages') columns.push(
            {
                type: 'imageBtn',
                cls: "changemessagestatusbtn",
                title: Ext.app.Localize.get('Change status'),
                img: 'images/phone_subst.gif',
                handler: changeMessageStatus
            },
            {
                type: 'infoCol',
                width: "40%",
                label: Ext.app.Localize.get('Status'),
                dataIndex: "statusname"
            }
        );
        
        columns.push(
            {
                type: 'infoCol',
                label: Ext.app.Localize.get('Manager'),
                dataIndex: "manager"
            },
            {
                type: 'imageBtn',
                cls: "deletemsgbtn",
                title: Ext.app.Localize.get('Delete this message'),
                img: 'images1/delete.gif',
                handler: deleteMessage
            }
        );
        var dataview = new Ext.list.SbssView({
            store: store,
            contentField: 'mess_text',
            columns: columns,
            height: 600
        });
        var tbar = new function() {
            var items = {};
            var names = [];
            this.add = function( name, item ) {
                names.push( name );
                items[ name ] = item;
            };
            this.apply = function() {
                for( i = 0; i < names.length; i++ ) {
                    var name = names[i];
                    var value = items[ name ].getValue();
                    if(!Ext.isEmpty( value )) store.baseParams[ name ] = value;
                    else delete( store.baseParams[ name ] );
                }
                store.load();
            }
        }
        var datefield = function( name, conf ) {
            if ( !conf ) conf = {};
            var config = {
                width: 95,
                format: 'Y-m-d',
                maskRe: new RegExp('[0-9\-]')
            };
            Ext.apply( config, conf );
            var field = new Ext.form.DateField( config );
            this.getField = function() {
                return field;
            }
            this.getValue = function() {
                var value = field.getValue();
                if (Ext.isEmpty(value)) return null;
                return value.format('Y-m-d H:i:s');
            }
        }
        var dtfrom = new datefield( 'dtfrom' );
        tbar.add( 'dtfrom', dtfrom );
        var dtto = new datefield( 'dtto' );
        tbar.add( 'dtto', dtto );
        var text = new Ext.form.TextField;
        tbar.add( 'descr', text );
        var toolbar = [
            {
                xtype: 'button', 
                itemId: 'save',
                text: Ext.app.Localize.get('New entry'), 
                icon: 'images1/create1.gif',
                iconCls: 'ext-edit-message-btn',
                listeners: {
                    click: createMessage
                }
            },
            {
                xtype: 'container',
                style: {
                    paddingLeft: '12px'
                },
                html: Ext.app.Localize.get('Since') + ':&nbsp;'
            },
            dtfrom.getField(),
            {
                xtype: 'tbspacer',
                width: 3
            },
            {
                xtype: 'container',
                style: {
                    paddingLeft: '12px'
                },
                html: Ext.app.Localize.get('Till') + ':&nbsp;'
            },
            dtto.getField(),
            {
                xtype: 'container',
                style: {
                    paddingLeft: '12px'
                },
                html: Ext.app.Localize.get('Search') + ':&nbsp;'
            },
            text,
            {
                xtype: 'tbspacer',
                width: 10
            },
            {
                xtype: 'button',
                width: 73,
                iconCls: 'ext-search',
                text: Ext.app.Localize.get('Show'),
                handler: function() {
                    tbar.apply();
                }
            }
        ];
        var getSelectedIDs = function() {
            var rows = dataview.selectedRows;
            if (rows.length == 0) return false;
            var ids = [];
            for (var i = 0; i < rows.length; i++) {
                ids.push(rows[i].get("edit_this"));
            }
            ids = ids.join(',');
            return ids;
        };
        var requestEmailSending = function( ids, plandate ) {
            if ( !ids ) { return; }
            if (plandate == undefined) plandate = 0;
            SharedPosts.ajax({
                params: {
                    devision: 1150,
                    task: 'sendMessage',
                    ids: ids,
                    plandate: plandate
                },
                onSuccess: function() {
                    Ext.Msg.alert( Ext.app.Localize.get('Message is sent'), Ext.app.Localize.get('Message is successfully sent') );
                    SharedPosts.email.store.reload();
                    dataview.deselectAllRows();
                }
            });
        }
        var mailingButtonHandler = function() {
            var ids = getSelectedIDs();
            if (SharedPosts.allowPlanEmailSending) openEmailPlaningWindow( ids );
            else requestEmailSending( ids );
        }
        var openEmailPlaningWindow = function( ids ) {
            if (!ids) return;
            var plandate = new function() {
                this.datefield = new Ext.form.DateField({
                    name: "date",
                    width: 95,
                    format: 'Y-m-d',
                    maskRe: new RegExp('[0-9\-]'),
                    allowBlank: false,
                    fieldLabel: Ext.app.Localize.get("Date"),
                    minValue: new Date(),
                    value: new Date(),
                    anchor: "100%"
                });
                this.timefield = new Ext.form.TextField({ 
                    width: 70,
                    fieldLabel: Ext.app.Localize.get("Time"),
                    allowBlank: false, 
                    value: "00:00:00",
                    maskRe: new RegExp("[0-9\:]"),
                    validator: function(value) {
                        var matches = value.match(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/);
                        if (matches == null) return false;
                        return parseInt(matches[1]) < 24 && parseInt(matches[2]) < 60 && parseInt(matches[3]) < 60;
                    }
                });             
                this.getValue = function() {
                    return this.datefield.getValue().format('Y-m-d') + " " + this.timefield.getValue();
                }
            }
            var form = new Ext.form.FormPanel({
                frame: true,
                items: [{ 
                    xtype: "fieldset",
                    padding: '0 8 0 8',
                    border: false,
                    labelWidth: 50,
                    items: [
                        plandate.datefield,
                        plandate.timefield
                    ],
                    buttons: [{ 
                        xtype: "button", 
                        text: Ext.app.Localize.get("Send"),
                        handler: function() {
                            if (!form.getForm().isValid()) return false;
                            requestEmailSending( ids, plandate.getValue() );
                        }
                    }]
                }]
            });
            var win = new Ext.Window({
                layout: "fit",
                width: 290,
                height: 150,
                title: Ext.app.Localize.get("Plan email"),
                items: [ form ]
            });
            win.show();
        }
        if (act == "getEmailMessages") {
            var selectAllButton = new Ext.Button({
                actionMode: 'select',
                text: Ext.app.Localize.get("Select all"),
                handler: function() {
                    if (this.actionMode == 'select') dataview.selectAllRows();
                    else dataview.deselectAllRows();
                }
            });
            dataview.on('onallrowsselected', function() {
                selectAllButton.setText(Ext.app.Localize.get('Deselect all'));
                selectAllButton.actionMode = 'deselect';
            });
            dataview.on('onnotallrowsselected', function() {
                selectAllButton.setText(Ext.app.Localize.get('Select all'));
                selectAllButton.actionMode = 'select';
            });
            toolbar.push(
                { 
                    xtype: 'tbspacer',
                    width: 10
                }, 
                { 
                    xtype: 'button',
                    width: 30,
                    iconCls: 'ext-mailto',
                    handler: mailingButtonHandler
                },
                { xtype: "tbseparator" },
                selectAllButton
            );
        }
        var list = new Ext.Panel({
            border: false,
            title: title,
                    autoHeight: true,
            items: dataview,
            store: store,
            tbar: toolbar,
            PAGELIMIT: 5,
            setPagePanel: Fncs.setPagePanel,
            listeners: { 
                render: function(){ 
                    store.load(); 
                },
                beforerender: function() {
                            this.setPagePanel();
                }
            },
                bbar: {
                        xtype: 'paging',
                        pageSize: 0,
                        displayInfo: true
                }
        });
        return list;
    };
    SharedPosts.lk = getList('getClientMessages', Ext.app.Localize.get('Client messages'));
    SharedPosts.email = getList('getEmailMessages', Ext.app.Localize.get('EMail messages'));
    var tabs = new Ext.TabPanel({
        activeItem: Ext.state.Manager.get('sharedposts.type',0),
        autoHeight: true,
        border: false,
        deferredRender: true,
        width: 980,
        items: [ SharedPosts.lk, SharedPosts.email ],
        listeners: {
            tabchange: function() {
                var task = arguments[1].store.baseParams.task;
                if (task == 'getEmailMessages') Ext.state.Manager.set( 'sharedposts.type', 1 );
                else Ext.state.Manager.set( 'sharedposts.type', 0 );
            }
        }
    });
    SharedPosts.mainPanel = new Ext.Panel({
        title: Ext.app.Localize.get('Broadcast messages'),
        autoHeight: true,
        border: false,
        items:[tabs],
        renderTo: 'shared_posts_container'
    }); 
};

SharedPosts.initForm = function() {
    SharedPosts.usergoupsStore = SharedPosts.createUsergoupsStore(); 
    SharedPosts.form = SharedPosts.createForm('shared_posts_container');
    SharedPosts.usergoupsStore.on( 'load', SharedPosts.setFormValues );
    SharedPosts.usergoupsStore.load();
}



SharedPosts.back = function() {
    SharedPosts.request({
        devision: 1150
    });
}

SharedPosts.submitForm = function() {
    var values = SharedPosts.form.getForm().getFieldValues();
    var params = {
        task: 'saveMessage',
        pid: values.post_id,
        devision: 1150,
        postto: values.postto,
        text: values.message_text,
        category: values.category
    };
    Ext.apply( params, SharedPosts.targetBlocks.getValue() );
    SharedPosts.ajax({
        params: params,
        onSuccess: function( data ) {
            var id = data.results;
            if(!values.post_id || values.post_id == 0) { SharedPosts.postID.setValue( id ); }
            Ext.Msg.alert( Ext.app.Localize.get('Data saved'), Ext.app.Localize.get('Data is successfully saved') );
        }
    });
}

SharedPosts.createUsergoupsStore = function() {
     return new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        baseParams: {
            async_call: 1,
            devision: 1150,
            task: 'getUserGroups'
        },
        reader: new Ext.data.JsonReader(
            { root: 'results' },
            [
                { name: 'id', type: 'id' },
                { name: 'name', type: 'string' }
            ]
        )
    });
}

SharedPosts.setFormValues = function() {
    SharedPosts.params.target = (SharedPosts.params.uid) ? 'uid' : 'groupid';
    SharedPosts.form.getForm().setValues( SharedPosts.params );
    SharedPosts.usergoupsStore.un( 'load', SharedPosts.setFormValues );
    
    if(SharedPosts.params.postto == 0) {
        var categoryCmb = SharedPosts.form.items.get(0).typeCnt.items.get(1).items.get(0);
        categoryCmb.show();
        categoryCmb.store.on('load', function(store, data){
            this.setValue(this.getValue());
            if (this.getValue() == -1) {
                var index = store.find('isdefault', 1);
                if (index != -1) {
                    this.setValue(store.getAt(index).get('id'));
                }
            }
        }, categoryCmb);
        categoryCmb.store.load();
    }
}

SharedPosts.createForm = function( renderTo )
{
    if(!document.getElementById(renderTo)) return;

    var typeCombo = new Ext.form.ComboBox({ 
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        name: 'postto',  
        mode: 'local',
        displayField: 'name',
        valueField: 'id',
        store: new Ext.data.ArrayStore({
            fields: [ 'id', 'name' ],
            data: [
                [ 0, Ext.app.Localize.get('Client messages') ],
                [ 1, Ext.app.Localize.get('EMail messages') ]
            ]
        }),

        listeners: {
            select: function(combo, record, value){
                var cmb = this.ownerCt.ownerCt.items.get(1).items.get(0);
                cmb[ value == 0 ? 'show' : 'hide' ]();
            }
        }
        
    });
    
    var categoryCombo = new Ext.form.ComboBox({
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        fieldLabel: Ext.app.Localize.get('Category'),
        name: 'category',  
        mode: 'local',
        displayField: 'name',
        valueField: 'id',
        hidden: true,
        trackLabels: true,
        store: {
            xtype: 'jsonstore',
            url: 'config.php',
            method: 'POST',
            root: 'results',
            totalProperty: 'total',
            fields: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'string' },
                { name: 'isdefault', type: 'int' },
                { name: 'messages', type: 'int' }
            ],
            baseParams: {
                async_call: 1,
                devision: 111,
                getcategories: 1
            }
        }
    });
    
    var typeContainer = {
        layout: 'hbox',
        border: false,
        defaults: {flex: 1, layout: 'form', border: false},
        items: [{
            labelWidth: 100,
            items: [typeCombo]
        },
        {
            labelWidth: 60,
            items: [categoryCombo]
        }],
        ref: 'typeCnt'
    }
    
    SharedPosts.postID = new Ext.form.Hidden({ name: 'post_id' });

    var baseData = new Ext.form.FieldSet({ 
    xtype: 'fieldset',
    border: false,
    items: [
        { name: 'devision', xtype: 'hidden', value: 1150 },
        { name: 'action', xtype: 'hidden' },
        SharedPosts.postID,
        { name: 'date_new', xtype: 'displayfield', fieldLabel: Ext.app.Localize.get('Date') },
        { name: 'message_text', xtype: 'textarea', fieldLabel: Ext.app.Localize.get('Content'), width: 627, height: 200 },
        typeContainer
    ]
    });

    var targetBlock = function( conf ) {
    var me = this;
    var label = conf.label; 
    var field = conf.field;
    this.getName = function() {
        return field.getName();
    }
    var config = {
            xtype: 'radio',
            name: 'target',
            labelSeparator: '',
            hideLabel: true,
            boxLabel: Ext.app.Localize.get(label),
        inputValue: this.getName(),
        listeners: {
            check: function() {
                if (arguments[1]) { SharedPosts.targetBlocks.select( me ); }
            }
        }
        };
    this.getConfig = function() {
        return config;
    }
    this.enable = function() {
        field.enable();
    }
    this.disable = function() {
        field.disable();
    }
    this.getValue = function() {
        return field.getValue();
    }
    }

    SharedPosts.targetBlocks = new function(){
    var collection = [];
    var selected = null;
    var disable = function() {
        for ( var i = 0; i < collection.length; i++ ) { collection[i].disable(); }
    }
    this.select = function( item ) {
        disable();
        item.enable();
        selected = item;
    }
    this.create = function( conf ) {
        var result = new targetBlock( conf );
        collection.push( result );  
        return result;
    }
    this.getValue = function() {
        var params = {};
        params[ selected.getName() ] = selected.getValue();
        return params;
    }
    };

    SharedPosts.userFieldBlock = new function(){
    var value = new Ext.form.Hidden({ name: 'uid' });
    baseData.add( value );
    var display = new Ext.form.TextField({ 
        name: 'username',
        width: 200
        });
    var onSelect = function( record ) {
        value.setValue( record.get('uid') );
        display.setValue( record.get('name') );
    }
    var checkSelected = function(grid) {
                try {
                        if (Ext.isEmpty(grid.getSelectionModel().getSelected())) { return false; } 
            else { onSelect( grid.getSelectionModel().getSelected() ); }
                } catch(e) {
                        Ext.Msg.error(e);
                        return false;
                }
    }
        var getUsersGrid = function() {
        showUsers({
                sm: true,
                    callbackok: checkSelected
        });
    }
    var btn = new Ext.Button({
            iconCls: 'ext-blocked-grid',
                hideLabel: true,
                handler: getUsersGrid
    });
    var config = {
        layout: 'hbox',
        items: [
                { items: display },
                    { xtype: 'tbspacer', width: 5 },
            btn
            ]
        };
    this.getName = function() {
        return 'uid';
    }
    this.disable = function() {
        display.disable();
        btn.disable();
    }
    this.enable = function() {
        display.enable();
        btn.enable();
    }
    this.getConfig = function() {
        return config;
    }
    this.getValue = function() {
        return value.getValue();
    }
    }

    var userRadio = SharedPosts.targetBlocks.create({ 
    label: 'User',
    field: SharedPosts.userFieldBlock
    });

    var userGroupField = new Ext.form.ComboBox({ 
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    mode: 'local',
    name: 'groupid',  
    displayField: 'name',
    valueField: 'id',
    store: SharedPosts.usergoupsStore  
    });

    var userGroupRadio = SharedPosts.targetBlocks.create({ 
    label: 'User group',
    field: userGroupField
    });

    var targetAudience = {
        xtype: 'fieldset',
        title: Ext.app.Localize.get('Target audience'),
        autoHeight: true,
        layout: 'table',
        layoutConfig: {
            tableAttrs: {
                    style: { width: '100%' }
                },
                columns: 2
        },
        defaults: {
            bodyStyle:'padding: 3px 5px;',
                labelSeparator: '',
                hideLabel: true
        },
        collapsible: true,
        items: [
            { items: userRadio.getConfig() },
        { items: SharedPosts.userFieldBlock.getConfig() },
                { items: userGroupRadio.getConfig() },
                { items: userGroupField }
         ]
    }

    var form = new Ext.form.FormPanel({
        id: 'genSalesForm',
        bodyStyle: {padding: '10px'},
        url: 'config.php',
        monitorValid: true,
        items:[ baseData, targetAudience ]
    });

    var isMessageSent = function() {
    if (SharedPosts.params.postto == 0) return false;
    return SharedPosts.params.sent != "0000-00-00 00:00:00";
    }

    new Ext.Panel({
    id: 'extSalesPanel',
    title: Ext.app.Localize.get('Broadcast messages'),
    autoHeight: true,
    width: 980,
    frame: true,
    labelWidth: 110,
    bodyStyle: 'padding:0 10px 0;',
    renderTo: renderTo,
    tbar:[
        { 
            xtype: 'button', 
            itemId: 'save',
            disabled: isMessageSent(),
            text: Ext.app.Localize.get('Save'), 
            icon: 'images1/create1.gif',
            iconCls: 'ext-edit-message-btn',
            listeners: { click: SharedPosts.submitForm }
        },
        { 
            xtype: 'button', 
            itemId: 'back',
            text: Ext.app.Localize.get('Back to list'), 
            icon: 'images1/add_1.gif',
            iconCls: 'ext-edit-message-btn',
            listeners: { click: SharedPosts.back }
        }
    ],
        items:[ form ]
    });
    return form;

} 

Ext.onReady(function(){
    switch (SharedPosts.task) {
        case "list": 
            SharedPosts.initGrid(); 
            break;
        case "form": 
            SharedPosts.initForm();
            break;
    }
});
