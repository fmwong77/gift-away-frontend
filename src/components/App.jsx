import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import 'semantic-ui-css/semantic.min.css';
import { connect } from 'react-redux';

import NavBar from './NavBar';
// import Footer from '../components/Footer';
import Login from '../components/Login';
import Home from '../components/Home';
import SignUp from './SignUp';
import PostDetails from './PostDetails';
import PostBrowser from './PostBrowser';
import ChangePassword from './ChangePassword';
import NewPost from './NewPost';
import CommentContainier from './CommentContainer';

class App extends Component {
	render() {
		console.log(this.props.isSignedIn);
		console.log(this.props.username);
		return (
			<Router history={browserHistory}>
				<div className="app">
					<NavBar render={(routeProps) => <NavBar {...routeProps} />} />
					<Route exact path="/home" component={Home} />
					<Route exact path="/sign-up" component={SignUp} />
					<Route exact path="/sign-in" component={Login} />
					<Route
						exact
						path="/post-details/:id"
						render={(props) => <PostDetails {...props} />}
					></Route>
					<Route exact path="/new-post">
						{!this.props.isSignedIn ? (
							<Redirect to="/sign-in?redirect=post-browser" />
						) : (
							<NewPost />
						)}
					</Route>
					<Route exact path="/post-browser">
						{!this.props.isSignedIn ? (
							<Redirect to="/sign-in?redirect=post-browser" />
						) : (
							<PostBrowser type={'view'} />
						)}
					</Route>
					<Route
						exact
						path="/comments/:id"
						component={(props) => <CommentContainier {...props} />}
					></Route>
					<Route
						exact
						path="/manage-my-post"
						component={() => <PostBrowser type={'manage'} />}
					/>
					<Route exact path="/change-password">
						{this.props.isSignedIn ? (
							<ChangePassword />
						) : (
							<Redirect to="/sign-in" />
						)}
					</Route>
					{/* <Footer /> */}
				</div>
			</Router>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSignedIn: state.user.isSignedIn,
		username: state.user.username
	};
};
export default connect(mapStateToProps)(App);
