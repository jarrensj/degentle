'use client'

import React, { useEffect, useState } from 'react';
import CoinGeckoAttribution from './CoinGeckoAttribution';

const Calculator: React.FC = () => {
  const [degenPrice, setDegenPrice] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

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

  return (
    <>
      <div className="flex flex-col items-center">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && degenPrice && <p>degen price: ${degenPrice}</p>}
      </div>
      <CoinGeckoAttribution />
    </>
  );
};

export default Calculator;
