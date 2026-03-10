import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainContext } from '../../context/MainContext';
import { FIRE_TEMP } from '../../libs/Constants';
import './GlobalAlertBanner.css';

/**
 * GlobalAlertBanner — persists across ALL pages.
 * Shows a compact alert strip when there are active alerts (fire/smoke/battery/fallen)
 * and the user is NOT on the dashboard (where AlertTray already shows full detail).
 */
const GlobalAlertBanner = () => {
    const { fireNodes, smokeNodes, fallenNodes, batteryNodes } = useContext(MainContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(false);

    // Build alert list from context
    const alertItems = [];

    (fireNodes || []).forEach(n => {
        alertItems.push({ type: 'fire', label: ` Fire — Node ${n.nodeId}`, nodeId: n.nodeId });
    });

    (smokeNodes || []).forEach(n => {
        alertItems.push({ type: 'smoke', label: ` Smoke — Node ${n.nodeId}`, nodeId: n.nodeId });
    });

    (fallenNodes || []).forEach(n => {
        alertItems.push({ type: 'fallen', label: ` Offline — Node ${n.nodeId}`, nodeId: n.nodeId });
    });

    (batteryNodes || []).forEach(n => {
        alertItems.push({ type: 'battery', label: ` Low Battery — Node ${n.nodeId}`, nodeId: n.nodeId });
    });

    if (alertItems.length === 0 || dismissed) return null;

    return (
        <div className="global-alert-banner">
            <div className="gab-inner">
                <span className="gab-pulse" />
                <div className="gab-items">
                    {alertItems.slice(0, 3).map((item, i) => (
                        <span
                            key={i}
                            className={`gab-item gab-item--${item.type}`}
                            onClick={() => navigate(`/info/${item.nodeId}`)}
                        >
                            {item.label}
                        </span>
                    ))}
                    {alertItems.length > 3 && (
                        <span className="gab-more" onClick={() => navigate('/')}>
                            +{alertItems.length - 3} more
                        </span>
                    )}
                </div>
                <div className="gab-actions">
                    <button className="gab-btn" onClick={() => navigate('/')}>View All</button>
                    <button className="gab-dismiss" onClick={() => setDismissed(true)}>✕</button>
                </div>
            </div>
        </div>
    );
};

export default GlobalAlertBanner;
