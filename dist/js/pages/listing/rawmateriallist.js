//common
var UserID = 1;
$(".select2").select2();
var JsonResult = [];
var dtTable, dtGRNList;

//raw material listing
dtTable = $("#dtMaterialList").DataTable({    
    paging: true,
    autoWidth: false,
    scrollX: true,
    data:JsonResult,
    columns:[
        {data:"RawMaterialID", render: function (data, type, row){
            return(
                '<div class="row justify-content-center">'+
                '<button class="btn btn-warning btn-sm mr-1"><a href="../master/rawfoodmaster.html?rawMatID='+data+'" class="text-dark">Edit</a></button>'+
                '<button class="btn btn-primary btn-sm" onclick="PopUpInfo('+data+')">Info</button>'+
                '</div>'
              )
        }},
        {data:"RawMaterialName"},
        {data:"RawMaterialItemCode"},
        {data:"CategoryName"},
        {data:"UnitTypeName"},
        {data:"UOMName"},
        {data:"UnitQty", render: function(data, type, row){
            return(
                data+' '+row.UOMName
            )
        }},
        {data:"ReOrderLevel",render: function(data, type, row){
            return(
                data+' '+row.UOMName
            )
        }}  
    ]
});

function LoadMaterialListing(){
    fire_async_api_get("ResturantAdmin/GetMasterRawMaterials").then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtTable.clear().draw();
            dtTable.rows.add(JsonResult).draw();
        }
    })
}

$(document).ready(function (){
    UserID = GetUserDetail();
    LoadMaterialListing();
})