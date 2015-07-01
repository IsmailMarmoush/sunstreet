/* jshint devel:true */
/* jshint -W098 */
/* global jsonlint */
var configApp = {
  resultId: '#result',
  globalId: '#global',
  footerId: '#footer',
  postsId: '#posts',
  pagesId: '#pages',
  contactsId: '#contacts',

  postTempId: '#postTemp',
  pageTempId: '#pageTemp',
  contactTempId:'#contactTemp',

  // Selectors
  sourceTxtareaSel: '#source > textarea',
  globalSlc: 'section[id=global]',
  footerSlc: 'section[id=footer]',
  // multi selectors
  pagesSlc: 'section[id=pages] > div',
  postsSlc: 'section[id=posts] > div',
  contactsSlc: 'section[id=contacts] > div',

  // Buttons
  validateBtnId: '#validateBtn',
  toSettingsBtnId: '#toSettingsBtn',
  toJSONBtnId: '#toJSONBtn',
  newPageId: '#newPage',
  newPostId: '#newPost',
  newContactId:'#newContact'
};
var Jsn = {};
var Actions = {};




/******************* Initialization ****************/

Jsn.validate = function() {
  'use strict';
  try {
    var result = jsonlint.parse($(configApp.sourceTxtareaSel).val());
    if (result) {
      $(configApp.resultId).html('JSON is valid!, you can copy it to your content.json file');
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
  var textareas = $(slc).find('span > textarea');
  var numbers = $(slc).find('span > input[type=number]');
  var checkboxes = $(slc).find('span > input[type=checkbox]');
  var dates = $(slc).find('span > input[type=date]');
  inputs.each(function() {
    divData[$(this).attr('name')] = $(this).val();
  });
  textareas.each(function() {
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

  jsonData.footer = Jsn.extract(configApp.footerSlc);

  jsonData.contacts = Jsn.extractN(configApp.contactsSlc);
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
    $(destSlc).find('span > textarea[name=' + index + ']').each(function() {
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

  Jsn.import(d.footer, configApp.footerSlc);

  $(configApp.postsId).empty();
  $(configApp.pagesId).empty();
  $(configApp.contactsId).empty();

  $.each(d.contacts, function(k, v) {
    Actions.addNewContact();
    Jsn.import(v, $(configApp.contactsSlc)[k]);
  });

  $.each(d.posts, function(k, v) {
    Actions.addNewPost();
    Jsn.import(v, $(configApp.postsSlc)[k]);
  });

  $.each(d.pages, function(k, v) {
    Actions.addNewPage();
    Jsn.import(v, $(configApp.pagesSlc)[k]);
  });
  Actions.removeBtnAction();


  return d;
};

Actions.removeBtnAction = function() {
  'use strict';
  $('button[name=remove]').click(function() {
    $(this).parent().parent().remove();
  });
};

Actions.addNewContact = function() {
  'use strict';
  $(configApp.contactsId).append($(configApp.contactTempId).html());
  Actions.removeBtnAction();
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
  $(configApp.newContactId + ' > button').click(function() {
    Actions.addNewContact();
  });
  $(configApp.newPageId + ' > button').click(function() {
    Actions.addNewPage();
  });
  $(configApp.newPostId + ' > button').click(function() {
    Actions.addNewPost();
  });

  $.getJSON('content.json', function(data) {
    $(configApp.sourceTxtareaSel).val(JSON.stringify(data));
    Jsn.toSettings();
  });

});
