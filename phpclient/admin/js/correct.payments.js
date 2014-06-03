/**
 * Корректировка платежей
 * Действие на кнопку корректирования платежей.
 *
 * correctType - Типы корректировок:
 * 1: перенос средств между лицевыми счетами
 * 2: исправление суммы платежа
 * 4: аннулирование платежа
 * 5: Восстановление ранее аннулированного платежа
 */
function correctPaymentWindow( correctType, input ){
	var feedWin;
	if(!feedWin){
		switch(correctType)
		{
			case 1:
				btnText = Ext.app.Localize.get('Transfer Payment');
				winTitle = Ext.app.Localize.get('Correction') + ': ' + Ext.app.Localize.get('Transfer payment to another agreement');
				var wHeight = 500;
			break;
			case 2:
				btnText = Ext.app.Localize.get('Correct Payment');
				winTitle = Ext.app.Localize.get('Correction') + ': ' + Ext.app.Localize.get('Correction of the payment amount');
			break;
			case 4:
				btnText = Ext.app.Localize.get('Cancel Payment');
				winTitle = Ext.app.Localize.get('Correction') + ': ' + Ext.app.Localize.get('Cancelling payment');
			break;
			case 5:
				btnText = Ext.app.Localize.get('Correct Payment');
				winTitle = Ext.app.Localize.get('Correction') + ': ' + Ext.app.Localize.get('Recover Payment');
			break;
			default: return false;
		}
		feedWin = new Ext.Window({
				width:  450,
				height: wHeight ? wHeight : 480,
				layout: 'fit',
				title: winTitle,
				modal: true,
				labelAlign: 'top',
				items:[{
					xtype: 'form',
					formId: '_CorrectForm',
					bodyStyle: {padding: '10px'},
					monitorValid : true,
					items:[
						{ xtype: 'hidden', name: 'async_call',  value: 1 },
						{ xtype: 'hidden', name: 'devision',    value: 199 },
						{ xtype: 'hidden', name: 'correctType', value: correctType },
						{ xtype: 'hidden', name: 'recordid', 	value: input.get('recordid') },
						{ xtype: 'hidden', name: 'amount', value: input.get('amount') },
						{ xtype: 'hidden', name: 'orig_payment', value: input.get('orig_payment') },
						{ xtype: 'hidden', name: 'recipe', value: input.get('recipe') },
						{ xtype: 'hidden', name: 'agrmid', value: input.get('agrmid') },
						{ xtype: 'hidden', name: 'classid', value: input.get('classid') },
						{ xtype: 'hidden', name: 'currid', value: input.get('currid') },
						{ xtype: 'hidden', name: 'pay_date', value: input.get('date').format('Y-m-d H:i:s') },
						{ xtype: 'hidden', name: 'pay_agrmid', id: 'pay_agrmid', value: 0 },
						{ xtype: 'hidden', name: 'paymentordernumber', value: input.get('paymentordernumber') },
						{
							xtype:'fieldset',
							title: Ext.app.Localize.get('Payment details'),
							items:[
								{
									id: 'agrmIdName',
									xtype: 'displayfield',
									value: input.get('agrmid'),
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Agreement')
								},
								{
									xtype: 'displayfield',
									value: input.get('amount') + ' ' + input.get('symbol'),
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Sum')
								},
								{
									xtype: 'displayfield',
									value: input.get('date').format('d.m.Y H:i'),
									autoWidth: true,
									hidden: !Ext.isEmpty(input.get('date')) ? false : true,
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Payment date')
								},
								{
									xtype: 'displayfield',
									value: input.get('paymentordernumber'),
									autoWidth: true,
									hidden: !Ext.isEmpty(input.get('paymentordernumber')) ? false : true,
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Payment order number')
								},
								{
									xtype: 'displayfield',
									value: input.get('recipe'),
									autoWidth: true,
									hidden: !Ext.isEmpty(input.get('recipe')) ? false : true,
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Pay document number')
								},
								{
									xtype: 'displayfield',
									value: input.get('mgr'),
									hidden: !Ext.isEmpty(input.get('mgr')) ? false : true,
									autoWidth: true,
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Manager')
								},
								{
									xtype: 'displayfield',
									value: input.get('comment'),
									hidden: !Ext.isEmpty(input.get('comment')) ? false : true,
									autoWidth: true,
									style: 'font-weight:bold;',
									fieldLabel: Ext.app.Localize.get('Comment')
								}
							]
						},
						{
							xtype:'fieldset',
							title: Ext.app.Localize.get('Payment correction'),
							items:[
							{
								xtype: 'compositefield',
								id: 'compositeagrm',
								fieldLabel: Ext.app.Localize.get('Agreement number'),
								items: [
									{
										xtype: 'textfield',
										id: 'searchAgrmField',
										name: 'searchAgrmField',
										value: '',
										readOnly: true,
										allowBlank: (correctType == 1) ? false : true,
										elementStyle: 'font-weight: bold;color:black;'
									},
									{
										xtype: 'button',
										id: 'searchAgrmBtn',
										iconCls: 'ext-search',
										hideLabel: true,
										handler: function(){
											selectAgrm(null, null, 'searchAgrmField', 'pay_agrmid', '_CorrectForm', null, null, null, null, {
                                                not_in_agrm: input.get('agrmid')
                                            });
										}
									}
								],
								listeners: {
									render: function(){
										if (correctType != 1){
											Ext.getCmp('compositeagrm').getEl().up('.x-form-item').setDisplayed(false);
										}
									}
								}
							},
							{
								xtype: 'numberfield',
								id: 'pay_sumcorrected',
								name: 'pay_sumcorrected',
								fieldLabel: Ext.app.Localize.get('Corrected payment sum'),
								value: (correctType == 5) ? input.get('orig_payment') : input.get('amount'),
								readOnly: (correctType == 2 ? false : true),
								elementStyle: 'font-weight: bold;color:black;',
								allowBlank: false,
								maskRe: new RegExp("[0-9\.]"),
								formBind: true
							},
							//{
							//	xtype: 'datefield',
							//	autoWidth: true,
							//	id: 'pay_date',
							//	name: 'pay_date',
							//	allowBlank: false,
							//	readOnly: true,
							//	fieldLabel: Ext.app.Localize.get('Correction date'),
							//	format: 'Y-m-d',
							//	width: 200,
							//	value: input.get('date'), //new Date(),
							//	minValue: input.get('lock_period'),
							//	maskRe: new RegExp('[0-9\-]'),
							//	formBind: true,
							//	hidden: true
							//},
							{
								xtype:'textarea',
								id: 'pay_comment',
								name: 'pay_comment',
								height:65,
								width: 280,
								layout:'fit',
								fieldLabel: Ext.app.Localize.get('Comment'),
								enableKeyEvents: true,
								value: '',
								allowBlank: false
							}
							]
						}
					],
					buttons:[
						{
							text: btnText,
							formBind: true,
							iconCls: 'ext-save',
							id:'buttonOK',
							handler:function( v ){
								v.ownerCt.ownerCt.getForm().submit({
									url: 'config.php',
									method:'POST',
									scope: {
										form: this.ownerCt.ownerCt
									},
									waitTitle: Ext.app.Localize.get('Connecting'),
									waitMsg: Ext.app.Localize.get('Sending data') + '...',

									success: function(form, action){
										var data = eval(action.response.responseText);
										/**
										 * @TODO: Печать чека при корректировках
										 */
										// перезагрузка родительской таблицы
										Ext.getCmp('_userAgreementsList').store.reload();
										Ext.getCmp('_paymentsHistory').store.reload();
										Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
										feedWin.close();
									},
									failure: function(form, action){
										if(action.failureType == 'server') {
											var o = Ext.util.JSON.decode(action.response.responseText);
											Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.error.reason);
										}
										feedWin.close();
									}
								});
							}
						},
						{
							text: Ext.app.Localize.get('Cancel'),
							handler: function(){
								feedWin.close();
							}
						}
					]
				}]
		});
		var agrmStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
			reader: new Ext.data.JsonReader( {root: 'results'}, [ {name: 'number', type: 'string'} ] ),
			baseParams: {async_call: 1, devision: 7, getagrms: input.get('uid'), agrmid: input.get('agrmid')},
			autoLoad: true,
			listeners: {
				load: function(store){
					agrname = store.getAt(0);
					this.items.first().findById('agrmIdName').setValue(agrname.get('number'));
				}.createDelegate(feedWin)
			}
		});
	}
	return feedWin.show();

}

