import React, { useContext } from 'react';
import './Dashboard.css';
import AlertLedger from '../../components/AlertLedger/AlertLedger';
import AlertTray from '../../components/AlertTray/AlertTray';
import StatusDeckGlance from '../../components/StatusDeckGlance/StatusDeckGlance';
import { BatteryChart, SmokeChart, TempChart } from '../../components/Charts/Charts';
import DeckView from '../../components/DeckView/DeckView';
import DemoButton from '../../components/DemoButton/DemoButton';
import { MainContext } from '../../context/MainContext';

const Dashboard = () => {
  const { socketRef, data } = useContext(MainContext);

  return (
    <div className='page'>
      <div className='width-100 flex-space-row'>
        <div className='db-secondary flex-start-col'>
          {/* <DemoButton /> */}
          <StatusDeckGlance data={data} />
          <TempChart data={data} />
          <BatteryChart data={data} />
          <SmokeChart data={data} />
        </div>

        <div className='flex-start-col db-primary'>
          <AlertLedger />
          <AlertTray socket={socketRef.current} data={data} />
          <DeckView data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;