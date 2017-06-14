import React from 'react';
import firebase from './firebase.js';

export default function(props) {
	// console.log('props.user', props.user)
	return (
		<div className="replyCard">
			<div className="reply"> 
				<h3 className="replyName">{props.name}</h3>
				<img className="replyPhoto" src={props.avatar} /> <div className="replyP"><p>{props.reply}</p></div> <button onClick={() => props.remove(props.index)}><i className="fa fa-times fa-lg"></i></button>
			</div>
		</div>
	)
}