/*
* Класс формирующий Iframe для выгрузки файлов
*/
Ext.define('OSS.helpers.Download', {
    singleton: true,
    
    alternateClassName: [
       'OSS.Download'
    ],
    
    buildUrl: function( params ) {
        var url = params.url,
            params = params.params || {};
        return Ext.String.urlAppend( url, Ext.Object.toQueryString(params) );
    },
    
    getFileUploadingIframe: function( src ) {
        if (!this.fileUploadingIframe) {
            this.fileUploadingIframe = Ext.DomHelper.append(Ext.getBody(), { tag: "iframe" });
        }
        return this.fileUploadingIframe;
    },
    
    get: function(params) {
        this.getFileUploadingIframe().src = this.buildUrl( params );
    }
});
