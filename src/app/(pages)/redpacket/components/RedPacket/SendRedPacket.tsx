'use client';

import { useState, useEffect } from 'react';
import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESS } from '../../config';
import RedPacketABI from '../../abi/RedPacket.json';
import RedTokenABI from '../../abi/RedToken.json';
import { useAlert } from '@/app/components/Alert/AlertProvider';

export default function SendRedPacket() {
	const { address } = useAccount();
	const { showAlert } = useAlert();
	const [amount, setAmount] = useState('');
	const [count, setCount] = useState('');
	const [isEqual, setIsEqual] = useState(false);
	const [expireMinutes, setExpireMinutes] = useState('30');
	const [step, setStep] = useState<'input' | 'approve' | 'sending'>('input');
	const [packetId, setPacketId] = useState<bigint | null>(null);
	const [tokenSymbol, setTokenSymbol] = useState('RPT');
	const [tokenDecimals, setTokenDecimals] = useState(0);
	const [approveAmount, setApproveAmount] = useState('');

	// 获取 RedToken 地址
	const { data: tokenAddress } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'token',
	});

	// 获取用户的 token 余额
	const { data: tokenBalance } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'balanceOf',
		args: [address],
		query: {
			enabled: !!tokenAddress && !!address,
		},
	});

	console.log('.....', tokenBalance);

	// 获取当前授权额度
	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'allowance',
		args: [address, CONTRACT_ADDRESS],
		query: {
			enabled: !!tokenAddress && !!address,
		},
	});
	console.log('-----', allowance);

	// 获取代币符号
	const { data: symbolData } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'symbol',
		query: {
			enabled: !!tokenAddress,
		},
	});

	// 获取代币精度
	const { data: decimalsData } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'decimals',
		query: {
			enabled: !!tokenAddress,
		},
	});

	// 更新代币信息
	useEffect(() => {
		if (symbolData) {
			setTokenSymbol(symbolData as string);
		}
		if (decimalsData !== undefined) {
			setTokenDecimals(decimalsData as number);
		}
	}, [symbolData, decimalsData]);

	const {
		writeContract: approve,
		data: approveHash,
		error: approveError,
		reset: resetApprove,
	} = useWriteContract();
	const {
		writeContract: sendPacket,
		data: sendHash,
		error: sendError,
		reset: resetSend,
	} = useWriteContract();

	const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
		hash: approveHash,
	});

	const { isSuccess: isSendSuccess, isLoading: isSending } =
		useWaitForTransactionReceipt({
			hash: sendHash,
		});

	// 监听 approve 成功
	useEffect(() => {
		if (isApproveSuccess) {
			// 授权成功，刷新授权额度
			setTimeout(() => {
				refetchAllowance();
			}, 1000);
			// 重置状态和输入框
			setStep('input');
			setApproveAmount('');
			showAlert('授权成功！', 'success');
		}
	}, [isApproveSuccess, refetchAllowance, showAlert]);

	// 监听发红包成功
	useEffect(() => {
		if (isSendSuccess) {
			setStep('input');
			setAmount('');
			setCount('');
			showAlert(`红包发送成功！红包ID: ${packetId?.toString() || 'N/A'}`, 'success');
		}
	}, [isSendSuccess, packetId, showAlert]);

	// 监听授权错误（用户取消或交易失败）
	useEffect(() => {
		if (approveError) {
			console.error('Approve error:', approveError);
			const errorMessage = approveError.message || '授权失败';
			if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
				showAlert('用户取消了授权', 'info');
			} else {
				showAlert('授权失败，请重试', 'error');
			}
			setStep('input');
			resetApprove();
		}
	}, [approveError, showAlert, resetApprove]);

	// 监听发红包错误（用户取消或交易失败）
	useEffect(() => {
		if (sendError) {
			console.error('Send error:', sendError);
			const errorMessage = sendError.message || '发红包失败';
			if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
				showAlert('用户取消了交易', 'info');
			} else {
				showAlert('发红包失败，请重试', 'error');
			}
			setStep('input');
			resetSend();
		}
	}, [sendError, showAlert, resetSend]);

	// 单独的授权按钮处理
	const handleApproveOnly = async () => {
		if (!tokenAddress || !approveAmount) {
			showAlert('请先输入授权金额', 'warning');
			return;
		}

		// 确保 decimals 已经加载
		if (decimalsData === undefined) {
			showAlert('正在加载代币信息，请稍后再试', 'warning');
			return;
		}

		const amountInWei = parseUnits(approveAmount, tokenDecimals);
		console.log('授权信息:', {
			approveAmount,
			tokenDecimals,
			amountInWei: amountInWei.toString(),
		});
		approve({
			address: tokenAddress as `0x${string}`,
			abi: RedTokenABI.abi,
			functionName: 'approve',
			args: [CONTRACT_ADDRESS, amountInWei],
		});
		setStep('approve');
	};

	const handleSendPacket = async () => {
		if (!amount || !count) return;

		const amountInWei = parseUnits(amount, tokenDecimals);
		const packetCount = BigInt(count);
		const expireAt = BigInt(
			Math.floor(Date.now() / 1000) + Number(expireMinutes) * 60
		);

		sendPacket({
			address: CONTRACT_ADDRESS,
			abi: RedPacketABI.abi,
			functionName: 'sendPacket',
			args: [amountInWei, packetCount, isEqual, expireAt],
		});
		setStep('sending');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!amount || !count || !address) return;

		const amountInWei = parseUnits(amount, tokenDecimals);
		const currentAllowance = (allowance as bigint) || BigInt(0);

		// 检查授权额度是否足够
		if (currentAllowance < amountInWei) {
			showAlert(
				`授权额度不足！当前授权: ${formatUnits(currentAllowance, tokenDecimals)} ${tokenSymbol}，需要: ${amount} ${tokenSymbol}。请先授权。`,
				'warning'
			);
			return;
		}

		// 直接发红包
		await handleSendPacket();
	};

	const formatAmount = (amount: bigint) => {
		return formatUnits(amount, tokenDecimals);
	};

	return (
		<div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full' />
				<h2 className='text-2xl font-bold text-white'>发红包</h2>
			</div>

			{/* 授权 Token */}
			<div>
				<label className='block text-sm font-medium text-gray-300 mb-2'>
					授权金额 ({tokenSymbol})
					{decimalsData === undefined && (
						<span className='ml-2 text-xs text-yellow-400'>
							(正在加载代币信息...)
						</span>
					)}
					{decimalsData !== undefined && (
						<span className='ml-2 text-xs text-gray-500'>
							(Decimals: {tokenDecimals})
						</span>
					)}
				</label>
				<div className='flex gap-3'>
					<input
						type='number'
						step='1'
						min='0'
						value={approveAmount}
						onChange={(e) => setApproveAmount(e.target.value)}
						placeholder='请输入授权金额'
						className='flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
						disabled={step !== 'input'}
					/>
					<button
						type='button'
						onClick={handleApproveOnly}
						disabled={step !== 'input' || !address || !approveAmount}
						className='px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap'
					>
						{step === 'approve' ? '授权中...' : '授权'}
					</button>
				</div>
				<div className='mt-2 flex flex-row-reverse'>
					{allowance && (allowance as bigint) > BigInt(0) ? (
						<button
							type='button'
							onClick={() => setApproveAmount('0')}
							className='text-xs text-blue-400 hover:text-blue-300 underline'
						>
							清除授权（输入0）
						</button>
					) : null}
				</div>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* 红包个数 */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						红包个数
					</label>
					<input
						type='number'
						min='1'
						max='255'
						value={count}
						onChange={(e) => setCount(e.target.value)}
						placeholder='请输入红包数 (1-255)'
						className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
						disabled={step !== 'input'}
						required
					/>
				</div>

				{/* 总金额 */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						总金额 ({tokenSymbol})
					</label>
					<input
						type='number'
						step={tokenDecimals === 0 ? '1' : '0.0001'}
						min='0'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder='请输入总金额'
						className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
						disabled={step !== 'input'}
						required
					/>
					{allowance !== undefined && (
						<p className='text-xs text-gray-400'>
							{/* 可用余额: {formatUnits(allowance as bigint, tokenDecimals)}{' '} */}
							可用余额: {formatAmount(allowance as bigint)} {tokenSymbol}
						</p>
					)}
					{/* {tokenBalance && (
						<p className='mt-2 text-xs text-gray-400'>
							可用余额: {formatUnits(tokenBalance as bigint, tokenDecimals)}{' '}
							{tokenSymbol}
						</p>
					)} */}
				</div>

				{/* 过期时间 */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						过期时间 (分钟)
					</label>
					<input
						type='number'
						min='1'
						value={expireMinutes}
						onChange={(e) => setExpireMinutes(e.target.value)}
						placeholder='30'
						className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
						disabled={step !== 'input'}
					/>
				</div>

				{/* 均分红包 */}
				<div className='flex items-center gap-3'>
					<input
						type='checkbox'
						id='isEqual'
						checked={isEqual}
						onChange={(e) => setIsEqual(e.target.checked)}
						className='w-5 h-5 rounded border-gray-600 text-red-500 focus:ring-2 focus:ring-red-500 bg-gray-900/50'
						disabled={step !== 'input'}
					/>
					<label htmlFor='isEqual' className='text-sm text-gray-300'>
						均分红包 (不勾选则为拼手气红包)
					</label>
				</div>

				{/* 提交按钮 */}
				<button
					type='submit'
					disabled={step !== 'input' || !address}
					className='w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg'
				>
					{step === 'approve' && '授权中...'}
					{step === 'sending' && '发送中...'}
					{step === 'input' && '发红包'}
				</button>
			</form>
		</div>
	);
}
