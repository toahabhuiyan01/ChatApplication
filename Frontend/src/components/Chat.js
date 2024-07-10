import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import queryString from "query-string"
import io from "socket.io-client"
import ScrollToBottom from "react-scroll-to-bottom"

let socket

const Chat = () => {
	const { search } = useLocation()
	const { name, room } = queryString.parse(search)
	const [messages, setMessages] = useState([])
	const [users, setUsers] = useState([])

    useEffect(() => {
        socket = io('http://localhost:8000')
        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error)
            }
        })

        socket.on('message', (message) => {
            setMessages(prev => ([...prev, message]))
        })

        setUsers([{ name: 'toaha', id: '1' }, { name: 'tanzel', id: '2' }])

        return () => {
            socket.emit('disconnect')
            socket.close()
        }
    }, [name, room])
    
    const sendMessage = (e) => {
        if(e.key === 'Enter' && e.target.value) {
            socket.emit('message', e.target.value)
            e.target.value = ''
        }
    }

	return (
		<div className="chat">
			<div className="user-list">
				<div>User Name</div>
				{users.map((user) => (
					<div key={user.id}>{user.name}</div>
				))}
			</div>
			<div className="chat-section">
				<div className="chat-head">
					<div className="room">{room}</div>
					<Link to="/">X</Link>
				</div>
				<div className="chat-box">
					<ScrollToBottom className="messages">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`message ${name === message.user ? "self" : ""}`}
							>
								<span className="user">{message.user}</span>
								<span className="message-text">{message.text}</span>
							</div>
						))}
					</ScrollToBottom>
					<input placeholder="message" onKeyDown={sendMessage} />
				</div>
			</div>
		</div>
	)
}

export default Chat