"use strict";(self.webpackChunkfutS3_frontend=self.webpackChunkfutS3_frontend||[]).push([[895],{4895:(L,f,s)=>{s.r(f),s.d(f,{PositionsModule:()=>q});var m=s(6814),x=s(7553),P=s(6208),T=s(8645),c=s(9773),d=s(8446),y=s(2942),t=s(4946),Z=s(7272),h=s(5219),b=s(6858),C=s(5369),E=s(695),u=s(4532),p=s(3428),A=s(30);function S(i,r){1&i&&(t.TgZ(0,"tr")(1,"th",6)(2,"div",7)(3,"div",8),t._uU(4," ID "),t.qZA(),t.TgZ(5,"div",7),t._UZ(6,"p-sortIcon",9)(7,"p-columnFilter",10),t.qZA()()(),t.TgZ(8,"th",11)(9,"div",7)(10,"div",8),t._uU(11," Name "),t.qZA(),t.TgZ(12,"div",7),t._UZ(13,"p-sortIcon",12)(14,"p-columnFilter",13),t.qZA()()(),t.TgZ(15,"th",14)(16,"div",7)(17,"div",8),t._uU(18," Description "),t.qZA(),t.TgZ(19,"div",7),t._UZ(20,"p-sortIcon",15)(21,"p-columnFilter",16),t.qZA()()()()),2&i&&(t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1))}function O(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"tr",17)(1,"td",18),t.NdJ("click",function(){const a=t.CHM(e).$implicit,l=t.oxw(2);return t.KtG(l.handleViewFullDataPositionEvent(a))}),t._uU(2),t.qZA(),t.TgZ(3,"td",18),t.NdJ("click",function(){const a=t.CHM(e).$implicit,l=t.oxw(2);return t.KtG(l.handleViewFullDataPositionEvent(a))}),t._uU(4),t.ALo(5,"shorten"),t.qZA(),t.TgZ(6,"td",18),t.NdJ("click",function(){const a=t.CHM(e).$implicit,l=t.oxw(2);return t.KtG(l.handleViewFullDataPositionEvent(a))}),t._uU(7),t.ALo(8,"shorten"),t.qZA()()}if(2&i){const e=r.$implicit;t.xp6(2),t.hij(" ",e.id," "),t.xp6(2),t.hij(" ",t.xi3(5,3,e.name,30)," "),t.xp6(3),t.hij(" ",t.xi3(8,6,e.description,40)||"No description for now!"," ")}}const M=function(){return{width:"60rem"}},D=function(){return["id","name"]};function I(i,r){if(1&i&&(t.TgZ(0,"p-card",2)(1,"p-table",3),t.YNc(2,S,22,9,"ng-template",4),t.YNc(3,O,9,9,"ng-template",5),t.qZA()()),2&i){const e=t.oxw();t.Akn(t.DdM(8,M)),t.xp6(1),t.Q6J("value",e.positions)("rows",15)("globalFilterFields",t.DdM(9,D))("paginator",!0)("showCurrentPageReport",!0)("rowHover",!0)}}let U=(()=>{class i{constructor(){this.viewEvent=new t.vpe}handleViewFullDataPositionEvent(e){this.viewEvent.emit({id:e.id,name:e.name,description:e.description})}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-positions-table"]],inputs:{positions:"positions"},outputs:{viewEvent:"viewEvent"},decls:2,vars:1,consts:[[1,"flex","justify-content-center"],["header","Positions",3,"style",4,"ngIf"],["header","Positions"],["dataKey","id","currentPageReportTemplate","Showing {first} to {last} of {totalRecords} positions","styleClass","fadein animation-duration-1000 animation-iteration-1 animation-ease-out",3,"value","rows","globalFilterFields","paginator","showCurrentPageReport","rowHover"],["pTemplate","header"],["pTemplate","body"],["id","1","pSortableColumn","id"],[1,"flex","justify-content-between","align-items-center"],[1,"flex","justify-content-center","align-items-center","text-lg","mt-1"],["field","id"],["type","text","field","id","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],["id","2","pSortableColumn","name"],["field","name"],["type","text","field","name","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],["id","2","pSortableColumn","description"],["field","description"],["type","text","field","description","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],[2,"cursor","pointer"],[3,"click"]],template:function(o,n){1&o&&(t.TgZ(0,"div",0),t.YNc(1,I,4,10,"p-card",1),t.qZA()),2&o&&(t.xp6(1),t.Q6J("ngIf",n.positions))},dependencies:[m.O5,u.Z,h.jx,p.iA,p.lQ,p.fz,p.xl,A.T],encapsulation:2})}return i})();var g=s(9445),v=s(7338),w=s(707);const N=function(){return{height:"150px"}};function B(i,r){if(1&i&&(t.TgZ(0,"div",10)(1,"p-panel",11)(2,"p"),t._uU(3),t.qZA()(),t.TgZ(4,"div",12)(5,"label",13),t._uU(6,"Description"),t.qZA(),t.TgZ(7,"p-scrollPanel")(8,"p",14),t._uU(9),t.qZA()()()()),2&i){const e=t.oxw();t.xp6(3),t.hij(" ",e.position.name," "),t.xp6(4),t.Akn(t.DdM(4,N)),t.xp6(2),t.hij(" ",e.position.description||"No description for now!"," ")}}function J(i,r){1&i&&(t.TgZ(0,"tr")(1,"th",18)(2,"div",19)(3,"div",20),t._uU(4," ID "),t.qZA(),t.TgZ(5,"div",19),t._UZ(6,"p-sortIcon",21)(7,"p-columnFilter",22),t.qZA()()(),t.TgZ(8,"th",23)(9,"div",19)(10,"div",20),t._uU(11," Name "),t.qZA(),t.TgZ(12,"div",19),t._UZ(13,"p-sortIcon",24)(14,"p-columnFilter",25),t.qZA()()(),t.TgZ(15,"th",26)(16,"div",19)(17,"div",20),t._uU(18," Weight "),t.qZA(),t.TgZ(19,"div",19),t._UZ(20,"p-sortIcon",27)(21,"p-columnFilter",28),t.qZA()()()()),2&i&&(t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1))}function R(i,r){if(1&i&&(t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA()()),2&i){const e=r.$implicit;t.xp6(2),t.Oqu(e.id),t.xp6(2),t.Oqu(e.name),t.xp6(2),t.Oqu(e.weight)}}function j(i,r){if(1&i&&(t.TgZ(0,"p-table",15),t.YNc(1,J,22,9,"ng-template",16),t.YNc(2,R,7,3,"ng-template",17),t.qZA()),2&i){const e=t.oxw();t.Q6J("value",e.position.parameters)("paginator",!0)("rows",5)("showCurrentPageReport",!0)("rowHover",!0)}}function F(i,r){1&i&&(t.TgZ(0,"h3",29),t._uU(1," No parameters for now! "),t.qZA())}const V=function(){return{width:"60rem"}};let H=(()=>{class i{constructor(){this.positionEvents=d.L,this.backEvent=new t.vpe,this.editOrDeletePositionEvent=new t.vpe}handleBackEvent(){this.backEvent.emit()}handleEditOrDeletePositionEvent(e){this.editOrDeletePositionEvent.emit(e)}static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-position-view"]],inputs:{position:"position"},outputs:{backEvent:"backEvent",editOrDeletePositionEvent:"editOrDeletePositionEvent"},decls:11,vars:6,consts:[[1,"flex","justify-content-center","overflow-hidden"],["header","Position View","styleClass","fadein animation-duration-300 animation-iteration-1 animation-ease-out"],[1,"flex","justify-content-between","align-content-center","align-items-center","mt-2"],["pButton","","pRipple","","icon","pi pi-arrow-left","pTooltip","Return to the table","tooltipPosition","top",3,"click"],[1,"flex","justify-content-between","align-content-center","align-items-center","gap-3"],["pButton","","pRipple","","icon","pi pi-pencil","pTooltip","Edit player data","tooltipPosition","top",1,"p-button-warning",3,"click"],["pButton","","pRipple","","icon","pi pi-trash","pTooltip","Delete player","tooltipPosition","top",1,"p-button-danger",3,"click"],["class","panel-custom panel-custom-name flex justify-content-between align-items-start mt-3 gap-3",4,"ngIf"],["dataKey","id","styleClass","mt-2","currentPageReportTemplate","Showing {first} to {last} of {totalRecords} parameters",3,"value","paginator","rows","showCurrentPageReport","rowHover",4,"ngIf","ngIfElse"],["withoutParameters",""],[1,"panel-custom","panel-custom-name","flex","justify-content-between","align-items-start","mt-3","gap-3"],["header","Name"],[1,"flex","flex-column","border-solid","border-green-700","border-2","border-round-lg","pb-1","bg-gray-50"],["for","description",1,"text-gray-900","font-bold","text-medium","text-center","bg-gray-300","p-3","border-round-top-lg"],[1,"text-justify","text-gray-900","m-3",2,"width","35rem"],["dataKey","id","styleClass","mt-2","currentPageReportTemplate","Showing {first} to {last} of {totalRecords} parameters",3,"value","paginator","rows","showCurrentPageReport","rowHover"],["pTemplate","header"],["pTemplate","body"],["id","1","pSortableColumn","id"],[1,"flex","justify-content-between","align-items-center"],[1,"flex","justify-content-center","align-items-center","text-lg","mt-1"],["field","id"],["type","text","field","id","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],["id","2","pSortableColumn","name"],["field","parameterName"],["type","text","field","parameterName","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],["id","3","pSortableColumn","parameterWeight"],["field","parameterWeight"],["type","text","field","parameterWeight","display","menu","matchMode","contains",2,"height","1.7rem",3,"showMatchModes","showOperator","showAddButton"],[1,"text-center","text-large","text-green-900"]],template:function(o,n){if(1&o&&(t.TgZ(0,"div",0)(1,"p-card",1)(2,"div",2)(3,"button",3),t.NdJ("click",function(){return n.handleBackEvent()}),t.qZA(),t.TgZ(4,"div",4)(5,"button",5),t.NdJ("click",function(){return n.handleEditOrDeletePositionEvent({id:n.position.id,action:n.positionEvents.EDIT})}),t.qZA(),t.TgZ(6,"button",6),t.NdJ("click",function(){return n.handleEditOrDeletePositionEvent({id:n.position.id,action:n.positionEvents.DELETE})}),t.qZA()()(),t.YNc(7,B,10,5,"div",7),t.YNc(8,j,3,5,"p-table",8),t.YNc(9,F,2,0,"ng-template",null,9,t.W1O),t.qZA()()),2&o){const a=t.MAs(10);t.xp6(1),t.Akn(t.DdM(5,V)),t.xp6(6),t.Q6J("ngIf",n.position),t.xp6(1),t.Q6J("ngIf",n.position&&n.position.parameters.length>0)("ngIfElse",a)}},dependencies:[m.O5,u.Z,h.jx,p.iA,p.lQ,p.fz,p.xl,g.s,v.P,w.Hq],encapsulation:2})}return i})();function Q(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"app-positions-table",2),t.NdJ("viewEvent",function(n){t.CHM(e);const a=t.oxw();return t.KtG(a.handleViewFullDataPositionAction(n))}),t.qZA()}if(2&i){const e=t.oxw();t.Q6J("positions",e.positions)}}function k(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"app-position-view",3),t.NdJ("backEvent",function(){t.CHM(e);const n=t.oxw();return t.KtG(n.handleBackAction())})("editOrDeletePositionEvent",function(n){t.CHM(e);const a=t.oxw();return t.KtG(a.handleEditOrDeletePositionEvent(n))}),t.qZA()}if(2&i){const e=t.oxw();t.Q6J("position",e.position)}}const Y=[{path:"",component:(()=>{class i{constructor(e,o,n,a,l){this.positionService=e,this.messageService=o,this.customDialogService=n,this.confirmationService=a,this.changesOnService=l,this.$destroy=new T.x,this.messageLife=3e3}ngOnInit(){this.setPositionsWithApi(),this.positionService.$positionView.pipe((0,c.R)(this.$destroy)).subscribe({next:e=>{this.positionView=e},error:e=>{console.log(e)}}),this.changesOnService.getChangesOn().pipe((0,c.R)(this.$destroy)).subscribe({next:e=>{if(e){this.setPositionsWithApi();const o=this.positionService.changedPositionId;o&&this.selectPosition(o)}},error:e=>{console.log(e)}})}setPositionsWithApi(){this.positionService.findAll().pipe((0,c.R)(this.$destroy)).subscribe({next:e=>{this.positions=e},error:e=>{403!=e.status&&this.messageService.add({severity:"error",summary:"Error",detail:"Unexpected error!",life:this.messageLife}),console.log(e)}})}selectPosition(e){e&&this.positionService.findByIdWithParameters(e).pipe((0,c.R)(this.$destroy)).subscribe({next:o=>{o&&(this.position=o),this.positionService.changedPositionId=e},error:o=>{this.messageService.clear(),this.messageService.add({severity:"error",summary:"Error",detail:"Unable to access the position!",life:this.messageLife}),console.log(o)}})}handleViewFullDataPositionAction(e){e&&(this.selectPosition(e.id),this.positionService.$positionView.next(!0))}handleBackAction(){this.positionService.$positionView.next(!1)}deletePosition(e){e&&this.positionService.deleteById(e).pipe((0,c.R)(this.$destroy)).subscribe({next:()=>{this.messageService.clear(),this.messageService.add({severity:"success",summary:"Success",detail:"Position deleted successfully!",life:2e3}),this.positionService.changedPositionId=void 0,this.changesOnService.setChangesOn(!0),this.handleBackAction()},error:o=>{console.log(o),this.messageService.clear(),this.messageService.add({key:"deletion-error",severity:"error",summary:"Error",detail:"Is the position part of a game mode or a player!",life:6e3}),this.changesOnService.setChangesOn(!1)}})}deletePositionConfirmation(){this.position&&this.confirmationService.confirm({message:`Confirm the deletion of position: ${this.position.name}?`,header:"Confirmation",icon:"pi pi-exclamation-triangle",acceptLabel:"Yes",rejectLabel:"No",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-text",acceptIcon:"none",rejectIcon:"none",accept:()=>this.deletePosition(this.position.id)})}handleEditOrDeletePositionEvent(e){e&&e.action===d.L.EDIT&&(this.dynamicDialogRef=this.customDialogService.open(y.J,{position:"top",header:d.L.EDIT.valueOf(),contentStyle:{overflow:"auto"},baseZIndex:1e4,data:{$event:d.L.EDIT,selectedPositionId:e.id}}),this.dynamicDialogRef.onClose.pipe((0,c.R)(this.$destroy)).subscribe(()=>this.selectPosition(e.id))),e&&e.action===d.L.DELETE&&this.deletePositionConfirmation()}ngOnDestroy(){this.$destroy.next(),this.$destroy.complete()}static#t=this.\u0275fac=function(o){return new(o||i)(t.Y36(Z.e),t.Y36(h.ez),t.Y36(b.W),t.Y36(h.YP),t.Y36(C.g))};static#e=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-positions-home"]],decls:3,vars:2,consts:[[3,"positions","viewEvent",4,"ngIf"],[3,"position","backEvent","editOrDeletePositionEvent",4,"ngIf"],[3,"positions","viewEvent"],[3,"position","backEvent","editOrDeletePositionEvent"]],template:function(o,n){1&o&&(t._UZ(0,"app-menubar-navigation"),t.YNc(1,Q,1,1,"app-positions-table",0),t.YNc(2,k,1,1,"app-position-view",1)),2&o&&(t.xp6(1),t.Q6J("ngIf",!n.positionView),t.xp6(1),t.Q6J("ngIf",n.positionView))},dependencies:[m.O5,E.i,U,H],encapsulation:2})}return i})()}];var _=s(95);let q=(()=>{class i{static#t=this.\u0275fac=function(o){return new(o||i)};static#e=this.\u0275mod=t.oAB({type:i});static#i=this.\u0275inj=t.cJS({imports:[m.ez,x.Bz.forChild(Y),_.u5,_.UX,P.m,u.d,p.U$,g.Q,v._,w.hJ]})}return i})()}}]);