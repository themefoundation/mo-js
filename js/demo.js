jQuery(function($) {
	$('.test-menu').mojs({
		toggleButtonID: 'mojs-button',
		mobileMenuLocation: '.site-header'
	});

	$('.test-menu2').mojs({
		toggleButtonID: 'mojs-button',
	 	mobileMenuLocation: 'body'
	});
});