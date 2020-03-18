/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Grid } from 'semantic-ui-react';
import { getCategories, postInfo } from '../actions';
import Map from './Map';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import ReactS3 from 'react-s3';

const NewPost = (props) => {
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.categories);
	const info = useSelector((state) => state.postInfo);
	const user = useSelector((state) => state.user);
	const coordinate = useSelector((state) => state.map);
	const token = localStorage.getItem('token');

	useEffect(() => {
		getCat();
	}, []);

	const config = {
		bucketName: 'gift-away',
		region: 'us-east-2',
		accessKeyId: '',
		secretAccessKey: ''
	};

	const getCat = async () => {
		const response = await fetch(
			'https://gift-away-backend.herokuapp.com/api/v1/categories',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		const data = await response.json();

		dispatch(getCategories(data));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const title = e.target.title.value;
		const description = e.target.description.value;

		if (title.length === 0 || description.length === 0) {
			Swal.fire({
				title: 'Oops!',
				text: 'Title or description cannot be blank...',
				icon: 'error',
				confirmButtonText: 'Ok'
			});
		}
		// debugger;

		console.log(info.image.size);
		if (info.image.size > 250000) {
			Swal.fire({
				title: 'Oops!',
				text: 'Image file size is too big to upload...',
				icon: 'error',
				confirmButtonText: 'Ok'
			});
		}

		ReactS3.uploadFile(info.image, config)
			.then((data) => {
				console.log(data);

				let postData = {
					title: title,
					description: description,
					category_id: info.category_id,
					user_id: user.id,
					latitude: coordinate.lat,
					longitude: coordinate.lng,
					image_url: data.location
				};

				const token = localStorage.getItem('token');

				const configObject = {
					method: 'POST',
					mode: 'cors',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(postData)
				};
				fetch(
					'https://gift-away-backend.herokuapp.com/api/v1/posts/',
					configObject
				)
					.then((response) => response.json())
					.then((object) => {
						if (object) {
							console.log(object);
						}
					});
				props.history.push('/manage-my-post');
			})

			.catch((err) => console.log(err));
	};

	const handleOnChange = (e) => {
		if (e.target.type === 'file') {
			dispatch(postInfo({ image: e.target.files[0] }));
		}
	};

	return (
		<div className="App">
			<Grid textAlign="center" verticalAlign="middle">
				<Grid.Column style={{ maxWidth: 850 }}>
					<br></br>
					<br></br>
					<br></br>
					<Form color="green" onSubmit={(event) => handleSubmit(event)}>
						<Form.Field>
							<label>Title</label>
							<input placeholder="Title" name="title" />
						</Form.Field>
						<Form.Field>
							<label>Description</label>
							<textarea
								placeholder="Tell us more"
								rows="3"
								name="description"
							></textarea>
						</Form.Field>
						<Form.Select
							fluid
							label="Category"
							name="category"
							options={categories.categories.map((cat) => {
								return {
									key: cat.id,
									text: cat.category,
									value: cat.id
								};
							})}
							placeholder="Select a Category"
							onChange={(e, { value }) =>
								dispatch(postInfo({ category_id: value }))
							}
						/>
						<label>Files</label>

						<input
							type="file"
							multiple
							name="image_files"
							onChange={(e) => handleOnChange(e)}
						/>

						<div style={{ margin: '100px' }}>
							<label>Pick-up Location</label>
							<Map
								// google={this.props.google}
								center={{
									lat: 30.266666,
									lng: -97.73333
								}}
								height="300px"
								zoom={15}
							/>
						</div>

						<Button color="teal" fluid size="large" type="submit">
							Save and Post
						</Button>
					</Form>
				</Grid.Column>
			</Grid>
		</div>
	);
};

export default withRouter(NewPost);
