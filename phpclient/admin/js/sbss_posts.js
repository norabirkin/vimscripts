Ext.onReady(function(){
    showSBSSPostsList('sbssPostsListWrap');
});

function showSBSSPostsList(renderTo) {
    var postsStore,
        panel,
        view,
        fileContainerId,
        createOrEdit,
        managersStoreLoaded,
        managersStore,
        classesStoreLoaded,
        classesStore,
        filesStores = [],
        openWin,
        loadTicketData,
        loadDataAsync,
        lockTicket;
    if(!Ext.get(renderTo)) {
        return false;
    }
    postsStore = new Ext.data.Store({
        fields: [{
            name: 'content',
            type: 'string'
        }, {
            name: 'author',
            type: 'string'
        }, {
            name: 'date',
            type: 'string'
        }, {
            name: 'postid',
            type: 'int'
        }, {
            name: 'authorid',
            type: 'int'
        }, {
            name: 'spec',
            type: 'int'
        }, {
            name: 'files',
            type: 'string'
        }]
    });
    loadTicketData = function() {
        var i;
        postsStore.removeAll();
        for (i = 0; i < window.sbssTicketStructure.posts.length; i ++) {
            postsStore.add(new Ext.data.Record(window.sbssTicketStructure.posts[i]));
        }
        view.addFiles();
    };
    loadDataAsync = function() {
        Ext.Ajax.request({
            url: 'config.php',
            method: 'POST',
            params: {
                async_call: 1,
                devision: 1001,
                getpostsdata: 0,
                ticketId: window.sbssTicketStructure.ticket.id
            },
            callback: function() {
                var success = arguments[1],
                    response = arguments[2],
                    results;
                if (success) {
                    results = Ext.decode(response.responseText);
                }
                window.sbssTicketStructure = results;
                loadTicketData();
                panel.setTitle(getTitle());
            }
        });
    };
    openWin = function(data, files) {
        var form, win, view, rigth, fileIndex = 0;
        rightFieldset = new Ext.form.FieldSet({
            border: false,
            items: [{
                xtype: 'checkbox',
                inputValue: 1,
                name: 'spec',
                fieldLabel: Ext.app.Localize.get('Special')
            }, {
                xtype: 'combo',
                width: 250,
                editable: false,
                readOnly: !!files,
                typeAhead: true,
                triggerAction: 'all',
                fieldLabel: Ext.app.Localize.get('Status'),
                name: 'status',
                hiddenName: 'status',
                displayField: 'name',
                mode: 'local',
                valueField: 'id',
                store: new Ext.data.ArrayStore({
                    data: [
                        [1, 'Новый'],
                        [2, 'Ответ клиента'],
                        [5, 'Некий статус'],
                        [7, 'Пусть будет этот статус'],
                        [8, 'Название']
                    ],
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }]
                })
            }, {
                xtype: 'combo',
                readOnly: !!files,
                width: 250,
                fieldLabel: Ext.app.Localize.get('Responsible'),
                typeAhead: true,
                triggerAction: 'all',
                name: 'responsible',
                hiddenName: 'responsible',
                mode: 'local',
                editable: false,
                displayField: 'name',
                valueField: 'personid',
                store: managersStore
            }, {
                xtype: 'combo',
                readOnly: !!files,
                width: 250,
                fieldLabel: Ext.app.Localize.get('Class of request'),
                name: 'rqclass',
                hiddenName: 'rqclass',
                editable: false,
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                displayField: 'descr',
                valueField: 'id',
                store: classesStore
            }]
        });
        rigth = new Ext.Container({
            width: '40%',
            items: [rightFieldset]
        });
        if (files) {
            view = Ext.extend(Ext.DataView, {
                store: files,
                initComponent: function() {
                    Ext.list.SbssView.superclass.initComponent.call(this);
                    this.tpl = new Ext.XTemplate(
                        '<tpl for=".">',
                            '<div style="margin-left: 10px; background-color: #F5F7FA; border: 1px solid black; padding: 6px; width: 341px;">',
                                Ext.app.Localize.get('Description on document')+': {descr}<br/><br/>',
                                Ext.app.Localize.get('File of document')+': {file}<br/><br/>',
                                Ext.app.Localize.get('Size of file (Kb)')+': {size}',
                            '</div>',
                        '</tpl>'
                    );
                }
            });
            rigth.add(new Ext.Panel({
                border: false,
                autoHeight: true,
                items: new view(),
                store: files
            }));
        }
        form = new Ext.form.FormPanel({
            frame: true,
            width: 950,
            fileUpload: true,
            tbar: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                icon: 'images1/create1.gif',
                iconCls: 'ext-edit-message-btn',
                handler: function() {
                    form.getForm().submit({ 
                        method: 'POST', 
                        timeout: 600000, 
                        waitTitle: Ext.app.Localize.get('Connecting'), 
                        waitMsg: Ext.app.Localize.get('Sending data'), 
                        success: function() { 
                            win.close(); 
                            loadDataAsync();
                        }, 
                        failure: function(form, action){ 
                            if (action.failureType == 'server') { 
                                obj = Ext.util.JSON.decode(action.response.responseText); 
                                if(!Ext.isEmpty(obj.errors) && !Ext.isEmpty(obj.errors.reason)){
                                    Ext.Msg.error(obj.errors.reason);
                                }
                            } 
                            loadDataAsync();
                            win.close(); 
                        }
                    }); 
                }
            }, {
                xtype: 'button',
                icon: 'images/attach.gif',
                iconCls: 'ext-edit-message-btn',
                text: Ext.app.Localize.get('Attach file'),
                handler: function() {
                    var fieldset = new Ext.form.FieldSet({
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: Ext.app.Localize.get('Description'),
                            name: 'descr['+fileIndex+']'
                        }, {
                            xtype: 'fileuploadfield',
                            name: 'attach['+fileIndex+']',
                            logIt: true,
                            fieldLabel: Ext.app.Localize.get('Upload file'),
                            buttonCfg: {
                                text: '',
                                iconCls: 'ext-upload'
                            }
                        }]
                    });
                    rightFieldset.add(fieldset);
                    form.doLayout();
                    win.doLayout();
                    fileIndex++;
                }
            }],
            layout: 'hbox',
            items: [{
                xtype: 'container',
                width: '60%',
                items: [{
                    xtype: 'fieldset',
                    labelWidth: 50,
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        width: '100%',
                        fieldLabel: Ext.app.Localize.get('Theme'),
                        name: 'theme'
                    }, {
                        xtype: 'textarea',
                        width: '100%',
                        height: 280,
                        fieldLabel: Ext.app.Localize.get('Body'),
                        name: 'body'
                    }, {
                        xtype: 'hidden',
                        name: 'postid'
                    }, {
                        xtype: 'hidden',
                        name: 'ticketid'
                    }, {
                        xtype: 'hidden',
                        name: 'async_call',
                        value: 1
                    }, {
                        xtype: 'hidden',
                        name: 'devision',
                        value: 1001
                    }, {
                        xtype: 'hidden',
                        name: 'savepost',
                        value: 0
                    }]
                }]
            }, rigth]
        });
        win = new Ext.Window({
            title: files ? Ext.app.Localize.get('Post updating') : Ext.app.Localize.get('Post creating'),
            modal: true,
            resizable: false,
            items: [form],
            listeners: {
                close: function() {
                    lockTicket(null, 0);
                }
            }
        });
        form.getForm().setValues(data);
        win.show();
    };
    fileContainerId = 'sbss-post-files-container-{postid}';
    managersStoreLoaded = false;
    ticketLocked = false;
    classesStoreLoaded = false;
    managersStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'personid',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 13,
            getmanagers: 0
        }
    });
    classesStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            { name: 'id', type: 'int' },
            { name: 'descr', type: 'string' },
            { name: 'responsibleman', type: 'string' },
            { name: 'color', type: 'string' },
            { name: 'archive', type: 'int' }
        ]),
        baseParams: {
            async_call: 1,
            devision: 111,
            getreqlist: 1
        }
    });
    lockTicket = function(callback, lock) {
        callback = callback || function(){};
        Ext.Ajax.request({
            url: 'config.php',
            method: 'POST',
            params: {
                async_call: 1,
                devision: 1001,
                lockticket: window.sbssTicketStructure.ticket.id,
                lock: lock
            },
            callback: function(){
                ticketLocked = true;
                callback();
            }
        });
    };
    createOrEdit = function(record) {
        var run, data, files;
        if (window.sbssTicketStructure.ticket.locked) {
            return;
        }
        data = {
            theme: window.sbssTicketStructure.ticket.name,
            body: '',
            status: window.sbssTicketStructure.ticket.statusid,
            responsible: window.sbssTicketStructure.ticket.responsibleman,
            rqclass: window.sbssTicketStructure.ticket.classid,
            postid: 0,
            ticketid: window.sbssTicketStructure.ticket.id,
            spec: 0
        };
        if (record) {
            data.body = record.get('content');
            data.postid = record.get('postid');
            data.spec = record.get('spec');
            files = filesStores[record.get('postid')];
        }
        run = function() {
            if (ticketLocked && managersStoreLoaded && classesStoreLoaded) {
                ticketLocked = false;
                openWin(data, files);
            }
        };
        if (!managersStoreLoaded) {
            managersStore.load({
                callback: function() {
                    managersStoreLoaded = true;
                    run();
                }
            });
        }
        if (!classesStoreLoaded) {
            classesStore.load({
                callback: function() {
                    classesStoreLoaded = true;
                    run();
                }
            });
        }
        lockTicket(run, 1);
    };
    view = new Ext.list.SbssView({
        store: postsStore,
        contentField: 'content',
        afterContent: '<div id="'+fileContainerId+'"></div>',
        addFiles: function() {
            filesStores = [];
            this.store.each(function(record) {
                var id, store, grid, PAGELIMIT = 100, save, i, files;
                store = new Ext.data.Store({
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'created',
                        type: 'string'
                    }, {
                        name: 'edited',
                        type: 'string'
                    }, {
                        name: 'author',
                        type: 'string'
                    }, {
                        name: 'descr',
                        type: 'string'
                    }, {
                        name: 'file',
                        type: 'string'
                    }, {
                        name: 'size',
                        type: 'float'
                    }]
                });
                filesStores[record.get('postid')] = store;
                files = Ext.decode(record.get('files'));
                if (!files.length) {
                    return;
                }
                for (i = 0; i < files.length;  i++) {
                    store.add(new Ext.data.Record(files[i]));
                }
                id = fileContainerId.replace('{postid}', record.get('postid'));
                save = new Ext.grid.RowButton({
                    header: '&nbsp;',
                    qtip: Ext.app.Localize.get('Save'),
                    width: 22,
                    iconCls: 'ext-save'
                });
                save.on('action', function() {
                    var record = arguments[1];
                    location.href='helpdesk/sbssFiles.php?for=0&tid='+window.sbssTicketStructure.ticket.id+'&fid='+record.get('id');
                });
                grid = new Ext.grid.GridPanel({
                    autoHeight: true,
                    renderTo: id,
                    plugins: [save],
                    cm: new Ext.grid.ColumnModel({
                        columns: [{
                            header: Ext.app.Localize.get('Date of creation'),
                            dataIndex: 'created'
                        }, {
                            header: Ext.app.Localize.get('Date of edition'),
                            dataIndex: 'edited'
                        }, {
                            header: Ext.app.Localize.get('Author'),
                            dataIndex: 'author'
                        }, {
                            header: Ext.app.Localize.get('Description on document'),
                            id: 'sbssFileDescr',
                            dataIndex: 'descr'
                        }, {
                            header: Ext.app.Localize.get('File of document'),
                            dataIndex: 'file'
                        }, {
                            header: Ext.app.Localize.get('Size of file (Kb)'),
                            dataIndex: 'size'
                        }, save],
                        defaults: {
                            sortable: true,
                            menuDisabled: false
                        }
                    }),
                    autoExpandColumn: 'sbssFileDescr',
                    store: store
                });
            }, this);
        },
        columns: [{
            type: 'imageBtn',
            cls: 'userinfobtn',
            title: Ext.app.Localize.get('Show user info'),
            img: 'images/16info.gif',
            enabledIf: 'authorid',
            handler: function(record) {
                getUserInfo(record.get('authorid'), record.get('author'));
            }
        }, {
            type: 'infoCol',
            label: Ext.app.Localize.get('Author'),
            dataIndex: 'author'
        }, {
            type: 'infoCol',
            width: 150,
            label: Ext.app.Localize.get('Date'),
            dataIndex: 'date'
        }, {
            type: 'imageBtn',
            cls: 'editpostmtn',
            disabled: window.sbssTicketStructure.ticket.locked,
            title: Ext.app.Localize.get('Edit post'),
            img: 'images/edit16.gif',
            handler: function(record) {
                createOrEdit(record);
            }
        }, {
            type: 'imageBtn',
            cls: 'removepostbtn',
            title: Ext.app.Localize.get('Remove post'),
            img: 'images1/delete.gif',
            handler: function() {
                var postid = arguments[0].get('postid');
                Ext.Msg.confirm(Ext.app.Localize.get('Removing post'), Ext.app.Localize.get('Do you really want do remove post?'), function(btn) {
                    if (btn != 'yes') {
                        return;
                    }
                    Ext.Ajax.request({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            async_call: 1,
                            devision: 1001,
                            delpost: postid
                        },
                        callback: function(){
                            loadDataAsync(); 
                        },
                        scope: this
                    });
                }, this);
            }
        }]
    });
    getTitle = function() {
        return Ext.app.Localize.get('Title of request') + ': ' + window.sbssTicketStructure.ticket.name + ' (' + window.sbssTicketStructure.ticket.status + ')';
    };
    panel = new Ext.Panel({
        border: false,
        renderTo: renderTo,
        title: getTitle(),
        autoHeight: true,
        tbar: [{
            xtype: 'button', 
            itemId: 'save',
            text: Ext.app.Localize.get('Add new post') + ' / ' + Ext.app.Localize.get('Change status'), 
            icon: 'images1/create1.gif',
            iconCls: 'ext-edit-message-btn',
            disabled: window.sbssTicketStructure.ticket.locked,
            listeners: {
                click: function() {
                    createOrEdit();
                }
            }
        }],
        listeners: {
            render: function(){ 
                postsStore.load(); 
            }
        },
        items: view,
        store: postsStore
    });
    loadTicketData();
}
