import React from 'react';
import firebase from './firebase.js';


const dbRef = firebase.database().ref('/');

console.log(firebase)
export default class Cards extends React.Component{
	constructor(){
		super();
		this.state = {
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		const feedback = {
			likes: this.state.likes,
			reply: this.state.reply,
		};
		dbRef.push(this.state.feedback);
		this.setState({
			reply:''              //This resets the state back to empty, so fucking cool!
		});
	}
	handleChange(e){
		this.setState ({
			[e.target.name]: e.target.value
		});
	}
	render(){
		// console.log("this.props", this.props); {/* getting photo and comments */ }
		// console.log ('this.state', this.state); {/* getting reply and likes */ }
		// console.log('blahblah', this.props.displayName); 
		return(
			<div className="postCard">
				<div><img className="avatar" src={this.props.photoURL} /> </div> 
				<h2>{this.props.displayName}</h2>
				<div className="imgContainer">
					<img className="uploadedPhoto" src={this.props.photo} />
				</div>
				<div className="comment">{this.props.comment}</div>

				<section className="reply">
					<form onSubmit={this.handleSubmit}>
						<textarea name='reply' className="reply" placeholder="Reply to this" value={this.state.reply} type="text" onChange={this.handleChange} />
						<input type="submit" value="Add" />
					</form>
	{/*			<ul>
					{this.state.replies.map((reply) => {
						return (<li key={reply.key}>
							{reply.description}
							<a href onClick={ () => this.removeReply(reply.key)}><i class="fa fa-times" aria-hidden="true"></i></a>
							</li>)
						})}
					</ul>						*/}
				</section>
			</div>
		)
	}
	componentDidMount(){   //this get whats stored in firebase 
		dbRef.on('value', (snapshot) => {  //value is the object
			// console.log(snapshot.val());
			const dbReplies = snapshot.val();
			const newReplies = [];
			for (let key in dbReplies) {
				// console.log('key', key);
				// console.log('todos', dbTodos[key]);
				newReplies.push({
					key: key,
					description: dbReplies[key]
				});
			}
			// console.log(newTodos);
			console.log ('this.state', this.state); {/* getting reply and likes */ }
			this.setState({
				replies: newReplies
			});
		});
	}
}