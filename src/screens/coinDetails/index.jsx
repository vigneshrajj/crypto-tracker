import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
} from 'recharts';
import styles from './styles.module.scss';

const index = () => {
    const params = useParams();
    const [coinData, setCoinData] = useState({});
    const [chartData, setChartData] = useState({});
    const [amount, setAmount] = useState(0);

    const navigate = useNavigate();
    useEffect(async () => {
        if (!localStorage.getItem('isAuth')) {
            navigate('/');
        }
        const baseURL = 'https://api.coingecko.com/api/v3';
        const res = await axios.get(
            `${baseURL}/coins/${params.coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        setCoinData(res.data);
        const chartRes = await axios.get(
            `${baseURL}/coins/${params.coinId}/market_chart?vs_currency=inr&days=30&interval=daily`
        );
        setChartData(chartRes.data.prices);
        console.log(
            chartRes.data.prices.map((price) => {
                return {
                    price: price[1],
                };
            })
        );
    }, []);

    return Object.keys(coinData).length ? (
        <div className={styles.container}>
            <div className={styles.coinNameContainer}>
                {Object.keys(coinData).length && (
                    <img src={coinData.image.thumb} alt={params.coinId} />
                )}
                <h1>{coinData && coinData.name} </h1>
                <p>{coinData && coinData.symbol}</p>
            </div>
            <div className={styles.otherData}>
                <p>{coinData && coinData.name} Price</p>
                <h1>
                    ₹
                    {Object.keys(coinData).length &&
                        coinData.market_data.current_price.inr.toLocaleString(
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
                        {Object.keys(coinData).length &&
                            coinData.market_data.price_change_percentage_24h.toFixed(
                                2
                            )}
                        %
                    </span>
                </h1>
                <div className={styles.lowHigh}>
                    <p className={styles.low}>
                        Low: ₹
                        <span>
                            {Object.keys(coinData).length &&
                                coinData.market_data.low_24h.inr.toLocaleString(
                                    'en-IN'
                                )}
                        </span>
                    </p>
                    <p className={styles.high}>
                        High: ₹
                        <span>
                            {Object.keys(coinData).length &&
                                coinData.market_data.high_24h.inr.toLocaleString(
                                    'en-IN'
                                )}
                        </span>
                    </p>
                </div>
            </div>
            <div className={styles.converterContainer}>
                <div className={styles.coinValue}>
                    <div>
                        <p className={styles.symbol}>
                            {Object.keys(coinData).length && coinData.symbol}
                        </p>
                        <p>{Object.keys(coinData).length && coinData.name}</p>
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
                        <p className={styles.symbol}>INR</p>
                        <p>Indian Rupees</p>
                    </div>
                    <p>
                        ₹
                        {Object.keys(coinData).length &&
                            (
                                coinData.market_data.current_price.inr * amount
                            ).toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <h2>
                    <span>
                        {Object.keys(coinData).length && coinData.symbol}
                    </span>{' '}
                    To INR Chart
                </h2>
                {chartData.length && (
                    <ResponsiveContainer height='100%' width='100%'>
                        <AreaChart
                            data={chartData.map((price) => {
                                return {
                                    price: price[1],
                                };
                            })}
                            margin={{ left: 10 }}
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
                            <CartesianGrid
                                strokeDasharray='3'
                                style={{ opacity: 0.5 }}
                            />
                            <YAxis dataKey='price' />
                            <XAxis tick={false} />
                            <Area
                                fill='url(#colorPrice)'
                                type='monotone'
                                dataKey='price'
                                stroke='#e94c89'
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
            <div className={styles.statsContainer}>
                <h3>
                    <span>
                        {Object.keys(coinData).length && coinData.symbol}
                    </span>{' '}
                    Price Statistics
                </h3>
                <div>
                    <p>{Object.keys(coinData).length && coinData.name} Price</p>
                    <p className={styles.value}>
                        ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.current_price.inr.toLocaleString(
                                'en-IN'
                            )}
                    </p>
                </div>
                <div>
                    <p>Price Change 24h</p>
                    <p className={styles.value}>
                        <span>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.price_change_24h_in_currency.inr.toLocaleString(
                                    'en-IN'
                                )}{' '}
                        </span>
                        <span>
                            {Object.keys(coinData).length &&
                                coinData.market_data.price_change_percentage_24h_in_currency.inr.toFixed(
                                    2
                                )}
                            %
                        </span>
                    </p>
                </div>
                <div>
                    <p>24h Low / 24h High</p>
                    <p className={styles.value}>
                        ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.low_24h.inr.toLocaleString(
                                'en-IN'
                            )}{' '}
                        / ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.high_24h.inr.toLocaleString(
                                'en-IN'
                            )}
                    </p>
                </div>
                <div>
                    <p>Trading Volume</p>
                    <p className={styles.value}>
                        ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.total_volume.inr.toLocaleString(
                                'en-IN'
                            )}
                    </p>
                </div>
                <div>
                    <p>Volume / Market Cap</p>
                    <p className={styles.value}>
                        {Object.keys(coinData).length &&
                            (
                                Number(coinData.market_data.total_volume.inr) /
                                Number(coinData.market_data.market_cap.inr)
                            ).toFixed(5)}
                    </p>
                </div>
                <div>
                    <p>Market Rank</p>
                    <p className={styles.value}>
                        #
                        {Object.keys(coinData).length &&
                            coinData.market_cap_rank}
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <h1 className={styles.noData}>Oops, No data found!</h1>
    );
};

export default index;
