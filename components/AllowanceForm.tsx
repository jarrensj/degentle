'use client'

import { useState } from 'react';

interface AllowanceData {
  snapshot_date: string;
  user_rank: string;
  wallet_address: string;
  avatar_url: string;
  display_name: string;
  tip_allowance: string;
  remaining_allowance: string;
}

export default function AllowanceForm() {
  const [walletAddress, setWalletAddress] = useState('');
  const [allowanceData, setAllowanceData] = useState<AllowanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAllowance(address: string) {
    setIsLoading(true);
    fetch(`/api/allowance?address=${address}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.length > 0) {
          setAllowanceData(data[0]);
        } else {
          setAllowanceData(null);
        }
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      })
      .finally(() => setIsLoading(false));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAllowance(walletAddress);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check Allowance</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Wallet Address"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          {isLoading ? 'Loading...' : 'Check Allowance'}
        </button>
      </form>
      {allowanceData && (
        <div className="space-y-2">
          <div>Display Name: {allowanceData.display_name}</div>
          <div>Tip Allowance: {allowanceData.tip_allowance}</div>
          <div>Remaining Allowance: {allowanceData.remaining_allowance}</div>
          <div>Snapshot Date: {allowanceData.snapshot_date}</div>
        </div>
      )}
    </div>
  );
}
