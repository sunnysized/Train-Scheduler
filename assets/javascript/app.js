var config = {
  apiKey: "AIzaSyCcPFcbAjIsgXGQwE-A3AcOXkeD40qypE8",
  authDomain: "train-times-93583.firebaseapp.com",
  databaseURL: "https://train-times-93583.firebaseio.com",
  storageBucket: "train-times-93583.appspot.com"
};

firebase.initializeApp(config);

var trainData = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTrain = $("#first-train-input")
    .val()
    .trim();
  var frequency = $("#frequency-input")
    .val()
    .trim();

  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  trainData.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {

    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;

    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});
