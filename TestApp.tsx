import React, { useState, useEffect } from 'react';

const TestApp: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🛠️ TestApp Mounted");
        const timer = setTimeout(() => {
            console.log("🛠️ TestApp Loading Finished");
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div style={{ padding: 100, fontSize: 40 }}>TestApp is loading...</div>;
    }

    return <div style={{ padding: 100, fontSize: 40, color: 'green' }}>TestApp is READY!</div>;
};

export default TestApp;
