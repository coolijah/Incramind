(function($) {
	$.Class("OneStepCheckout",
		{
		},
		{
			checkout_method		:	"",
			method_url			:	"",
			register_url 		: 	"",
			shippng_url			:	"",
			billing_url			:	"",
			payment_url			:	"",
			order_url			:	"",
			error_url			:	"",
			country_config_url 	: 	'',
			loading_block 		: 	"one-step-checkout-loading",
			waiting				:	false,
			steps				:	['login', 'billing', 'shipping', 'shipping_method', 'payment', 'review'],
			current_step		:	"login",
			
			
			config	:	{
									load_waiting 	:	function (){},
									shipping_saved	:	function (){},
									billing_saved	:	function (){},
									payment_saved	:	function (){},
								},
			
			init	:	function(_config){
							//this.steps = "billing";
							jQuery.extend(this.config,_config);
						},
			ajaxFailure: function(){
        					location.href = this.failureUrl;
    					},
    		updateProgressBlock: function(responseText){
    								var data = JSON.parse(responseText);
    								data.each(function(el){
    									var updater = IncraAjaxUpdater;
    									console.log(el)
    									//updater.updateContent(el);
    								});
    					},
			loading 	:	function(step){
							this.wait = true;
							jQuery("#"+step+"-please-wait").css('display','block');
						},
			doneLoading : function(step){
							jQuery("#"+step+"-please-wait").css('display','none');
							this.wait = false;
							jQuery('.notification-container .messages').delay(2800).fadeOut(1600,"linear");

						},
			gotoSection : function(step){
							jQuery("#checkoutSteps .content").removeClass("open");
							jQuery("#checkoutSteps .checkout-block").removeClass("allow");
							
							/*jQuery("#opc-"+this.current_step + " .a-item").fadeOut(500,function(){
								jQuery("#opc-"+step ).addClass("open");
								jQuery("#opc-"+step + " .a-item").fadeIn();	
							});*/

							jQuery('.checkout-block').removeClass('active');
							jQuery('#checkout-step-login').css('display','none');
							jQuery('#checkout-step-billing').css('display','none');
							switch(step){
								case 'login' 			:  { 
																														
															}break;
								case 'billing' 			:  { 
																
															}break;
								case 'shipping' 		:  { 
																
															}break;
								case 'shipping_method' 	:  { 
																
															}break;
								case 'payment' 			:  { 
																
															}break;
								case 'review' 			:  { 
																
															}break;
							}
							this.current_step = step;
						},
						
			setMethod	: function(){
							if(jQuery("#login_guest:checked").val()){
								this.checkout_method = jQuery("#login_guest:checked").val();
								var me = this;
								jQuery.ajax({
									url 	:	me.method_url,
									method  : "POST",
									data 	:	{
													method : "guest"
												},
									success : function(){
													jQuery('#register-customer-password').css('display','none');
													me.gotoSection('billing');
												}
								});							
							}
							else if(jQuery("#login_register:checked").val()){
								this.checkout_method = jQuery("#login_register:checked").val();
								var me = this;
								jQuery.ajax({
									url 	:	this.method_url,
									method  : "POST",
									data 	:	{
													method : "register"
												},
									success : function(responseText){
												jQuery('#register-customer-password').css('display','block');
												IncraWindow.setLocation(me.register_url);
												//window.location.href = window.location.origin + "/Customer/AccountCreate";
												//me.gotoSection('billing');
											}
								});
							}
							else{
								alert('Please choose to register or to checkout as a guest');
    							return false;
							}
						},
			setBilling	: function(){
							if(jQuery("#billing_use_for_shipping_yes:checked").val()){
								shipping.syncWithBilling();
								jQuery('#opc-shipping-info').addClass('allow');
    							this.gotoSection('shipping_method');
    						}
							else if(jQuery("#billing_use_for_shipping_no:checked").val()){
								if(jQuery("#shipping-address-select").val()=="new"){
									shipping.newAddress("new");
	            					jQuery("#shipping-address-select").val("new");
	            				}
	            				jQuery('#shipping_same_as_billing').prop('checked', false);
								jQuery('#opc-shipping').addClass('allow');
            					this.gotoSection('shipping');
							}
						},
			setCountryConfig	:	function(obj){
							var value = jQuery(obj).val();
							var country_config = this.country_config_url;
							jQuery.ajax({
								url 	:	country_config+"/"+value,
								success :	function(responseText){
									var data = JSON.parse(responseText);

									if(data.PostalCodeRequired){
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").addClass("required");
										console.log(jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em'));
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em').html('*');
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").removeClass("required");
										console.log(jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em'));
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em').html('');
									}

									if(data.ShowAddressLine2){
										jQuery("#opc-"+checkout.current_step+" input[name=street2]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=street2]").parent().css("display","none");
									}

									if(data.ShowHouseNumberExtension){
										jQuery("#opc-"+checkout.current_step+" input[name=house_number_ext]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=house_number_ext]").parent().css("display","none");
									}

									if(data.ShowHouseNumberSeperate){
										jQuery("#opc-"+checkout.current_step+" input[name=house_number_sep]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=house_number_sep]").parent().css("display","none");
									}
									if(data.ShowPostalCode){
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","inline-block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
									}

									/*
									if(data.ShowPostalCodeBeforePlace){
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
									}
									*/

									if(data.ShowRegion){
										jQuery("#opc-"+checkout.current_step+" input[name=region_id]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=region_id]").parent().css("display","none");
									}

									if(data.ShowTitle){
										jQuery("#opc-"+checkout.current_step+" input[name=name_title]").parent().css("display","block");
									}else{
										jQuery("#opc-"+checkout.current_step+" input[name=name_title]").parent().css("display","none");
									}
									INCRACOUNTRYCONFIG.populateToCombo(value,checkout.current_step+'_province_id');

								}
							});
						},
			stepBack	: 		function(){
									var current_step_index = this.steps.indexOf(this.current_step);
									this.gotoSection(this.steps[--current_step_index]);
									console.log(this.current_step);
									console.log(current_step_index);
						},
			OneStepSave : function(){
				if(jQuery("#billing-address-select").val()){
					billing.save();	
				}
				if(jQuery("#shipping-address-select").val()){
					shipping.save();	
				}
				if (jQuery("#osc-shipping-method-form input[name=method]:checked").length){
					shipping_method.save();
				}
				if (jQuery("#osc-payment-form input[name=method]:checked").length){
					shipping_method.save();
				}
			}
		}
	)
})(jQuery);

//BILLING CLASS
(function($) {
	$.Class("OneStepBilling",
		{
		},
		{
			billing_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			init 			:	function(form, addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.billing_form = jQuery("#"+form);
								},
			save 	:	function(){
							//INCRAFORM.validateFormFields(); return;
							//if(!INCRAFORM.validateFormFields()) return;
									if(checkout.waiting) return;

									if (jQuery("#billing-address-select").val() == null) {
										alert('Please select billing address.');
										return false;
									}

									var thisurl = "";
									
									if(checkout.checkout_method == "guest"){
										thisurl= this.save_url;
									}else{
										if(jQuery("#billing-address-select").val()>0){
											thisurl= this.address_url;
										}else{
											
											thisurl= this.save_url;
										}
									}
									checkout.loading('billing');
									jQuery.ajax({
										url			:	thisurl,
										type 		:	"POST",
										data		: 	this.billing_form.serialize(),
										success 	:	function(responseText){
															checkout.updateProgressBlock(responseText);
															checkout.doneLoading('billing');
															checkout.setBilling();
														}
									});
								},
			newAddress: function(isNew){
				if (isNew=="") {
				    this.resetSelectedAddress();
				    jQuery('#billing-new-address-form').css('display','block');
				    jQuery("#billing_address_id").val('0');
				} else {
				    jQuery('#billing-new-address-form').css('display','none');
				    jQuery("#billing_address_id").val(jQuery("#billing-address-select").val());
				}
			},
			resetSelectedAddress: function(){
				var selectElement = jQuery('#billing-address-select');
					if (selectElement) {
				    	selectElement.val("new");
					}
			},
		}
	)
})(jQuery);

//SHIPPING CLASS
(function($) {
	$.Class("OneStepShipping",
		{
		},
		{
			shipping_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			init 			:	function(form, selectaAddressUrl,addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.shipping_form = jQuery("#"+form);
									this.selectaAddressUrl=selectaAddressUrl;
								},
			newAddress		:	function(isNew){
							jQuery("#shipping_same_as_billing").removeAttr('checked');
							if (isNew=="") {
							    this.resetSelectedAddress();
							    jQuery('#shipping-new-address-form').css('display','block');
							    jQuery("#shipping_address_id").val('0');
							    jQuery("#shipping-address-select").val("");
							} else {
							    jQuery('#shipping-new-address-form').css('display','none');
							    jQuery("#shipping_address_id").val(jQuery("#shipping-address-select").val());
							}
						},
			resetSelectedAddress: function(){
				var selectElement = jQuery('#shipping-address-select');
					if (selectElement) {
						selectElement.val('');
					}
			},
			setSameAsBilling: function(flag) {
									jQuery('shipping_same_as_billing').checked = flag;
									if(flag) {
										this.syncWithBilling();
									}else{
										shipping.newAddress('new');
									}
								},
			
			syncWithBilling		:	function(){
									console.log(jQuery('#billing-address-select').val());

									if(checkout.checkout_method == "guest"){
											jQuery("#shipping_firstname").val(jQuery("#billing_firstname").val());
											jQuery("#shipping_lastname").val(jQuery("#billing_lastname").val());
											jQuery("#shipping_company").val(jQuery("#billing_company").val());
											jQuery("#shipping_telephone").val(jQuery("#billing_telephone").val());
											jQuery("#shipping_address1").val(jQuery("#billing_address1").val());
											jQuery("#shipping_address2").val(jQuery("#billing_address2").val());
											jQuery("#shipping_postal_code").val(jQuery("#billing_postal_code").val());
											jQuery("#shipping_city").val(jQuery("#billing_city").val());
									}else{
										if(jQuery('#billing-address-select').val()=="new") {
											shipping.newAddress('new');

											jQuery("#shipping_firstname").val(jQuery("#billing_firstname").val());
											jQuery("#shipping_lastname").val(jQuery("#billing_lastname").val());
											jQuery("#shipping_company").val(jQuery("#billing_company").val());
											jQuery("#shipping_telephone").val(jQuery("#billing_telephone").val());
											jQuery("#shipping_address1").val(jQuery("#billing_address1").val());
											jQuery("#shipping_address2").val(jQuery("#billing_address2").val());
											jQuery("#shipping_postal_code").val(jQuery("#billing_postal_code").val());
											jQuery("#shipping_city").val(jQuery("#billing_city").val());
											
										}else {
											jQuery('#shipping-address-select').val(jQuery('#billing-address-select').val());
											jQuery("#shipping_address_id").val(jQuery('#billing-address-select').val());
											jQuery('#shipping-new-address-form').css('display','none');
										}
									}
									//this.save();
								},
			save				:	function(){
			
									if(checkout.waiting) return;
									
									if (jQuery("#shipping-address-select").val() == null) {
										alert('Please select billing address.');
										return false;
									}

									var thisurl;
									
									if(checkout.checkout_method == "guest"){
										thisurl= this.save_url;
									}else{
										if(jQuery("#shipping-address-select").val()){
											thisurl= this.selectaAddressUrl;
										}else{
											
											thisurl= this.save_url;
										}
									}
										if(jQuery("#shipping_same_as_billing").attr('checked')){
											jQuery("#billing_use_for_shipping_yes").attr('checked','checked');
											billing.save();
											console.log('billing save');
										}else{
											checkout.loading('shipping');
											jQuery.ajax({
												url			:	thisurl,
												type 		:	"POST",
												data		: 	this.shipping_form.serialize(),
												success 	:	function(responseText){
																	checkout.updateProgressBlock(responseText);
																	checkout.doneLoading('shipping');
																	checkout.gotoSection('shipping_method');
															}
											});
										}
								},
			
		}
	)
})(jQuery);

//SHIPPINGMETHOD CLASS
(function($) {
	$.Class("OneStepShippingMethod",
		{
		},
		{
			shipping_form	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									this.shipping_form = jQuery("#"+form);
									this.form_id=form;
								},
			newAddress		:	function(){
							
								},
			validate: function() {
				var methods = jQuery('#'+this.form_id+' :radio[name=method]');

				if (methods.length==0) {
					alert('Your order cannot be completed at this time as there is no shipping methods available for it. Please make necessary changes in your shipping address.');
					return false;
				}
				var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});
				if (checked){
					return true;
				}else{
					alert('Please specify shipping method.');
					return false;
				}
			},
			save 	:	function(){
								if(checkout.waiting) return;
								
								if (this.validate()) {
									
									checkout.loading('shipping-method');

									jQuery.ajax({
										url		:	this.save_url,
										type 	:	"POST",
										data	: 	this.shipping_form.serialize(),
										success 	:	function(responseText){
														checkout.updateProgressBlock(responseText);
														checkout.doneLoading('shipping-method');
														checkout.gotoSection('payment');
													}
									});
								}
						},
			
		}
	)
})(jQuery);

