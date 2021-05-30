(window.webpackJsonp=window.webpackJsonp||[]).push([["vendors~compound-drag-and-drop"],{"./node_modules/cytoscape-compound-drag-and-drop/cytoscape-compound-drag-and-drop.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/cytoscape-compound-drag-and-drop/cytoscape-compound-drag-and-drop.js ***!
  \*******************************************************************************************/
/*! no static exports found */function(e,n,r){var t;t=function(){return function(e){var n={};function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=n,r.i=function(e){return e},r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=6)}([function(e,n,r){"use strict";var t=r(1),o=r(2),d=r(4),i=r(3),s=function(e,n){this.cy=e,this.options=t({},o,n),this.listeners=[],this.enabled=!0,this.addListeners()};[d,i,{destroy:function(){this.removeListeners()}}].forEach((function(e){t(s.prototype,e)})),e.exports=function(e){return new s(this,e)}},function(e,n,r){"use strict";e.exports=null!=Object.assign?Object.assign.bind(Object):function(e){for(var n=arguments.length,r=Array(n>1?n-1:0),t=1;t<n;t++)r[t-1]=arguments[t];return r.filter((function(e){return null!=e})).forEach((function(n){Object.keys(n).forEach((function(r){return e[r]=n[r]}))})),e}},function(e,n,r){"use strict";e.exports={grabbedNode:function(e){return!0},dropTarget:function(e){return!0},dropSibling:function(e){return!0},newParentNode:function(e,n){return{}},overThreshold:10,outThreshold:10}},function(e,n,r){"use strict";var t=r(5),o=t.isParent,d=t.isChild,i=t.isOnlyChild,s=t.getBounds,a=t.getBoundsTuple,u=t.boundsOverlap,c=t.expandBounds,l=t.getBoundsCopy,p=t.setParent,b=t.removeParent;e.exports={addListener:function(e,n,r){this.listeners.push({event:e,selector:n,callback:r}),null==n?this.cy.on(e,r):this.cy.on(e,n,r)},addListeners:function(){var e=this,n=this.options,r=this.cy,t=function(e){return!o(e)&&!function(e){return e.selected()&&r.elements("node:selected").length>1}(e)&&n.grabbedNode(e)},g=function(r){return(function(r){return!d(r)&&!r.same(e.grabbedNode)&&n.dropTarget(r)}(r)||function(r){return d(r)&&!r.same(e.grabbedNode)&&n.dropSibling(r)}(r))&&!r.same(e.dropTarget)},f=function(){return e.boundsTuples=r.nodes(g).map(a)},h=function(){e.grabbedNode.removeClass("cdnd-grabbed-node"),e.dropTarget.removeClass("cdnd-drop-target"),e.dropSibling.removeClass("cdnd-drop-sibling"),e.grabbedNode=r.collection(),e.dropTarget=r.collection(),e.dropSibling=r.collection(),e.dropTargetBounds=null,e.boundsTuples=[],e.inGesture=!1};this.addListener("grab","node",(function(n){var o=n.target;e.enabled&&t(o)&&(e.inGesture=!0,e.grabbedNode=o,e.dropTarget=r.collection(),e.dropSibling=r.collection(),d(o)&&(e.dropTarget=o.parent(),e.dropTargetBounds=l(e.dropTarget)),f(),e.grabbedNode.addClass("cdnd-grabbed-node"),e.dropTarget.addClass("cdnd-drop-target"),o.emit("cdndgrab"))})),this.addListener("add","node",(function(n){if(e.inGesture&&e.enabled){var r=n.target;g(r)&&e.boundsTuples.push(a(r))}})),this.addListener("remove","node",(function(n){if(e.inGesture&&e.enabled){var t=n.target,o=t.same(e.dropTarget),d=t.same(e.dropSibling),i=t.same(e.grabbedNode);(o||d||i)&&(i?h():(e.dropTarget=r.collection(),e.dropSibling=r.collection(),f()))}})),this.addListener("drag","node",(function(){if(e.inGesture&&e.enabled)if(e.dropTarget.nonempty()){var t=c(s(e.grabbedNode),n.outThreshold),d=e.dropTarget,a=e.dropSibling,g=!u(e.dropTargetBounds,t),h=i(e.grabbedNode);g&&(b(e.grabbedNode),b(e.dropSibling),e.dropTarget.removeClass("cdnd-drop-target"),e.dropSibling.removeClass("cdnd-drop-sibling"),(e.dropSibling.nonempty()||h)&&e.dropTarget.remove(),e.dropTarget=r.collection(),e.dropSibling=r.collection(),e.dropTargetBounds=null,f(),e.grabbedNode.emit("cdndout",[d,a]))}else{var v=c(s(e.grabbedNode),n.overThreshold),y=e.boundsTuples.filter((function(e){return!e.node.removed()&&u(v,e.bb)})).map((function(e){return e.node}));if(y.length>0){var m=y.filter(o),T=void 0,x=void 0;m.length>0?(x=r.collection(),T=m[0]):(x=y[0],T=r.add(n.newParentNode(e.grabbedNode,x))),T.addClass("cdnd-drop-target"),x.addClass("cdnd-drop-sibling"),p(x,T),e.dropTargetBounds=l(T),p(e.grabbedNode,T),e.dropTarget=T,e.dropSibling=x,e.grabbedNode.emit("cdndover",[T,x])}}})),this.addListener("free","node",(function(){if(e.inGesture&&e.enabled){var n=e.grabbedNode,r=e.dropTarget,t=e.dropSibling;h(),n.emit("cdnddrop",[r,t])}}))},removeListeners:function(){var e=this.cy;this.listeners.forEach((function(n){var r=n.event,t=n.selector,o=n.callback;null==t?e.removeListener(r,o):e.removeListener(r,t,o)})),this.listeners=[]}}},function(e,n,r){"use strict";e.exports={enable:function(){this.enabled=!0},disable:function(){this.enabled=!1}}},function(e,n,r){"use strict";var t=function(e){return e.isChild()},o=function(e){return e.boundingBox({includeOverlays:!1})},d=function(e){return{x1:e.x1,x2:e.x2,y1:e.y1,y2:e.y2,w:e.w,h:e.h}};e.exports={isParent:function(e){return e.isParent()},isChild:t,isOnlyChild:function(e){return t(e)&&1===e.parent().children().length},getBoundsTuple:function(e){return{node:e,bb:d(o(e))}},boundsOverlap:function(e,n){return!(e.x1>n.x2||n.x1>e.x2||e.x2<n.x1||n.x2<e.x1||e.y2<n.y1||n.y2<e.y1||e.y1>n.y2||n.y1>e.y2)},getBounds:o,expandBounds:function(e,n){return{x1:e.x1-n,x2:e.x2+n,w:e.w+2*n,y1:e.y1-n,y2:e.y2+n,h:e.h+2*n}},copyBounds:d,getBoundsCopy:function(e){return d(o(e))},removeParent:function(e){return e.move({parent:null})},setParent:function(e,n){return e.move({parent:n.id()})}}},function(e,n,r){"use strict";var t=r(0),o=function(e){e&&e("core","compoundDragAndDrop",t)};"undefined"!=typeof cytoscape&&o(cytoscape),e.exports=o}])},e.exports=t()}}]);
//# sourceMappingURL=vendors~compound-drag-and-drop.bundle.js.map