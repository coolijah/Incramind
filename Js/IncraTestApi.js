(function( jQuery ) {
	jQuery.Class("IncraTestApi",
		{
		
		},
		{
			applicable_id:"",
			temp_array: [],
			init : function(){
				
			},
			processUrl: 	function(api_url,type,command){
				var temp_url= api_url;
				if (type=="html"){
					api_url=temp_url+command;
				}
				jQuery.ajax(api_url,{	
					type: "GET", 
					async: false,
					dataType: (type =="html") ? "html" : "json",
					success: jQuery.proxy(function(data, textStatus, jqXHR){
						var html_data ={
								Call: api_url,
								Error : (type =="html") ? "NA": data.Error,
								Result :  (type =="html") ? data : data.Result,
								ApplicableId : (type =="html") ? "NA": data.ApplicableId
							}
						data=html_data;
						this.temp_array.push(data);
						if (!type || type=='json'){
							this.applicable_id=data['ApplicableId'];
						}
					},this),
					error: function(jqXHR, textStatus, errorThrown)
					{
					 console.log(jqXHR);
					}
				});
				
			
			},
			displayData : function(command, output){
				var html_data ={
							Call: command,
							Error : 'NA',
							Result : output,
							ApplicableId : 'NA'
						}
					data=html_data;
				
				//console.log(data);
				this.temp_array.push(data);
			}
			
		}
	);
})(jQuery);

