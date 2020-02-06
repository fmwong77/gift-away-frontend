import React from 'react';
import { signUp, userSignup } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import swal from 'sweetalert';
import {
	Button,
	Form,
	Grid,
	Header,
	Message,
	Segment
	// Icon
} from 'semantic-ui-react';

function SignUp(props) {
	const counter = useSelector((state) => state.counter);
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	// const set_user = (user) => {
	// 	dispatch(signUp(user));
	// 	dispatch(userSignup(user));
	// };

	const handleSubmit = (e) => {
		e.preventDefault();

		const username = e.target.username.value;
		const password = e.target.password.value;
		const password_confirmation = e.target.password_confirmation.value;
		console.log('hello');

		console.log(username);
		console.log(password);
		console.log(password_confirmation);

		if (username.length === 0 || password.length === 0) {
			swal('Oops!', 'Username or password cannot be blank...', 'error');
		} else if (password !== password_confirmation) {
			swal('Oops!', 'Your password does not match...', 'error');
		} else {
			let data = {
				username: username,
				password: password,
				password_confirmation: password_confirmation
			};

			const configObject = {
				method: 'POST',
				mode: 'cors',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			};

			fetch('http://127.0.0.1:3000/api/v1/users/', configObject)
				.then((response) => response.json())
				.then((object) => {
					console.log(object.user);
					if (object.user) {
						swal(`Welcome ${username}!`, 'Thank you for signing up', 'success');
						localStorage.setItem('token', object.jwt);
						dispatch(
							signUp({
								username: object.user.username
							})
						);
						props.history.push('/item-details');
					} else {
						swal(
							'Oops!',
							`Username ${username} already exists! Please try another username`,
							'error'
						);
					}
				});
		}
	};

	return (
		<div className="card">
			{/* <br></br> */}
			<br></br>
			<br></br>
			<Message
				attached
				header="Welcome to our site!"
				content="Fill out the form below to sign-up for a new account"
			/>
			<Grid textAlign="center" verticalAlign="middle">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h2" color="teal" textAlign="center">
						{/* <img src="/static/images/logo.png" alt="logo" className="image" />{' '} */}
						{/* Sign-up a new account */}
					</Header>
					<Form size="large" onSubmit={(event) => handleSubmit(event)}>
						<Segment stacked>
							<Form.Input
								fluid
								icon="user"
								iconPosition="left"
								placeholder="Username"
								name="username"
								// ref={(input) => (this.inputtext = input)}
							/>
							<Form.Input
								fluid
								icon="lock"
								iconPosition="left"
								placeholder="Password"
								type="password"
								name="password"
							/>
							<Form.Input
								fluid
								icon="lock"
								iconPosition="left"
								placeholder="Confirm Password"
								type="password"
								name="password_confirmation"
							/>
							<Button color="teal" fluid size="large" type="submit">
								Sign Up
							</Button>
						</Segment>
					</Form>
				</Grid.Column>
			</Grid>
		</div>
	);
}

export default SignUp;
