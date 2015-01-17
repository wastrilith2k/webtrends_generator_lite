// Define data that will be send with requests
var queryData = {
  suppress_error_codes:true
};
var baseUrl = "https://ws.webtrends.com/v3/Reporting/profiles/";
var currentUrl = "https://ws.webtrends.com/v3/Reporting/profiles/";
var updateElm = "profile";

$(document).ready(function () {
  // Bind Login
  $("#loginsubmit").click(loginInit);
  // Bind profile change
  $("#profile").change(profileChange);
  // Bind report change
  $("#report").change(reportChange);
});

// Define other events
function errorHandler(request, textStatus, errorThrown) {
  console.log(request.responseText);
  console.log(textStatus);
  console.log(errorThrown);
}
function loginInit() {
  $("#loginform").hide();
  getData();
  $("#theguts").show();
}

function responseRouter(jsonData) {
  switch(updateElm){
    case 'measures':
      // Clear current
      $("#measures").find('option').remove();
      for (i = 0; i < jsonData.definition.measures.length; i++) {
        var odv = $('<option></option>').val(jsonData.definition.measures[i].ID).html(jsonData.definition.measures[i].name);
        $("#measures").append(odv);
      }
      $("#sortby").find('option').remove();
      for (i = 0; i < jsonData.definition.measures.length; i++) {
        var odv = $('<option></option>').val(encodeURIComponent(jsonData.definition.measures[i].name.toLower())).html(jsonData.definition.measures[i].name);
        $("#sortby").append(odv);
      }
      break;
    default:
      // Clear current
      $("#" + updateElm).find('option').remove();
      for (i = 0; i < jsonData.length; i++) {
        var odv = $('<option></option>').val(jsonData[i].ID).html(jsonData[i].name);
        $("#" + updateElm).append(odv);
      }
      break;
  }
}

function profileChange() {
  updateElm = "report";
  currentUrl = baseUrl + $("#profile").val() + "/reports";
  updateURL();
  getData();
}

function reportChange() {
  updateElm = "measures";
  currentUrl = baseUrl + $("#profile").val() + "/reports/" + $("#report").val();
  updateURL();
  getData();
}

function serialize(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

function updateURL(){
  var params = {};
  // Go through param fields
  if ($('#format').val() != '') params.format = $('#format').val();
  if ($('#language').val() != '') params.language = $('#language').val();
  if ($('#period_type').val() != '') params.period_type = $('#period_type').val();
  if ($('#query').val() != '') params.query = encodeURIComponent($('#query').val());

}

function getData() {
  user = $("#acct").val() + '\\' + $("#user").val();
  $.ajax({
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    dataType: "jsonp",
    contentType: "application/javascript",
    data: queryData,
    async: false,
    crossDomain: true,
    url: currentUrl,
    success: responseRouter,
    error: errorHandler,
    username: user,
    password: $("#pass").val()
  });
}