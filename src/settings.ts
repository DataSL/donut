/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class GeneralCardSettings extends FormattingSettingsCard {
  displayUnits = new formattingSettings.AutoDropdown({
    name: "displayUnits",
    displayName: "Display units",
    value: 0,
  });

  decimalPlaces = new formattingSettings.NumUpDown({
    name: "decimalPlaces",
    displayName: "Decimal places",
    value: 2,
  });

  name: string = "general";
  displayName: string = "General";
  slices: Array<FormattingSettingsSlice> = [
    this.displayUnits,
    this.decimalPlaces,
  ];
}

class CategoryColorsCardSettings extends FormattingSettingsCard {
  name: string = "category";
  displayName: string = "Category";
  slices: Array<FormattingSettingsSlice> = [];
}

class LeftLegendCardSettings extends FormattingSettingsCard {
  /* VALUE */
  valueFontFamily = new formattingSettings.FontPicker({
    name: "valueFontFamily",
    value: "Arial",
  });

  valueFontSize = new formattingSettings.NumUpDown({
    name: "valueFontSize",
    value: 16,
  });

  valueBold = new formattingSettings.ToggleSwitch({
    name: "valueBold",
    value: false,
  });

  valueItalic = new formattingSettings.ToggleSwitch({
    name: "valueItalic",
    value: false,
  });

  valueUnderline = new formattingSettings.ToggleSwitch({
    name: "valueUnderline",
    value: false,
  });

  valueFontControl = new formattingSettings.FontControl({
    name: "valueFontControl",
    displayName: "Value font",
    fontFamily: this.valueFontFamily,
    fontSize: this.valueFontSize,
    bold: this.valueBold,
    italic: this.valueItalic,
    underline: this.valueUnderline,
  });

  /* LABEL */
  labelFontFamily = new formattingSettings.FontPicker({
    name: "labelFontFamily",
    value: "Arial",
  });

  labelFontSize = new formattingSettings.NumUpDown({
    name: "labelFontSize",
    value: 12,
  });

  labelBold = new formattingSettings.ToggleSwitch({
    name: "labelBold",
    value: false,
  });

  labelItalic = new formattingSettings.ToggleSwitch({
    name: "labelItalic",
    value: false,
  });

  labelUnderline = new formattingSettings.ToggleSwitch({
    name: "labelUnderline",
    value: false,
  });

  labelFontControl = new formattingSettings.FontControl({
    name: "labelFontControl",
    displayName: "Label font",
    fontFamily: this.labelFontFamily,
    fontSize: this.labelFontSize,
    bold: this.labelBold,
    italic: this.labelItalic,
    underline: this.labelUnderline,
  });

  labelColor = new formattingSettings.ColorPicker({
    name: "labelColor",
    displayName: "Label color",
    description: "The fill color of the label",
    value: { value: "#000000" },
  });

  /* Additional info */
  lineColor = new formattingSettings.ColorPicker({
    name: "lineColor",
    displayName: "Line color",
    description: "The fill color of the line",
    value: { value: "#000000" },
  });

  additionalInfoText = new formattingSettings.TextInput({
    name: "additionalInfoText",
    displayName: "Additional info text",
    placeholder: "Enter text",
    value: "",
  });

  additionalInfoFontFamily = new formattingSettings.FontPicker({
    name: "additionalInfoFontFamily",
    value: "Arial",
  });

  additionalInfoFontSize = new formattingSettings.NumUpDown({
    name: "additionalInfoFontSize",
    value: 12,
  });

  additionalInfoBold = new formattingSettings.ToggleSwitch({
    name: "additionalInfoBold",
    value: false,
  });

  additionalInfoItalic = new formattingSettings.ToggleSwitch({
    name: "additionalInfoItalic",
    value: false,
  });

  additionalInfoUnderline = new formattingSettings.ToggleSwitch({
    name: "additionalInfoUnderline",
    value: false,
  });

  additionalInfoFontControl = new formattingSettings.FontControl({
    name: "additionalInfoFontControl",
    displayName: "Additional info font",
    fontFamily: this.additionalInfoFontFamily,
    fontSize: this.additionalInfoFontSize,
    bold: this.additionalInfoBold,
    italic: this.additionalInfoItalic,
    underline: this.additionalInfoUnderline,
  });

