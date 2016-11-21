(function($) {
	$.Class("ExpressCheckout",
		{
		},
		{
			config 					: 	{
											country_config_url 	: 	""
										},
			wait 					: 	false,
			
			init 					: 	function(_config){
											jQuery.extend(this.config,_config);
										},
			loadingProgress 		: 	function(){
											this.wait = true;
											jQuery(".loading-progress").show();
										},
			doneProgress 			: 	function(){
											this.wait = false;
											jQuery(".loading-progress").hide();
										},
			updateCheckoutDetails 	: 	function(responseText){										
											var data = JSON.parse(responseText);
    										this.loadingProgress();
    										var updater = IncraAjaxUpdater;
    										//if(responseText){
    											updater.changeContent(responseText);
    										//}
    										/*	
		    								data.each(function(el){
		    									var updater = IncraAjaxUpdater;
		    									updater.updateContent(el);
		    								});
											*/
		    								this.doneProgress();
										},
			setCountryConfig 		: 	function(country_id,altered_object_id){
											/*var country_config_url = this.config.country_config_url;
											var obj = jQuery("#"+altered_object_id);
											jQuery.ajax({
												url : country_config_url,
												success : function(responseText){

												}
											});*/
										},
			selectBilling 			: 	function(billing_address_id){
											var thisurl = "";
											var me = this;
											if(me.waiting) return;

											if(jQuery("#billing-address-select option:selected").val()!="new"){
												thisurl= billing.address_url;
											}else{
												thisurl= billing.save_url;
											}
											
											me.loadingProgress();
											jQuery.ajax({
												url			:	thisurl,
												type 		:	"POST",
												data		: 	{'billing_address_id':billing_address_id},
												success 	:	function(responseText){
																	if(responseText){
																		me.updateCheckoutDetails(responseText);
																	}
																	me.doneProgress();
																}
											});
										},
			saveBilling 			: 	function(){
											var thisurl = "";
											var me = this;
											var _data = "";
											if(me.waiting) return;

											if(jQuery("#billing-address-select option:selected").val()!="new"){
												thisurl= billing.address_url;
												_data = 'billing_address_id='+jQuery("#billing-address-select").val();
											}else{
												thisurl= billing.save_url;
												_data = billing.billing_form.serialize();
											}
											me.loadingProgress();
											jQuery.ajax({
												url			:	thisurl,
												type 		:	"POST",
												data		: 	_data,
												success 	:	function(responseText){
																	if(responseText){
																		me.updateCheckoutDetails(responseText);
																	}
																	me.doneProgress();
																}
											});
										},
			saveShippingAddress			: 	function(){
											var thisurl = "";
											var me = this;
											if(me.waiting) return;

											if(jQuery("#shipping-address-select option:selected").val()){
												thisurl= shipping.address_url;
											}else{
												thisurl= shipping.save_url;
											}
											
											me.loadingProgress();
											jQuery.ajax({
												url			:	thisurl,
												type 		:	"POST",
												data		: 	shipping.shipping_form.serialize(),
												success 	:	function(responseText){
																	if(responseText){
																		me.updateCheckoutDetails(responseText);
																	}
																	me.doneProgress();
																}
											});
										},
			saveShippingMethod		: 	function(){
											var thisurl = "";
											var me = this;
											if(me.waiting) return;
											thisurl = shippingMethod.save_url;
											jQuery.ajax({
												url		:	thisurl,
												type 	:	"GET",
												data	: 	shippingMethod.shipping_form.serialize(),
												success 	:	function(responseText){
																	if(responseText){
																		me.updateCheckoutDetails(responseText);
																	}
																	me.showExtrInfo('shipping_method','');
																	me.doneProgress();
															}
											});
										},
			savePaymentMethod		: 	function(){
											var thisurl = "";
											var me = this;
											if(me.waiting) return;
											thisurl = payment.save_url;
											jQuery.ajax({
												url		:	thisurl,
												type 	:	"POST",
												data	: 	payment.payment_form.serialize(),
												success 	:	function(responseText){
																	if(responseText){
																		me.updateCheckoutDetails(responseText);
																	}
																	me.doneProgress();
																	me.showExtrInfo('payment_method','');
															}
											});
										},
			saveConfirmation 		: 	function(){
											var terms_to_check = jQuery(".agree-terms-and-conditions").length;
											var terms_checked = jQuery(".agree-terms-and-conditions:checked").length;
											var me = this;
											if(terms_to_check == terms_checked){
												jQuery.ajax({
													url			:	review.save_url,
													type 		:	"POST",
													data		: 	{'confirmation':'yes'},
													success 	:	function(response){
																		if(responseText){
																			me.updateCheckoutDetails(responseText);
																		}
																		me.doneProgress();
																}
												});
												jQuery("#review_form").submit();
											}else{
												alert('Please check terms and condition.');
												return false;
											}
										},
			showExtrInfo			: 	function (method,code){
											
											if(method == 'shipping_method'){
												jQuery(".shipping-additional-info").each(function(){
													jQuery(this).addClass("hide");
												});
											}
											else{
												jQuery(".payment-additional-info").each(function(){
													jQuery(this).addClass("hide");
												});
											}
											jQuery("#"+code+"-extra-info").removeClass("hide");
										},
			verifyDiscountCode 		: 	function(){},
			applyDiscountCode 		: 	function(){},
			calculateShipping 		: 	function(){}	
 		}
	)
})(jQuery);