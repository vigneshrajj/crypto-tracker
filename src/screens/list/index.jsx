import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import { AreaChart, XAxis, YAxis, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Row = memo(({ coin }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('isAuth')) {
            navigate('/');
        }
    }, []);
    return (
        <tr onClick={() => navigate(`/coin/${coin.id}`)}>
            <td>
                <img src={coin.image} alt={coin.name} />
            </td>
            <td>
                {coin.name} <span>({coin.symbol})</span>
            </td>
            <td>₹{coin.current_price}</td>
            <td>₹{coin.total_volume}</td>
            <td>{coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>₹{coin.market_cap}</td>
            <td>
                <AreaChart
                    width={200}
                    height={80}
                    data={coin.sparkline_in_7d.price.map((price) => {
                        return {
                            price: price,
                        };
                    })}
                >
                    <defs>
                        <linearGradient
                            id='colorPrice'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                            <stop
                                offset='5%'
                                stopColor='#e94c89'
                                stopOpacity={0.8}
                            />
                            <stop
                                offset='95%'
                                stopColor='#e94c89'
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis tick={false} dataKey='price' />
                    <YAxis tick={false} />
                    <Area
                        fill='url(#colorPrice)'
                        dot={false}
                        activeDot={false}
                        type='monotone'
                        dataKey='price'
                        stroke='#e94c89'
                    />
                </AreaChart>
            </td>
        </tr>
    );
});

const index = () => {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(async () => {
        const res = await axios.get(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=30&page=1&sparkline=true'
        );
        setData(res.data);
    }, []);

    const search = () => {
        if (query) {
            setSearchResults(
                data.filter(
                    (coin) => coin.name.toLowerCase().indexOf(query) !== -1
                )
            );
        } else {
            setSearchResults([]);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSearchResults([]);
    };

    return (
        <div>
            <div className={styles.header}>
                <h1>Crypto Tracker</h1>
                <input
                    type='text'
                    value={query}
                    onKeyUp={(e) => {
                        e.key === 'Enter' && search();
                    }}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {searchResults.length ? (
                    <button onClick={clearSearch}>x</button>
                ) : (
                    <button onClick={search} disabled={!data.length}>
                        Search
                    </button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Coin</th>
                        <th>Price</th>
                        <th>Volume</th>
                        <th>24hr</th>
                        <th>Market Cap</th>
                        <th>Last 7 days</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length ? (
                        searchResults.map((coin) => (
                            <Row key={coin.id} coin={coin} />
                        ))
                    ) : data.length ? (
                        data.map((coin) => <Row key={coin.id} coin={coin} />)
                    ) : (
                        <tr></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default index;
