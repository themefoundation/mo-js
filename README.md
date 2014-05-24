Menu Object (mo.js)
=====

A mobile-first, progressively enhanced, standards based, responsive navigation menu system. Need any more buzzwords?

Here's how it works:

* By default, menu items are centered, one following another. "Pills" if you're familiar with Twitter Bootstrap.
* On larger screen sizes display a typical drop down menu via :hover.
* If viewed on a touch device, replace :hover with arrows for expanding/contracting submenus.
* Progressively enhance to support toggled visibility of a vertical mobile menu.
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


