sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("wiki.controller.View2", {
      onInit: function () {
        this.getOwnerComponent().setModel(
          new sap.ui.model.json.JSONModel(),
          "File"
        );
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        this.oRouter.attachRoutePatternMatched(this.openSelected, this);
      },
      rowCount: null,
      openSelected: function (oEvent) {
        //	debugger;
        var category = oEvent.getParameter("arguments").Id;
        var filter = oEvent.getParameter("arguments").filter;
        if (category && filter) {
          this.getView().byId("cat").setText(category);
          this.getData(category, filter);
        }
      },
      searchData: function (oEvent) {
        debugger;
        // build filter array

        var sQuery = oEvent.getParameter("query");
        var aFilter = [];
        if (sQuery) {
          aFilter.push(new Filter("Name", FilterOperator.Contains, sQuery));
          aFilter.push(
            new Filter("Description", FilterOperator.Contains, sQuery)
          );
        }

        // filter binding
        var oList = this.byId("catData");
        var oBinding = oList.getBinding("rows");
        oBinding.filter(aFilter);
      },
      filterTable: function (sQuery) {},
      oRouter: null,
      onBack: function () {
        //	this.oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.navTo("RouteView1");
        this.getView().byId("catData").setBusy(true);
      },
      getData: function (category, filter) {
        var that = this;

        var serviceurl = "/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

        var oModel = new sap.ui.model.odata.ODataModel(serviceurl);
        var aFilters = [];
        aFilters.push(
          new sap.ui.model.Filter(
            "Category",
            sap.ui.model.FilterOperator.EQ,
            category
          )
        );
        oModel.read("/Z_C_SIGNIWISWIKI", {
        //   filters: aFilters,
          success: function (oData) {
            //	debugger
            //	console.log(oData.results);
            that.specificCategory(oData.results, category);
          },
          error: function (error) {
            //	debugger;
            //	console.log(error)
          },
        });
      },
      specificCategory: function (data, category) {
        debugger;
        var catData = [];
        catData = data.filter((element) => {
          return element.Category === category;
        });
        this.getOwnerComponent().setModel(
          new JSONModel({ CategoryList: catData }),
          "File"
        );

        this.rowCount = catData.length;
        this.getView().byId("catData").setVisibleRowCount(this.rowCount);
        this.getView().byId("catData").setBusy(false);
      },
    });
  }
);
