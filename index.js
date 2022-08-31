'use strict';

var doc = document.implementation.createHTMLDocument('');
var div = doc.createElement('div');

function removeHTML(htmlString) {
    div.innerHTML = htmlString;
    var elements = div.querySelectorAll('*')
    while (elements.length) {
        div.innerHTML = div.innerText;
        elements = div.querySelectorAll('*');
    }
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
        var element = elements[i],
            tagName = element.localName;

        if (tagName == 'script' || tagName == 'noscript' || tagName == 'noembed' || !(element.attributes instanceof NamedNodeMap)) {
            try {
                element.parentNode.removeChild(element);
            }
            catch(e) {
                element.outerHTML = '';
            }
            continue;
        }

        if (!element.hasAttributes())
            continue;

        for (var attributes = element.attributes, j = attributes.length - 1; j >= 0; j--) {
            var attribute = attributes[j],
                attributeName = attribute.localName,
                attributeValue = attribute.value.replace(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g, '').toLowerCase().trim();

            // Remove insecure attribute starting "on*" (example: <img src='' onerror=alert(1)>)
            if (attributeName.indexOf('on') == 0)
                element.removeAttribute(attributeName);

            // Remove insecure src/href attribute with value starting "javascript:*" (example: href="javascript:alert(1)")
            else if ((attributeName == 'src' || attributeName == 'href') && attributeValue.indexOf('javascript:') == 0)
                element.removeAttribute(attributeName);

            // For non-specific tags remove insecure src/data attribute with value starting "data:*" (example: <embed src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">)
            else if (['audio', 'image', 'img', 'source', 'video'].indexOf(tagName) == -1 && (attributeName == 'src' || attributeName == 'data') && attributeValue.indexOf('data:') == 0)
                element.removeAttribute(attributeName);
        }
    }

    return div.innerHTML;
}

// Export as VUE.js plugin with directives v-html-remove, v-html-escape, v-html-safe
// Usage example: 
// import VueSecureHTML from 'VueSecureHTML.js';
// Vue.use(VueSecureHTML);
// <teplate><div v-html-remove="message"></div><div v-html-escape="message"></div><div v-html-safe="message"></div></teplate>

// See directive hooks difference between Vue 2.x and Vue 3.x: https://v3-migration.vuejs.org/breaking-changes/custom-directives.html

module.exports = {
    install : function (Vue, options) {

        Vue.directive('html-remove', {
            // For Vue 2.x
            inserted : function (el, binding) {
                el.innerHTML = removeHTML(binding.value);
            },

            // For Vue 3.x
            mounted : function (el, binding) {
                el.innerHTML = removeHTML(binding.value);
            },

            // For Vue 2.x
            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = removeHTML(binding.value);
            },

            // For Vue 3.x
            updated : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = removeHTML(binding.value);
            },
        });

        Vue.directive('html-escape', {
            // For Vue 2.x
            inserted : function (el, binding) {
                el.innerHTML = escapeHTML(binding.value);
            },

            // For Vue 3.x
            mounted : function (el, binding) {
                el.innerHTML = escapeHTML(binding.value);
            },

            // For Vue 2.x
            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = escapeHTML(binding.value);
            },

            // For Vue 3.x
            updated : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = escapeHTML(binding.value);
            },
        });

        Vue.directive('html-safe', {
            // For Vue 2.x
            inserted : function (el, binding) {
                el.innerHTML = safeHTML(binding.value);
            },

            // For Vue 3.x
            mounted : function (el, binding) {
                el.innerHTML = safeHTML(binding.value);
            },

            // For Vue 2.x
            update : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = safeHTML(binding.value);
            },

            // For Vue 3.x
            updated : function (el, binding) {
                if (binding.value !== binding.oldValue)
                    el.innerHTML = safeHTML(binding.value);
            },
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
