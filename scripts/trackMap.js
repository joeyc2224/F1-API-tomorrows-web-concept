mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9leWMxMjMiLCJhIjoiY2w5bXlvcHR3MDMyMzNubzF5d2hzOXBsMiJ9.B7P_jYr3LQYZkn3_CYLE8A";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-74.5, 40],
  zoom: 9,
});
