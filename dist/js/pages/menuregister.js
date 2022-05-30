var UserID = 1;
$(".select2").select2();
var RawCategory = [];
var MenuCategory = [];
var MenuItems = [];
var UOM = [];
var UnitQty = [];

var MenuID = 0;
var JsonResult = [];

var dtble = $("#dtMenuregister").DataTable({
    "paging": true,
    "columnDefs": [
        { "visible": false, "targets": 0 },
        { "visible": false, "targets": 2 }
    ]
});

$(document).ready(function(){
    ClearFields();
    MasterData();

    MenuID = getUrlParameter('menuid');
    if(MenuID > 0){
        ViewMenuData();
    }
    console.log(MenuID)

});

function MasterData() {
     //get item category
 fire_async_api_get("ResturantAdmin/GetMenuCategory").
 then((response)=>{
     if(response !== ""){
         JsonResult = response;
         JsonResult.forEach(element => {
            MenuCategory.push({
                 id: element.MenuCatID,
                 text: element.MenuCatName
             })
         });
         $("#drpmenuCategory").select2({
             data: MenuCategory
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
}

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
    fire_async_api_get("ResturantAdmin/GetMasterRawMaterials?RawMatID="+rawid+"").
    then((response)=>{
        if(response !== ""){
            $("#txtunitprice").val(response.UnitPrice);
            $("#txtUOM").val(response.UOMName);
            $("#txtunitqty").val(response.UnitQty);
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

$("#txtquantity").on('change', function(e){
    SetRawMatPrice();
});

$("#txtquantity").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetRawMatPrice();
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
                '<a type="button" class="btn-sm btn btn-danger small"  value="Remove"> Remove <i class="sm fa fa-trash"></i></a>'
            ]).draw(false);

            //clear fields       
            $("#txtUOM").val("");
            $("#txtquantity").val("");
            $("#txtprice").val("");
            $("#txtunitqty").val("");
            $("#txtunitprice").val("");

            CalculateTotal();
        }

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
}

$("#dtMenuregister tbody").on("click", "a", function(input){
    dtble.row($(this).parents('tr')).remove().draw();
    CalculateTotal();
});

function SetTotalPrice(){
    var overhead = parseFloat($("#txtoverheadCost").val());
    var cost = parseFloat(Revert_Currency_Formatter($("#txttotalCost").val()));
    var margin = parseFloat($("#txtmargin").val());

    var Final = (cost + overhead) * (1+margin/100);
    Final = isNaN(Final)?0:Final;
    $("#txttotalPrice").val(Currency_Formatter(parseFloat(Final.toFixed(2))));
}

$("#txtmargin").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetTotalPrice();
    }
});
$("#txtoverheadCost").on('keyup', function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
        SetTotalPrice();
    }
});

$("#btnsubmit").on('click', function (e){
        var rows = dtble.data().count();
        if(rows > 0){
            if($("#txtmenuName").val() !== "" && $("#txtmenuCode").val() !== "" && $("#drpmenuCategory").val() > 0 ){
                if($("#txttotalPrice").val() !== "" && parseFloat(Revert_Currency_Formatter($("#txttotalPrice").val())) > 0){
                    SetMasterMenuRegister();
                }else{
                    Swal.fire("Error","Total price should be greater than zero","error");
                }
            }else{
                Swal.fire("Error","All mandatory fields (*) should be filled","error");
            }
        }else{
            Swal.fire("Error","No recipe found","error");
        }
});

function SetMasterMenuRegister(){

    var recipe = [];
    var isAct = document.querySelector('#chkactive:checked')?1:0;
    //loop throught the recipe table.
    dtble.rows().every(function ( rowIdx, tableLoop, rowLoop ) {
        var rawmatid = dtble.cell({row: rowIdx, column: 2}).data();
        var qty = dtble.cell({row: rowIdx, column: 4}).data();
        var rid = dtble.cell({row: rowIdx, column: 0}).data();

        var robj = {
            recipeid: rid,
            rawmaterialid: rawmatid,
            quantity: qty,
            menuid: MenuID,
            isactive: 1,
            createdby: UserID 
        }
        recipe.push(robj);
    });  

    var Jobject = {
        menuid: MenuID,
        menuname: $("#txtmenuName").val(),
        menucode: $("#txtmenuCode").val(),
        menucategory: $("#drpmenuCategory").val(),
        IsKOT: $("#drpisKOT").val(),
        menuimage: $("#imgMenu").val(),
        IsEnable: 1,
        totalcost: parseFloat(Revert_Currency_Formatter($("#txttotalCost").val())).toFixed(2),
        overheadcost: parseFloat(Revert_Currency_Formatter($("#txtoverheadCost").val())).toFixed(2),
        margin: parseFloat($("#txtmargin").val()).toFixed(2),
        totalprice: parseFloat(Revert_Currency_Formatter($("#txttotalPrice").val())).toFixed(2),
        Isactive: isAct,
        recipes: recipe,
        userid: UserID
    }

    Swal.fire({
        title: "Submit new menu",
        text: "Are you sure you want to submit this menu ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
        }).then((result)=>{
            if(result.value){
                var menucode_ = $("#txtmenuCode").val();

                //check isMenucode available
                fire_async_api_get("ResturantAdmin/IsMenuCodeAvailable?menucode="+menucode_+"&menuid="+MenuID).
                then((response)=>{
                    if(response > 0){
                        Swal.fire("Error","MenuCode not available. Please use another menu code","error");
                    }else{
                        //post data
                        var PostEndPoint;
                        if(MenuID > 0){
                            PostEndPoint = "ResturantAdmin/UpdateMasterMenuRegister";
                        }else{
                            PostEndPoint = "ResturantAdmin/SetMasterMenuRegister";
                        }
                        fire_async_api_post(PostEndPoint, Jobject).
                        then((response)=>{
                            if(response > 0){
                                // upload menu image.
                                const fileInput = document.getElementById('imgMenu');
                                const selectedFile = fileInput.files[0];
                                console.log(selectedFile);

                                var formdata = new FormData();
                                formdata.append("file", selectedFile);
                                fire_async_api_upload_file(formdata, "ResturantAdmin/UploadAttachments/"+response+"/"+UserID).
                                then((response) => {
                                    Swal.fire("Done","Menu created succesfully","success").then(()=>{
                                        ClearFields();
                                        location.reload();
                                    });
                                });
                            }else{
                                Swal.fire("Error","Menu creation failed","error");
                            }
                        });
                    }
                });
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
    document.getElementById('imgMenu').value = '';
    $("#drprawitemCategory").val(0).trigger('change');
    $("#drpitemName").find('option').not(':first').remove();
    dtble.clear().draw();
}

$("#imgMenu").on('change', function(){
    const [file] = document.getElementById('imgMenu').files;
    if (file) {
      $("#prv").attr("src", URL.createObjectURL(file));
    }
});

$("#btnviewlist").on('click', function (e){
    // upload menu image.
    const fileInput = document.getElementById('imgMenu');
    const selectedFile = fileInput.files[0];
    console.log(selectedFile);
});

$("#btnreset").on('click', function(){
    ClearFields();
    location.replace("/pages/forms/master/menuregister.html");
});

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