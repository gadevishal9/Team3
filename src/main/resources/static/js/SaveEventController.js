(function(){
var app = angular.module("mainApp")
app.controller("SaveEventController",[
  '$scope',
  'availableObjects',
  'ObjectService',
  'EventService',
  function($scope, availableObjects, ObjectService, EventService){
  console.log("Reached SaveEventController");
  $scope.availableObjects;
  if(availableObjects){
    $scope.availableObjects = availableObjects;
  }
  $scope.populateObj;
  $scope.populateEvent;
  $scope.eventsForObject;
  $scope.objectSelected;
  $scope.eventSelected;
  $scope.toBeSavedObject = {};
  $scope.toBeSavedEvent = {};
  $scope.toBeSavedObject.attributes = [];
  $scope.toBeSavedEvent.attributes = [];
  $scope.populateEventsForForm = function(data){
    EventService.getEventsForObject(data).then(function(response){
      if(response && response.data){

        $scope.eventsForObject = Object.values(response.data)[0];
      }
    }, function(err){
      if(err) throw err;
      alertify.error("Population failed");
    })
  }

  $scope.populateFormData = function(data){
    EventService.getEventDetails(data).then(function(response){
      $scope.populateEvent = response.data;
    }, function(err){
      if(err) throw err;
      alertify.error("Population failed");
    })

    ObjectService.getObjectDetails($scope.objectSelected).then(function(response){
    	$scope.toBeSavedObject = {};
    	$scope.toBeSavedObject.attributes = [];
      $scope.toBeSavedEvent = {};
      $scope.toBeSavedEvent.attributes = [];
      $scope.populateObj = Object.values(response.data)[0];
      populateSavedObject($scope.toBeSavedObject.attributes, $scope.populateObj);
      populateSavedObject($scope.toBeSavedEvent.attributes, $scope.populateEvent);
    }, function(err){
      if(err) throw err;
      alertify.error("Population failed");
    })
  }

  $scope.updateObject = function(label, value){

      _.forEach($scope.toBeSavedObject.attributes, function(val, key){
        if(label == val.label){
          $scope.toBeSavedObject.attributes[key].value = value;
        }
      })
  }
  $scope.updateEvent = function(label, value){

      _.forEach($scope.toBeSavedEvent.attributes, function(val, key){
        if(label == val.label){
        	$scope.toBeSavedEvent.attributes[key].value = value;
        }
      })
  }
  $scope.save = function () {
    let data = {
      object: {
        moduleName: $scope.objectSelected,
        attributes: $scope.toBeSavedObject.attributes
      },
      events :{
        moduleName: $scope.eventSelected,
        attributes: $scope.toBeSavedEvent.attributes
      }
    }
    EventService.createEvent(data).then(function(response){
      alertify.success("successfuly saved");
    }, function(err){
      alertify.error("Somethings is wrong with api.")
    })

  }
  $scope.uploadCsv = function($file){

    let data = {
      eventName: $scope.eventSelected,
      objectName: $scope.objectSelected,
      file : $file
    }
    EventService.saveCsv(data);
    // then(function(response){
    //   alertify.success("successfully saved file");
    // }, function(err){
    //   alertify.error("Could not save file");
    // })
  }

  function populateSavedObject(obj, data){
    _.forEach(Object.values(data), function(elem){
      obj.push({
        "label" : elem,
        "value": ""
      })
    })
  }
}]);

})();
