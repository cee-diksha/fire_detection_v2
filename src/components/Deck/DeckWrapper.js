import Grid from "./Grid"

const DeckWrapper = ({data, deckNo}) => {
    return (
      <div>
        <div className='status-grid-modal' style={{cursor: "pointer"}}>
          <h4>Deck {deckNo}</h4>
          {console.log(data, deckNo, "deckkkkkk")}
          <Grid data={data} deckNo={deckNo} /> 
        </div>
      </div>
    )
  }

  export default DeckWrapper