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

$( "#txtGRNdate" ).datepicker({dateFormat: "yy-mm-dd"}).
datepicker("setDate","0");

$( "#txtInvoiceDate" ).datepicker({dateFormat: "yy-mm-dd"}).
datepicker("setDate","0");
        
var dtble = $("#dtgrn").DataTable({
    "paging": true,
    "columnDefs": [
        { "visible": false, "targets": 0 },
        { "visible": false, "targets": 2 }
    ]
});

$(document).ready(function(){
    UserID = GetUserDetail();
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

$("#drprawitemCategory").on('change', function(e){
    MenuItems = [];
    $("#drpitemName").find('option').not(':first').remove();
    var catid = $("#drprawitemCategory").val();
    fire_async_api_get("ResturantAdmin/GetRawItemsByCategory?catid="+catid+"").
    then((response)=>{
        if(response !== ""){
            JsonResult = response;
            console.log(JsonResult)
            JsonResult.forEach(element => {
                MenuItems.push({
                    id: element.RawMaterialID,
                    text: element.RawMaterialName
                })
            });
            $("#drpitemName").select2({
                data: MenuItems
            });
        }
    });
});

$("#drpitemName").on('change', function (e){
    var rawid = $("#drpitemName").val();
    $("#txtunitprice").val("");
    $("#txtUOM").val("");
    $("#txtunitqty").val("");
    $("#txtprice").val("");
    $("#txtquantity").val("");

    fire_async_api_get("ResturantAdmin/GetMasterRawMaterials?RawMatID="+rawid+"").
    then((response)=>{
        if(response !== "" || response !== null){
            $("#txtunitprice").val(response.UnitPrice);
            $("#txtUOM").val(response.UOMName);
            $("#txtunitqty").val(response.UnitQty);
            $("#txtunitprice").focus();
            $("#txtquantity").val("");
        }
    });
});

function SetRawMatPrice(){
    var unitprice = $("#txtunitprice").val();
    var Unitqty = $("#txtunitqty").val();
    var qty = $("#txtquantity").val();

    var price = (unitprice / Unitqty) * qty;

    $("#txtprice").val(price);
}
$("#txtunitprice").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        $("#txtquantity").focus();
    }
});
$("#txtquantity").on('change', function(e){
    SetRawMatPrice();
});

$("#txtquantity").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetRawMatPrice();
        AddRow();
    }
});


$("#btnaddItem").on('click', function (e){
    AddRow();
});

var i = 0;
function AddRow(){
    if($("#drpitemName").val() > 0 && $("#txtquantity").val() > 0 && $("#txtprice").val() > 0){
        var is_block = isBlock();
        if(is_block == false){
            dtble.row.add([
                0,
                $("#drpitemName").select2('data')[0].text,
                $("#drpitemName").val(),
                $("#txtUOM").val(),
                $("#txtquantity").val(),
                $("#txtprice").val(),
                '<a type="button" style="height:20px;" class="btn-sm btn btn-danger small"  value="Remove"> <i class="sm fa fa-minus"></i></a>'
            ]).draw(false);

            //clear fields       
            $("#txtUOM").val("");
            $("#txtquantity").val("");
            $("#txtprice").val("");
            $("#txtunitqty").val("");
            $("#txtunitprice").val("");

            CalculateTotal();
        }

        $("#drpitemName").focus();

    }else{
        Swal.fire("Error","Must have item name/ quantity","error");
    }
}

function isBlock(){
    var isblock = false;
    if(dtble.data().count() > 0){
        dtble.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
            var matid = dtble.cell({row: rowIdx, column: 2}).data();
            if(matid == $("#drpitemName").val()){
                Swal.fire("Warning","Please remove the existing raw material before modify the same line","warning");
                isblock = true;                
            }
        });
    }else{
        isblock = false;
    }
    return isblock;    
}

function CalculateTotal(){
    var Total = 0;
    $("#txtmargin").val(0);
    $("#txtoverheadCost").val(0);
    $("#txttotalPrice").val(0);

    dtble.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var amount = dtble.cell({row: rowIdx, column: 5}).data();
        Total = parseFloat(Total) + parseFloat(amount);
    });
    $("#txttotalCost").val(Currency_Formatter(parseFloat(Total)));
    SetTotalPrice();
}

$("#dtgrn tbody").on("click", "a", function(input){
    dtble.row($(this).parents('tr')).remove().draw();
    CalculateTotal();
});

function SetTotalPrice(){
    var discount = parseFloat($("#txtdiscount").val());
    var cost = parseFloat(Revert_Currency_Formatter($("#txttotalCost").val()));
    var vat = parseFloat($("#txtVAT").val());

    var discounted = cost * (1-(discount/100));
    var Final = discounted * (1+vat/100);
    Final = isNaN(Final)?0:Final;
    $("#txttotalPay").val(Currency_Formatter(parseFloat(Final.toFixed(2))));
}

