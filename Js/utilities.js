/* updates via ajax, must pass a parameter in JSON format */
var IncraAjaxUpdater = {
		data 				: 	{},
		current_object: [],
		temp: 0,
		pos:0,
		callback : {
			afterAjaxSuccess : function() {}
		},
		updateElementContent 		: 	function(_data){
									var me = this;
									me.current_object = jQuery("body").children("div");
									_data.Location.each(function(index,i){
										if(i == _data.Location.length-1){
											me.current_object = me.getElement(index-1);
										}else{
											var temp = me.getElement(index-1);
											me.current_object = temp.children('div');
										}
									});
									if(me.current_object){
										me.current_object.html(_data.Content);
										me.current_object.find("script").each(function(i) {
						                    eval(jQuery(this).text());
						                });
									}
								},
		getElement 			: 	function(index){
									var temp = null;
									var search_index = index;
									var me = this;
									
									jQuery(me.current_object).each(function(index){	
										if(search_index == index){
											temp = jQuery(this);
											//return temp;
										}
									});
									return temp;
								},
		submitAjax		: 	function(base_url,update_url,update_url_with_params,_post_data,method){								
									var final_url = base_url + "/" + update_url + "/" + update_url_with_params;
									var me = this;
									var method = method || 'GET';
									var _post_data = _post_data || '';
									alert(final_url);
									IncraWindow.loadProgress();
									console.log(me.callback.afterAjaxSuccess);
									jQuery.ajax(final_url,{
										type: method,  
										dataType: "json",
										data 	: 	_post_data,
										success: function(responseText, textStatus, jqXHR){
													me.changeContent(responseText);
			    									IncraWindow.doneLoadProgress();
			    									jQuery('.notification-container .messages').delay(4800).fadeOut(1600,"linear");
			    									me.callback.afterAjaxSuccess();
			    									console.log(responseText);

											},
										error: function(jqXHR, textStatus, errorThrown)
										{
											//alert(errorThrown);
											IncraWindow.doneLoadProgress();
											//alert("The request was not completed successfuly.");
											//success = false;
										}
									});
								},
		updateAjax		: 	function(base_url,update_url,update_url_with_params,_post_data,method){							
									var final_url = base_url + "/" + update_url + "/" + update_url_with_params;
									var me = this;
									var method = method || 'GET';
									var _post_data = _post_data || '';
									var success_flag = false;
									alert(final_url);
									IncraWindow.loadProgress();
									
									jQuery.ajax(final_url,{	
										type: method,  
										dataType: "json",
										data 	: 	_post_data,
										async 	: false,
										success: function(responseText, textStatus, jqXHR){
			    									IncraWindow.doneLoadProgress();
			    									success_flag =  true;
											},
										error: function(jqXHR, textStatus, errorThrown)
										{
											IncraWindow.doneLoadProgress();
											alert("The request was not completed successfuly.");
											//success = false;
											success_flag = false;
										}
									});
									return success_flag;
								},
		submitOnly 				: function(base_url,update_url,update_url_with_params,_post_data,method,redirect_url){
										var final_url = base_url + "/" + update_url + "/" + update_url_with_params;
										var me = this;
										var method = method || 'GET';
										var _post_data = _post_data || '';
										alert(final_url);
										IncraWindow.loadProgress();
										
										jQuery.ajax(final_url,{	
											type: method,
											data 	: 	_post_data,
											success: function(responseText, textStatus, jqXHR){
														//me.changeContent(responseText);
				    									IncraWindow.doneLoadProgress();
				    									IncraWindow.setLocation(redirect_url);
												},
											error: function(jqXHR, textStatus, errorThrown)
											{
												IncraWindow.doneLoadProgress();
												alert("The request was not completed successfuly.");
												//success = false;
											}
										});
								},
		changeContent : function(data) {
			var prev_obj;

			$j(data).each(function(index){
				var location= data[index].Location;
				current_object = $j("body");
				var current_el;
				
				$j(location).each(function(i){
					var pos = location[i];
					prev_obj=current_object;
					ajaxUpdate.pos=pos;
					ajaxUpdate.temp=0;
					temp = current_object;
					if (typeof current_object != 'undefined') {
						try{
							if(current_object.children()){
								current_object.children().each(function(){
									if (jQuery(this).is('div')){
										ajaxUpdate.temp=ajaxUpdate.temp+1;
										
										if (ajaxUpdate.temp==ajaxUpdate.pos){
											current_object=jQuery(this);
										}
									}else{
										if (ajaxUpdate.getChildren(jQuery(this))){
											current_object=jQuery(ajaxUpdate.getChildren(jQuery(this)));
											ajaxUpdate.current_object=[]; // reset
											return false;
										}
									}
								});
							}
						}catch(ex){
							console.log(ex.error);
							return false;
						}
					}
				});
				$j(current_object).html(data[index].Content);
				$j(current_object).find("script").each(function(i) {
                    eval(jQuery(this).text());
                });
			});
		},
		getChildren	:	function(elem){
			var found=false;
			if (elem.children().size()){
				elem.children().each(function(){
					if (jQuery(this).is('div')){
						ajaxUpdate.temp=ajaxUpdate.temp+1;
						//console.log(ajaxUpdate.temp+"=="+ajaxUpdate.pos);
						if (ajaxUpdate.temp==ajaxUpdate.pos){
							found=true;
							//console.log(jQuery(this));
							ajaxUpdate.current_object.push(this);
							return false;
						}
					}else{
						ajaxUpdate.getChildren(jQuery(this));
					}
					if(found) { return false};
				})
				if (ajaxUpdate.current_object.length)
					return ajaxUpdate.current_object;
				else
					return false;
			}
		}
	}

