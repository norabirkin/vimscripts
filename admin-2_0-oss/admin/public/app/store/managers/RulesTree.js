/**
 * Дерево правил
 */
Ext.define('OSS.store.managers.RulesTree', {
    extend: 'Ext.data.TreeStore',
    model: 'OSS.model.managers.RolesTree',
    requires: 'OSS.model.managers.RolesTree',
    proxy: {                        
        type: 'ajax',   
        url: 'index.php/api/managersrolerules/tree'
    }
});
