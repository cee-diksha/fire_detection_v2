import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DeckView.css"


const Grid = ({ data, deckNo }) => {

  const dangerComp = data.danger || []; // to ensure it's always an array
  const normalComp = data.normal || [];
  const tempriseComp = data.temprise || [];
  const lowbatteryComp = data.lowbattery || [];
  const deletedComp = data.deleted || [];
  const smokeComp = data.smoke || [];


  const [highlightedId, setHighlightedId] = useState({
    dangerComp: [],
    normalComp: [],
    tempriseComp: [],
    lowbatteryComp: [],
    deletedComp: [],
    smokeComp: []
  });

  useEffect(() => {
    setHighlightedId({ 
      dangerComp: dangerComp || [], 
      normalComp: normalComp || [], 
      tempriseComp: tempriseComp || [], 
      lowbatteryComp: lowbatteryComp || [],
      deletedComp: deletedComp || [],
      smokeComp: smokeComp || []
    });
  }, [dangerComp, normalComp, tempriseComp, lowbatteryComp, deletedComp, smokeComp]);

  const getBoxClass = (boxId) => {
    console.log("test")
    if (highlightedId.dangerComp.includes(boxId)) return "dk-danger";
    if (highlightedId.tempriseComp.includes(boxId)) return "dk-temprise";
    if (highlightedId.lowbatteryComp.includes(boxId)) return "dk-lowbattery";
    if (highlightedId.deletedComp.includes(boxId)) return "dk-deleted";
    if (highlightedId.smokeComp.includes(boxId)) return "dk-smoke";
    if (highlightedId.normalComp.includes(boxId)) return "dk-normal";
    return "box"; // default class
  };

  const boxes = Array.from({ length: 60 }, (_, index) => index + 1); 

  return (
    <div style={{ marginRight: "14px" }}>
      <div className="grid-container">
        {boxes.map((boxId) => {
          
          const boxClass = getBoxClass(boxId); 
          return (
            <Link
            key={boxId}
              style={{ textDecoration: "none" }}
              to={`/deck/${deckNo}/${boxId}`}
              >
              <div
              id={`box-${boxId}`}
              className={`box ${boxClass}`} 
              // id="box"
              // className="box"
              >
              {boxId}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