$("#txtdiscount").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetTotalPrice();
    }
});
$("#txtVAT").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetTotalPrice();
    }
});

$("#btnsubmit").on('click', function (e){
        var rows = dtble.data().count();
        if(rows > 0 && $("#txtInvoiceNo").val() !== "" && $("#drpsupplierName").val() > 0 && $("#drpcompanyType").val() > 0
        && $("#drpgrnType").val() > 0 && parseFloat(Revert_Currency_Formatter($("#txttotalPay").val())) > 0){
            SetGRNDetail();
        }else{
            Swal.fire("Error","Incompleted GRN Data found","error");
        }
});

function SetGRNDetail(){

    var GRNDetail = [];
    var isAct = document.querySelector('#chkactive:checked')?1:0;
    //loop throught the recipe table.
    dtble.rows().every(function ( rowIdx, tableLoop, rowLoop ) {
        var rawmatid = dtble.cell({row: rowIdx, column: 2}).data();
        var qty = dtble.cell({row: rowIdx, column: 4}).data();
        var price = dtble.cell({row: rowIdx, column: 5}).data();
        var rid = dtble.cell({row: rowIdx, column: 0}).data();

        var GRNDetailObj = {
            RawMaterialID: rawmatid,
            TotalQty: qty,
            TotalPrice: price
        }
        GRNDetail.push(GRNDetailObj);
    });  

    var Jobject = {
        GRNDate: $("#txtGRNdate").val(),
        InvoiceNo: $("#txtInvoiceNo").val(),
        InvoiceDate: $("#txtInvoiceDate").val(),
        SupplierID: $("#drpsupplierName").val(),
        Company: $("#drpcompanyType").val(),
        GRNType: $("#drpgrnType").val(),
        event: $("#drpeventdetail").val(),
        GRNTotal: parseFloat(Revert_Currency_Formatter($("#txttotalCost").val())).toFixed(2),
        Discount: parseFloat($("#txtdiscount").val()).toFixed(2),
        VAT: parseFloat($("#txtVAT").val()).toFixed(2),
        TotalPayable: parseFloat(Revert_Currency_Formatter($("#txttotalPay").val())).toFixed(2),
        CreatedBy: UserID,
        Detail: GRNDetail
    }

    Swal.fire({
        title: "Submit new GRN",
        text: "Are you sure you want to submit this GRN ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
        }).then((result)=>{
            if(result.value){
                //post GRN Data
                fire_async_api_post("ResturantAdmin/SetGRN", Jobject).
                then((response)=>{
                    if(response > 0){
                        Swal.fire("Done","GRN No #"+response+" created succesfully. Please acknowledge and approve it","success").then(()=>{
                            ClearFields();
                            location.reload();
                        });
                    }
                })
            }
        });
}

function ClearFields(){
    MenuItems = [];
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

$("#btnviewlist").on('click', function (e){
    // upload menu image.
   
});

$("#btnnew").on('click', function(){
    ClearFields();
    location.replace("/pages/forms/inventory/rawfoodGRN.html");
});

$("#btnviewlist").on('click', function(){
    location.replace("../listing/grnlisting.html");
})



//-------------------------------------

function ViewMenuData(){
    fire_async_api_get("ResturantAdmin/GetMenuHeader?menuid="+MenuID).then((result)=>{        
        $("#txtmenuName").val(result.menuname);
        $("#txtmenuCode").val(result.menucode);
        $("#drpmenuCategory").val(result.menucategory).trigger('change');
        $("#drpisKOT").val(result.IsKOT).trigger('change');
        //document.getElementById('imgMenu').src = result.MenuImage;
        $("#prv").attr("src",result.menuimage);
        $("#txttotalCost").val(result.totalcost);
        $("#txtoverheadCost").val(result.overheadcost);
        $("#txtmargin").val(result.margin);
        $("#txttotalPrice").val(result.totalprice);

        var status = (result.Isactive==1)?true:false;
        $("#chkactive").prop("checked",status);

        fire_async_api_get("ResturantAdmin/GetRecipeLines?menuid="+MenuID).then((result)=>{
            if(result !== ""){
                JsonResult = result;
                dtble.clear().draw();
                JsonResult.forEach(element => {
                    dtble.row.add([
                        element.recipeid,
                        element.rawmaterialname,
                        element.rawmaterialid,
                        element.uom,
                        element.quantity,
                        element.price,
                        '<a type="button" class="btn-sm btn btn-danger small"  value="Remove"> Remove <i class="sm fa fa-trash"></i></a>'
                    ]).draw(false);
                });                
            }
        });
    });
}



