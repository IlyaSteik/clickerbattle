(window.webpackJsonpclickerbattle=window.webpackJsonpclickerbattle||[]).push([[0],{127:function(e,t,n){e.exports=n(261)},234:function(e,t){},261:function(e,t,n){"use strict";n.r(t);n(128),n(154),n(156),n(157),n(159),n(160),n(161),n(162),n(163),n(164),n(165),n(166),n(168),n(169),n(170),n(171),n(172),n(173),n(174),n(175),n(176),n(177),n(179),n(180),n(181),n(182),n(183),n(184),n(185),n(186),n(187),n(188),n(189),n(190),n(191),n(192),n(193),n(194),n(195),n(196);var a=n(0),c=n.n(a),o=n(72),i=n.n(o),r=n(24),u=n.n(r),s=n(74),l=n.n(s),p=n(117),d=n(54),m=n(41),b=n.n(m),h=n(53),f=n.n(h),v=(n(205),n(118)),g=n(119),j=n(125),O=n(120),E=n(40),w=n(126),y=n(122),k=n.n(y),A=n(123),P=n.n(A),I=n(124),K=n.n(I),S=n(73),V=n.n(S),W=n(121),x=n.n(W),D=function(e){function t(e){var n;return Object(v.a)(this,t),(n=Object(j.a)(this,Object(O.a)(t).call(this,e))).state={activePanel:"main",popout:null},n.login=n.login.bind(Object(E.a)(n)),n.componentDidMount=n.componentDidMount.bind(Object(E.a)(n)),u.a.send("VKWebAppInit",{}),n}return Object(w.a)(t,e),Object(g.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({popout:c.a.createElement(f.a,null)}),setTimeout((function(){e.login()}),100)}},{key:"login",value:function(){var e=x.a.connect("https://ih1705413.vds.myihor.ru:8080/",{secure:!0});e.on("connect",function(){e.json.send({method:"login",url:window.location.search.replace("?","")}),e.on("message",function(e){"login"===e.method&&e.access&&this.setState({popout:null}),console.log(e)}.bind(this))}.bind(this))}},{key:"render",value:function(){return c.a.createElement(b.a,{popout:this.state.popout},c.a.createElement(b.a,{activePanel:this.state.activePanel},c.a.createElement(k.a,{id:"main"},c.a.createElement(V.a,null,"VK App"),c.a.createElement(P.a,null,c.a.createElement(K.a,{style:{width:"100dp",height:"40dp",cornerAngle:"40"}},"Primary")))))}}]),t}(c.a.Component),M=function(){var e=Object(a.useState)("home"),t=Object(d.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)(null),r=Object(d.a)(i,2),s=r[0],m=r[1],h=Object(a.useState)(c.a.createElement(f.a,{size:"large"})),v=Object(d.a)(h,2),g=v[0],j=v[1];Object(a.useEffect)((function(){function e(){return(e=Object(p.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.sendPromise("VKWebAppGetUserInfo");case 2:t=e.sent,m(t),j(null);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}u.a.subscribe((function(e){var t=e.detail,n=t.type,a=t.data;if("VKWebAppUpdateConfig"===n){var c=document.createAttribute("scheme");c.value=a.scheme?a.scheme:"client_light",document.body.attributes.setNamedItem(c)}})),function(){e.apply(this,arguments)}()}),[]);return c.a.createElement(b.a,{activePanel:n,popout:g},c.a.createElement(D,{id:"home",fetchedUser:s,go:function(e){o(e.currentTarget.dataset.to)}}))};u.a.send("VKWebAppInit"),i.a.render(c.a.createElement(M,null),document.getElementById("root"))}},[[127,1,2]]]);
//# sourceMappingURL=main.fac7cf82.chunk.js.map