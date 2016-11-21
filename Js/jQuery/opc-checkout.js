(function($) {
	$.Class("OnePageCheckOut",
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
			loading_block 		: 	"one-page-checkout-loading",
			waiting				:	false,
			steps				:	['login', 'billing', 'shipping', 'shipping_method', 'payment', 'review'],
			current_step		:	"login",
			
			
			config	:			{
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
    								if(data.length){
	    								data.each(function(el){
	    									var updater = IncraAjaxUpdater;
	    									updater.updateElementContent(el);
	    								});
	    							}
    					},
			loading 	:		function(step){
										this.wait = true;
										jQuery("#"+step+"-please-wait").css('display','block');
								},
			doneLoading : 		function(step){
									jQuery("#"+step+"-please-wait").css('display','none');
									this.wait = false;
									jQuery('.notification-container .messages').delay(4800).fadeOut(1600,"linear");
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
							console.log(step);
							switch(step){
								case 'login' 			:  {
																jQuery('#opc-login').addClass('active');
																jQuery('#opc-login .content').addClass('open');															
															}break;
								case 'billing' 			:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow");
																jQuery('#opc-billing').addClass('active'); 
																jQuery('#opc-billing .content').addClass('open');
															}break;
								case 'shipping' 		:  {
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery('#opc-shipping-info').addClass('active'); 
																jQuery('#opc-shipping-info .content').addClass('open');
															}break;
								case 'shipping_method' 	:  {
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow");
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-shipping-method").addClass("active");
																jQuery('#opc-shipping-method .content').addClass('open');
															}break;
								case 'payment' 			:  {
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-payment-method").addClass("active");
																jQuery('#opc-payment-method .content').addClass('open');
															}break;
								case 'review' 			:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-payment-method").addClass("allow");
																jQuery('#opc-review ').addClass('active');
																jQuery('#opc-review .content').addClass('open');
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
								console.log(me.method_url);
								jQuery.ajax({
									url 	:	me.method_url,
									method  : "POST",
									data 	:	{
													method : "register"
												},
									success : function(responseText){
												jQuery('#register-customer-password').css('display','block');
												me.gotoSection('billing');
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
												var data = eval(responseText);
												console.log(data);
												if(data.postalrequired == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").addClass("required");
													console.log(jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em'));
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em').html('*');

												}else if(data.postalrequired == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").removeClass("required");
													console.log(jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em'));
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").prev().find('em').html('');
												}

												if(data.showaddress2 == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=street2]").parent().css("display","inline-block");
												}else if(data.showaddress2 == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=street2]").parent().css("display","none");
												}

												if(data.showhousenumberext == "Yes"){
													if(data.showhousenumberseparate == "Yes"){
														jQuery("#opc-"+checkout.current_step+" input[name=house_number]").parent().css("display","inline-block");
														jQuery("#opc-"+checkout.current_step+" input[name=house_number_ext]").parent().css("display","inline-block");	
													}else if(data.showhousenumberseparate == "No"){
														jQuery("#opc-"+checkout.current_step+" input[name=house_number_ext]").parent().css("display","inline-block");	
													}
												}else if(data.showhousenumberext == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=house_number]").parent().css("display","none");
													jQuery("#opc-"+checkout.current_step+" input[name=house_number_ext]").parent().css("display","none");
												}

												if(data.showhousenumberseparate == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=house_number_sep]").parent().css("display","inline-block");
												}else if(data.showhousenumberseparate == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=house_number_sep]").parent().css("display","none");
												}
												if(data.showpostal == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","inline-block");
												}else if(data.showpostal == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
												}

												/*
												if(data.showpostalbeforeplace == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","block");
												}else if(data.showpostalbeforeplace == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
												}
												*/

												if(data.showregion == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=region_id]").parent().css("display","block");
												}else if(data.showregion == "No"){
													jQuery("#opc-"+checkout.current_step+" input[name=region_id]").parent().css("display","none");
												}

												if(data.showtitle == "Yes"){
													jQuery("#opc-"+checkout.current_step+" input[name=name_title]").parent().css("display","block");
												}else if(data.showtitle == "No"){
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
		}
	)
})(jQuery);

//BILLING CLASS
(function($) {
	$.Class("Billing",
		{
		},
		{
			billing_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			form_id         :   "",
			init 			:	function(form, addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.form_id=form;
									this.billing_form = jQuery("#"+form);
								},
			save 	:	function(){
							//INCRAFORM.validateFormFields(); return;
							//if(!INCRAFORM.validateFormFields()) return;
									if(checkout.waiting) return;
									var thisurl = "";
									
									if(checkout.checkout_method == "guest" || checkout.checkout_method == "register"){
										thisurl= this.save_url;
									}else{
										if(jQuery("#billing-address-select").val() == "new" ){
											if(!INCRAFORM.validateFormFields(this.form_id)) return;
											thisurl= this.save_url;
										}else{
											thisurl= this.address_url;
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
				if (isNew=="new") {
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
	$.Class("Shipping",
		{
		},
		{
			shipping_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			form_id			:   "",
			init 			:	function(form, selectaAddressUrl,addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.shipping_form = jQuery("#"+form);
									this.form_id=form;
									this.selectaAddressUrl=selectaAddressUrl;
								},
			newAddress		:	function(isNew){
							jQuery("#shipping_same_as_billing").removeAttr('checked');
							if (isNew=="new") {
							    this.resetSelectedAddress();
							    jQuery('#shipping-new-address-form').css('display','block');
							    jQuery("#shipping_address_id").val('0');
							    jQuery("#shipping-address-select").val("new");
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

									if(checkout.checkout_method == "guest" || checkout.checkout_method == "register"){
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
									this.save();
								},
			save				:	function(){
			
									if(checkout.waiting) return;
									
									var thisurl;
									console.log(checkout.checkout_method);
									if(checkout.checkout_method == "guest" || checkout.checkout_method == "register"){
										thisurl= this.save_url;
									}else{
										if(jQuery("#shipping-address-select").val()=="new"){
											if(!INCRAFORM.validateFormFields(this.form_id)) return;
											thisurl= this.save_url;
										}else{
											thisurl= this.selectaAddressUrl;
										}
									}
									console.log(thisurl);
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
	$.Class("ShippingMethod",
		{
		},
		{
			form_id	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									//this.shipping_form = jQuery("#"+form);
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
									if(!INCRAFORM.validateFormFields(this.form_id)) return;
									checkout.loading('shipping_method');

									jQuery.ajax({
										url		:	this.save_url,
										type 	:	"POST",
										data	: 	jQuery('#'+this.form_id).serialize(),
										success 	:	function(responseText){
														checkout.updateProgressBlock(responseText);
														checkout.doneLoading('shipping_method');
														checkout.gotoSection('payment');
													},
										error:function(error){console.log(error.responseText);}
									});
								}
						},
			
		}
	)
})(jQuery);

//PAYMENTMETHOD CLASS
(function($) {
	$.Class("Payment",
		{
		},
		{
			form_id	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									//this.payment_form = jQuery("#"+form);
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
				/*var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});*/
				if (jQuery('#co-payment-form :radio[name=method]:checked').length){
					return true;
				}else{
					alert('Please specify payment method.');
					return false;
				}
			},
			save 	:	function(){
									if(checkout.waiting) return;
									
									if (this.validate()) {
										if(!INCRAFORM.validateFormFields(this.form_id)) return;
										checkout.loading('payment');
										jQuery.ajax({
											url		:	this.save_url,
											type 	:	"POST",
											data	: 	jQuery('#'+this.form_id).serialize(),
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
	$.Class("Review",
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