//PAYMENTMETHOD CLASS
(function($) {
	$.Class("OneStepPayment",
		{
		},
		{
			payment_form	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									this.payment_form = jQuery("#"+form);
									this.form_id=form;
								},
			newAddress		:	function(){
							
								},
			validate: function() {
				var methods = jQuery('#'+this.form_id+' :radio[name=method]');

				if (methods.length==0) {
					alert('Your order cannot be completed at this time as there is no payment methods available for it.');
					return false;
				}
				var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});
				if (jQuery("#osc-payment-form input[name=method]:checked").length){
					return true;
				}else{
					alert('Please specify payment method.');
					return false;
				}
			},
			save 	:	function(){
									if(checkout.waiting) return;
									if (this.validate()) {
										checkout.loading('payment');
										jQuery.ajax({
											url		:	this.save_url,
											type 	:	"POST",
											data	: 	this.payment_form.serialize(),
											success 	:	function(responseText){
															checkout.updateProgressBlock(responseText);
															checkout.doneLoading('payment');
															checkout.gotoSection('review');
														}
										});
									}
								},
		}
	)
})(jQuery);

//REVIEW CLASS
(function($) {
	$.Class("OneStepReview",
		{
		},
		{
			agreements_form	:	"",
			save_url 		:	"",
			success_url		:	"",
			init 			:	function(saveUrl, successUrl,agreementsForm){
									this.save_url = saveUrl;
									this.success_url = successUrl;
									this.agreements_form = jQuery("#"+agreementsForm);
								},
			newAddress		:	function(){
							
								},
			save 	:	function(){
									var terms_to_check = jQuery(".agree-terms-and-conditions").length;
									var terms_checked = jQuery(".agree-terms-and-conditions:checked").length;
									console.log(terms_to_check);
									console.log(terms_checked);
									if(terms_to_check != terms_checked){
										alert('Please check terms and condition.');
										return false;
									}else{
										console.log('submit form');
										jQuery("#exp-review-form").submit();
									}
									/*
									jQuery.ajax({
										url			:	this.save_url,
										type 		:	"POST",
										data		: 	{'confirmation':'yes'},
										success 	:	function(response){
															jQuery("#review_form").submit();
													}
									});
									*/
									
								},
			
		}
	)
})(jQuery);