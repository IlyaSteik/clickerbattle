(window.webpackJsonpclickerbattle=window.webpackJsonpclickerbattle||[]).push([[0],{123:function(e,t,n){e.exports=n(256)},230:function(e,t){},256:function(e,t,n){"use strict";n.r(t);n(124),n(150),n(152),n(153),n(155),n(156),n(157),n(158),n(159),n(160),n(161),n(162),n(164),n(165),n(166),n(167),n(168),n(169),n(170),n(171),n(172),n(173),n(175),n(176),n(177),n(178),n(179),n(180),n(181),n(182),n(183),n(184),n(185),n(186),n(187),n(188),n(189),n(190),n(191),n(192);var a=n(2),c=n.n(a),o=n(70),i=n.n(o),r=n(19),u=n.n(r),s=n(72),l=n.n(s),p=n(115),d=n(52),m=n(40),b=n.n(m),h=n(51),f=n.n(h),v=(n(201),n(116)),j=n(117),O=n(121),g=n(118),E=n(39),w=n(122),y=n(120),k=n.n(y),A=n(71),I=n.n(A),K=n(119),P=n.n(K),S=function(e){function t(e){var n;return Object(v.a)(this,t),(n=Object(O.a)(this,Object(g.a)(t).call(this,e))).state={activePanel:"main",popout:null},n.login=n.login.bind(Object(E.a)(n)),n.componentDidMount=n.componentDidMount.bind(Object(E.a)(n)),u.a.send("VKWebAppInit",{}),n}return Object(w.a)(t,e),Object(j.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({popout:c.a.createElement(f.a,null)}),setTimeout((function(){e.login()}),100)}},{key:"login",value:function(){var e=P.a.connect("https://ih1705413.vds.myihor.ru:8080/",{secure:!0});e.on("connect",function(){e.json.send({method:"login",url:window.location.search.replace("?","")}),e.on("message",function(e){"login"===e.method&&e.access&&this.setState({popout:null}),console.log(e)}.bind(this))}.bind(this))}},{key:"render",value:function(){return c.a.createElement(b.a,{popout:this.state.popout},c.a.createElement(b.a,{activePanel:this.state.activePanel},c.a.createElement(k.a,{id:"main"},c.a.createElement(I.a,null,"VK App"))))}}]),t}(c.a.Component),V=function(){var e=Object(a.useState)("home"),t=Object(d.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)(null),r=Object(d.a)(i,2),s=r[0],m=r[1],h=Object(a.useState)(c.a.createElement(f.a,{size:"large"})),v=Object(d.a)(h,2),j=v[0],O=v[1];Object(a.useEffect)((function(){function e(){return(e=Object(p.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.sendPromise("VKWebAppGetUserInfo");case 2:t=e.sent,m(t),O(null);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}u.a.subscribe((function(e){var t=e.detail,n=t.type,a=t.data;if("VKWebAppUpdateConfig"===n){var c=document.createAttribute("scheme");c.value=a.scheme?a.scheme:"client_light",document.body.attributes.setNamedItem(c)}})),function(){e.apply(this,arguments)}()}),[]);return c.a.createElement(b.a,{activePanel:n,popout:j},c.a.createElement(S,{id:"home",fetchedUser:s,go:function(e){o(e.currentTarget.dataset.to)}}))};u.a.send("VKWebAppInit"),i.a.render(c.a.createElement(V,null),document.getElementById("root"))}},[[123,1,2]]]);
//# sourceMappingURL=main.86a5662c.chunk.js.map