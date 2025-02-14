const TotalSuppressionCard = ({totalDevices}) => {
    return(
        <div className="total-cards">
            <div className="total-label">
                <h4>Total Supression Units</h4>
            </div>  
            <div className="total-num">
                {totalDevices}
            </div>      
        </div>
    )
}

const TotalSmokeCard = ({totalDevices}) => {
    return(
        <div className="total-cards">
            <div className="total-label">
                <h4>Total Smoke Sensors</h4>
            </div>  
            <div className="total-num">
                {totalDevices}
            </div>      
        </div>
    )
}


const TotalRepeaterCard = ({totalDevices}) => {
    return(
        <div className="total-cards">
            <div className="total-label">
                <h4>Total Repeaters</h4>
            </div>  
            <div className="total-num">
            {totalDevices}
            </div>      
        </div>
    )
}

export const SettingCards = ({totalDevices}) => {
    console.log(totalDevices, "DEVICE TOTAL")
    return(
       <>
            <TotalSuppressionCard totalDevices = {totalDevices.T}/>
            <TotalSmokeCard totalDevices = {totalDevices.S} />
            <TotalRepeaterCard totalDevices = {totalDevices.R} />
       </>
    )
}