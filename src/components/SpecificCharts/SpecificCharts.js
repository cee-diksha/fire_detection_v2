import { LineChart } from "@mui/x-charts"
import '../Charts/Charts.css'

export const SpecificBattChart = ({batt, status}) => {
    const time = batt.map(item => item.time)
    const battery = batt.map(item => item.value)
    const lineColor =  "orange"
 return(
    <div className="chrt-mn">
        <LineChart
            xAxis={[{ data: time, scaleType: 'band', label: "Time(hrs)", valueFormatter: (value, context) => context.location === "tick" ? value : `${value}00 hours`}]}
            yAxis={[{
                min: 0,
                label: 'Battery(%)',
            }]}
            series={[
                {
                data: battery,
                label: 'Battery(%)',
                color: lineColor
                },
            ]}
            tooltip={{
            formatter: (params) => {
                const time = params.x;
                const batteryVal = params.y;
                return `Time(hrs): ${time}\nBattery: ${batteryVal}°C`;
            },
            }}
            responsive={true}
            height={200}
        />
        </div>
    )
}

export const SpecificTempChart = ({temperature, status}) => {
    const time = temperature.map(item => item.time)
    const temp = temperature.map(item => item.value)
    const lineColor = 'red'
    return(
        <div className="chrt-mn">
        <LineChart
            xAxis={[{ data: time, scaleType: 'band', label: "Time(hrs)", valueFormatter: (value, context) => context.location === "tick" ? value : `${value}00 hours`}]}
            yAxis={[{
                min: 0, // Ensure y-axis starts from 0
                label: 'Temperature(°C)',
            }]}
            series={[
                {
                data: temp,
                label: 'Temperature(°C)',
                color : lineColor
                },
            ]}
            tooltip={{
            formatter: (params) => {
                const time = params.x;
                const tempValue = params.y;
                return `Time(hrs): ${time}\nTemperature: ${tempValue}°C`;
            },
            }}
            responsive={true}
            height={200}
      />
      </div>
    )
}