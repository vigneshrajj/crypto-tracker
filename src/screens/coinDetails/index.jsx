import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.scss';
import Chart from './Chart';
import Stats from './Stats';

const baseURL = 'https://api.coingecko.com/api/v3';

const index = () => {
    const params = useParams();
    const [coinData, setCoinData] = useState({});
    const [chartData, setChartData] = useState({});
    const [amount, setAmount] = useState(0);
    const [amountCurrency, setAmountCurrency] = useState({});
    const [dominance, setDominance] = useState(0);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [timeframe, setTimeframe] = useState(1);
    const [lowHighPair, setLowHighPair] = useState([]);

    const navigate = useNavigate();

    const authenticate = () => {
        if (!localStorage.getItem('isAuth')) {
            navigate('/');
        }
    };

    const getCoinData = async () => {
        const res = await axios.get(
            `${baseURL}/coins/${params.coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        setCoinData(res.data);
        return res.data;
    };

    const getChartData = async () => {
        const res = await axios.get(
            `${baseURL}/coins/${params.coinId}/market_chart?vs_currency=inr&days=30`
        );
        setChartData(res.data.prices);
    };

    useEffect(async () => {
        authenticate();
        const data = await getCoinData();
        getChartData();

        const prices = data.market_data.current_price;

        setCurrencyOptions([
            { symbol: 'inr', label: 'Indian Rupees', price: prices.inr },
            { symbol: 'usd', label: 'US Dollars', price: prices.usd },
            { symbol: 'bnb', label: 'Binance Coin', price: prices.bnb },
            { symbol: 'btc', label: 'Bitcoin', price: prices.btc },
            { symbol: 'eth', label: 'Ethereum', price: prices.eth },
            { symbol: 'ltc', label: 'Litecoin', price: prices.ltc },
            { symbol: 'dot', label: 'Polkadot', price: prices.dot },
        ]);
        setAmountCurrency({
            symbol: 'inr',
            label: 'Indian Rupees',
            price: prices.inr,
        });
        const dominanceRes = await axios.get(`${baseURL}/global`);
        setDominance(
            Object.keys(dominanceRes.data.data.market_cap_percentage).indexOf(
                data.symbol
            ) !== -1 &&
                dominanceRes.data.data.market_cap_percentage[data.symbol]
        );
    }, []);

    useEffect(async () => {
        const res = await axios.get(
            `${baseURL}/coins/${params.coinId}/ohlc?vs_currency=inr&days=${timeframe}`
        );
        const highest = Math.max.apply(
            Math,
            res.data.map((item) => item[2])
        );
        const lowest = Math.min.apply(
            Math,
            res.data.map((item) => item[3])
        );
        setLowHighPair([lowest, highest]);
    }, [timeframe]);

    return Object.keys(coinData).length ? (
        <div className={styles.container}>
            <div className={styles.coinNameContainer}>
                <img src={coinData.image.thumb} alt={params.coinId} />
                <h1>{coinData.name} </h1>
                <p>{coinData.symbol}</p>
            </div>
            <div className={styles.otherData}>
                <p>{coinData.name} Price</p>
                <h1>
                    ₹
                    {coinData.market_data.current_price.inr.toLocaleString(
                        'en-IN'
                    )}{' '}
                    <span
                        style={{
                            backgroundColor:
                                Object.keys(coinData).length &&
                                coinData.market_data
                                    .price_change_percentage_24h > 0
                                    ? '#17D7A0'
                                    : '#FF2626',
                        }}
                    >
                        {coinData.market_data.price_change_percentage_24h.toFixed(
                            2
                        )}
                        %
                    </span>
                </h1>
                <div className={styles.lowHigh}>
                    <p className={styles.low}>
                        Low: ₹
                        <span>
                            {lowHighPair.length &&
                                lowHighPair[0].toLocaleString('en-IN')}
                        </span>
                    </p>
                    <p className={styles.high}>
                        High: ₹
                        <span>
                            {lowHighPair.length &&
                                lowHighPair[1].toLocaleString('en-IN')}
                        </span>
                    </p>
                    <select
                        name='low-high-selector'
                        id='low-high-selector'
                        className={styles.lowHighSelector}
                        onChange={(e) => setTimeframe(Number(e.target.value))}
                    >
                        <option value={1}>24h</option>
                        <option value={7}>7d</option>
                        <option value={14}>14d</option>
                        <option value={30}>30d</option>
                    </select>
                </div>
            </div>
            <div className={styles.converterContainer}>
                <div className={styles.coinValue}>
                    <div>
                        <p className={styles.symbol}>{coinData.symbol}</p>
                        <p>{coinData.name}</p>
                    </div>
                    <input
                        type='number'
                        value={amount}
                        onChange={(e) =>
                            e.target.value >= 0 && setAmount(e.target.value)
                        }
                    />
                </div>
                <div className={styles.convertedValue}>
                    <div>
                        <select
                            name='currency-selector'
                            id='currency-selector'
                            className={styles.currencySelector}
                            onChange={(e) =>
                                setAmountCurrency(JSON.parse(e.target.value))
                            }
                        >
                            {currencyOptions.length &&
                                currencyOptions.map((item) => {
                                    return (
                                        <option
                                            key={item.symbol}
                                            value={JSON.stringify(item)}
                                        >
                                            {item.symbol.toUpperCase()}
                                        </option>
                                    );
                                })}
                        </select>
                        <p>{amountCurrency && amountCurrency.label}</p>
                    </div>
                    <p>
                        {(
                            amountCurrency && amountCurrency.price * amount
                        ).toFixed(2) || 0}
                    </p>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <h2>
                    <span>{coinData.symbol}</span> To INR Chart
                </h2>
                {chartData.length && <Chart chartData={chartData} />}
            </div>
            <div className={styles.statsContainer}>
                <Stats coinData={coinData} dominance={dominance} />
            </div>
        </div>
    ) : (
        <h1 className={styles.noData}>Oops, No data found!</h1>
    );
};

export default index;
