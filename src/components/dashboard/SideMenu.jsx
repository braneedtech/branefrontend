import React from 'react'

const SideMenu = () => {
    return (
        <>
            <section className='Dashboard__leftmenu__Container'>
                <article className='Dashboard__leftmenu__Container__top'>
                    <article className='Dashboard__leftmenu__Container__top-logo'>
                        <img
                            src="https://braneeducation.s3.ap-south-1.amazonaws.com/Homepage_images/logo/Branenewlogo.png"
                            alt="Brane Logo"
                        />
                    </article>
                    <article className='Dashboard__leftmenu__Container__top-profile'>
                        <div className='Dashboard__leftmenu__Container__top-profile-image'>
                            <img src="https://braneeducation.s3.ap-south-1.amazonaws.com/face_images/7013848174_1.jpg" alt="profileimage" />
                        </div>
                        <div className="Dashboard__leftmenu__Container__top-profile-username">{"Sairam"}</div>
                        <div className="Dashboard__leftmenu__Container__top-profile-class">{"classX"}</div>
                    </article>
                    <article className='Dashboard__leftmenu__Container__top-dash'>

                    </article>
                </article>

                <article className='Dashboard__leftmenu__Container__mid'>
                    {/* menu */}
                    <div>Academics</div>
                    <div>Special Skills</div>
                </article>
                <article className='Dashboard__leftmenu__Container__bottom'>
                    Logout
                </article>
            </section>
        </>
    )
}

export default SideMenu
