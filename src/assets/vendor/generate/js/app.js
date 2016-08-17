/*
 * @Author: thedv
 * @Date:   2016-05-27 14:51:00
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-13 01:23:45
 */
(function() {
	'use strict';
	angular.module('Qsoft', [
		'ngCookies',
		'ngAnimate',
		'toastr',
		'angular-loading-bar',
		'ui.router',
		'ui.bootstrap',
		'restangular',

		'app.run',
		'app.config',
		'app.routes',
		'app.services',
		'app.templates',
		'app.controllers',
		'app.directives',

		'qsoft.routes',
		'qsoft.services',
		'qsoft.controllers'
	]);

	angular.module('app.run', []);
	angular.module('app.config', []);
	angular.module('app.routes', []);
	angular.module('app.services', []);
	angular.module('app.controllers', []);
	angular.module('app.directives', []);
	angular.module('app.templates', []);


	angular.module('qsoft.controllers', []);
	angular.module('qsoft.routes', []);
	angular.module('qsoft.services', []);

	angular.element(document).ready(function() {
		angular.bootstrap(document, ['Qsoft']);
	});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:07:13
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 01:05:04
 */
(function() {
	'use strict';
	angular.module('app.config').config([
		'$stateProvider',
		'$urlRouterProvider',
		'$locationProvider',
		'$httpProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

			$locationProvider.html5Mode(false).hashPrefix('!');

			// For any unmatched url, redirect to /
			$urlRouterProvider.otherwise('/');

			// Set up the states
			$stateProvider
				.state('app', {
					views: {
						'header@': {
							templateUrl: 'views/header.html',
							controller: 'HeaderController',
							controllerAs: 'vm'
						},
						'': {
							template: '<div ui-view></div>'
						}
					}
				})
				.state('home', {
					parent: 'app',
					url: '/',
					templateUrl: 'views/home.tpl.html'

				});
		}
	]);
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:07:13
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-13 01:58:51
 */
(function() {
	'use strict';
	angular.module('app.config').config(['RestangularProvider',
		function(RestangularProvider) {
			RestangularProvider.setBaseUrl('/api/v1');

		}
	]);
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:45:32
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 14:33:34
 */
(function() {
	'use strict';
	angular.module('app.controllers')
		.controller('GenerateController', ['FIELD_TYPE', 'generateService', 'listType', 'toastr',
			function(FIELD_TYPE, generateService, listType, toastr) {
				var vm = this;
				vm.listType = FIELD_TYPE;
				vm.onDelete = [{
					name: 'Cascade',
					key: 'cascade'
				}, {
					name: 'Set Null',
					key: 'set null'
				}, {
					name: 'No Action',
					key: 'no action'
				}, {
					name: 'Restrict',
					key: 'restrict'
				}, {
					name: 'Set Default',
					key: 'set default'
				}];

				vm.refType = [{
					name: '1:1',
					key: 'hasOne'
				}, {
					name: '1:n',
					key: 'hasMany'
				}, {
					name: 'n:n',
					key: 'belongsToMany'
				}];

				vm.model = {};
				vm.model.type = 1;
				vm.model.fields = [];

				vm.addField = function() {
					vm.model.fields.push({
						name: null,
						key: null,
						options: {
							nullable: true,
							unsigned: false,
							index: false,
							unique: false
						},
						ref: {
							foreign: false,
							references: 'id',
							onDelete: 'cascade'
						},
						arguments: []
					});
				};

				vm.removeField = function(field, index) {
					vm.model.fields.splice(index, 1);
				};

				vm.loading = false;
				vm.save = function(isValid) {
					vm.generateSuccess = false;
					if (isValid) {
						vm.loading = true;
						generateService.send(vm.model).then(function(res) {
							vm.loading = false;
							vm.generateSuccess = true;
							vm.success = res;
							toastr.success(res.message, 'Thông báo!');
						}, function(err) {
							vm.loading = false;
							toastr.error(err.data.message, 'Thông báo!');
						});
					}
				};

				var arrUns = [
					'bigInteger', 'boolean', 'decimal', 'double', 'float', 'integer', 'smallInteger', 'tinyInteger'
				];
				vm.hasDisable = function(field) {
					var check = arrUns.indexOf(field.key);
					if (check < 0) {
						field.unsigned = false;
						return true;
					} else {
						return false;
					}
				};

				vm.hasEnable = function(valid) {
					if (valid) {
						if (vm.model.type == 0) {
							return !vm.model.fields.length;
						} else if (vm.model.type == 1) {
							return !vm.model.schema;
						} else {
							return true;
						}
					} else {
						return true;
					}
				};

			}
		]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-05-30 10:29:13
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:40:25
 */

(function() {
	'use strict';
	angular.module('app.controllers')
		.controller('HeaderController', ['$state', 'menuService', 'Authentication', 'authService',
			function($state, menuService, Authentication, authService) {
				var vm = this;
				vm.auth = Authentication;
				vm.menus = menuService.getMenu('topbar');

				vm.logout = function() {
					authService.logout().then(function(res) {
						Authentication.clearAuth();
						$state.transitionTo('home');
					}, function(err) {

					});
				};
			}
		]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 01:32:07
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:56:07
 */

(function() {
	'use strict';
	angular.module('app.controllers')
		.controller('SigninController', ['authService', 'toastr', '$state',
			function(authService, toastr, $state) {
				var vm = this;
				vm.login = function(valid) {
					if (valid) {
						vm.loading = true;
						authService.login(vm.user).then(function(res) {
							vm.loading = false;
							$state.transitionTo('home');
						}, function(err) {
							vm.loading = false;
							toastr.error(err.data.message);
						});
					}
				};
			}
		]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 01:32:07
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:55:57
 */

(function() {
	'use strict';
	angular.module('app.controllers')
		.controller('SignupController', ['authService', 'toastr', '$state',
			function(authService, toastr, $state) {
				var vm = this;
				vm.register = function(valid) {
					if (valid) {
						vm.loading = true;
						authService.register(vm.user).then(function(res) {
							vm.loading = false;
							$state.transitionTo('home');
						}, function(err) {
							vm.loading = false;
							toastr.error(err.data.message);
						});
					}
				};
			}
		]);
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 16:36:08
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-05-27 16:36:36
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('convertToNumber', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel) {
					ngModel.$parsers.push(function(val) {
						return parseInt(val, 10);
					});
					ngModel.$formatters.push(function(val) {
						return '' + val;
					});
				}
			};
		});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 16:36:08
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:41:22
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputCamel', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, control) {

					scope.$watch(attrs.ngModel, function() {
						var text = _.camelCase(control.$viewValue);
						control.$setViewValue(text);
						element.val(text);
					});

				}
			};
		});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 16:36:08
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:41:07
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputCapitalize', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, control) {

					scope.$watch(attrs.ngModel, function() {
						var text = _.capitalize(control.$viewValue);
						control.$setViewValue(text);
						element.val(text);
					});

				}
			};
		});
})();
/*
 * @Author: Duong The
 * @Date:   2016-07-14 10:14:29
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:37:57
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputRoutePath', function() {
			return {
				require: 'ngModel',
				scope: {
					model: '=inputRoutePath'
				},
				link: function(scope, element, attrs, control) {

					scope.$watch('model', function() {
						var text = _.kebabCase(scope.model);
						control.$setViewValue(text);
						element.val(text);
					});

				}
			};
		});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 16:36:08
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:40:49
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputSnake', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, control) {

					scope.$watch(attrs.ngModel, function() {
						var text = _.snakeCase(control.$viewValue);
						control.$setViewValue(text);
						element.val(text);
					});

				}
			};
		});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 16:36:08
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:39:53
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputStartcase', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, control) {

					scope.$watch(attrs.ngModel, function() {
						var text = _.startCase(_.lowerCase(control.$viewValue));
						control.$setViewValue(text);
						element.val(text);

					});

				}
			};
		});
})();
/*
 * @Author: Duong The
 * @Date:   2016-07-14 10:14:29
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 10:38:19
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('inputTableName', function() {
			return {
				require: 'ngModel',
				scope: {
					model: '=inputTableName'
				},
				link: function(scope, element, attrs, control) {

					scope.$watch('model', function() {
						var text = _.snakeCase(window.pluralize(_.lowerCase(scope.model)));
						control.$setViewValue(text);
						element.val(text);
					});

				}
			};
		});
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 00:40:30
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-13 00:45:31
 */

(function() {
	'use strict';

	angular.module('app.directives')
		.directive('startCase', function() {
			return {
				restrict: 'A',
				link: function(scope, element, attrs, control) {
					var text = angular.element(element).text();
					angular.element(element).text(_.startCase(text));
				}
			};
		});
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:07:13
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 09:32:02
 */
(function() {
	'use strict';
	angular.module('app.routes').config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			//
			// Now set up the states
			$stateProvider
				.state('home.generate', {
					url: 'generate',
					templateUrl: 'views/generate/index.tpl.html',
					controller: 'GenerateController',
					controllerAs: 'vm',
					resolve: {
						listType: listType
					},
					data: {
						roles: ['guest']
					}
				});
		}
	]);

	function listType() {
		return [];
	}
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 01:27:56
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-13 21:07:45
 */

(function() {
	'use strict';
	angular.module('app.routes').config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('error', {
					parent: 'app',
					url: '/error',
					abstract: true,
					template: '<br /><div ui-view></div>'
				})
				.state('400', {
					parent: 'error',
					url: '/400',
					templateUrl: 'views/error/400.view.html'

				})
				.state('401', {
					parent: 'error',
					url: '/401',
					templateUrl: 'views/error/401.view.html'

				})
				.state('403', {
					parent: 'error',
					url: '/403',
					templateUrl: 'views/error/403.view.html'

				})
				.state('404', {
					parent: 'error',
					url: '/404',
					templateUrl: 'views/error/404.view.html'

				})
				.state('500', {
					parent: 'error',
					url: '/500',
					templateUrl: 'views/error/500.view.html'

				})
				.state('dashboard-template', {
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state('dashboard', {
					parent: 'dashboard-template',
					url: '/dashboard',
					templateUrl: 'views/common/dashboard/index.view.html',
					data: {
						roles: ['user']
					}
				})
				.state('auth', {
					parent: 'app',
					url: '/auth',
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state('auth.signin', {
					url: '/signin',
					templateUrl: 'views/common/auth/signin.view.html',
					controller: 'SigninController',
					controllerAs: 'vm'
				})
				.state('auth.signup', {
					url: '/signup',
					templateUrl: 'views/common/auth/signup.view.html',
					controller: 'SignupController',
					controllerAs: 'vm'
				});
		}
	]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 22:37:12
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 09:25:27
 */
(function() {
	'use strict';
	angular.module('app.run').run([
		'$rootScope',
		'$cookies',
		'$state',
		'$http',
		'Authentication',
		'Restangular',
		'authService',
		function($rootScope, $cookies, $state, $http, Authentication, Restangular, authService) {

			Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
				if (!response.config.ignoreAuthModule) {
					switch (response.status) {
						case 401:
							var accessToken = localStorage.getItem('access_token');
							if (accessToken) {
								authService.refreshToken().then(function(data) {
									Authentication.setAccessToken(data.refresh_token);
									response.config.headers.Authorization = 'Bearer ' + data.refresh_token;
									response.config.ignoreAuthModule = true;
									$http(response.config).then(responseHandler, deferred.reject);
								});
							} else {
								$state.transitionTo('401');
							}
							break;
						case 400:
							$state.transitionTo('400');
							break;
						case 403:
							$state.transitionTo('403');
							break;
						case 404:
							$state.transitionTo('404');
							break;
						case 405:
							$state.transitionTo('405');
							break;
					}

					return false;
				}
				return true;
			});

			Restangular.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

				var accessToken = localStorage.getItem('access_token');
				if (accessToken) {
					headers = headers || {};
					headers.Authorization = 'Bearer ' + accessToken;
				}

				return {
					element: element,
					params: params,
					headers: headers
				};
			});
		}
	]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-14 01:04:10
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 09:39:56
 */

(function() {
	'use strict';

	angular.module('app.run').run(run);

	run.$inject = ['$rootScope', '$cookies', '$state', '$http', 'Authentication', 'Restangular', 'authService'];

	function run($rootScope, $cookies, $state, $http, Authentication, Restangular, authService) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (toState.loginRequire) {

				if (Authentication.user === null || typeof Authentication.user !== 'object') {
					event.preventDefault();
					$state.go('auth.signin').then(function() {
						storePreviousState(toState, toParams);
					});
				}

			}
		});

		// Record previous state
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			storePreviousState(fromState, fromParams);
		});

		// Store previous state
		function storePreviousState(state, params) {
			// only store this state if it shouldn't be ignored 
			if (!state.data || !state.data.ignoreState) {
				$state.previous = {
					state: state,
					params: params,
					href: $state.href(state, params)
				};
			}
		}
	}


})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 01:19:44
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:56:52
 */

(function() {
	'use strict';
	angular.module('app.services')
		.service('authService', ['$q', 'Restangular', 'Authentication',
			function($q, Restangular, Authentication) {
				var api = Restangular.all('auth');

				return {
					login: function(data) {
						var deferred = $q.defer();

						api.all('login').withHttpConfig({
							ignoreAuthModule: true
						}).post(data).then(function(res) {
							Authentication.setCurrentUser(res.user);
							Authentication.setAccessToken(res.access_token);
							deferred.resolve(res);
						}, function(err) {
							deferred.reject(err);
						});

						return deferred.promise;
					},
					register: function(data) {
						var deferred = $q.defer();
						api.all('register').withHttpConfig({
							ignoreAuthModule: true
						}).post(data).then(function(res) {
							Authentication.setCurrentUser(res.user);
							Authentication.setAccessToken(res.access_token);
							deferred.resolve(res);
						}, function(err) {
							deferred.reject(err);
						});
						return deferred.promise;
					},

					logout: function() {
						return api.one('logout').get();
					},

					refreshToken: function() {
						return api.one('refresh-token').get();
					}
				};

			}
		]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-07-13 01:18:19
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:59:52
 */

(function() {
	'use strict';

	angular.module('app.services')
		.factory('Authentication', ['$q', '$window', 'Restangular',
			function($q, $window, Restangular) {
				var user = Restangular.all('users');

				var auth = {
					user: JSON.parse(localStorage.getItem('user')),
					access_token: localStorage.getItem('access_token')
				};

				auth.me = function() {
					return user.one('me').get();
				};

				auth.setCurrentUser = function(user) {
					auth.user = user;
					localStorage.setItem('user', JSON.stringify(user));
				};

				auth.getCurrentUser = function(user) {
					var user = localStorage.getItem('user');
					if (user)
						return JSON.parse(user);
					return false;
				};

				auth.setAccessToken = function(token) {
					auth.access_token = token;
					localStorage.setItem('access_token', token);
				};

				auth.getAccessToken = function(token) {
					return localStorage.getItem('access_token');
				};

				auth.clearAuth = function() {
					localStorage.removeItem('access_token');
					localStorage.removeItem('user');
					auth.user = null;
					auth.access_token = null;
				};

				return auth;
			}
		]);
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:43:27
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-07-14 00:46:24
 */
(function() {
	'use strict';

	angular.module('app.services').constant('FIELD_TYPE', [{
		name: 'Big Increments',
		key: 'bigIncrements',
	}, {
		name: 'Big Integer',
		key: 'bigInteger',
	}, {
		name: 'Binary',
		key: 'binary',
	}, {
		name: 'Boolean',
		key: 'boolean',
	}, {
		name: 'Char',
		key: 'char',
	}, {
		name: 'Date',
		key: 'date',
	}, {
		name: 'DateTime',
		key: 'dateTime',
	}, {
		name: 'Decimal',
		key: 'decimal',
	}, {
		name: 'Double',
		key: 'double',
	}, {
		name: 'Enum',
		key: 'enum',
	}, {
		name: 'Float',
		key: 'float',
	}, {
		name: 'Increments',
		key: 'increments',
	}, {
		name: 'Integer',
		key: 'integer',
	}, {
		name: 'Json',
		key: 'json',
	}, {
		name: 'Jsonb',
		key: 'jsonb',
	}, {
		name: 'LongText',
		key: 'longText',
	}, {
		name: 'MediumInteger',
		key: 'mediumInteger',
	}, {
		name: 'Medium Text',
		key: 'mediumText',
	}, {
		name: 'Morphs',
		key: 'morphs',
	}, {
		name: 'Small Integer',
		key: 'smallInteger',
	}, {
		name: 'String',
		key: 'string',
	}, {
		name: 'Text',
		key: 'text',
	}, {
		name: 'Time',
		key: 'time',
	}, {
		name: 'Tiny Integer',
		key: 'tinyInteger',
	}, {
		name: 'Timestamp',
		key: 'timestamp',
	}, {
		name: 'uuid',
		key: 'uuid',
	}]);
})();
/*
 * @Author: thedv
 * @Date:   2016-05-27 15:43:27
 * @Last Modified by:   Recycle Bin
 * @Last Modified time: 2016-05-27 23:58:08
 */
(function() {
	'use strict';

	angular.module('app.services')
		.service('generateService', ['Restangular', function(Restangular) {
			var generate = Restangular.all('generator');

			var sv = {};
			sv.send = function(data) {
				return generate.post(data);
			};


			return sv;
		}]);
})();
/*
 * @Author: Recycle Bin
 * @Date:   2016-05-30 10:23:16
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-05-30 10:23:57
 */

(function() {
	'use strict';

	angular.module('app.services')
		.service('menuService', ['Restangular', function(Restangular) {
			// Define a set of default roles
			this.defaultRoles = ['user', 'admin'];

			// Define the menus object
			this.menus = {};

			// A private function for rendering decision
			var shouldRender = function(user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					if (!user) {
						return false;
					}
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}

				return false;
			};

			// Validate menu existance
			this.validateMenuExistance = function(menuId) {
				if (menuId && menuId.length) {
					if (this.menus[menuId]) {
						return true;
					} else {
						throw new Error('Menu does not exist');
					}
				} else {
					throw new Error('MenuId was not provided');
				}

				return false;
			};

			// Get the menu object by menu id
			this.getMenu = function(menuId) {
				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Return the menu object
				return this.menus[menuId];
			};

			// Add new menu object by menu id
			this.addMenu = function(menuId, options) {
				options = options || {};

				// Create the new menu
				this.menus[menuId] = {
					roles: options.roles || this.defaultRoles,
					items: options.items || [],
					shouldRender: shouldRender
				};

				// Return the menu object
				return this.menus[menuId];
			};

			// Remove existing menu object by menu id
			this.removeMenu = function(menuId) {
				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Return the menu object
				delete this.menus[menuId];
			};

			// Add menu item object
			this.addMenuItem = function(menuId, options) {
				options = options || {};

				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Push new menu item
				this.menus[menuId].items.push({
					title: options.title || '',
					state: options.state || '',
					type: options.type || 'item',
					class: options.class,
					roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
					position: options.position || 0,
					items: [],
					shouldRender: shouldRender
				});

				// Add submenu items
				if (options.items) {
					for (var i in options.items) {
						this.addSubMenuItem(menuId, options.state, options.items[i]);
					}
				}

				// Return the menu object
				return this.menus[menuId];
			};

			// Add submenu item object
			this.addSubMenuItem = function(menuId, parentItemState, options) {
				options = options || {};

				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Search for menu item
				for (var itemIndex in this.menus[menuId].items) {
					if (this.menus[menuId].items[itemIndex].state === parentItemState) {
						// Push new submenu item
						this.menus[menuId].items[itemIndex].items.push({
							title: options.title || '',
							state: options.state || '',
							roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
							position: options.position || 0,
							shouldRender: shouldRender
						});
					}
				}

				// Return the menu object
				return this.menus[menuId];
			};

			// Remove existing menu object by menu id
			this.removeMenuItem = function(menuId, menuItemState) {
				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Search for menu item to remove
				for (var itemIndex in this.menus[menuId].items) {
					if (this.menus[menuId].items[itemIndex].state === menuItemState) {
						this.menus[menuId].items.splice(itemIndex, 1);
					}
				}

				// Return the menu object
				return this.menus[menuId];
			};

			// Remove existing menu object by menu id
			this.removeSubMenuItem = function(menuId, submenuItemState) {
				// Validate that the menu exists
				this.validateMenuExistance(menuId);

				// Search for menu item to remove
				for (var itemIndex in this.menus[menuId].items) {
					for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
						if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
							this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
						}
					}
				}

				// Return the menu object
				return this.menus[menuId];
			};

			//Adding the topbar menu
			this.addMenu('topbar', {
				roles: ['*']
			});
		}]);
})();