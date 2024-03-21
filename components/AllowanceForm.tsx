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
    <div className="space-y-6 px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Check Allowance</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Wallet Address or ENS Name"
          className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Check Allowance'}
        </button>
      </form>
      {!isLoading && dataFetched && allowanceData && (
        <div className="space-y-3">
          <div className="text-lg"><span className="font-medium">Display Name:</span> {allowanceData.display_name}</div>
          <div className="text-lg"><span className="font-medium">Allowance:</span> {allowanceData.tip_allowance}</div>
          <div className="text-lg"><span className="font-medium">Remaining Allowance:</span> {allowanceData.remaining_allowance}</div>
        </div>
      )}
      {!isLoading && dataFetched && !allowanceData && (
        <div className="text-lg text-red-500">No allowance data found for {resolvedAddress}</div>
      )}
    </div>
  );
}
