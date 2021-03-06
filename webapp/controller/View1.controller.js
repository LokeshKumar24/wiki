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
				var grid=this.getView().byId("page");
				this.arrayCat=	this.getOwnerComponent().getModel("categories").getProperty("/Categories");
				
				var IconTabBar= new sap.m.IconTabBar({
                    expandable:false,
                   
					select:this.onTabBarSelect.bind(this)
				});
			
				var tileArray=["DOCUMENTS","VIDEOS","INTERVIEW QUESTIONS","BLOGS"]
				
				var genericTileArray=[]
				tileArray.forEach(element=>{
					
					var genericTile= new sap.m.GenericTile({
						subheader:element,
						press:this.topicSelected.bind(this)
						
					});
					genericTileArray.push(genericTile);
				});
				
				//add generic tile 
				this.arrayCat.forEach((element)=>{	
					//debugger
					let IconTabFilter= new sap.m.IconTabFilter({
						text:element.Category,
						key:element.Category
					});

					tileArray.forEach(element=>{
					
						var genericTile= new sap.m.GenericTile({
							subheader:element,
							press:this.topicSelected.bind(this)
							
						});
						IconTabFilter.addContent(genericTile);
					});
					
					IconTabBar.addItem(IconTabFilter);
					
				});
				//grid.addItems(IconTabBar);
				grid.addContent(IconTabBar);
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
				var key  =oEvent.getSource().oParent.mProperties.text;
				var filter=oEvent.getSource().mProperties.subheader;
				this.oRouter =sap.ui.core.UIComponent.getRouterFor(this)
				;
				this.oRouter.navTo("RouteView2",{
					Id:key,
					filter:filter
					});
			},
		
			saveData:function(){
				debugger;
			
				var fileName=this.getOwnerComponent().getModel("addNew").getProperty("/Filename");
				var link=this.getOwnerComponent().getModel("addNew").getProperty("/Link");
				var category=Fragment.byId(this.createId("saveFrag"),"searchField").getSelectedKey();
				var type=Fragment.byId(this.createId("saveFrag"),"typeField").getSelectedKey();
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
					password : password
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
				this.getOwnerComponent().getModel("validation").setProperty("/category","None");
				this.getOwnerComponent().getModel("validation").setProperty("/type","None");
			},
			createDataObject:function(payload){

				
				var that=this;
			
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.create("/z_c_signiwiswiki",payload,{
					method:"POST",
					success:function(oResponse){
						debugger
						console.log(oResponse);
						sap.m.MessageToast.show("Successfully Created");
						that.setCategoryModel();
						that.onCloseFrag();	
						that.getView().setBusy(false);
						
						
			},
					error:function(error){
						//debugger;
						//console.log(error)
						that.passwordWrong();
						
						that.getView().setBusy(false);
				
						
					},
					
				})
			},
			passwordWrong:function(){
				sap.m.MessageToast.show("Authentication Failed");
				
            },
            onTabBarSelect:function(oEvent){
                oEvent.getSource().setExpanded(false);
                oEvent.getSource().setExpanded(true);
                // debugger;
            },

			setCategoryModel:function(){
				debugger
				var that=this;
				//var oModel=this.getOwnerComponent().getModel();
				var serviceurl="/sap/opu/odata/sap/ZSIGNIWISWIKIPEDIA_SRV/";

             var oModel =  new sap.ui.model.odata.ODataModel(serviceurl);
				oModel.read("/CATEGORYSet",{
					success:function(oData){
						debugger
						console.log(oData.results);
				that.getOwnerComponent().setModel(new JSONModel({Categories:oData.results}),"categories")
				
				that.addTiles();	
			},
					error:function(error){
						debugger;
					//	console.log(error);
						
	
					},
					
				})	
			}
		});
	});
