var UserID = 1;
$(".select2").select2();
var RawCategory = [];
var UnitType = [];
var UoM = [];

var rawMatID = 0;

$(document).ready(function(){
    MasterData();
    clearfields();
    rawMatID = getUrlParameter('rawMatID');
    if(rawMatID > 0){
        ViewRawMaterialData();
    }
    console.log(rawMatID)
});

function MasterData(){
    //get item category
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
            $("#drpitemCategory").select2({
                data: RawCategory
            });
        }
    });

    //get Unittype
    fire_async_api_get("ResturantAdmin/GetUnitTypes").
    then((response)=>{
        if(response !== ""){
            JsonResult = response;
            JsonResult.forEach(element => {
                UnitType.push({
                    id: element.UnitTypeID,
                    text: element.UnitTypeName
                })
            });
            $("#drpunitType").select2({
                data: UnitType
            });
        }
    });

    //get UOM
    fire_async_api_get("ResturantAdmin/GetUnitOfMeasures").
    then((response)=>{
        if(response !== ""){
            JsonResult = response;
            JsonResult.forEach(element => {
                UoM.push({
                    id: element.MeasureID,
                    text: element.MeasureName
                })
            });
            $("#drpUOM").select2({
                data: UoM
            });
        }
    });
}
$("#btnsave").on('click', function(){
    SetMasterRawMaterials();
});

function SetMasterRawMaterials(){
    var isAct = document.querySelector('#chkactive:checked')?1:0;
    var ismenu = document.querySelector('#chkaddtomenu:checked')?1:0;
    var Jobj = {
        RawMaterialID: (rawMatID == false)?0:rawMatID,
        RawMaterialName: $("#txtitemName").val(),
        RawMaterialItemCode: $("#txtitemCode").val(),
        RawMaterialCategoryID: $("#drpitemCategory").val(),
        UnitType: $("#drpunitType").val(),
        UnitOfMeasure: $("#drpUOM").val(),
        ReOrderLevel: $("#txtreorderLevel").val(),
        UnitPrice: $("#txtunitPrice").val(),
        UnitQty: $("#txtunitqty").val(),
        SellingPrice: $("#txtsellingPrice").val(),
        IsActive: isAct,
        isMenuItem: ismenu
    }
    if(rawMatID > 0){
        fire_async_api_post("ResturantAdmin/UpdateMasterRawMaterials?userID="+UserID+"",Jobj).
        then((response)=>{
            if(response > 0){
                Swal.fire("Done","Raw Material updated succesfully","success").then(()=>{
                });    
                clearfields();        
            }else if(response == -1){
                Swal.fire("Error","Item Code or Item name already exists","error");
            }else{
                Swal.fire("Error","Submission failed","error");
            }
        });
    }else{
        fire_async_api_post("ResturantAdmin/SetMasterRawMaterials?userID="+UserID+"",Jobj).
        then((response)=>{
            if(response > 0){
                Swal.fire("Done","Raw Material added succesfully","success").then(()=>{
                });    
                clearfields();        
            }else if(response == -1){
                Swal.fire("Error","Item Code or Item name already exists","error");
            }else{
                Swal.fire("Error","Submission failed","error");
            }
        });
    }
    
}

function ViewRawMaterialData(){
    if(rawMatID && rawMatID > 0){
        fire_async_api_get("ResturantAdmin/GetMasterRawMaterials?RawMatID="+rawMatID+"").
        then((response)=>{
            if(response !== ""){
                $("#txtitemName").val(response[0].RawMaterialName);
                $("#txtitemCode").val(response[0].RawMaterialItemCode);
                $("#txtreorderLevel").val(response[0].ReOrderLevel);
                $("#txtunitPrice").val(response[0].UnitPrice);
                $("#txtunitqty").val(response[0].UnitQty);
                $("#txtsellingPrice").val(response[0].SellingPrice);

                $("#drpunitType").val(response[0].UnitType).trigger('change');
                $("#drpitemCategory").val(response[0].RawMaterialCategoryID).trigger('change');
                $("#drpUOM").val(response[0].UnitOfMeasure).trigger('change');

                var status = (response[0].IsActive==1)?true:false;
                $("#chkactive").prop("checked",status);
                var menu = (response[0].isMenuItem==1)?true:false;
                $("#chkaddtomenu").prop("checked",menu);
            }
        });
    }
}

function clearfields(){
    $("#txtitemName").val("");
    $("#txtitemCode").val("");
    $("#txtreorderLevel").val("");
    $("#txtunitPrice").val("");
    $("#txtunitqty").val("");
    $("#txtsellingPrice").val("");
}