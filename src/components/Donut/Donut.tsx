import * as React from "react";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";

import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

import { formatNumber } from "../../utils/helpers";

export interface State {
  labels: string[];
  data: number[];
  images: string[];
  imageLegends: string[];
  colors: string[];
  selectedColors?: string[];
  donutRef?: React.MutableRefObject<any>;
  selectedIndex?: number;
  displayUnits?: number;
  decimalPlaces?: number;
  format?: string;
  valueFontFamily?: string;
  valueFontSize?: number;
  valueBold?: boolean;
  valueItalic?: boolean;
  valueUnderline?: boolean;
  labelFontFamily?: string;
  labelFontSize?: number;
  labelBold?: boolean;
  labelItalic?: boolean;
  labelUnderline?: boolean;
  labelColor?: string;
  lineColor?: string;
  additionalInfoText?: string;
  additionalInfoFontFamily?: string;
  additionalInfoFontSize?: number;
  additionalInfoBold?: boolean;
  additionalInfoItalic?: boolean;
  additionalInfoUnderline?: boolean;
  additionalInfoColor?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageLegendFontFamily?: string;
  imageLegendFontSize?: number;
  imageLegendBold?: boolean;
  imageLegendItalic?: boolean;
  imageLegendUnderline?: boolean;
  imageLegendColor?: string;
  imageLegendShow?: boolean;
  rightBorderColor?: string;
  rightFontFamily?: string;
  rightFontSize?: number;
  rightBold?: boolean;
  rightItalic?: boolean;
  rightUnderline?: boolean;
  rightColor?: string;
  selectCategory?: (number) => void;
}

export const initialState: State = {
  labels: [],
  data: [],
  images: [],
  imageLegends: [],
  colors: [],
  selectedColors: [],
  donutRef: null,
  selectedIndex: null,
  displayUnits: 0,
  decimalPlaces: 2,
  format: "",
  valueFontFamily: "Arial",
  valueFontSize: 16,
  valueBold: false,
  valueItalic: false,
  valueUnderline: false,
  labelFontFamily: "Arial",
  labelFontSize: 12,
  labelBold: false,
  labelItalic: false,
  labelUnderline: false,
  labelColor: "#000000",
  lineColor: "#000000",
  additionalInfoText: "text",
  additionalInfoFontFamily: "Arial",
  additionalInfoFontSize: 12,
  additionalInfoBold: false,
  additionalInfoItalic: false,
  additionalInfoUnderline: false,
  additionalInfoColor: "#000000",
  imageWidth: 100,
  imageHeight: 100,
  imageLegendFontFamily: "Arial",
  imageLegendFontSize: 12,
  imageLegendBold: false,
  imageLegendItalic: false,
  imageLegendUnderline: false,
  imageLegendColor: "#000000",
  imageLegendShow: true,
  rightBorderColor: "#808080",
  rightFontFamily: "Arial",
  rightFontSize: 16,
  rightBold: false,
  rightItalic: false,
  rightUnderline: false,
  rightColor: "#000000",
};

