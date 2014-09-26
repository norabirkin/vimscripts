Ext.define( 'OSS.helpers.payments.check.Fakes', {
    IE: function () {
        console.log( 'IE Mode' );
        window.ActiveXObject = function() {
            this.FolderExists = function( folder ) {
                console.log( folder + ' exists' );
                return true;
            };
            this.FileExists = function( path ) {
                console.log( path + ' not exists' );
                return false;
            };
            this.CreateTextFile = function( path ) {
                console.log( 'create ' + path );
                return {
                    Close: function() {},
                    WriteLine: function( line ) { console.log( 'write: ' + line + ' to ' + path ); }
                };
            }
        };
    },
    Gecko: function( helper ) {
        console.log( 'Gecko mode' );
        window.netscape = {
            security: {
                PrivilegeManager: {
                    enablePrivilege: function() {}
                }
            }
        };
        helper.getComponents = function() {
            return {
                classes: {
                    "@mozilla.org/file/local;1": {
                        createInstance: function() {
                            return new function() {
                                this.initWithPath = function( path ) {
                                    this.path = path;
                                    console.log( 'init ' + path );
                                };
                                this.exists = function() {
                                    console.log( this.path + ' not exists' );
                                    return false;
                                };
                                this.create = function() {
                                    console.log( 'create ' + this.path );
                                };
                                this.NORMAL_FILE_TYPE = true;
                            };
                        }
                    },
                    "@mozilla.org/network/io-service;1": {
                        getService: function() { 
                            return {
                                newFileURI: function() {},
                                newChannelFromURI: function() {}
                            };
                        }
                    },
                    "@mozilla.org/network/file-output-stream;1": {
                        createInstance: function() {
                            return new function() {
                                this.init = function( file ) { this.path = file.path; };
                                this.write = function( line ) { console.log( 'write: ' + line + ' to ' + this.path ); };
                                this.flush = function() {};
                                this.close = function() {};
                            };
                        }
                    },
                    '@mozilla.org/intl/scriptableunicodeconverter': {
                        createInstance: function() {
                            return {
                                charset: true,
                                ConvertFromUnicode: function( line ) { return line; }
                            };
                        }
                    }
                },
                interfaces: {
                    nsILocalFile: true,
                    nsIIOService: true,
                    nsIFileOutputStream: true,
                    nsIScriptableUnicodeConverter: true
                }
            };
        };
    }
});
