/* color attributes */
$j(document).on(
	click  :  function() {
				console.log(this);
				var tmpid = $j(this).closest('.color-plp').attr('id');
			   	$j("#attribute"+tmpid).val($j(this).attr("id"));
				$j("#attribute"+tmpid).trigger("onchange"); 
	}},'.links-nav');

/* on change select attributes */
var updateconfigproduct=function(url,id){
	$j.ajax(url,{
		type: "GET",  
		success: function(data, textStatus, jqXHR){
				$j('#prd'+id).parent().replaceWith(data);
				jQuery("#image-"+id).ScaleRatio({
					'parentContainer'	: 	'product-image'
				});
			},
		error: function(jqXHR, textStatus, errorThrown)
		{
			alert("The request was not completed successfuly.");
		}	 
	});
}
/*** get the selected attributes ***/
var SelectedAttr=function(id){
	var str="";
	$j('div#conf-attributes'+id+' select').each(function(){
		var selectname=$j(this).attr('name');
		var selectid=$j(this).attr('id');
		var selected=$j('div#conf-attributes'+id+' select#' + selectid + ' option:selected').html();
		var selectedval=$j('div#conf-attributes'+id+' select#' + selectid).val();	
		if (selectedval){	
		 str=str+"/"+selectname+"/"+selected;
		}
	});
	str=str.substring(1);
	return str;
}

/*** filter navigation - input=check type and multiple select ***/
//to be removed
var selectedFilterOptions=function(obj){
	//Filter/+Warranty/No/Filter/+Warranty/Yes/

	var str="";
	if (obj.tagName=='INPUT'){
		jQuery(obj).each(function(){
			if (jQuery(this).is(":checked")){
				 str=str+"Filter/"+jQuery(this).attr('name')+"/"+jQuery(this).val()+"/";
			}
		});
	}else if (obj.tagName=='SELECT'){
		var selectname=jQuery(obj).attr('name');
		jQuery(obj).find('option').each(function(){ 
			if(jQuery(this).is(':selected'))
				str+="Filter/+"+selectname+"/"+jQuery(this).val()+"/";
		});
	}
	return str;
}

/* A jQuery class for ProductArrributes */

jQuery.fn.extend({
	conf 		: 	{
						product_id 				: '',
						ajax_url 				: '',
						product_url 			: '',
						attribute_class 		: '',
						callback 				: {
											afterAttributeSelect : function() {}
										},
					},
	elem 		: Object,
	params 		: '',
	initProductAttributes : function(_conf){
		return jQuery(this).each(jQuery.proxy(function(e){ 
			this.conf = jQuery.extend(this.conf,_conf);
			console.log(this.conf);
			this.elem = e.target;
			this.parseAttributes();
		},this));
		
	},
	selectAttribute : function(){
		console.log('select attr');
		this.parseAttributes();
		var update_url 				= IncraWindow.formatUrl(this.conf.product_url);
		var update_url_with_params 	= IncraWindow.formatUrl(this.conf.product_url)+"-S"+IncraWindow.formatUrl(this.params);
		var updater = IncraAjaxUpdater;
		updater.submitAjax(this.conf.ajax_url,update_url,update_url_with_params,'');
		this.conf.callback.afterAttributeSelect;

		//selectaction(this.conf.ajax_url,this.conf.product_url,this.params);
	},
	parseAttributes : function(){
		var attr_values = Array();
		jQuery("."+this.conf.attribute_class).each(function(){
			if(this.value){
				console.log(this);
				attr_values.push(this.getAttribute('name'));
				attr_values.push(jQuery(this).children("option:selected").attr("admin"));
				
			}
		});
		if(attr_values.length)
			this.params = attr_values.join("/");
		else
			this.params = "";
		
	},
	getAjaxProductUrlWithParams 	: 	function(){
		return this.conf.product_url + "/" + this.params;
	}
});