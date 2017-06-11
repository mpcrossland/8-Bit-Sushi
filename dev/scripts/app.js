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
			blogKey:''

		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
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
		};
		dbRef.push(post);
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
					loggedIn: false
				})
			});
	}

	render(){
		// console.log('first state', this.state)
		const showProperMenu = () => {
			if (this.state.loggedIn === true) {
				return(
					<div className="day">
						<header>
							<div className="nav">
								<img className="logo" src='./images/sush.png' />
								<ul>
									<li><search /></li>
									<li><button onClick={this.logout}>Log-Out</button></li>
									<li>Contact</li>
									<li>Home</li>
								</ul>
								<p>You are Logged-In as {this.state.user.displayName} </p> 
								<img className="avatar" src={this.state.user.photoURL} />
							</div>
						</header>
						<div className="uploadModal">
							<div className="modalContainer">
								<div className="doggyDiv">
									<img className="dog" src='/images/dog.gif' />
								</div>
								<form onSubmit={this.handleSubmit} className="postSubmit">
									<div className="userForm">
										<input type="file" name="userPhoto" className="chooseFile" accept="image/*" onChange={this.uploadPhoto} />

										<textarea name="userComment" className="userComment" type="text" value={this.state.userComment} placeholder="Comment" onChange={this.handleChange}>
										</textarea>
										<input type="submit" className="post post1" value="Submit" />
									</div>
								</form>
							</div>
						</div>
					</div>
				)
			}else{
				return(
					<div className="night">
							<div className="modal">
								<img className="logo" src='./images/sush.png' />
								<button onClick={this.login}>Log-In</button>
							<div className="signIn">
							<h1>You are not signed in!!!</h1>
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
							return <Cards user={this.state.user} comment={post.userComment} blogKey={this.state.blogKey} photo={post.userPhoto} displayName={this.state.user.displayName} photoURL={this.state.user.photoURL} />
						} else {
							// console.log(this.state.user.displayName);
							// console.log('photo', post.userComment)
						}
					})}
				</section>
			</div>
		)
	}
	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			if(user){
				this.setState({
					user : user,
					loggedIn: true
				})
				const userId = user.uid;
				// const userRef = firebase.database().ref('/');

				dbRef.on('value', (snapshot) => {
					const dbPosts = snapshot.val();
					const newPosts = [];
					for (let key in dbPosts) {
						newPosts.push({
							key: key,
							userPhoto: dbPosts[key].userPhoto,
							userComment: dbPosts[key].userComment

						});
					}
					const blogKey = newPosts[0].key;
					this.setState({
						posts: newPosts,
						blogKey: blogKey
					});
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