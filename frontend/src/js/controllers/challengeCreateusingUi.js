// Invoking IIFE for create challenge using ui page
(function() {

    'use strict';

    angular
        .module('evalai')
        .controller('ChallengeCreateUsingUiCtrl', ChallengeCreateUsingUiCtrl);

    ChallengeCreateUsingUiCtrl.$inject = ['utilities', 'loaderService', '$rootScope'];

    function ChallengeCreateUsingUiCtrl(utilities, loaderService, $rootScope) {
        var vm = this;
        var userKey = utilities.getData('userKey');
        var hostTeamId = utilities.getData('challengeHostTeamId');
        vm.wrnMsg = {};
        vm.isValid = {};
        vm.isFormError = false;
        vm.challengeEvalScript = null;
        vm.formError = {};

        // start loader
        vm.startLoader = loaderService.startLoader;

        // stop loader
        vm.stopLoader = loaderService.stopLoader;

        // function to create a challenge using ui form.
    vm.challengeCreateUsingUi = function() {
            if (hostTeamId) {
                var evalScriptFileVal = angular.element(".eval-script").val();

                if (evalScriptFileVal === null || evalScriptFileVal === "") {
                    vm.isFormError = true;
                    vm.formError = "Please upload Evaluation script file!";
                }

                if (vm.evalScriptfile && vm.challengeTitle) {
                    var parameters = {};
                    parameters.url = '';
                    parameters.method = 'POST';
                    parameters.data = {
                        "title": vm.challengeTitle,
                        "short_description": vm.challengeShortDescription,
                        "description": vm.challengeDescription,
                        "terms_and_conditions": vm.challengeTermsAndConditions,
                        "submission_guidelines": vm.challengeSubmissionGuidelines,
                        "evaluation_details": vm.challengeEvaluationDetails,
                        "publically_available": vm.challengePublicallyAvailable,
                        "enable_forum": vm.challengeEnableForum,
                        "anonymous_leaderboard": vm.challengeAnonymousLeaderboard,
                        "start_date": vm.challengeStartDate,
                        "end_date": vm.challengeEndDate,
                        "image": vm.challengeImage,
                        "evaluation_script": vm.challengeEvalScript,
                    };
                    parameters.token = userKey;
                    parameters.callback = {
                        onSuccess: function(response) {
                            var status = response.status;
                            var data = response.data;
                            if (status === 201)
                            {
                                console.log('step1 completed', data);
                                $rootScope.notify("success", "step1 is completed");
                                utilities.storeData('challenge', parameters);
                            }
                        },
                        onError: function(response) {
                            var error = response.data;
                            angular.forEach(error, function(value, key) {
                                if (key == 'title') {
                                    vm.isValid.title = true;
                                    vm.wrnMsg.title = value[0];
                                }
                                if (key == 'short_description') {
                                    vm.isValid.short_description = true;
                                    vm.wrnMsg.short_description = value[0];
                                }
                                if (key == 'description') {
                                    vm.isValid.description = true;
                                    vm.wrnMsg.description = value[0];
                                }
                                if (key == 'terms_and_conditions') {
                                    vm.isValid.terms_and_conditions = true;
                                    vm.wrnMsg.terms_and_conditions = value[0];
                                }
                                if (key == 'submission_guidelines') {
                                    vm.isValid.submission_guidelines = true;
                                    vm.wrnMsg.submission_guidelines = value[0];
                                }
                                if (key == 'evaluation_details') {
                                    vm.isValid.evaluation_details = true;
                                    vm.wrnMsg.evaluation_details = value[0];
                                }
                                if (key == 'publically_available') {
                                    vm.isValid.publically_available = true;
                                    vm.wrnMsg.publically_available = value[0];
                                }
                                if (key == 'enable_forum') {
                                    vm.isValid.enable_forum = true;
                                    vm.wrnMsg.enable_forum = value[0];
                                }
                                if (key == 'anonymous_leaderboard') {
                                    vm.isValid.anonymous_leaderboard = true;
                                    vm.wrnMsg.anonymous_leaderboard = value[0];
                                }
                                if (key == 'start_date') {
                                    vm.isValid.start_date = true;
                                    vm.wrnMsg.start_date = value[0];
                                }
                                if (key == 'end_date') {
                                    vm.isValid.end_date = true;
                                    vm.wrnMsg.end_date = value[0];
                                }
                                if (key == 'image') {
                                    vm.isValid.image = true;
                                    vm.wrnMsg.image = value[0];
                                }
                                if (key == 'evaluation_script') {
                                    vm.isValid.evaluation_script = true;
                                    vm.wrnMsg.evaluation_script = value[0];
                                }
                            });
                        }
                    };
                }
                utilities.sendRequest(parameters, 'header', 'upload');
            }
            else {
                angular.element(".file-path").val(null);
                $rootScope.notify("info", "Please select a challenge host team!");
            }
        };

    }
})();
