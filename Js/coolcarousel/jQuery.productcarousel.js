(function( $ ) {
	$.Class("ProductCarousel",
		{
			
		},
		{
			carousel_id				:	"",
			next_button_id				:"",
			prev_button_id				:"",
			items					:1,
			width					:"",
			pagination_id				:"",
			fx					:"",
			duration				:2000,
			direction				:"left",
			init : function(config){
				this.carousel_id=config.carousel_id;
				this.next_button_id = config.nextbtn;
				this.prev_button_id = config.prevbtn;
				this.items	=config.items;
				this.width	=config.width;
				this.pagination_id	=config.pagination_id;
				this.fx=config.effect;
				this.duration	=config.duration;
				this.direction=config.direction;
			},
		
			carousel	:	function(){
						jQuery(this.carousel_id).carouFredSel({
							width: this.width,
							items: this.items,
							scroll: {
								pauseOnHover: true,
								onBefore: function() {
									jQuery(this.carousel_id).children().removeClass( 'hover' );
								}
							},
							prev: {
								button: this.prev_button_id,
								items: 1
							},
							next: {
								button: this.next_button_id,
								items: 1
							},
							auto: false
						});
					},
			continuouslyscrolling	: function(){
				jQuery(this.carousel_id).carouFredSel({
					align: false,
					items: this.items,
					width: this.width,
					direction: this.direction,
					scroll: {
						items: 1,
						duration: this.duration,
						timeoutDuration: 0,
						easing: 'linear',
						pauseOnHover: 'immediate'
					},
					auto: {
						items: 1,
						easing: 'linear',
						duration: 3000,
						timeoutDuration: 0
					},
					
					pagination: {
						container: '#pager',
						items: 1,
						duration: 0.5,
						queue: 'last',
						onAfter: function() {
							var cur = $(this).triggerHandler( 'currentVisible' ),
								mid = Math.floor( cur.length / 2 );
			 
							cur.eq( mid ).addClass( 'hover' );
						}
					}
				});
				
			},
			slideshow	: function(){
				jQuery(this.carousel_id).carouFredSel({
					width: this.width,
					items: {
						visible: {
							min: this.items
						}
					},
					scroll: {
						items: this.items,
						fx: this.fx,
						duration: 3000,
						timeoutDuration: 3000,
						pauseOnHover: 'immediate'
					}
				});
			}
		}
	)
})(jQuery);
