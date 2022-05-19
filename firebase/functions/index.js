const functions = require("firebase-functions"),
  admin = require("firebase-admin");

const APP_NAME = "Hiphosts";
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hiphost-v2-131c1.firebaseio.com",
});

var db = admin.database();

/////// --------------------- Host Matching starts ---------------------

function matchCalculation(searchedActivities, userData, hostData) {
  try {
    var opennessScore = Math.abs(userData.openness - hostData.openness) / 13;
    var extroversionScore =
      Math.abs(userData.extroversion - hostData.extroversion) / 13;

    var personalityContribution = 0;

    var val = 1 - (opennessScore + extroversionScore);

    if (!isNaN(val)) {
      personalityContribution = (val / 2) * 100;
    }

    console.log("Personality contribution", personalityContribution);

    // activities ------------
    var matchingActivities = 0;
    var activitiesContribution = 0;

    if (
      typeof userData !== "undefined" &&
      typeof searchedActivities !== "undefined"
    ) {
      if (typeof hostData.activities !== "undefined") {
        searchedActivities.forEach(function (act) {
          if (hostData.activities.indexOf(act) >= 0) {
            matchingActivities++;
          }
        });

        activitiesContribution =
          (matchingActivities / searchedActivities.length) * 100;
        console.log(
          "Calculated activitiesContribution",
          activitiesContribution
        );
      }
    } else {
      console.log("User has no searched activities selected");
    }

    // activities ends ------------

    var demographic = {
      accommodation: 0,
      ageGroup: 0,
      budget: 0,
      industry: 0,
      relationship: 0,
      language: 0,
    };

    demographic.ageGroup += userData.ageGroup === hostData.ageGroup ? 1 : 0; // check if age group matches
    demographic.budget += userData.budget === hostData.budget ? 1 : 0;
    demographic.accommodation +=
      userData.accommodation === hostData.accommodation ? 1 : 0;
    demographic.industry += userData.industry === hostData.industry ? 1 : 0;

    languageCont = 0;
    if (
      typeof hostData.mainLanguage !== "undefined" &&
      typeof userData.mainLanguage !== "undefined"
    )
      if (hostData.mainLanguage == userData.mainLanguage) languageCont = 1;

    if (
      typeof hostData.otherLanguage !== "undefined" &&
      typeof userData.otherLanguage !== "undefined"
    )
      if (hostData.otherLanguage == userData.otherLanguage) languageCont = 1;

    let demographicContribution = 0;
    Object.keys(demographic).forEach(function (key, index) {
      demographicContribution += demographic[key];
    });

    demographicContribution = (demographicContribution / 6) * 100;

    console.log("demographicContribution", demographicContribution);

    var totalScore = Math.round(
      personalityContribution * 0.4 +
        activitiesContribution * 0.4 +
        demographicContribution * 0.2
    );

    return {
      total: totalScore,
      personalityContribution: personalityContribution,
      activitiesContribution: activitiesContribution,
      demographicContribution: demographicContribution,
      //passed: personalityContribution >= 0.5 && activitiesContribution >= 0.5 && demographicContribution >= 0.5
      passed: true,
    };
  } catch (error) {
    console.log("matchCalculation:", error);
    return {
      total: 0,
      personalityContribution: 0,
      activitiesContribution: 0,
      demographicContribution: 0,
      passed: false,
    };
  }
}

