'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import CoinGeckoAttribution from './CoinGeckoAttribution';
import styles from './Calculator.module.css'; 

const Calculator: React.FC = () => {
  const [degenPrice, setDegenPrice] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const [inputValue, setInputValue] = useState<number | ''>('');
  const [result, setResult] = useState<number>(0);
  const [shrinkClass, setShrinkClass] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/price', { next: { revalidate: 1 } });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data['degen-base'].usd) {
          setDegenPrice(data['degen-base'].usd);
        }

      } catch (error) {
        setError('There was a problem with the fetch operation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (inputValue !== '') {
      if(degenPrice) setResult(inputValue * degenPrice);
    } else {
      setResult(0);
    }
  }, [inputValue, degenPrice]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value === '' ? '' : parseFloat(value));
    if (shrinkClass) setShrinkClass(''); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '') {
      setShrinkClass(styles.shrink);
      setTimeout(() => setShrinkClass(''), 300); 
    }
  };

  const formatWithCommas = (value: number) => {
    const fixedValue = value.toFixed(2);
    let [integerPart, decimalPart] = fixedValue.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${integerPart}.${decimalPart}`;
  };

  return (
    <>
      <div className="p-6">
        {!isLoading ? (
          error ? (
            <p className="text-sm font-semibold text-red-500">Failed to load price, please try again later.</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700">
                $DEGEN: {degenPrice !== null ? <span className="text-green-600">{degenPrice} USD</span> : "Price not available."}
              </p>
              <div className="mt-4">
                <label htmlFor="degenAmount" className="block text-sm font-medium text-gray-700">amount of degen:</label>
                <input 
                  type="number"
                  className={`mb-2 w-25 py-1 text-lg text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${shrinkClass}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder='100'
                />
                { inputValue === '' ? (
                  <p className="text-sm font-semibold text-gray-400">enter a number in the field above</p>
                ) : (
                  <p className="mt-2 text-lg font-semibold text-gray-700 text-center">
                    <span className="text-green-600">{inputValue < 0 ? `-$${formatWithCommas(-result)}` : `$${formatWithCommas(result)}`}</span>
                  </p>
                )}
              </div>
            </>
          )
        ) : (
          <p className="text-xl font-semibold text-gray-700">Loading price...</p>
        )}
      </div>
      <CoinGeckoAttribution />
    </>
  );
};

export default Calculator;