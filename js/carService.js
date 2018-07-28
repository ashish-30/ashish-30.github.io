define(['./template.js', './clientStorage.js'], function(template, clientStorage){
    var apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var apiUrlLatest = apiUrlPath + 'latest-deals.php';
    var apiUrlCar = apiUrlPath + 'car.php?carId=';

    function loadMoreRequest(){
        fetchPromise()
        .then(function(status){
            document.getElementById("connection-status").innerHTML = status;
            loadMore();
        })
    }

    function fetchPromise(){
        return new Promise(function(resolve, reject){
            fetch(apiUrlLatest + "?carId=" + clientStorage.getLastCarId())
            .then(function(response){
                return response.json();
            }).then(function(data){
                clientStorage.addCars(data.cars)
                .then(function(){
                    data.cars.forEach(preCacheDetailsPage);
                    resolve("The connection is OK, showing latest results");
                });
            }).catch(function(e){
                resolve("No connection, showing offline results");
            });
            setTimeout(function(){resolve("The connection is hanging, showing offline results");}, 3000);
        });
    }

    function loadMore(){
        clientStorage.getCars().then(function(cars){
            template.appendCars(cars);
        });
    }

    // function loadCarPage(carId){
    //     fetch(apiUrlCar + carId)
    //     .then(function(response){
    //         return response.text();
    //     }).then(function(data){
    //         document.body.insertAdjacentHTML('beforeend', data);
    //     }).catch(function(){
    //         alert("Oops, can't retrieve page");
    //     })
    // }
    
    function loadCarPage(carId){
        fetch(apiUrlLatest)
        .then(function(response){
            return response.json();
        }).then(function(data){
            for(var i in data.cars) {
                if(data.cars[i].value.details_id == carId){
                    popupdata = '<div id="car-page" style="width:100%;height:100%;background-color:rgba(225,225,225,0.8);position:fixed;top:0;left:0;display:inline-block;bottom:0;-webkit-overflow-scrolling: touch;overflow-y:scroll;z-index:100000" onclick="document.querySelector(\'#car-page\').parentNode.removeChild(document.querySelector(\'#car-page\'));"><div style="width:70%;min-width:270px;background-color:#ffffff;margin:15px auto;padding:15px;position:relative;z-index:999;" class="mdl-shadow--6dp"><button style="position:absolute; right: 16px; top:16px;" class="mdl-button mdl-js-button mdl-js-ripple-effect close-button" type="button" >X</button><div class="mdl-grid" style="margin:0"><div class="mdl-cell mdl-cell--6-col" style="margin-top:0"><h4 class="mdl-color-text--red" style="margin:0;padding-right:50px;">' + data.cars[i].value.details_id + '</h4></div><div class="mdl-cell mdl-cell--6-col" style="text-align:right;">  </div></div><div class="mdl-grid" style="margin:0"><div class="mdl-cell mdl-cell--6-col car-image" style="background-repeat: no-repeat;min-height:300px;background-size: cover;background-image:url(' + data.cars[i].value.image + ');"></div><div class="mdl-cell mdl-cell--6-col"><h5 style="padding-left:10px" class="mdl-color-text--red">Data</h5><div class="mdl-grid car-details-info"><div class="mdl-cell mdl-cell--6-col"><b>Model:</b></div><div class="mdl-cell mdl-cell--6-col">' + data.cars[i].value.model + '</div><div class="mdl-cell mdl-cell--6-col"><b>price:</b></div><div class="mdl-cell mdl-cell--6-col">' + data.cars[i].value.price + '</div><div class="mdl-cell mdl-cell--6-col"><b>Brand:</b></div><div class="mdl-cell mdl-cell--6-col">' + data.cars[i].value.brand + '</div><div class="mdl-cell mdl-cell--6-col"><b>Year:</b></div><div class="mdl-cell mdl-cell--6-col">' + data.cars[i].value.year + '</div><div class="mdl-cell mdl-cell--6-col"><b>Type:</b></div><div class="mdl-cell mdl-cell--6-col">Used</div><div class="mdl-cell mdl-cell--6-col"><b>Fuel Type:</b></div><div class="mdl-cell mdl-cell--6-col">Gasoline</div><div class="mdl-cell mdl-cell--6-col"><b>Gear Type:</b></div><div class="mdl-cell mdl-cell--6-col">Manual</div><div class="mdl-cell mdl-cell--6-col"><b>Class:</b></div><div class="mdl-cell mdl-cell--6-col">Euro 4</div><div class="mdl-cell mdl-cell--6-col"><b>Transmission:</b></div><div class="mdl-cell mdl-cell--6-col">Front</div><div class="mdl-cell mdl-cell--6-col"><b>Mileage (km):</b></div><div class="mdl-cell mdl-cell--6-col">50345</div></div></div></div><div class="mdl-grid" style="margin:0"><div class="mdl-cell mdl-cell--12-col" style="padding: 0 16px;"><h5 style="margin-top:0" class="mdl-color-text--red">Description</h5><p style="color:#000000">' + data.cars[i].value.description + '</p><div><a onClick="if(window.PaymentRequest) {   const supportedPaymentMethods = [    { supportedMethods: [\'basic-card\'], data: {  supportedNetworks: [\'visa\', \'mastercard\', \'amex\', \'discover\',\'diners\', \'jcb\', \'unionpay\'] }   }    ]; const paymentDetails = { total: {  label: \'Total\', amount:{ currency: \'USD\',  value: '+ data.cars[i].value.price +' } } };   const options = {}; const paymentRequest= new PaymentRequest( supportedPaymentMethods,  paymentDetails,  options ); paymentRequest.show(); } else {                        }">Buy Now</a></div></div></div> </div></div>';
                }
            }
            document.body.insertAdjacentHTML('beforeend', popupdata);
        }).catch(function(){
            alert("Oops, can't retrieve page");
        })
    }
    
    

    function preCacheDetailsPage(car){
        if('serviceWorker' in navigator){
            var carDetailsUrl = apiUrlCar + car.value.details_id;
            window.caches.open('carDealsCachePagesV1').then(function(cache){
                cache.match(carDetailsUrl).then(function(response){
                    if(!response) cache.add(new Request(carDetailsUrl));
                })
            })
        }
    }

    return {
        loadMoreRequest: loadMoreRequest,
        loadCarPage: loadCarPage
    }

});