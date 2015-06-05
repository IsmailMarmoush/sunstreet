/*
<Sunstreet is a Responsive SPA blog template >
    Copyright (C) <2015>  <Ismail marmoush>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* jshint devel:true */
/* jshint -W098 */
/* global Lorem */
/* global routie */
/* global hljs */
/* global DISQUS */
/* global disqusReset */

console.log('\'Ello \'Ello!');

/********* Objects *********/
// Selectors take normal name
// Classes take trailing 'Class', e.g gradientClass

var Config = {
    contentJson: 'content.json',
    title: 'Marmoush.com/',

    // Header
    headerImg: '#headerImg',
    gradientContainer: '#gradientContainer',
    gradientClass: 'gradient',

    // Content
    content: '#content',
    // Bars
    bar: '#bar',
    rsb: '#rsb',
    lsb: '#lsb',
    menuIcon: '#menuIcon',
    contentIcon: '#contentIcon',

    // Container
    slider: '#slider',
    slides: '#slides',
    blog: '#blog',
    post: '#post',

    // Disqus
    disqusThread: '#disqus_thread',
    enableDisqus: true,

    // Errors
    errorId: '#error'
};
var Backend = {};
var Utils = {};
var Animation = {};
var Comments = {};
var Content = {};
var GithubApi = {};
/******************** Utilities **************************/

Utils.getHash = function() {
    'use strict';
    var url = window.location.hash;
    var hash = url.substring(url.indexOf('#') + 1);
    return hash;
};
Utils.isGithubApiLink = function(url) {
    'use strict';
    if (Utils.startsWith(url, 'https://api.github.com/repos')) {
        return true;
    } else {
        return false;
    }
};
// TODO
Utils.selectMenu = function() {
    'use strict';
    //$(Config.lsb + ' li').removeClass('selected');
    //$(Config.lsb + ' a[href^="#' + val.url + '"]').parent().addClass('selected');
};

Utils.fitSize = function(src, dest) {
    'use strict';
    $(dest).height($(src).height());
    $(dest).width($(src).width());
};

Utils.fitGradientToImg = function() {
    'use strict';
    console.log('Fitting gradient size to header img size');
    Utils.fitSize(Config.headerImg, Config.gradientContainer);
};

Utils.gradientInit = function() {
    'use strict';
    $.each([Config.headerImg, window], function(k, v) {
        $(v).resize(function() {
            Utils.fitGradientToImg();
        });
    });
};

Utils.showErrorMsg = function(msg) {
    'use strict';
    // TODO Add some UX
    $(Config.errorId).html();
};

Utils.startsWith = function(str, val) {
    'use strict';
    if (str !== undefined && str.indexOf(val, 0) === 0) {
        return true;
    } else {
        return false;
    }
};

/******************** App Animation **************************/


Animation.smoothScrolling = function() {
    'use strict';
    $('#rsb a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 50
        }, 900, 'swing', function() {
            // commenting this will prevent the url to be changed
            //window.location.hash = target;
        });
    });
};

Animation.scrollTo = function(element) {
    'use strict';
    $('html, body').animate({
        scrollTop: $(element).offset().top - 200
    }, 900);
};

Animation.toggleLeftSidebar = function(selectors) {
    'use strict';
    var bc = 'moveContentRight';
    var lsb = 'moveLSB';

    $.each(selectors, function(key, val) {
        $(val).click(function() {
            $(Config.bar).toggleClass(bc);
            $(Config.content).toggleClass(bc);
            $(Config.lsb).toggleClass(lsb);
            if ($(Config.content).hasClass(bc)) {
                $(Config.content).one('click', function() {
                    $(Config.bar).removeClass(bc);
                    $(Config.content).removeClass(bc);
                    $(Config.lsb).removeClass(lsb);
                });
            }
        });
    });
};

Animation.toggleRightSidebar = function(selectors) {
    'use strict';
    var bc = 'moveContentLeft';
    var rsb = 'moveRSB';
    $.each(selectors, function(key, val) {
        $(val).click(function() {
            $(Config.bar).toggleClass(bc);
            $(Config.rsb).toggleClass(rsb);
            if ($(Config.rsb).hasClass(rsb)) {
                $(Config.content).one('click', function() {
                    $(Config.bar).removeClass(bc);
                    $(Config.rsb).removeClass(rsb);
                });
            }
        });
    });
};
/*************** END App Animation ************/

/*************** Comment System ************/

Comments.disqusReload = function(enableDisqus, disqusIdentifier, language, title) {
    'use strict';
    if (language === undefined) {
        language = 'en';
    }

    if (enableDisqus) {
        $(Config.disqusThread).show();
        disqusReset(disqusIdentifier, location.origin + disqusIdentifier, title, language);
    } else {
        $(Config.disqusThread).hide();
    }
};

/************** End Comment System ***********/



/******************** Content Manipulation **************************/
Content.markdown = function(md, callback) {
    'use strict';
    var options = {
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    };
    marked(md, options, function(err, output) {
        if (err) {
            throw err;
        }
        callback(output);
    });
};

