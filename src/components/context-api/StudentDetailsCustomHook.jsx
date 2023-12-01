import { useContext } from "react";
import { StudentDetails } from "./StudentDetails";
const StudentDetailsCustomHook=()=>{
    return useContext(StudentDetails);
}
export default StudentDetailsCustomHook;