/**
 * Чекбокс колонка для управления связью платформ и агентов
 */
Ext.define('OSS.view.platforms.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    dataIndex: 'attached',
    width: 20,
    initComponent: function() {
        var me = this;

        this.renderer = function() {
            var record = arguments[2];
            if (me.isActive(record)) {
                return OSS.ux.grid.column.Renderer.render.apply(
                    this,
                    arguments
                );
            } else {
                return '';
            }
        };
        this.callParent(arguments);
        this.on('click', this.changeState, this);
    },
    isActive: function(record) {
        return true;
    },
    changeState: function() {
        var record = arguments[5],
            attached = !record.get('attached')*1;

        if (!this.isActive(record)) {
            return;
        }
        this.controller.mask(true);
        Ext.Ajax.request({
            url: 'index.php/api/platforms/staff',
            params: {
                agent_id: record.get('agent_id'),
                platform_id: record.get('platform_id'),
                attached: attached
            },
            scope: this,
            callback: function() {
                this.controller.mask(false);
            },
            success: function() {
                record.set('attached', attached);
                OSS.component.StoreValidity.setInvalid(this.validity);
                this.fireEvent('onSuccessfullStateChange', record);
            }
        });
    }
});
