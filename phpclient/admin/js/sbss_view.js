Ext.ns("Ext.list.SbssView");
Ext.list.SbssView = Ext.extend( Ext.DataView, {
    columns: [],
    getChecboxColulmnTpl: function() {
        return '<td width="25"><div style="margin-left: 7px;" class="x-grid3-hd-checker">&#160;</div></td>';
    },
    getImageButtonTpl: function( conf ) {
        var enabledIfOpen = '',
            enabledIfClose = '',
            tpl;
        if (conf.disabled) {
            return '';
        }
        if (conf.enabledIf) {
            enabledIfOpen = '<tpl if="'+conf.enabledIf+'">';
            enabledIfClose = '</tpl>';
        }
        tpl = [
            '<td class="' + conf.cls + '" width="40" align="center">',
                enabledIfOpen,
                    '<img class="' + conf.cls + '" border="0" title="' + conf.title + '" style="cursor: pointer;" src="' + conf.img + '">',
                enabledIfClose,
            '</td>'
        ];
        return tpl.join('');
    },
    getInfoItemTpl: function( conf ) {
        var width = conf.width ? ' width="' + conf.width + '"' : '';
        var tpl = [
            '<td align="left"' + width + '>',
                '<strong style="font-weight:bold;" >' + conf.label + ':</strong>',
                ' {' + conf.dataIndex + '}',
            '</td>'
        ];
        return tpl.join('');
    },
    getCreatorFunction: function( type ) {
        switch(type) {
            case 'checkbox': 
                return 'getChecboxColulmnTpl';
                break;
            case 'imageBtn':
                return 'getImageButtonTpl';
                break;
            case 'infoCol':
                return 'getInfoItemTpl';
                break;
        }
    },
    createButtonsByConf: function(conf) {
        var tpl = '';
        for ( i = 0; i < conf.length; i++ ) {
            tpl += this[this.getCreatorFunction(conf[i].type)](conf[i]);
        }
        return tpl;
    },
    initComponent: function() {
        var me = this,
            afterContent = this.afterContent ? [
                '<tr>',
                    '<td colspan="' + this.columns.length + '">'+this.afterContent+'</td>',
                '</tr>'
            ].join('') : '';
        Ext.list.SbssView.superclass.initComponent.call(this);
        this.tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<table cellpadding="0" cellspacing="0" border="0" width="100%">',
                    '<tr style="background-color:e0e0e0;" height="30">',
                        this.createButtonsByConf( this.columns ),
                    '</tr>',
                    '<tr>',
                        '<td colspan="' + this.columns.length + '" style="padding:10px;">{[Ext.util.Format.ellipsis(values.' + this.contentField + ', 150, true)]}</td>',
                    '</tr>',
                    afterContent,
                '</table>',
            '</tpl>',
            {
                getView: function() {
                    return me;
                }
            }
        );
        this.addEvents(
            'afterrender'
        );
    },
    afterContent: '',
    itemSelector: 'table',
    selectedRows: [],
    deselectRow: function( column, record ) {
                column.removeClass('x-grid3-hd-checker-on');
        var tmp = [];
        for ( i = 0; i < this.selectedRows.length; i++ ) {
            if (this.selectedRows[i].get('edit_this') != record.get('edit_this')) tmp.push(this.selectedRows[i]);
        }   
        this.selectedRows = tmp;
        this.areAllRowsSelected();
    },
    areAllRowsSelected: function() {
        var selected = this.selectedRows.length == this.store.getCount();
        if (selected) this.fireEvent( 'onallrowsselected' );
        else this.fireEvent( 'onnotallrowsselected' );
    },
    refresh : function() {
        Ext.list.SbssView.superclass.refresh.call(this);
        this.doAfterRefresh();
    },
    doAfterRefresh: function() {
    },
    deselectAllRows: function() {
        var nodes = this.getNodes();
        for (var i = 0; i < nodes.length; i++) {
            var column = Ext.get(nodes[i]).query('td:nth-child(1)')[0];
            column = Ext.get(column);
            if (column.hasClass("x-grid3-hd-checker-on")) column.removeClass('x-grid3-hd-checker-on');
        }
        this.selectedRows = [];
        this.areAllRowsSelected();
    },
    selectAllRows: function() {
        var nodes = this.getNodes();
        var item;
        var rows = [];
        for (var i = 0; i < nodes.length; i++) {
            item = this.store.getAt(i);
            rows.push( item );
            var column = Ext.get(nodes[i]).query('td:nth-child(1)')[0];
            column = Ext.get(column);
            if (!column.hasClass("x-grid3-hd-checker-on")) column.addClass('x-grid3-hd-checker-on');
        }
        this.selectedRows = rows;
        this.areAllRowsSelected();
    },
    selectRow: function( column, record ) {
                column.addClass('x-grid3-hd-checker-on');
        this.selectedRows.push( record );
        this.areAllRowsSelected();
    },
    changeRowState: function( checkbox, record ) {
                var column = Ext.fly(checkbox.parentNode);
        if (column.hasClass("x-grid3-hd-checker-on")) this.deselectRow( column, record );
        else this.selectRow( column, record );
    },
    listeners: {
        click: function() {
            var record = this.store.getAt( arguments[1] );
            var target = arguments[3].getTarget();  
            if ( target.className == 'x-grid3-hd-checker' ) { this.changeRowState( target, record );  }
            for( i = 0; i < this.columns.length; i++ ) {
                if (this.columns[i].type == 'imageBtn') {
                    if (this.columns[i].cls == target.className ) { this.columns[i].handler( record, this ); }
                }
            }
        }
    }
});
