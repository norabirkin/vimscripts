Ext.define( 'OSS.view.addresses.form.item.Interface', {
    getFieldLabelWidth: function() { return 120; },
    enabledIf: function() {},
    setParamsChangingHandler: function() {},
    getValue: function() { throw 'define getValue method'; },
    setValue: function() { throw 'define setValue method'; },
    getValueDescription: function() { throw 'define getValueDescription method'; },
    getCode: function() { throw 'define getCode method'; }
});
