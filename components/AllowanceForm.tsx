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
  const [validationMessage, setValidationMessage] = useState('');
  const [allowanceData, setAllowanceData] = useState<AllowanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [isEnsResolving, setIsEnsResolving] = useState(false);
  const { data: ensAddress, isLoading: isEnsLoading } = useEnsAddress({ name: inputValue.toLowerCase() });

  useEffect(() => {
    setIsEnsResolving(isEnsLoading);
  }, [isEnsLoading]);

  function isValidAddressOrENS(address: string): boolean {
    return address.includes('.eth') || address.length === 42;
  }

  async function fetchAllowance(address: string) {
    setIsLoading(true);
    setDataFetched(false);
    console.log('Fetching allowance data for:', address);
    fetch(`/api/allowance?address=${address}`)
      .then(response => response.json())
      .then(data => {
        setAllowanceData(data.length > 0 ? data[0] : null);
        setDataFetched(true);
      })
      .catch(error => console.error('There was a problem with your fetch operation:', error))
      .finally(() => setIsLoading(false));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let addressToQuery = ensAddress || inputValue.trim();
    if (isValidAddressOrENS(addressToQuery)) {
      setValidationMessage('');
      fetchAllowance(addressToQuery);
    } else {
      setValidationMessage('Invalid address or ENS name. Fix and try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setValidationMessage('');
  }

  return (
    <div className="space-y-6 px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Check Allowance</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Wallet Address or ENS Name"
          className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {validationMessage && <div className="text-sm text-red-500">{validationMessage}</div>}
        {!isEnsResolving && ensAddress && <div className="text-sm text-green-500">Resolved to: {ensAddress}</div>}
        <button
          type="submit"
          className={`p-3 text-white rounded-md ${isEnsResolving || isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading || isEnsResolving}
        >
          {isLoading ? 'Loading...' : 'Check Allowance'}
        </button>
      </form>
      {!isLoading && dataFetched && allowanceData && (
        <div className="space-y-3">
          <div className="text-xs">Result for: {allowanceData.wallet_address}</div>
          <div className="text-lg"><span className="font-medium">Display Name:</span> {allowanceData.display_name}</div>
          <div className="text-lg"><span className="font-medium">Allowance:</span> {allowanceData.tip_allowance}</div>
          <div className="text-lg"><span className="font-medium">Remaining Allowance:</span> {allowanceData.remaining_allowance}</div>
        </div>
      )}
      {!isLoading && dataFetched && !allowanceData && (
        <div className="text-lg text-red-500">No allowance data found.</div>
      )}
    </div>
  );
}
