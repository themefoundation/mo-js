Menu Object (mo.js)
=====

A mobile-first, progressively enhanced, standards based, responsive navigation menu system. Need any more buzzwords?


mo.js is made up of two primary parts.

1. Javascript that implements many of the mo.js features such as touch-enabled drop down menus and keyboard navigation.
2. Sass mixins that you can use to quickly style your menu in a variety of ways.

Here's how it works:

* By default, menu items are displayed as a typical drop down menu via :hover.
* If viewed on a touch device, the :hover functionality is replaced with arrow icons for expanding/contracting submenus via click instead of hover.
* If viewed on a mobile device (or a small screen), the menu is hidden and a toggle button is created.
* All menu levels should be available regardless of the device.
* Should handle multiple menus without issue.

HTML structure will follow the default WordPress menu output. CSS/Javascript will take inspiration from sources such as the Superfish menu and responsive-nav.com.


How to use mo.js in your project
-----


1. First of all, you'll need the **mo.js** file, which is located in the **js** folder.

2. In the **js** folder, you'll also see the **demo.js** file, which you need to apply the **mo.js** file script to your menu. You can do that either by loading the **demo.js** file and modifying it, or by adding that code to the **mo.js** file, or by placing it in another javascript file, or even in the header or footer of the theme.

3. After that, you'll need to load the CSS file (which is located at css directory) or add the CSS file in your stylesheet.

**The goal is for it to work like this:**

1. **mo.js** adds and removes classes from the menu depending on the circumstance (Example: Does this menu item contain a submenu?)
2. The CSS file uses those classes to show/hide/manipulate the menu.


