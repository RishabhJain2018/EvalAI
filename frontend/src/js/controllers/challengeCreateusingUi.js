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
        vm.step1 = false;
        vm.step2 = false;
        vm.step3 = false;
        vm.step4 = false;
        vm.step5 = false;
        vm.challengeEnableForum = false;
        vm.challengePublicallyAvailable = false;

        // start loader
        vm.startLoader = loaderService.startLoader;

        // stop loader
        vm.stopLoader = loaderService.stopLoader;

        vm.formatDate = function(dateTimeObject) {
            var dateTime = dateTimeObject.toISOString();
            var splitDateTime = dateTime.split("T");
            var date = splitDateTime[0];
            var time = splitDateTime[1].split(".")[0];
            return date + " " + time;
        };

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
                        vm.challengeStartDate = vm.formatDate(vm.challengeStartDate);
                        vm.challengeEndDate = vm.formatDate(vm.challengeEndDate);
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
                                console.log("Challenge", data);
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

        vm.leaderboards = [
            {"schema": null}
        ];

        vm.addNewLeaderboard = function() {
            vm.leaderboards.push({"schema": null});
        };

        vm.removeNewLeaderboard = function(index) {
            vm.leaderboards.splice(index, 1);
        };

        vm.leaderboardCreate = function(leaderboardCreateFormValid){
            if (leaderboardCreateFormValid){
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/leaderboard/step_2/';
                parameters.data = vm.leaderboards;
                console.log(vm.leaderboards);
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        var data = response.data;
                        console.log("leaderboards", data);
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

        vm.challenge_phases = [
            {
             "name": null,
             "description": null,
             "codename": null,
             "max_submissions_per_day": null,
             "max_submissions": null,
             "start_date": null,
             "end_date": null,
             "test_annotation": null,
             "is_public": null,
             "leaderboard_public": null
            }
        ];

        vm.addNewChallengePhase = function() {
            vm.challenge_phases.push({
             "name": null,
             "description": null,
             "codename": null,
             "max_submissions_per_day": null,
             "max_submissions": null,
             "start_date": null,
             "end_date": null,
             "test_annotation": null,
             "is_public": null,
             "leaderboard_public": null
            });
        };

        console.log("CHALLENGE PHASES", vm.challenge_phases);

        vm.removeNewChallengePhase = function(index) {
            vm.challenge_phases.splice(index, 1);
        };

        vm.challengePhaseCreate = function(challengePhaseCreateFormValid){
            if (challengePhaseCreateFormValid) {
                vm.challengeId = utilities.getData('challenge').id;

                for (var i=0; i<vm.challenge_phases.length; i++) {
                    var challengePhaseList = [];
                    var formdata = new FormData();
                    var parameters = {};
                    vm.challenge_phases[i].start_date = vm.formatDate(vm.challenge_phases[i].start_date);
                    vm.challenge_phases[i].end_date = vm.formatDate(vm.challenge_phases[i].end_date);
                    formdata.append("name", vm.challenge_phases[i].name);
                    formdata.append("description", vm.challenge_phases[i].description);
                    formdata.append("codename", vm.challenge_phases[i].codename);
                    formdata.append("max_submissions_per_day", vm.challenge_phases[i].max_submissions_per_day);
                    formdata.append("max_submissions", vm.challenge_phases[i].max_submissions);
                    formdata.append("start_date", vm.challenge_phases[i].start_date);
                    formdata.append("end_date", vm.challenge_phases[i].end_date);
                    formdata.append("leaderboard_public", vm.challenge_phases[i].leaderboard_public || false);
                    formdata.append("is_public", vm.challenge_phases[i].is_public || false);
                    formdata.append("test_annotation", vm.challenge_phases[i].test_annotation);
                    formdata.append("challenge", vm.challengeId);
                    parameters.method = 'POST';
                    parameters.url = 'challenges/challenge/challenge_phase/'+ vm.challengeId +'/step_3/';
                    parameters.data = formdata;
                    parameters.token = userKey;
                    parameters.callback = {
                        onSuccess: function(response) {
                            var status = response.status;
                            var data = response.data;
                            challengePhaseList.push(data);
                            if (status === 201) {
                                vm.step4 = true;
                                vm.step2 = false;
                                vm.step1 = false;
                                vm.step3 = false;
                                console.log("Challenge phase", challengePhaseList);
                                utilities.storeData('challengePhase', challengePhaseList);
                                $rootScope.notify("success", "Step3 is completed");
                            }
                        },
                        onError: function(response) {
                            var error = response.data;
                            vm.isFormError = true;
                            vm.formdata = error;
                        }
                    };
                    utilities.sendRequest(parameters, 'header', 'upload');
                    }
            }else {
                console.log("Challenge Phase");   
            }
        };

        vm.datasetSplits = [
            {"name": null,
             "codename": null}
        ];

        vm.addNewDatasetSplit = function() {
            vm.leaderboards.push({"name": null, "codename": null});
        };

        vm.removeNewDatasetSplit = function(index) {
            vm.leaderboards.splice(index, 1);
        };

        vm. datasetSplitCreate = function(datasetSplitCreateFormValid) {
            if (datasetSplitCreateFormValid) {
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/dataset_split/step_4/';
                parameters.data = vm.datasetSplits;
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        var data = response.data;
                        console.log("Dataset Split", data);
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

        vm.challengePhaseSplits = [
            {"challenge_phase": null,
             "dataset_split": null,
             "leaderboard": null,
             "visibility": null}
        ];

        vm.addNewChallengePhaseSplit = function() {
            vm.challengePhaseSplits.push(
            {"challenge_phase": null,
             "dataset_split": null,
             "leaderboard": null,
             "visibility": null});
            };

        vm.removeNewChallengePhaseSplit = function(index) {
            vm.challengePhaseSplits.splice(index, 1);
        };

        vm. challengePhaseSplitCreate = function(challengePhaseSplitCreateFormValid) {
            if (challengePhaseSplitCreateFormValid) {
                var parameters = {};
                parameters.method = 'POST';
                parameters.url = 'challenges/challenge/challenge_phase_split/step_5/';

                var challengePhase = utilities.getData('challengePhase');
                var leaderboard = utilities.getData('leaderboard');
                var datasetSplit = utilities.getData('datasetSplit');

                for (var i=0; i<vm.challengePhaseSplits.length; i++) {

                    vm.challengePhaseSplits[i].challenge_phase = challengePhase[vm.challengePhaseSplits[i].challenge_phase -1].id;
                    vm.challengePhaseSplits[i].dataset_split = datasetSplit[vm.challengePhaseSplits[i].dataset_split -1].id;
                    vm.challengePhaseSplits[i].leaderboard = leaderboard[vm.challengePhaseSplits[i].leaderboard - 1].id;
                }

                console.log("updated challenge phase splits",vm.challengePhaseSplits);
                parameters.data = vm.challengePhaseSplits;
                parameters.token = userKey;
                parameters.callback = {
                    onSuccess: function(response) {
                        var status = response.status;
                        console.log("Challenge Phase Split", response.data);
                        if (status === 201) {
                            vm.step5 = false;
                            vm.step4 = false;
                            vm.step3 = false;
                            vm.step2 = false;
                            vm.step1 = false;
                            $rootScope.notify("success", "Step 5 is completed!");
                            // utilities.deleteData('challenge');
                            // utilities.deleteData('challengePhase');
                            // utilities.deleteData('leaderboard');
                            // utilities.deleteData('datasetSplit');

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
                console.log("ChallengePhaseSplit");
            }
        };
    }
})();
