# vue-html-secure [![](https://img.shields.io/npm/v/vue-html-secure.svg)](https://www.npmjs.com/package/vue-html-secure)

Vue.js plugin to add HTML secure directives `v-html-remove`, `v-html-escape`, `v-html-safe` which are secure alternatives to official `v-html`. Using official `v-html` can easily lead to XSS attacks and must be used on trusted content only and never on user-provided content. Most popular JavaScript libraries to sanitize HTML string are too huge (from several hundred KB to several MB) with lot of dependencies. This plugin is lightweight (only 2kB packed size) without dependency. The main feature is to secure HTML string to avoid XSS attacks such as `<img src='' onerror=alert('XSS!')>` or `<a href="javascript:alert('XSS!')"></a>`.

## Install

To install with npm or yarn, use

```shell
npm install --save vue-html-secure

// or

yarn add vue-html-secure
```

## Directives and functions

### v-html-safe="..." or $safeHTML(...)

This leaves all HTML tags except for &lt;script&gt; and removes insecure elements's attributes starting "on*" and also values starting "javascript:*".

### v-html-escape="..." or $escapeHTML(...)

This replaces chars `<`, `>`, `$` to appropriate HTML entities `&lt;`, `&gt;`, `&amp;`. This does not escape single or double quotes for string usage in HTML attribute (it is not aim of this plugin to do that).

### v-html-remove="..." or $removeHTML(...)

This removes all HTML tags but preserves it's text content. Note that in case `v-html-remove` you can directly use official `v-text`. But using function can have sense e.g. `message : 'My <b>secure part</b> and user-provided insecure part: ' + this.$removeHTML(...)`.

## Usage

```js
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

// Optional
// Vue.prototype.$safeHTML = VueSecureHTML.safeHTML;
// Vue.prototype.$escapeHTML = VueSecureHTML.escapeHTML;
// Vue.prototype.$removeHTML = VueSecureHTML.removeHTML;

new Vue({
    el: '#app',
    data: {
        message : "Hello <img src='' onerror=alert('XSS!')> VUE",
    },
});
```

Example 01

```html
<div v-html-safe="message"></div>>
<div v-html-escape="message"></div>
<div v-html-remove="message"></div>
```

Example 02

```html
<div>{{ $safeHTML(message) }}</div>
<div>{{ $escapeHTML(message) }}</div>
<div>{{ $removeHTML(message) }}</div>
```

Example 03

```js
new Vue({
    el: '#app',
    data: {
        message : 'My <b>secure part</b> and user-provided insecure part: ' +
                   this.$safeHTML("<img src='' onerror=alert('XSS!')>"),
    },
});
```

```html
<!-- node official v-html here -->
<div v-html="message"></div>
```

> Note 1: This is for **Vue.js 2.x** only.

> Note 2: In future releases will be added whitelist and blacklist of HTML tags.
