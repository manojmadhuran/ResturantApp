var UserID = 1;
var JsonResult = [];
var _catID = 0;

var table = $("#dtMenuCat").DataTable({
    data: JsonResult,
    columns: [
        { data: "MenuCatID" },
        { data: "MenuCatName" },
        { data: "isActive",
        render: function (data, type, row) {
            if(row.isActive == 1){
                return 'Active'
            }else{
                return 'InActive'
            }
        }
        },
        { data: "",
        render: function (data, type, row) {
            return (
                '<button type="button" class="small btn btn-warning btn-sm">Edit</button>')
            },
        }
    ]
});

$('#dtMenuCat tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();
    View(data.MenuCatID, data.MenuCatName, data.isActive);
});


function View(catID ,catName, isAct){
    _catID = catID;
    $("#txtcategoryName").val(catName);
    var status = (isAct==1)?true:false;
    $("#chkIsactive").prop("checked",status);
}

$(document).ready(function(){
    UserID = GetUserDetail();
    clearfields();
    getMenuCategory();
});

function clearfields(){
    _catID = 0;
    $("#txtcategoryName").val("");
    $("#chkIsactive").prop("checked",false);
}

function getMenuCategory(){
    fire_async_api_get("ResturantAdmin/GetMenuCategory").
    then((response)=>{
        if(response !== ""){
            JsonResult = response;
            table.clear().draw();
            table.rows.add(JsonResult).draw();
        }

    });
}


function setMenuCategory(){
    var catname = $("#txtcategoryName").val();
    fire_async_api_post("ResturantAdmin/SetMenuCategory?catname="+catname+"").
    then((response)=>{
        if(response > 0){
            Swal.fire("Done","Menu category added succesfully","success").then(()=>{
                getMenuCategory();
            });
            clearfields();
        }else{
            Swal.fire("Error","Menu category added failed","error");
        }
    });    
}

function updateMenuCategory(){
    var catname = $("#txtcategoryName").val();
    var isAct = document.querySelector('#chkIsactive:checked')?1:0;
    fire_async_api_post("ResturantAdmin/UpdateMenuCategory?catname="+catname+"&catid="+_catID+"&isactive="+isAct+"").
    then((response)=>{
        if(response > 0){
            Swal.fire("Done","Menu category updated succesfully","success").then(()=>{
                getMenuCategory();
            });    
            clearfields();        
        }else{
            Swal.fire("Error","Menu category update failed","error");
        }
    });
}

$("#btnsubmit").click(function(){
    setMenuCategory();
});
$("#btnupdate").click(function(){
    if(_catID > 0){
        updateMenuCategory();
    }else{
        Swal.fire("Error","No menu category selected","error");
    }
});