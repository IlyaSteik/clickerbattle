(window.webpackJsonpclickerbattle=window.webpackJsonpclickerbattle||[]).push([[0],{135:function(e,t,a){e.exports=a(270)},242:function(e,t){},270:function(e,t,a){"use strict";a.r(t);a(136),a(162),a(164),a(165),a(167),a(168),a(169),a(170),a(171),a(172),a(173),a(174),a(176),a(177),a(178),a(179),a(180),a(181),a(182),a(183),a(184),a(185),a(187),a(188),a(189),a(190),a(191),a(192),a(193),a(194),a(195),a(196),a(197),a(198),a(199),a(200),a(201),a(202),a(203),a(204);var n=a(0),c=a.n(n),o=a(33),r=a.n(o),i=a(26),l=a.n(i),s=a(82),u=a.n(s),m=a(125),p=a(63),d=a(50),h=a.n(d),b=a(61),f=a.n(b),E=(a(213),a(126)),v=a(37),g=a(127),j=a(128),O=a(16),w=a(132),y=a(289),k=a(130),A=a.n(k),I=a(81),x=a.n(I),B=a(293),K=a(291),N=a(292),P=a(294),S=a(129),V=a.n(S),W=Object(y.a)((function(e){return{card:{maxWidth:100,controls:{display:"flex",alignItems:"center",paddingLeft:e.spacing(1),paddingBottom:e.spacing(1)}}}})),z=function(e){function t(e){var a;return Object(E.a)(this,t),(a=Object(g.a)(this,Object(j.a)(t).call(this,e))).state={activePanel:"main",popout:null},a.login=a.login.bind(Object(O.a)(a)),a.componentDidMount=a.componentDidMount.bind(Object(O.a)(a)),l.a.send("VKWebAppInit",{}),a}return Object(w.a)(t,e),Object(v.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({popout:c.a.createElement(f.a,null)}),setTimeout((function(){e.login()}),100)}},{key:"login",value:function(){var e=V.a.connect("https://ih1705413.vds.myihor.ru:8080/",{secure:!0});e.on("connect",function(){e.json.send({method:"login",url:window.location.search.replace("?","")}),e.on("message",function(e){"login"===e.method&&e.access&&this.setState({popout:null}),console.log(e)}.bind(this))}.bind(this))}},{key:"render",value:function(){var e=W();return c.a.createElement(h.a,{popout:this.state.popout},c.a.createElement(h.a,{activePanel:this.state.activePanel},c.a.createElement(A.a,{id:"main"},c.a.createElement(x.a,null,"VK App"),c.a.createElement("div",{className:e.controls},c.a.createElement(B.a,{className:e.card},c.a.createElement(N.a,null,c.a.createElement(K.a,null,c.a.createElement(P.a,{gutterBottom:!0,variant:"h5",component:"h2"},"Lizard")))),c.a.createElement(B.a,{className:e.card},c.a.createElement(N.a,null,c.a.createElement(K.a,null,c.a.createElement(P.a,{gutterBottom:!0,variant:"h5",component:"h2"},"Lizard")))),c.a.createElement(B.a,{className:e.card},c.a.createElement(N.a,null,c.a.createElement(K.a,null,c.a.createElement(P.a,{gutterBottom:!0,variant:"h5",component:"h2"},"Lizard"))))))))}}]),t}(c.a.Component),L=function(){var e=Object(n.useState)("home"),t=Object(p.a)(e,2),a=t[0],o=t[1],r=Object(n.useState)(null),i=Object(p.a)(r,2),s=i[0],d=i[1],b=Object(n.useState)(c.a.createElement(f.a,{size:"large"})),E=Object(p.a)(b,2),v=E[0],g=E[1];Object(n.useEffect)((function(){function e(){return(e=Object(m.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.sendPromise("VKWebAppGetUserInfo");case 2:t=e.sent,d(t),g(null);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}l.a.subscribe((function(e){var t=e.detail,a=t.type,n=t.data;if("VKWebAppUpdateConfig"===a){var c=document.createAttribute("scheme");c.value=n.scheme?n.scheme:"client_light",document.body.attributes.setNamedItem(c)}})),function(){e.apply(this,arguments)}()}),[]);return c.a.createElement(h.a,{activePanel:a,popout:v},c.a.createElement(z,{id:"home",fetchedUser:s,go:function(e){o(e.currentTarget.dataset.to)}}))};l.a.send("VKWebAppInit"),r.a.render(c.a.createElement(L,null),document.getElementById("root"))}},[[135,1,2]]]);
//# sourceMappingURL=main.2dfaf9df.chunk.js.map