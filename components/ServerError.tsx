"use client"
import Link from "next/link"
import UFO from "../assets/UFO.png"
function ServerError() {
  return (
    <>
        <div className="md:h-screen flex flex-col justify-center items-center">
            <div>
                <img 
                src={UFO.src}
                className="w-60 h-60"
                alt="Server error" />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 text-center">
                <p className=" text-shadow-md md:text-[18px]">Something went wrong.. <br></br>Please contact to the Admin</p>
                <Link className="text-[18px] underline" href="/about">About </Link>
            </div>
        </div>
    </>
  )
}

export default ServerError