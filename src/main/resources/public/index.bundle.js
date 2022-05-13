(()=>{"use strict";var e=function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function c(e){try{s(o.next(e))}catch(e){i(e)}}function u(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,u)}s((o=o.apply(e,t||[])).next())}))},t=function(e,t){var n,o,r,i,c={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,o=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!((r=(r=c.trys).length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){c.label=i[1];break}if(6===i[0]&&c.label<r[1]){c.label=r[1],r=i;break}if(r&&c.label<r[2]){c.label=r[2],c.ops.push(i);break}r[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c)}catch(e){i=[6,e],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},n=function(){function n(e){this.restClient=e}return n.prototype.createMeeting=function(){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return[4,this.restClient.post("/api/meetings/",null)];case 1:return e=t.sent(),console.log("Received response after meeting creation",e),[2,e.id]}}))}))},n.prototype.setIntervals=function(n,o,r){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return console.debug("Setting intervals",n,o,r),[4,this.restClient.put("/api/meetings/".concat(n,"/intervals/").concat(o),{intervals:r})];case 1:return e=t.sent(),console.log("Received response on update of intervals",e),[2,e]}}))}))},n.prototype.getMeeting=function(n){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return console.debug("Getting meeting",n),[4,this.restClient.get("/api/meetings/".concat(n))];case 1:return e=t.sent(),console.log("Received response on meeting retrieval",e),[2,e]}}))}))},n}(),o=function(){function n(){}return n.prototype.get=function(n){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return[4,fetch(n,{method:"GET"})];case 1:return[4,t.sent().json()];case 2:return e=t.sent(),console.log("Received response on get",e),[2,e]}}))}))},n.prototype.post=function(n,o){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return[4,fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})];case 1:return[4,t.sent().json()];case 2:return e=t.sent(),console.log("Received response on post",e),[2,e]}}))}))},n.prototype.put=function(n,o){return e(this,void 0,void 0,(function(){var e;return t(this,(function(t){switch(t.label){case 0:return[4,fetch(n,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})];case 1:return[4,t.sent().json()];case 2:return e=t.sent(),console.log("Received response on put",e),[2,e]}}))}))},n}(),r=function(){function e(){}return e.prototype.openNotFound=function(){window.location.href="/404"},e.prototype.openMainPage=function(){window.location.href="/"},e.prototype.openMeetingPage=function(e){window.location.href="/meeting/".concat(e)},e}();new(function(){function e(e,t){this.meetingClient=e,this.navigator=t,console.debug("Created main controller",e,t)}return e.prototype.onLoad=function(){console.debug("Loading main controller"),this.newMeetingButton=document.getElementById("new-meeting-button"),this.newMeetingButton.onclick=this.onNewMeetingButtonClick.bind(this)},e.prototype.onNewMeetingButtonClick=function(){return e=this,t=void 0,o=function(){var e,t;return function(e,t){var n,o,r,i,c={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,o=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!((r=(r=c.trys).length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){c.label=i[1];break}if(6===i[0]&&c.label<r[1]){c.label=r[1],r=i;break}if(r&&c.label<r[2]){c.label=r[2],c.ops.push(i);break}r[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c)}catch(e){i=[6,e],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}}(this,(function(n){switch(n.label){case 0:console.debug("Clicked new meeting button"),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this.meetingClient.createMeeting()];case 2:return e=n.sent(),this.navigator.openMeetingPage(e),[3,4];case 3:return t=n.sent(),console.error("Failed to create meeting",t),[3,4];case 4:return[2]}}))},new((n=void 0)||(n=Promise))((function(r,i){function c(e){try{s(o.next(e))}catch(e){i(e)}}function u(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,u)}s((o=o.apply(e,t||[])).next())}));var e,t,n,o},e}())(new n(new o),new r).onLoad()})();
//# sourceMappingURL=index.bundle.js.map