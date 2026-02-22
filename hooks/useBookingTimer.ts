
import { useState, useEffect } from 'react';

export const useBookingTimer = (initialMinutes: number = 5, onExpire: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            onExpire();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onExpire]);

    const startTimer = () => {
        setTimeLeft(initialMinutes * 60);
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
    };

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return {
        timeLeft,
        formatTime,
        startTimer,
        stopTimer,
        isActive
    };
};
