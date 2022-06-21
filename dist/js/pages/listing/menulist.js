//common
var UserID = 1;
$(".select2").select2();
var JsonResult = [];
var dtTable, dtGRNList;

//menu listing
dtTable = $("#dtMenuList").DataTable({    
    paging: true,
    autoWidth: false,
    scrollX: true,
    data:JsonResult,
    columns:[
        {data:"menuid", render: function (data, type, row){
            return(
                '<div class="row justify-content-center">'+
                '<button class="btn btn-warning btn-sm"><a href="../master/menuregister.html?menuid='+data+'" class="text-dark">Edit</a></button>'+
                '</div>'
              )
        }},
        {data:"RNo"},
        {data:"menuname"},
        {data:"menucode"},
        {data:"CategoryName"},
        {data:"IsKOT", render: function(data, type, row){
            var txt = (data == 1)? 'YES':'NO';
            return(txt)
        }},
        {data:"totalcost", render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"overheadcost", render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"margin", render: function(data, type, row){
            return(data+' %')
        }},
        {data:"totalprice", render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"Isactive", render: function(data, type, row){
            var txt = (data == 1)? 'YES':'NO';
            return(txt)
        }},
        {data:"CreatedDate"},
        {data:"UserName"}
    ]
});

function LoadMaterialListing(){
    fire_async_api_get("ResturantAdmin/GetMenuHeader").then((response)=>{
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