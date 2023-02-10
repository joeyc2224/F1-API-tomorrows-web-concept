var year = document.getElementById("year-select").value;

function yearChange() {
  year = document.getElementById("year-select").value;
  loadStandings();
}
window.onload = loadStandings();
var requestOptions = {
  method: "GET",
};

function loadStandings() {
  var params = {
    year: year,
    standing: "constructorStandings",
  };

  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map(function (k) {
      return esc(params[k]);
    })
    .join("/");

  fetch("https://ergast.com/api/f1/" + query + ".json", requestOptions)
    .then(function (response) {
      //console.log(response);
      return response.json();
    })
    .then(function (standings) {
      appendData(standings);
    })
    .catch(function (err) {
      console.log(err);
    });

  function appendData(standings) {
    var mainContainer = document.getElementById("standings-table");
    mainContainer.innerHTML = "";

    var headings = document.createElement("thead");
    headings.className = "standings-heads";
    headings.innerHTML =
      "<th>Position</th><th>Team</th><th>Nationality</th><th>Wins</th><th>Points</th>";
    mainContainer.appendChild(headings);

    for (const rank of standings.MRData.StandingsTable.StandingsLists[0]
      .ConstructorStandings) {
      var row = document.createElement("tr");
      row.className = "standings-row";

      var pos = document.createElement("td");
      pos.innerHTML = rank.positionText;
      row.appendChild(pos);

      var name = document.createElement("td");
      name.innerHTML = rank.Constructor.name;
      row.appendChild(name);

      var nat = document.createElement("td");
      nat.innerHTML = rank.Constructor.nationality;
      row.appendChild(nat);

      var wins = document.createElement("td");
      wins.innerHTML = rank.wins;
      row.appendChild(wins);

      var points = document.createElement("td");
      points.innerHTML = rank.points;
      row.appendChild(points);

      mainContainer.appendChild(row);
    }
  }
}