  additionalInfoColor = new formattingSettings.ColorPicker({
    name: "additionalInfoColor",
    displayName: "Additional info color",
    value: { value: "#000000" },
  });

  /* Image size */
  imageWidth = new formattingSettings.NumUpDown({
    name: "imageWidth",
    displayName: "Image width",
    value: 100,
  });

  imageHeight = new formattingSettings.NumUpDown({
    name: "imageHeight",
    displayName: "Image height",
    value: 100,
  });

  /* Image legend */
  imageLegendFontFamily = new formattingSettings.FontPicker({
    name: "imageLegendFontFamily",
    value: "Arial",
  });

  imageLegendFontSize = new formattingSettings.NumUpDown({
    name: "imageLegendFontSize",
    value: 12,
  });

  imageLegendBold = new formattingSettings.ToggleSwitch({
    name: "imageLegendBold",
    value: false,
  });

  imageLegendItalic = new formattingSettings.ToggleSwitch({
    name: "imageLegendItalic",
    value: false,
  });

  imageLegendUnderline = new formattingSettings.ToggleSwitch({
    name: "imageLegendUnderline",
    value: false,
  });

  imageLegendFontControl = new formattingSettings.FontControl({
    name: "imageLegendFontControl",
    displayName: "Image legend font",
    fontFamily: this.imageLegendFontFamily,
    fontSize: this.imageLegendFontSize,
    bold: this.imageLegendBold,
    italic: this.imageLegendItalic,
    underline: this.imageLegendUnderline,
  });

  imageLegendColor = new formattingSettings.ColorPicker({
    name: "imageLegendColor",
    displayName: "Image legend color",
    description: "The fill color of the image legend",
    value: { value: "#000000" },
  });

  imageLegendShow = new formattingSettings.ToggleSwitch({
    name: "imageLegendShow",
    displayName: "Show image legend",
    value: true,
  });

  name: string = "leftLegend";
  displayName: string = "Left legend";
  slices: Array<FormattingSettingsSlice> = [
    this.valueFontControl,
    this.labelFontControl,
    this.labelColor,
    this.lineColor,
    this.additionalInfoText,
    this.additionalInfoFontControl,
    this.additionalInfoColor,
    this.imageWidth,
    this.imageHeight,
    this.imageLegendFontControl,
    this.imageLegendColor,
    this.imageLegendShow,
  ];
}

class RightLegendCardSettings extends FormattingSettingsCard {
  borderColor = new formattingSettings.ColorPicker({
    name: "borderColor",
    displayName: "Border color",
    description: "The fill color of the border",
    value: { value: "#808080" },
  });

  rightFontFamily = new formattingSettings.FontPicker({
    name: "rightFontFamily",
    value: "Arial",
  });

  rightFontSize = new formattingSettings.NumUpDown({
    name: "rightFontSize",
    value: 12,
  });

  rightBold = new formattingSettings.ToggleSwitch({
    name: "rightBold",
    value: false,
  });

  rightItalic = new formattingSettings.ToggleSwitch({
    name: "rightItalic",
    value: false,
  });

  rightUnderline = new formattingSettings.ToggleSwitch({
    name: "rightUnderline",
    value: false,
  });

  rightFontControl = new formattingSettings.FontControl({
    name: "rightFontControl",
    displayName: "Font",
    fontFamily: this.rightFontFamily,
    fontSize: this.rightFontSize,
    bold: this.rightBold,
    italic: this.rightItalic,
    underline: this.rightUnderline,
  });

  rightColor = new formattingSettings.ColorPicker({
    name: "rightColor",
    displayName: "Color",
    description: "The fill color",
    value: { value: "#000000" },
  });

  name: string = "rightLegend";
  displayName: string = "Right Legend";
  slices: Array<FormattingSettingsSlice> = [
    this.borderColor,
    this.rightFontControl,
    this.rightColor,
  ];
}

/**
 * visual settings model class
 *
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  generalCard = new GeneralCardSettings();
  categoryColorsCard = new CategoryColorsCardSettings();
  leftLegendCard = new LeftLegendCardSettings();
  rightLegendCard = new RightLegendCardSettings();
  cards = [
    this.generalCard,
    this.categoryColorsCard,
    this.leftLegendCard,
    this.rightLegendCard,
  ];
}
