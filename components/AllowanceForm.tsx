'use client'

import { useState, useEffect } from 'react';
import { useEnsAddress } from 'wagmi';

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
  const [inputValue, setInputValue] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [allowanceData, setAllowanceData] = useState<AllowanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const { data: ensAddress } = useEnsAddress({ name: inputValue });

  useEffect(() => {
    if (ensAddress) {
      setResolvedAddress(ensAddress);
    } else if (!inputValue.includes('.eth')) {
      setResolvedAddress(inputValue.trim());
    }
  }, [ensAddress, inputValue]);

  useEffect(() => {
    if (resolvedAddress) {
      fetchAllowance(resolvedAddress);
    }
  }, [resolvedAddress]);

  async function fetchAllowance(address: string) {
    setIsLoading(true);
    setDataFetched(false);
    fetch(`/api/allowance?address=${address}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setAllowanceData(data[0]);
        } else {
          setAllowanceData(null);
        }
        setDataFetched(true);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        setDataFetched(true);
      })
      .finally(() => setIsLoading(false));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check Allowance</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Wallet Address or ENS Name"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Check Allowance'}
        </button>
      </form>
      {!isLoading && dataFetched && allowanceData && (
        <div className="space-y-2">
          <div>Display Name: {allowanceData.display_name}</div>
          <div>Tip Allowance: {allowanceData.tip_allowance}</div>
          <div>Remaining Allowance: {allowanceData.remaining_allowance}</div>
          <div>Snapshot Date: {allowanceData.snapshot_date}</div>
        </div>
      )}
      {!isLoading && dataFetched && !allowanceData && (
        <div>No allowance data found for {resolvedAddress}</div>
      )}
    </div>
  );
}
