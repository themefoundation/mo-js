;(function( $, window, undefined ) {
	'use strict';

	var Menu = {
		options: {
			mobileBreakpoint: 900,
			breakpointType: 'screen', // 'screen' or 'element'
			mobileMenuLocation: '',
			toggleButtonID: 'menu-toggle-button',
			arrowClass: 'menu-arrows',
			jsClass: 'is-js-menu',
			mobileClass: 'is-mobile-menu',
			hideMobileClass: 'is-hidden-menu',
			hasSubmenuClass: 'has-submenu',
			openSubmenuClass: 'is-open-submenu',
			toggleSubmenuClass: 'toggle-submenu'
		},

		init: function( el, options ) {
			var menu = this,
				doCallback = true, // Window resize throttle flag.
				mo;

			menu.el = $(el);
			menu.isTouch = false;
			mo = menu.options = $.extend( {}, menu.options, options );

			// Check for device touch support.
			if ( 'ontouchstart' in document.documentElement ) {
				menu.isTouch = true;

				// Adds the js class to the main menu element.
				menu.el.addClass(mo.jsClass);
			}

			// Initialize the menu container.
			menu.initContainer();

			// Initialize the toggle button.
			menu.initToggleButton();

			// Initialize the arrows.
			menu.el.addClass(mo.arrowClass)
				.find('ul').parent().addClass(mo.hasSubmenuClass)
				.children('a').append('<span class="' + mo.toggleSubmenuClass + '"></span>');

			// Catch click events on submenu toggle handlers.
			menu.el.on('click', '.' + mo.toggleSubmenuClass, function( e ) {

				// Only continue if javascript menu class is in use.
				if ( menu.el.hasClass( mo.jsClass ) ) {
					e.preventDefault();
					menu.toggleSubmenu( this );
				}

			});

			// Prevent rightmost submenus from leaving the viewport on :hover.
			menu.el.on('hover', '.' + mo.hasSubmenuClass, function() {
				var mo = menu.options,
					parentmenu = $(this),
					submenu = parentmenu.children('ul');
			
				if ( !menu.el.hasClass( mo.mobileClass ) ) {
					var menupos = parentmenu.offset();					
					var diff = menupos.left + submenu.outerWidth() - $(window).width();
					if ( diff > 0 ) {
						submenu.css({ left: -diff }); 
					}
				}
			});

			// Initialize the mobile menu.
			menu.toggleMobile();

			// Throttle the resize event.
			$(window).on('resize', function() {
				if ( doCallback ) {
					doCallback = false;

					setTimeout( function() {
						menu.toggleMobile();
						doCallback = true;
					}, 250 );
				}
			});
		},

		/**
		 * Select or create a container around the menu.
		 *
		 * The menu container is used for determining the width of the menu when
		 * it's hidden as well as to provide a context for inserting a toggle
		 * button if one doesn't already exist.
		 */
		initContainer: function() {
			// Select the container.
			this.container = this.el.closest('.thmfdn-menu-container');

			// Automatically add a container div if one doesn't exist.
			if ( this.container.length < 1 ) {
				this.container = this.el.wrap('<div class="thmfdn-menu-container"></div>').parent();
			}
		},

		/**
		 * Select or create a mobile toggle button.
		 *
		 * The mobile toggle button will show or hide the menu when it's in a
		 * mobile state.
		 */
		initToggleButton: function() {
			var menu = this,
				mo = menu.options;

			// Select the toggle button.
			menu.toggleButton = $('#' + mo.toggleButtonID );

			// Automatically insert a toggle button if one doesn't exist.
			if ( menu.toggleButton.length < 1 ) {
				if ( '' === mo.mobileMenuLocation ) {
					menu.toggleButton = menu.container.prepend('<div id="' + mo.toggleButtonID + '" class="menu-toggle-button">&#8801</div>').find('#' + mo.toggleButtonID).hide();
				} else {
					if ( ! $(mo.mobileMenuLocation).hasClass( 'has-mobileMenu' ) ) {
						menu.toggleButton = $(mo.mobileMenuLocation).prepend('<div id="' + mo.toggleButtonID + '" class="menu-toggle-button">&#8801</div>').find('#' + mo.toggleButtonID).hide();					
						$(mo.mobileMenuLocation).addClass( 'has-mobileMenu' );
					}
				}
			}

			// Add listener to the menu toggle button.
			menu.toggleButton.on('click', function(){
				menu.el.toggleClass(mo.hideMobileClass);
			});
		},

		/**
		 * Toggle the menu's mobile state depending on the width of its container.
		 *
		 * Rather than basing the breakpoint on the width of the viewport, the
		 * width of the menu's container is used to determine when exactly the
		 * menu should change state.
		 */
		toggleMobile: function() {
			var mo = this.options;
			var width = '';

			if ( 'screen' == mo.breakpointType ) {
				width = viewportSize.getWidth();
			} else {
				width = this.container.outerWidth();
			}

			// Check if viewport width is less than the mobile breakpoint setting and the mobile menu is not displayed yet.
			if ( width < mo.mobileBreakpoint && !this.el.hasClass(mo.mobileClass) ) {
				// Show the menu toggle button.
				this.toggleButton.show();

				// Add the mobile, js, and hideMobile classes to the main menu element.
				this.el.addClass(mo.mobileClass).addClass(mo.jsClass).addClass(mo.hideMobileClass);
			}

			// Check if viewport width is greater than the mobile breakpoint setting and the mobile menu is still displayed.
			if ( width >= mo.mobileBreakpoint && this.el.hasClass(mo.mobileClass) ) {
				// Hides mobile menu toggle button
				this.toggleButton.hide();

				// Remove hide mobile class to ensure menu is never hidden in desktop view.
				this.el.removeClass(mo.hideMobileClass).removeClass(mo.mobileClass);

				// Check for lack of touch support.
				if ( ! this.isTouch ) {

					// Removes javascript menu class from main menu element
					this.el.removeClass(mo.jsClass);

					// Removes any left over open submenu classes.
					this.el.find('.' + mo.openSubmenuClass).removeClass(mo.openSubmenuClass);
				}
			}
		},

		/**
		 * Toggle the visibility of a submenu.
		 *
		 * @param {object} menuItem Submenu HTML element.
		 */
		toggleSubmenu: function( menuItem ) {
			var mo = this.options,
				submenu = $(menuItem).closest('.' + mo.hasSubmenuClass);

			// Toggle the submenu open class and remove from any other submenus at the same level.
			submenu.toggleClass(mo.openSubmenuClass).parent().find('.' + mo.openSubmenuClass).not(submenu).removeClass(mo.openSubmenuClass);
		}
	};

	/**
	 * Add responsive menu support to jQuery.
	 *
	 * @param object settings The settings for this menu (options, custom class names, etc.).
	 */
	$.fn.thmfdnMenu = function( settings ) {
		return this.each(function() {
			var menu = Object.create(Menu);
			menu.init( this, settings );
		});
	};
})( jQuery, window );

