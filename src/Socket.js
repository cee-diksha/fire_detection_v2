import { io } from "socket.io-client";
import { URL } from "./lib/constants";

export const socket = io(URL)

socket.on("disconnect", () => {
  console.warn("Socket disconnected, attempting to reconnect...");
  setTimeout(() => socket.connect(), 3000);
});