angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $rootScope, $timeout, $ionicLoading) {
    // Code you want executed every time view is opened
//    $scope.taxiData = taxiData = {};
//    $scope.$on('$ionicView.enter', function () {
    $timeout(function () {
        $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session"));
    //  console.log(taxiData);
        ionItems = document.getElementsByTagName("ion-item");
        navIcons = document.getElementsByTagName("button");
        console.log(ionItems[0]);
        console.log(navIcons[0]);
        console.log('dddddd')

        if (!taxiData) {
            $ionicLoading.hide();
            navIcons = document.getElementsByClassName("ion-navicon");
            for (i = 0; i < navIcons.length; i++) navIcons[i].classList.add("ng-hide");
            $state.go('tab.login');
            return false;
        } else {
            for (i = 0; i < navIcons.length; i++) navIcons[i].classList.remove("ng-hide");
        }

    }, 100);

/*    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
*/
})


.controller('HistoryCtrl', function($scope, $state, HistoryService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    HistoryService.getAll(taxiData.id).then(function(response) {
        $timeout(function() {
            $scope.histories = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
    $scope.view = function(hID) {
        $state.go('tab.history.view', {hID: hID});
    }
})
.controller('HistoryViewCtrl', function($scope, $state, $stateParams, HistoryService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    HistoryService.getOne($scope.hID).then(function(response) {
        $timeout(function() {
            $scope.history = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
})


.controller('InfriengeCtrl', function($scope, $state, InfriengeService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    InfriengeService.getAll(taxiData.id).then(function(response) {
        $timeout(function() {
            $scope.infrienges = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });

    $scope.view = function(iID) {
        $state.go('tab.infrienge.view', {iID: iID});
    }
})
.controller('InfriengeViewCtrl', function($scope, $state, $stateParams, InfriengeService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    InfriengeService.getOne($scope.iID).then(function(response) {
        $timeout(function() {
            $scope.infrienge = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
})

.controller('BuyCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location) {
    $ionicNavBarDelegate.showBackButton(false);

    $scope.refreshItems = function () {
        if (taxiData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            TripsService.getAllBuy(taxiData.id).then(function(response) {
                console.log(response);
                $scope.trips_today = response.today;
                $scope.trips_others = response.others;

                $ionicLoading.hide();
            });
        }
    }

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }

    // initialize
    $scope.refreshItems();
})
.controller('BuyViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(true);
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.tripID = $stateParams.tripID;
    $scope.trip = {};

    TripsService.getOne($scope.tripID).then(function(response) {
        $timeout(function() {
            $scope.trip = response;
            $ionicLoading.hide();
        }, 1000);
    })
})

.controller('TripsCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location) {
    $ionicNavBarDelegate.showBackButton(false);

    $scope.loadTimeLeft = function(response, from) {
        for (i = 0; i < response.length; i++) {
            var j = i + from;

            var end_time = new Date(response[i].time);
            var now = new Date();
            var diff_sec = end_time - now;
            var time_left = moment(end_time, "YYYYMMDD H:i:s").startOf('hour').fromNow();

            if (parseInt(response[i].coin) <= 0) {
                document.getElementsByTagName("buy")[j].innerHTML = "Chuyến không có sẵn";
                document.getElementsByTagName("pricebuy")[j].innerHTML = "";
            } else {
                var pricebuy = parseInt(response[i].price)-parseInt(response[i].coin);
                document.getElementsByTagName("pricebuy")[j].innerHTML = pricebuy+'<span class="small">k</span>';

                if (parseInt(response[i].taxiid) == parseInt(taxiData.id)) {
                    document.getElementsByTagName("buy")[j].classList.add("my");
                    document.getElementsByTagName("buy")[j].innerHTML = "Đã mua";
                } else if (parseInt(response[i].status) == 1) {
                    document.getElementsByTagName("buy")[j].innerHTML = "Đã được mua";
                } else if (diff_sec <= 0) {
                    document.getElementsByTagName("buy")[j].innerHTML = "Hết hạn";
                } else if (parseInt(response[i].seat) > parseInt(taxiData.seat)) {
                    document.getElementsByTagName("buy")[j].innerHTML = "Xe bạn không đủ chỗ";
                } else {
                    document.getElementsByTagName("time")[j].classList.remove('ng-hide');
                    document.getElementsByTagName("time")[j].innerHTML = '<span class="time_left">'+time_left+'</span>';
                }
            }

        }
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	console.log(fromState);
        console.log(toState);
    	if ($location.path() == "/tab/trips") {
    		$scope.refreshItems();
        }
    });

    $scope.refreshItems = function () {
        if (taxiData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            TripsService.getAll(taxiData.id).then(function(response) {
                console.log(response);
                $scope.trips_myPriority = response.myPriority;
                $scope.trips_today = response.today;
                $scope.trips_others = response.others;

                $timeout(function() {
                    $scope.loadTimeLeft(response.myPriority, 0);
                    $scope.loadTimeLeft(response.today, response.myPriority.length);
                    $scope.loadTimeLeft(response.others, response.today.length+response.myPriority.length);
                }, 1000);

                $ionicLoading.hide();
            });
        }
    }

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }


    // initialize
    $scope.refreshItems();
})
.controller('TripsViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(true);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.tripID = $stateParams.tripID;
    $scope.trip = {};

    $scope.msToTime = function (s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        var days = Math.floor(hrs/24);
        var hrs = hrs%24;

        if (days > 0) return days+'d '+hrs+'h '+mins+'m '+secs+'s ';
        else return hrs+'h '+mins+'m '+secs+'s ';
    }

    $scope.loadTimeLeft = function(response) {
        var end_time = new Date(response.time);
        var now = new Date();
        var diff_sec = end_time - now;

        if (diff_sec <= 0) {
            document.getElementsByTagName("timev")[0].innerHTML = '<span class="trip-view-time_left passed">Hết hạn</span>';
            document.getElementsByTagName("button")[4].classList.add('ng-hide');
        } else {
            var diff = this.msToTime(diff_sec);
            document.getElementsByTagName("timev")[0].innerHTML = '<span class="trip-view-time_left">'+diff+'</span>';
            document.getElementsByTagName("button")[4].classList.remove('ng-hide');
        }
    }

    $scope.showInfo = function (response) {
        var button = document.getElementsByTagName("button")[4];
        button.classList.add("disabled");
        button.innerHTML = "Đã mua";
        document.getElementsByTagName("more")[0].classList.remove("ng-hide");
        document.getElementsByTagName("pnr")[0].innerHTML = response.PNR;
        document.getElementsByTagName("price")[0].innerHTML = response.price;
        document.getElementsByTagName("from")[0].innerHTML = response.addressfrom_full;
        document.getElementsByTagName("to")[0].innerHTML = response.addressto_full;
        document.getElementsByTagName("name")[0].innerHTML = response.name;
        document.getElementsByTagName("detailss")[0].innerHTML = response.details;
        document.getElementsByTagName("phone")[0].innerHTML = response.phone;
        document.getElementsByTagName("phone")[0].classList.remove("ng-hide");
        var timeEle = document.getElementsByTagName("timev")[0];
        timeEle.parentNode.removeChild(timeEle);
        button.removeAttribute("ng-click");
    }

    $scope.theInterval = null;

    $scope.checkBuy = function (response) {
        var button = document.getElementsByTagName("button")[4];

        if (parseInt(response.coin) <= 0) {
            button.classList.add("disabled");
            button.innerHTML = "Chuyến không có sẵn";
            document.getElementsByTagName("pricebuyv")[0].innerHTML = "";
        } else {
            var pricebuy = parseInt(response.price)-parseInt(response.coin);
            document.getElementsByTagName("pricebuyv")[0].innerHTML = 'Giá mua ngay: <b class="trip-coin-view">'+pricebuy+'k</b>';

            if (response.taxiid == taxiData.id) {
                $scope.showInfo(response);
            } else {
                if (parseInt(response.status) == 1) { // taken
                    button.classList.add("disabled");
                    button.innerHTML = "Chuyến đã được mua";
                } else {
                    var end_time = new Date(response.time);
                    var now = new Date();
                    var diff_sec = end_time - now;

                    if (diff_sec <= 0) {
                        button.classList.add("disabled");
                        button.innerHTML = "Hết hạn";
                        button.removeAttribute("ng-click");
                    } else if (parseInt(response.seat) > parseInt(taxiData.seat)) {
                        button.classList.add("disabled");
                        button.innerHTML = "Xe bạn không đủ chỗ";
                        button.removeAttribute("ng-click");
                    } else {
                        $scope.theInterval = $interval(function(){
                            $scope.loadTimeLeft(response);
                        }.bind(this), 1000);
                        $scope.$on('$destroy', function () {
                            $interval.cancel($scope.theInterval)
                        });
                    }
                }

            }

        }
        button.classList.remove("ng-hide");
    }

    $scope.buy = function(tripID) {
        TripsService.buy($scope.tripID, taxiData.id).then(function(response) {
            console.log(response);
            if (response == 1) {
                newCoin = taxiData.coin = taxiData.coin - $scope.trip.coin;
                document.getElementsByTagName("coin")[0].innerHTML = newCoin+"k";
                $scope.showInfo($scope.trip);
                $interval.cancel($scope.theInterval);
            } else {
                if (response == -1) {
                    errorInfo = "Bạn không đủ tiền để mua chuyến này";
                } else if (response == -2) {
                    errorInfo = "Lỗi không tìm thấy chuyến. Bạn vui lòng thử tải lại trang...";
                } else if (response == -3) {
                    errorInfo = "Chuyến này đã được mua hoặc không tồn tại";
                }
                var alertPopup = $ionicPopup.show({
                  template: errorInfo,
                  title: 'Lỗi',
                  scope: $scope,
                  buttons: [
                    {
                        text: 'Đóng',
                        type: 'button-assertive'
                    }
                  ]
                });
                alertPopup.then(function(res) {
                  console.log('Closed!', res);
                });
            }
        })
    }

    TripsService.getOne($scope.tripID).then(function(response) {
        $timeout(function() {
            console.log(response);
            console.log('~~~');
            $scope.trip = response;

            $scope.checkBuy(response);

            if (response.is_round == 0) {
                document.getElementsByTagName("notround")[0].classList.remove("ng-hide");
                document.getElementsByTagName("round")[0].classList.add("ng-hide");
            } else {
                document.getElementsByTagName("round")[0].classList.remove("ng-hide");
                document.getElementsByTagName("notround")[0].classList.add("ng-hide");
            }
            $scope.trip = response; //Assign data received to $scope.data

            $ionicLoading.hide();
        }, 1500);
    });
})


.controller('LogoutCtrl', function($scope, $ionicPopup, $state) {
    window.localStorage.removeItem("session");
    taxiData = null;
    navIcons = document.getElementsByClassName("ion-navicon");
    for (i = 0; i < navIcons.length; i++) navIcons[i].classList.add("ng-hide");
    $state.go('tab.login');
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicHistory, $rootScope) {
    $ionicNavBarDelegate.showBackButton(false);

    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).then(function(data) {
            console.log(data);
            if (data == -1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!'
                });
            } else if (data == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi hệ thống!',
                    template: ''
                });
            } else {
                taxiData = data;
                document.getElementsByTagName("info")[0].innerHTML = taxiData.name;
                document.getElementsByTagName("coin")[0].innerHTML = taxiData.coin+"k";

                navIcons = document.getElementsByClassName("ion-navicon");
                for (i = 0; i < navIcons.length; i++) navIcons[i].classList.remove("ng-hide");

                $state.go('tab.trips');
            }
        })
    }
})



.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    if (taxiData) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $timeout(function() {
            console.log(taxiData);
            $scope.account = taxiData;
            $ionicLoading.hide();
        }, 1000);
    }
});
