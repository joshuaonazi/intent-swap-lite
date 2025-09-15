import { ethers } from 'ethers';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [intent, setIntent] = useState({
    fromToken: '',
    toToken: '',
    amount: '',
    maxSlippage: '',
    expiry: ''
  });

  const handleChange = (e) => {
    setIntent({ ...intent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!window.ethereum) {
    alert('MetaMask not found');
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const domain = {
    name: 'IntentSwapLite',
    version: '1',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000'
  };

  const types = {
    Intent: [
      { name: 'fromToken', type: 'string' },
      { name: 'toToken', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'maxSlippage', type: 'string' },
      { name: 'expiry', type: 'string' }
    ]
  };

  const value = {
    fromToken: intent.fromToken,
    toToken: intent.toToken,
    amount: intent.amount,
    maxSlippage: intent.maxSlippage,
    expiry: intent.expiry
  };

  try {
    const signature = await signer._signTypedData(domain, types, value);
    console.log('Signed Intent:', signature);
    alert('Intent signed successfully!');
  } catch (err) {
    console.error('Signing failed:', err);
    alert('Failed to sign intent.');
  }
};
}

export default App;
