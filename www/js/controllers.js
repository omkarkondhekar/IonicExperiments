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

	$scope.initCompounding = function() {
		$scope.isCompounding = true;
	}

	$scope.FDAmt = function() {
		if (!$scope.isCompounding) {
			calculateSimpleInterestScope($scope);
		} else {
			calculateCompoundInterestScope($scope);
		}
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

/* Business Logic Functions start here */
function calculateSimpleInterestScope($scope) {
	var scopeInterest;
	scopeInterest = calculateSimpleInterest($scope.txtDeposit, $scope.txtROI,
			$scope.txtPeriod, $scope.periodTimeUnitList.label);
	$scope.finalAmt = calculateFinalAmount($scope.txtDeposit, scopeInterest)
			.toFixed(2);
	$scope.finalInterest = scopeInterest.toFixed(2);
	if (scopeInterest > 0) {
		setIsInterest($scope, true);
	}
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

function calculateCompoundInterestScope($scope) {
	var convertedTimeUnits = convertTimeunits($scope.txtPeriod,
			$scope.periodTimeUnitList.label,
			$scope.compoundingTimeUnitList.label);
	var compoundingResults = calculateCompoundInterest($scope.txtDeposit,
			$scope.txtROI, convertedTimeUnits);

	var scopeInterest;
	var scopeAmount;
	var len = compoundingResults.length;
	var scopeNetInterestRate;
	var i;

	scopeAmount = compoundingResults[len - 1].amount;
	scopeInterest = scopeAmount - $scope.txtDeposit;
	scopeNetInterestRate = (100 * scopeInterest)
			/ ($scope.txtDeposit * $scope.txtPeriod);
	$scope.finalAmt = scopeAmount.toFixed(2);
	$scope.finalInterest = scopeInterest.toFixed(2);
	$scope.netInterestRate = scopeNetInterestRate.toFixed(2);
	if (scopeInterest > 0) {
		setIsInterest($scope, true);
	}

	/*
	 * $scope.finalAmt = calculateFinalAmount($scope.txtDeposit, scopeInterest)
	 * .toFixed(2); $scope.finalInterest = scopeInterest.toFixed(2); if
	 * (scopeInterest > 0) { setIsInterest($scope, true); }
	 */
}

function calculateCompoundInterest(principle, rate, compoundingData) {
	var partialInterest;
	var partialAmount;
	var compoundingFactor;
	var compoundingResults = [];
	var i;

	switch (compoundingData[0].compoundingUnit) {
	case "Monthly":
		compoundingFactor = 12;
		break;

	case "Quarterly":
		compoundingFactor = 4;
		break;

	case "Half-Yearly":
		compoundingFactor = 2;
		break;

	case "Yearly":
		compoundingFactor = 1;
		break;
	}
	partialAmount = principle;
	for (i = 1; i <= compoundingData[0].perfectCount; i++) {
		partialInterest = (partialAmount * (rate / compoundingFactor)) / 100;
		partialAmount = partialAmount + partialInterest;
		compoundingResults.push({
			iteration : i,
			interest : partialInterest,
			amount : partialAmount
		});
	}
	partialInterest = (principle * (rate / compoundingFactor) * compoundingData[0].remainingCount) / 100;
	partialAmount = partialAmount + partialInterest;
	i = compoundingResults.length + 1;
	compoundingResults.push({
		iteration : i,
		interest : partialInterest,
		amount : partialAmount
	});
	return compoundingResults;
}

function convertTimeunits(timePeriod, srcTimeUnit, destTimeUnit) {
	var perfectCount = 0;
	var remainingCount = 0;
	convertedTimeUnits = [];
	/* Days Compounding Conversion Logic Starts */
	if (srcTimeUnit == "Days" && destTimeUnit == "Monthly") {
		perfectCount = parseInt(timePeriod / (365 / 12));
		remainingCount = timePeriod / (365 / 12) - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Monthly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Days" && destTimeUnit == "Quarterly") {
		perfectCount = parseInt(timePeriod / (365 / 4));
		remainingCount = timePeriod / (365 / 4) - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Quarterly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Days" && destTimeUnit == "Half-Yearly") {
		perfectCount = parseInt(timePeriod / (365 / 2));
		remainingCount = timePeriod / (365 / 2) - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Half-Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Days" && destTimeUnit == "Yearly") {
		perfectCount = parseInt(timePeriod / 365);
		remainingCount = timePeriod / 365 - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}
	/* Days Compounding Conversion Logic Ends */

	/* Monthly Compounding Conversion Logic Starts */
	if (srcTimeUnit == "Months" && destTimeUnit == "Monthly") {
		/* Return same value as no need of conversion from Month to Month */
		perfectCount = timePeriod;
		remainingCount = 0;
		convertedTimeUnits.push({
			compoundingUnit : "Monthly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Months" && destTimeUnit == "Quarterly") {
		perfectCount = parseInt(timePeriod / 3);
		remainingCount = timePeriod / 3 - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Quarterly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Months" && destTimeUnit == "Half-Yearly") {
		perfectCount = parseInt(timePeriod / 6);
		remainingCount = timePeriod / 6 - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Half-Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Months" && destTimeUnit == "Yearly") {
		perfectCount = parseInt(timePeriod / 12);
		remainingCount = timePeriod / 12 - perfectCount;
		convertedTimeUnits.push({
			compoundingUnit : "Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}
	/* Monthly Compounding Conversion Logic Ends */

	/* Yearly Compounding Conversion Logic Starts */
	if (srcTimeUnit == "Years" && destTimeUnit == "Monthly") {
		perfectCount = parseInt(timePeriod * 12);
		remainingCount = 0;
		convertedTimeUnits.push({
			compoundingUnit : "Monthly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Years" && destTimeUnit == "Quarterly") {
		perfectCount = parseInt(timePeriod * 4);
		remainingCount = 0;
		convertedTimeUnits.push({
			compoundingUnit : "Quarterly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Years" && destTimeUnit == "Half-Yearly") {
		perfectCount = parseInt(timePeriod * 2);
		remainingCount = 0;
		convertedTimeUnits.push({
			compoundingUnit : "Half-Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}

	if (srcTimeUnit == "Years" && destTimeUnit == "Yearly") {
		/* Return same value as no need of conversion from Year to Year */
		perfectCount = timePeriod;
		remainingCount = 0;
		convertedTimeUnits.push({
			compoundingUnit : "Yearly",
			perfectCount : perfectCount,
			remainingCount : remainingCount
		});
		return convertedTimeUnits;
	}
	/* Yearly Compounding Conversion Logic Ends */

}