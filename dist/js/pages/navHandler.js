$(document).ready(function (){
    SideBar();
});

function SideBar(){
    var userName = Cookies.get('UserName');
    var node_logo = document.getElementById("logo");
    var element = '<a href="../../../index3.html" class="brand-link">'+
    '<img src="../../../dist/img/AdminLTELogo.png" alt="AdminLTE Logo"'+
        'class="brand-image img-circle elevation-3" style="opacity: .8">'+
    '<span class="brand-text font-weight-light">Resturant Admin</span></a>';
    node_logo.innerHTML += element;

    var node_user = document.getElementById("sidebar_user");
    var user_element = '<div class="user-panel mt-3 pb-3 mb-3 d-flex">'+
    '<div class="image">'+
        '<img src="../../../dist/img/user8-128x128.jpg" class="img-circle elevation-2" alt="User Image">'+
    '</div>'+
    '<div class="info">'+
        '<a id="lbluname" href="#" class="d-block">'+userName+'</a>'+
    '</div></div>';
    node_user.innerHTML += user_element;

    var node_search = document.getElementById("sidebar_search");
    var search_element = '<div class="form-inline">'+
    '<div class="input-group" data-widget="sidebar-search">'+
        '<input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">'+
        '<div class="input-group-append">'+
            '<button class="btn btn-sidebar">'+
               '<i class="fas fa-search fa-fw"></i>'+
            '</button>'+
        '</div>'+
    '</div>'+
    '</div>';
    node_search.innerHTML += search_element;

    var master_nav_list_item_food = document.getElementById("nav_item_food");
    master_nav_list_item_food.classList.add("menu-open");

    const nav_header_food = '<a href="#" class="nav-link"> <i class="nav-icon fas fa-utensils"></i>'+ 
    '<p> Foods <i class="right fas fa-angle-left"></i> </p> </a>';
    const top_ul = '<ul class="nav nav-treeview">';

    const rawfoodCategory_li = '<li class="nav-item">'+
        '<a href="../../../pages/forms/master/rawfoodcategory.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Raw Food Category</p>'+
        '</a>'+
    '</li>';
    const rawfood_li = '<li class="nav-item">'+
    '<a href="../../../pages/forms/master/rawfoodmaster.html" class="nav-link">'+
        '<i class="fas fa-minus nav-icon"></i>'+
        '<p class="img-size-50">Raw Foods</p>'+
    '</a>'+
    '</li>';

    const rawfoodstock_li = '<li class="nav-item">'+
    '<a href="../../../pages/forms/listing/rawmateriallist.html" class="nav-link">'+
        '<i class="fas fa-minus nav-icon"></i>'+
        '<p class="img-size-50">Raw Food Stock List</p>'+
    '</a>'+
    '</li>';

    const menucategory_li = '<li class="nav-item">'+
        '<a href="../../../pages/forms/master/menucategory.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Menu Category</p>'+
        '</a>'+
    '</li>';

    const menulist_li = '<li class="nav-item">'+
        '<a href="../../../pages/forms/listing/menulist.html" class="nav-link ">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Resturant Menu List</p>'+
        '</a>'+
    '</li>';
    const menuregister_li = '<li class="nav-item">'+
        '<a href="../../../pages/forms/master/menuregister.html" class="nav-link ">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Menu Register</p>'+
        '</a>'+
    '</li>';

    const end_ul = '</ul>';

    const NAV_items_food = 
    nav_header_food + top_ul + rawfoodCategory_li + rawfood_li + rawfoodstock_li + menucategory_li + menuregister_li + menulist_li + end_ul;

    //supplier NAV
    var master_nav_list_item_supplier = document.getElementById("nav_item_supplier");
    master_nav_list_item_supplier.classList.add("menu-open");

    const nav_header_supplier = '<a href="#" class="nav-link"> <i class="nav-icon fas fa-truck"></i>'+ 
    '<p> Supplier <i class="right fas fa-angle-left"></i> </p> </a>';
    

    const supplier_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/master/suppliers.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Suppliers</p>'+
        '</a>'+
    '</li>';

    const supplierlist_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/listing/supplierlist.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Supplier List</p>'+
        '</a>'+
    '</li>';

    const supplierpayment_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/master/supplierPayment.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Supplier Payment</p>'+
        '</a>'+
    '</li>';

    const supplieroutstanding_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/listing/supplieroutstanding.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">Supplier Outstanding List</p>'+
        '</a>'+
    '</li>';

    const NAV_item_supplier =
    nav_header_supplier + top_ul + supplier_li + supplierlist_li + supplierpayment_li + supplieroutstanding_li + end_ul;

    //Inventory NAV
    var master_nav_list_item_inventory = document.getElementById("nav_item_inventory");
    master_nav_list_item_inventory.classList.add("menu-open");
    master_nav_list_item_inventory.classList.add("mb-3");

    const nav_header_inventory =
    '<a href="#" class="nav-link">'+
        '<i class="nav-icon fas fa-boxes"></i>'+
        '<p> Inventory <i class="right fas fa-angle-left"></i> </p>'+
    '</a>'
    '<ul class="nav nav-treeview">';

    const GRN_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/inventory/rawfoodGRN.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">New GRN</p>'+
        '</a>'+
    '</li>';
    const viewGRN_li = 
    '<li class="nav-item">'+
        '<a href="../../../pages/forms/listing/grnlisting.html" class="nav-link">'+
            '<i class="fas fa-minus nav-icon"></i>'+
            '<p class="img-size-50">GRN Listing</p>'+
        '</a>'+
    '</li>';

    const NAV_item_inventory =
    nav_header_inventory + top_ul + GRN_li + viewGRN_li + end_ul;

    master_nav_list_item_food.innerHTML += NAV_items_food;
    master_nav_list_item_supplier.innerHTML += NAV_item_supplier;
    master_nav_list_item_inventory.innerHTML += NAV_item_inventory;
}
  
