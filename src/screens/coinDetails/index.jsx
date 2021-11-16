import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, XAxis, YAxis, Area } from 'recharts';

const index = () => {
    const params = useParams();
    const [coinData, setCoinData] = useState({});
    const [chartData, setChartData] = useState({});

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

    return (
        <div>
            <div>
                {Object.keys(coinData).length && (
                    <img src={coinData.image.thumb} alt={params.coinId} />
                )}
                <h1>
                    {coinData && coinData.name}{' '}
                    <span>{coinData && coinData.symbol}</span>
                </h1>
            </div>
            <div>
                <p>{coinData && coinData.name} Price</p>
                <h3>
                    ₹
                    {Object.keys(coinData).length &&
                        coinData.market_data.current_price.inr}{' '}
                    <span>
                        {Object.keys(coinData).length &&
                            coinData.market_data.price_change_percentage_24h}
                    </span>
                </h3>
                <div>
                    <p>
                        Low: ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.low_24h.inr}
                    </p>
                    <p>
                        High: ₹
                        {Object.keys(coinData).length &&
                            coinData.market_data.high_24h.inr}
                    </p>
                </div>
                <div>
                    <div>
                        <p>{Object.keys(coinData).length && coinData.symbol}</p>
                        <p>{Object.keys(coinData).length && coinData.name}</p>
                        <input type='text' />
                    </div>
                    <div>
                        <p>INR</p>
                        <p>Indian Rupees</p>
                        <p>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.current_price.inr}
                        </p>
                    </div>
                </div>
                <div>
                    {chartData.length && (
                        <AreaChart
                            width={800}
                            height={300}
                            data={chartData.map((price) => {
                                return {
                                    price: price[1],
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
                            <YAxis dataKey='price' />
                            <XAxis tick={false} />
                            <Area
                                fill='url(#colorPrice)'
                                type='monotone'
                                dataKey='price'
                                stroke='#e94c89'
                            />
                        </AreaChart>
                    )}
                </div>
                <div>
                    <h3>
                        {Object.keys(coinData).length && coinData.symbol} Price
                        Statistics
                    </h3>
                    <div>
                        <p>
                            {Object.keys(coinData).length && coinData.name}{' '}
                            Price
                        </p>
                        <p>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.current_price.inr}
                        </p>
                    </div>
                    <div>
                        <p>Price Change 24h</p>
                        <p>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data
                                    .price_change_24h_in_currency.inr}{' '}
                            {Object.keys(coinData).length &&
                                coinData.market_data
                                    .price_change_percentage_24h_in_currency
                                    .inr}
                            %
                        </p>
                    </div>
                    <div>
                        <p>24h Low / 24h High</p>
                        <p>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.low_24h.inr}
                            / ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.high_24h.inr}
                        </p>
                    </div>
                    <div>
                        <p>Trading Volume</p>
                        <p>
                            ₹
                            {Object.keys(coinData).length &&
                                coinData.market_data.total_volume.inr}
                        </p>
                    </div>
                    <div>
                        <p>Volume / Market Cap</p>
                        <p>
                            {Object.keys(coinData).length &&
                                (
                                    Number(
                                        coinData.market_data.total_volume.inr
                                    ) /
                                    Number(coinData.market_data.market_cap.inr)
                                ).toFixed(5)}
                        </p>
                    </div>
                    <div>
                        <p>Market Rank</p>
                        <p>
                            #
                            {Object.keys(coinData).length &&
                                coinData.market_cap_rank}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
