var UserID = 1;
$(".select2").select2();
var JsonResult = [];
var dtTable;
$("#datetime").daterangepicker();
dtTable = $("#dtGRNList").DataTable({
    
    paging: true,
    autoWidth: true,
    scrollX: true,
    data:JsonResult,
    columns:[
        {data:"GRNID", render: function(data, type, row){
            return('<a href="./viewgrn.html?grnid='+data+'">'+data+'</a>')
        }},
        {data:"GRNDate", render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          },},
        {data:"InvoiceNo"},
        {data:"InvoiceDate", render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          },},
        {data:"SupplierName"},
        {data:"CompanyName"},
        {data:"TypeName"},
        {data:"NumOfItems"},
        {data:"TotalPayable", render: $.fn.dataTable.render.number( ',', '.', 2 )},
        {data:"IsApproved"}
    ]
});

$(document).ready(function(){
    LoadGRNListing();
});

$("#btnsearch").on('click', function (){
    LoadGRNListing();
});

function LoadGRNListing(){
    var type = $("#type").val();
    var mdate = $("#datetime").val().trim();
    fire_async_api_get("ResturantAdmin/GetGRNHeaderList?type="+type+"&daterange="+mdate).then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtTable.clear().draw();
            dtTable.rows.add(JsonResult).draw();
        }
    })
}