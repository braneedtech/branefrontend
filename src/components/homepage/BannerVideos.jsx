// import './BannerVideos.css'
// import learn1 from '../../assets/learn1.webm'
// import learn2 from '../../assets/learn2.webm'
// const BannerVideos = () => {
//     return (
//         <>
//             <section className="mainscreen1">
//                 <article className="mainscreen1__insidescreen1">

//                     <div className="mainscreen1__insidescreen1__row">
//                         <article className="mainscreen1__insidescreen1__image">
//                             <video autoPlay loop muted>
//                                 <source src={learn1} type="video/webm" />
//                                 Your browser does not support the video tag.
//                             </video>
//                         </article>
//                         <article className="mainscreen1__insidescreen1__text">
//                             <div className='mainscreen1__insidescreen1__text__paragraph'>
//                                 <p>Welcome to our cutting-edge AI-powered platform for education, where the future of learning comes to life. Our platform harnesses the power of artificial intelligence to revolutionize the way students, educators, and institutions engage with knowledge.</p>
//                             </div>
//                         </article>
//                     </div>
//                     <div className="mainscreen1__insidescreen1__row reversed">
//                         <article className="mainscreen1__insidescreen1__image">
//                             <video autoPlay loop muted>
//                                 <source src={learn2} type="video/webm" />
//                                 Your browser does not support the video tag.
//                             </video>
//                         </article>
//                         <article className="mainscreen1__insidescreen1__text">
//                             <div className='mainscreen1__insidescreen1__text__paragraph'>
//                                 <p>With over 1000 concepts, you can explore, discover, and master a diverse array of topics. Whether you're a student seeking to excel in your studies, a professional looking to upskill, or someone with a curious mind eager to learn.</p>
//                             </div>
//                         </article>
//                     </div>

//                 </article>
//             </section>
//         </>
//     )
// }
// export default BannerVideos;

import './BannerVideos.css'

const BannerVideos = ({banner_videos}) => {
    const {video,text}=banner_videos[0]
    const {video1,text1}=banner_videos[1]
    const {video2,text2}=banner_videos[2]
    const {video3,text3}=banner_videos[3]
    const {video4,text4}=banner_videos[4]
   
   
    return (
        <>
        {/* {banner_videos.map((item, index)=>( */}
            <section className="mainscreen1">
                <article className="mainscreen1__insidescreen1">
 
                    <div className="mainscreen1__insidescreen1__row">
                        <article className="mainscreen1__insidescreen1__image">
                            <video autoPlay loop muted>
                                <source src={video} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </article>
                        <article className="mainscreen1__insidescreen1__text">
                            <div className='mainscreen1__insidescreen1__text__paragraph'>
                                {/* <p>Welcome to our cutting-edge AI-powered platform for education, where the future of learning comes to life. Our platform harnesses the power of artificial intelligence to revolutionize the way students, educators, and institutions engage with knowledge.</p> */}
                                <p>{text}</p>
                            </div>
                        </article>
                    </div>
                    <div className="mainscreen1__insidescreen1__row reversed">
                        <article className="mainscreen1__insidescreen1__image">
                            <video autoPlay loop muted>
                                <source src={video1} type="video/webm" />
                               
                                Your browser does not support the video tag.
                            </video>
                        </article>
                        <article className="mainscreen1__insidescreen1__text">
                            <div className='mainscreen1__insidescreen1__text__paragraph'>
                                {/* <p>With over 1000 concepts, you can explore, discover, and master a diverse array of topics. Whether you're a student seeking to excel in your studies, a professional looking to upskill, or someone with a curious mind eager to learn.</p> */}
                                <p>{text1}</p>
                            </div>
                        </article>
                    </div>
                    <div className="mainscreen1__insidescreen1__row">
                        <article className="mainscreen1__insidescreen1__image">
                            <video autoPlay loop muted>
                                <source src={video2} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </article>
                        <article className="mainscreen1__insidescreen1__text">
                            <div className='mainscreen1__insidescreen1__text__paragraph'>
                                {/* <p>Welcome to our cutting-edge AI-powered platform for education, where the future of learning comes to life. Our platform harnesses the power of artificial intelligence to revolutionize the way students, educators, and institutions engage with knowledge.</p> */}
                                <p>{text2}</p>
                            </div>
                        </article>
                    </div>
                    <div className="mainscreen1__insidescreen1__row reversed">
                        <article className="mainscreen1__insidescreen1__image">
                            <video autoPlay loop muted>
                                <source src={video3} type="video/webm" />
                               
                                Your browser does not support the video tag.
                            </video>
                        </article>
                        <article className="mainscreen1__insidescreen1__text">
                            <div className='mainscreen1__insidescreen1__text__paragraph'>
                                {/* <p>With over 1000 concepts, you can explore, discover, and master a diverse array of topics. Whether you're a student seeking to excel in your studies, a professional looking to upskill, or someone with a curious mind eager to learn.</p> */}
                                <p>{text3}</p>
                            </div>
                        </article>
                    </div>
                    <div className="mainscreen1__insidescreen1__row">
                        <article className="mainscreen1__insidescreen1__image">
                            <video autoPlay loop muted>
                                <source src={video4} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </article>
                        <article className="mainscreen1__insidescreen1__text">
                            <div className='mainscreen1__insidescreen1__text__paragraph'>
                                {/* <p>Welcome to our cutting-edge AI-powered platform for education, where the future of learning comes to life. Our platform harnesses the power of artificial intelligence to revolutionize the way students, educators, and institutions engage with knowledge.</p> */}
                                <p>{text4}</p>
                            </div>
                        </article>
                    </div>
 
                </article>
            </section>
        {/* ))}  */}
        </>
       
    )
}
 
export default BannerVideos;

