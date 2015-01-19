// Define data that will be send with requests
var queryData = {
  suppress_error_codes:true
};
var baseUrl = "https://ws.webtrends.com/v3/Reporting/profiles/";
var currentUrl = "https://ws.webtrends.com/v3/Reporting/profiles/";
var updateElm = "profile";
var minDate = '';
var maxDate = '';

$(document).ready(function ()
{
    // Bind Login
    $("#loginsubmit").click(loginInit);
    // Bind profile change
    $("#profile").change(profileChange);
    // Bind report change
    $("#report").change(reportChange);
    $("#date_dynamic").change(function ()
    {
        if ($("#date_dynamic").is(':checked'))
        {
            $(".dyn_date").show();
            $(".custom_date").hide();
        } else
        {
            $(".dyn_date").hide();
            $(".custom_date").show();
        }
    });
    $("#date_scope").change(wireDates);
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
      $("#sortby").find('option').remove();
      var measures = jsonData.definition.measures;
      for (i = 0; i < measures.length; i++) {
        var measOpt = $('<option></option>').val(measures[i].ID).html(measures[i].name);
        $("#measures").append(measOpt);

        var sortOpt = $('<option></option>').val(encodeURIComponent(measures[i].name.toLowerCase())).html(measures[i].name);
        $("#sortby").append(sortOpt);
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

function wireDates() {
  if ($("#start_period").datepicker()) $("#start_period").datepicker("destroy");
  if ($("#end_period").datepicker()) $("#end_period").datepicker("destroy");
  switch ($("#date_scope").val()) {
    case "y":
      $('.date-picker').datepicker( {
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy',
        onClose: function(dateText, inst) { 
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, 1, 1));
        }
      });
      break;
    case "m":
      $('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy mm',
        onClose: function(dateText, inst) { 
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
        }
      });
      break;
    case "d":
      $('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy mm dd',
        onClose: function(dateText, inst) { 
            var day = $("#ui-datepicker-div .ui-datepicker-day :selected").val();
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, day));
        }
      });
      break;

  }
}