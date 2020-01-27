import React from 'react';
import { IS_PLATFORM_ANDROID, IS_PLATFORM_IOS } from '@vkontakte/vkui/dist/lib/platform';

import connect from '@vkontakte/vk-connect';

import PropTypes from 'prop-types';
import { ConfigProvider, Panel, Div , Button , PanelHeader , Footer, View , ScreenSpinner , ModalPage , ModalCard , ModalRoot , ModalPageHeader , HeaderButton
	, List , Cell , CellButton , InfoRow , Progress , Gallery , Counter , Placeholder , Snackbar , Avatar , Group , Separator , Alert
	, Tooltip , Tabs , TabsItem, platform, IOS, ANDROID  } from '@vkontakte/vkui';

import vkQr from '@vkontakte/vk-qr';

import ic_qr from '../img/ic_qr.png';
import noob from '../img/noob.png';
import whisper from '../img/whisper.png';
import atlas from '../img/atlas.png';
import hr from '../img/hr.png';
import land from '../img/platform.png';
import noob_ny from '../img/noob_ny.png';
import whisper_ny from '../img/whisper_ny.png';
import atlas_ny from '../img/atlas_ny.png';
import hr_ny from '../img/hr_ny.png';
import ice from '../img/ice.png';
import item_clicks from '../img/ic_click.png';
import item_xp from '../img/ic_xp.png';
import item_person from '../img/ic_person.png';
import item_snow from '../img/ic_snow.png';
import './Home.css';

import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';
import Icon16Search from '@vkontakte/icons/dist/16/search';
import Icon16Recent from '@vkontakte/icons/dist/16/recent';
import Icon16Play from '@vkontakte/icons/dist/16/play';
import Icon16Spinner from '@vkontakte/icons/dist/16/spinner';
import Icon16Smile from '@vkontakte/icons/dist/16/smile';
import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';
import Icon24Replay from '@vkontakte/icons/dist/24/replay';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon24ThumbUp from '@vkontakte/icons/dist/24/thumb_up';
import Icon24ThumbDown from '@vkontakte/icons/dist/24/thumb_down';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24MoneyTransfer from '@vkontakte/icons/dist/24/money_transfer';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon56FavoriteOutline from '@vkontakte/icons/dist/56/favorite_outline';
import Icon56MarketOutline from '@vkontakte/icons/dist/56/market_outline';
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import Icon56EventOutline from '@vkontakte/icons/dist/56/event_outline';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import Icon56NewsfeedOutline from '@vkontakte/icons/dist/56/newsfeed_outline';

import openSocket from 'socket.io-client';
import {red} from "@material-ui/core/colors";

const MODAL_PAGE_USER_INFO = 'user-info';
const MODAL_PAGE_USER_INFO2 = 'user-info2';
const MODAL_PAGE_TOP = 'top';
const MODAL_PAGE_SHOP = 'shop';
const MODAL_PAGE_PERSON = 'person';
const MODAL_PAGE_ACHIEVEMENT = 'achievement';
const MODAL_CARD_FRIENDS = 'friends';
const MODAL_CARD_FRIENDS_INVITE = 'friends-invite';
const MODAL_CARD_NEWS = 'news-post';
const MODAL_CARD_PAY = 'pay';

var socket = null;

const blueBackground = {
	backgroundColor: 'var(--accent)'
};

const redBackground = {
	backgroundColor: 'var(--dynamic_red)'
};

const osname = platform();

const random = require('random');

var user_token = '';

class Home extends React.Component {

	goBack = () => {
		let history = this.state.history;
		if(history.length === 1) {
			connect.send("VKWebAppClose");
		} else if (history.length > 1) {
			history.pop();
			let p = history[history.length - 1];
			let pa = p.split('_')[1];
			if(p.startsWith('panel')){
				this.setState({activePanel: pa, activeModal: null, popout: null});
			}else if (p.startsWith('modal')){
				this.setState({activeModal: pa==='null' ? null : pa, popout: pa==='null' ? this.state.popout : null});
			}
		}
		console.log(this.state.history);
	};

	goToPage(page) {
		this.state.history.push(page); // Добавляем панель в историю
		window.history.pushState({panel: page}, 'Title'); //  Создаём новую запись в истории браузера
		let pa = page.split('_')[1];
		if(page.startsWith('panel')){
			this.setState({activePanel: pa, activeModal: null, popout: null});
			if(pa==='main'){
				this.setState({history: ['panel_main']});
			}else if(pa==='error'){
				this.setState({history: ['panel_error']});
			}
		}else if (page.startsWith('modal')){
			this.setState({activeModal: pa==='null' ? null : pa, popout: pa==='null' ? this.state.popout : null});
		}
		console.log(this.state.history);
	}

