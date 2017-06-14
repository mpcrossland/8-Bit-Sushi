import React from 'react';
import firebase from './firebase.js';
import Replies from './replies.js';


// const dbRef = firebase.database().ref(`/`)


export default class Cards extends React.Component{
	constructor(){
		super();
		this.state = {
			feedback:[]

		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.remove = this.remove.bind(this);
	}
	handleChange(e){
		this.setState ({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e){
		e.preventDefault();
		// console.log(this.props.userId)
		const dbRef = firebase.database().ref(`/${this.props.blogKey}/replies`)
		const feedback = {
			// likes: this.state.likes,
			reply: this.state.reply,
			replyUserPhoto: this.props.user.photoURL,
			displayName: this.props.user.displayName
		}

		this.setState({
			reply:'',              //This resets the state back to empty, so fucking cool!
			replies: []
		});

		dbRef.push(feedback);  //pushing replies and user info to FB in an object, in the original post object

	}
	remove(index){
		const replyState = Array.from(this.state.replies);
		replyState.splice(index,1);
		this.setState({
			replies : replyState
		});
	}
	render(){
		// console.log("this.props", this.props); {/* getting photo and comments */ }
		// console.log ('this.state', this.state); { getting reply and likes  }
		// console.log('blahblah', this.props.displayName); 
		return(
			<div className="postCard">
				<div><img className="avatar" src={this.props.googleAvatar} /></div>
				<div className="cardHeader"> 
					<h2>{this.props.googleName}</h2>
					<div> 
						<a href=""><i className="fa fa-heart-o fa-lg"></i></a>
						<a href=""><i className="fa fa-bookmark-o fa-lg"></i></a>
					</div>
				</div>
				<div className="imgContainer">
					<img className="uploadedPhoto" src={this.props.photo} />
				</div>
				<div className="comment">{this.props.comment}</div>

				<section className="reply">
					{this.state.feedback.map((item,i) => {
							return <Replies 
										reply={item.reply}
										remove={this.remove}
										key={item.replyKey}
										index={i}
										name={item.userName}
										avatar={item.userPhotoURL}
										/>
					}).reverse()}
					<div className="replyContainer">
						<form onSubmit={this.handleSubmit}> <img className="loggedInUserAvatar"src={this.props.user.photoURL} />
							<textarea name='reply' className="textReply" placeholder="Reply to this" value={this.state.reply} type="text" onChange={this.handleChange} />
							<input type="submit" className="post" value="Add" />
						</form>
					</div>
				</section>			
			</div>
		)
	}
	componentDidMount(){
		const dbRef = firebase.database().ref(`/${this.props.blogKey}/replies`);
		dbRef.on('value', (fbReplyData) => {
			const dbReplies = fbReplyData.val();
			const newReplies = [];
			// console.log(dbReplies)
			for(let replyKey in dbReplies) {
				newReplies.push({
					replyKey : replyKey,
					reply : dbReplies[replyKey].reply,
					userName: dbReplies[replyKey].displayName,
					userPhotoURL: dbReplies[replyKey].replyUserPhoto
				});
			}
			this.setState({
				feedback: newReplies
			});
			// console.log(this.state)
		});
	}
}

//usersItem = {
	// item: thi.state.item,
	// name: this.state.name



