/**
 * @author archmagece
 * @since 2014-12-10-21
 * @with WebGrimPan
 */

angular.module('includeExample', ['ngAnimate'])
	.controller('ExampleController', ['$scope', function($scope) {
		$scope.templates =
			[
				{ name: 'template1.html', url: 'template1.html'},
				{ name: 'template2.html', url: 'template2.html'}
			];
		$scope.template = $scope.templates[0];
	}]);