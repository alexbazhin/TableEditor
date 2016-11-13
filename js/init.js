(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown();
    $('.modal').modal();
    $('#add').modal('open');
    $('#add').modal('close');
    $('#textarea_edit').trigger('autoresize');

  }); // end of document ready
})(jQuery); // end of jQuery name space