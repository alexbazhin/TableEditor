'use strict';

var tableEditorApp = angular.module('tableEditorApp', ['ngRoute', 'ngResource']);

tableEditorApp.controller('MainCtrl',['$scope','$http', '$location', function($scope, $http, $location) {
    $scope.width = 0;
    $scope.height = 0;
    $scope.sortType = undefined;
    $scope.reverse = false;

    $scope.CreateTable = function(width, height) {
        $(document).ready(function() {
            $scope.height = parseInt(height);
            $scope.width = parseInt(width);
            $('.table').html("<table class='table_content' ></table>");
            for (var i = 1; i <= $scope.height; i++) {
                $('.table .table_content').append("<tr></tr>");
                for (var n = 1; n <= $scope.width; n++) {
                    $('.table .table_content tr:last').append("<td>" + i + "." + n + "</td>");
                }
            }
        });
        $scope.table = $('.table_content').tableToJSON();
        $(".table_content").remove();
        console.log($scope.table);
    };

    $scope.SaveData = function() {
        $scope.table = $('#table').tableToJSON();
    };

    $scope.UpdateTableForTextArea = function() {
        $("#textarea_edit").val(JSON.stringify($scope.table));
    };

    $scope.UpdateTableFromTextArea = function() {
        console.log($("#textarea_edit").val());
        var dataFromTextArea = JSON.parse($("#textarea_edit").val());
        $scope.table = dataFromTextArea;
        console.log(dataFromTextArea);
    };

    $scope.GetWidthTable = function() {
        var numRows=0;
        $('#table').each(function(){
            var row = $('tr', this);
            numRows = row.length;
        });
        $scope.width = numRows;
    };

    $scope.GetHeightTable = function() {
        var numColumns = 0;
        $('#table tr').each(function(){
            var column = $('td', this);
            numColumns = column.length;
        });
        $scope.height = numColumns;
    };

    $scope.AddData = function() {
        if ($("#add_line").prop("checked")) {
            $('.section #table').append("<tr id='add_row'></tr>");
            $scope.GetWidthTable();
            for (var n = 1; n <= $scope.width; n++) {
                $('.section #table tr:last').append("<td>Edit</td>");
            }
            $scope.table = $('#table').tableToJSON();
            $("#add_row").remove();
        }
        else {
            if ($("#add_column").prop("checked")) {
                $scope.GetHeightTable();
                $('.section #table tr').each(function() {
                    $(this).append("<td class='add_cell'>Edit</td>");
                });
                $scope.table = $('#table').tableToJSON();
                $(".add_cell").remove();
            }
        }
    };

    $scope.DeleteData = function() {
        $scope.table = $('#table').tableToJSON();
        if ($("#delete_line").prop("checked")) {
            var numberLine = parseInt($("#delete_name_line").val())-1;
            //console.log(numberLine);
            $('tr:eq('+numberLine+')').remove();
            $scope.table = $('#table').tableToJSON();
        }
        else {
            if ($("#delete_column").prop("checked")) {
                var numberColumn = parseInt($("#delete_header_column").val())-1;

                $('#table').find(' tr ').each(function() {
                    $(this).find('td:eq('+numberColumn+')').remove();
                });
                $scope.table = $('#table').tableToJSON();
            }
        }
    };

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var contents = event.target.result;
                $scope.table = JSON.parse(contents);
            };

            reader.onerror = function(event) {
                console.error("Error! Code " + event.target.error.code);
            };

            reader.readAsText(input.files[0]);
        }
    }

    $("#file_open").change(function() {
        readURL(this);
    });

    $('.section').on('dblclick', 'td', function (e) {
        //ловим элемент, по которому кликнули
        var t = e.target || e.srcElement;
        //получаем название тега
        var elm_name = t.tagName.toLowerCase();
        //если это инпут - ничего не делаем
        if (elm_name == 'input') {
            return false;
        }
        var val = $(this).html();
        var code = '<input type="text" id="edit_cell" value="' + val + '" />';
        $(this).empty().append(code);
        $('#edit_cell').focus();
        $('#edit_cell').blur(function () {
            var val = $(this).val();
            $(this).parent().empty().html(val);
            $scope.table = $('#table').tableToJSON();
        });
    });

    $scope.saveToPc = function(filename) {

        var data = $scope.table = $('#table').tableToJSON();

        if (!filename) {
            filename = 'download.json';
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 2);
        }

        var blob = new Blob([data], {type: 'text/json'});

        // FOR IE:

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else {
            var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    };

    $scope.sort = function(fieldName) {
        if ($scope.sortType === fieldName) {
            $scope.reverse = !$scope.reverse;
        }
        else {
            $scope.sortType = fieldName;
            $scope.reverse = false;
        }
    };

    $scope.isSortUp = function(fieldName) {
        return $scope.sortType === fieldName && !$scope.reverse;
    };

    $scope.isSortDown = function(fieldName) {
        return $scope.sortType === fieldName && $scope.reverse;
    };

}]);
