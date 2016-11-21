$j(document).ready(function () {
	$j('#main-menu li a.level-1-link').each(function(i) {
	    $j(this).attr('id', 'menu-level'+(i+1));
		$j('#menu-level'+(i+1)).bind({
		  mouseover: function() {
		   $j('#menu-popup'+(i+1)).addClass("active");
		  },
		  mouseout: function() {
		     $j('#menu-popup'+(i+1)).removeClass("active");
		  }
		});
	});
	
	$j('#main-menu li ul.menu-popup').each(function(i) {
		$j(this).attr('id', 'menu-popup'+(i+1));
		$j('#menu-popup'+(i+1)).bind({
		  mouseover: function() {
		   $j('#menu-popup'+(i+1)).addClass("active");
		  },
		  mouseout: function() {
		     $j('#menu-popup'+(i+1)).removeClass("active");
		  }
		});
	});
		
	$j(document).on({
		mouseover : function(event) {
					  if (event.type == 'mouseover') {
						 jQuery(this).addClass('parent-active');
					    	var text = jQuery(this).children('.panel');	
						text.css('display','block');
					  } else {
						 jQuery(this).removeClass('parent-active');
					   	var text = jQuery(this).children('.panel');
						text.css('display','none');
						
					  }
					},
		mouseout  : function(event) {
					  if (event.type == 'mouseover') {
						 jQuery(this).addClass('parent-active');
					    	var text = jQuery(this).children('.panel');	
						text.css('display','block');
					  } else {
						 jQuery(this).removeClass('parent-active');
					   	var text = jQuery(this).children('.panel');
						text.css('display','none');
						
					  }
					}
	},'#main-menu .menu-popup.dropdown-hover .level1');
	
	/*** style c ***/
	
	$j(document).on({ click : function () {
		var text = $j(this).siblings('.panel');
		if (text.is(':hidden')) {	
			text.slideDown('200');
			//$j(this).children('span').html('-');	
			$j(this).html('-');		
		} else {
			text.slideUp('200');
			//$j(this).children('span').html('+');	
			$j(this).html('+');		
		}
	}},'#main-menu .menu-popup.dropdown-toggle span.toggle');
	
	$j('#main-menu .menu-popup.dropdown-toggle').each(function(){
		var current=$j(this).find('.current');
		
		if (current.length > 0 ){
			current.parents('div.panel').css('display','block');
		}else{
			$j(this).find('div.panel').css('display','none');
		}
	});

	/*** end script for style c ***/
	
	/** category menu default **/
	
	$j('.category-menu.default .current').each(function(i) {
		jQuery(this).parents('div.panel').css('display','block');
	});
	
	/** category menu toogle **/
	$j(document).on({
		click  : function () {
		var text = $j(this).siblings('.panel');
		if (text.is(':hidden')) {	
			text.slideDown('200');
			$j(this).html('-');		
		} else {
			text.slideUp('200');
			$j(this).html('+');		
		}
	}},'.category-menu.accordion ul span.toggle');
	
	$j('.category-menu.accordion ul').each(function(){
		var current=$j(this).find('.current');
		current.parents('div.panel').css('display','block');
		var prevparents=current.parents('div.panel').siblings('span.toggle');
		$j(prevparents).html('-');	
	});
	
	/** category menu pop-up **/
	
	$j(document).on({
		mouseover : function(event) {
					  if (event.type == 'mouseover') {
						 jQuery(this).addClass('parent-active');
					    	var text = jQuery(this).children('.panel');	
						text.css('display','block');
					  } else {
						 jQuery(this).removeClass('parent-active');
					   	var text = jQuery(this).children('.panel');
						text.css('display','none');
						
					  }
				},
		mouseout  : function(event) {
					  if (event.type == 'mouseover') {
						 jQuery(this).addClass('parent-active');
					    	var text = jQuery(this).children('.panel');	
						text.css('display','block');
					  } else {
						 jQuery(this).removeClass('parent-active');
					   	var text = jQuery(this).children('.panel');
						text.css('display','none');
						
					  }
				}
		},'.category-menu.pop-up ul li');
	
	
});

