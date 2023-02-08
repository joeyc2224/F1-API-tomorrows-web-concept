mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9leWMxMjMiLCJhIjoiY2w5bXlvcHR3MDMyMzNubzF5d2hzOXBsMiJ9.B7P_jYr3LQYZkn3_CYLE8A";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v9",
  projection: "globe",
  center: [-74.5, 40],
  zoom: 2,
});

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style, since satellite-v9 doesn't include atmosphere by default.
});

var year = document.getElementById("slider").value;

var slider = document.getElementById("slider");
var output = document.getElementById("output");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value
slider.oninput = function () {
  output.innerHTML = this.value;
};

slider.onchange = function () {
  location.reload();
};

fetch("http://ergast.com/api/f1/" + year + ".json")
  .then((data) => data.json())
  .then((trackData) => loadMarkers(trackData));
function loadMarkers(trackData) {
  for (const race of trackData.MRData.RaceTable.Races) {
    //convert to valid coords object
    const trackCoords = {
      lat: race.Circuit.Location.lat,
      lng: race.Circuit.Location.long,
    };
    const round = race.round;

    const trackProps = document.createElement("div");
    trackProps.className = "marker";

    //when track marker is pressed
    trackProps.addEventListener("click", () => {
      fetch("http://ergast.com/api/f1/" + year + "/" + round + "/results.json")
        .then((data) => data.json())
        .then((roundData) => showRound(roundData));
      var raceContainer = document.getElementById("race-container");
      raceContainer.innerHTML = "";

      function showRound(roundData) {
        //push info to sidebar
        var roundInfo = roundData.MRData.RaceTable.Races[0];

        var raceName = document.createElement("h1");
        raceName.innerHTML = roundInfo.raceName;
        raceContainer.appendChild(raceName);

        var raceLink = document.createElement("p");
        raceLink.innerHTML =
          "<a href='" +
          race.url +
          "'>Event Wiki&nbsp;&nbsp<span class='fa fa-arrow-right'></span></a>";
        raceContainer.appendChild(raceLink);

        var raceVenue = document.createElement("h2");
        raceVenue.innerHTML =
          roundInfo.Circuit.circuitName +
          ", " +
          roundInfo.Circuit.Location.locality +
          ", " +
          roundInfo.Circuit.Location.country;
        raceContainer.appendChild(raceVenue);

        var raceDate = document.createElement("h3");
        raceDate.innerHTML =
          "Round " + roundInfo.round + " - " + roundInfo.date;
        raceContainer.appendChild(raceDate);

        //event results table element
        var tableTitle = document.createElement("h3");
        tableTitle.className = "table-title";
        tableTitle.innerHTML = "Results";
        raceContainer.appendChild(tableTitle);

        var tableWrapper = document.createElement("div");
        tableWrapper.className = "table-wrapper";
        raceContainer.appendChild(tableWrapper);

        var resultsTable = document.createElement("table");
        resultsTable.className = "results-table";
        tableWrapper.appendChild(resultsTable);

        var headings = document.createElement("thead");
        headings.className = "results-headings";
        headings.innerHTML =
          "<th>Position</th><th>Driver</th><th>Team</th><th>Laps</th><th>Time</th>";
        resultsTable.appendChild(headings);

        for (const driver of roundInfo.Results) {
          //creates new row in results table
          var row = document.createElement("tr");
          row.className = "results-row";

          var pos = document.createElement("td");
          pos.innerHTML = driver.position;
          row.appendChild(pos);

          var name = document.createElement("td");
          name.innerHTML = driver.Driver.familyName;
          row.appendChild(name);

          var team = document.createElement("td");
          team.innerHTML = driver.Constructor.name;
          row.appendChild(team);

          var laps = document.createElement("td");
          laps.innerHTML = driver.laps;
          row.appendChild(laps);

          //displays driver time or DNF tag
          var time = document.createElement("td");
          if (driver.status == "Finished") {
            time.innerHTML = driver.Time.time;
          } else {
            time.innerHTML = "DNF";
          }
          row.appendChild(time);

          resultsTable.appendChild(row);
        }

        //fastest lap
        var fastestLapTitle = document.createElement("h3");
        fastestLapTitle.className = "fastest-lap-title";
        fastestLapTitle.innerHTML = "Fastest Lap";
        raceContainer.appendChild(fastestLapTitle);

        fetch(
          "http://ergast.com/api/f1/" +
            year +
            "/" +
            round +
            "/fastest/1/results.json"
        )
          .then((data) => data.json())
          .then((fastestLapData) => showFL(fastestLapData));

        function showFL(fastestLapData) {
          var fastestLap = fastestLapData.MRData.RaceTable.Races[0].Results[0];

          var name = document.createElement("h4");
          name.innerHTML =
            fastestLap.Driver.givenName + " " + fastestLap.Driver.familyName;
          raceContainer.appendChild(name);

          var lap = document.createElement("h4");
          lap.innerHTML = "Lap: " + fastestLap.FastestLap.lap;
          raceContainer.appendChild(lap);

          var time = document.createElement("h4");
          time.innerHTML = "Time: " + fastestLap.FastestLap.Time.time;
          raceContainer.appendChild(time);

          var avSpeed = document.createElement("h4");
          avSpeed.innerHTML =
            "Avg Speed: " + fastestLap.FastestLap.AverageSpeed.speed + " kph";
          raceContainer.appendChild(avSpeed);
        }
      }

      //shows sidebar once flyto complete
      map.once("moveend", () => {
        showSidebar();
      });

      map.once("movestart", () => {
        hideSidebar();
      });

      //flies camera to track
      map.flyTo({
        center: trackCoords,
        zoom: 14,
        speed: 1.2,
      });
    });

    new mapboxgl.Marker(trackProps).setLngLat(trackCoords).addTo(map);

    const popup = new mapboxgl.Popup({
      offset: 15,
      closeButton: false,
      closeOnClick: false,
    });

    trackProps.addEventListener("mouseover", () => {
      popup.setLngLat(trackCoords).setHTML(race.raceName).addTo(map);
    });

    trackProps.addEventListener("mouseout", () => {
      popup.remove();
    });
  }
}

function hideSidebar() {
  const elem = document.getElementById("sidebar");

  elem.classList.add("collapsed"); //collapsed class hides sidebar
  const padding = {};

  padding["left"] = 0; //remove padding to center map

  map.easeTo({
    //ease animation
    padding: padding,
    duration: 1000,
  });
}

function showSidebar() {
  const elem = document.getElementById("sidebar");

  elem.classList.remove("collapsed");
  const padding = {};

  padding["left"] = 350; // add padding to center map

  map.easeTo({
    padding: padding,
    duration: 1000,
  });
}

var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  hideSidebar();
};
