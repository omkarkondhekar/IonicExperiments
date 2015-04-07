angular.module('starter.controllers', [])

.controller('FDCnrl', function($scope) {
	$scope.isInterest = false;
	$scope.finalAmt = 0;

	$scope.periodTimeUnits = [ {
		label : 'Days',
		text : 'days'
	}, {
		label : 'Months',
		text : 'months'
	}, {
		label : 'Years',
		text : 'years'
	} ];

	$scope.compoundingTimeUnits = [ {
		label : 'Monthly'
	}, {
		label : 'Quarterly'
	}, {
		label : 'Half-Yearly'
	}, {
		label : 'Yearly'
	} ];

	$scope.FDAmt = function() {
		calculateSimpleInterest($scope);
	}
	$scope.resetForm = function() {
		resetForm($scope);
	}
})

.controller('DashCtrl', function($scope) {
})

.controller('ChatsCtrl', function($scope, Chats) {
	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	}
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends : true
	};
});

function calculateSimpleInterest($scope) {
	console.log("TimeUnit List is " + $scope.periodTimeUnitList.label);
	if ($scope.periodTimeUnitList.label = "Years") {
		$scope.finalInterest = (($scope.txtDeposit * $scope.txtROI * $scope.txtPeriod) / 100);
	}

	if ($scope.periodTimeUnitList.label = "Days") {
		$scope.finalInterest = (($scope.txtDeposit * $scope.txtROI / 365
				* $scope.txtPeriod / 365) / 100);
	}

	if ($scope.periodTimeUnitList.label = "Months") {
		$scope.finalInterest = (($scope.txtDeposit * $scope.txtROI / 12
				* $scope.txtPeriod / 12) / 100);
	}

	$scope.finalAmt = $scope.txtDeposit + $scope.finalInterest;
	if ($scope.finalAmt > 0) {
		$scope.isInterest = true;
	}
}

function resetForm($scope) {
	$scope.txtDeposit = "";
	$scope.txtROI = "";
	$scope.txtPeriod = "";
	$scope.isInterest = false;
	$scope.isCompounding = false;
}
