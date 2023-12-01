import { useQuery } from "react-query";
import brane_get_service from "../../services/brane_get_service";
import {end_point} from "../../constants/urls";
import './HomePage.css'
import Header from "./Header";
import Banner from "./Banner";
import Ourprojects from "./Ourprojects";
import Ourfeatures from "./Ourfeatures";
import ParentsVoice from "./ParentsVoice";
import LeadersVoice from "./LeadersVoice";
import News from "./News";
import Boards from "./Boards";
import Ourpartners from "./Ourpartners";
import Footer from "./Footer";
import loader from "../../assets/loader.gif";
import network_error from "../../assets/network_error.gif";
import Downloads from "./Download";
import BannerVideos from "./BannerVideos";
import BackToTopButton from "./backtotop";
import Languages from "./Languages";
const HomePage=({  updateVideoRef })=>{
    const { data, error, isLoading } = useQuery(['home_page',`${end_point}/home_page`],brane_get_service);
    let headers={};
    let banner={};
    let projects={};
    let features=[];
    let parents=[];
    let leaders={};
    let news={};
    let boards=[];
    let partners={};
    let banner_videos=[];
    if(!isLoading && error==null){
      const {data:alias_data}=data;
      const obj=alias_data[0];
      const {homepage_banner,homepage_boards,homepage_header,homepage_leaders_voice,homepage_news,homepage_ourfeatures,homepage_ourpartners,homepage_ourprojects,homepage_parents_voice,homepage_banner_video}=obj;
      headers=homepage_header;
      banner=homepage_banner;
      projects=homepage_ourprojects;
      features=homepage_ourfeatures;
      parents=homepage_parents_voice;
      leaders=homepage_leaders_voice;
      news=homepage_news;
      boards=homepage_boards;
      partners=homepage_ourpartners;
      banner_videos=homepage_banner_video
    }
    return(
        <>
            {
               !isLoading?(error!=null?(<>
                    <img src={network_error} alt="Error" className="loader"></img>
               </>):
               (<>
                   <Header homepage_header={headers}></Header>  
                   <Banner homepage_banner={banner}></Banner>
                   <Downloads></Downloads>
                   <Ourprojects homepage_ourprojects={projects} updateVideoRef={updateVideoRef} ></Ourprojects>
                   <BannerVideos banner_videos={banner_videos}></BannerVideos>
                   {/* <Ourfeatures homepage_ourfeatures={features}></Ourfeatures> */}
                   <LeadersVoice homepage_leaders_voice={leaders} updateVideoRef={updateVideoRef}  ></LeadersVoice>
                   <ParentsVoice homepage_parents_voice={parents}></ParentsVoice>
                  <News homepage_news={news}></News>
                  <Boards homepage_boards={boards}></Boards>
                  <Languages></Languages>
                  <Ourpartners homepage_ourpartners={partners}></Ourpartners>
                  <BackToTopButton></BackToTopButton>
                  <Footer></Footer> 
               </>)):(<img src={loader} alt="Error" width={250} height={250} className="loader"></img>)
            }
        </>
    )
}
export default HomePage;