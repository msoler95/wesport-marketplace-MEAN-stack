var app = angular.module('WeSport');


app.controller('searchCtrl.search', function($scope, PostService, $rootScope) {

    ///////////////////////////BUSQUEDA ACTUAL//////////////////////
    $scope.busqueda = {
        deporte: 'Cualquier deporte',
        ubicacion: 'Cualquier lugar',
        fecha: 'Cualquier día',
        precio: '5-110',
        nivel: 'Principiante',
        tipo: 'Individual',
        material: 'No tengo material'
    }

    $scope.modalBusqueda = {
        deporte: 'Cualquier deporte',
        ubicacion: '',
        fecha: 'Cualquier día',
        precio: '5-110',
        nivel: 'Principiante',
        enGrupo: false,
        conMaterial: false
    }



    ///////////////////////////MODAL BUSQUEDA//////////////////////
    $scope.openSearchModal = function() {
        $('#searchModal').openModal();
        // Create the search box and link it to the UI element.

    }

    $scope.open_select_sport = function() { $('#select_sport').material_select('open'); }



    //Funcio per quan l'usuari li dona al botó busqueda
    $scope.busca = function() {
        //Si es modifica la localitzacio
        if ($scope.modalBusqueda.ubicacion != '') {
            $rootScope.loadingBar = true;


            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById('pac-input').value;
            geocoder.geocode({ 'address': address }, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var coord = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                    PostService.getPostsByLocation(coord).then(function(posts) {

                        $rootScope.loadingBar = false;
                        $scope.posts = posts;
                        $('.materialboxed').materialbox();

                        // //Modifiquem el html
                        if ($scope.modalBusqueda.enGrupo)
                            var valorIndividual = 'En grupo';
                        else
                            var valorIndividual = 'Individual';
                        if ($scope.modalBusqueda.conMaterial)
                            var valorMaterial = 'Tengo material';
                        else
                            var valorMaterial = 'No tengo material';

                        //Agafem els valors
                        var valorDeporte = $scope.modalBusqueda.deporte;
                        var valorDonde = $scope.modalBusqueda.ubicacion;
                        var valorCuando = $scope.modalBusqueda.fecha;
                        var valorRangeSliderPrecios = $("#rango_precios").prop("value").split(";");
                        valorRangeSliderPrecios = valorRangeSliderPrecios[0] + "-" + valorRangeSliderPrecios[1]
                        var valorRangeSliderNivel = $("#rango_nivel").prop("value");


                        //Actualitzem la busqueda
                        $scope.busqueda.deporte = $scope.modalBusqueda.deporte;
                        $scope.busqueda.ubicacion = valorDonde;
                        $scope.busqueda.fecha = valorCuando;
                        $scope.busqueda.precio = valorRangeSliderPrecios;
                        $scope.busqueda.nivel = valorRangeSliderNivel;
                        $scope.busqueda.tipo = valorIndividual;
                        $scope.busqueda.material = valorMaterial;

                    }, function(errMsg) {
                        Materialize.toast(errMsg, 3000);

                    });

                } else {
                    Materialize.toast('Error buscando la dirección', 3000);
                }
            });
        } else {
            $rootScope.loadingBar = true;
            PostService.getAllPosts({ lat: 41.385451, lng: 2.173850 }).then(function(posts) {
                $rootScope.loadingBar = false;
                $scope.posts = posts;
                $('.materialboxed').materialbox();
                //Agafem els valors
                var valorDeporte = $scope.modalBusqueda.deporte;
                var valorDonde = $scope.modalBusqueda.ubicacion;
                var valorCuando = $scope.modalBusqueda.fecha;
                var valorRangeSliderPrecios = $("#rango_precios").prop("value").split(";");
                valorRangeSliderPrecios = valorRangeSliderPrecios[0] + "-" + valorRangeSliderPrecios[1]
                var valorRangeSliderNivel = $("#rango_nivel").prop("value");


                //Actualitzem la busqueda
                $scope.busqueda.deporte = valorDeporte;
                $scope.busqueda.ubicacion = 'Cualquier lugar';
                $scope.busqueda.fecha = valorCuando;
                $scope.busqueda.precio = valorRangeSliderPrecios;
                $scope.busqueda.nivel = valorRangeSliderNivel;
                $scope.busqueda.tipo = valorIndividual;
                $scope.busqueda.material = valorMaterial;
            }, function(errMsg) {
                Materialize.toast(errMsg, 3000);

            });


        }
    }

    // $scope.inicializeImages = function() {
    //     console.log('hi')
    //     $('.materialboxed').materialbox();
    // }   




    ///////////////////////////ORDEN////////////////////// 
    $scope.ordenFiltro = "dateInit";
    $scope.botonFiltro = "Ordenar por: Precio ↑";
    //Funcio per cancelar els canvis
    $scope.ordenar = function(valorFiltro) {
        switch (valorFiltro) {
            case "precioAsc":
                $scope.botonFiltro = "Ordenar por: Precio ↑";
                $scope.ordenFiltro = "money";
                break;
            case "precioDesc":
                $scope.botonFiltro = "Ordenar por: Precio ↓";
                $scope.ordenFiltro = "-money";
                break;
                // case "valoracionAsc":
                //  $scope.botonFiltro = "Ordenar por: Valoracion ↑";
                //  $scope.ordenFiltro = "estrellas";
                //  break;
                // case "valoracionDesc":
                // $scope.botonFiltro = "Ordenar por: Valoracion ↓";
                // $scope.ordenFiltro = "-estrellas";
                // break;
        }
    }



    $rootScope.loadingBar = true;
    PostService.getAllPosts({ lat: 41.385451, lng: 2.173850 }).then(function(posts) {
        $rootScope.loadingBar = false;
        $scope.posts = posts;
        $('.materialboxed').materialbox();

    }, function(errMsg) {
        Materialize.toast(errMsg, 3000);

    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    var today = yyyy + '-' + mm + '-' + dd;
    console.log("today = " + today)
        //Function for the ng-repeat to filter
    $scope.comparator = function() {
        return function(item) {
            console.log(item.dateInit);
            if ($scope.modalBusqueda.deporte == 'Cualquier deporte' ||  $scope.modalBusqueda.deporte == item.sport) {
                if (($scope.modalBusqueda.fecha == 'Cualquier día' && item.dateEnd >= today) || ($scope.modalBusqueda.fecha >= item.dateInit && $scope.modalBusqueda.fecha <= item.dateEnd)) {
                    var valorRangeSliderPrecios = $("#rango_precios").prop("value");
                    if (valorRangeSliderPrecios == undefined) {
                        valorRangeSliderPrecios = [0, 100000];
                    } else valorRangeSliderPrecios = valorRangeSliderPrecios.split(";");
                    if (valorRangeSliderPrecios[0] <= item.money && valorRangeSliderPrecios[1] >= item.money) {
                        return true;
                    } else return false;
                } else return false;
            } else return false;
        }
    }


    $scope.sweetAlert = function(id_post, name) {
        if ($rootScope.isAuthenticated) {
            PostService.getTelefonOfPost(id_post).then(function(result) {
                swal(String("Teléfono de " + name + ": " + result), "¡Disfruta de la clase!", "success");
            }, function(errMsg) {
                swal("A ocurrido un error", "Debes estar registrado para ver el teléfono", "error");
            });
        } else swal("¿Aún no tienes cuenta?", "Debes estar registrado para ver el teléfono", "error");

    }


    ///////////////////////////FI USUARIS//////////////////////




});

// app.directive('repeatDone', function() {
//     return function(scope, element, attrs) {
//         if (scope.$last) { // all are rendered
//             scope.$eval(attrs.repeatDone);
//         }
//     }
// });


function initAutocomplete() {
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

}
