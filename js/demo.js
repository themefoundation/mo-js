jQuery(function($) {
	$('.test-menu').mojs({
		toggleButtonID: 'mojs-button',
		toggleButtonContent: 'Menu #1',
		mobileMenuLocation: '.site-header',
	});

	$('.test-menu2').mojs({
		// showArrows: false,
		toggleButtonID: 'mojs-button2',
		toggleButtonContent: 'Menu #2',
	 	mobileMenuLocation: 'body'
	});
});