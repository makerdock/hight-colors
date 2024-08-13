import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const timerRef = React.useRef<NodeJS.Timeout>();

    const calculateTimeLeft = () => {
        const now = new Date();
        const target = new Date(targetDate);
        const difference = target.getTime() - now.getTime();

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
        } else {
            setTimeLeft('Countdown finished');
            clearInterval(timerRef.current);
        }
    }

    useEffect(() => {
        timerRef.current = setInterval(calculateTimeLeft, 60000); // Update every minute
        calculateTimeLeft();

        return () => clearInterval(timerRef.current);
    }, [targetDate]);


    return (
        <div className="font-mono text-lg font-bold">
            {timeLeft}
        </div>
    );
};

export default CountdownTimer;