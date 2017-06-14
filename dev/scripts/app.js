//create a form that gathers photo/location/title/text from user
// Store date into an object
// 


import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './postsCard.js';
import firebase from './firebase.js';


const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const dbRef = firebase.database().ref('/');



//we will need to dbRef.push ('USERINPUTS') to save the user inputs to firebase


class App extends React.Component {
	constructor(){
		super();
		this.state = {
			posts: [],
			loggedIn: false,
			user: null,
			userComment: '',
			userPhoto: '',
			reply: '',
			replies: [],
			likes: '',
			toggleModal: true,
			blogKey:''

		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
	}
	handleSubmit(e) {
		if(this.userPhoto === ''){
			alert ("You didn't submit a photo");
		} else {
			
		}
		e.preventDefault();
		const post = {
			userPhoto: this.state.userPhoto,
			userComment: this.state.userComment,
			googleName: this.state.user.displayName,
			googleAvatar: this.state.user.photoURL
		};
		console.log(post);
		const userId = this.state.user.uid;
		const userRef = firebase.database().ref();

		userRef.push(post);

		this.setState({
			userPhoto:'',
			userComment:''              //This resets the state back to empty, so fucking cool!
		});
	}
	handleChange(e){
		this.setState ({
			[e.target.name]: e.target.value
		});
	}
	uploadPhoto(e) {
		let file = e.target.files[0];
		// console.log('FILE-NAME in upload photo cmpnt. - ',file.name);
		const storageRef = firebase.storage().ref('userPhotos/' + file.name)
		const task = storageRef.put(file).then(() => {
			const urlObject = storageRef.getDownloadURL().then((data) => {
				this.setState ({userPhoto: data })
			})
		});
	}
	login() {
		auth.signInWithPopup(provider)
			.then((result) =>{
				const user = result.user;
				// console.log("user", user);
				this.setState({
					user: user,
					loggedIn: true,
					displayName: this.state.user.displayName,
					photoURL: this.state.user.photoURL
				})
			});
	}
	logout() {
		auth.signOut()
			.then(() => {
				this.setState({
					user: null,
					loggedIn: false,
					posts: []
				})
			});
	}
	toggleModal() {
		this.setState({
			toggleModal: !this.state.toggleModal
		})
	}
	render(){
		console.log('first post', this.state)
		const showProperMenu = () => {
			if (this.state.loggedIn === true) {
				return(
					<div className="day">
						<header>
							<div className="nav">
								<div className="sushiLogo">
									<img className="logo" src='./images/sush.png' />
								</div>
								<div className="welcomeContainer">
									<div className="sushi">WELCOME TO 8-BIT SUSHI</div>
								</div>
								<ul className="loggingInAs">
									<li className="name">You are Logged-In as <em>{this.state.user.displayName}</em></li>
									<li><img className="loggedInUserAvatar"src={this.state.user.photoURL} /> </li>
								</ul>
								<ul>
									<li><button className="uploadButton" onClick={this.toggleModal}>Upload a Photo</button></li>
									<li><button className="logOut" onClick={this.logout}>Log-Out</button></li>
 								</ul>
							</div>
						</header>
						<div className={`modalContainer ${this.state.toggleModal ? 'show' : 'hide'}`} ref={ref => this.modalContainer = ref}>
							<button onClick={this.toggleModal}><i className="fa fa-times fa-lg"></i></button>
							<p><strong>Upload your photo</strong></p>
							<div className="doggyDiv">
								<img className="dog" src='/images/dog.gif' />
							</div>
							<form onSubmit={this.handleSubmit} className="postSubmit">
								<div className="userForm">
									<input type="file" name="userPhoto" label="chooseFile" accept="image/*" onChange={this.uploadPhoto} />

									<textarea name="userComment" className="userComment" type="text" value={this.state.userComment} placeholder="Comment" onChange={this.handleChange}>
									</textarea>
									<input type="submit" className="post post1" value="Submit" />
								</div>
							</form>
						</div>
					</div>
				)
			}else{
				return(
					<div className="night">
						<div className="modal">
							<p className="welcome">WELCOME TO</p>
							<p className="sushi">8-BIT SUSHI</p>
							<img src="/images/1-bmyBSn5CFSsWs9r4jQ7RnQ.png" />
							<div className="signIn">
								<button className="signIn" onClick={this.login}>Sign in with Google</button>
							</div>
						</div>
					</div>
				)
			}
		}
		return(
			<div className="day">
					{showProperMenu()}
				<section className="cards"> 
					{this.state.posts.map((post, i) => {

						if (post.userComment) {
							// console.log(post);
							return <Cards user={this.state.user}
							blogKey={post.key}
							userId={post.userId}
							photo={post.photoURL}
							comment={post.userComment} 
							googleAvatar={post.googleAvatar}
							googleName={post.googleName} 
							 
							/>
						} else {
							// console.log(this.state.user.displayName);
							// console.log('photo', post.userComment)
						}
					}).reverse()}
				</section>
			</div>
		)
	}
	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			// console.log('USER',user)
			if(user){
				this.setState({
					user : user,
					loggedIn: true
				})
				const userId = user.uid;
				const userRef = firebase.database().ref();
				// console.log("user logged in", userId)
				// console.log(userRef, userRef[userId]);

				userRef.on('value', (snapshot) => {
					const users = snapshot.val();
					const allPosts = [];
					// for (let user in users) {
					for (let key in users) {
						const post = users[key];
						allPosts.push({
							key: key,
							userId: user,
							googleAvatar: post.googleAvatar,
							googleName: post.googleName,
							userComment: post.userComment,
							photoURL: post.userPhoto

						});
					}
					// }
					this.setState({
						posts: allPosts
					})
				});
			}else{
				this.setState({
					loggedIn: false,
					user: null
				})
			}


			
		})
	}
}	


ReactDOM.render(<App />, document.getElementById('app'));