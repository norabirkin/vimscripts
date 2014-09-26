Ext.define( 'OSS.helpers.payments.check.IE', {
    extend: 'OSS.helpers.payments.Check',
    getHelperName: function() { return 'IE'; },
    save: function( data ) {
        var O = new ActiveXObject("Scripting.FileSystemObject"),
            path = this.getPath(),
            folder = this.getFolder();
        if (!O.FolderExists(folder)) {
            Ext.Msg.alert(OSS.Localize.get('Error'), OSS.Localize.get('Undefined-o') + ': "' + OSS.Localize.get('Cash Register folder') + '" (' + folder + ')')
            return false;
        }
        if (!O.FileExists(path)) {
            if (!(F = O.CreateTextFile(path))) {
                Ext.Msg.alert(OSS.Localize.get('Error'), OSS.Localize.get('Can not create file') + ': ' + path);
            } else {
                Ext.each(data, function(item){
                    this.file.WriteLine( this.helper.endLine(item) );
                }, { file: F, helper: this });
                F.Close()
            }
        } else {
            Ext.Msg.alert(OSS.Localize.get('Error'), OSS.Localize.get('The same file already exists') + ': ' + path);
        }
    },
    endLine: function( line ) { return line + ';'; }
});
