'use strict';

var doc = document.implementation.createHTMLDocument('');
var div = doc.createElement('div');

function removeHTML(htmlString) {
    div.innerHTML = htmlString;
    return div.innerText;
}

function escapeHTML(htmlString) {
    try {
        return htmlString.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    catch(e) {
        return '';
    }
}

function safeHTML(htmlString) {
    div.innerHTML = htmlString;

    for (var elements = div.querySelectorAll('*'), i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];

        // This is not needed because .innerHTML by default does not execute script tags
        if (element.localName == 'script') {
            element.parentNode.removeChild(element);
            continue;
        }

        if (!element.hasAttributes())
            continue;

        for (var attributes = element.attributes, j = attributes.length - 1; j >= 0; j--) {
            var attribute = attributes[j];

            // Remove insecure attributes starting "on*" (e.g.: onload, onerror, ...) and also values starting "javascript:*" (e.g. href="javascript:alert(1)")
            if (attribute.name.indexOf('on') == 0 || attribute.value.indexOf('javascript:') == 0)
                element.removeAttribute(attribute.localName);
        }
    }

    return div.innerHTML;
}

// Export as VUE.js plugin with attributes v-html-remove, v-html-escape, v-html-safe
// Usage example: 
// import VueSecureHTML from 'VueSecureHTML.js';
// Vue.use(VueSecureHTML);
// <teplate><div v-html-remove="message"></div><div v-html-escape="message"></div><div v-html-safe="message"></div></teplate>

module.exports = {
    install : function (Vue, options) {

        Vue.directive('html-remove', {
            inserted : function (el, binding) {
                el.innerHTML = removeHTML(binding.value);
            },

            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = removeHTML(binding.value);
            }
        });

        Vue.directive('html-escape', {
            inserted : function (el, binding) {
                el.innerHTML = escapeHTML(binding.value);
            },

            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = escapeHTML(binding.value);
            }
        });

        Vue.directive('html-safe', {
            inserted : function (el, binding) {
                el.innerHTML = safeHTML(binding.value);
            },

            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = safeHTML(binding.value);
            }
        });

    }
}

// Also export separate functions
// Usage example: 
// import VueSecureHTML from 'VueSecureHTML.js';
// Vue.prototype.$removeHTML = VueSecureHTML.removeHTML;
// Vue.prototype.$escapeHTML = VueSecureHTML.escapeHTML;
// Vue.prototype.$safeHTML = VueSecureHTML.safeHTML;
// A) <teplate><div>{{ $removeHTML(message) }}</div><div>{{ $escapeHTML(message) }}</div><div>{{ $safeHTML(message) }}</div></teplate>
// B) <script>var message = 'My <b>secure part</b> and user-provided insecure part: ' + $removeHTML("<img src='' onerror=alert('XSS!')>");</script> + <teplate><div v-html="message"></div></teplate>

module.exports.removeHTML = removeHTML;
module.exports.escapeHTML = escapeHTML;
module.exports.safeHTML = safeHTML;
