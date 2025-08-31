import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const MY_SEPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const provider = new ethers.JsonRpcProvider(MY_SEPOLIA_URL);
export const addrAccount = "0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927";
export const addrAccount4 = "0x1329f875B2AF89dC6e1438bb8d232188F9474BA1";
export const addrAntonyC = "0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F";
export const addrWETH = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
