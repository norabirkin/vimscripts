Ext.define('OSS.ux.form.field.IPField', {
    extend: 'Ext.form.field.Text',
    requires: [ 'OSS.helpers.agents.IP' ],
    alias: 'widget.ipfield',
    invalidIPMessage: i18n.get('Invalid IP address'),
    maskRe: /^[0-9\.]$/,
    validator: function() {
        var value = this.getValue();
        if ( value == '' && this.allowBlank ) {
            return true;
        }
        if (!OSS.helpers.agents.IP.validate( value )) {
            return this.invalidIPMessage;
        }
        return true;
    }
});