/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function (window) {

	window.viewportSize = {};

	window.viewportSize.getHeight = function () {
		return getSize("Height");
	};

	window.viewportSize.getWidth = function () {
		return getSize("Width");
	};

	var getSize = function (Name) {
		var size;
		var name = Name.toLowerCase();
		var document = window.document;
		var documentElement = document.documentElement;
		if (window["inner" + Name] === undefined) {
			// IE6 & IE7 don't have window.innerWidth or innerHeight
			size = documentElement["client" + Name];
		} else if (window["inner" + Name] != documentElement["client" + Name]) {
			// WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

			// Insert markup to test if a media query will match document.doumentElement["client" + Name]
			var bodyElement = document.createElement("body");
			bodyElement.id = "vpw-test-b";
			bodyElement.style.cssText = "overflow:scroll";
			var divElement = document.createElement("div");
			divElement.id = "vpw-test-d";
			divElement.style.cssText = "position:absolute;top:-1000px";
			// Getting specific on the CSS selector so it won't get overridden easily
			divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
			bodyElement.appendChild(divElement);
			documentElement.insertBefore(bodyElement, document.head);

			if (divElement["offset" + Name] == 7) {
				// Media query matches document.documentElement["client" + Name]
				size = documentElement["client" + Name];
			} else {
				// Media query didn't match, use window["inner" + Name]
				size = window["inner" + Name];
			}
		
			// Cleanup
			documentElement.removeChild(bodyElement);
		} else {
			// Default to use window["inner" + Name]
			size = window["inner" + Name];
		}
		return size;
	};

})(this);
