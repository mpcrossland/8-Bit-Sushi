import React from 'react';
import firebase from './firebase.js';

export default function(props) {
	return (
		<div className="replyCard">
			<h4>{props.reply} hi</h4>
		</div>
	)
	console.log(this.props, 'props')
}