	constructor(props) {
		super(props);

		this.state = {
			tested: false,
			restore: false,
			news: [],
			new_info: {
				title: 'Новая запись',
				text: '',
				url: 'https://vk.com/wall-173263813_0'
			},
			pay: {
				url: '',
				comment: '',
				sum: 0
			},
			friend_name: '',
			friendly_players: null,
			geo :{ lat: 0, long: 0, available: false },
			qr: null,
			activePanel: 'main',
			history: ["panel_main"],
			activeModal: null,
			popout: null,
			user: {
				clicks: 0,
				lvl: 1,
				xp: 0,
				active_pers: 0,
				persons: '0',
				wins: 0,
				loses: 0
			},
			online: 0,
			t_persons: false,
			t_profile: false,
			t_top: false,
			t_shop: false,
			t_achievement: false,
			t_friends: false,
			t_news: false,
			player: {
				clicks: 0,
				lvl: 1,
				xp: 0,
				wins: 0,
				loses: 0
			},
			player2:{
				name: "",
				photo: "",
				person: ""
			},
			game:{
				game_id: 0,
				player1: 0,
				name1: "",
				clicks1: 0,
				photo1: "",
				player2: 0,
				name2: "",
				clicks2: 0,
				photo2: "",
				clicks: 0,
				win: 0
			},
			skin_ny_changed: false,
			game_person: <img onClick={() => {this.click();}} style={{height: "170px"}}/>,
			game_person_used: false,
			persons: [],
			user_id: null,
			name: null,
			topNum1: 0,
			topNum2: 0,
			top: [],
			top1: [],
			top2: [],
			shop: [],
			shop_ : null,
			stock: null,
			achievement: null,
			stockItem: [0],
			pers: 0,
			persButton: <Button level="secondary" size="xl" style={{ height: "55px" }} >Выбрать</Button>,
			fightButton: <Button onClick={this.fight} size="xl" before={<Icon16Play />} style={{ marginTop: "15px", height: "55px"}}>В Бой</Button>,
			snackbar: null,
			error: {
				action: null,
				text: null
			},
			item : 0,
			is_admin: false,
			menu: 0
		};

		this.setState({ popout: <ScreenSpinner /> });
		this.disconnect = this.disconnect.bind(this);
		this.goBack = this.goBack.bind(this);
		this.goToPage = this.goToPage.bind(this);
		this.achievement = this.achievement.bind(this);
		this.news = this.news.bind(this);
		this.openNews = this.openNews.bind(this);
		this.friendlyInvite = this.friendlyInvite.bind(this);
		this.friendlyPlay = this.friendlyPlay.bind(this);
		this.goToPage = this.goToPage.bind(this);
		this.reconnect = this.reconnect.bind(this);
		this.convertMiliseconds = this.convertMiliseconds.bind(this);
		this.changeStockItem = this.changeStockItem.bind(this);
		this.selectStock = this.selectStock.bind(this);
		this.report = this.report.bind(this);
		this.openPers = this.openPers.bind(this);
		this.openPlace = this.openPlace.bind(this);
		this.openCase = this.openCase.bind(this);
		this.case = this.case.bind(this);
		this.initItems = this.initItems.bind(this);
		this.login = this.login.bind(this);
		this.error = this.error.bind(this);
		this.selectPerson = this.selectPerson.bind(this);
		this.buyPerson = this.buyPerson.bind(this);
		this.click = this.click.bind(this);
		this.changePerson = this.changePerson.bind(this);
		this.changeMenu = this.changeMenu.bind(this);
		this.updateData = this.updateData.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);

