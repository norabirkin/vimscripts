/**
 * Обертка на класс Ext.Ajax.
 */
Ext.define('OSS.helpers.Ajax', {
    singleton: true,
    alternateClassName: [ 'ajax' ],

    /**
     * Совершает ajax запрос
     *
     * @param params.url {String} URL запроса
     * @param params.params {String} параметры запроса
     * @param params.successMessage {String} сообщение об успешном завершении операции
     * @param params.success {Function} функция выполняемая при успешном завершении операции
     * Функция принимает следующие параметры:
     *      @param results {Object} результат запроса
     *
     * @param params.failure {Function} функция выполняемая при неуспешном завершении операции
     * Функция принимает следующие параметры:
     *      @param error {String} сообщение об ошибке
     * @param params.noAlert {Boolean} не отобрать сообщения об успешном или неуспешном завершении операции
     */
    request: function(params) {
        var confirmation = params.confirmation;
        if (confirmation) {
            delete(params.confirmation);
            Ext.Msg.confirm( 
                i18n.get('Confirmation'),
                confirmation,
                this.requestIfConfirmed,
                {
                    request: Ext.bind(this.request, this, [params])
                }
            );
            return;
        }
        params.scope = params.scope || {};
        params.success = params.success || function() {};
        params.failure = params.failure || function() {};
        params.callback = params.callback || function() {};
        Ext.Ajax.request({
            url: 'index.php/api/' + params.url,
            params: params.params || {},
            method: params.method || 'POST',
            success: function( response ) {
                var results = Ext.JSON.decode(response.responseText).results;
                Ext.bind(params.success, params.scope)(results);
                Ext.bind(params.callback, params.scope)(results);
                if (params.noAlert) {
                    return;
                }
                OSS.ux.HeadMsg.show(i18n.get(params.successMessage || 'Request done successfully'));
            },
            failure: function( response ) {
                response = Ext.JSON.decode(response.responseText);
                Ext.bind(params.failure, params.scope)(response);
                Ext.bind(params.callback, params.scope)(response);
            },
            scope: this
        });
    },
    requestIfConfirmed: function(button) {
        if (button == "yes") {
            this.request();
        }
    }
});
