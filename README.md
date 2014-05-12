An Angular.js directive for [xing/wysihtml5][1], a simple wysiwyg library used by Basecamp, XING, and more. wysihtml5 doesn't play nicely with Angular or Bootstrap 3 out-of-the-box, so we provide some dependencies and a directive to make the process painless.

![Screenshot](http://gyazo.com/b246204f5dc91ae74e2eb0a4a730d52e.png)

## Dependencies

 * Bootstrap 3 (won't work with BS2)
   * jQuery
 * [bootstrap3-wysihtml5-bower][2], a BS3-compatible version of wysihtml5
   * wysihtml5
   * wysihtml5/parser_rules/simple
   * handlebars

These are installed automatically when you run `bower install`, just a heads up files you'll be including in your html head

## Installation

`bower install https://github.com/CirrusCPQ/cirrus.wysihtml5.git --save`

## Usage

See [index.html][3] for example usage

## To-Do

 * Make the included toolbar buttons customizable
 * Better styling customizability
 * Publish to Bower

[1]: http://xing.github.io/wysihtml5/
[2]: https://github.com/Waxolunist/bootstrap3-wysihtml5-bower
[3]: index.html

