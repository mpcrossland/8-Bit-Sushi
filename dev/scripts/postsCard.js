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
	}
	handleChange(e){
		this.setState ({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e){
		e.preventDefault();
		const dbRef = firebase.database().ref(`/${this.props.blogKey}/replies`)
		const feedback = {
			// likes: this.state.likes,
			reply: this.state.reply,
			replyUserPhoto: this.props.user.photoURL 
		}

		this.setState({
			reply:''              //This resets the state back to empty, so fucking cool!
		});

		dbRef.push(feedback);  //pushing replies to FB in an object, in the original post object

	}
	render(){
		// console.log("this.props", this.props); {/* getting photo and comments */ }
		// console.log ('this.state', this.state); {/* getting reply and likes */ }
		// console.log('blahblah', this.props.displayName); 
		console.log('lets find it', this.state.feedback.reply)
		return(
			<div className="postCard">
				<div><img className="avatar" src={this.props.photoURL} /></div>
				<div className="cardHeader"> 
					<h2>{this.props.displayName}</h2>
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
					<div className="replyContainer">
						<form onSubmit={this.handleSubmit}>
							<textarea name='reply' className="textReply" placeholder="Reply to this" value={this.state.reply} type="text" onChange={this.handleChange} />
							<input type="submit" className="post" value="Add" />
						</form>
					</div>
					{this.state.feedback.map((reply,i) => {
							return <Replies reply={this.state.feedback.reply} //photo={this.state.user.photoURL}
							 key={i} />
					}).reverse()}
					<p>THIS SHOULD BE MY REPLIES BUT ITS EMPTY ---> {this.state.feedback.reply} !!!</p>
				</section>
	{/*			<ul>
					{this.state.replies.map((reply) => {
						return (<li key={reply.key}>
							{reply.description}
							<a href onClick={ () => this.removeReply(reply.key)}><i class="fa fa-times" aria-hidden="true"></i></a>
							</li>)
						})}
					</ul>						*/}
			</div>
		)
	}
	componentDidMount(){
		const dbRef = firebase.database().ref(`/${this.props.blogKey}/replies`);
		dbRef.on('value', (fbReplyData) => {
			const dbReplies = fbReplyData.val();
			const newReplies = [];

			for(let replyKey in dbReplies) {
				newReplies.push({
					replyKey : replyKey,
					reply : dbReplies[replyKey].reply
				});
			}
			this.setState({
				feedback: newReplies
			});
		});
	}
}

//usersItem = {
	// item: thi.state.item,
	// name: this.state.name



