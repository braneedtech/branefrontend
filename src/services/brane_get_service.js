import axios from "axios";
const brane_get_service = async (data) => {
     if(data==undefined || data==null){
        const {queryKey}=data;
        const url=queryKey[1];
        if(url=="" || url==undefined){
            res.json({"message":"plese provide valid url"});
            return;
        }
    }else{
        const {queryKey}=data;
        const url=queryKey[1];
        const response = await axios.get(url);
        if (response.statusText!=="OK") {
            throw new Error('Network response was not ok');
        }
        return response;
    }
};
export default brane_get_service;