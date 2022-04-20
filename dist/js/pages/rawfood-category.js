let json = [];
let userID = 1;

var table = $(function () {
    $("#table1").DataTable();
});

function getRawFoodCategory(){
    fire_async_api_get("").then((response)=>{

    });
}

function setRawFoodCategory(){
    var catname = $("#txtcatname").val();
}

$("#btnsubmit").click(function(){
    alert('sd')
});