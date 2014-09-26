Ext.define( 'OSS.helpers.payments.check.Gecko', {
    extend: 'OSS.helpers.payments.Check',
    getHelperName: function() { return 'Gecko'; },
    getComponents: function() {
        return Components;
    },
    save: function( data ) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var F = this.getComponents().classes["@mozilla.org/file/local;1"].createInstance(this.getComponents().interfaces.nsILocalFile);
        F.initWithPath(this.getPath());

        if (!F.exists()) {
            F.create(F.NORMAL_FILE_TYPE, 0644);
        }

        var ioService = this.getComponents().classes["@mozilla.org/network/io-service;1"].getService(this.getComponents().interfaces.nsIIOService);
        var uri = ioService.newFileURI(F);
        var channel = ioService.newChannelFromURI(uri);
        var Out = this.getComponents().classes["@mozilla.org/network/file-output-stream;1"].createInstance(this.getComponents().interfaces.nsIFileOutputStream);

        Out.init(F, 0x20|0x02, 00004, null);

        Ext.each(data, function(item){
            if (this.charset) {
                this.utf.charset = this.charset;
                item = this.utf.ConvertFromUnicode(item)
            }
            item = this.helper.endLine( item );
            this.file.write(item, item.length);
        }, {
            file: Out,
            utf: this.getComponents().classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(this.getComponents().interfaces.nsIScriptableUnicodeConverter),
            charset: 'windows-1251',
            helper: this
        });

        Out.flush();
        Out.close();
    },
    endLine: function( line ) { return line + ";\n"; }
});
