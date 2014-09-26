Ext.define( 'OSS.helpers.payments.Check', {
    requires: [ 'OSS.helpers.payments.check.Fakes' ],
    constructor: function( config ) { this.initConfig(config); }, 
    config: { testMode: false },
    setFileName: function( name ) {
        this.file = name;
    },
    getFileName: function() {
        if (!this.file || this.file == '') {
            throw 'exception';
        } else {
            return this.file;
        }
    },
    getFolder: function() {
        return Ext.app.Application.instance.getController('Payments').managerInfo.cashregisterfolder;
    },
    getFakes: function() {
        if (!this.fakes) {
            this.fakes = Ext.create('OSS.helpers.payments.check.Fakes');
        }
        return this.fakes;
    },
    fake: function() {
        if (!this.testMode) {
            return;
        }
        this.getFakes()[this.getHelperName()]( this );
    },
    IE: function() {
        var helper = Ext.create('OSS.helpers.payments.check.IE', { testMode: this.testMode });
        helper.fake();
        return helper;
    },
    Gecko: function() {
        var helper = Ext.create('OSS.helpers.payments.check.Gecko', { testMode: this.testMode });
        helper.fake();
        return helper;
    },
    isWindows: function() {
        if (this.testMode) {
            return this.testMode.isWindows;
        } else {
            return Ext.isWindows;
        }
    },
    isGecko: function() {
        if (this.testMode) {
            return this.testMode.isGecko;
        } else {
            return Ext.isGecko;
        }
    },
    isIE: function() {
        if (this.testMode) {
            return this.testMode.isIE;
        } else {
            return Ext.isIE;
        }
    },
    factory: function() {
        if (this.isIE()) {
            return this.IE();
        }
        if (this.isGecko()) {
            return this.Gecko();
        } else {
            throw 'exception';
        }
    },
    getDelimeter: function() {
        return this.isWindows() ? "\\" : "/";
    },
    getPath: function() {
        return this.getFolder() + this.getDelimeter() + this.getFileName();
    },
    save: function() { throw 'define save method'; },
    getHelperName: function() { throw 'define getHelperName method'; },
    endLine: function() { throw 'define endLine method'; }
});
