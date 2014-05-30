function rentsoftAgreementsList(urls) {
	var me = this;
	this.urls = urls;
	this.dropDownList = $('#rentsoftAgreementsList');
	this.dropDownList.change(function(){
		window.location = me.urls[me.dropDownList[0].value];
	});
}