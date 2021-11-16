import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
} from 'recharts';

const Chart = ({ chartData }) => {
    return (
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
                    <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
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
                <CartesianGrid strokeDasharray='3' style={{ opacity: 0.5 }} />
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
    );
};

export default Chart;
