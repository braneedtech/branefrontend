import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Logout = ({ loggedout, updateLoginStatus,  triggerLogout }) => {
  const navigate = useNavigate()
  const logout = () =>{
    localStorage.removeItem("login_details")
    localStorage.removeItem("certificates_length")
    updateLoginStatus(false); // Update login status
    navigate("/");
  }
  useEffect(() => {
    if (triggerLogout) {
      logout();
    }
  }, [triggerLogout]);
  return (
    <>
      <div className="landing__leftbox__logout" onClick={logout}>
        <img src={loggedout.icon} alt={loggedout.title} />
        <div>{loggedout.title}</div>
      </div>
    </>
  )
}
export default Logout;