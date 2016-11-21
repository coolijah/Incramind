jQuery.fn.extend({
	substring 	: 	function(conf){
		var _conf = {
						max_char : 100,
					};
		_conf = jQuery.extend(_conf,conf);
		var max_char = _conf.max_char;
		var new_value = "";
		var elipsis = "...";
		return this.each(function(){
			var value = this.innerHTML;
			if(value.length > max_char)
				new_value = value.substr(0,max_char) + elipsis;
			else
				new_value = value;

			this.innerHTML = new_value;
		});
	}
});
jQuery(document).ready(function(){

	/*****pop-up*****/

	jQuery(document).on({
		mouseover	: 	function(event) {
									if (event.type == 'mouseover') {
										jQuery(this).children('.incra-dropdown-menu').css('display','block');
									} else {
										jQuery(this).children('.incra-dropdown-menu').css('display','none');
									}
							},
		mouseout 	: 	function(event) {
									if (event.type == 'mouseover') {
										jQuery(this).children('.incra-dropdown-menu').css('display','block');
									} else {
										jQuery(this).children('.incra-dropdown-menu').css('display','none');
									}
							}

	},'ul#toplinks li');

})

/* set password */
 var setPasswordForm=function(arg){
        if (arg){
            jQuery('#change-password').show();
            jQuery('#current_password').addClass('required');
            jQuery('#password').addClass('required');
            jQuery('#confirmation').addClass('required');

        }else{	
            jQuery('#change-password').hide();
            jQuery('#current_password').removeClass('required');
            jQuery('#password').removeClass('required');
            jQuery('#confirmation').removeClass('required');
        }
 }
 
 /* validate form check required fields */
 var INCRAFORM = {
 	validateFormFields	:	function(form_id){
 		var fields = jQuery("#"+form_id+" .input-text.required:not(:disabled)");
 		fields.each(function(){
 			if(jQuery(this).val() == "" ){
 				jQuery("#advice-required-entry-"+jQuery(this).prop("id")).remove();
				jQuery(this).addClass("validation-failed");
 				var noticed = jQuery('<div class="validation-advice" id="advice-required-entry-'+jQuery(this).prop("id")+'" style="display:none">');
 				noticed.html('This is a required field.');
 				noticed.insertAfter(jQuery(this));
 			}else{
 				jQuery(this).removeClass("validation-failed");
 				jQuery("#advice-required-entry-"+jQuery(this).prop("id")).remove();
 			}
	 		
 		});
 		jQuery(".validation-advice").fadeIn(1000);
 		if(jQuery("#"+form_id+" .validation-advice").length == 0)
 			return true;
 		else
 			return false;
 	},
 	
 }
