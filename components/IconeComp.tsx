import React from 'react'
import { BiFootball, BiBasketball } from 'react-icons/bi'
import { IoFootball, IoTennisball } from "react-icons/io5";
import { FaVolleyballBall, FaRunning, FaTableTennis } from 'react-icons/fa';
import { GiAmericanFootballHelmet, GiHockey, GiSoccerBall } from 'react-icons/gi';
import { GiBoxingGlove } from "react-icons/gi";

interface Sport {
  nom: string
}

const IconeComp = ({ nom }: Sport) => {
  return (
    <div>
      {
        nom === 'Football' || nom === 'Soccer'  ? <GiSoccerBall /> :
        nom === 'Handball' ? <IoFootball  /> :
        nom === 'Basketball' ? <BiBasketball className='text-orange-500' /> :
        nom === 'Tennis' ? <IoTennisball className='text-yellow-400' /> :
        nom === 'Volleyball' ? <FaVolleyballBall className='text-purple-500' /> :
        nom === 'Running' ? <FaRunning className='text-blue-500' /> :
        nom === 'Hockey' ? <GiHockey className='text-gray-600' /> :
        nom === 'Ping Pong' ? <FaTableTennis className='text-green-400' /> :
        nom === 'Rugby' ? <GiAmericanFootballHelmet className='text-red-500' /> :
        nom === "Boxe" ? <GiBoxingGlove className='text-green-600' /> :
        ""
      }
    </div>
  )
}

export default IconeComp
