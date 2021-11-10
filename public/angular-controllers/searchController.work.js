var app = angular.module('WeSport');


app.controller('searchCtrl.work', function($scope, PostService, UserService) {


    $scope.open_select_sport = function() { $('#select_sport').material_select('open'); }
    $scope.posts = [];
    $scope.newPost = {
        sport: '',
        place: '',
        dateInit: '',
        dateEnd: '',
        money: '',
        contact: '',
        description: ''
    }

    $scope.publicarPost = function() {
        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('pac-input').value;
        geocoder.geocode({ 'address': address }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                $scope.newPost.loc = { type: "Point", coordinates: [results[0].geometry.location.lat(), results[0].geometry.location.lng()], name: address};
                PostService.createPost($scope.newPost).then(function(msg) {


                    $scope.posts.push($scope.newPost);
                    var auxTelefono = $scope.newPost.contact;
                    $scope.newPost = {
                        sport: '',
                        place: '',
                        dateInit: '',
                        dateEnd: '',
                        money: '',
                        contact: auxTelefono,
                        description: ''
                    }
                    Materialize.toast(msg, 3000);
                }, function(errMsg) {
                    Materialize.toast(errMsg, 3000);

                });
            } else Materialize.toast("Error con la localizacion", 3000);

        })

    }

    PostService.getUserPosts().then(function(result) {
        $scope.posts = result;

    }, function(errMsg) {
        Materialize.toast(errMsg, 3000);

    });

    UserService.getPhone().then(function(phone) {
        $scope.newPost.contact = phone;
    }, function(errMsg) {
        console.log(errMsg)
    })



    $scope.botonFiltroDeporte = "Ordenar por";
    $scope.ordenFiltro = "";

    $scope.botondeporteHide = 'Mostrar deporte';

    $scope.deletePost = function(idPost, index) {
        swal({
                title: "¿Estás seguro?",
                text: "Tu publicacion se eliminará permanentemente",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sí, eliminarla",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    PostService.deletePost(idPost).then(function(result) {
                        $scope.posts.splice(index, 1);
                        swal("Eliminada!", "Tu publicación ha sido eliminada", "success");

                    }, function(errMsg) {
                        Materialize.toast(errMsg, 3000);

                    })
                }
            });
    }

    $scope.openEditPost = function(index) {
        $scope.indexBeforeEdited = index;
        $scope.postBeforeEdit = angular.copy($scope.posts[index]);
        $scope.postDuringEdit = $scope.posts[index];
        $('#date-picker1-modal').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            format: 'yyyy-mm-dd',
            onOpen: function() {
                $('.btn-flat picker__close').text('Cerrar');
            }

        });
        $('#date-picker2-modal').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            format: 'yyyy-mm-dd',
            onOpen: function() {
                $('.btn-flat picker__close').text('Cerrar');
            }

        });
        $('#date-picker1-modal').pickadate('set').set('select', new Date($scope.postDuringEdit.dateInit));
        $('#date-picker2-modal').pickadate('set').set('select', new Date($scope.postDuringEdit.dateEnd));
        $('#modalEdit').openModal();
    }

    $scope.cancelModalPost = function(index) {
        $scope.posts[$scope.indexBeforeEdited] = $scope.postBeforeEdit;
        $('#modalEdit').closeModal();

    }
    $scope.acceptModalPost = function(index) {

        $('#modalEdit').closeModal();
         var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('pac-input2').value;
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.postDuringEdit.loc = { type: "Point", coordinates: [results[0].geometry.location.lat(), results[0].geometry.location.lng()], name: address };
                $scope.postDuringEdit.dateInit = $('#date-picker1-modal').val();
                $scope.postDuringEdit.dateEnd = $('#date-picker2-modal').val();
                PostService.editPost($scope.postDuringEdit).then(function(msg) {
                    Materialize.toast(msg, 3000);

                }, function(errMsg) {
                    Materialize.toast(errMsg, 3000);

                });
            }
        });

    }

    $scope.ordenar = function(valorFiltro) {
        switch (valorFiltro) {
            case "Deporte":
                $scope.botonFiltroDeporte = "Deporte";
                $scope.ordenFiltro = "sport";
                break;
            case "Lugar":
                $scope.botonFiltroDeporte = "Lugar";
                $scope.ordenFiltro = "place";
                break;
        }
    }

    $scope.mostrarDeporte = function(deporte) {
        switch (deporte) {
            case "Ski":
                $scope.botondeporteHide = "Ski";
                $scope.deporteAMostrar = "Ski";
                break;
            case "Basket":
                $scope.botondeporteHide = "Basket";
                $scope.deporteAMostrar = "Basket";
                break;
            case "Futbol":
                $scope.botondeporteHide = "Futbol";
                $scope.deporteAMostrar = "Futbol";
                break;
            case "Todos":
                $scope.botondeporteHide = "Todos";
                $scope.deporteAMostrar = "";
                break;
        }
    }


});

function initAutocomplete() {
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    var input2 = document.getElementById('pac-input2');
    var searchBox2 = new google.maps.places.SearchBox(input2);

}