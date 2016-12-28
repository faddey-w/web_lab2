'use strict';

window.wl2 = (function($, undefined) {

    var pages = {
        index: {title: 'Main page'},
        form: {title: 'Form'},
        gallery: {title: 'Gallery'}
    };
    var current_page = null;
    var html_cache = {};

    function init() {
        $(document).on('click', 'a', null, function (evt) {
            var page_id = PageId.parse($(this).attr('href'));
            if (page_id && page_id in pages) {
                evt.stopPropagation();
                evt.preventDefault();
                goto(page_id);
            }
        });
        $(window).bind('popstate', function(evt) {
            evt = evt.originalEvent;
            if (evt.state && evt.state.page_id) {
                current_page = null;
                goto(evt.state.page_id);
            }
        });
        return setup_html($('body'), '../fragments/base.html');
    }

    function goto(page) {
        return setup_html($('#site-content'), PageId.to_fragment_url(page))
        .then(function() {
            $('title').text('WEB Lab2 - ' + pages[page].title);
            if (current_page) {
                window.history.pushState({page_id: page}, '', PageId.to_page_url(page));
            } else {
                window.history.replaceState({page_id: page}, '', window.location.href);
            }
            current_page = page;
        });
    }

    var PageId = {
        parse: function(page_url) {
            if (page_url.startsWith('../site/') && page_url.endsWith('.html')) {
                return page_url.substring('../site/'.length, page_url.length - '.html'.length);
            } else {
                return null;
            }
        },
        to_fragment_url: function(page_id) {
            return '../fragments/' + page_id + '.html';
        },
        to_page_url: function(page_id) {
            return '../site/' + page_id + '.html';
        }
    };

    return {
        init: init,
        goto: goto
    };

    function setup_html($root, url) {
        if (url in html_cache) {
            return new Promise(function(resolve) {
                resolve();
            }).then(do_setup);
        } else {
            return $.get(url).then(function (html) {
                html_cache[url] = html;
                do_setup();
            })
        }

        function do_setup() {
            $root.html(html_cache[url]);
        }
    }


})(jQuery);