export class Donut extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleOnHover = this.handleOnHover.bind(this);
    this.state.donutRef = React.createRef();
    this.state.selectedColors = this.state.colors;
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof Donut.updateCallback === "function") {
      Donut.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    Donut.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    Donut.updateCallback = null;
  }

  // Donut
  handleOnHover(e) {
    const elementArray = getElementAtEvent(this.state.donutRef.current, e);

    if (elementArray[0]) {
      const element = elementArray[0];
      const elementIndex = element.index;

      const newColors = this.state.colors.map((color, i) => {
        if (i !== elementIndex) {
          return color + "55";
        }
        return color;
      });

      this.state.selectedColors = newColors;
      this.state.selectedIndex = elementIndex;
    } else {
      this.state.selectedColors = this.state.colors;
      this.state.selectedIndex = null;
    }

    const labels = this.state.labels;
    const data = this.state.data;
    const images = this.state.images;
    const imageLegends = this.state.imageLegends;
    const colors = this.state.colors;
    const selectedColors = this.state.selectedColors;
    const selectedIndex = this.state.selectedIndex;

    Donut.update({
      labels,
      data,
      images,
      imageLegends,
      colors,
      selectedColors,
      selectedIndex,
    });

    this.state.selectCategory(this.state.selectedIndex);
  }

  // Right legend
  handleOnMouseEnter(rowIndex) {
    const newColors = this.state.colors.map((color, i) => {
      if (i !== rowIndex) {
        return color + "55";
      }
      return color;
    });

    this.state.selectedColors = newColors;
    this.state.selectedIndex = rowIndex;

    const labels = this.state.labels;
    const data = this.state.data;
    const images = this.state.images;
    const imageLegends = this.state.imageLegends;
    const colors = this.state.colors;
    const selectedColors = this.state.selectedColors;
    const selectedIndex = this.state.selectedIndex;

    Donut.update({
      labels,
      data,
      images,
      imageLegends,
      colors,
      selectedColors,
      selectedIndex,
    });

    this.state.selectCategory(this.state.selectedIndex);
  }

  // Right legend
  handleOnMouseLeave() {
    this.state.selectedIndex = null;

    const labels = this.state.labels;
    const data = this.state.data;
    const images = this.state.images;
    const imageLegends = this.state.imageLegends;
    const colors = this.state.colors;
    const selectedColors = this.state.colors;
    const selectedIndex = this.state.selectedIndex;

    Donut.update({
      labels,
      data,
      images,
      imageLegends,
      colors,
      selectedColors,
      selectedIndex,
    });

    this.state.selectCategory(this.state.selectedIndex);
  }

  // Right legend row
  getStyle(i) {
    const style = {};

    if (this.state.selectedIndex === null) {
      style["opacity"] = 1;
      style["borderTop"] = "solid 1px " + this.state.rightBorderColor;
    } else if (i === this.state.selectedIndex) {
      style["opacity"] = 1;
      if (i !== 0) {
        style["borderTop"] = "solid 1px " + this.state.rightBorderColor + "77";
      }
    } else {
      style["opacity"] = 0.5;
      if (i !== 0) {
        style["borderTop"] = "solid 1px " + this.state.rightBorderColor;
      }
    }

    style["fontSize"] = this.state.rightFontSize;
    style["fontFamily"] = this.state.rightFontFamily;
    style["fontWeight"] = this.state.rightBold ? "bold" : "normal";
    style["fontStyle"] = this.state.rightItalic ? "italic" : "normal";
    style["textDecoration"] = this.state.rightUnderline ? "underline" : "none";
    style["color"] = this.state.rightColor;

    return style;
  }

  getMainValue = () => {
    return (
      <div
        style={{
          fontSize: this.state.valueFontSize,
          fontFamily: this.state.valueFontFamily,
          fontWeight: this.state.valueBold ? "bold" : "normal",
          fontStyle: this.state.valueItalic ? "italic" : "normal",
          textDecoration: this.state.valueUnderline ? "underline" : "none",
          color: this.state.colors[this.state.selectedIndex],
        }}
      >
        {this.state.selectedIndex !== null &&
          formatNumber(
            this.state.data[this.state.selectedIndex],
            this.state.decimalPlaces,
            this.state.displayUnits,
            this.state.format
          )}
      </div>
    );
  };

  getLeftLegendContainer = () => {
    return (
      <div className="left-legend-container">
        {/* Main value */}
        {this.getMainValue()}
        {/* Label */}
        <div
          style={{
            fontSize: this.state.labelFontSize,
            fontFamily: this.state.labelFontFamily,
            fontWeight: this.state.labelBold ? "bold" : "normal",
            fontStyle: this.state.labelItalic ? "italic" : "normal",
            textDecoration: this.state.labelUnderline ? "underline" : "none",
            color: this.state.labelColor,
          }}
        >
          {this.state.selectedIndex !== null &&
            this.state.labels[this.state.selectedIndex]}
        </div>
        {/* Line color */}
        {this.state.selectedIndex !== null && (
          <div
            style={{
              width: "30%",
              height: "1px",
              marginTop: "10px",
              backgroundColor: this.state.lineColor,
            }}
          />
        )}
        {/* Additional info */}
        {this.state.selectedIndex !== null && (
          <div
            style={{
              marginTop: "10px",
              fontSize: this.state.additionalInfoFontSize,
              fontFamily: this.state.additionalInfoFontFamily,
              fontWeight: this.state.additionalInfoBold ? "bold" : "normal",
              fontStyle: this.state.additionalInfoItalic ? "italic" : "normal",
              textDecoration: this.state.additionalInfoUnderline
                ? "underline"
                : "none",
              color: this.state.additionalInfoColor,
            }}
          >
            {this.state.additionalInfoText}
          </div>
        )}
        {/* Image */}
        {this.state.selectedIndex !== null &&
          this.state.images.length > 0 &&
          this.state.images[this.state.selectedIndex] &&
          this.state.images[this.state.selectedIndex].length > 0 && (
            <div
              className="left-legend-image"
              style={{
                width: this.state.imageWidth + "px",
                height: this.state.imageHeight + "px",
              }}
            >
              <img src={this.state.images[this.state.selectedIndex]} />
            </div>
          )}
        {/* Image legend */}
        {this.state.imageLegendShow && (
          <div
            style={{
              fontSize: this.state.imageLegendFontSize,
              fontFamily: this.state.imageLegendFontFamily,
              fontWeight: this.state.imageLegendBold ? "bold" : "normal",
              fontStyle: this.state.imageLegendItalic ? "italic" : "normal",
              textDecoration: this.state.imageLegendUnderline
                ? "underline"
                : "none",
              color: this.state.imageLegendColor,
            }}
          >
            {this.state.selectedIndex !== null &&
              this.state.imageLegends.length &&
              this.state.imageLegends.length > 0 &&
              this.state.imageLegends[this.state.selectedIndex]}
          </div>
        )}
      </div>
    );
  };

  render() {
    const data = {
      labels: this.state.labels,
      datasets: [
        {
          hoverOffset: 0,
          cutout: "90%",
          spacing: 5,
          label: "# of Votes",
          data: this.state.data,
          backgroundColor: this.state.selectedColors,
        },
      ],
    };

    return (
      this.state.labels.length > 0 &&
      this.state.data.length > 0 && (
        <div className="container">
          <div className="left-legend">{this.getLeftLegendContainer()}</div>
          <div className="donut">
            <Doughnut
              ref={this.state.donutRef}
              data={data}
              onMouseMove={this.handleOnHover}
            />
          </div>
          <div className="right-legend">
            {this.state.data.map((d, i) => {
              return (
                <div
                  className="right-legend-row"
                  style={this.getStyle(i)}
                  onMouseEnter={() => this.handleOnMouseEnter(i)}
                  onMouseLeave={() => this.handleOnMouseLeave()}
                >
                  <div
                    className="right-legend-color"
                    style={{
                      backgroundColor: this.state.colors[i],
                    }}
                  />
                  <div className="right-legend-title">
                    {this.state.labels[i]}
                  </div>
                  <div>
                    {formatNumber(
                      d,
                      this.state.decimalPlaces,
                      this.state.displayUnits,
                      this.state.format
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  }
}

export default Donut;
