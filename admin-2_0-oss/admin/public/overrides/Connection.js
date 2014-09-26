/**
 * Adds default settings to the Ext.data.Connection
 * The main goal is to change onComplete function to handle common server exceptions
 */
Ext.define('OSS.overrides.Connection', function() {
    /**
     * Осноная задача этого сингтона агрегировать активные подключения в виде счетчика
     * Нужен исключительно в хоте интеграционного тестирования.
     * Записывает и возвращает количество текущих подключений
     */
    Ext.define('OSS.helpers.Connection', {
        singleton: true,
        
        /**
         * Current connection number
         */
        active: 0,
        
        /**
         * Increase or decrease connection number
         * @param {Object} state True to increase, false to decrease
         */
        set: function(state) {
            var state = state || false;
            
            if(state === false && this.active > 0) {
                this.active--;
            }
            if(state === true) {
                this.active++;
            }
        },
        
        /**
         * Get active connections number
         */
        get: function() {
            return this.active;
        }
    });


    return {
        override: 'Ext.data.Connection',
        
        // Default request path
        url: '.',
        
        // Default timeoute
        timeout: 380000,
        
        constructor: function() {
            this.callParent();
            
            Ext.Function.interceptAfter(this, "request", this.regConnection, this);
        },
        
        /**
         * Set guest state to the authorization controller
         */
        setGuest: Ext.emptyFn,
    
        /**
         * Return isGuest current value
         * @return {Boolean}
         */
        getGuest: Ext.emptyFn,
        
        /**
         * Finds meta tag in the document to set application base url
         * @return {string}
         */
        getBaseUrl: function() {
            if (!Ext.isDefined(this.baseUrl)) {
                this.baseUrl = (Ext.query('meta[name=application-url]')[0] || { content: '.' }).content;
                
                this.baseUrl.replace(/[\/\\]+$/, "");
                this.url = this.baseUrl;
            }
            
            return this.url;
        },
        
        /**
         * Returns RESTful url using base url and passed route
         * @return {string}
         */
        getRestUrl: function() {
            var route = [];
        
            Ext.iterate(arguments, function(value) {
                this.push(value);
            }, route);
            
            route = route.join('/');
            route.replace(/^[\/\\]+/, "");
            return [this.getBaseUrl(), '/index.php/', route].join('');
        },

        res: function(response) {
            try {
                return Ext.JSON.decode(response.responseText).results;
            } catch(e) {
                return null;
            }
        },

        err: function(response) {
            try {
                return Ext.JSON.decode(response.responseText).error;
            } catch(e) {
                return null;
            }
        },

        decode: function(response) {
            try {
                return Ext.JSON.decode(response.responseText);
            } catch(e) {
                return null;
            }
        },

        fatalError: function(response) {
            response.JSONResults = {
                error: {
                    type: i18n.get('Fatal error'),
                    message: i18n.get(response.responseText)
                }
            };
        },
        
        /**
         * To be called when the request has come back from the server
         * This override needs to catch specific server exceptions and stop callback execution
         * @private
         * @param {Object} request
         * @return {Object} The response
         */
        onComplete : function(request) {
            var me = this,
                options = request.options,
                xhr,
                result,
                success,
                response;
    
            try {
                xhr = request.xhr;
                result = me.parseStatus(xhr.status);
                if (result.success) {
                    // This is quite difficult to reproduce, however if we abort a request just before
                    // it returns from the server, occasionally the status will be returned correctly
                    // but the request is still yet to be complete.
                    result.success = xhr.readyState === 4;
                }
            } catch (e) {
                // in some browsers we can't access the status if the readyState is not 4, so the request has failed
                result = {
                    success : false,
                    isException : false
                };
    
            }
            
            success = me.isXdr ? xdrResult : result.success;
            // decrease connection counter
            OSS.helpers.Connection.set(false);
            
            // Run success
            if (success) {
                response = me.createResponse(request);
                try {
                    response.JSONResults = Ext.JSON.decode(response.responseText).results;
                } catch(e) {
                    success = false;
                    result.success = false;
                    this.fatalError(response);
                }
            }
            if (success) {
                me.fireEvent('requestcomplete', me, response, options);
                Ext.callback(options.success, options.scope, [response, options]);
                this.showHeadMsg(options, response);
            } else {
                if (result.isException || request.aborted || request.timedout) {
                    response = me.createException(request);
                } else {
                    if (!response) {
                        response = me.createResponse(request);
                    }
                }
                if (!response.JSONResults) {
                    try {
                        response.JSONResults = Ext.JSON.decode(response.responseText);
                    } catch(e) {
                        this.fatalError(response);
                    }
                }
                
                // Keep unauthorized statuses
                if (response.status == 401) {
                    me.setGuest(true);
                } else {
                    if (!request.options.silent) {
                        this.showErrorMessage(response);
                    } else {
                        me.fireEvent('requestexception', me, response, options);
                    }
                }
                Ext.callback(options.failure, options.scope, [response, options]);
            }
            if (!Ext.isDefined(me.isGuest)) {
                Ext.callback(options.callback, options.scope, [options, success, response]);
            }
            
            delete me.requests[request.id];
            return response;
        },

        showHeadMsg: function(options, response) {
            var msg;
            if (options.operation) {
                msg = options.operation.msg;
            }
            if (!msg) {
                msg = options.msg;
            }
            if (!msg) {
                return;
            }
            if (msg === true) {
                msg = i18n.get('Request done successfully');
            } else if (typeof msg == 'function') {
                msg = msg(response.JSONResults);
            } else if (typeof msg != 'string') {
                throw 'not string';
            }
            OSS.ux.HeadMsg.show(msg);
        },
        
        showErrorMessage: function(response) {
            var data = response.JSONResults || {};
            if(response.timedout) {
                data.error = {
                    message: 'Connection failed. Server did not answer in time'
                };
            }
            if (data.error) {
                data.error.message = i18n.get(data.error.message) + (data.details ? ' ('+data.details+')' : '');
            }
            Ext.Msg.showError({
                title: i18n.get(data.error ? (data.error.title || 'Error') : 'Error'),
                msg: {
                    error: data.error
                },
                buttons: Ext.Msg.OK
            });
        },
        
        /**
         * Register connection in (iterate counter)
         */
        regConnection: function(options) {
            options = options || {};
            
            var me = this,
                async;
            
            async = options.async !== false ? (options.async || me.async) : false;
            
            if(async && this.getLatest()) {
                OSS.helpers.Connection.set(true);
            }
        }
    };
}());