function correctHistory( input ){
	var feedWin;
	if(!feedWin){
		feedWin = new Ext.Window({
			layout: 'fit',
			width: 1000,
			title: Ext.app.Localize.get('Correction history'),
			buttonAlign: 'right',
			items:[{
				xtype: 'grid',
				id: '_correctHistory',
				layout: 'fit',
				height: 300,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
					reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [
						{ name: 'paydate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
						{ name: 'amount', type: 'float' },
						{ name: 'receipt', type: 'string' },
						{ name: 'mgr', type: 'string' },
						{ name: 'canceldate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
						{ name: 'comment', type: 'string' },
						{ name: 'fromagrmname', type: 'string' },
						{ name: 'fromagrmid', type: 'int' },
						{ name: 'revisions', type: 'int' },
						{ name: 'revno', type: 'int' },
						{ name: 'curagrmname', type: 'string' },
						{ name: 'amountcurr', type: 'float' },
						{ name: 'paymentordernumber', type: 'string' }

					]),
					baseParams:{ async_call: 1, devision: 199, getcorrected: 1, recordid: input.recordid },
					autoLoad: true
				}),
				autoExpandColumn: 'comment',
				cm: new Ext.grid.ColumnModel({
					columns: [
						{header: Ext.app.Localize.get('Correction date'), dataIndex: 'paydate', width: 125, renderer: function(value){try {return value.format('Y-m-d H:i:s')}catch(e){}return value;}},
						{header: Ext.app.Localize.get('Sum'), dataIndex: 'amount', width: 50 },
						{header: Ext.app.Localize.get('Pay document number'), dataIndex: 'receipt' },
						{header: Ext.app.Localize.get('Manager'), dataIndex: 'mgr' },
						{header: Ext.app.Localize.get('Cancel date'), dataIndex: 'canceldate', width: 125, renderer: function(value){try {return value.format('Y-m-d H:i:s')}catch(e){}return value;}},
						{header: Ext.app.Localize.get('Source Agreement'), dataIndex: 'fromagrmname', width: 120 },
						{header: Ext.app.Localize.get('Current Agreement'), dataIndex: 'curagrmname', width: 120 },
						{header: Ext.app.Localize.get('Payment order number'), dataIndex: 'paymentordernumber', width: 80 },
						{header: Ext.app.Localize.get('Comment'), dataIndex: 'comment', id: 'comment'}
					]
				}),
				viewConfig: {
					getRowClass: function(record, index) {
						return colorizeRowClass(record.get('revisions'), record.get('revno'), record.get('canceldate'), record.get('fromagrmid'));
					}
				}
			}],
			buttons:[{ text: Ext.app.Localize.get('Cancel'), handler: function(){ feedWin.close();}}]
		});
		Ext.getCmp('_correctHistory').store.load();
	}
  feedWin.show();
}


/**
 * Colorize function
 * @param revisions   # Итоговое число действий над платежом
 * @param revno       # Текущее состояние платежа
 * @param canceldate  # Дата отмены платежа
 * @param fromagrmid  # Переведен со счета №
 */
function colorizeRowClass(revisions, revno, canceldate, fromagrmid, bso){
	if (canceldate != null) // Аннулированный платеж
	{
		return 'x-type-payment-canceled';
	}
	else if (revisions > 0 && revno == 0 && canceldate == null) // Финальная версия корректировки
	{
		return 'x-type-payment-edited';
	}
	else if (revisions > 0 && revno != 0 && canceldate == null) // Корректированный платеж
	{
		return 'x-type-payment-corrected';
	}
	else if (fromagrmid > 0) //  Перевод средств с другого счета
	{
		return 'x-type-payment-transfer';
	}
	else if (bso > 0) // Оплата документа БСО
	{
		return 'x-type-payment-bso'
	}
	else
	{
		return '';
	}
}
