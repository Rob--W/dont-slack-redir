'use strict';

// This script runs in the scope of the web page.

(function() {
    function getRealLinkFromSlackRedirUrl(a) {
        if (a.protocol !== 'https:' && a.protocol !== 'http:') {
            return;
        }
        if (a.hostname === 'slack-redir.net' && a.pathname === '/link') {
            let [ , url ] = /[?&]url=([^&]+)/.exec(a.search) || ['', ''];
            url = decodeURIComponent(url);
            if (/^https?:/i.test(url)) {
                return url;
            }
        }
    }

    var proto = HTMLAnchorElement.prototype;
    // The link target can be changed in many ways, but let's only consider
    // the .href attribute since it's probably the only used setter.
    var hrefProp = Object.getOwnPropertyDescriptor(proto, 'href');
    var hrefGet = Function.prototype.call.bind(hrefProp.get);
    var hrefSet = Function.prototype.call.bind(hrefProp.set);

    Object.defineProperty(proto, 'href', {
        configurable: true,
        enumerable: true,
        get() {
            return hrefGet(this);
        },
        set(v) {
            hrefSet(this, v);
            try {
                v = getRealLinkFromSlackRedirUrl(this);
                if (v) {
                    hrefSet(this, v);
                    this.referrerPolicy = 'no-referrer';
                }
            } catch (e) {
                // Not expected to happen, but don't break the setter if for
                // some reason the (hostile) page broke the link APIs.
            }
        },
    });
    var setAttribute = Function.prototype.call.bind(proto.setAttribute);
    proto.setAttribute = function(name, value) {
        // Attribute names are not case-sensitive, but weird capitalizations
        // are unlikely, so only check all-lowercase and all-uppercase.
        if (name === 'href' || name === 'HREF') {
            // Trigger our setter.
            this.href = value;
        } else {
            setAttribute(this, name, value);
        }
    };

    // Fix up existing links.
    for (let a of document.querySelectorAll('a[href^="https://slack-redir"]')) {
        // Trigger our setter.
        a.href += '';
    }
})();

// We do intentionally not monitor via click events or Mutation Observers,
// because this logic is designed to hook up at the place where Slack updates
// the links. If the logic ever proves insufficient, then the breakage should
// be obvious and this code can quickly be updated in response to that.
