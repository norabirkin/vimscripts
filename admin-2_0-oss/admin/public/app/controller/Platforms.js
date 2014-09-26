/**
 * Контроллер раздела Объекты/Платформы
 */
Ext.define('OSS.controller.Platforms', {
    extend: 'Ext.app.Controller',
    view: 'Platforms',
    requires: [],
    stores: [
        'platforms.Agents',
        'Platforms'
    ],
    views: [
        'platforms.CheckColumn',
        'platforms.Agents',
        'Platforms',
        'platforms.Platforms'
    ],
    refs: [{
        selector: 'platforms',
        ref: 'main'
    }, {
        selector: 'platforms > #agents',
        ref: 'agents'
    }],
    init: function() {
        this.control({
            'platforms > #platforms': {
                aftersave: this.setInvalid,
                itemsremoved: this.setInvalid
            },
            'platforms > #platforms > headercontainer > #edit': {
                click: 'showAgents'
            },
            'platforms > #agents > headercontainer > gridcolumn[dataIndex=attached]': {
                onSuccessfullStateChange: 'onChanged'
            },
            'platforms > #agents > toolbar > back': {
                click: 'showPlatforms'
            }
        });
        this.getPlatformsAgentsStore().on('load', this.onAgentsLoad, this);
    },
    programActivated: function() {
        this.getMain().getLayout().getActiveItem().getStore().load();
    },
    showAgents: function() {
        var record = arguments[5];

        this.setActiveItem('agents');
        this.getPlatformsAgentsStore().addExtraParams({
            platform_id: record.get('platform_id')
        });
        this.getPlatformsAgentsStore().load();
    },
    showPlatforms: function() {
        this.setActiveItem('platforms');
    },
    onAgentsLoad: function() {
        var types = this.getPlatformsAgentsStore().getRootNode().childNodes,
            agents,
            agent,
            i,
            j;

        this.getAgents().expandAll();
        for (i = 0; i < types.length; i ++) {
            agents = types[i].childNodes;
            for (j = 0; j < agents.length; j ++) {
                agent = agents[j];
                if (agent.get('attached')) {
                    this.onChanged(agent);
                    continue;
                }
            }
        }
    },
    onChanged: function(record) {
        var i,
            nodes = record.parentNode.childNodes,
            item;

        for (i = 0; i < nodes.length; i ++) {
            item = nodes[i];
            if (record.get('agent_id') != item.get('agent_id')) {
                item.set('disabled', record.get('attached'));
            }
        }
    },
    setActiveItem: function(id) {
        this.getMain().getLayout().setActiveItem(id);
    },
    getMaskTarget: function() {
        return this.getMain();
    },
    setInvalid: function() {
        OSS.component.StoreValidity.setInvalid('platforms');
    }
});
