// TODO: Remove direct usage of classes (is-open-submenu)
// TODO: close open submenus when focus leaves entire menu?

;(function( $, window, undefined ) {
	'use strict';

	var mojsMenuId = 0;
	var Menu = {
		options: {
			mobileBreakpoint: 900,
			breakpointType: 'screen', // 'screen' or 'element'
			mobileMenuLocation: '',
			toggleContainerID: 'mojs-toggle-container',
			toggleButtonID: '',
			toggleButtonContent: 'Menu',
			classArrows: 'menu-arrows',
			classJS: 'is-js-menu',
			classIsMobile: 'is-mobile-menu',
			classHasMobile: 'has-mobile-menu',
			classIsHidden: 'is-hidden-menu',
			classHasSubmenu: 'has-submenu',
			classOpenSubmenu: 'is-open-submenu',
			classToggleSubmenu: 'toggle-submenu'
		},

		init: function( el, options ) {
			mojsMenuId++;
			var menu = this,
				mojsToggle = true, // Window resize throttle flag.
				mo;

			menu.number = mojsMenuId;
			menu.el = $(el).addClass('mojs-' + menu.number);
			menu.isTouch = false;
			menu.keys = {
				tab:    9,
				enter:  13,
				esc:    27,
				space:  32,
				left:   37,
				up:     38,
				right:  39,
				down:   40
			};

			mo = menu.options = $.extend( {}, menu.options, options );

			// Check for device touch support.
			if ( 'ontouchstart' in document.documentElement ) {
				menu.isTouch = true;

				// Adds the js class to the main menu element.
				menu.el.addClass(mo.classJS);
			}

			// Initialize the menu container.
			menu.initContainer();

			// Initialize the toggle button.
			menu.initToggleButton();

			// Add classes to root menu items.
			// menu.el.children('li').addClass('root-list-item');

			// Initialize the submenu arrows.
			menu.el.addClass(mo.classArrows)
				.find('ul').parent().addClass(mo.classHasSubmenu)
				.children('a').append('<span class="' + mo.classToggleSubmenu + '"></span>');

			// Catch mousedown events on submenu toggle handlers.
			menu.el.on('mousedown', '.' + mo.classToggleSubmenu, function( e ) {

				// Only continue if javascript menu class is in use.
				if ( menu.el.hasClass( mo.classJS ) ) {
					e.preventDefault();
					menu.toggleSubmenu( this );
				}

			});

			// When the toggle button is clicked, prevent the parent link from being clicked.
			menu.el.on('click', '.' + mo.classToggleSubmenu, function( e ) {
				e.preventDefault();
			});

			// Prevent rightmost submenus from leaving the viewport on :hover. Currently broken.
			menu.el.on('mouseenter', '.' + mo.classHasSubmenu, function() {
				// var mo = menu.options,
				// 	parentmenu = $(this),
				// 	submenu = parentmenu.children('ul');
			
				// if ( !menu.el.hasClass( mo.classIsMobile ) ) {
				// 	var menupos = parentmenu.offset();					
				// 	var diff = menupos.left + submenu.outerWidth() - $(window).width();
				// 	if ( diff > 0 ) {
				// 		submenu.css({ left: -diff }); 
				// 	}
				// }
			});

			// Removes all menu item from tabindex except the first. See: http://access.aol.com/dhtml-style-guide-working-group/#menu
			menu.el.find('> li:not(:first) a').attr('tabindex', -1);

			// Handles keyboard navigation
			menu.el.find('a').keydown(function(e){
				menu.keyNav(e);
			});

			// Initialize the mobile menu.
			menu.toggleMobile();

			// Throttle the resize event.
			$(window).on('resize', function() {
				if ( mojsToggle ) {
					mojsToggle = false;

					setTimeout( function() {
						menu.toggleMobile();
						mojsToggle = true;
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

			if ( $('#' + mo.toggleButtonID).length > 0 ) {
				menu.toggleButton = $('#' + mo.toggleButtonID);
				menu.toggleButton.addClass('mojs-toggle-' + mojsMenuId);
			} else {
				// Select the toggle button for current menu.
				menu.toggleButton = $('.mojs-toggle-' + mojsMenuId);

				// Automatically insert a toggle button if previously selected button doesn't exist.
				if ( menu.toggleButton.length < 1 ) {
					if ( '' === mo.mobileMenuLocation ) {
						$('<div id="'+mo.toggleContainerID+'"><span class="menu-toggle-button mojs-toggle-' + mojsMenuId + '">' + mo.toggleButtonContent + '</span></div>').prependTo(menu.container);
					} else {
						$('<div id="'+mo.toggleContainerID+'"><span class="menu-toggle-button mojs-toggle-' + mojsMenuId + '">' + mo.toggleButtonContent + '</span></div>').prependTo(mo.mobileMenuLocation);
					}
					menu.toggleButton = $('.mojs-toggle-' + mojsMenuId).hide();
					if ( mo.toggleButtonID ) {
						menu.toggleButton.attr('id', mo.toggleButtonID);						
					}
				}	
			}

			// Add listener to the menu toggle button.
			menu.toggleButton.on('click', function(){
				menu.el.toggleClass(mo.classIsHidden);
			});
		},

		/**
		 * Toggle the menu's mobile state.
		 *
		 * Mobile state can be toggled either based on the width of the viewport
		 * or the width of the menu's container element.
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
			if ( width < mo.mobileBreakpoint && !this.el.hasClass(mo.classIsMobile) ) {
				// Show the menu toggle button.
				this.toggleButton.show();
				$('body').addClass(mo.classHasMobile);

				// Add the mobile, js, and hideMobile classes to the main menu element.
				this.el.addClass(mo.classIsMobile).addClass(mo.classJS).addClass(mo.classIsHidden);

				// Moves the menus to the specified location.
				if ( '' !== mo.mobileMenuLocation ) {

					if ( !this.el.parent().hasClass('mojs-placeholder') ) {
						for (var i=mojsMenuId;i>0;i--) {
							if(this.el.hasClass('mojs-' + i)) {
								this.el.parent().addClass('mojs-' + i + '-placeholder mojs-placeholder');
							}
						}
					}
					$(this.toggleButton).parent().append(this.el);
				}

			}

			// Check if viewport width is greater than the mobile breakpoint setting and the mobile menu is still displayed.
			if ( width >= mo.mobileBreakpoint && this.el.hasClass(mo.classIsMobile) ) {
				// Hides mobile menu toggle button
				this.toggleButton.hide();
				$('body').removeClass(mo.classHasMobile);

				// Moves the menus back to the original location.
				if ( '' !== mo.mobileMenuLocation ) {
					for (var i=mojsMenuId;i>=0;i--) {
						if(this.el.hasClass('mojs-' + i)) {
							this.el.appendTo('.mojs-' + i + '-placeholder');
						}
					}
				}

				// Remove hide mobile class to ensure menu is never hidden in desktop view.
				this.el.removeClass(mo.classIsHidden).removeClass(mo.classIsMobile);

				// Check for lack of touch support.
				if ( ! this.isTouch ) {

					// Removes javascript menu class from main menu element
					this.el.removeClass(mo.classJS);

					// Removes any left over open submenu classes.
					this.el.find('.' + mo.classOpenSubmenu).removeClass(mo.classOpenSubmenu);
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
				submenu = $(menuItem).closest('.' + mo.classHasSubmenu);

			// Toggle the submenu open class.
			submenu.toggleClass(mo.classOpenSubmenu);

			// Remove submenu open class from other open submenus.
			if ( !this.el.hasClass( mo.classIsMobile ) ) {
				submenu.parent().find('.' + mo.classOpenSubmenu).not(submenu).removeClass(mo.classOpenSubmenu);
			}
		},

				/**
		 * Handles keyboard navigation.
		 *
		 * The menu container is used for determining the width of the menu when
		 * it's hidden as well as to provide a context for inserting a toggle
		 * button if one doesn't already exist.
		 */
		keyNav: function(e) {
			var menu = this,
				mo = menu.options;

				// Was a standard modifier key pressed?
				if (e.altKey || e.ctrlKey) {
					return true;
				}

				switch(e.keyCode) {

					// Opens submenu when "Enter" key is pressed.
					case menu.keys.enter: {

						// Is the submenu closed?
						if (! $(e.target).closest('li').hasClass(mo.classOpenSubmenu) ) {

							// Opens the submenu.
							$(e.target).closest('li').addClass(mo.classOpenSubmenu);

							// Sets the focus to the first menu item of the newly opened submenu.
							$(e.target).closest('li').find('ul li a').first().focus();

							// Prevents the default behavior (following the link).
							e.preventDefault();

						}

						break;
					}

					// Opens submenu when "Spacebar" key is pressed.
					case menu.keys.space: {
						if (! $(e.target).closest('li').hasClass(mo.classOpenSubmenu) ) {
							$(e.target).closest('li').addClass(mo.classOpenSubmenu);
							$(e.target).closest('li').find('ul li a').first().focus();
							e.preventDefault();
						}
						break;
					}

					// Navigates to next submenu item when "Down" key is pressed.
					case menu.keys.down: {

						// Is the focus currently on the root menu?
						if ( $(e.target).closest('li').parents('.'+mo.classHasSubmenu).length == 0 ) {

							// Opens the submenu.
							$(e.target).closest('li').addClass(mo.classOpenSubmenu);

							// Sets the focus to the first menu item of the newly opened submenu.
							$(e.target).closest('li').find('ul li a').first().focus();

						}

						// Is the focus currently in a submenu?
						if ( $(e.target).closest('ul').hasClass('sub-menu') ) {

							// Does a next list item exist?
							if ( $(e.target).closest('li').next('li').length ) {

								// // Places focus on next menu item.
								$(e.target).closest('li').next('li').find('a').focus();

								// Closes open submenu
								$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
							}
						}

						// Prevents the default behavior (following the link).
						e.preventDefault();

						break;
					}

					// Navigates to next submenu item when "Up" key is pressed.
					case menu.keys.up: {
						if ( $(e.target).closest('ul').hasClass('sub-menu') ) {
							if ( $(e.target).closest('li').prev('li').length ) {
								$(e.target).closest('li').prev('li').find('a').focus();
								$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
							} else {
								if ( $(e.target).closest('li').parents('.'+mo.classHasSubmenu).length == 1 ) {
									$(e.target).closest('li.is-open-submenu').find('a').first().focus();
									$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
								}
							}
						}
						e.preventDefault();
						break;
					}

					// Opens child submenu when "Right" key is pressed.
					case menu.keys.right: {
						if ( $(e.target).closest('li').parents('.'+mo.classHasSubmenu).length == 0 ) {
							$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
							$(e.target).closest('li').next('li').find('a').focus();
						}
						if ( $(e.target).closest('ul').hasClass('sub-menu') ) {
							if ( $(e.target).closest('li').hasClass(mo.classHasSubmenu) ) {
								$(e.target).closest('li').addClass(mo.classOpenSubmenu);
								$(e.target).closest('li').find('ul li a').first().focus();
							}
						}
						break;
					}

					// Closes child submenu when "Left" key is pressed.
					case menu.keys.left: {
						if ( $(e.target).closest('li').parents('.'+mo.classHasSubmenu).length == 0 ) {
							$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
							$(e.target).closest('li').prev('li').find('a').focus();
						}
						if ( $(e.target).closest('li').parents('.'+mo.classHasSubmenu).length > 1 ) {
							$(e.target).parent('.is-open-submenu').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
							$(e.target).closest('ul').parent('li').find('a').first().focus();
							$(e.target).closest('ul').find('.is-open-submenu').removeClass(mo.classOpenSubmenu);
						}
						break;
					}

					// Closes submenu when "Esc" key is pressed.
					case menu.keys.esc: {
						$(e.target).closest('li.is-open-submenu').find('a').first().focus();
						$(e.target).closest('.is-open-submenu').removeClass(mo.classOpenSubmenu);
						break;
					}
				}

				// Keeps event from bubbling up to menus/submenus higher up in the DOM.
				e.stopPropagation();
		}
	};

	/**
	 * Add responsive menu support to jQuery.
	 *
	 * @param object settings The settings for this menu (options, custom class names, etc.).
	 */
	$.fn.mojs = function( settings ) {
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
