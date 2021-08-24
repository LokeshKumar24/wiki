sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,JSONModel,Filter,FilterOperator) {
		"use strict";

		return Controller.extend("wiki.controller.View2", {
			onInit: function () {
				this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(),"File");
			    this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

				this.oRouter.attachRoutePatternMatched(this.openSelected, this);
			},
			rowCount:null,
			openSelected:function(oEvent){
			//	debugger;
				var category = oEvent.getParameter("arguments").Id;
				var filter=  oEvent.getParameter("arguments").filter
			if(category&&filter){
				this.getView().byId("cat").setText(category)
				this.getData(category,filter)
				
			}
			},
			searchData:function(oEvent){
				debugger
				// build filter array
				
				var sQuery = oEvent.getParameter("query");
				var aFilter = [];
				if (sQuery) {
					
					aFilter.push(new Filter("Name", FilterOperator.Contains, sQuery));
					aFilter.push(new Filter("Description", FilterOperator.Contains, sQuery));
				} 

				// filter binding
				var oList = this.byId("catData");
				var oBinding = oList.getBinding("rows");
				oBinding.filter(aFilter);
				
			},
			
			oRouter:null,
			onBack:function(){
			//	this.oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.navTo("RouteView1");
				this.getView().byId("catData").setBusy(true)
			},
			getData:function(category,filter){
				var that=this;
			debugger;
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.read("/z_c_signiwiswiki?$filter=category eq '"+category+"' and type eq '"+filter+"'",{
					success:function(oData){
					//	debugger
						console.log(oData.results);
						that.specificCategory(oData.results)
	
			
			},
					error:function(error){
						//debugger;
						console.log(error)
					},
					
				})	

			},
			specificCategory:function(data){
				debugger
				var catData=[];
				catData=data;
				//catData = data.filter(element=>{return element.Category===category})
				this.getOwnerComponent().setModel(new JSONModel({CategoryList:catData}),"File");
			
				this.rowCount=catData.length;
				this.getView().byId("catData").setVisibleRowCount(this.rowCount);
				this.getView().byId("catData").setBusy(false)
			},
			editRecord:function(){
				debugger;
				var fileName=this.getOwnerComponent().getModel("edit").getProperty("/name");
				var link=this.getOwnerComponent().getModel("edit").getProperty("/link");
				var category=this.getOwnerComponent().getModel("edit").getProperty("/category");
				var type=this.getOwnerComponent().getModel("edit").getProperty("/type");
				var description=this.getOwnerComponent().getModel("edit").getProperty("/description");
				var password=this.getOwnerComponent().getModel("edit").getProperty("/password");
			
				 if(fileName==undefined ){
					this.getOwnerComponent().getModel("validation").setProperty("/fileName","Error");
					this.getOwnerComponent().getModel("validation").setProperty("/fileNameText","Please Enter Your File Name");
					
			 }  else if(link==undefined ){
				this.getOwnerComponent().getModel("validation").setProperty("/link","Error");
				this.getOwnerComponent().getModel("validation").setProperty("/linkText","Please Enter Link");
		
		 }  
		 else if(category==undefined ){
			this.getOwnerComponent().getModel("validation").setProperty("/category","Error");
			this.getOwnerComponent().getModel("validation").setProperty("/categoryText","Please select category");
	 }
	 else if(type==undefined ){
		this.getOwnerComponent().getModel("validation").setProperty("/type","Error");
		this.getOwnerComponent().getModel("validation").setProperty("/typeText","Please select type");
 }
		  else if(description==undefined ){
			this.getOwnerComponent().getModel("validation").setProperty("/description","Error");
			this.getOwnerComponent().getModel("validation").setProperty("/descriptionText","Please Enter Description");
	 }  
  else if(password==undefined ){
	this.getOwnerComponent().getModel("validation").setProperty("/password","Error");
	this.getOwnerComponent().getModel("validation").setProperty("/passwordText","Please Enter Password");
}
		
else{
			
			
				var payload={
					name : fileName ,
					description :description ,
					category : category,
					type:type,
					link :link,
					password : password,
					guid:this.guid
					}
		      	this.getView().setBusy(true);
				this.updateDataObject(payload)

					
			}
				
			},

			
			
			inputValidation:function(){
               //  debugger;

				 this.getOwnerComponent().getModel("validation").setProperty("/fileName","None");
				this.getOwnerComponent().getModel("validation").setProperty("/link","None");
				this.getOwnerComponent().getModel("validation").setProperty("/description","None");
				this.getOwnerComponent().getModel("validation").setProperty("/password","None");
				this.getOwnerComponent().getModel("validation").setProperty("/category","None");
				this.getOwnerComponent().getModel("validation").setProperty("/type","None");
			},
			updateDataObject:function(payload){

					var ArrData=this.getOwnerComponent().getModel("File").getProperty("/CategoryList");
					 payload.guid =ArrData[this.sIndex].guid;
				
				var that=this;
			
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.update("/z_c_signiwiswiki('"+payload.guid+"')",payload,{
					method:"PUT",
					success:function(oResponse){
						debugger
					//	console.log(oResponse);
						sap.m.MessageToast.show(" Updated Successfully");
						that.getData(payload.category,payload.type);
						that.onCloseFrag();	
						that.getView().setBusy(false);
						
						
			},
					error:function(error){
						debugger;
						console.log(error)
						that.passwordWrong();
						
						that.getView().setBusy(false);
				
						
					},
					
				});
			
		},
			passwordWrong:function(){
				sap.m.MessageToast.show("Authentication Failed");
				
            },
			guid:null,
			sIndex:null,
			selectedRecord:function(oEvent){
				debugger;
				var selectedIndex=oEvent.getParameters().rowIndex;
			var ArrData=this.getOwnerComponent().getModel("File").getProperty("/CategoryList");
			this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(ArrData[selectedIndex]),"edit");
			this.guid=ArrData[selectedIndex].guid;
			this.sIndex=selectedIndex;
			//this.popUp()
			
		
		},
		frag:null,
		popUp:function(){
			if(this.guid){
			if(!this.frag){
				this.frag = new sap.ui.xmlfragment(this.createId("editFrag"),"wiki.view.editFragment",this);
				this.getView().addDependent(this.frag);
			}
			this.frag.open();
		}
		else{
			sap.m.MessageToast.show("Please select a row");	
		}
		},
		onCloseFrag:function(){
			this.frag.close();
			this.inputValidation();
	//this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(),"edit");
		},
			deleteRecord:function(){
				debugger;
			
					var ArrData=this.getOwnerComponent().getModel("File").getProperty("/CategoryList");
					var payload=ArrData[this.sIndex];
					var guid=ArrData[this.sIndex].guid;
					
				var that=this;
			
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.remove("/z_c_signiwiswiki('"+guid+"')",{
					method:"DELETE",
					urlParameters:{
						category:payload.category,
						password:payload.password
					},
					success:function(oResponse){
						debugger
					//	console.log(oResponse);
						sap.m.MessageToast.show(" Deleted Successfully");
					
						that.onCloseFrag();	
						that.getView().setBusy(false);
						
						
			},
					error:function(error){
						debugger;
						console.log(error)
						that.passwordWrong();
						
						that.getView().setBusy(false);
				
						
					},
					
				});
			

			},

		
		});
	});
