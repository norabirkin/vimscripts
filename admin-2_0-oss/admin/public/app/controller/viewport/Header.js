/**
 * Controller: ViewportHeader
 * 
 */
Ext.define('OSS.controller.viewport.Header', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'Languages'
    ],
    
    refs: [{
        selector: 'ossheader #lang-img',
        ref: 'langImg'
    }],
    
    init: function() {
        this.control({
            'ossheader #lang-control': {
                afterrender: this.restoreLangImg,
                select: this.setLanguage
            }
        });
    },
    
    
    /**
     * Change application language
     * @param {object} combo
     * @param {object} record
     */
    setLanguage: function(combo, record) {
        var cookie = Ext.util.Cookies.get('lang');
        
        this.setLangImg(combo.getValue());
        
        if(cookie) {
            cookie = cookie.split(':');
            
            if(cookie.length > 1 && cookie[1] == combo.getValue()) {
                return;
            }
        }
        
        Ext.util.Cookies.set('lang', combo.getValue(),
            Ext.Date.add(new Date(), Ext.Date.DAY, 365),
            Ext.Ajax.getBaseUrl() + '/'
        );
        window.location.reload();
    },
    
    
    /**
     * Restore language on element render
     * @param {object} combo
     */
    restoreLangImg: function(combo) {
        var lang;
        if ((lang = Ext.util.Cookies.get('lang')) && combo.getStore().find('id', (lang = lang.split(':'))[0]) > -1) {
            combo.setValue(lang[0]);
            this.setLangImg(lang[0]);
        }
    },
    
    
    /**
     * Change Language Image
     * @param   {string}, language shortcut
     */
    setLangImg: function(lang) {
        this.getLangImg().getEl().replaceCls(this.getLangImg().getEl().dom.className, "x-app-lang-" + lang);
    }
});
