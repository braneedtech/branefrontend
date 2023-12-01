import axios from "axios";
import { otp_api_key, otp_url } from "../constants/urls";
let OPT_DATA;

const generateRandomOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generate a random 6-digit OTP
};

const sendOTPSMS = async (mobile, otp) => {
  const url = `${otp_url}?authorization=${otp_api_key}&variables_values=${otp}&route=otp&numbers=${mobile}`;
  try {
    const response = await axios.get(url);
    if (response.data.return === true) {
      OPT_DATA = otp;
      return true;
    } else {
      alert("Failed to send OTP. Please try again.");
      return false;
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while sending OTP. Please try again later.");
    return false;
  }
};

const generateOtp = async (mobile) => {
  const otp = generateRandomOTP();
  const sent = await sendOTPSMS(mobile, otp);
  if (!sent) {
    return {
      sent: false
    };
  } else {
    return { sent: true, otp: OPT_DATA };
  }
};

export default generateOtp;
