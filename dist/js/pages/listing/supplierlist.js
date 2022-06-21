//common
var UserID = 1;
var JsonResult = [];
var dtTable, dtGRNList;

//Supplier listing
dtTable = $("#dtSupplierList").DataTable({    
    paging: true,
    autoWidth: false,
    scrollX: true,
    data:JsonResult,
    columns:[
        {data:"SupplierID", "visible":false},
        {data:"SupplierName" , render: function (data, type, row){ 
            return('<a href="../master/suppliers.html?supid='+row.SupplierID+'">'+data+'</a>')
        }},
        {data:"SupplierAddress"},
        {data:"SupplierContact"},
        {data:"Remark"},       
        {data:"SupplierTotal",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierPaid",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierOutstanding",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"IsActive", render: function(data, type, row){
            var txt = (data == 1)? 'YES':'NO';
            return(txt)
        }}
    ],
    "order": [[ 1, 'desc' ]],
});



function LoadSupplierListing(){
    fire_async_api_get("ResturantAdmin/GetSuppliers").then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtTable.clear().draw();
            dtTable.rows.add(JsonResult).draw();           
        }
    })
}

$(document).ready(function (){
    UserID = GetUserDetail();
    LoadSupplierListing();
})