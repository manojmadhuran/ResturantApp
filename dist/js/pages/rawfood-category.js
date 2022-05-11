var userID = 1;
var JsonResult = [];
var _catID = 0;

var table = $("#tblCategory").DataTable({
    data: JsonResult,
    columns: [
        { data: "CategoryID" },
        { data: "CategoryName" },
        { data: "",
        render: function (data, type, row) {
            return (
              '<input type="button" class="small btn btn-warning" value="Edit" onclick = View("'+row.CategoryID+'","'+row.CategoryName+'") />')
            },
        }
    ]
});

function View(catID ,catName){
    _catID = catID;
    $("#txtcatname").val(catName);
}

$(document).ready(function(){
    clearfields();
    getRawFoodCategory();
});

function clearfields(){
    _catID = 0;
    $("#txtcatname").val("");
}


function getRawFoodCategory(){
    fire_async_api_get("ResturantAdmin/GetMasterRawMatCategory").
    then((response)=>{
        if(response !== ""){
            JsonResult = response;
            table.clear().draw();
            table.rows.add(JsonResult).draw();
        }

    });
}

function setRawFoodCategory(){
    var catname = $("#txtcatname").val();
    fire_async_api_post("ResturantAdmin/SetMasterRawMatCategory?catname="+catname+"").
    then((response)=>{
        if(response > 0){
            Swal.fire("Done","Category added succesfully","success").then(()=>{
                getRawFoodCategory();
            });
            clearfields();
        }else{
            Swal.fire("Error","Category added failed","error");
        }
    });    
}

function updateRawFoodCategory(){
    var catname = $("#txtcatname").val();
    fire_async_api_post("ResturantAdmin/UpdateMasterRawMatCategory?catname="+catname+"&catid="+_catID+"").
    then((response)=>{
        if(response > 0){
            Swal.fire("Done","Category updated succesfully","success").then(()=>{
                getRawFoodCategory();
            });    
            clearfields();        
        }else{
            Swal.fire("Error","Category update failed","error");
        }
    });
}

$("#btnsubmit").click(function(){
    setRawFoodCategory();
});
$("#btnupdate").click(function(){
    if(_catID > 0){
        updateRawFoodCategory();
    }else{
        Swal.fire("Error","No category selected","error");
    }
});