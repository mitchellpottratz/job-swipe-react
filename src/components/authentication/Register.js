import React from 'react';

import { connect } from "react-redux";
import { registerUser } from '../../actions/users.js'

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import FileInput from '../common/FileInput.js';
import FormButton from '../common/FormButton.js';
import { Link } from 'react-router-dom';


class Register extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			image: '',
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			confirm_password: '',
			is_candidate_user: false,
			is_company_user: false,
			errorMessages: [],
			isLoading: false,
			hasRegistered: false
		}
	}


	handleTextInputChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}


	handleCheckBoxChange = (e) => {
		// makes sure only one check box is checked at the same time
		this.setState({
			is_candidate_user: false,
			is_company_user: false	
		});

		this.setState({ [e.target.name]: e.target.checked });
	}


	handleProfilePictureChange = (file) => {
		this.setState({ image: file });
	}


	handleSubmit = async (e) => {
		e.preventDefault();

		// so the buttons loading icon appears and error
    	// messages aren't duplicated
    	this.setState({ 
			isLoading: true, 
			errorMessages: []
	  	});
		
		this.checkPassword();
		this.checkOneCheckboxIsSelected();

		const userFormData = this.formatUserFormData();
		const response = await this.props.registerUser(userFormData);

		// hides the buttons loading icon
		this.setState({ isLoading: false });

		if (response.status.code === 201) {
			this.setState({ hasRegistered: true });
		}	
	}


	checkPassword = () => {
		const password = this.state.password;
		const confirmed_password = this.state.confirm_password;

		// show error message if the password is not atleast 8 characters long
		if (password.length < 8) {
			const passwordErrorMessages = [];
			passwordErrorMessages.push('Password must be atleast 8 characters long');

			// show error message if the passwords do not match
			if (password !== confirmed_password) {
				passwordErrorMessages.push('Passwords must match')

				this.setState({
					errorMessages: [...this.state.errorMessages, ...passwordErrorMessages]
				});
			}
		}
	}


	checkOneCheckboxIsSelected = () => {
		if ((this.state.is_candidate_user === false && this.is_company_user === false) |
				(this.state.is_candidate_user === true && this.is_company_user === true)) {
					this.setState({
						errorMessages: [...this.state.errorMessages, 'Only one checkbox may be selected.']
					});
		}
	}  


	// since the request body includes an image it needs to be formatted as form data
	formatUserFormData = () => {
		const userFormData = new FormData();

		userFormData.append('image', this.state.image, this.state.image.name);
		userFormData.append('first_name', this.state.first_name);
		userFormData.append('last_name', this.state.last_name);
		userFormData.append('email', this.state.email);
		userFormData.append('password', this.state.password);
		userFormData.append('confirm_password', this.state.confirm_password);
		userFormData.append('is_candidate_user', this.state.is_candidate_user);
		userFormData.append('is_company_user', this.state.is_company_user);

		return userFormData;
	}


	render() {

		// if the user has successfully registered a message pops up telling them
		// to confirm their email address
		if (this.state.hasRegistered) {
			return (
				<h2 className="text-center mt-4">Confirm Your Email Address</h2>
			)
		}

		return (
			<Row className="py-4">
				<Col></Col>

				<Col md={8} sm={12}>
					<Card>
						<Card.Body>
							<Card.Title>Register</Card.Title>

							{ this.state.errorMessages.map((message, i) => {
								return (
									<div key={ i }>
										<small className="text-danger">{ message }</small>
									</div>
								)
							}) }

							<Form 
								className="py-2" 
								onSubmit={ this.handleSubmit }
							>
								<Form.Group>
									<FileInput 
										handleFileUpload={ this.handleProfilePictureChange }
										notUploadedLabel="Upload Profile Picture"
										uploadedLabel="Profile Picture Uploaded"
										/>
								</Form.Group>
								<Row>
									<Col md={6} sm={12}>
										<Form.Group>
											<Form.Label>First Name</Form.Label>
											<Form.Control 
												required
												type="text"
												placeholder="First Name" 
												name="first_name"
												value={ this.state.first_name }
												onChange={ this.handleTextInputChange }
												/>
											</Form.Group>
										</Col>
									<Col md={6} sm={12}>
										<Form.Group>
											<Form.Label>Last Name</Form.Label>
											<Form.Control 
												required
												type="text"
												placeholder="Last Name" 
												name="last_name"
												value={ this.state.last_name }
												onChange={ this.handleTextInputChange }
												/>
											</Form.Group>
									</Col>
								</Row>

								<Form.Group>
									<Form.Label>Email</Form.Label>
									<Form.Control 
										required
										type="email" 
										placeholder="Email"
										name="email"
										value={ this.state.email }
										onChange={ this.handleTextInputChange }
										/>
								</Form.Group>

								<Row>
									<Col md={6} sm={12}>
										<Form.Group>
											<Form.Label>Password</Form.Label>
											<Form.Control 
												type="password"
												placeholder="Password" 
												name="password"
												value={ this.state.password }
												onChange={ this.handleTextInputChange }
												/>
												<small>Must be atleast 8 characters long</small>
											</Form.Group>
									</Col>
									<Col md={6} sm={12}>
										<Form.Group>
											<Form.Label>Confirm Password</Form.Label>
											<Form.Control 
												type="password"
												placeholder="Confirm Password" 
												name="confirm_password"
												value={ this.state.confirm_password }
												onChange={ this.handleTextInputChange }
												/>
											</Form.Group>
									</Col>
								</Row>

								<Form.Group>
									<Form.Check 
										type="checkbox" 
										label="Register as a candidate user" 
										name="is_candidate_user"
										checked={ this.state.is_candidate_user }
										onChange={ this.handleCheckBoxChange }
										/>
  							</Form.Group>

								<Form.Group>
									<Form.Check 
										type="checkbox" 
										label="Register as a company user" 
										name="is_company_user"
										checked={ this.state.is_company_user }
										onChange={ this.handleCheckBoxChange }
										/>
  							</Form.Group>

							<Form.Group>
								<FormButton
                      				text="Register"
                      				isLoading={ this.state.isLoading }
                      				variant="primary"
                    			/>
                  			</Form.Group> 
							</Form>
							<small>
                  				Already have an account? <Link to="/login">Login Here</Link>
                			</small> 
						</Card.Body>
					</Card>
				</Col>

				<Col></Col>
			</Row>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn
	}
}

export default connect(mapStateToProps, { registerUser })(Register);

