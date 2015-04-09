angular.module('starter.controllers', [])

.controller('FDCnrl', function($scope) {
	$scope.isInterest = false;
	$scope.finalAmt = 0;
	$scope.compoundingInterestData = [];
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
	$scope.hideInterest = function() {
		setIsInterest($scope, false);
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

function calculateSimpleInterestScope($scope);
{
	var scopeInterest
	scopeInterest = calculateSimpleInterest($scope.txtDeposit, $scope.txtROI,
			$scope.txtPeriod, $scope.periodTimeUnitList.label);
	$scope.finalAmt = calculateFinalAmount($scope.txtDeposit, scopeInterest)
			.toFixed(2);
	$scope.finalInterest = scopeInterest.toFixed(2);
}

function calculateSimpleInterest(principle, rate, depositPeriod,
		depositTimeUnit) {
	var interest;
	if (depositTimeUnit == "Years") {
		interest = ((principle * rate * depositPeriod) / 100);
	}

	if (depositTimeUnit == "Days") {
		interest = ((principle * rate / 365 * depositPeriod) / 100);
	}

	if (depositTimeUnit == "Months") {
		interest = ((principle * rate / 12 * depositPeriod) / 100);
	}
	return interest;
}

function calculateFinalAmount(principle, interest) {
	return principle + interest;
}

function calculateCompoundInterest(principle, rate, depositPeriod,
		depositTimeUnit, compoundingUnit) {
	var loopFactor;
	var remainderFactor;
	var tempAmount = 0;
	var i;
	var compoundInterestData=[];

	if (compoundingUnit == "Monthly") {
		if (depositTimeUnit == "Days" && depositPeriod >= 60) {
			loopFactor = depositPeriod / 30;
			remainderFactor = depositPeriod % 30;
			for (i = 1; i <= loopFactor; i++) {
				var partialInterest = calculateSimpleInterest(principle, rate,
						depositPeriod, depositTimeUnit);
				var partialAmount = tempAmount + partialInterest;
				compoundInterestData.push("iteration");
				tempAmount = partialAmount;
			}
		}
	}
}

function setIsInterest($scope, value) {
	$scope.isInterest = value;
}
function setIsCompounding($scope, value) {
	$scope.isCompounding = value;
}

function resetForm($scope) {
	$scope.txtDeposit = "";
	$scope.txtROI = "";
	$scope.txtPeriod = "";
	setIsInterest($scope, false);
	setIsCompounding($scope, false);
}
