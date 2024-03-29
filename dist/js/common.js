/*Globel Value */
var ctsappversion = "07022022"; //Replace this for any Deployment xxxxxxx.js?v=04052021
var auth = "Basic V29sZkFwcDpjRzl5ZEd0bGVRPT0=";
var apiURL = "http://localhost:53205/";
//var apiURL = "http://192.168.1.20/NPLK.WebAPI/ODRService/";
//var appurl = "https://staging-cts.nipsea.com.sg/";
var _user = "";

/* API GET Method */
function fire_async_api_get(urlParam) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "GET",
      url: apiURL + urlParam,
      contentType: "application/json",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        });
      },
    });
  });
}

/* API POST Method */
function fire_async_api_post(urlParam, res) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST",
      url: apiURL + urlParam,
      contentType: "application/json",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      data: JSON.stringify(res),
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        });
      },
    });
  });
}

/* API Upload files */
function fire_async_api_upload_file(formdata, urlParam) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url:
        apiURL + urlParam,
      type: "POST",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      data: formdata,
      contentType: false,
      processData: false,
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        });
      },
    });
  });
}

/* Check user is valid user */
function GetUserDetail() {
  var userID = Cookies.get('UserID');
  var userName = Cookies.get('UserName');
  if(userID === undefined || userID === null){
    location.replace("/login.html");
  }else{
    return userID;
  }
}

function setUserInfo(){
  document.getElementById("lbluname").innerHTML = Cookies.get('UserName');
  document.getElementById("lbluemail").innerHTML = Cookies.get('useremail');
  document.getElementById("lblurole").innerHTML = Cookies.get('RoleName');
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

/* format currency */
function Currency_Formatter(val) {
  return parseFloat(val, 2)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString();
}

function Revert_Currency_Formatter(val) {
  if (val !== "" && val.indexOf(",") > 0) {
    return parseFloat(Number(val.replace(/[^0-9.-]/g, "")), 2);
  } else if (val !== "") {
    return parseFloat(val);
  }else {
    return val
  }
}

function validateInput(input,e) {
  var specialKeys = new Array();
  specialKeys.push(8); //Backspace
  if (!$(input).val().includes("-") && $(input).val() == "") {
  specialKeys.push(45); //sustract
  }
  if (!$(input).val().includes(".")) {
  specialKeys.push(46); //decimal
  }
  var keyCode = e.which ? e.which : e.keyCode;
  var ret =
  (keyCode >= 48 && keyCode <= 57) ||
  specialKeys.indexOf(keyCode) != -1;
  return ret;
}

$('.input').on('keydown', function(e){ if (e.keyCode == 9)  e.preventDefault() });

/*Set focus for Select2 input field*/
$(document).on('select2:open', '.select2', function (e) {
  setTimeout(() => {
      const $elem = $(this).attr("id");
      document.querySelector(`[aria-controls="select2-${$elem}-results"]`).focus();
  });
});

