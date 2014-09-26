Ext.define('OSS.store.documenttemplates.TemplateFiles', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: ['OSS.model.documenttemplates.TemplateFiles'],
    model: 'OSS.model.documenttemplates.TemplateFiles',
    proxy: {                        
        type: 'rest',  
        url: 'api/templatefiles',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
