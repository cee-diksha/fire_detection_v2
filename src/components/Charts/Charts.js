import React, { useContext, useEffect, useState } from 'react'
import { BarChart, LineChart } from "@mui/x-charts";

import './Charts.css'


export const TempChart = ({data}) => {
  const [info, setInfo] = useState([]);
  const [cardData,setCardData] = useState([])

   //logic to get data
  useEffect(()=>{
      setCardData(data)
    },[data])

 
  useEffect(() => {
    setInfo(cardData.filter(item => item.nodeType.toLowerCase() === "sensor"));
  }, [cardData]);

  // Sort data by node_id
  const sortedInfo = [...info].sort((a, b) => a.nodeId - b.nodeId);

  const temp = sortedInfo.map(item => Number(item.temp));
  const node = sortedInfo.map(item => Number(item.nodeId));

  const valueFormatter = (nodeId, context) => {
    const nodeItem = sortedInfo.find((item) => item.nodeId === nodeId);
    if (context.location === "tick") {
      return String(nodeId);
    } else if (nodeItem && nodeItem.location) {
      return `${nodeItem.location} (ID: ${nodeItem.nodeId})`;
    } else {
      return String(nodeId);
    }
  };

  return (
    <div className='chrt-mn'>
      <LineChart
        xAxis={[{ 
          data: node,  
          scaleType: 'band', 
          label: "Node ID",  
          
        }]}
        yAxis={[{
          min: 0,
          label: 'Temperature(°C)',
          colorMap: {
            type: 'piecewise',
            thresholds: [40, 60],
            colors: ['red', 'orange', 'red'],
          },
        }]}
        series={[
            {
              data: temp,
              label: 'Temperature(°C)',
              color: 'transparent',
            },
        ]}
        responsive={true}
        height={180}
      />
    </div>
  );
};


export const BatteryChart = ({data}) => {
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [cardData,setCardData] = useState([])

   //logic to get data
  useEffect(()=>{
      setCardData(data)
    },[data])


  useEffect(() => {
    const sortedData = cardData
      .filter((item) => item.batp < 100)
      .sort((a, b) => a.nodeId - b.nodeId);

    setFilteredInfo(sortedData);
  }, [cardData]);

  const battery = filteredInfo.map((item) => item.batp);
  const node = filteredInfo.map((item) => item.nodeId);
  return (
    <div className='chrt-mn'>
      <LineChart
        xAxis={[{
          data: node,
          scaleType: "point",
          label: "Node ID",
        }]}
        yAxis={[{
          min: 0,
          max: 100,
          label: "Battery (%)",
          colorMap: {
            type: 'piecewise',
            thresholds: [20, 40],
            colors: ['red', 'orange','green'],
          },
        }]}
        series={[{
          data: battery,
          label: "Battery (%)",
          color: "transparent",
        }]}
        responsive={true}
        height={200}
      >
      </LineChart>
    </div>
  );
};

 export const SmokeChart = ({data}) => {
   const [info, setInfo] = useState([]);

   useEffect(() => {
     setInfo(data); 
   }, [data]);

   const smokearr = info.map((item) => ({
     smoke: item.status.includes('Smoke') ? '#ff7b7b' : '#b7ff86', 
     nodeId: item.nodeId,
   }));

   const nodeIds = smokearr.map((item) => item.nodeId);
   const barColors = smokearr.map((item) => item.smoke);
   const yAxisData = Array(nodeIds.length).fill(1); 

   const valueFormatter = (nodeId, context) => {
     const nodeItem = info.find((item) => item.nodeId === nodeId);
     if (context.location === "tick") {
       return String(nodeId);  // ensure nodeId is always a string
     } else if (nodeItem && nodeItem.location) {
       return `${nodeItem.location} (ID: ${nodeItem.nodeId})`;
     } else {
       return String(nodeId);  // fallback to nodeId if no node_name is found
     }
   };
  
   return (
    <div className='chrt-mn'>
        <p>Smoke</p>
     <BarChart
       xAxis={[{ scaleType: 'band', data: nodeIds, label: 'Node ID', colorMap: {
         type: "ordinal",
         values: nodeIds,
         colors: barColors,
       },  valueFormatter: (nodeId, context) => valueFormatter(nodeId, context)}]} 
       series={[
         {
            values: '',
           data: yAxisData,
         },
       ]}
       leftAxis={null}
       responsive={true}
       height={150}
     />
     </div>
   );
 };