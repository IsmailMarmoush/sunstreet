/* jshint devel:true */
/* jshint -W098 */
/* global jsonlint */
var configApp = {};
var Jsn = {};
var Actions = {};

configApp.resultId = '#result';
configApp.globalId = '#global';
configApp.barId = '#bar';
configApp.postsId = '#posts';
configApp.postTempId = '#postTemp';
configApp.pagesId = '#pages';
configApp.pageTempId = '#pageTemp';
configApp.newPageId = '#newPage';
configApp.newPostId = '#newPost';

// Selectors
configApp.sourceTxtareaSel = '#source > textarea';
configApp.globalSlc = 'section[id=global]';
configApp.barSlc = 'section[id=bar]';
configApp.pagesSlc = 'section[id=pages] > div';
configApp.postsSlc = 'section[id=posts] > div';

// Buttons
configApp.validateBtnId = '#validateBtn';
configApp.toSettingsBtnId = '#toSettingsBtn';
configApp.toJSONBtnId = '#toJSONBtn';


/******************* Initialization ****************/

Jsn.validate = function() {
  'use strict';
  try {
    var result = jsonlint.parse($(configApp.sourceTxtareaSel).val());
    if (result) {
      $(configApp.resultId).html('JSON is valid!, you can copy it to your config-content.json file');
      $(configApp.resultId).attr('class', 'pass');
      $(configApp.sourceTxtareaSel).val(JSON.stringify(result, null, '  '));

    }
  } catch (e) {
    $(configApp.resultId).html(e);
    $(configApp.resultId).attr('class', 'fail');
  }
};

Jsn.extract = function(slc) {
  'use strict';
  var divData = {};
  var inputs = $(slc).find('span > input[type=text]');
  var numbers = $(slc).find('span > input[type=number]');
  var checkboxes = $(slc).find('span > input[type=checkbox]');
  var dates = $(slc).find('span > input[type=date]');
  inputs.each(function() {
    divData[$(this).attr('name')] = $(this).val();
  });
  numbers.each(function() {
    divData[$(this).attr('name')] = $(this).val();
  });
  checkboxes.each(function() {
    divData[$(this).attr('name')] = this.checked;
  });
  dates.each(function() {
    divData[$(this).attr('name')] = $(this).val();
  });
  return divData;
};

Jsn.extractN = function(selector) {
  'use strict';
  var data = {};
  $(selector).each(function(i) {
    data[i] = {};
    data[i] = Jsn.extract(this);
  });
  return data;
};

Jsn.toJSON = function() {
  'use strict';
  var jsonData = {};

  jsonData.global = Jsn.extract(configApp.globalSlc);
  jsonData.bar = Jsn.extract(configApp.barSlc);
  jsonData.pages = Jsn.extractN(configApp.pagesSlc);
  jsonData.posts = Jsn.extractN(configApp.postsSlc);
  $(configApp.sourceTxtareaSel).val(JSON.stringify(jsonData));
  Jsn.validate();
  return jsonData;
};

Jsn.import = function(dataSrc, destSlc) {
  'use strict';
  $.each(dataSrc, function(index, value) {
    $(destSlc).find('span > input[name=' + index + ']').each(function() {
      if ($(this).attr('type') === 'checkbox') {
        this.checked = value;
      } else {
        $(this).val(value);
      }
    });
  });
};
Jsn.toSettings = function() {
  'use strict';
  Jsn.validate();
  var d = jQuery.parseJSON($(configApp.sourceTxtareaSel).val());
  Jsn.import(d.global, configApp.globalSlc);
  Jsn.import(d.bar, configApp.barSlc);
  $.each(d.posts, function(k, v) {
    Actions.addNewPost();
    Jsn.import(v, configApp.postsSlc);
  });

  $.each(d.pages, function(k, v) {
    Actions.addNewPage();
    Jsn.import(v, configApp.pagesSlc);
  });
  Actions.removeBtnAction();
};

Actions.removeBtnAction = function() {
  'use strict';
  $('button[name=remove]').click(function() {
    $(this).parent().parent().remove();
  });
};

Actions.addNewPage = function() {
  'use strict';
  $(configApp.pagesId).append($(configApp.pageTempId).html());
  Actions.removeBtnAction();
};
Actions.addNewPost = function() {
  'use strict';
  $(configApp.postsId).append($(configApp.postTempId).html());
  Actions.removeBtnAction();
};

$(document).ready(function() {
  'use strict';
  // init button listeners
  $(configApp.validateBtnId).click(Jsn.validate);
  $(configApp.toJSONBtnId).click(Jsn.toJSON);
  $(configApp.toSettingsBtnId).click(Jsn.toSettings);
  $(configApp.newPageId + ' > button').click(function() {
    Actions.addNewPage();
  });
  $(configApp.newPostId + ' > button').click(function() {
    Actions.addNewPost();
  });

  $.getJSON('config-content.json', function(data) {
    console.log('hello');
    $(configApp.sourceTxtareaSel).val(JSON.stringify(data));
    Jsn.toSettings();
  });

});
