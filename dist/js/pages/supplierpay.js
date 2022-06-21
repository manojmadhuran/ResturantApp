//common
var UserID = 1;
var SID = 0;
$(".select2").select2();
var JsonResult = [];
var suppliers = [];

var dtGRNList,dtpayHistory;

$("#txtpaiddate").datepicker({dateFormat: "yy-mm-dd"}).
datepicker("setDate","0");

dtGRNList = $("#dtGRNList").DataTable({
    data: JsonResult,
    autoWidth: false,
    scrollX: true,
    columns:[
        {data:"GRNID", render: function (data, type, row){
            return(
                '<div><button class="btn btn-sm btn-success"><a class="text-white" href="#">Pay</a></button>'+
                '<button class="ml-1 btn btn-sm btn-primary"><a class="text-white" href="../inventory/viewGRN.html?grnid='+data+'" target="_blank">View</a></button></div>'
              )
        }},
        {data:"GRNDate", render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          },},
        {data:"InvoiceNo"},
        {data:"SupplierTotal",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierPaid",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"SupplierOutstanding",render: $.fn.dataTable.render.number(",", ".", 2)}
    ]
});
function Loadinfo(){ 
    SID = SID == null ? 0 : SID;   
    fire_async_api_get("ResturantAdmin/GetGRNOutstandingBySupplier?supplierID="+SID).then((response)=>{
        if(response !== ""){
            JsonResult = response;
            dtGRNList.clear().draw();
            dtGRNList.rows.add(JsonResult).draw();
        }
    })
}

$(document).ready(function(){
    UserID = GetUserDetail();
    SID = getUrlParameter('suppID');
    if(SID > 0 ){
        $("#drpsupplierName").attr('disabled', true);
    }    
    LoadSuppliers();    
});

var LoadSuppliers = function (){
    fire_async_api_get("ResturantAdmin/GetSuppliers?supid=0").then((response)=>{
        JsonResult = response;
        JsonResult.forEach(element => {
           suppliers.push({
                id: element.SupplierID,
                text: element.SupplierName,
                total: element.SupplierTotal,
                paid: element.SupplierPaid,
                balance: element.SupplierOutstanding
            })
        });
        $("#drpsupplierName").select2({
            data: suppliers
        });
        $("#drpsupplierName").val(SID).trigger('change');
    });
}

$("#drpsupplierName").on('change', function(){
    SID = $("#drpsupplierName").val();
    $(".text").val("");
    var supData = $("#drpsupplierName").select2('data');
    $("#txtTotal").val(Currency_Formatter(supData[0].total)=='NaN'?0:Currency_Formatter(supData[0].total));
    $("#txtTotalPaid").val(Currency_Formatter(supData[0].paid)=='NaN'?0:Currency_Formatter(supData[0].paid));
    $("#txtTotalOutstanding").val(Currency_Formatter(supData[0].balance)=='NaN'?0:Currency_Formatter(supData[0].balance))
    Loadinfo();
    LoadSupplierPaymentHistory(SID);
});

$("#dtGRNList tbody").on('click', 'td', function(){
    $(".text").val("");
    $("#drppaytype").val(0).trigger('change');
    var mdata = (dtGRNList.row(this).data());
    $("#txtgrnid").val(mdata.GRNID);
    $("#txtgrndate").val(moment(mdata.GRNDate.substring(0, 10)).format("YYYY-MM-DD"));
    $("#txtinvno").val(mdata.InvoiceNo);
    $("#txtinvdate").val(moment(mdata.InvoiceDate.substring(0, 10)).format("YYYY-MM-DD"));
    $("#txtgrntot").val(Currency_Formatter(mdata.SupplierTotal));
    $("#txtgrnpaid").val(Currency_Formatter(mdata.SupplierPaid));
    $("#txtgrnbal").val(Currency_Formatter(mdata.SupplierOutstanding));
});

$("#btnsubmit").on('click', function(){
    DoPayment();
});
$("#btnviewList").on('click', function (){
    location.replace("../listing/supplieroutstanding.html");
});
function DoPayment(){
    var supplierID_ = $("#drpsupplierName").val(); 
    var grnID_ = $("#txtgrnid").val(); var amount_ = $("#txtamount").val(); 
    var paytype_ = $("#drppaytype").val();

    if(supplierID_ > 0 && grnID_ > 0 && amount_ > 0 && paytype_ > 0){
        Swal.fire({
            title: "Create Supplier Payment",
            text: "Are you sure you want to make this payment for the GRN NO #"+$("#txtgrnid").val()+" ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
            }).then((result)=>{
                if(result.value){
                    var Jobj = {
                        SupplierID: supplierID_,
                        GRNID: grnID_,
                        PayAmount: amount_,
                        PaidDate:$("#txtpaiddate").val(),
                        PayType:paytype_,
                        CardNo:$("#txtcardchNo").val(),
                        userID:UserID
                    }
                    fire_async_api_post("ResturantAdmin/SetGRNPayment",Jobj).then((response)=>{
                        if(response > 0){
                            Swal.fire("Done","Supplier payment for GRN No #"+$("#txtgrnid").val()+" created successfully.", "success").then((response)=>{
                                location.reload();
                            });
                        }
                    });
                }
            });

    }else{
        Swal.fire("Error","Supplier Name/ GRN No/ PayAmount should not be blank or zero", "error");
    }
}

dtpayHistory = $("#dtpayHistory").DataTable({
    dom:'ftp',
    data: JsonResult,
    autoWidth: false,
    scrollX: true,
    columns:[
        {data:"PaymentID"},
        {data:"GRNID", render: function(data, type, row){
            return('<a href="../inventory/viewGRN.html?grnid='+data+'">'+data+'</a>')
        }},
        {data:"PayAmount",render: $.fn.dataTable.render.number(",", ".", 2)},
        {data:"PaidDate",render: function (data, type, row) {
            return moment(data.substring(0, 10)).format("YYYY-MM-DD");
          }},
        {data:"PayType"},
        {data:"CardNo"}
    ],

    //footer summary
    footerCallback: function (row, data, start, end, display) {
        var api = this.api(),
          data;
    
        // Remove the formatting to get integer data for summation
        var intVal = function (i) {
          return typeof i === "string"
            ? i.replace(/[\$,]/g, "") * 1
            : typeof i === "number"
            ? i
            : 0;
        };
    
        for (var i = 2; i < 3; i++) {
         
          // Total over all pages
          total = api
            .column(i)
            .data()
            .reduce(function (a, b) {
              return intVal(a) + intVal(b);
            }, 0);
    
          // Total over this page
          pageTotal = api
            .column(i, { page: "current" })
            .data()
            .reduce(function (a, b) {
              return intVal(a) + intVal(b);
            }, 0);
    
          // Update footer
          $(api.column(i).footer()).html(
            //'$'+pageTotal +' ( $'+ total +' total)'
            //Currency_Formatter(total)
            Currency_Formatter(total)
          );
          
        }
    },
});
function LoadSupplierPaymentHistory(suppID){
    fire_async_api_get("ResturantAdmin/GetSupplierPaymentHistory?supplierID="+suppID).then((response)=>{
        JsonResult = response;
        dtpayHistory.clear().draw();
        dtpayHistory.rows.add(JsonResult).draw();
    });
}