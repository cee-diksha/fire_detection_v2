import { totalUnits } from "../../utils/TotalUnits"
import { motion } from 'framer-motion'

const TotalCard = ({ totalDevices, onClick, selected }) => {
  return (
    <motion.div
    initial={{backgroundColor:"var(--card-clr)"}}
    whileHover={selected === "all"?{}:{ opacity: 0.6 }}
      whileTap={{ opacity: 0.4 }}
      onClick={() => onClick("all")}
      animate={{ backgroundColor: selected === "all" ? "#ffffff" : "var(--card-clr)", color: selected === "all" ? "#000000" : "#fff" }}
      transition={{ duration: 0.2,ease:"linear" }}
      className="total-crd cursor-pointer"
    >
      <span>Total Installed <br />units</span>
      <span id="device-qty">{totalDevices}</span>
    </motion.div>
  );
};

const TotalSuppressionCard = ({ totalDevices, onClick, selected }) => {
  return (
    <motion.div
    initial={{backgroundColor:"var(--card-clr)"}}
    whileHover={selected === "suppressor"?{}:{ opacity: 0.6 }}
      whileTap={{ opacity: 0.4 }}
      onClick={() => onClick("suppressor")}
      animate={{ backgroundColor: selected === "suppressor" ? "#ffffff" : "var(--card-clr)", color: selected === "suppressor" ? "#000000" : "#fff" }}
      transition={{ duration: 0.2,ease:"linear" }}
      className="total-crd cursor-pointer"
    >
      <span>Total <br />Suppressors</span>
      <span id="device-qty">{totalDevices}</span>
    </motion.div>
  );
};

const TotalSmokeCard = ({ totalDevices, onClick, selected }) => {
  return (
    <motion.div
    initial={{backgroundColor:"var(--card-clr)"}}
      whileHover={selected === "sensor"?{}:{ opacity: 0.6 }}
      whileTap={{ opacity: 0.4 }}
      onClick={() => onClick("sensor")}
      animate={{ backgroundColor: selected === "sensor" ? "#ffffff" : "var(--card-clr)", color: selected === "sensor" ? "#000000" : "#fff" }}
      transition={{ duration: 0.2,ease:"linear" }}
      className="total-crd cursor-pointer"
    >
      <span>Total <br />Sensors</span>
      <span id="device-qty">{totalDevices}</span>
    </motion.div>
  );
};

const TotalRepeaterCard = ({ totalDevices, onClick, selected }) => {
  return (
    <motion.div
    initial={{backgroundColor:"var(--card-clr)"}}
    whileHover={selected === "repeater"?{}:{ opacity: 0.6 }}
      whileTap={{ opacity: 0.4 }}
      onClick={() => onClick("repeater")}
      animate={{ backgroundColor: selected === "repeater" ? "#ffffff" : "var(--card-clr)", color: selected === "repeater" ? "#000000" : "#fff" }}
      transition={{ duration: 0.2,ease:"linear" }}
      className="total-crd cursor-pointer"
    >
      <span>Total <br />Repeaters</span>
      <span id="device-qty">{totalDevices}</span>
    </motion.div>
  );
};

export const SettingCards = ({ tableData, onFilterChange, selectedFilter }) => {
  const repeater = totalUnits(tableData, "repeater");
  const sensor = totalUnits(tableData, "sensor");
  const suppressor = totalUnits(tableData, "suppressor");

  return (
    <div className="st-card-tray flex-start-row flex-wrap">
      <TotalCard totalDevices={suppressor + sensor + repeater} onClick={onFilterChange} selected={selectedFilter} />
      <TotalSuppressionCard totalDevices={suppressor} onClick={onFilterChange} selected={selectedFilter} />
      <TotalSmokeCard totalDevices={sensor} onClick={onFilterChange} selected={selectedFilter} />
      <TotalRepeaterCard totalDevices={repeater} onClick={onFilterChange} selected={selectedFilter} />
    </div>
  );
};