var IncraOption = {
		reloadPrice	: function(config){
			IncraAjaxUpdater.submitAjax(config.update_url,IncraWindow.formatUrl(config.page_url),IncraWindow.formatUrl(config.update_with_params),config.post_data,'POST');
		}
}

var IncraWindow = {
		setLocation 		: 	function(url){
									window.location.href = url;
								},
		popupWindow 		: 	function(url,win,para){
									var win = window.open(url,win,para);
									win.focus();
								},
		submit 				: 	function(){

								},
		submitAndRedirect 	: 	function(url,url2,param,redirect_url){

								},
		loadProgress 		: 	function(){
									jQuery("body").append('<div id="loading"></div>');
								},
		doneLoadProgress 		: 	function(){
									jQuery("#loading").remove();
								},						
		formatUrl 			: 	function(str){
									//str = str.replace(/-/g,"--");
									var url="";
									for (var x = 0; x < str.length; x++)
									{
									    var c = str.charAt(x);
										switch (c) {

											case "/": 
												 c='-S';
												 if (x!=str.length-1)
												 	url=url + c;
												 break;
											case "-": c='-_'; url=url + c;  break;
											case "?": c='-Q';  url=url + c;  break;
											case ":": c='-C';  url=url + c;  break;
											case "&": c='-A'; url=url + c;  break;
											case "\\": c='-B'; url=url + c;  break;
											case "+": c='-P'; url=url + c;  break;

											default: url=url +c;  break;
										}
									}
									return url;
								},

}

/* Object used on ShoppingCart utilities functions */
var IncraShoppingCart = {

		addToCart 		: 	function(config){
				
				var url_new=IncraWindow.formatUrl(config.second_url)+"/"+config.flag+"/"+config.id;
				
				IncraAjaxUpdater.submitOnly(
												config.submit_url,
												url_new,
												'',
												config.post_data,
												'POST',
												config.cart_url,
												'POST'
											);
		},
		ajaxAddToCart 	: 	function(config){
				console.log('add to cart via ajax');
				var url_new = IncraWindow.formatUrl(config.second_url)+"/"+config.flag+"/"+config.id;
				IncraAjaxUpdater.submitAjax(
												config.submit_url,
												url_new,
												'',
												config.post_data,
												'POST'
											);
				//console.log(config);
		},
		ajaxAddToCartOnly 	: 	function(config){
				console.log('add to cart via ajax');
				var url_new = IncraWindow.formatUrl(config.second_url)+"/"+config.flag+"/"+config.id;
				var x = IncraAjaxUpdater.updateAjax(
												config.submit_url,
												url_new,
												'',
												config.post_data,
												'POST'
											);
				//console.log(config);
				return x;
		},
}
var IncraFilterNavigation = {

	removeFilter: function(config){
			IncraAjaxUpdater.submitAjax(config.update_url,IncraWindow.formatUrl(config.filter_url),IncraWindow.formatUrl(config.params),'');
	},
	submitFilter : function(config){ 
		
		element=jQuery(event.target).prop('tagName');
		if (config.ismultiple){
			filterstring=config.params;
		}else{
			if (config.isselected)
				filterstring='Filter/-'+config.params;
			else{
				// with '+', filter is or, remove + to filter only based on the current selection
				if (element=='SELECT' || (element=='INPUT' &&  jQuery(event.target).attr('type')=='radio'))
					filterstring='Filter/'+config.params; 
				else
					filterstring='Filter/+'+config.params; 
			}
		}
		var url_with_params = IncraWindow.formatUrl(config.filter_url+"/"+filterstring);
		IncraAjaxUpdater.submitAjax(config.update_url,IncraWindow.formatUrl(config.filter_url),url_with_params,'','');
	},
	parseMultipleSelOptions :function(obj){
		var str="";
		var selectname=obj.attr('name');
		obj.find('option').each(function(){ 
			if(jQuery(this).is(':selected'))
				str+="Filter/+"+selectname+"/"+jQuery(this).val()+"/";
		});
		return str;
	}

}


