var UserID = 1;
var SupID = 0;

$(document).ready(function(){
    UserID = GetUserDetail();
    SupID = getUrlParameter('supid');
    if(SupID > 0){
        GetSupplierData();
    }
});

$("#btnsubmit").on('click', function(){
    SetSupplierData();
});

$("#btnviewlist").on('click', function (){
    location.replace("../listing/supplierlist.html");
})

function SetSupplierData(){
    var supcode = $("#txtsupplierCode").val();
    var supname = $("#txtsupplierName").val();
    var supcontact = $("#txtsupplierContact").val();
    var supaddress = $("#txtsupplierAddress").val();
    var isActive = document.querySelector('#chkactive:checked')?1:0;
    var remark = $("#txtremark").val();

    var JObject = {
        SupplierID: (supcode === "")?0:supcode,
        SupplierName: supname,
        SupplierAddress: supaddress,
        SupplierContact: supcontact,
        Remark: remark,
        IsActive: isActive
    }
    fire_async_api_post("ResturantAdmin/SetSupplier", JObject).then((response)=>{
        if(response > 0){
            Swal.fire("Done","Supplier created succesfully","success").then(()=>{
                ClearFields();
                location.reload();
            });
        }
    });
}

function GetSupplierData(){
    fire_async_api_get("ResturantAdmin/GetSuppliers?supid="+SupID).then((response)=>{
        $("#txtsupplierCode").val(response[0].SupplierID);
        $("#txtsupplierName").val(response[0].SupplierName);
        $("#txtsupplierContact").val(response[0].SupplierContact);
        $("#txtsupplierAddress").val(response[0].SupplierAddress);
        $("#txtremark").val(response[0].Remark);
        var status = (response[0].IsActive==1)?true:false;
        $("#chkactive").prop("checked",status);
    })
}

function ClearFields(){
    $("#txtsupplierCode").val("");
    $("#txtsupplierName").val("");
    $("#txtsupplierContact").val("");
    $("#txtsupplierAddress").val("");
    $("#txtremark").val("");
    document.getElementById('chkactive').checked = false;
}