import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import View from '@vkontakte/vkui/dist/components/View/View';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Epic from '@vkontakte/vkui/dist/components/Epic/Epic';
import Tabbar from '@vkontakte/vkui/dist/components/Tabbar/Tabbar';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';

import axios from 'axios';
import WebSocket from 'websocket';
import connect from '@vkontakte/vk-connect';

import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';
import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Reply from '@vkontakte/icons/dist/24/reply';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import Icon28More from '@vkontakte/icons/dist/28/more';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import openSocket from 'socket.io-client';

const blueBackground = {
  backgroundColor: 'var(--accent)'
};

const redBackground = {
  backgroundColor: 'var(--dynamic_red)'
};

class Home extends React.Component {
	
	constructor(props) {
		super(props);
	
		this.state = {
			activePanel: 'main',
			popout: null,
			snackbar: null,
			user_id: 0,
			bots: [],
			activeStory: 'feed',
		};
		
		this.openBase = this.openBase.bind(this);
		this.login = this.login.bind(this);
		this.getBots = this.getBots.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.onStoryChange = this.onStoryChange.bind(this);
		
		connect.send("VKWebAppInit", {});
	}
	
	componentDidMount () {
		this.setState({ popout: <ScreenSpinner /> });
		setTimeout(() => { this.login() }, 100);
	}
	
	login() {
		connect.sendPromise("VKWebAppGetUserInfo", {})
			.then(data => {
				this.setState({ user_id: data.id });
				this.getBots();
			})
			.catch(error => {
				console.log(error);
				this.setState({ popout: null });
			});

		const socket = openSocket.connect('https://193.124.188.159:8080', {secure: true});
		socket.on('connect', function () {
			socket.json.send({'method': 'params','params': window.location.search.replace('?','')});
			socket.on('message', function (msg) {
				console.log(msg);
			});
		});
	}
	
	getBots () {
		axios({
			method: 'get',
			url: "https://bots-vk-api.herokuapp.com/api",
			params: {
				method: 'getBots',
				user_id: this.state.user_id
			},
			headers: {'Content-Type': 'application/json'},
			responseType: 'json'
		}).then(function (response) {
			var error = response.data.error;
			console.log(response.data);
			if(error){
				this.openBase(response.data.error_msg, <Icon16Cancel fill="#fff" width={14} height={14} />, redBackground);
			}else{
				this.setState({ bots: response.data.bots });
			}
			this.setState({ popout: null });
		}.bind(this));
	}
	
	openBase (text, image, style) {
		this.setState({ snackbar: null });
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
	
	get bots () {
		if(this.state.bots===null || Object.keys(this.state.bots).length===0 ){
			return ;
		}else{
			return this.state.bots.map((value, i) => 
				<Cell before={<Avatar src={value.photo} />}>{value.title}</Cell>
			);
		}
	}
	
	onStoryChange (e) {
		this.setState({ activeStory: e.currentTarget.dataset.story })
	}
	
	render() {
		return (
		<Epic popout={this.state.popout} activeStory={this.state.activeStory} tabbar={
        <Tabbar>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'feed'}
            data-story="feed"
            text="Новости"
          ><Icon28Newsfeed /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'notifications'}
            data-story="notifications"
            text="Уведомлен."
          ><Icon28Notifications /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'more'}
            data-story="more"
            text="Ещё"
          ><Icon28More /></TabbarItem>
        </Tabbar>
      }>
        <View id="feed" activePanel="feed">
          <Panel id="feed">
            <PanelHeader>Feed</PanelHeader>
			<Group title="Боты">
					<List>
						<Cell before={<Icon16Add/>} component="a" href='https://vk.com/im?media=&sel=-189298925' >Добавить бота</Cell>
						{this.bots}
					</List>
			</Group>
				
			{this.state.snackbar}
          </Panel>
        </View>
        <View id="notifications" activePanel="notifications">
          <Panel id="notifications">
            <PanelHeader>Notifications</PanelHeader>
          </Panel>
        </View>
        <View id="more" activePanel="more">
          <Panel id="more">
            <PanelHeader>More</PanelHeader>
          </Panel>
        </View>
      </Epic>
		
		);
	}
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;
