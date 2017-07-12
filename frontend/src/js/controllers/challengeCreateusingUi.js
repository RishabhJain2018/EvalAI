// Invoking IIFE for create challenge using ui page
(function() {

    'use strict';

    angular
        .module('evalai')
        .controller('ChallengeCreateUsingUiCtrl', ChallengeCreateUsingUiCtrl);

    ChallengeCreateUsingUiCtrl.$inject = ['utilities', 'loaderService', '$rootScope', '$scope'];

    function ChallengeCreateUsingUiCtrl(utilities, loaderService, $rootScope, $scope) {
        var vm = this;
        var userKey = utilities.getData('userKey');
        vm.hostTeamId = utilities.getData('challengeHostTeamId');
        vm.wrnMsg = {};
        vm.isValid = {};
        vm.isFormError = false;
        vm.challengeEvalScript = null;
        vm.challengeTitle = null;
        vm.formError = {};
        vm.step1 = true;
        vm.step2 = false;
        vm.step3 = false;
        vm.step4 = false;
        vm.step5 = false;

        // start loader
        vm.startLoader = loaderService.startLoader;

        // stop loader
        vm.stopLoader = loaderService.stopLoader;

        // function to create a challenge using ui form.
        vm.challengeCreate = function(challengeCreateFormValid) {
            if (vm.hostTeamId) {
                if (challengeCreateFormValid) {
                    var evalScriptFileVal = angular.element(".eval-script").val();

                    if (evalScriptFileVal === null || evalScriptFileVal === "") {
                        vm.isFormError = true;
                        vm.formError = "Please upload Evaluation script file!";
                    }

                    if (vm.challengeEvalScript && vm.challengeTitle) {
                        var parameters = {};
                        parameters.method = 'POST';
                        parameters.url = 'challenges/challenge/challenge_host_team/'+ vm.hostTeamId + '/step_1/';
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
                        console.log(formdata.get('evaluation_script'));
                        parameters.token = userKey;
                        parameters.callback = {
                            onSuccess: function(response) {
                                var status = response.status;
                                var data = response.data;
                                if (status === 201)
                                {   
                                    vm.step2 = true;
                                    vm.step1 = false;
                                    $rootScope.notify("success", "step1 is completed");
                                    utilities.storeData('challenge', data);
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
                utilities.sendRequest(parameters, 'header', 'upload');
                }
                }
                else {
                    angular.element(".file-path").val(null);
                    $rootScope.notify("info", "Please select a challenge host team!");
                }
            };

        $scope.leaderboards = [
            {"schema": null}
        ];

        vm.addNewLeaderboard = function() {
            $scope.leaderboards.push({"schema": null});
        };

        vm.removeNewLeaderboard = function(index) {
            $scope.leaderboards.splice(index, 1);
        };

        vm.leaderboardCreate = function(leaderboardCreateFormValid){
            if (leaderboardCreateFormValid){
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/leaderboard/step_2/';
                parameters.data = $scope.leaderboards;
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        var data = response.data;
                        if (status === 201) {
                            vm.step3 = true;
                            vm.step2 = false;
                            vm.step1 = false;
                            $rootScope.notify("success", "Step2 is completed");
                            utilities.storeData('leaderboard', data);
                        }
                    },
                    onError: function(response) {
                        var error = response.data;
                        var status = response.status;
                        if (status === 400){
                            vm.isFormError = true;
                            vm.formdata = error;
                        }
                    }
                };
                utilities.sendRequest(parameters);
            }else {
                console.log("abc");   
            }
        };

        vm.challengeId = utilities.getData('challenge').id;
        console.log(vm.challengeId);

        $scope.challenge_phases = [
            {
             "name": null,
             "description": null,
             "start_date": null,
             "end_date": null,
             "is_public": null,
             "is_submission_public": null,
             "max_submissions_per_day": null,
             "max_submissions": null,
             "codename": null,
             "leaderboard_public": null,
             "test_annotation": null,
             "challenge": vm.challengeId
            }
        ];

        vm.addNewChallengePhase = function() {
            $scope.challenge_phases.push({
             "name": null,
             "description": null,
             "start_date": null,
             "end_date": null,
             "is_public": null,
             "is_submission_public": null,
             "max_submissions_per_day": null,
             "max_submissions": null,
             "codename": null,
             "leaderboard_public": null,
             "test_annotation": null,
             "challenge": vm.challengeId
            });
        };

        vm.removeNewChallengePhase = function(index) {
            $scope.challenge_phases.splice(index, 1);
        };

        vm.challengePhaseCreate = function(challengePhaseCreateFormValid){
            if (challengePhaseCreateFormValid){
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/challenge_phase/'+ vm.challengeId +'/step_3/';
                parameters.data = $scope.challenge_phases;
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        var data = response.data;
                        if (status === 201) {
                            vm.step4 = true;
                            vm.step2 = false;
                            vm.step1 = false;
                            vm.step3 = false;
                            $rootScope.notify("success", "Step3 is completed");
                            utilities.storeData('challenge_phase', data);
                        }
                    },
                    onError: function(response) {
                        var error = response.data;
                        vm.isFormError = true;
                        vm.formdata = error;
                    }
                };
                utilities.sendRequest(parameters, 'header', 'upload');
            }else {
                console.log("Challenge Phase");   
            }
        };

        $scope.datasetSplits = [
            {"name": null,
             "codename": null}
        ];

        vm.addNewDatasetSplit = function() {
            $scope.leaderboards.push({"name": null, "codename": null});
        };

        vm.removeNewDatasetSplit = function(index) {
            $scope.leaderboards.splice(index, 1);
        };

        vm. datasetSplitCreate = function(datasetSplitCreateFormValid) {
            if (datasetSplitCreateFormValid) {
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/dataset_split/step_4/';
                parameters.data = $scope.datasetSplits;
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        var data = response.data;
                        if (status === 201) {
                            vm.step5 = true;
                            vm.step4 = false;
                            vm.step3 = false;
                            vm.step2 = false;
                            vm.step1 = false;
                            $rootScope.notify("success", "Step 4 is completed!");
                            utilities.storeData('datasetSplit', data);
                        }
                    },
                    onError: function(response){
                        var error = response.data;
                        var status = response.status;
                        if (status === 400) {
                            vm.isFormError = true;
                            vm.formdata = error;
                        }
                    }
                };
                utilities.sendRequest(parameters);
            } else {
                console.log("datasetSplit");
            }
        };

    }
})();