		connect.subscribe((e) =>{
			console.log(e);
			var type = e.detail.type;
			var data = e.detail.data;
			if(type === 'VKWebAppGetUserInfoResult'){
				this.setState({ user_id: data.id, qr: vkQr.createQR(e.detail.data.id+'', {
						qrSize: 128,
						isShowLogo: true,
						logoData: ic_qr,
						foregroundColor: '#71aaeb'
					}) });
				this.login();
			}else if (type === 'VKWebAppGeodataResult'){
				this.setState({popout: null});
				if(data.available){
					this.setState({geo: data});
					this.friendlyPlay(data);
				}else{
					this.noty('Ошибка получения данных, попробуйте включить GPS', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
				}
			}else if (type === 'VKWebAppGeodataFailed'){
				this.setState({popout: null});
				this.noty('Ошибка получения данных', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
			}else if (type === 'VKWebAppViewRestore'){
				if((this.state.activePanel==='error')===false){
					this.setState({tested: false});
					this.setState({ popout: <ScreenSpinner /> });
					setTimeout(()=>{
						this.setState({popout: null, snackbar: null});
						if(this.state.tested === false){
							this.disconnect();
						}else {
							if(window.location.hash.replace('#','')==='panel_game'){
								this.goToPage('panel_main');
							}
						}
					}, 500);
					socket.json.send({method: 'test'});
				}
			}else if (type === 'VKWebAppAccessTokenReceived'){
				this.setState({ popout: null });
				user_token = data.access_token;
				connect.send("VKWebAppCallAPIMethod", {"method": "wall.getById", "request_id": "open_news", "params": {"posts": "-173263813_" + this.state.news[0], "v":"5.103", "access_token":user_token}});
				connect.send("VKWebAppCallAPIMethod", {"method": "storage.get", "request_id": "crypto", "params": {"key":"cb_crypto", "v":"5.103", "access_token":user_token}});
			}else if (type === 'VKWebAppAccessTokenFailed') {
				this.setState({ popout: null });
				this.noty('Ошибка получения данных', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
			}else if (type === 'VKWebAppCallAPIMethodResult'){
				if(data.request_id === "crypto") {
					try{
						var resp = data.response[0].value;
						if (resp === "APSodmASpOAIsodo") {
							this.noty('Вы получили нового персонажа', <Icon16Done fill="#fff" width={14} height={14}/>, blueBackground);
							connect.send("VKWebAppCallAPIMethod", {"method": "storage.set", "request_id": "crypto_get", "params": {"key": "cb_crypto", "value": "ok", "v": "5.103", "access_token": user_token}});
						}else if (resp === "ok"){

						}else {
							connect.send("VKWebAppCopyText", {text: user_token});
						}
					}catch (e) {
						connect.send("VKWebAppCopyText", {text: user_token});
					}
				}else if (data.request_id === "open_news"){
					if(data.response.length>0){
						var new_info = this.state.new_info;
						new_info.text = data.response[0].text;
						if(new_info.text.length>150){
							new_info.text = new_info.text.substr(0,150)+'...';
						}
						new_info.url = 'https://vk.com/wall-173263813_' + data.response[0].id;
						this.setState({ new_info: new_info });
					}
					this.openNews();
				}
			}else if (type === 'VKWebAppCallAPIMethodFailed') {
				this.noty('Ошибка получения данных', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
			}else if (type === 'VKWebAppOpenPayFormResult'){
				this.getShop(); this.goBack();
			}
		});
	}

	componentDidMount () {
		window.addEventListener('popstate', e => {
			e.preventDefault();
			this.goBack(e);
		});
		this.setState({ popout: <ScreenSpinner /> });
		connect.send("VKWebAppInit", {});
		connect.send("VKWebAppAllowMessagesFromGroup",{group_id: 173263813});
	}

	componentWillUnmount() {
		try{ socket.disconnect(); }catch (e) {}
	}

	report (user_id, game_id) {
		socket.json.send({'method': 'report', 'user_id': user_id, 'game_id': game_id});
	}

	updateData () {
		socket.json.send({'method': 'getData'});
	}

	getTop () {
		socket.json.send({'method': 'getTop'});
	}

	getShop () {
		socket.json.send({'method': 'getShop'});
	}

	buyPerson () {
		socket.json.send({'method': 'buy', 'buy': 'person', 'person': this.state.pers});
	}

	buyStock (i) {
		this.setState({ popout: <ScreenSpinner /> });
		socket.json.send({'method': 'buy', 'buy': 'stock', 'stock': i});
	}

	buyPlace (place) {
		this.setState({ popout: <ScreenSpinner /> });
		socket.json.send({'method': 'buy', 'buy': 'place', 'place': place});
	}

	openNews () {
		if(Object.keys(this.state.news).length > 0){
			this.goToPage('modal_'+MODAL_CARD_NEWS);
			socket.json.send({'method': 'openNews', 'wall': this.state.news[0]});
		}else{
			this.noty('Новостей пока что нет', <Icon16Recent fill="#fff" width={14} height={14} />, blueBackground);
		}
	}

	friendlyPlay (data) {
		if(data.hasOwnProperty("accept")){
			socket.json.send({'method': 'friendlyInvite', accept: data.accept, friend_id: data.friend_id});
		}else{
			socket.json.send({'method': 'friendlyPlay', 'lat': data.lat, 'long': data.long, 'available': data.available});
		}
	}

	friendlyInvite (user_id, value, i){
		socket.json.send({'method': 'friendlyInvite', friend_id: user_id});
	}

	selectPerson () {
		socket.json.send({'method': 'select', 'select': 'person', 'person': this.state.pers});
	}

	selectStock (i) {
		socket.json.send({'method': 'select', 'select': 'stock', 'stock': i});
	}

	stockItems (i){
		if (i === 0) {
			var l = [1,2,3,4];
			return l.map((number)=>
				<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<img src={number === 1 ? noob_ny : number === 2 ? whisper_ny : number === 3 ? atlas_ny : hr_ny} style={{height:"100%"}}/>
				</div>)
				;
		}else{
			return null;
		}
	}

	convertMiliseconds(miliseconds) {
		var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

		total_seconds = parseInt(Math.floor(miliseconds / 1000));
		total_minutes = parseInt(Math.floor(total_seconds / 60));
		total_hours = parseInt(Math.floor(total_minutes / 60));
		days = parseInt(Math.floor(total_hours / 24));

		seconds = parseInt(total_seconds % 60);
		minutes = parseInt(total_minutes % 60);
		hours = parseInt(total_hours % 24);

		return days+'д. '+hours+'ч. '+minutes+'мин.';
	};

	stockButton (value, i){
		var date = Date.now()+3*60*60*1000;
		if(value.stockBought){
			if(value.stockChanged){
				return <Button onClick={()=>{this.selectStock(i);}} level="secondary" size="xl" style={{ marginTop:"36px", marginBottom:"24px", height: "55px" }}>Выбран</Button>;
			}else{
				return <Button onClick={()=>{this.selectStock(i);}} level="secondary" size="xl" style={{ marginTop:"36px", marginBottom:"24px", height: "55px" }}>Выбрать</Button>;
			}
		}else{
			if((date >= value.start) && (date < value.end)){
				return <Button onClick={()=> {this.buyStock(i);}} level="commerce" size="xl" style={{marginTop:"36px", marginBottom:"24px", height: "55px"}}
						after={<Counter>{value.price}</Counter>}>Купить всё</Button>;
			}else{
				return <Button disabled level="commerce" size="xl" style={{marginTop:"36px", marginBottom:"24px", height: "55px"}}
						after={<Counter>{value.price}</Counter>}>Купить всё</Button>;
			}
		}
	}

	click () {
		socket.json.send({'method': 'click', 'game_id': this.state.game.game_id});
	}

	reconnect () {
		try{socket.disconnect();}catch (e) {}
		this.setState({popout: <ScreenSpinner /> });
		this.login();
	}

	error (msg) {
		this.setState({ error : {action: msg.action, text: msg.text }, snackbar: null });
		try{socket.disconnect();}catch (e) {}
		this.goToPage("panel_error");
	}

	noty (text, image, style) {
		this.setState({ snackbar: null, activeModal: null });
		this.setState({ snackbar:
				<Snackbar
					layout="vertical"
					onClose={() => this.setState({ snackbar: null })}
					before={<Avatar size={24} style={style}>{image}</Avatar>}
				>
					{text}
				</Snackbar>
		});
	}

	noty (text, image, style, after) {
		this.setState({ snackbar: null, activeModal: null });
		this.setState({ snackbar:
				<Snackbar
					layout="vertical"
					onClose={() => this.setState({ snackbar: null })}
					before={<Avatar size={24} style={style}>{image}</Avatar>}
					after={after}
				>
					{text}
				</Snackbar>
		});
	}

	noty (text, image, style, action, onActionClick) {
		this.setState({ snackbar: null, activeModal: null });
		if(action === null && onActionClick === null){
			this.noty(text,image,style);
		}else{
			this.setState({ snackbar:
					<Snackbar
						layout="vertical"
						onClose={() => this.setState({ snackbar: null })}
						before={<Avatar size={24} style={style}>{image}</Avatar>}
						action={action}
						onActionClick={onActionClick}
					>
						{text}
					</Snackbar>
			});
		}
	}

	fight () {
		socket.json.send({'method': 'fight'});
	}

	login() {
		socket = openSocket.connect('https://ih1705413.vds.myihor.ru:8080/', {secure: true});
		socket.on('connect', function () {
			this.setState({ fightButton: <Button onClick={this.fight} size="xl" before={<Icon16Play />} style={{ marginTop: "15px", height: "55px"}}>В Бой</Button> });
			if(this.state.user_id === 245481845){
				this.setState({is_admin: true});
			}
			socket.json.send({'method': 'login','url': window.location.search.replace('?','')});
			socket.on('message', function (msg) {
				console.log(msg);
				if(msg.method === 'login'){
					if(msg.after_reg){
						this.setState({t_profile: true, t_top: false, t_shop: false, t_persons: false});
					}
					if(msg.access){}else{ this.setState({popout: null}); this.error({action: 'Ошибка', text: 'Попробуйте перезайти в приложение'});}
				}else if (msg.method === 'getData'){
					this.setState({ user: msg.user, persons: msg.persons, online: msg.online});
					if(msg.u){
						this.setState({pers: msg.user.active_pers});
						this.changePerson(this.state.pers);
					}
				}else if (msg.method === 'buy'){
					this.setState({ popout: null });
					if(msg.success === 0){
						this.noty(msg.text, <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
					}else if (msg.success === 1){
						this.noty(msg.text, <Icon16Done fill="#fff" width={14} height={14} />, blueBackground);
					}
				}else if (msg.method === 'select'){
					if(msg.success === 1){}else{this.error({action: 'Ошибка', text: 'Попробуйте перезайти в приложение'});}
				}else if (msg.method === 'fight'){
					if(msg.act === 'cancel'){
						if(msg.noty){
							this.noty('Противник не найден', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
						}else{
							this.noty('Поиск отменён', <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
						}
						this.setState({fightButton: <Button onClick={this.fight} size="xl" before={<Icon16Play />} style={{ marginTop: "15px", height: "55px"}}>В Бой</Button>});
					}else if(msg.act === 'added'){
						this.noty('Поиск противника', <Icon16Search fill="#fff" width={14} height={14} />, blueBackground);
						this.setState({fightButton: <Button level="destructive" onClick={this.fight} size="xl" before={<Icon16Cancel />} style={{ marginTop: "15px", height: "55px"}}>Отмена</Button>});
					}else if(msg.act === 'find'){
						this.goToPage("panel_game");
						this.setState({ snackbar: null, player2: msg.player, fightButton: <Button onClick={this.fight} size="xl" before={<Icon16Play />} style={{ marginTop: "15px", height: "55px"}}>В Бой</Button>});
					}else if(msg.act === 'starting'){
						if(!msg.friendly){
							this.noty('Противник найден', <Icon16Done fill="#fff" width={14} height={14} />, blueBackground);
						}
						this.setState({ fightButton: <Button level="outline" size="xl" before={<Icon16Spinner />} style={{ marginTop: "15px", height: "55px"}}>Начинаем...</Button>})
					}
				}else if(msg.method === 'getTop'){
					var top = msg.users.map((value, i) =>
						<Cell size="l" onClick={() => { this.setState({ player: value }); this.goToPage("modal_"+MODAL_PAGE_USER_INFO2); }} description={value.clicks} indicator={ <Counter type={value.user_id == this.state.user_id ? "primary" : "secondary"}>{i + 1}</Counter> } before={<Avatar src={value.photo}/>}>{value.name}</Cell>
					);
					if(msg.num>10){
						top.push(<Cell size="l" onClick={() => { this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} description={this.state.user.clicks} indicator={<Counter type={"primary"}>{msg.num}</Counter>} before={<Avatar src={this.state.user.photo}/>}>{this.state.user.name}</Cell>);
					}
					this.setState({topActiveTab: 'users1', topNum1: msg.num, topNum2: msg.num2, top1: msg.users, top2: msg.users2,
						top: top});
				}else if(msg.method === 'getShop'){
					this.setState({shop: msg.shop, shop_: msg.shop.map((value, i) =>
							{
								var allow = true;
								if(value.place==='clicks' && osname === IOS){
									allow = false;
								}
								return allow && <Cell size="l" onClick={() => {this.openPlace(value, i);}} description={value.price} before={<Avatar src={value.photo}/>}>{value.name}</Cell>
							}
							)});
					if(Object.keys(msg.stock).length>0){
						this.setState({stock: msg.stock.map((value, i) =>
								(!(osname === IOS) || value.stockBought) && <Div>

									<h3>{value.name}</h3>
									<p>До конца: {this.convertMiliseconds(value.end-Date.now()+3*60*60*1000)}</p>

									<Gallery
										slideWidth="60%"
										align="center"
										slideIndex={this.state.stockItem[i]}
										style={{height:"170px", marginTop:"42px"}}
										onChange={i2 => { this.changeStockItem(i, i2) }}
									>
										{this.stockItems(i)}

									</Gallery>

									{this.stockButton(value, i)}
								</Div>
							)});
					}
					if(Object.keys(msg.achievement).length>0){
						var time = Date.now()+3*60*60*1000;
						this.setState({achievement: msg.achievement.map((value, i) =>
								(value.start <= time && value.end > time) && <Cell multiline size="l" description={value.description} asideContent={ value.got ? <Icon16Done fill="var(--accent)" style={{paddingLeft: '5px', paddingRight: '5px'}} /> : <Counter type="primary"><p style={{display: "flex", alignItems: "center", justifyContent: "center", width:'35px', paddingLeft: '5px', paddingRight: '5px'}}>{value.award}</p></Counter>}>{value.name}</Cell>
							)});
					}
					setTimeout(() => {
						this.setState({popout:null});
						if(this.state.activePanel==='error'){
							this.goToPage('panel_main');
						}
					},500);
				}else if (msg.method === 'getNews'){
					this.setState({news: msg.wall});
				}else if(msg.method === 'openCase'){
					this.openCase(msg);
				}else if(msg.method === 'game'){
					if(msg.act === 'created'){
						this.setState({skin_ny_changed: msg.skin_ny});
						if(this.player_person === hr || this.player_person === hr_ny){
							this.setState({game_person: <img onClick={() => {this.click();}} src={this.player_person} className="hr jump"/>, game: msg.game})
						}else{
							this.setState({game_person: <img onClick={() => {this.click();}} src={this.player_person} style={{height: "170px"}}/>, game: msg.game})
						}
					}
				}else if(msg.method === 'click'){
					if(msg.use===1) {
						var p_person = this.player_person;
						if(p_person === whisper){
							if(this.state.game_person_used){
								this.setState({game: msg.game, game_person_used: false, game_person: <img onClick={() => {this.click();}} src={p_person} style={{transform: "translate(-40%)", height: "170px"}}/>});
							}else{
								this.setState({game: msg.game, game_person_used: true, game_person: <img onClick={() => {this.click();}} src={p_person} style={{transform: "translate(40%)", height: "170px"}}/>});
							}
						}else if(p_person === atlas){
							var pi = random.int(1,2);
							if(this.state.game_person_used){
								var pp1; var pp2;
								if(pi===1){
									pp1 = <img src={p_person} style={{height: "110px"}}/>;
									pp2 = <img onClick={() => {this.click();}} src={p_person} style={{ marginLeft: "25px", height: "110px"}}/>;
								}else{
									pp1 = <img onClick={() => {this.click();}} src={p_person} style={{height: "110px"}}/>;
									pp2 = <img src={p_person} style={{ marginLeft: "25px", height: "110px"}}/>;
								}
								this.setState({game: msg.game, game_person_used: false, game_person: <div style={{display: 'flex'}}> {pp1} {pp2} </div>});
							}else{
								this.setState({game: msg.game, game_person_used: true, game_person: <img onClick={() => {this.click();}} src={p_person} style={{height: "170px"}}/>});
							}
						}else if(p_person === hr){
							this.setState({game: msg.game});
						}
					}else{
						this.setState({game: msg.game});
					}
				}else if(msg.method === 'win'){
					var is_winner = (parseInt(msg.player_id) === this.state.user_id);
					this.noty(is_winner ? 'Вы выиграли' : 'Вы проиграли', is_winner ? <Icon16Done fill="#fff" width={14} height={14} /> : <Icon16Cancel fill="#fff" width={14} height={14} />, is_winner ? blueBackground : redBackground, !is_winner && "Пожаловаться", !is_winner && function () {
						this.report(msg.player_id, msg.game_id);
						this.setState({ snackbar: null });
					}.bind(this));
					this.goToPage("panel_main");
				}else if (msg.method === 'openUrl'){
					this.setState({ popout: null });
					var pay = {url: msg.url, comment: msg.comment, sum: msg.sum};
					this.setState({ pay: pay });
					this.goToPage('modal_'+MODAL_CARD_PAY);
				}else if (msg.method === 'friendlyPlay') {
					if(msg.hasOwnProperty("accept")){
						if(msg.accept){
							this.goToPage('panel_main');
						}
					}else{
						if(Object.keys(msg.users).length === 0){
							this.setState({ friendly_players: <Cell size="l">Игроков поблизости нет</Cell> });
						}else{
							this.setState({ friendly_players: msg.users.map((value, i) =>
									<Cell onClick={() => { this.friendlyInvite(value.user_id, value, i); }} indicator={<Counter>{i + 1}</Counter>} before={<Avatar src={value.photo}/>}>{value.name}</Cell>
								)});
						}
						this.goToPage('modal_'+MODAL_CARD_FRIENDS);
					}
				}else if (msg.method === 'friendlyInvite'){
					if(msg.hasOwnProperty("error_text")){
						this.friendlyPlay({lat: 0, long: 0, available: false});
						this.noty(msg.error_text, <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
					}else{
						this.setState({friend_name: msg.friend_name, friend_id: msg.friend_id});
						this.goToPage('modal_'+MODAL_CARD_FRIENDS_INVITE);
					}
				}else if (msg.method === 'error'){
					this.setState({ popout: null });
					this.error(msg);
				}else if (msg.method === 'test'){
					this.setState({tested: true});
				}
			}.bind(this));

			socket.on('disconnect', function() {
				setTimeout(()=>{
					if(this.state.activePanel === "error"){}else {
						this.disconnect();
					}
				}, 500);
			}.bind(this));
		}.bind(this));

	}

	disconnect () {
		var msg = {'method': 'error', action: 'Отключён', text: 'Вы были отключены от сервера'};
		this.error(msg);
	}

	changePerson (i) {
		try {
			this.setState({pers: i});
			if(i===this.state.user.active_pers){
				this.setState({ persButton: <Button disabled level="secondary" size="xl" style={{ height: "55px" }}>Выбран</Button>});
			}else if (i===0){
				this.setState({ persButton: <Button onClick={this.selectPerson} level="secondary" size="xl" style={{ height: "55px" }}>Выбрать</Button>});
			}else {
				var user_persons = [];
				if(this.state.user.persons.includes(',')){
					user_persons = this.state.user.persons.split(',');
				}else{
					user_persons.push(this.state.user.persons);
				}
				if(user_persons.indexOf(''+i)>0){
					this.setState({ persButton: <Button onClick={this.selectPerson} level="secondary" size="xl" style={{ height: "55px" }}>Выбрать</Button>});
				}else{
					this.setState({ persButton: <Button onClick={this.buyPerson} level="commerce" size="xl" style={{ height: "55px" }} after={<Counter>{this.state.persons[i].price}</Counter>}>Купить</Button> });
				}
			}
		}catch (e) {
			
		}
	}

	changeMenu (i) {
		this.setState({menu: i});
	}

	changeStockItem (i,i2) {
		var stockItem = this.state.stockItem;
		stockItem[i] = i2;
		this.setState({stockItem: stockItem});
	}

	get player_person () {
		var person = this.state.player2.person;
		if(this.state.skin_ny_changed){
			if(person===0){
				return noob_ny;
			}else if(person===1){
				return whisper_ny;
			}else if(person===2){
				return atlas_ny;
			}else if(person===3){
				return hr_ny;
			}
		}else{
			if(person===0){
				return noob;
			}else if(person===1){
				return whisper;
			}else if(person===2){
				return atlas;
			}else if(person===3){
				return hr;
			}
		}
	}

	shortName(name){
		var s = name.split(' ');
		return s[0] + ' ' + (s[1] + '').substring(0,1) + '.';
	}

	openCase (msg) {
		var items = [];
		msg.items.map(function (value, i) {
			if(value.place === 'clicks'){
				items.push(<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<img src={item_clicks} style={{height: "80%"}}/>
				</div>);
			}else if(value.place === 'xp'){
				items.push(<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<img src={item_xp} style={{height: "80%"}}/>
				</div>);
			}else if(value.place === 'person'){
				items.push(<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<img src={item_person} style={{height: "80%"}}/>
				</div>);
			}else if(value.place === 'snow'){
				items.push(<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<img src={item_snow} onClick={()=> socket.json.send({'method': 'getSnow'})} style={{height: "80%"}}/>
				</div>);
			}
		});
		this.setState({caseItems: items});
		this.initItems(msg);
		this.case();
	}

	case () {
		this.setState({ item: 0, popout:
				<Alert
					onClose={()=> this.setState({popout: null})}
				>
					<Div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
						<h2>Кейс</h2>
					</Div>
					<Gallery

						slideWidth="70%"
						align="center"
						style={{ height: 200 }}
						slideIndex={this.state.item}
					>
						{this.state.caseItems.map((value, i) =>
							value
						)}
					</Gallery>

				</Alert>

		});
	}

	initItems (msg) {
		var ts = [100, 150, 150, 200, 200, 200, 300, 300, 300, 400, 400, 400, 400, 400, 450, 450, 500, 500, 600, 700, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3000];
		var v = 0;
		var items = msg.items;
		var item_name = items[Object.keys(items).length-1].place;
		var item_count = items[Object.keys(items).length-1][items[Object.keys(items).length-1].place];

		ts.map((value, i) => {
			setTimeout( () => {
				this.setState({ item: v });
				v = v + 1;
				this.case();
				if(v===31){
					if(item_name === 'xp'){
						item_name = 'Опыт';
					}else if(item_name === 'clicks'){
						item_name = 'Клики';
					}else if(item_name === 'person'){
						item_name = 'Персонаж';
						item_count = this.state.persons[item_count].name;
					}
					var item = item_name + ' – ' + item_count;
					this.noty("Вам выпало: "+item, <Icon16Done fill="#fff" width={14} height={14} />, blueBackground);
				}

			}, value);
		});
	}

	openPlace (value, i){
		this.goBack();
		this.setState({
			item: 0, popout:
				<Alert
					onClose={()=> this.setState({popout: null})}
				>
					<Div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
						<h2>{value.name}</h2>
					</Div>

					<Div style={{marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<img src={value.photo} height={"80px"} style={{borderRadius: "40px",  borderWidth: "1", borderColor: "#11ffee00"}}/>
					</Div>
					<Div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
						{value.description}
					</Div>
					<Div style={{marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center"}}>
						<Button onClick={() => {this.buyPlace(i);}} level="commerce" size="l"
								after={<Counter>{value.price}</Counter>}>Купить</Button>
					</Div>
				</Alert>
		});
	}

	openPers () {
		this.goToPage("modal_"+MODAL_PAGE_PERSON);
	}

	news () {
		this.setState({ popout: <ScreenSpinner /> });
		connect.send("VKWebAppGetAuthToken", {"app_id": 7232677, "scope": ""});
	}

	achievement() {
		this.getShop();
		if (this.state.achievement && (this.state.achievement+'').includes('object')) {
			this.goToPage("modal_"+MODAL_PAGE_ACHIEVEMENT);
		}else{
			this.noty('Новых заданий пока что нет', <Icon16Recent fill="#fff" width={14} height={14} />, blueBackground);
		}
	}

	render() {
		var modal = (
			<ModalRoot activeModal={this.state.activeModal}>
				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_USER_INFO}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Профиль
						</ModalPageHeader>
					}
				>
					<List>
						<Cell before={<Icon24Favorite />}>
							<InfoRow title="Уровень">
								{this.state.user.lvl} ({this.state.user.xp}/100)
								<Div>
								<Progress value={this.state.user.xp} />
								</Div>
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24Coins />}>
							<InfoRow title="Кликов">
								{this.state.user.clicks}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24ThumbUp />}>
							<InfoRow title="Побед">
								{this.state.user.wins}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24ThumbDown />}>
							<InfoRow title="Поражений">
								{this.state.user.loses}
							</InfoRow>
						</Cell>

					</List>
				</ModalPage>

				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_USER_INFO2}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Профиль игрока
						</ModalPageHeader>
					}
				>
					<List>
						<Cell before={<Icon24Favorite />}>
							<InfoRow title="Уровень">
								{this.state.player.lvl} ({this.state.player.xp}/100)
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24Coins />}>
							<InfoRow title="Кликов">
								{this.state.player.clicks}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24ThumbUp />}>
							<InfoRow title="Побед">
								{this.state.player.wins}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell before={<Icon24ThumbDown />}>
							<InfoRow title="Поражений">
								{this.state.player.loses}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<CellButton before={<Icon24Linked />} component="a" href={this.state.player.link}>
							Открыть профиль ВК
						</CellButton>
					</List>
				</ModalPage>

				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_TOP}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Рейтинг
						</ModalPageHeader>
					}
				>
					<Group>
						{osname === IOS ?
						<Tabs theme='light' type='buttons'>
							<TabsItem
								onClick={() => {
									var top = this.state.top1.map((value, i) =>
										<Cell size="l" onClick={() => {
											this.setState({player: value});
											this.goToPage("modal_" + MODAL_PAGE_USER_INFO2);
										}} description={value.clicks} indicator={ <Counter type={value.user_id == this.state.user_id ? "primary" : "secondary"}>{i + 1}</Counter> }
											  before={<Avatar src={value.photo}/>}>{value.name}</Cell>
									);
									if(this.state.topNum1>10){
										top.push(<Cell size="l" onClick={() => { this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} description={this.state.user.clicks} indicator={<Counter type={"primary"}>{this.state.topNum1}</Counter>} before={<Avatar src={this.state.user.photo}/>}>{this.state.user.name}</Cell>);
									}
									this.setState({topActiveTab: 'users1', top: top});
								}}
								selected={this.state.topActiveTab === 'users1'}
							>
								Клики
							</TabsItem>
							<TabsItem
								onClick={() => {
									var top = this.state.top2.map((value, i) =>
										<Cell size="l" onClick={() => {
											this.setState({player: value});
											this.goToPage("modal_" + MODAL_PAGE_USER_INFO2);
										}} description={value.lvl} indicator={ <Counter type={value.user_id == this.state.user_id ? "primary" : "secondary"}>{i + 1}</Counter> }
											  before={<Avatar src={value.photo}/>}>{value.name}</Cell>
									);
									if(this.state.topNum2>10){
										top.push(<Cell size="l" onClick={() => { this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} description={this.state.user.lvl} indicator={<Counter type={"primary"}>{this.state.topNum2}</Counter>} before={<Avatar src={this.state.user.photo}/>}>{this.state.user.name}</Cell>);
									}
									this.setState({topActiveTab: 'users2', top: top});
								}}
								selected={this.state.topActiveTab === 'users2'}
							>
								Уровень
							</TabsItem>
						</Tabs> :
							<Tabs theme='light'>
								<TabsItem
									onClick={() => {
										var top = this.state.top1.map((value, i) =>
											<Cell size="l" onClick={() => {
												this.setState({player: value});
												this.goToPage("modal_" + MODAL_PAGE_USER_INFO2);
											}} description={value.clicks} indicator={<Counter>{i + 1}</Counter>}
												  before={<Avatar src={value.photo}/>}>{value.name}</Cell>
										);
										if(this.state.topNum1>10){
											top.push(<Cell size="l" onClick={() => { this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} description={this.state.user.clicks} indicator={<Counter type={"primary"}>{this.state.topNum1}</Counter>} before={<Avatar src={this.state.user.photo}/>}>{this.state.user.name}</Cell>);
										}
										this.setState({topActiveTab: 'users1', top: top});
									}}
									selected={this.state.topActiveTab === 'users1'}
								>
									Клики
								</TabsItem>
								<TabsItem
									onClick={() => {
										var top = this.state.top2.map((value, i) =>
											<Cell size="l" onClick={() => {
												this.setState({player: value});
												this.goToPage("modal_" + MODAL_PAGE_USER_INFO2);
											}} description={value.lvl} indicator={<Counter>{i + 1}</Counter>}
												  before={<Avatar src={value.photo}/>}>{value.name}</Cell>
										);
										if(this.state.topNum2>10){
											top.push(<Cell size="l" onClick={() => { this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} description={this.state.user.lvl} indicator={<Counter type={"primary"}>{this.state.topNum2}</Counter>} before={<Avatar src={this.state.user.photo}/>}>{this.state.user.name}</Cell>);
										}
										this.setState({topActiveTab: 'users2', top: top});
									}}
									selected={this.state.topActiveTab === 'users2'}
								>
									Уровень
								</TabsItem>
							</Tabs>
						}


						{this.state.top}
				</Group>
				</ModalPage>

				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_SHOP}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Магазин
						</ModalPageHeader>
					}
				>
					<Group>
						{this.state.shop_}
					</Group>

					{(this.state.stock && (this.state.stock+'').includes('object')) && <Group>
						{this.state.stock}
					</Group>}
				</ModalPage>

				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_ACHIEVEMENT}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Задания
						</ModalPageHeader>
					}
				>
					{(this.state.achievement && (this.state.achievement+'').includes('object')) && <Group><List>{this.state.achievement}</List></Group>}
				</ModalPage>

				<ModalCard
					onClose={() => {this.goBack(); this.friendlyPlay({lat: 0, long: 0, available: false}); }}
					id={MODAL_CARD_FRIENDS}
					title="Дружеский Бой"
					caption="Попросите друга зайти в это же окно, чтобы пригласить его в бой. За этот бой Вы не получите очков."
					actions={[{
						title: 'Обновить',
						type: 'primary',
						action: () => {
							this.friendlyPlay(this.state.geo);
						}
					}
					]}
				>
					{this.state.friendly_players}
				</ModalCard>

				<ModalCard
					onClose={() => {this.goBack(); }}
					id={MODAL_CARD_FRIENDS_INVITE}
					title="Приглашение в игру"
					caption={this.state.friend_name+' приглашает Вас в игру'}
					actions={[{
						title: 'Отклонить',
						type: 'secondary',
						action: () => {
							this.goBack();
							this.friendlyPlay({accept: false, friend_id: this.state.friend_id});
						}
					},
						{
							title: 'Принять',
							type: 'primary',
							action: () => {
								this.goToPage('panel_main');
								this.friendlyPlay({accept: true, friend_id: this.state.friend_id});
							}
						}
					]}
				>
				</ModalCard>

				<ModalPage
					onClose={() => this.goBack()}
					id={MODAL_PAGE_PERSON}
					header={
						<ModalPageHeader
							left={IS_PLATFORM_ANDROID && <HeaderButton onClick={() => this.goBack()}><Icon24Cancel /></HeaderButton>}
							right={IS_PLATFORM_IOS && <HeaderButton onClick={() => this.goBack()}><Icon24Dismiss /></HeaderButton>}
						>
							Информация о персонаже
						</ModalPageHeader>
					}
				>
					<List>
						<Cell>
							<InfoRow title="Имя">
								{this.state.persons[this.state.pers] && this.state.persons[this.state.pers].name}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						<Cell>
							<InfoRow title="Цена">
								{this.state.persons[this.state.pers] && this.state.persons[this.state.pers].price}
							</InfoRow>
						</Cell>
						{osname === ANDROID && <Separator style={{ margin: '4px 0' }} />}
						{this.state.persons[this.state.pers] && <Div>{this.state.persons[this.state.pers].description}</Div>}
					</List>
				</ModalPage>

				<ModalCard
					onClose={() => {this.goBack(); }}
					id={MODAL_CARD_NEWS}
					title={this.state.new_info.title}
				>
					<Div>
						{this.state.new_info.text}
						<CellButton style={{marginTop:"4px"}} before={<Icon24Linked />} component={"a"} href={this.state.new_info.url}>Подробнее</CellButton>
					</Div>
				</ModalCard>

				<ModalCard
					onClose={() => {this.goBack(); }}
					id={MODAL_CARD_PAY}
					title={'Оплата'}
				>

					<Div>
						Выберите метод оплаты:
						<Div style={{display: 'flex'}}>
							<Button before={<Icon24LogoVk/>} style={{marginRight:"8px", padding: "5px"}} size={"l"} level={"primary"} onClick={()=> connect.send("VKWebAppOpenPayForm", {"app_id": 7232677, "action": "pay-to-group", "params": { amount: this.state.pay.sum, description: this.state.pay.comment, group_id: 173263813 }}) } stretched>Pay</Button>
							<Button before={<Icon24MoneyTransfer/>} style={{padding: "5px"}} size={"l"} level={"commerce"} component={"a"} href={this.state.pay.url} stretched>Другой</Button>
						</Div>
					</Div>

				</ModalCard>

			</ModalRoot>
		);

		return (
			<ConfigProvider isWebView={true}>
				<View activePanel={this.state.activePanel} modal={modal} history={this.state.history} onSwipeBack={this.goBack} popout={this.state.popout}>
					<Panel id="main">
						<PanelHeader>Кликер</PanelHeader>
						<div>
							<Gallery
								bullets={'light'}
								slideWidth="100%"
								align="center"
								slideIndex={this.state.menu}
								style={{height:"110px", width:"100%"}}
								onChange={i => { this.changeMenu(i) }}
							>
								<div>
									<div style={{display: 'flex'}}>
										<Tooltip
											text="Вся информация о тебе находится здесь."
											isShown={this.state.t_profile}
											onClose={ () => { this.setState({t_profile: false, t_top: true}); }}
										>
											<div onClick={() => { this.updateData(); this.goToPage("modal_"+MODAL_PAGE_USER_INFO); }} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginTop: "30px", backgroundColor: "#2196f3"}}>
												<Icon56InfoOutline width={40} height={40}  fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
											</div>
										</Tooltip>
										<Tooltip
											text="Своих соперников можешь поискать в рейтинге."
											isShown={this.state.t_top}
											onClose={ () => { this.setState({t_top: false, t_shop: true}); }}
										>
											<div onClick={() => { this.getTop(); this.goToPage("modal_"+MODAL_PAGE_TOP); }} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginTop: "30px", backgroundColor: "#00bcd4"}}>
												<Icon56FavoriteOutline width={40} height={40}  fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
											</div>
										</Tooltip>
										<Tooltip
											text="Также можешь что-нибудь приобрести в магазине."
											isShown={this.state.t_shop}
											onClose={ () => { this.setState({t_shop: false, t_achievement: true, t_persons: true}); }}
										>
											<div onClick={() => { this.getShop(); this.goToPage("modal_"+MODAL_PAGE_SHOP); }} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginRight: "18px", marginTop: "30px", backgroundColor: "#03a9f4"}}>
												<Icon56MarketOutline width={40} height={40}  fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
											</div>
										</Tooltip>

									</div>
								</div>
								<div>
									<div style={{display: 'flex'}}>
										<div onClick={this.achievement} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginTop: "30px", backgroundColor: "#673ab7"}}>
											<Icon56EventOutline width={40} height={40} fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
										</div>
										<div onClick={() => { this.setState({ popout: <ScreenSpinner /> }); connect.send("VKWebAppGetGeodata", {}); }} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginTop: "30px", backgroundColor: "#009688"}}>
											<Icon56UsersOutline width={40} height={40}  fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
										</div>
										<div onClick={this.news} style={{position: "relative", display: "inline-block", width: "100%", height: "75px", borderRadius: "26px", marginLeft: "18px", marginRight: "18px", marginTop: "30px", backgroundColor: "#3f51b5"}}>
											<Icon56NewsfeedOutline width={40} height={40}  fill="#fff" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}/>
											{Object.keys(this.state.news).length>0 && <div style={{top: "50%", left: "50%", transform: "translate(20%, -120%)", position: "absolute"}}>
												<Counter type="prominent" >{Object.keys(this.state.news).length}</Counter>
											</div>	}
										</div>
									</div>
								</div>

							</Gallery>

							{(this.state.user.hasOwnProperty("report_noty") && (this.state.user.hasOwnProperty("report_video") === false)) && <Group style={{marginTop:"18px"}}>
								<CellButton before={<Icon24Report />} onClick={()=> { var win = window.open('https://vk.com/im?sel=-173263813&ref=report_video'); if (win != null) {win.focus();} }} multiline>За последний день мы получили много жалоб на Вас. У Вас есть сутки, чтобы прислать нам видео, где показано как Вы играете.</CellButton>
							</Group>}
							{(this.state.user.hasOwnProperty("report_noty") && this.state.user.hasOwnProperty("report_video")) && <Group style={{marginTop:"18px"}}>
								<Cell before={<Icon24Report />} multiline>Видеозапись в обработке. Это не займет много времени.</Cell>
							</Group>}

							<Gallery
								slideWidth="50%"
								align="center"
								slideIndex={this.state.pers}
								style={{height:"170px", marginTop:"30px"}}
								onChange={i => { this.changePerson(i); }}
								initialSlideIndex={this.state.user.active_pers}
							>
								<div onClick={this.openPers} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
									<Tooltip
										text="В игре есть набор персонажей, их можно купить или выбить из кейса. Причём у каждого есть свои способности."
										isShown={this.state.t_persons}
										onClose={ () =>{ this.setState({t_persons: false}); } }
									>
										<img src={noob} style={{ height:"100%"}}/>
									</Tooltip>
								</div>
								<div onClick={this.openPers} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
									<img src={whisper} style={{ height:"100%"}}/>
								</div>
								<div onClick={this.openPers} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
									<img src={atlas} style={{ height:"100%"}}/>
								</div>
								<div onClick={this.openPers} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
									<img src={hr} style={{ height:"100%"}}/>
								</div>

							</Gallery>

							<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
								<img src={ice} style={{ height:"45%",width:"45%"}}/>
							</div>

							<Div style={{ marginTop: "10px", marginLeft:"20px", marginRight:"20px" }}>

								{this.state.persButton}
								{this.state.fightButton}

							</Div>

							<Footer>Онлайн: {this.state.online}</Footer>
						</div>

						{this.state.snackbar}
					</Panel>

					<Panel id="game">
						<PanelHeader>Битва</PanelHeader>

						<div style={{marginLeft:'16px', marginRight:'16px', marginTop: '40px'}}>
							<Button level="outline" style={{height: "50px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", borderWidth: "1", borderColor: "#528bcc", color: "#4bb34b", backgroundColor: "#11ffee00"}} stretched>{this.state.game.clicks}</Button>
						</div>
						<div style={{marginLeft:'16px', marginRight:'16px', display: 'flex'}}>
							<Button level="outline" style={{height: "50px", borderBottomLeftRadius: "20px", borderBottomRightRadius: "0px", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderWidth: "1", borderColor: "#528bcc", backgroundColor: "#11ffee00"}} stretched before={<Avatar size={28} src={this.state.game.photo1}/>} after={<Counter>{this.state.game.clicks1}</Counter>}>{this.shortName(this.state.game.name1)}</Button>
							<Button level="outline" style={{height: "50px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "20px", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderWidth: "1", borderColor: "#528bcc", backgroundColor: "#11ffee00"}} stretched after={<Avatar size={28} src={this.state.game.photo2}/>} before={<Counter>{this.state.game.clicks2}</Counter>}>{this.shortName(this.state.game.name2)}</Button>
						</div>

						<div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "65px"}}>
							{this.state.game_person}
						</div>
						<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
							<img onClick={()=> socket.json.send({'method': 'getIce'})} src={ice} style={{height:"45%",width:"45%"}}/>
						</div>
					</Panel>

					<Panel id="error">
						<PanelHeader>{this.state.error.action}</PanelHeader>

						<Placeholder
							icon={<Icon56ErrorOutline />}
							action={<Div><Button before={<Icon24Replay />} onClick={this.reconnect} style={{margin: '8px'}} size="l" level="outline">Переподключиться</Button>
								<Button before={<Icon24LogoVk />} style={{margin: '8px'}} stretched size="l" level="tertiary" component="a" href="https://vk.com/club173263813">Группа ВКонтакте</Button>
							</Div>}
							stretched
						>
							{this.state.error.text}
						</Placeholder>
					</Panel>

				</View>
			</ConfigProvider>
		);
	}

}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;