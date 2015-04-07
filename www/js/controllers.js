angular.module('starter.controllers', [])

.controller('FDCnrl', function($scope) {
	$scope.isInterest = false;
	$scope.finalAmt = 0;
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
	$scope.finalInterest = (($scope.txtDeposit * $scope.txtROI * $scope.txtPeriod) / 100);
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
