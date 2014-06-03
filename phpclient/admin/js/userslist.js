/**
 * JS Engine to view and control users list
 *
 * Repository information:
 * $Date: 2009-12-14 12:37:10 $
 * $Revision: 1.1.2.27 $
 */


Ext.onReady(function() {
    Ext.QuickTips.init();
    // Load List object
    showUsersList('_UsersList');
});


/**
 * Common view object to view users list
 * @param    string, render this to DOM id
 */
function showUsersList(renderTo){
    // View Cookie name
    var COOKIE = 'node22';
    // Let it be global define for the page limit
    var PAGELIMIT = 100;

    // Correct AUTOLOAD flag if there had been set advanced filter earlier
    if(AUTOLOAD && Ext.app.DefaultView.exists(COOKIE) && !Ext.isEmpty(Ext.app.DefaultView.get(COOKIE, 'x7'))) {
        AUTOLOAD = false;
    }

    // Function to compose storage base params for server list filtering
    // @param    boolean, if pass true to function than call storage load
    // @param    boolean, reset list
    advSearch = function(l,r){
        var c = Ext.getCmp('advSearchList');
        var n = new RegExp('searchtpl','i');
        var s = {};
        var l = l || false;
        if(r == true){
            c.setValue('');
        }
        for(var i in Store.baseParams){
            if(!n.test(i)) {
                s[i] = Store.baseParams[i];
            }
        }
        Store.baseParams = s;
        if(c.mainStore.find('tplname', c.getValue()) > -1) {
            c.mainStore.each(function(r,idx){
                if(r.data.tplname != this.tplname) {
                    return;
                }
                for(var i in r.data) {
                    if(i == 'tplname') {
                        continue;
                    }
                    this.store.baseParams['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
                }
            }, { store: Store, tplname: c.getValue() });
        }
        if(l) {
            Store.reload({ params: { start: 0, limit: PAGELIMIT } });
        }
    }

    Ext.override(Ext.PagingToolbar, {
        updateInfo : function(){
            if(this.displayItem){
                var count = this.countGrouped();
                var msg = count == 0 ?
                    this.emptyMsg :
                    String.format(
                        this.displayMsg,
                        this.cursor+1, this.cursor+count, this.store.getTotalCount()
                    );
                this.displayItem.setText(msg);
            }
        },

        countGrouped: function() {
            var A = this.store.collect('uid', false);
            return A.length;
        }
    });

    Ext.override(Ext.grid.GroupingView, {
        groupMenuTpl: '',
        infoStates: [],
        checkStates: {},
        allInfoExpanded: true,
        showTplControl: false,

        initTemplates : function(){
            Ext.grid.GroupingView.superclass.initTemplates.call(this);
            this.state = {};

            var sm = this.grid.getSelectionModel();
            sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect', this.onBeforeRowSelect, this);

            if(!this.startGroup){
                this.startGroup = new Ext.XTemplate(
                    '<div id="{groupId}" class="x-grid-group {cls}">',
                        '<div id="{groupId}-hd" style="{style};">',
                        '<div id="{groupId}-title" class="x-grid-group-hd x-grid-group-hd-control"  style="{values.headerStyle}">',
                            '<div class="x-grid-group-title x-grid-group-title-control" style="color: #3764A0">',
                                this.groupTextTpl ,
                            '</div>',
                            '<div style="cursor: default; clear: right">',
                                '<div class="x-grid3-cell-inner" unselectable="on">',
                                    '<div class="x-grid3-check-col" "data-cucumber"="removeCheckbox" id="ext-gp-check-{values.group}"  style="width: 22px; float: right; margin-left: 4px;"></div>',
                                    '<div class="ext-edit ext-edit-users-grid" id="ext-gp-edit-{values.group}" style="margin-left: 6px;" ext:qtip="{[Localize.EditUser]}: {[values.rs[0].data.name]}"></div>',
                                    '<div class="ext-tpl-user-add ext-edit-users-grid" id="ext-gp-tpl-{values.group}" style="{values.tplControlStyle}" ext:qtip="{[Localize.CreateUserByTemplate]}: {[values.rs[0].data.descr]}"></div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="x-grid3-row" style="{values.style} {infoStyle}">',
                            '<table class="x-grid3-row-table" cellspacing="0" cellpadding="0" border="0" style="{values.style}; background-color: #f5f5f5">',
                                '<tr>',
                                    '<td class="x-grid3-col x-grid3-cell x-grid3-cell-first" style="width: 14%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="{[Localize.Login]}">{[values.rs[0].data.login]}</div></td>',
                                    '<td class="x-grid3-col x-grid3-cell" style="width: 14%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="{[Localize.Category]}">{[values.rs[0].store.getUserCatName(values.rs[0].data.category)]}</div></td>',
                                    '<td class="x-grid3-col x-grid3-cell" style="width: 14%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="{[Localize.UserType]}">{[(values.rs[0].data.type == 2) ? Localize.Physic : Localize.Legal]}</div></td>',
                                    '<td class="x-grid3-col x-grid3-cell" style="width: 14%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="{[Localize.Phone]}">{[values.rs[0].data.phone]}</div></td>',
                                    '<td class="x-grid3-col x-grid3-cell" style="width: 14%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="Email">{[values.rs[0].data.email]}</div></td>',
                                    '<td class="x-grid3-col x-grid3-cell x-grid3-cell-last" style="width: 30%"><div class="x-grid3-cell-inner" unselectable="on" ext:qtip="{[Localize.Description]}">{[values.rs[0].data.descr]}</div></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="x-grid3-col x-grid3-cell x-grid3-cell-first"><div class="x-grid3-cell-inner" unselectable="on">{[(values.rs[0].data.type == 1) ? Localize.LegalAddress : Localize.RegisteredAddress]}:</div></td>',
                                '<td class="x-grid3-col x-grid3-cell" colspan="5"><div class="x-grid3-cell-inner" unselectable="on">{[values.rs[0].data.address_1]}</div></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="x-grid3-col x-grid3-cell x-grid3-cell-first"><div class="x-grid3-cell-inner" unselectable="on">{[Localize.PostAddress]}:</div></td>',
                                '<td class="x-grid3-col x-grid3-cell" colspan="5"><div class="x-grid3-cell-inner" unselectable="on">{[values.rs[0].data.address_2]}</div></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="x-grid3-col x-grid3-cell x-grid3-cell-first"><div class="x-grid3-cell-inner" unselectable="on">{[Localize.AddressDeliverInvoice]}:</div></td>',
                                '<td class="x-grid3-col x-grid3-cell" colspan="5"><div class="x-grid3-cell-inner" unselectable="on">{[values.rs[0].data.address_3]}</div></td>',
                            '</tr>',
                            '</table>',
                        '</div>',
                        '</div>',
                    '<div id="{groupId}-bd" class="x-grid-group-body">'
                );
            }
            this.startGroup.compile();
            this.endGroup = '</div></div>';

            if(!Ext.isDefined(this.checkStates['getChecked'])) {
                this.checkStates.getChecked = function() {
                    var A = [];
                    Ext.iterate(this.checkStates, function(idx, item) {
                        if (!Ext.isFunction(item) && item) {
                            this.A.push(this.parent.extractUID(idx))
                        }
                    }, {
                        A: A,
                        parent: this
                    });
                    return A;
                }.createDelegate(this);
            }
        },

        /*processEvent: function(name, e){
            Ext.grid.GroupingView.superclass.processEvent.call(this, name, e);
            var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
            if(hd){
                // group value is at the end of the string
                var field = this.getGroupField(),
                    prefix = this.getPrefix(field),
                    groupValue = hd.id.substring(prefix.length),
                    emptyRe = new RegExp('gp-' + Ext.escapeRe(field) + '--hd');

                // remove trailing '-hd'
                groupValue = groupValue.substr(0, groupValue.length - 3);

                // also need to check for empty groups
                if(groupValue || emptyRe.test(hd.id)){
                    this.grid.fireEvent('group' + name, this.grid, field, groupValue, e);
                }
                if(name == 'mousedown' && e.button == 0){
                    if (e.getTarget('.x-grid3-cell-inner', this.mainBody)) {
                        if(e.getTarget('.x-grid3-check-col', this.mainBody)) {
                            this.checkGroup(e.getTarget('.x-grid3-check-col', this.mainBody))
                        }
                        else if(e.getTarget('.ext-edit', this.mainBody)) {
                            submitForm('_Users', 'uid', this.extractUID(Ext.get(e.getTarget('.ext-edit', this.mainBody)).id))
                        }
                        else if(e.getTarget('.ext-tpl-user-add', this.mainBody)) {
                            submitForm('_Users', 'userbytpl', this.extractUID(Ext.get(e.getTarget('.ext-tpl-user-add', this.mainBody)).id))
                        }
                        e.stopEvent();
                    }
                    else {
                        var hd = e.getTarget('.x-grid-group-title', this.mainBody);
                        if (hd) {
                            e.stopEvent();
                            this.toggleGroup(hd.parentNode.parentNode.parentNode);
                        }
                    }
                }
            }
        },*/

        interceptMouse : function(e){
			// remove cookie for applications
			if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
				Ext.app.DefaultView.remove(COOKIE, 'r0');
			}
            if (e.getTarget('.x-grid3-cell-inner', this.mainBody)) {
                if(e.getTarget('.x-grid3-check-col', this.mainBody)) {
                    this.checkGroup(e.getTarget('.x-grid3-check-col', this.mainBody))
                }
                else if(e.getTarget('.ext-edit', this.mainBody)) {
					// set cookie for applications
					Ext.app.DefaultView.set('node110', { r0: 1 }, true);
                    submitForm('_Users', 'uid', this.extractUID(Ext.get(e.getTarget('.ext-edit', this.mainBody)).id));
                }
                else if(e.getTarget('.ext-tpl-user-add', this.mainBody)) {
                    submitForm('_Users', 'userbytpl', this.extractUID(Ext.get(e.getTarget('.ext-tpl-user-add', this.mainBody)).id))
                }
                e.stopEvent();
            }
            else {
                var hd = e.getTarget('.x-grid-group-title', this.mainBody);
                if (hd) {
                    e.stopEvent();
                    this.toggleGroup(hd.parentNode.parentNode.parentNode);
                }
            }
        },

        toggleGroup : function(group, expanded){
            var gel = Ext.get(group);
            expanded = Ext.isDefined(expanded) ? expanded : gel.hasClass('x-grid-group-collapsed');
            if(this.state[gel.id] !== expanded){
                this.grid.stopEditing(true);
                this.state[gel.id] = expanded;
                gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
            }
        },

        toggleInfo : function(info, expanded){
            var info = Ext.get(info);
            expanded = Ext.isDefined(expanded) ? expanded : ((info.getStyle('display') == 'none') ? false : true );
            if(this.infoStates[info.id] !== expanded){
                this.infoStates[info.id] = expanded;
                info.setVisibilityMode(Ext.Element.DISPLAY);
                info.setVisible(expanded ? false : true);
            }
        },

        toggleAllGroups : function(expanded){
            var groups = this.getGroups();
            for(var i = 0, len = groups.length; i < len; i++){
                this.toggleGroup(groups[i], expanded);
            }
            this.startCollapsed = this.startCollapsed ? false : true;
        },

        toggleAllInfo : function(expanded){
            var groups = this.getGroups();
            for(var i = 0, len = groups.length; i < len; i++){
                var el = Ext.get(groups[i]).query('.x-grid3-row', groups[i]);
                if (el.length > 0) {
                    this.toggleInfo(el[0], expanded);
                }

            }
            this.allInfoExpanded = this.allInfoExpanded ? false : true;
        },

        extractUID: function( id ) {
            if(id.length < 1) {
                return 0;
            }
            else {
                return id.replace(/[a-z\-]+/i,'');
            }
        },

        checkGroup: function(group, check) {
            var gel = Ext.get(group);
            var checked = gel.hasClass('x-grid3-check-col-on') ? true : false;
            if (check && checked) {
                return;
            }
            gel[checked ? 'removeClass' : 'addClass']('x-grid3-check-col-on');
            this.checkStates[gel.id] = checked ? false : true;
        },

        checkAllGroups: function() {
            var groups = this.getGroups();
            for(var i = 0, len = groups.length; i < len; i++){
                var el = Ext.get(groups[i]).query('.x-grid3-check-col', groups[i]);
                if (el.length > 0) {
                    this.checkGroup(el[0], true);
                }
            }
        },

        setTplControlVisible: function(show) {
            var show = !Ext.isDefined(show) ? true : show;
            this.showTplControl = show;
        },

        doRender : function(cs, rs, ds, startRow, colCount, stripe){
            if(rs.length < 1){
                return '';
            }

            var groupField = this.getGroupField(),
            colIndex = this.cm.findColumnIndex(groupField),
            g;

            this.enableGrouping = !!groupField;

            if(!this.enableGrouping || this.isUpdating){
                return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
            }
            var gstyle = 'width:' + this.getTotalWidth() + ';',
                cfg = this.cm.config[colIndex],
                groupRenderer = cfg.groupRenderer || cfg.renderer,
                prefix = this.showGroupName ? (cfg.groupName || cfg.header)+': ' : '',
                groups = [],
                curGroup, i, len, gid;

            for(i = 0, len = rs.length; i < len; i++){
                var rowIndex = startRow + i,
                    r = rs[i],
                    gvalue = r.data[groupField];
					isApplication = r.data.application;

                    g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);
                    if(!curGroup || curGroup.group != g){
                        gid = this.constructId(gvalue, groupField, colIndex);

                        this.state[gid] = !(Ext.isDefined(this.state[gid]) ? !this.state[gid] : this.startCollapsed);
                        curGroup = {
                            group: g,
                            gvalue: gvalue,
                            text: prefix + g,
                            groupId: gid,
                            startRow: rowIndex,
                            rs: [r],
                            cls: this.state[gid] ? '' : 'x-grid-group-collapsed',
                            style: gstyle,
							headerStyle: (isApplication>0) ? 'background-color: #a9b7ff;' : '',
                            infoStyle: this.allInfoExpanded ? '' : 'display: none',
                            tplControlStyle: this.showTplControl ? '' : 'visibility: hidden'
                        };
                        groups.push(curGroup);
                    }else{
                        curGroup.rs.push(r);
                    }
                    r._groupId = gid;
            }

            var buf = [];
            for(i = 0, len = groups.length; i < len; i++){
                g = groups[i];
                this.doGroupStart(buf, g, cs, ds, colCount);
                buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(
                    this, cs, g.rs, ds, g.startRow, colCount, stripe);

                this.doGroupEnd(buf, g, cs, ds, colCount);
            }
            return buf.join('');
        }
    });

    var Store = new Ext.data.GroupingStore({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST',
            timeout: 380000
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [
            { name: 'uid', type: 'int' },
            { name: 'istemplate', type: 'int' },
			{ name: 'includepreactivated', type: 'int' },
			{ name: 'application', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'balance', type: 'float' },
            { name: 'agrmid', type: 'int' },
            { name: 'agrmnum', type: 'string' },
            { name: 'agrmdate', type: 'date' , format: "Y-m-d"},
            { name: 'symbol', type: 'string' },
            { name: 'descr', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'phone', type: 'string' },
            { name: 'addrtype', type: 'int' },
            { name: 'addrcode', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'vgcnt', type: 'int' },
            { name: 'login', type: 'string' },
            { name: 'type', type: 'int' },
            { name: 'address_1', type: 'string' },
            { name: 'address_2', type: 'string' },
            { name: 'address_3', type: 'string' },
            { name: 'ppdebt', type: 'float' },
            { name: 'category', type: 'int' },
            { name: 'code', type: 'string' },
            { name: 'opername', type: 'string' },
            { name: 'closedon' }
        ]),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        groupField: 'uid',
        baseParams:{
            async_call: 1,
            devision: 22,
            getusers: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x1') : 0,
            listext: 1,
            searchtype: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x2') : 0,
            category: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3') : 0,
            start: 0,
            istemplate: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x5') : 0,
			includepreactivated: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x10') : 0,
            limit: PAGELIMIT
        },
        remoteSort: true,
        sortInfo: {
            field: 'name',
            direction: "ASC"
        },
        autoLoad: AUTOLOAD,
        getUserCatName: function(cat) {
            switch(cat) {
                case 1: return Localize.Operator;
                case 2: return Localize.Dealer;
                case 3: return Localize.LegalOwner;
                case 4: return Localize.Advertiser;
                case 5: return Localize.Partner;
                case 6: return Localize.Agent;
                default: return Localize.Subscriber;
            }
        }
    });

    var UGroups = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'descr',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 22,
            getgroups: 1
        },
        sortInfo: {
            field: 'id',
            direction: 'ASC'
        },
        autoLoad: true,
        listeners: {
            load: function(store){
                if(Ext.app.DefaultView.exists(COOKIE)) {
                    var data = Ext.app.DefaultView.get(COOKIE, 'x1');
                    if(!Ext.isEmpty(data)) {
                        Ext.getCmp('_usergrpsCombo').setValue(data);
                    }
                }
            }
        }
    });

    var PButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.SavePayment,
        width: 22,
        dataIndex: 'agrmid',
        iconCls: function(record){
            if(record.get('istemplate')) {
                return 'ext-pay-dis';
            }
            else {
                return 'ext-payhistory'
            }
        }
    });

    var HButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.RentCharges + ' / ' + Localize.BalanceHistory,
        width: 22,
        dataIndex: 'agrmid',
        iconCls: function(record){
            if (record.get('istemplate')) {
                return 'ext-charts-dis';
            }
            else {
                return 'ext-charts'
            }
        }
    });

    var TButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.LockManagement,
        width: 22,
        dataIndex: 'agrmid',
        iconCls: function(record){
            if(record.get('istemplate') || record.get('closedon')) {
                return 'ext-turn-dis';
            }
            else {
                return 'ext-turn'
            }
        }
    });
    
    var BButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Terminate contract'),
        width: 22,
        dataIndex: 'agrmid',
        iconCls: function(record){
            if (record.get('closedon')) {
                return 'ext-close-dis';
            }
            else {
                return 'ext-close'
            }
        }
    });

    new Ext.grid.GridPanel({
        height: 800,
        width: 960,
        renderTo: renderTo,
        tbar: new Ext.Toolbar({
            layout: 'form',
            height: 50,
            items: [{
                xtype: 'container',
                width: 955,
                layout: 'toolbar',
                getGrid: function() {
                    return this.ownerCt.ownerCt;
                },
                items: [{
                    xtype: 'button',
                    iconCls: 'ext-minus',
                    tooltip: Localize.Collapse + ' / ' + Localize.Expand,
                    menu: [{
                        text: Localize.Hide + ' ' + Localize.agreements,
                        iconCls: 'ext-minus',
                        handler: function(){
                            var G = this.ownerCt.ownerCt.ownerCt.getGrid();
                            if(G.view.startCollapsed) {
                                this.setIconClass('ext-minus');
                                this.setText(Localize.Hide + ' ' + Localize.agreements);
                            }
                            else {
                                this.setIconClass('ext-plus');
                                this.setText(Localize.Show + ' ' + Localize.agreements);
                            }
                            G.view.toggleAllGroups();
                        }
                    }, {
                        text: Localize.HideAInfo,
                        iconCls: 'ext-minus',
                        handler: function(){
                            var G = this.ownerCt.ownerCt.ownerCt.getGrid();
                            if(G.view.allInfoExpanded) {
                                this.setIconClass('ext-plus');
                                this.setText(Localize.ShowAInfo);
                            }
                            else {
                                this.setIconClass('ext-minus');
                                this.setText(Localize.HideAInfo);
                            }
                            G.view.toggleAllInfo();
                        }
                    }]
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    id: '_usergrpsCombo',
                    width: 200,
                    tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
                    displayField: 'name',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    store: UGroups,
                    listeners: {
                        select: function() {
                            Store.baseParams.getusers = this.getValue();
                            Store.reload({ params: { start: 0, limit: PAGELIMIT }});
                            Ext.app.DefaultView.set(COOKIE, {
                                x1: this.getValue()
                            });
                        }
                    },
                	autoCreate: {
                		'data-cucumber': 'usergrpsCombo',
                		tag: 'input', 
                		type: 'text', 
                		size: '24'
                	}
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    id: '_categoryCombo',
                    width: 180,
                    displayField: 'name',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3') : 0,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['-1', 1, Localize.All],
                            ['0', 1, Localize.Subscriber],
                            ['1', 1, Localize.Operator],
                            ['2', 1, Localize.Dealer],
                            ['3', 1, Localize.LegalOwner],
                            ['4', 1, Localize.Advertiser],
                            ['5', 1, Localize.Partner],
                            ['6', 1, Localize.Agent]
                        ],
                        fields: ['id', 'perm', 'name']
                    }),
                    listeners: {
                        render: function(){
                            Ext.Ajax.request({
                                url: 'config.php',
                                scope: this,
                                success: function(a){
                                    var p = Ext.util.JSON.decode(a.responseText);
                                    var o = this.store.getAt(this.store.find('id', 1));

                                    if(p.filterperm[1] < 1) {
                                        o.data.perm = 0;
                                    }
                                },
                                params: { async_call: 1, devision: 22, filterperm: 0 }
                            });
                        },
                        beforeselect: function(c, r, i){
                            if(r.data.perm < 1) {
                                alert(Localize.AccessRestricted + '!');
                                return false;
                            }
                            return true;
                        },
                        select: function(){
                            Store.baseParams.category = this.getValue();
                            Store.reload({ params: { category: this.getValue() }});
                            Ext.app.DefaultView.set(COOKIE, {
                                x3: this.getValue()
                            });
                        }
                    },
                	autoCreate: {
                		'data-cucumber': 'categoryCombo',
                		tag: 'input', 
                		type: 'text', 
                		size: '24'
                	}
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    disabled: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x6', false)) : false,
                    id: 'SmplSearchCombo',
                    width: 164,
                    displayField: 'name',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x2') : 0,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        data: [
                            ['0', Localize.PersonFullName],
                            ['1', Ext.app.Localize.get('Agreement')],
                            ['6', Ext.app.Localize.get('Paycode')],
                            ['2', Localize.UserLogin],
                            ['3', Localize.AccountLogin],
                            ['4', 'E-mail'],
                            ['5', Ext.app.Localize.get('Contact phone')],
                            ['7', Ext.app.Localize.get('Address')],
                            ['8', Ext.app.Localize.get('Similar addresses')]
                        ],
                        fields: ['id', 'name']
                    }),
                    listeners: {
                        select: function(combo){
                            Store.baseParams.searchtype = this.getValue();
                            Ext.app.DefaultView.set(COOKIE, {
                                x2: this.getValue()
                            });
                            combo.ownerCt.get('fieldsEl').getLayout().setActiveItem(combo.getValue() == 8 ? 1 : 0);
                        }
                    },
                	autoCreate: {
                		'data-cucumber': 'smplSearchCombo',
                		tag: 'input', 
                		type: 'text', 
                		size: '24'
                	}
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'container',
                    id: 'SmplSearchField',
                    disabled: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x6', false)) : false,
                    itemId: 'fieldsEl',
                    layout: {
                        type: 'card',
                        layoutOnCardChange: true
                    },
                    width: 280,
                    activeItem: Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'x2') == 8 ? 1 : 0,
                    listeners: {
                        afterrender: function(Cont) {
                            var El = Cont.items.get(1);
                            El.setWidth(El.getWidth() + El.getTriggerWidth());
                        }
                    },
                    items: [{
                        xtype: 'textfield',
                        value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x4') : '',
                        listeners: {
                            activate: function(item) {
                                Store.setBaseParam('search', item.getValue());
                            },
                            afterrender: function() {
                                this.on('specialkey', function(f, e){
                                    if (e.getKey() == e.ENTER) {
                                        var Btn = this.ownerCt.ownerCt.get('searchBtn');
                                        Btn.handler(Btn);
                                    }
                                }, this);
                            },
                            autoCreate: {
                        		'data-cucumber': 'smplSearchField',
                        		tag: 'input', 
                        		type: 'text', 
                        		size: '24'
                        	}
                        }
                    }, {
                        xtype: 'combo',
                        mode: 'remote',
                        queryParam: 'address',
                        triggerAction: 'query',
                        lastQuery: '',
                        submitValue: false,
                        valueField: 'code',
                        displayField: 'address',
                        listWidth: 380,
                        resizable: true,
                        forceSelection: true,
                        listeners: {
                            activate: function(item) {
                                Store.setBaseParam('search', item.getValue());
                            },
                            afterrender: function(combo) {
                                if(Ext.isIE) {
                                    combo.getEl().setTop(0);
                                }
                            },
                            render: function(combo){
                                combo.setHideTrigger(true);
                                if(Ext.app.DefaultView.exists(COOKIE)) {
                                    var store = combo.getStore();
                                    if (Ext.app.DefaultView.get(COOKIE, 'x8', null) && Ext.app.DefaultView.get(COOKIE, 'x9', null)) {
                                        store.add(new store.recordType({
                                            code: Ext.app.DefaultView.get(COOKIE, 'x8'),
                                            address: Ext.app.DefaultView.get(COOKIE, 'x9', '')
                                        }));
                                        combo.setValue(Ext.app.DefaultView.get(COOKIE, 'x8'));
                                    }
                                }
                            },
                            select: function(combo) {
                                Store.baseParams.search = this.getValue();
                                Ext.app.DefaultView.set(COOKIE, {
                                    x8: this.getValue()
                                });
                                Ext.app.DefaultView.set(COOKIE, {
                                    x9: this.getRawValue()
                                });
                                Store.setBaseParam('search', this.getValue()).reload({
                                    params: {
                                        start: 0
                                    }
                                });
                            }
                        },
                        store: {
                            xtype: 'jsonstore',
                            url: 'config.php',
                            method: 'POST',
                            root: 'results',
                            fields: ['code','address'],
                            baseParams: {
                                async_call: 1,
                                devision: 22,
                                getaddressfly: 1,
                                skipduplicate: 1 
                            }
                        }
                    }]
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    itemId: 'searchBtn',
                    text: Ext.app.Localize.get('Search'),
                    iconCls: 'ext-search',
                    handler: function(Btn){
                        if (!Btn.ownerCt.ownerCt.items.get(1).items.get('advSBox').getValue()) {
                        	
                        	 Ext.app.DefaultView.set(COOKIE, {
                                    x4: Btn.ownerCt.get('fieldsEl').getLayout().activeItem.getValue()
                                });
                                
                            Store.setBaseParam('search', Btn.ownerCt.get('fieldsEl').getLayout().activeItem.getValue()).reload({
                                params: {
                                    start: 0
                                }
                            });
                        }
                        else {
                            advSearch(true);
                        }
                    }
                }]
            }, {
                xtype: 'container',
                layout: 'toolbar',
                getGrid: function() {
                    return this.ownerCt.ownerCt;
                },
                style: {
                    paddingTop: '1px'
                },
                width: 955,
                items: [{
                    xtype: 'container',
                    width: 115,
                    style: {
                        paddingTop: '4px',
                        paddingLeft: '2px'
                    },
                    html: Ext.app.Localize.get('Preactivated') + ': '
                }, {
                    xtype: 'checkbox',
                    itemId: 'preactivatedBox',
                    width: 23,
                    height: 23,
                    checked: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x10', false)) : false,
                    handler: function(A, B){
                        Store.baseParams.includepreactivated = B ? 1 : 0
                        Store.reload({ params: { start: 0, limit: PAGELIMIT } });
                        Ext.app.DefaultView.set(COOKIE, {
                            x10: B ? 1 : 0
                        })
                    },
					listeners: {
						afterrender: function(cb) {
							if(Ext.isEmpty(Ext.app.DefaultView.get(COOKIE, 'x10'))) {
								cb.setValue(true);
							}
						}
					}				
                }, {
                    xtype: 'container',
                    width: 123,
                    style: {
                        paddingTop: '4px',
                        paddingLeft: '2px'
                    },
                    html: Localize.UserTpl + ': '
                }, {
                    xtype: 'checkbox',
                    width: 23,
                    height:23,
                    checked: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false)) : false,
                    handler: function(A, B){
                        this.ownerCt.getGrid().view.setTplControlVisible(B);
                        Store.baseParams.istemplate = B ? 1 : 0
                        Store.reload({ params: { start: 0, limit: PAGELIMIT } });
                        Ext.app.DefaultView.set(COOKIE, {
                            x5: B ? 1 : 0
                        })
                    },
                    listeners: {
                        render: function() {
                            if (Ext.app.DefaultView.exists(COOKIE)) {
                                this.ownerCt.getGrid().view.setTplControlVisible(Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false)));
                            }
                        }
                    }
                }, {
                    xtype: 'tbseparator',
                    style: {
                        paddingRight: '3px'
                    }
                }, {
                    xtype: 'container',
                    width: 118,
                    style: {
                        paddingTop: '4px',
                        paddingLeft: '2px'
                    },
                    html: Localize.AdvancedSearch + ': '
                }, {
                    xtype: 'checkbox',
                    itemId: 'advSBox',
                    width: 23,
                    height:23,
                    checked: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x6', false)) : false,
                    handler: function(A, B){
                        Ext.app.DefaultView.set(COOKIE, {
                            x6: B ? 1 : 0
                        });

                        A.ownerCt.items.eachKey(function(A,B,C) {
                            if(this.tpl.test(B.id)) {
                                if (this.checked) {
                                    B.enable();
                                }
                                else {
                                    B.disable();
                                }
                            }
                        }, {
                            checked: B,
                            tpl: new RegExp('advSearch')
                        });

                        A.ownerCt.ownerCt.items.items[0].items.eachKey(function(A,B,C) {
                            if(this.tpl.test(B.id)) {
                                if (this.checked) {
                                    B.disable();
                                    if(Ext.isDefined(B['hasSearch']) && B['hasSearch']) {
                                        B.onTrigger1Click();
                                    }
                                }
                                else {
                                    B.enable();
                                }
                            }
                        }, {
                            checked: B,
                            tpl: new RegExp('SmplSearch')
                        });

                        if(!B){
                            advSearch(true, true);
                            Ext.app.DefaultView.remove(COOKIE, 'x7');
                        }
                        else {
                            Ext.app.DefaultView.remove(COOKIE, 'x4');
                        }
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    disabled: Ext.app.DefaultView.exists(COOKIE) ? (Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x6', false)) ? false : true) : true,
                    id: 'advSearchList',
                    width: 194,
                    displayField: 'tplname',
                    valueField: 'tplname',
                    typeAhead: false,
                    forceSelection: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: true,
                    listeners: {
                        select: function() {
                            if(Ext.app.DefaultView.exists(COOKIE)) {
                                Ext.app.DefaultView.set(COOKIE, {
                                    x7: this.getRawValue()
                                })
                            }
                        }
                    },
                    store: new Ext.data.ArrayStore({
                        fields: [{ name: 'tplname', type: 'string' }],
                        data: []
                    }),
                    mainStore: new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({
                            url: 'config.php',
                            method: 'POST'
                        }),
                        reader: new Ext.data.JsonReader({
                            root: 'results'
                        }, [
                            { name: 'tplname', type: 'string' },
                            { name: 'property', type: 'string' },
                            { name: 'condition', type: 'string' },
                            { name: 'date', type: 'date', dateFormat: 'd-m-Y' },
                            { name: 'value', type: 'string' },
                            { name: 'logic', type: 'string' }
                        ]),
                        baseParams: {
                            async_call: 1,
                            devision: 42,
                            getallsearchtpl: ''
                        },
                        autoLoad: true,
                        listeners: {
                            add: function(s,r,i){
                                var C = Ext.getCmp('advSearchList');
                                Ext.each(r, function(A){
                                    if(this.store.find('tplname', A.data.tplname) < 0) {
                                        this.store.add(A);
                                        this.store.sort('tplname', 'ASC');
                                    }
                                    if(this.cookie && this.cookieData == A.data.tplname) {
                                        this.element.setValue(A.data.tplname);
                                        advSearch(AUTOLOAD);
                                    }
                                }, {
                                    element: C,
                                    store: C.store,
                                    mainStore: C.mainStore,
                                    cookie: Ext.app.DefaultView.exists(COOKIE),
                                    cookieData: Ext.app.DefaultView.get(COOKIE, 'x7')
                                });
                            },
                            load: function(s,r,i){
                                s.events.add.listeners[0].fn(s,r,i);
                            },
                            remove: function(s,r,i){
                                var C = Ext.getCmp('advSearchList');
                                var f = C.store.find('tplsname', r.data.tplname);
                                if(f > -1) {
                                    C.store.remove(C.store.getAt(f));
                                }
                            }
                        }
                    })
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    id: 'advSearchEdit',
                    text: Localize.Change + '&nbsp;' + Localize.rules + ' / ' + Localize.Create + '&nbsp;' + Localize.rules,
                    disabled: Ext.app.DefaultView.exists(COOKIE) ? (Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x6', false)) ? false : true) : true,
                    handler: function(){
                        fn = function(A){
                            var C = Ext.getCmp('advSearchList');
                            C.mainStore.each(function(r){
                                if(r.data.tplname == this.tplname) {
                                    this.store.remove(r);
                                }
                            }, { store: C.mainStore, tplname: A.tplname});
                            if(A.data.length > 0) {
                                Ext.each(A.data, function(A){
                                    this.add(new this.recordType(A))
                                }, C.mainStore);
                                if(!Ext.isEmpty(A.data[0].tplname)) {
                                    C.setValue(A.data[0].tplname);
                                }
                            }
                            else {
                                var i = C.store.find('tplname', A.tplname);
                                if(i > -1) {
                                    C.store.remove(C.store.getAt(i));
                                }
                                C.setValue('');
                            }
                        };
                        var C = Ext.getCmp('advSearchList');
                        var rules = [];
                        C.mainStore.each(function(R){
                            if(this.tplname == R.data.tplname){
                                this.rules.push(R.data);
                            }
                        }, { rules: rules, tplname: C.getValue() });
                        new SearchTemplate.show({
                            tplname: C.getValue(),
                            onsearch: fn,
                            onsave: fn,
                            onSaveClose: true,
                            rules: rules
                        })
                    }
                }, {
                    xtype: 'tbseparator',
                    style: {
                        paddingRight: '15px'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'ext-remove',
                    text: Localize.Remove,
                    sendDelete: function(items) {
                        if(items.length > 0) {
                            var H = [{
                                xtype: 'hidden',
                                name: 'devision',
                                value: 22
                            }, {
                                xtype: 'hidden',
                                name: 'async_call',
                                value: 1
                            }];

                            Ext.each(items, function(A){
                                this.el.push({
                                    xtype: 'hidden',
                                    name: 'deluid[]',
                                    value: A
                                });
                            }, {
                                el: H
                            });

                            var F = new Ext.form.FormPanel({
                                frame: false,
                                url: 'config.php',
                                items: H,
                                renderTo: document.body
                            });

                            F.getForm().submit({
                                method:'POST',
                                waitTitle: Localize.Connecting,
                                waitMsg: Localize.SendingData + '...',
                                scope: this,
                                success: function(form, action) {
                                    Ext.Msg.alert(Localize.Info, Localize.RequestDone);
                                    Store.reload();
                                    F.destroy();
                                },
                                failure: function(form, action) {
                                    if(action.failureType == 'server') {
                                        obj = Ext.util.JSON.decode(action.response.responseText);

                                        try {
                                            var store = new Ext.data.ArrayStore({
                                                autoDestroy: true,
                                                idIndex: 0,
                                                data: obj.errors.reason,
                                                fields: [{
                                                    name: 'uid',
                                                    type: 'int'
                                                }, {
                                                    name: 'name',
                                                    type: 'string'
                                                }, {
                                                    name: 'reason',
                                                    type: 'string'
                                                }],
                                                listeners: {
                                                    load: function(S) {
                                                        S.each(function(record){
                                                            var idx = this.main.find('uid', record.data.uid);
                                                            if(idx > -1) {
                                                                record.set('name', this.main.getAt(idx).data.name);
                                                            }
                                                        }, {
                                                            main: Store
                                                        });

                                                        S.commitChanges();
                                                    }
                                                }
                                            });

                                            new Ext.Window({
                                                modal: true,
                                                width: 600,
                                                title: Ext.app.Localize.get('Error'),
                                                items: [{
                                                    xtype: 'grid',
                                                    store: store,
                                                    height: 200,
                                                    autoExpandColumn: 'nonedelreason',
                                                    cm: new Ext.grid.ColumnModel({
                                                        columns: [{
                                                            header: 'UID',
                                                            dataIndex: 'uid',
                                                            width: 80
                                                        }, {
                                                            header: Localize.UserName,
                                                            dataIndex: 'name',
                                                            width: 200
                                                        }, {
                                                            header: Localize.Reason,
                                                            dataIndex: 'reason',
                                                            id: 'nonedelreason'
                                                        }],
                                                        defaults: {
                                                            sortable: true,
                                                            menuDisabled: false
                                                        }
                                                    })
                                                }]
                                            }).show();
                                        }
                                        catch(e) {

                                        }
                                    }
                                    F.destroy();
                                }
                            });
                        }
                    },
                    menu: [{
                        text: '<span data-cucumber="removeSelected">' + Localize.RemoveSelected + '</span>',
                        handler: function() {
                            Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Remove selected users') + '?', function(B){
                                if (B == 'yes') {
                                    this.fn.sendDelete(this.sm);
                                }
                            }, {
                                fn: this.ownerCt.ownerCt,
                                sm: this.ownerCt.ownerCt.ownerCt.getGrid().view.checkStates.getChecked()
                            });
                        },
                    }, {
                        text: '<span data-cucumber="removeAll">' + Localize.SelectAllAndRemove + '</span>',
                        handler: function(){
                            this.ownerCt.ownerCt.ownerCt.getGrid().view.checkAllGroups();
                            Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Remove selected users') + '?', function(B){
                                if (B == 'yes') {
                                    this.fn.sendDelete(this.sm);
                                }
                            }, {
                                fn: this.ownerCt.ownerCt,
                                sm: this.ownerCt.ownerCt.ownerCt.getGrid().view.checkStates.getChecked()
                            });
                        }
                    }]
                }]
            }]
        }),
        cm: new Ext.grid.ColumnModel({
            columns: [{
                header: 'UID',
                dataIndex: 'uid',
                width: 80,
                hidden: true
            }, {
                header: Localize.Agreement,
                id: 'agrmcolumn',
                dataIndex: 'agrmnum',
                groupable: false,
                renderer: function(val, meta, record) {
                    if(val.length == 0) {
                        return record.data.closedon ? '<span style="font-style: italic, color: grey">' + Localize.UndefNumber + '</span>': '<span style="font-style: italic">' + Localize.UndefNumber + '</span>';
                    }
                    else {
                    	return record.data.closedon ? '<span style="color:grey">' + val + '</span>' : val;
                    	
                    }
                }
            }, {
                header: Localize.Operator,
                dataIndex: 'opername',
                width: 120
            }, {
                header: Localize.Paycode,
                dataIndex: 'code',
                width: 100
            }, {
                header: Localize.Balance,
                dataIndex: 'balance',
                width: 100,
                renderer: function(val) {
                    if(val < 0) {
                        return '<span style="color: red">' + val + '</span>';
                    }
                    else {
                        return val;
                    }
                }
            }, {
                header: Localize.PromisedPayment,
                dataIndex: 'ppdebt',
                width: 100,
                render: function(val) {
                    if(val > 0) {
                        return '<span style="color: red">' + val + '</span>';
                    }
                    else {
                        return val;
                    }
                }
            }, {
                header: Localize.Symbol,
                dataIndex: 'symbol',
                width: 50
            }, BButton, HButton, PButton, TButton],
            defaults: {
                sortable: false,
                menuDisabled: true
            }
        }),
        plugins: [BButton, HButton, PButton, TButton],
        autoExpandColumn: 'agrmcolumn',
        loadMask: true,
        view: new Ext.grid.GroupingView({
            startCollapsed: false,
            forceFit: true,
            hideGroupedColumn: true,
            showPreview: true, // custom property
            groupTextTpl: '{[values.rs[0].data.istemplate ? values.rs[0].data.descr : values.rs[0].data.name]} {[!values.rs[0].data.istemplate ? "(" + values.rs[0].data.login + ")" : ""]}'
        }),
        store: Store,
        bbar: new Ext.PagingToolbar({
            pageSize: PAGELIMIT,
            store: Store,
            displayInfo: true,
            items: ['-', {
                xtype: 'combo',
                width: 70,
                displayField: 'id',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                value: PAGELIMIT,
                editable: false,
                store: new Ext.data.ArrayStore({
                    data: [
                        ['100'],
                        ['500']
                    ],
                    fields: ['id']
                }),
                listeners: {
                    select: function(){
                        PAGELIMIT = this.getValue() * 1;
                        this.ownerCt.pageSize = PAGELIMIT;
                        Store.reload({ params: { limit: PAGELIMIT } });
                    }
                }
            }]
        })
    });

    HButton.on('action', function(grid, record, rowIndex) {
        if(record.data.istemplate) {
            return;
        }
        Charges({
            agrmid: record.data.agrmid
        });
        
    });
    
    BButton.on('action', function(grid, record, rowIndex) {
        if(record.data.istemplate || record.data.closedon) {
            return;
        }
        
        new Ext.Window({
            modal: true,
            title: Ext.app.Localize.get('Terminate contract'),
            width: 300,
            layout: 'fit',
            items: [{
                xtype: 'form',
		        frame: true,
		        autoHeight: true,
		        monitorValid: true,
		        defaults: {
		        	anchor: '100%'
		        },
		        items: [{
		        	xtype: 'hidden',
		        	name: 'agrmid',
		        	value: record.get('agrmid')
		        }, {
                    xtype: 'hidden',
                    name: 'closeagrm',
                    value: 1
		        }, {
                    xtype: 'datefield',
		            name: 'agrmrdate',
		            allowBlank: false,
		            width: 150,
		            format: 'Y-m-d',
		            minValue: record.get('agrmdate'),
		            value: new Date().format('Y-m-d'),
		            fieldLabel: Ext.app.Localize.get("Date of terminate")
                }]
            }],
            
            buttonAlign: 'center',
            buttons: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Save'),
				handler: function(Btn) {
					var form = Btn.findParentByType('window').get(0).getForm();
					
					if(!form.isValid()) {
						return;
					}
					
					form.submit({
						url: 'config.php',
						waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
						params: {
							async_call: 1, 
							devision: 22
						},
						scope: {
                            win: Btn.findParentByType('window')
						},
                        success: function(form, action) {
                        	this.win.close();
                        	grid.store.reload();
                        },
                        failure: function(form, action) {
                        	if(action.result.error) {
                                Ext.Msg.error(Ext.app.Localize.get(action.result.error));
                        	}
                        	else
                        		Ext.Msg.error(Ext.app.Localize.get('Agreement close error'));
                        }
					});
                    Store.reload();
				}
			}]
        }).show();
        
    });

    PButton.on('action', function(grid, record, rowIndex){
        if(record.data.istemplate) {
            return;
        }
        setPayment({
            uid: record.data.uid,
            agrmid: record.data.agrmid,
            onpayment: function(o){
                grid.store.reload();
            },
            onpromised: function(o){
                grid.store.reload();
            },
            scope: grid
        })
    });

    
    
    
    TButton.on('action', function(grid, record, rowIndex, e){
        if(record.data.istemplate || record.data.closedon) {
            return;
        }

        sendLockCommand = function(action){
            if(this.record.data.agrmid <= 0 || this.record.data.agrmid == "") {
                Ext.Msg.alert(Localize.Error, Localize.Undefined + ' ' + Localize.agreement)
                return false;
            }
            var F = new Ext.form.FormPanel({
                frame: false,
                url: 'config.php',
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 22
                }, {
                    xtype: 'hidden',
                    name: 'lockcommand[agrmid]',
                    value: this.record.data.agrmid
                }, {
                    xtype: 'hidden',
                    name: 'lockcommand[action]',
                    value: action
                }],
                renderTo: Ext.getBody()
            });

            F.getForm().submit({
                method:'POST',
                waitTitle: Localize.Connecting,
                waitMsg: Localize.SendingData + '...',
                success: function(form, action) {
                    var O = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Localize.Info, O.reason);
                    F.destroy();
                },
                failure: function(form, action){
                    var O = Ext.util.JSON.decode(action.response.responseText);
                    if(!Ext.isArray(O.reason)) {
                        Ext.Msg.alert(Localize.Error, O.reason);
                    }
                    else {
                        try {
                            var store = new Ext.data.ArrayStore({
                                autoDestroy: true,
                                idIndex: 0,
                                data: O.reason,
                                fields: [{
                                    name: 'login',
                                    type: 'string'
                                }, {
                                    name: 'tardescr',
                                    type: 'string'
                                }, {
                                    name: 'reason',
                                    type: 'string'
                                }]
                            });

                            new Ext.Window({
                                modal: true,
                                title: Ext.app.Localize.get('Error'),
                                width: 600,
                                items: [{
                                    xtype: 'grid',
                                    store: store,
                                    height: 200,
                                    autoExpandColumn: 'nonedelreason',
                                    cm: new Ext.grid.ColumnModel({
                                        columns: [{
                                            header: Localize.Login,
                                            dataIndex: 'login',
                                            width: 140
                                        }, {
                                            header: Localize.Tarif,
                                            dataIndex: 'tardescr',
                                            width: 200
                                        }, {
                                            header: Localize.Reason,
                                            dataIndex: 'reason',
                                            id: 'nonedelreason'
                                        }],
                                        defaults: {
                                            sortable: true,
                                            menuDisabled: true
                                        }
                                    })
                                }]
                            }).show();
                        }
                        catch(e) { }
                    }
                    F.destroy();
                }
            });
        }

        var B = new Ext.menu.Menu({
            items: [{
                text: Localize.LockAllAccounts,
                handler: sendLockCommand.createDelegate({ record: record, grid: grid }, ['lock'])
            }, {
                text: Localize.UnlockAllAccounts,
                handler: sendLockCommand.createDelegate({ record: record, grid: grid }, ['unlock'])
            }]
        });

        B.showAt(e.getXY());
    });
    
    
    
} // showUsersList()


