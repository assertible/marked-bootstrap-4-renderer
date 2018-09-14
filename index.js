
var marked      = require('marked')
var highlightjs = require('highlightjs/highlight.pack.js')
var htmlparser  = require('htmlparser')

var renderer = new marked.Renderer()

renderer.blockquote = function(quote) {
    return '<blockquote class="blockquote">' + quote + '</blockquote>'
}

renderer.heading = function(text, level) {

    var parserHandler = new htmlparser.DefaultHandler(function(error) {
	if (error)
            throw new Error('Cannot parse "' + text + '" in markdown file.')
    });
    var parser = new htmlparser.Parser(parserHandler);

    parser.parseComplete(text);

    var escaped = parserHandler.dom[0].raw.toLowerCase().trim().replace(/ /g, '-')

    return '<h' + level + ' id="' + escaped + '">'
         // NOTE: We're setting display none INLINE, so you have
         // to override with !important if you want it to show.
         + '  <a class="heading-anchor" style="display:none;" href="#' + escaped + '">'
         + '    <i class="oi oi-link-intact"></i>'
         + '  </a>'
         +    text
         + '</h' + level + '>'
}

renderer.table = function(header, body) {
    return '<table class="table">'
         +     '<thead class="thead-default">'
         +         header
         +     '</thead>'
         +     '<tbody>'
         +         body
         +     '</tbody>'
         + '</table>'
}

/*
 * Adds highlight.js classes to `code` blocks
 */
renderer.code = function(code, language) {

    var valid = !!(language && highlightjs.getLanguage(language))
    var highlighted = valid ? highlightjs.highlight(language, code).value : code

    return '<pre><code class="hljs lang-' + language + '">'
         + highlighted
         + '</code></pre>'
}

renderer.image = function(href, title, text) {
    var imgSrc = process.env && process.env.STATIC_APPROOT
               ? process.env.STATIC_APPROOT + '/' + href
               : href
    return '<img src="' + imgSrc + '" alt="' + text +  '"/>'
}

module.exports = function(opts) {
    return renderer
}
