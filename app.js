(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
    var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
            items: '<',
            onRemove: '&'
        },
        controller: NarrowItDownController
    };
    return ddo;
}


NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
function NarrowItDownController($scope, MenuSearchService) {
    $scope.getItems = function () {
        if ($scope.searchTerm !== undefined) {
            var found = MenuSearchService.getMatchedMenuItems($scope.searchTerm);
            found.then(function (foundItems) {
                $scope.foundItems = foundItems;
            });
        }
    }

    $scope.emptyList = function () {
        console.log($scope.items);
        if ($scope.items === undefined || $scope.items.length === 0) {
            return true;
        }
    }

    $scope.removeItem = function (itemIndex) {
        $scope.foundItems.splice(itemIndex, 1);
    }


}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
        var request = $http({
            method: "GET",
            url: "http://davids-restaurant.herokuapp.com/menu_items.json"
        });

        return request.then(function (response) {
            var allItems = response.data.menu_items;
            var foundItems = [];
            allItems.forEach(function (item) {
                if (item.description.match(searchTerm) !== null) {
                    foundItems.push(item);
                }
            });
            return foundItems;
        });
    };
}

})();
