(function($) {
	$.Class("IncraToolbar",
		{
		
		},
		{
			update_url:"",
			default_url:"",
			filter_url:"",
			sort_value : "",
			sort_by_value :"",
			pagination_url : "",
			update_url: "",
			current_url :"",
			page_from:"",
			page_nr_on:"",
			total_products: 0,
			init 			:	function(config){
							this.update_url=config.update_url;
							this.default_url=config.default_url;
							this.current_url=config.current_url;
							this.filter_url=config.filter_url;
							this.sort_value=config.sort_value;
							this.sort_by_value=config.sort_by_value;
							this.pagination_url=config.pagination_url;
							this.page_from=config.page_from;
							this.page_nr_on=config.page_nr_on;
							
			},
			setSort 		: 	function(sort_value){
				if (sort_value=='Ascending'){
					jQuery(".asc-direction").css('display','none');
					jQuery(".desc-direction").css('display','block');
				}else{
					jQuery(".desc-direction").css('display','none');
					jQuery(".asc-direction").css('display','block');
				}
			},
			setLimit		: function(tmpval,total){
				//var total=this.total_products;
				if (tmpval>=total){
					var p_from=1;
				}else{
					var res=Math.floor(total/tmpval);
					if (this.page_from>res) var p_from=res; else var p_from=this.page_from;
				}
				IncraAjaxUpdater.submitAjax(this.update_url,
					IncraWindow.formatUrl(this.current_url),
					IncraWindow.formatUrl(this.default_url+'/Page/'+p_from+'/'+tmpval+this.sort_by_value+this.sort_value+this.filter_url)
				);
				
				jQuery("#limiter option").each(function(i) {
					var optval=jQuery(this).val();
					if (optval==this.page_nr_on){
						jQuery(this).attr('selected','selected');
					}
				});
			},	
			
			setPage 		: 	function(pagenr){
				to_url=IncraWindow.formatUrl(this.default_url+'/Page/'+pagenr+'/'+this.page_nr_on+this.sort_by_value+this.sort_value+this.filter_url);
				IncraAjaxUpdater.submitAjax(this.update_url,IncraWindow.formatUrl(this.current_url),to_url);
				this.setSort(this.sort_value);
			},
			setCatalogMode	: 	function(mode){
				to_url=IncraWindow.formatUrl(this.default_url+'/Page/'+this.page_from+'/'+this.page_nr_on+this.sort_by_value+this.sort_value+'/'+mode+this.filter_url);
				IncraAjaxUpdater.submitAjax(this.update_url,IncraWindow.formatUrl(this.current_url),to_url);
			},
			setSortBy 		: 	function(sortbyvalue){
				to_url=IncraWindow.formatUrl(this.default_url+'/Page/'+this.page_from+'/'+this.page_nr_on+'/'+sortbyvalue+this.sort_value+this.filter_url);
				IncraAjaxUpdater.submitAjax(this.update_url,IncraWindow.formatUrl(this.current_url),to_url);
			},
			setSorting 		: 	function(sortvalue){
				to_url=IncraWindow.formatUrl(this.default_url+'/Page/'+this.page_from+'/'+this.page_nr_on+this.sort_by_value+'/'+sortvalue+this.filter_url);
				IncraAjaxUpdater.submitAjax(this.update_url,IncraWindow.formatUrl(this.current_url),to_url);
				this.setSort(sortvalue);
			}

		}
	)
})(jQuery);
