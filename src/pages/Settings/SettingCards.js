import { totalUnits } from "../../utils/TotalUnits"

const TotalSuppressionCard = ({totalDevices}) => {
    return(
        <div className="total-crd">
                <span>Total Supression Units</span>            
                <span  id="device-qty">{totalDevices}</span>                 
        </div>
    )
}

const TotalSmokeCard = ({totalDevices}) => {
    return(
        <div className="total-crd">
                <span>Total <br/>Sensors</span>
                <span id="device-qty">{totalDevices}</span>            
        </div>
    )
}


const TotalRepeaterCard = ({totalDevices}) => {
    return(
        <div className="total-crd">
            <span>Total <br/>Repeaters</span>
            <span  id="device-qty">{totalDevices}</span>
        </div>
    )
}

export const SettingCards = ({tableData}) => {
    const repeater = totalUnits(tableData, "repeater")
    const sensor = totalUnits(tableData, "sensor")
    const suppressor = totalUnits(tableData, "suppressor")
    return(
       <div className="st-card-tray flex-start-row flex-wrap">
            <TotalSuppressionCard totalDevices = {suppressor}/>
            <TotalSmokeCard totalDevices = {sensor} />
            <TotalRepeaterCard totalDevices = {repeater} />
       </div>
    )
}