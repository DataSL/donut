export function formatNumber(num, digits, unitDisplay, format = "") {
  let res = "";

  if (format === "%") {
    res = (num * 100).toFixed(digits);
  } else {
    if (unitDisplay === 0) {
      res = num < 1000 ? num.toFixed(digits) : autoFormatNumber(num, digits);
    }
    if (unitDisplay === 1) {
      res = num.toFixed(digits);
    }
    if (unitDisplay === 1e3) {
      res = (num / 1e3).toFixed(digits) + "K";
    }
    if (unitDisplay === 1e6) {
      res = (num / 1e6).toFixed(digits) + "M";
    }
    if (unitDisplay === 1e9) {
      res = (num / 1e9).toFixed(digits) + "B";
    }
    if (unitDisplay === 1e12) {
      res = (num / 1e12).toFixed(digits) + "T";
    }
  }

  return res + " " + format;
}

function autoFormatNumber(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}
