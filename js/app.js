'use strict';

/* App Module */

$('#delete input[type="radio"]').click(function() {
    switch ($(this).attr('id')) {
        case 'delete_line':
            $("#delete_header_column").prop('disabled', true);
            $("#delete_name_line").prop('disabled', false);
            break;
        case 'delete_column':
            $("#delete_header_column").prop('disabled', false);
            $("#delete_name_line").prop('disabled', true);
            break;
        default:
            console.log( 'Error! Have not this parameter' );
    }
});
