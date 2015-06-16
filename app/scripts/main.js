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
var configContent = {};
var configApp = {};
var Backend = {};
var Utils = {};
var Animation = {};
var Comments = {};
var Content = {};
var GithubApi = {};
var GoogleApi = {};
var DisqusApi = {};
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
  //$(configApp.lsbId + ' li').removeClass('selected');
  //$(configApp.lsbId + ' a[href^="#' + val.url + '"]').parent().addClass('selected');
};

Utils.fitSize = function(src, dest) {
  'use strict';
  $(dest).height($(src).height());
  $(dest).width($(src).width());
};

Utils.fitGradientToImg = function() {
  'use strict';
  console.log('Fitting gradient size to header img size');
  Utils.fitSize(configApp.headerImgId, configApp.gradientContainerId);
};

Utils.gradientInit = function() {
  'use strict';
  $.each([configApp.headerImgId, window], function(k, v) {
    $(v).resize(function() {
      Utils.fitGradientToImg();
    });
  });
};

Utils.showErrorMsg = function(msg) {
  'use strict';
  // TODO Add some UX
  $(configApp.errorId).html();
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
  $(configApp.rsbId + ' a[href^="#"]').on('click', function(e) {
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

Animation.toggleLeftSidebar = function() {
  'use strict';
  var bc = 'moveContentRight';
  var lsb = 'moveLSB';

  $.each([configApp.menuIconId, configApp.lsbId], function(key, val) {
    $(val).click(function() {
      $(configApp.barId).toggleClass(bc);
      $(configApp.contentId).toggleClass(bc);
      $(configApp.lsbId).toggleClass(lsb);
      if ($(configApp.contentId).hasClass(bc)) {
        $(configApp.contentId).one('click', function() {
          $(configApp.barId).removeClass(bc);
          $(configApp.contentId).removeClass(bc);
          $(configApp.lsbId).removeClass(lsb);
        });
      }
    });
  });
};

Animation.toggleRightSidebar = function() {
  'use strict';
  var bc = 'moveContentLeft';
  var rsb = 'moveRSB';
  $.each([configApp.contentIconId, configApp.rsbId], function(key, val) {
    $(val).click(function() {
      $(configApp.barId).toggleClass(bc);
      $(configApp.rsbId).toggleClass(rsb);
      if ($(configApp.rsbId).hasClass(rsb)) {
        $(configApp.contentId).one('click', function() {
          $(configApp.barId).removeClass(bc);
          $(configApp.rsbId).removeClass(rsb);
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
    $(configApp.disqusThreadId).show();
    disqusReset(disqusIdentifier, location.origin + disqusIdentifier, title, language);
  } else {
    $(configApp.disqusThreadId).hide();
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
  container = typeof container !== 'undefined' ? container : configApp.postId;
  $(configApp.rsbId).toc({
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

Content.fillSlider = function() {
  'use strict';
  $.each(configContent.blog, function(key, val) {
    // fill slides
    console.log(val.url);
    var img = '<img src="' + val.thumb + '" />';
    var p = '<p>' + val.header.title + '</p>';
    var p2 = '<p>' + val.date + '</p>';
    var li = '<li><a href="#' + val.url + '">' + img + p + p2 + '</a></li>';
    $(li).appendTo(configApp.slidesId);
  });
};

Content.updateBrowserTitle = function(title) {
  'use strict';
  document.title = title;
};

Content.setHeaderImg = function(imgSrc, addGradient, title, subtitle) {
  'use strict';
  $(configApp.headerImgId).attr('src', imgSrc);
  Utils.fitGradientToImg();
  if (configApp.headerImgId && addGradient) {
    $(configApp.gradientContainerId).addClass(configApp.gradientClass);
  } else {
    $(configApp.gradientContainerId).removeClass(configApp.gradientClass);
  }
  // Update Header Title
  if (title) {
    title = '';
  }
  if (subtitle) {
    subtitle = '';
  }
};


Content.reloadPage = function(val) {
  'use strict';
  $(configApp.rsb).show();
  $(configApp.contentIconId).show();
  Content.updateBrowserTitle(configContent.title + val.header.title);
  Backend.loadContent(val.url, function(data) {
    Content.setHeaderImg(val.header.img, val.header.addGradient, val.header.title, val.header.subtitle);
    Content.markdown(data, function(compiledMarkdown) {
      $(configApp.postId).html(compiledMarkdown);
      $('pre').addClass('hljs');
    });
    Content.runToc();
    Animation.smoothScrolling();
    Comments.disqusReload(val.disqus.enable, val.disqus.identifier, val.disqus.lang, document.title);
  });

};

Content.routes = function() {
  'use strict';

  var urls = {};
  $.each(configContent.blog, function(key, val) {
    // Routing listener
    urls[val.url] = function() {
      $(configApp.postId).html('');
      $(configApp.slidesId).fadeOut(500, function() {
        $(configApp.blogId).fadeIn(500, function() {
          Content.reloadPage(val);
        });
      });
    };
  });

  $.each(configContent.pages, function(key, val) {
    urls[val.url] = function() {
      console.log('Showing page:' + val.url);
      $(configApp.postId).html('');
      $(configApp.slidesId).fadeOut(500, function() {
        $(configApp.blogId).fadeIn(500, function() {
          Content.reloadPage(val);
        });
      });
    };
  });

  urls[''] = function() {
    $(configApp.postId).html('');
    $(configApp.rsbId).hide();
    $(configApp.contentIconId).hide();
    Content.updateBrowserTitle(configApp.title);
    Content.setHeaderImg(configContent.global.header.img, configContent.global.header.addGradient, configContent.global.header.title, configContent.global.header.subtitle);
    $(configApp.blogId).fadeOut(500, function() {
      $(configApp.slidesId).fadeIn(500, function() {
        Utils.fitGradientToImg();
      });
    });
  };
  routie(urls);
};

Content.leftSideBarInit = function() {
  'use strict';
  $(configApp.lsbId + ' > img').attr('src', configContent.bar.logoPath);
  $(configApp.lsbId + ' > span').html(configContent.bar.information);
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

/******************* Google API ****************/

/* jshint ignore:start */
GoogleApi.analytics = function() {
  'use strict';
  (function(b, o, i, l, e, r) {
    b.GoogleAnalyticsObject = l;
    b[l] || (b[l] =
      function() {
        (b[l].q = b[l].q || []).push(arguments)
      });
    b[l].l = +new Date;
    e = o.createElement(i);
    r = o.getElementsByTagName(i)[0];
    e.src = '//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e, r)
  }(window, document, 'script', 'ga'));
  console.log("Init Google Analytics Id:" + configContent.global.googleAnalyticsId);
  ga('create', configContent.global.googleAnalyticsId);
  ga('send', 'pageview', '/' + window.location.hash);
};
/* jshint ignore:end */

/******************* Disqus API ****************/
/* jshint ignore:start */
DisqusApi.init = function() {
  'use strict';

  console.log('loading disqus');
  console.log('Init Disqus Shortname:' + configContent.global.disqusShortname);
  var disqus_shortname = configContent.global.disqusShortname;
  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();

  /* * * Disqus Reset Function * * */
  var disqusReset = function(newIdentifier, newUrl, newTitle, newLanguage) {
    DISQUS.reset({
      reload: true,
      config: function() {
        this.page.identifier = newIdentifier;
        this.page.url = newUrl;
        this.page.title = newTitle;
        this.language = newLanguage;
      }
    });
  };
  console.log('end loading disqus');
};
/* jshint ignore:end */

/******************* Initialization ****************/
$(document).ready(function() {
  'use strict';
  console.log('loading routes, filling sliders');

  Backend.loadJson('config-app.json', function(data) {
    configApp = data;

    Backend.loadJson('config-content.json', function(data) {
      configContent = data;
      Content.routes();
      Content.fillSlider();
      Content.leftSideBarInit();
      Animation.toggleLeftSidebar();
      Animation.toggleRightSidebar();
      Animation.smoothScrolling();
      Utils.gradientInit();
      GoogleApi.analytics();
      DisqusApi.init();
    });
  });

});
