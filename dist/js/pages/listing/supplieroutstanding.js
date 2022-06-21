//common
var UserID = 1;
$(".select2").select2();
var JsonResult = [];
var dtTable, dtGRNList;

//supplier outstanding
dtTable = $("#dtOutstandingList").DataTable({    
    paging: true,
    autoWidth: false,
    scrollX: true,
    data:JsonResult,
    columns:[
        {data:"SupplierID", render: function (data, type, row){
            return(
                '<div class="row justify-content-center">'+
                '<button class="btn btn-success btn-sm mr-1"><a href="../master/supplierPayment.html?suppID='+data+'" class="text-white">Pay</a></button>'+
                '<button class="btn btn-primary btn-sm" onclick="PopUpInfo('+data+')">Info</button>'+
                '</div>'
              )
        }},
        {data:"SupplierName"},
        {data:"SupplierAddress"},
        {data:"SupplierTotal", render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierPaid", render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierOutstanding", render: $.fn.dataTable.render.number(",", ".", 2)}        
    ]
});

function LoadGRNListing(){
    var type = $("#type").val();
    fire_async_api_get("ResturantAdmin/GetSupplierOutstandingHeader").then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtTable.clear().draw();
            dtTable.rows.add(JsonResult).draw();
        }
    })
}

$(document).ready(function(){
    UserID = GetUserDetail();
    var m = $('script[data-m][data-m!=null]').attr('data-m');
    LoadGRNListing();
});

function PopUpInfo(data){
    $("#modal-default").modal('show');    
    document.getElementById('suppid').innerHTML = data;
    Loadinfo(data);
}

dtGRNList = $("#dtGRNList").DataTable({
    "paging": false,
    data: JsonResult,
    columns:[
        {data:"GRNID"},
        {data:"GRNDate", render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          },},
        {data:"InvoiceDate", render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          },},
        {data:"InvoiceNo"},
        {data:"SupplierTotal",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierPaid",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierOutstanding",render: $.fn.dataTable.render.number(",", ".", 2)}
    ]
});
var Loadinfo = function(supplierID){
    fire_async_api_get("ResturantAdmin/GetGRNOutstandingBySupplier?supplierID="+supplierID).then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtGRNList.clear().draw();
            dtGRNList.rows.add(JsonResult).draw();
        }
    })
}

$("#btnpay").on('click', function (){
    var suppid = document.getElementById('suppid').innerHTML;
    location.replace('../master/supplierPayment.html?suppID='+suppid);
});