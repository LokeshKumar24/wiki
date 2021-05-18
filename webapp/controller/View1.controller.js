sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,JSONModel,Fragment) {
		"use strict";

		return Controller.extend("wiki.controller.View1", {
			onInit: function () {
         this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(),"addNew");
		 this.getOwnerComponent().setModel(new JSONModel(),"categories");
		 this.setCategoryModel();
	
		
		
			},
			arrayCat:null,
			addTiles:function(){
				//debugger;
				var grid=this.getView().byId("gridId");
				this.arrayCat=	this.getOwnerComponent().getModel("categories").getProperty("/Categories");
				
				this.arrayCat.forEach((element)=>{
					//debugger
					let genericTile= new sap.m.GenericTile({
						subheader:element.Category,
						press:this.topicSelected.bind(this),
						
					});
					//add generic tile 
					grid.addContent(genericTile);
					
				});
				
				grid.setBusy(false);
			},
			frag:null,
			popUp:function(){
				if(!this.frag){
					this.frag = new sap.ui.xmlfragment(this.createId("saveFrag"),"wiki.view.saveFragment",this);
                    this.getView().addDependent(this.frag);
                }
                this.frag.open();
			},
			onCloseFrag:function(){
				this.frag.close();
				this.inputValidation();
		this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(),"addNew");
			},
			oRouter:null,
			topicSelected:function(oEvent){
				//debugger
				var id=oEvent.getSource().mProperties.subheader;
				this.oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.navTo("RouteView2",{Id:id});
			},
			category:null,
			fieldSelected:function(oEvent){
				debugger;
				//this.category=oEvent.getParameters("selectedItem").selectedItem.mProperties.text;
				this.getOwnerComponent().getModel("validation").setProperty("/category","None");
			},
			saveData:function(){
				debugger;
			
				var fileName=this.getOwnerComponent().getModel("addNew").getProperty("/Filename");
				var link=this.getOwnerComponent().getModel("addNew").getProperty("/Link");
				var category=Fragment.byId(this.createId("saveFrag"),"searchField").getSelectedKey();
				var description=this.getOwnerComponent().getModel("addNew").getProperty("/Description")
				var password=this.getOwnerComponent().getModel("addNew").getProperty("/Password");
			
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
					Name : fileName ,
					Description :description ,
					Category : category,
					Link :link,
					Password : password
					}
		      	this.getView().setBusy(true);
				this.createDataObject(payload)

					
			}
	},
			
			inputValidation:function(){
               //  debugger;

				 this.getOwnerComponent().getModel("validation").setProperty("/fileName","None");
				this.getOwnerComponent().getModel("validation").setProperty("/link","None");
				this.getOwnerComponent().getModel("validation").setProperty("/description","None");
				this.getOwnerComponent().getModel("validation").setProperty("/password","None");
			},
			createDataObject:function(payload){

				
				var that=this;
			
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.create("/Z_C_SIGNIWISWIKI",payload,{
					method:"POST",
					success:function(oResponse){
						//debugger
					//	console.log(oResponse);
						sap.m.MessageToast.show("Successfully Created");
						that.onCloseFrag();	
						that.getView().setBusy(false);
						// setTimeout(function(){
						// 	that.getOwnerComponent().getModel("validation").setProperty("/busyIndicator",false);	
						// 	 }, 3000);
						
			},
					error:function(error){
						//debugger;
						//console.log(error)
						that.passwordWrong();
						
						that.getView().setBusy(false);
					// 	setTimeout(function(){ 
					// 		that.getOwnerComponent().getModel("validation").setProperty("/busyIndicator",false);			
					//  }, 3000);
				
						
					},
					
				})
			},
			passwordWrong:function(){
				sap.m.MessageToast.show("Authentication Failed");
				
			},

			setCategoryModel:function(){
				var that=this;
				//var oModel=this.getOwnerComponent().getModel();
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.read("/categorySet",{
					success:function(oData){
						//debugger
						//console.log(oData.results);
				that.getOwnerComponent().setModel(new JSONModel({Categories:oData.results}),"categories")
				
				that.addTiles();	
			},
					error:function(error){
						//debugger;
					//	console.log(error);
						
	
					},
					
				})	
			}
		});
	});
