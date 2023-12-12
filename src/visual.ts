/*
 *  Power BI Visual CLI
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

"use strict";
import "core-js/stable";
import * as React from "react";
import * as ReactDOM from "react-dom";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import Fill = powerbi.Fill;

import Donut, { initialState } from "./components/Donut/Donut";
import "regenerator-runtime/runtime";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { getCategoricalObjectValue } from "./objectEnumerationUtility";
import debounce from "lodash.debounce";

import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import { dataViewWildcard } from "powerbi-visuals-utils-dataviewutils";
import { TooltipEnabledDataPoint } from "powerbi-visuals-utils-tooltiputils";

import xss from "xss";

import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private host;
  private selectionManager: ISelectionManager;
  private categoryColors;
  private events: IVisualEventService;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(Donut, {});
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.host = options.host;
    this.selectionManager = this.host.createSelectionManager();
    this.handleContextMenu();
    this.events = options.host.eventService;

    /* this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      options.element
    );

    const bodyElement = d3.select("body");

    this.tooltipServiceWrapper.addTooltip(
      bodyElement,
      (tooltipEvent: TooltipEventArgs<TooltipEnabledDataPoint>) => {
        console.log(tooltipEvent);
        return tooltipEvent.data.tooltipInfo;
      }
    ); */

    ReactDOM.render(this.reactRoot, this.target);
  }

  private getTooltipData(
    datapoint: TooltipEnabledDataPoint
  ): VisualTooltipDataItem[] {
    console.log(datapoint);

    const formattedValue = "1.2";
    const language = "fr";
    return [
      {
        displayName: "truc",
        value: formattedValue,
        color: "green",
        header: language && "displayed language " + language,
      },
    ];
  }

  private getDataPointIdentity(datapoint: TooltipEnabledDataPoint): void {
    console.log(datapoint);
    return this.host.getSelector();
  }

  private handleContextMenu() {
    this.target.addEventListener("contextmenu", (event) => {
      const mouseEvent: MouseEvent = event;
      this.selectionManager.showContextMenu(
        {},
        {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        }
      );
      mouseEvent.preventDefault();
    });
  }

  public selectCategory = debounce((index) => {
    if (index !== null) {
      const categorySelectionId = this.categoryColors[index]["selectionId"];
      this.selectionManager.select(categorySelectionId);
    } else {
      this.selectionManager.clear();
    }
  }, 100);

  getFormat = (dataView) => {
    let format = "";
    // FORMATS
    dataView.table.columns.map((col) => {
      if (col.roles.value && col.format) {
        if (col.format.includes("%")) {
          format = "%";
        } else if (col.format.includes("$")) {
          format = "$";
        } else if (col.format.includes("€")) {
          format = "€";
        }
      }
    });
    return format;
  };

  setCategories = (dataView, colorPalette, categoryColorsSettings) => {
    const categorical = dataView.categorical;
    const category = categorical.categories[0];
    const categories = dataView.categorical.categories[0].values;

    for (let i = 0; i < categories.length; i++) {
      const color: string = this.getColumnColorByIndex(
        category,
        i,
        colorPalette
      );

      const selectionId: ISelectionId = this.host
        .createSelectionIdBuilder()
        .withCategory(category, i)
        .createSelectionId();

      this.categoryColors.push({
        name: categories[i],
        color,
        selectionId,
      });
    }

    this.categoryColors.forEach((cc) => {
      categoryColorsSettings.slices.push(
        new formattingSettings.ColorPicker({
          name: "categoryColor",
          displayName: cc.name,
          description: cc.name,
          selector: dataViewWildcard.createDataViewWildcardSelector(
            dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
          ),
          altConstantSelector: cc.selectionId.getSelector(),
          instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
          value: { value: cc.color },
        })
      );
    });
  };

  setValues = (dataView, data, labels, images, imageLegends) => {
    dataView.table.rows.forEach((row) => {
      let region;
      let value;
      let image = "";
      let imageLegend = "";

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (dataView.table.columns[i].roles.category) region = xss(cell);

        if (dataView.table.columns[i].roles.value) {
          value = parseFloat(xss(cell as string));
        }
        if (dataView.table.columns[i].roles.image) {
          image = xss(cell as string);
          if (image.startsWith("http")) image = "";
        }
        if (dataView.table.columns[i].roles.imageLegend) {
          imageLegend = xss(cell as string);
        }
      }

      region && labels.push(region);
      value && data.push(value);
      image ? images.push(image) : images.push("");
      imageLegend ? imageLegends.push(imageLegend) : imageLegends.push("");
    });
  };

  public update(options: VisualUpdateOptions) {
    this.events.renderingStarted(options);

    const colorPalette: ISandboxExtendedColorPalette = this.host.colorPalette;

    if (
      options.dataViews &&
      options.dataViews[0].table.columns.length > 0 &&
      options.dataViews[0].categorical.categories
    ) {
      const dataView: DataView = options.dataViews[0];

      this.formattingSettings =
        this.formattingSettingsService.populateFormattingSettingsModel(
          VisualFormattingSettingsModel,
          options.dataViews[0]
        );

      const generalSettings = this.formattingSettings.generalCard;
      const categoryColorsSettings = this.formattingSettings.categoryColorsCard;
      const leftLegendSettings = this.formattingSettings.leftLegendCard;
      const rightLegendSettings = this.formattingSettings.rightLegendCard;

      const labels = [];
      let data = [];
      const images = [];
      const imageLegends = [];
      this.categoryColors = [];

      this.setCategories(dataView, colorPalette, categoryColorsSettings);

      // FORMATS
      // let format = this.getFormat(dataView);
      // Business request : always percent
      const format = "%";

      const colors = this.categoryColors.map((cc) => cc.color);

      const selectionIds = this.categoryColors.map((cc) => cc.selectionId);

      // VALUES
      this.setValues(dataView, data, labels, images, imageLegends);

      const total = data.reduce((partialTotal, a) => partialTotal + a, 0);

      data = data.map((d) => d / total);

      if (
        labels &&
        Object.keys(labels).length > 0 &&
        data &&
        Object.keys(data).length > 0
      ) {
        this.clear();
        Donut.update({
          labels,
          data,
          images,
          imageLegends,
          colors,
          selectionIds,
          selectedColors: colors,
          displayUnits: parseInt(generalSettings.displayUnits.value.toString()),
          decimalPlaces: generalSettings.decimalPlaces.value,
          format,
          valueFontFamily: leftLegendSettings.valueFontFamily.value,
          valueFontSize: leftLegendSettings.valueFontSize.value,
          valueBold: leftLegendSettings.valueBold.value,
          valueItalic: leftLegendSettings.valueItalic.value,
          valueUnderline: leftLegendSettings.valueUnderline.value,
          labelFontFamily: leftLegendSettings.labelFontFamily.value,
          labelFontSize: leftLegendSettings.labelFontSize.value,
          labelBold: leftLegendSettings.labelBold.value,
          labelItalic: leftLegendSettings.labelItalic.value,
          labelUnderline: leftLegendSettings.labelUnderline.value,
          labelColor: leftLegendSettings.labelColor.value.value,
          lineColor: leftLegendSettings.lineColor.value.value,
          additionalInfoText: leftLegendSettings.additionalInfoText.value,
          additionalInfoFontFamily:
            leftLegendSettings.additionalInfoFontFamily.value,
          additionalInfoFontSize:
            leftLegendSettings.additionalInfoFontSize.value,
          additionalInfoBold: leftLegendSettings.additionalInfoBold.value,
          additionalInfoItalic: leftLegendSettings.additionalInfoItalic.value,
          additionalInfoUnderline:
            leftLegendSettings.additionalInfoUnderline.value,
          additionalInfoColor:
            leftLegendSettings.additionalInfoColor.value.value,
          imageWidth: leftLegendSettings.imageWidth.value,
          imageHeight: leftLegendSettings.imageHeight.value,
          imageLegendFontFamily: leftLegendSettings.imageLegendFontFamily.value,
          imageLegendFontSize: leftLegendSettings.imageLegendFontSize.value,
          imageLegendBold: leftLegendSettings.imageLegendBold.value,
          imageLegendItalic: leftLegendSettings.imageLegendItalic.value,
          imageLegendUnderline: leftLegendSettings.imageLegendUnderline.value,
          imageLegendColor: leftLegendSettings.imageLegendColor.value.value,
          imageLegendShow: leftLegendSettings.imageLegendShow.value,
          rightBorderColor: rightLegendSettings.borderColor.value.value,
          rightFontFamily: rightLegendSettings.rightFontFamily.value,
          rightFontSize: rightLegendSettings.rightFontSize.value,
          rightBold: rightLegendSettings.rightBold.value,
          rightItalic: rightLegendSettings.rightItalic.value,
          rightUnderline: rightLegendSettings.rightUnderline.value,
          rightColor: rightLegendSettings.rightColor.value.value,
          selectCategory: this.selectCategory,
          tooltipService: this.host.tooltipService,
        });
      }
    } else {
      this.clear();
    }

    this.events.renderingFinished(options);
  }

  private clear() {
    Donut.update(initialState);
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }

  private getColumnColorByIndex(
    category: DataViewCategoryColumn,
    index: number,
    colorPalette: ISandboxExtendedColorPalette
  ): string {
    if (colorPalette.isHighContrast) {
      return colorPalette.background.value;
    }

    const defaultColor: Fill = {
      solid: {
        color: colorPalette.getColor(`${category.values[index]}`).value,
      },
    };

    return getCategoricalObjectValue<Fill>(
      category,
      index,
      "category",
      "categoryColor",
      defaultColor
    ).solid.color;
  }
}
