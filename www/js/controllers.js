angular
		.module('starter.controllers', [])

		.controller(
				'FDCnrl',
				function($scope) {
					$scope.finalAmt = ($scope.txtDeposit * $scope.txtROI * $scope.txtPeriod) / 100;
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
