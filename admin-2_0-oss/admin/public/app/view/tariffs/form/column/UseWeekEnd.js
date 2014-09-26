/**
 * Колонка "К-дарь" для гридов "Скидки по времени" и "В зависимости от дня и времени" раздела тарифов
 */
Ext.define('OSS.view.tariffs.form.column.UseWeekEnd', {
    header: i18n.get('Cald-r'),
    extend: 'Ext.grid.column.Column',
    dataIndex: 'use_weekend',
    width: 57,
    initComponent: function() {
        this.renderer = OSS.ux.grid.column.Renderer.render;
        this.editor = Ext.create('OSS.view.tariffs.form.bandpass.time.Calendar');
        this.callParent(arguments);
    }
});
