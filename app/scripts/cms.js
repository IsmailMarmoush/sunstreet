/* jshint devel:true */
/* jshint -W098 */
/* global jsonlint */
var configApp = {};
configApp.globalId = '#global';
configApp.resultId = '#result';
configApp.sourceId = '#source';
/******************* Initialization ****************/
var Jsn = {};
Jsn.validate = function() {
  'use strict';
  $('#validateBtn').click(function() {
    console.log('hello world');
    try {
      var result = jsonlint.parse($(configApp.sourceId).val());
      if (result) {
        $(configApp.resultId).html('JSON is valid!');
        $(configApp.resultId).attr('class', 'pass');
        // $(configApp.sourceId).val(JSON.stringify(result, null, '  '));

      }
    } catch (e) {
      $(configApp.resultId).html(e);
      $(configApp.resultId).attr('class', 'fail');
    }
  });
};
$(document).ready(function() {
  'use strict';
  Jsn.validate();


});
