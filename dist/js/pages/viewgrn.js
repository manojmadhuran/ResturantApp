var UserID = 1;
$(".select2").select2();
var RawCategory = [];
var suppliers = [];
var MenuItems = [];
var UOM = [];
var UnitQty = [];
var Company = [];
var GRNtype = [];
var GRNID = 0;
var JsonResult = [];

var dtble = $("#dtgrn").DataTable({
    paging: true,
    Data: JsonResult,
    columns:[
        {data:"GRNDID"},
        {data:"RawMaterialName"},
        {data:"RawMaterialID"},
        {data:"UOMName"},
        {data:"UnitQty", render: function(data, type, row){
            return (row.UnitQty +' ('+row.UOMName+')')
        }},
        {data:"UnitPrice"},
        {data:"TotalQty", render: function(data, type, row){
            return (row.TotalQty +' ('+row.UOMName+')')}},
        {data:"TotalPrice"}
    ],
    columnDefs: [
        { visible: false, targets: 0 },
        { visible: false, targets: 2 }
    ]
});

$(document).ready(function(){

    ClearFields();
    MasterData();

    GRNID = getUrlParameter('grnid');
    if(GRNID > 0){
        ViewGRNDetail();
    }
    console.log(GRNID);

});

function MasterData() {
    //get item category
fire_async_api_get("ResturantAdmin/GetSuppliers?supid=0").
then((response)=>{
    if(response !== ""){
        JsonResult = response;
        JsonResult.forEach(element => {
           suppliers.push({
                id: element.SupplierID,
                text: element.SupplierName
            })
        });
        $("#drpsupplierName").select2({
            data: suppliers
        });
    }
});

fire_async_api_get("ResturantAdmin/GetMasterRawMatCategory").
then((response)=>{
    if(response !== ""){
        JsonResult = response;
        JsonResult.forEach(element => {
            RawCategory.push({
                id: element.CategoryID,
                text: element.CategoryName
            })
        });
        $("#drprawitemCategory").select2({
            data: RawCategory
        });
    }
});

fire_async_api_get("ResturantAdmin/GetMasterCompany").
then((response)=>{
    if(response !== ""){
        JsonResult = response;
        JsonResult.forEach(element => {
           Company.push({
                id: element.CompanyID,
                text: element.CompanyName
            })
        });
        $("#drpcompanyType").select2({
            data: Company
        });
    }
});

fire_async_api_get("ResturantAdmin/GetGrnTypes").
then((response)=>{
    if(response !== ""){
        JsonResult = response;
        JsonResult.forEach(element => {
           GRNtype.push({
                id: element.TypeID,
                text: element.TypeName
            })
        });
        $("#drpgrnType").select2({
            data: GRNtype
        });
    }
});
}

$("#drpgrnType").on('change', function (){
    var type_ = $("#drpgrnType").val();
    if(type_ == 2){
        $("#divevent").show();
        //load events
    }else{
        $("#divevent").hide();
    }
});

//---------------- VIEW GRN --------------------------------------
function ViewGRNDetail(){
    fire_async_api_get("ResturantAdmin/GetGRNData?headerid="+GRNID).then((response)=>{
        $("#txtgrnNo").val(response.GRNID);
        $("#txtGRNdate").val(moment(response.GRNDate).format("YYYY-MM-DD"));
        $("#txtInvoiceNo").val(response.InvoiceNo);
        $("#txtInvoiceDate").val(moment(response.InvoiceDate).format("YYYY-MM-DD"));
        $("#drpsupplierName").val(response.SupplierID).trigger('change');
        $("#drpcompanyType").val(response.Company).trigger('change');
        $("#drpgrnType").val(response.GRNType).trigger('change');
        $("#drpeventdetail").val(response.EventID).trigger('change');

        $("#txttotalCost").val(Currency_Formatter(response.GRNTotal));
        $("#txtdiscount").val(Currency_Formatter(response.Discount));
        $("#txtVAT").val(Currency_Formatter(response.VAT));
        $("#txttotalPay").val(Currency_Formatter(response.TotalPayable));

        JsonResult = response.Detail; 
        dtble.clear().draw();
        dtble.rows.add(JsonResult).draw();
    });
}

function ClearFields(){
    $("#txttotalCost").val("");
    $("#txtoverheadCost").val("");
    $("#txtmargin").val("");
    $("#txttotalPrice").val("");
    $("#txtmenuName").val("");
    $("#txtmenuCode").val("");
    $("#drprawitemCategory").val(0).trigger('change');
    $("#drpitemName").find('option').not(':first').remove();
    $("#divevent").hide();
    dtble.clear().draw();
}