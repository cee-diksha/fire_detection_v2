import Grid from "./Grid"
import "./DeckView.css"

const DeckWrapper = ({data, deckNo}) => {
  console.log(data, deckNo, "checking datadeck")
    return (
      <div>
        <div className='status-grid-modal' style={{cursor: "pointer"}}>
          <h4>Deck {deckNo}</h4>
          <Grid data={data} deckNo={deckNo} /> 
        </div>
      </div>
    )
  }

  export default DeckWrapper