Content.runToc = function(container) {
    'use strict';
    container = typeof container !== 'undefined' ? container : '#post';
    $(Config.rsb).toc({
        'selectors': 'h1,h2,h3,h4,h5,h6',
        'container': container,
        'smoothScrolling': false,
        'prefix': 'toc',
        'onHighlight': function(el) {},
        'highlightOnScroll': true,
        'highlightOffset': 100,
        'anchorName': function(i, heading, prefix) {
            return prefix + i;
        },
        'headerText': function(i, heading, $heading) {
            return $heading.text();
        }
    });
};

Content.fillSlider = function(data) {
    'use strict';
    var blog = data.blog;
    $.each(blog, function(key, val) {
        // fill slides
        console.log(val.url);
        var img = '<img src="' + val.thumb + '" />';
        var p = '<p>' + val.header.title + '</p>';
        var p2 = '<p>' + val.date + '</p>';
        var li = '<li><a href="#' + val.url + '">' + img + p + p2 + '</a></li>';
        $(li).appendTo(Config.slides);
    });
};

Content.updateBrowserTitle = function(title) {
    'use strict';
    document.title = title;
};

Content.setHeaderImg = function(imgSrc, addGradient, title, subtitle) {
    'use strict';
    $(Config.headerImg).attr('src', imgSrc);
    Utils.fitGradientToImg();
    if (Config.headerImg && addGradient) {
        $(Config.gradientContainer).addClass(Config.gradientClass);
    } else {
        $(Config.gradientContainer).removeClass(Config.gradientClass);
    }
    // Update Header Title
    if (title) {
        title = '';
    }
    if (subtitle) {
        subtitle = '';
    }
    //    $('#title').text(title);
    //    $('#subtitle').text(subtitle);
};


Content.reloadPage = function(val) {
    'use strict';
    $(Config.rsb).show();
    $(Config.contentIcon).show();
    Content.updateBrowserTitle(Config.title + val.header.title);
    Backend.loadContent(val.url, function(data) {
        Content.setHeaderImg(val.header.img, val.header.addGradient, val.header.title, val.header.subtitle);
        Content.markdown(data, function(compiledMarkdown) {
            $(Config.post).html(compiledMarkdown);
            $('pre').addClass('hljs');
        });
        Content.runToc();
        Animation.smoothScrolling();
        Comments.disqusReload(val.disqus.enable, val.disqus.identifier, val.disqus.lang, document.title);
    });

};

Content.routes = function(data) {
    'use strict';
    var gh = data.global.header;
    var blog = data.blog;
    var pages = data.pages;
    var urls = {};
    $.each(blog, function(key, val) {
        // Routing listener
        urls[val.url] = function() {
            $(Config.post).html('');
            $(Config.slides).fadeOut(500, function() {
                $(Config.blog).fadeIn(500, function() {
                    Content.reloadPage(val);
                });
            });
        };
    });

    $.each(pages, function(key, val) {
        urls[val.url] = function() {
            console.log('Showing page:' + val.url);
            $(Config.post).html('');
            $(Config.slides).fadeOut(500, function() {
                $(Config.blog).fadeIn(500, function() {
                    Content.reloadPage(val);
                });
            });
        };
    });

    urls[''] = function() {
        $(Config.post).html('');
        $(Config.rsb).hide();
        $(Config.contentIcon).hide();
        Content.updateBrowserTitle(Config.title);
        Content.setHeaderImg(gh.img, gh.addGradient, gh.title, gh.subtitle);
        $(Config.blog).fadeOut(500, function() {
            $(Config.slides).fadeIn(500, function() {
                Utils.fitGradientToImg();
            });
        });
    };
    routie(urls);
};
/******************* Github API ****************/
GithubApi.loadReadme = function(path, callback) {
    'use strict';
    $.ajax({
        url: path,
        dataType: 'json',
        type: 'GET',
        async: true,
        statusCode: {
            404: function(response) {

            },
            200: function(response) {
                // Decoding base64
                var d = window.atob(response.content);
                callback(d);
            }
        },
        error: function(jqXHR, status, errorThrown) {
            Utils.showErrorMsg(jqXHR + ':' + status + ':' + ':' + errorThrown);
        }
    });
};

/******************* Backend ********************/

Backend.loadJson = function(path, callback) {
    'use strict';
    $.getJSON(path, function(data) {
        callback(data);
    });
};

Backend.loadContent = function(url, callback) {
    'use strict';
    if (Utils.isGithubApiLink(url)) {
        GithubApi.loadReadme(url, function(data) {
            callback(data);
        });
    } else {
        $('<div></div>').load(url, function(data, status, xhr) {
            if (status === 'error') {
                var msg = 'Sorry but there was an error: ';
                Utils.showErrorMsg(msg + xhr.status + ' ' + xhr.statusText);
            }
            if (status === 'success') {
                callback(data);
            }
        });
    }
};

//function sideBarOpened
$(document).ready(function() {
    'use strict';
    console.log('loading routes, filling sliders');

    Backend.loadJson(Config.contentJson, function(data) {
        Content.routes(data);
        Content.fillSlider(data);
    });

    Animation.toggleLeftSidebar([Config.menuIcon, Config.lsb]);
    Animation.toggleRightSidebar([Config.contentIcon, Config.rsb]);
    Animation.smoothScrolling();
    Utils.gradientInit();
});