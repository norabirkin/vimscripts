Ext.define('OSS.view.printforms.AgrmQuickSearch', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: 'widget.agrmquicksearch',
    name: 'agrm_id',
    width: '100%',
    store: 'OSS.store.printforms.Agreements',
    loadOnRender: false,
    valueField: 'agrm_id',
    displayField: 'agrm_num',
    columns: [{
        header: i18n.get('ID'),
        dataIndex: 'agrm_id',
        width: 50 
    }, {
        header: i18n.get('Agreement'),
        dataIndex: 'agrm_num',
        flex: 1,
        renderer: function(value) {
            if(!value) {
                return '<font color="#c0c0c0"><i>'+ i18n.get('Not specified') +'</i></font>';
            }
            return value;
        }
    }] 
});
