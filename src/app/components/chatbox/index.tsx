'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SEND_MESSAGE } from '@/graphql/mutations';
import './index.css';

interface Message {
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
}

interface ChatResponse {
	chat: {
		message: string;
		timestamp: string;
	};
}

interface ChatVariables {
	message: string;
}

export default function ChatBox() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [sendMessage, { loading, error }] = useMutation<
		ChatResponse,
		ChatVariables
	>(SEND_MESSAGE);

	const handleSend = async () => {
		if (!inputValue.trim()) return;

		const userMessage: Message = {
			role: 'user',
			content: inputValue,
			timestamp: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');

		try {
			console.log('Sending message:', inputValue);
			const { data } = await sendMessage({
				variables: { message: inputValue },
			});

			console.log('Response data:', data);
			if (data?.chat) {
				const aiMessage: Message = {
					role: 'assistant',
					content: data.chat.message,
					timestamp: data.chat.timestamp,
				};
				setMessages((prev) => [...prev, aiMessage]);
			}
		} catch (err) {
			console.error('Failed to send message:', err);
			const error = err as Error & {
				networkError?: Error;
				graphQLErrors?: Array<{ message: string }>;
			};
			console.error('Error details:', {
				message: error.message,
				networkError: error.networkError,
				graphQLErrors: error.graphQLErrors,
			});
			const errorMessage: Message = {
				role: 'assistant',
				content: `抱歉，发送消息失败: ${error.message || '未知错误'}`,
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className='chat-container'>
			<div className='chat-header'>
				<h1>AI 对话助手</h1>
				<p>基于 OpenAI 的智能对话系统</p>
			</div>

			<div className='messages-container'>
				{messages.length === 0 ? (
					<div className='empty-state'>
						<p>👋 你好！我是 AI 助手，有什么可以帮你的吗？</p>
					</div>
				) : (
					messages.map((msg, index) => (
						<div
							key={index}
							className={`message ${
								msg.role === 'user' ? 'user-message' : 'ai-message'
							}`}
						>
							<div className='message-header'>
								<span className='message-role'>
									{msg.role === 'user' ? '👤 你' : '🤖 AI'}
								</span>
								<span className='message-time'>
									{new Date(msg.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<div className='message-content'>{msg.content}</div>
						</div>
					))
				)}
				{loading && (
					<div className='message ai-message'>
						<div className='message-header'>
							<span className='message-role'>🤖 AI</span>
						</div>
						<div className='message-content typing-indicator'>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				)}
				{error && <div className='error-message'>❌ 错误: {error.message}</div>}
			</div>

			<div className='input-container'>
				<textarea
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder='输入你的问题... (Shift+Enter 换行, Enter 发送)'
					disabled={loading}
					rows={3}
				/>
				<button onClick={handleSend} disabled={loading || !inputValue.trim()}>
					{loading ? '发送中...' : '发送'}
				</button>
			</div>
		</div>
	);
}
