import { FIRE_TEMP } from "../libs/Constants";

export const getAlertAndStatusDisplay = (statusArray, temperature, battery, statusCode) => {
  // Highest priority: If statusCode is 0, device is dead and needs replacement
  if (statusCode === 0) {
    return { 
      alertType: "replace", 
      statusDisplay: ["Device offline"], 
      hasSmoke: false, 
      hasFire: false, 
      hasRise: false 
    };
  }


  // Second highest priority: If battery is critically low (<= 5)
  if (battery <= 5) {
    return { 
      alertType: "replace", 
      statusDisplay: ["Needs Replacement"], 
      hasSmoke: false, 
      hasFire: false, 
      hasRise: false 
    };
  }

  const normalizedStatus = statusArray
    .map((s) => s.toLowerCase().replace(/\s+/g, ""))
    .filter(Boolean);

  let alert = "";
  let displayList = [];
  let hasFire = false;
  let hasRise = normalizedStatus.includes("temprise");
  let hasSmoke = normalizedStatus.includes("smoke");

 

  // Fire condition (High priority)
  if (temperature >= FIRE_TEMP) {
    hasFire = true;
    alert = "fire";
    displayList.push("fire");
  }

  // Smoke condition
  if (hasSmoke) {
    displayList.push("smoke");
  }

   // Check for fall
   if (statusCode === 2){
    displayList.push("Fall Detected");
      alert = "replace"
  }

  // Check other statuses based on priority
  const priorityOrder = ["temprise", "lowbat"];
  for (const statusItem of priorityOrder) {
    if (normalizedStatus.includes(statusItem)) {
      if (statusItem === "temprise" && hasFire) continue; // Skip Temp Rise if Fire is detected
      displayList.push(statusItem === "temprise" ? "Temp rise" : "Low battery");
    }
  }

  // Determine final alertType based on priority
  if (!alert) {
    if (displayList.length > 0) {
      switch (displayList[0]) {
        case "Temp rise":
          alert = "temprise";
          break;
        case "smoke":
          alert = "smoke";
          break;
        case "Low battery":
          alert = "lowbat";
          break;
        default:
          break;
      }
    } else {
      alert = "normal";
      displayList.push("normal");
    }
  }

  return { alertType: alert, statusDisplay: displayList, hasSmoke, hasFire, hasRise };
};
