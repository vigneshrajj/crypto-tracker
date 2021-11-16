import React from 'react';
import styles from './styles.module.scss';

const Stats = ({ coinData, dominance }) => {
    return (
        <React.Fragment>
            <h3>
                <span>{coinData.symbol}</span> Price Statistics
            </h3>
            <div>
                <p>{coinData.name} Price</p>
                <p className={styles.value}>
                    ₹
                    {coinData.market_data.current_price.inr.toLocaleString(
                        'en-IN'
                    )}
                </p>
            </div>
            <div>
                <p>Price Change 24h</p>
                <p className={styles.value}>
                    <span>
                        ₹
                        {coinData.market_data.price_change_24h_in_currency.inr.toLocaleString(
                            'en-IN'
                        )}{' '}
                    </span>
                    <span>
                        {coinData.market_data.price_change_percentage_24h_in_currency.inr.toFixed(
                            2
                        )}
                        %
                    </span>
                </p>
            </div>
            <div>
                <p>24h Low / 24h High</p>
                <p className={styles.value}>
                    ₹{coinData.market_data.low_24h.inr.toLocaleString('en-IN')}{' '}
                    / ₹
                    {coinData.market_data.high_24h.inr.toLocaleString('en-IN')}
                </p>
            </div>
            <div>
                <p>Trading Volume</p>
                <p className={styles.value}>
                    ₹
                    {coinData.market_data.total_volume.inr.toLocaleString(
                        'en-IN'
                    )}
                </p>
            </div>
            <div>
                <p>Volume / Market Cap</p>
                <p className={styles.value}>
                    {(
                        Number(coinData.market_data.total_volume.inr) /
                        Number(coinData.market_data.market_cap.inr)
                    ).toFixed(5)}
                </p>
            </div>
            <div>
                <p>Market Dominance</p>
                <p className={styles.value}>
                    {dominance ? dominance.toFixed(2) : 'Nil'}%
                </p>
            </div>
            <div>
                <p>Market Rank</p>
                <p className={styles.value}>#{coinData.market_cap_rank}</p>
            </div>
        </React.Fragment>
    );
};

export default Stats;
