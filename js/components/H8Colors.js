// @flow

const selected_red = "rgba(255, 0, 0, 0.9)";
const light_gray = "rgba(153, 153, 153, 0.3)";

const LOCATION_COLORS = {
  HERBST: "#00E3AD",
  "HERBST A": "#00E3AD",
  "HERBST B": "#00E3AD",
  "HACKER X": "#4D99EF",
  "HACKER Y": "#CF72B1",
  COWELL: "#6A6AD5",
  "COWELL C": "#6A6AD5",
  "FOOD TENT": "#FFCD3B"
};

function colorForLocation(location: ?string): string {
  if (!location) {
    return "black";
  }

  var color = LOCATION_COLORS[location.toUpperCase()];
  if (!color) {
    console.warn(`Location '${location}' has no color`);
    color = "black";
  }
  return color;
}

function colorForTopic(count: number, index: number): string {
  const hue = Math.round(360 * index / (count + 1));
  return `hsl(${hue}, 74%, 65%)`;
}

module.exports = {
  selected_red,
  light_gray,
  actionText: "#3FB4CF",
  inactiveText: "#9B9B9B",
  darkText: "#032250",
  lightText: "#7F91A7",
  cellBorder: "#EEEEEE",
  darkBackground: "#183E63",
  colorForLocation,
  colorForTopic,
  lightBlue: "rgba(15, 136, 235, 0.9)",
  sectionTitleBackground: "rgba(230, 230, 230, 0.7)",
  navigatorBlue: "#3385ff",
  background: "#f7f8fa",
  metaText: "#666666"
};