var ajaxUpdate = function() {
	return {
		current_object: [],
		temp: 0,
		pos:0,
		changeContent : function(data) {
			var prev_obj;
			$j(data).each(function(index){
				var location= data[index].Location;
				current_object = $j("body");
				var current_el;
				
				$j(location).each(function(i){
					var pos = location[i];
					prev_obj=current_object;
					ajaxUpdate.pos=pos;
					ajaxUpdate.temp=0;
					if (typeof current_object != 'undefined' &&  current_object.children().size()) {
						current_object.children().each(function(){
							if (jQuery(this).is('div')){
								ajaxUpdate.temp=ajaxUpdate.temp+1;
								
								if (ajaxUpdate.temp==ajaxUpdate.pos){
									current_object=jQuery(this);
								}
							}else{
								if (ajaxUpdate.getChildren(jQuery(this))){
									current_object=jQuery(ajaxUpdate.getChildren(jQuery(this)));
									ajaxUpdate.current_object=[]; // reset
									return false;
								}
							}
						})
					}
				});
				
				$j(current_object).html(data[index].Content);
			});
		},

		getChildren	:	function(elem){
			var found=false;
			if (elem.children().size()){
				elem.children().each(function(){
					if (jQuery(this).is('div')){
						ajaxUpdate.temp=ajaxUpdate.temp+1;
				
						if (ajaxUpdate.temp==ajaxUpdate.pos){
							found=true;
				
							ajaxUpdate.current_object.push(this);
							return false;
						}
					}else{
						ajaxUpdate.getChildren(jQuery(this));
					}
					if(found) { return false};
				})
				if (ajaxUpdate.current_object.length)
					return ajaxUpdate.current_object;
				else
					return false;
			}
				
			
		}
	}
}();

(function($) {
	$.Class("INCRA_COUNTRY_CONFIG",
		{
		},
		{
			country_config_url		:	"",
			all_countries           : 	[],
			init 			:	function(url){
									this.country_config_url = url;
									this.getAllCountry();
			},
			getAllCountry 	: 	function(){
									var url = this.country_config_url;
									var me = this;
									var result = [];
										jQuery.ajax(url,{
											type: "GET",
											success: function(responseText){
												//me.all_countries = eval(responseText);
												me.all_countries = [{"country_id":15,"country_name":"Austria","states":[{id : 1,'state_name':'111'},{id : 2,'state_name':'222'}],}];
											}
										});
			},
			getRegion : function(country_id){
									var country_state = null;

									if(this.all_countries.length){
										this.all_countries.each(function(data){
											if (data['country_id']==country_id){
												country_state = data.states;
												/*if(data.states){
													data['states'].each(function(states){
														country_state = {
															id : states.state_id,
															state_name : states.state_name
														};
													});
												}*/
											}
										});
									}
									return country_state;
			},
			populateToCombo 	: 	function(country_id,cbo){
				var state = this.getRegion(country_id);
				var cboObject = jQuery("#"+cbo);
				cboObject.html('');
				if(state != null){
					cboObject.append('<option value="">Please select state</option>');
					state.each(function(data){
						cboObject.append('<option value="'+data.id+'">'+data.state_name+'</option>');
					});
				}
			},
		}
	)
})(jQuery);

var INCRA_MODAL= {
	show 	: 	function(url){
				//var modal = document.getElementById(modal_id);
				IncraReserve.show(url);
				//modal.style.display = "block";			
	},
	close 	: 	function(modal_id){
				var modal = document.getElementById(modal_id);
				modal.remove();
	} 
}

var IncraReserve =	{
	show	: function (url){
		jQuery.ajax(url,{	
			type: "GET",  
			dataType: "html",
			success: function(data, textStatus, jqXHR){
				jQuery('.main-section').append('<div class="reserve-pop-up">'+data+'</div>');
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");

			}
		});
	},
	submit : function(url, post_data,method){
		jQuery.ajax(url,{	
			type    : method,  
			dataType: "html",
			data 	: post_data,
			async 	: false,
			success: function(data, textStatus, jqXHR){
				console.log(data);

				jQuery('.notification-container').html(data);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");

			}
		});
	}
	
}