/**
 * Configuration form to manage users additional fields
 *
 */
function userFormFields(){
    if (!Ext.isEmpty(Ext.getCmp('userFormFields'))) {
        return;
    }

    createField = function(A){
        if (!Ext.isEmpty(Ext.getCmp('editUsrFormField'))) {
            Ext.getCmp('editUsrFormField').close();
        }
        A = A ||
        {
            data: {
                type: 0,
                name: '',
                descr: ''
            }
        };
        var Rm = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Localize.DeleteField,
            dataIndex: 'idx',
            width: 22,
            iconCls: 'ext-drop'
        });
        title = function(A){
            try {
                return Localize.EditField + ': ' + A.get('name')
            }
            catch (e) {
                return Localize.AddNewRecord
            }
        }
        new Ext.Window({
            id: 'editUsrFormField',
            title: title(A),
            width: 370,
            shawdow: false,
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Localize.Save,
                handler: function(B){
                    var W = B.findParentByType('window');
                    var F = W.findByType('form')[0];
                    if (W.findById('fieldValues').isVisible()) {
                        W.findById('fieldValues').store.each(function(R){
                            if (R.get('idx') == 0) {
                                this.add({
                                    xtype: 'hidden',
                                    name: 'newstaff[]',
                                    value: R.get('value')
                                });
                            }
                            else {
                                this.add({
                                    xtype: 'hidden',
                                    name: 'staff[' + R.get('idx') + ']',
                                    value: R.get('value')
                                });
                            }
                        }, F);
                        F.doLayout();
                    }
                    F.getForm().submit({
                        method: 'POST',
                        waitTitle: Localize.Connecting,
                        waitMsg: Localize.SendingData + '...',
                        success: function(form, action){
                            Ext.getCmp('userFormFields').findByType('grid')[0].store.reload();
                            W.close();
                        },
                        failure: function(form, action){
                            if (action.failureType == 'server') {
                                obj = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
                            }
                        }
                    })
                }
            }, {
                xtype: 'button',
                text: Localize.Cancel,
                handler: function(){
                    this.ownerCt.ownerCt.close();
                }
            }],
            items: [{
                xtype: 'form',
                id: 'usrFormFieldEdit',
                url: 'config.php',
                method: 'POST',
                frame: true,
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 22
                }, {
                    xtype: 'textfield',
                    fieldLabel: Localize.Description,
                    name: 'descr',
                    width: 150,
                    value: (A.data.descr) ? A.data.descr : ''
                }, {
                    xtype: 'textfield',
                    fieldLabel: Localize.Field,
                    name: 'setufrmfds',
                    width: 150,
                    readOnly: (A.data.name.length == 0) ? false : true,
                    value: (A.data.name) ? A.data.name : '',
                    maskRe: new RegExp('[a-zA-Z0-9\-\_]')
                }, {
                    xtype: 'combo',
                    fieldLabel: Localize.Type,
                    id: 'fieldType',
                    width: 100,
                    hiddenName: 'type',
                    displayField: 'name',
                    valueField: 'type',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: (A.data.type) ? A.data.type : 0,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['type', 'name'],
                        data: [
                            [0, Localize.Text],
                            [1, Localize.List],
                            [2, Ext.app.Localize.get('Logical')] 
                        ]
                    }),
                    listeners: {
                        beforeselect: function(){
                            try {
                                A.get('name');
                                return false;
                            }
                            catch (e) {
                                return true
                            }
                        },
                        select: function(C, R){
                            var W = C.findParentByType('window');
                            if (R.data.type == 1) {
                                W.findById('fieldValues').show();
                            }
                            else {
                                W.findById('fieldValues').hide();
                            }
                            W.setActive(true);
                        }
                    }
                }]
            }, {
                xtype: 'editorgrid',
                id: 'fieldValues',
                hidden: true,
                height: 190,
                autoExpandColumn: 'comboValue',
                loadMask: true,
                clicksToEdit: 1,
                plugins: Rm,
                tbar: [{
                    xtype: 'button',
                    iconCls: 'ext-add',
                    text: Localize.AddValue,
                    handler: function(){
                        this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
                            idx: 0,
                            value: ''
                        }))
                    }
                }],
                cm: new Ext.grid.ColumnModel([{
                    header: Localize.Value,
                    dataIndex: 'value',
                    id: 'comboValue',
                    editor: new Ext.form.TextField({
                        alloBlank: false
                    })
                }, Rm]),
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader({
                        root: 'results'
                    }, [{
                        name: 'idx',
                        type: 'int'
                    }, {
                        name: 'value',
                        type: 'string'
                    }]),
                    baseParams: {
                        async_call: 1,
                        devision: 22,
                        getufrmfds: '',
                        values: 1
                    }
                }),
                listeners: {
                    render: function(G){
                        if (A.data.type == 1) {
                            G.show();
                            G.store.baseParams.getufrmfds = A.data.name;
                            G.store.load();
                        }
                    }
                }
            }]
        }).show();
        Rm.on('action', function(g, r, idx){
            g.store.remove(r)
        });
    }

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.EditField,
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-edit'
    });
    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.DeleteField,
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-drop'
    });
    new Ext.Window({
        id: 'userFormFields',
        title: Localize.AUsrFrmFields,
        height: 400,
        width: 600,
        layout: 'fit',
        shawdow: false,
        items: {
            xtype: 'grid',
            height: 500,
            loadMask: true,
            autoExpandColumn: 'ppvalues',
            plugins: [Edit, Remove],
            tbar: [{
                xtype: 'button',
                iconCls: 'ext-add',
                text: Localize.AddNewRecord,
                handler: function(){
                    createField()
                }
            }],
            cm: new Ext.grid.ColumnModel([Edit, {
                header: Localize.Description,
                dataIndex: 'descr',
                width: 145
            }, {
                header: Localize.Field,
                dataIndex: 'name',
                width: 90
            }, {
                header: Localize.Type,
                dataIndex: 'type',
                width: 80,
                renderer: function(v){
                    if (v == 1) {
                        return Ext.app.Localize.get('List')
                    } else if (v == 2){
                        return Ext.app.Localize.get('Logical')
                    }
                    else {
                        return Ext.app.Localize.get('Text')
                    }
                }
            }, {
                header: Localize.DefinedValues,
                id: 'ppvalues',
                dataIndex: 'strvalue'
            }, Remove]),
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: 'config.php',
                    method: 'POST'
                }),
                reader: new Ext.data.JsonReader({
                    root: 'results'
                }, [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'type',
                    type: 'int'
                }, {
                    name: 'descr',
                    type: 'string'
                }, {
                    name: 'strvalue',
                    type: 'string'
                }]),
                autoLoad: true,
                baseParams: {
                    async_call: 1,
                    devision: 22,
                    getufrmfds: 0
                }
            })
        }
    }).show();
    Edit.on('action', function(g, r, idx){
        createField(r)
    });
    Remove.on('action', function(g, r, idx){
        var fm = new Ext.form.FormPanel({
            frame: false,
            url: 'config.php',
            items: [{
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 22
            }, {
                xtype: 'hidden',
                name: 'delufrmfds',
                value: r.get('name')
            }],
            renderTo: document.body
        });
        fm.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
                g.store.reload();
                fm.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
                }
                fm.destroy();
            }
        });
    });
} // end userFormFields()
