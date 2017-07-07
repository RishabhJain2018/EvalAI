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
        vm.hostTeamId = utilities.getData('challengeHostTeamId');
        vm.wrnMsg = {};
        vm.isValid = {};
        vm.isFormError = false;
        vm.challengeEvalScript = null;
        vm.challengeTitle = null;
        vm.formError = {};

        // start loader
        vm.startLoader = loaderService.startLoader;

        // stop loader
        vm.stopLoader = loaderService.stopLoader;

        // function to create a challenge using ui form.
    vm.challengeCreateUsingUi = function(challengeCreateFormValid) {
        if (challengeCreateFormValid) {
            console.log("11");
            if (vm.hostTeamId) {
                console.log("22");
                var evalScriptFileVal = angular.element(".eval-script").val();

                if (evalScriptFileVal === null || evalScriptFileVal === "") {
                    console.log("33");
                    vm.isFormError = true;
                    vm.formError = "Please upload Evaluation script file!";
                }

                if (vm.challengeEvalScript && vm.challengeTitle) {
                    console.log("hjghghg");
                    var parameters = {};
                    parameters.method = 'POST';
                    parameters.url = 'challenges/challenge/challenge_host_team/'+ vm.hostTeamId + '/challenge_ui/step1/';
                    var formdata = new FormData();
                    formdata.append("title", vm.challengeTitle);
                    formdata.append("short_description", vm.challengeShortDescription);
                    formdata.append("description", vm.challengeDescription);
                    formdata.append("terms_and_conditions", vm.challengeTermsAndConditions);
                    formdata.append("submission_guidelines", vm.challengeSubmissionGuidelines);
                    formdata.append("evaluation_details", vm.challengeEvaluationDetails);
                    formdata.append("published", vm.challengePublicallyAvailable);
                    formdata.append("enable_forum", vm.challengeEnableForum);
                    formdata.append("start_date", vm.challengeStartDate);
                    formdata.append("end_date", vm.challengeEndDate);
                    formdata.append("image", vm.challengeImage);
                    formdata.append("evaluation_script", vm.challengeEvalScript);
                    parameters.data = formdata;
                    parameters.token = userKey;
                    parameters.callback = {
                        onSuccess: function(response) {
                            var status = response.status;
                            var data = response.data;
                            if (status === 201)
                            {
                                console.log('step1 completed', data);
                                $rootScope.notify("success", "step1 is completed");
                                utilities.storeData('challenge', formdata);
                            }
                        },
                        onError: function(response) {
                            var error = response.data;
                            vm.isFormError = true;
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