function getDistance(userData, hostDataLocation) {
  try {
    var R = 6371; // km (change this constant to get miles)
    if (typeof userData.lastKnownLocation != "undefined") {
      var lat1 = userData.lastKnownLocation.lat;
      var lat2 = hostDataLocation.lat;
      var lng1 = userData.lastKnownLocation.lng;
      var lng2 = hostDataLocation.lng;

      var dLat = ((lat2 - lat1) * Math.PI) / 180;
      var dLng = ((lng2 - lng1) * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      //if (d>1) return Math.round(d)+"km";
      return Math.round(d * 1000); // m
    } else return 0;
  } catch (error) {
    console.log("getDistance:", error);
    return 0;
  }
}

exports.getMatchingHosts = functions.https.onRequest((request, response) => {
  var data = request.body;

  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  if (data) {
    var userData = data["UserData"];
    var searchLocation = data["SearchLocation"];
    var searchActivities = data["SearchActivities"];
    var currentUserID = userData.userID;
    var allHosts = [];

    if (searchLocation) {
      db.ref("users")
        .orderByChild("isHost")
        .equalTo(true)
        .once("value", function (snapshot) {
          if (snapshot)
            snapshot.forEach(function (childSnapshot) {
              try {
                if (allHosts) if (allHosts.length >= 20) return;

                var hostData = childSnapshot.val();
                hostData.uid = childSnapshot.key;

                var newHostData = {};

                if (hostData) {
                  if (hostData.uid !== currentUserID) {
                    if (
                      typeof hostData.locationInfo.liveLocation != "undefined"
                    ) {
                      var hostLocationName = hostData.locationInfo.liveLocation;
                      var hostLocationCoords = hostData.locationInfo.liveCoords;

                      if (hostLocationName === searchLocation.name) {
                        // only hosts from same city
                        hostData.personalityMatch = matchCalculation(
                          searchActivities,
                          userData,
                          hostData
                        );

                        if (
                          typeof hostData.personalityMatch.passed !=
                            "undefined" &&
                          hostData.personalityMatch.passed
                        ) {
                          if (typeof hostLocationCoords != "undefined") {
                            hostData.distance = getDistance(
                              userData,
                              hostLocationCoords
                            );
                            console.log("Distance: " + hostData.distance);
                          }

                          newHostData = hostData;
                          if (newHostData.social) delete newHostData.social;
                          if (newHostData.profilePic)
                            delete newHostData.profilePic;
                          if (newHostData.travel) delete newHostData.travel;

                          allHosts.push(newHostData);
                        }
                      }
                    }
                  }
                } else {
                  console.log("error");
                }
              } catch (error) {
                console.log("error" + error);
              }
            });
        })
        .then(() => {
          response.status(200).send(JSON.stringify({ allHosts: allHosts }));
        })
        .catch((e) => {
          console.log(e);
          response.status(201).send(JSON.stringify(e));
        });
    } else {
      console.log("No location Data for user: " + currentUserID);
      response.send(201, "No data received");
    }
  } else {
    response.send(201, "No location Data for user");
  }
});

/////// --------------------- Host Matching starts ---------------------

// ------------------------- Rating calculation ------------------------

exports.updateRating = functions.https.onRequest((request, response) => {
  var data = request.body;

  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  if (data) {
    var hostID = data["hostID"];

    if (typeof hostID != "undefined" && hostID != null) {
      db.ref("users/" + hostID + "/rating").once("value", function (snapshot) {
        if (snapshot) {
          var counter = 0;
          var total = 0;
          snapshot.forEach(function (childSnapshot) {
            var rating = childSnapshot.val();
            var ratingKey = childSnapshot.key;
            if (
              typeof rating != "undefined" &&
              rating != null &&
              ratingKey != "total"
            ) {
              if (
                typeof rating.rating != "undefined" &&
                rating.rating != null
              ) {
                total = total + rating.rating;
                counter++;
              }
            }
          });

          if (counter == 0) counter = 1;
          var finalTotal = total / counter;
          db.ref("users/" + hostID + "/rating/total").set(finalTotal);
          updateRanking(hostID);
        }
      });
    }
  }
});

// ------------------------- Ranking calculation ------------------------

function updateRanking(hostID) {
  if (typeof hostID != "undefined" && hostID != null) {
    var userLocation = null;
    var userRating = 0;
    db.ref("users/" + hostID)
      .once("value", function (userSnapshot) {
        var userInfo = userSnapshot.val();
        if (typeof userInfo != "undefined" && userInfo != null) {
          if (
            typeof userInfo.locationInfo.shortName != "undefined" &&
            userInfo.locationInfo.shortName != null
          ) {
            userLocation = userInfo.locationInfo.shortName;
          }
          if (typeof userInfo.rating != "undefined" && userInfo.rating != null)
            if (
              typeof userInfo.rating.total != "undefined" &&
              userInfo.rating.total != null
            )
              userRating = userInfo.rating.total;
        }
      })
      .then(() => {
        if (typeof userLocation != "undefined" && userLocation != null) {
          var rankList = [];
          db.ref("users").once("value", function (usersSnapshot) {
            if (usersSnapshot) {
              usersSnapshot.forEach(function (userSnapshot) {
                var userObj = userSnapshot.val();
                var userKey = userSnapshot.key;

                if (typeof userObj != "undefined" && userObj != null) {
                  if (userObj.isHost) {
                    if (hostID != userKey) {
                      if (
                        typeof userObj.locationInfo != "undefined" &&
                        userObj.locationInfo != null
                      ) {
                        if (
                          typeof userObj.locationInfo.shortName !=
                            "undefined" &&
                          userObj.locationInfo.shortName != null
                        ) {
                          if (userLocation == userObj.locationInfo.shortName) {
                            var rating = 0;
                            if (
                              typeof userObj.rating != "undefined" &&
                              userObj.rating != null
                            )
                              if (
                                typeof userObj.rating.total != "undefined" &&
                                userObj.rating.total != null
                              )
                                rating = userObj.rating.total;

                            rankList.push({ id: userKey, rating: rating });
                          }
                        }
                      }
                    }
                  }
                }
              });
            }
          });

          rankList.push({ id: hostID, rating: userRating });

          if (rankList != null && rankList.length >= 1) {
            var temp = rankList.sort((a, b) => (a.rating > b.rating ? 1 : -1));

            var index = temp
              .map(function (e) {
                return e.id;
              })
              .indexOf(hostID);

            db.ref("users/" + hostID + "/ranking").set({
              outOf: rankList.length,
              city: userLocation,
              rank: index + 1,
            });
          }
        }
      });
  }
}

// ------------------------- Ranking calculation ------------------------
