fetch("http://ergast.com/api/f1/current/next.json")
  .then((data) => data.json())
  .then((Data) => loadNextRace(Data));

function loadNextRace(Data) {
  var NextRace = Data.MRData.RaceTable.Races[0];

  var container = document.getElementById("nextRace");

  var round = document.createElement("h3");
  round.innerHTML =
    "Round " + NextRace.round + " - " + NextRace.season + " Season";
  container.appendChild(round);

  var raceName = document.createElement("h1");
  raceName.innerHTML = NextRace.raceName;
  container.appendChild(raceName);

  var raceDate = document.createElement("h3");
  raceDate.innerHTML =
    NextRace.date +
    " - " +
    NextRace.time.substring(0, NextRace.time.length - 1) +
    " GMT";
  container.appendChild(raceDate);
}

var requestOptions = {
  method: "GET",
};

//news api search params
var params = {
  api_token: "HLGnPOa67GpNmy7ay5KXDK3xW8RRDEB9Ba4F5AHR",
  search: "",
  domains: "motorsport.com",
  language: "en",
  limit: "24",
};

var esc = encodeURIComponent;
var query = Object.keys(params)
  .map(function (k) {
    return esc(k) + "=" + esc(params[k]);
  })
  .join("&");
//fetch news api
fetch("https://api.thenewsapi.com/v1/news/all?" + query, requestOptions)
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (news) {
    appendData(news);
  })
  .catch(function (err) {
    console.log(err);
  });

//append data to new grid div
function appendData(news) {
  var mainContainer = document.getElementById("news-container");
  for (const article of news.data) {
    var div = document.createElement("div");
    div.className = "news-box";

    var image = document.createElement("img");
    image.src = article.image_url;
    div.appendChild(image);

    var title = document.createElement("h1");
    title.innerHTML = article.title;
    div.appendChild(title);

    mainContainer.appendChild(div);

    div.addEventListener("click", () => {
      window.open(article.url);
    });
  }
}
