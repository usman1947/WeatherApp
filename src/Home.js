import React, { useState } from 'react';
import { ImArrowRight, ImArrowLeft } from "react-icons/im"
import { IconContext } from "react-icons"
import { Card } from 'react-bootstrap';
import './App.css'
import Data from './data.json';
import { Chart } from "react-google-charts";
import { useEffect } from 'react';

const apiData = true;
let average = [0,0,0,0,0]
let tempArray = []

let bar = [
            ["Time","Temperature"],
            ["00:00",20],
            ["03:00",23],
            ["06:00",24],
            ["09:00",25],
            ["12:00",27],
            ["15:00",22],
            ["18:00",23],
            ["21:00",20],

            ]
let tempType = "C"

export const Home = () => {

    const [cardNum, setCardNum] = useState(3)
    const [firstCard, setFirstCard] = useState(0)
    const [isC, setIsC] = useState(true)
    const [isF, setIsF] = useState(false)
    const [currentTemp, setCurrentTemp] = useState('C')
    const [activeCard, setActiveCard] = useState(0)

    useEffect(() => {
        Data?.forEach((data, i) => {
            let adder = 0
            for (let [key, value] of Object.entries(data)){
                if (key !== "date")
                    adder = adder + value 
            average[i] = adder/8
            }
        })
        handleBarShow(activeCard)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[Data])

    function handleCardUp(){
        let cn = cardNum
        let fc = firstCard
        let ac = activeCard

        if (cn < 5){
            setCardNum(cn + 1)
            setFirstCard(fc+ 1)
        }
        if(ac < 4){
            setActiveCard(ac+1)
            handleBarShow(ac+1)
        }
    }

    function handleCardDown(){
        let cn = cardNum
        let fc = firstCard
        let ac = activeCard

        if (cardNum > 3){
            setCardNum(cn - 1)
            setFirstCard(fc - 1)
        }
        if(ac > 0){
            setActiveCard(ac-1)
            handleBarShow(ac-1)
        }
    }

    function handleTempType(type){
        if(type === "f" && currentTemp !== "F"){
            for (let i = 0; i < 5; i++){
                average[i] = average[i] * 9/5 + 32
            }
            tempType = "F"
            handleBarShow(activeCard)
            setIsC(false)
            setIsF(true)
            setCurrentTemp("F")
        }
        else if(type === "c" && currentTemp !== "C"){
            for (let i = 0; i < 5; i++){
                average[i] = (average[i] - 32) * 5/9
            }
            tempType = "C"
            handleBarShow(activeCard)
            setIsC(true)
            setIsF(false)
            setCurrentTemp("C")
        }
    }

    function handleBarShow(i){
        tempArray = []
        for (let [key, value] of Object.entries(Data[i])){
            if (key !== "date")
                tempArray.push(value) 
        }
        if (tempType === "F"){
            for (let i = 0; i<8; i++){
                tempArray[i] = tempArray[i] * 9/5 + 32
            }
        }
        for(let k=1; k<9; k++){
            bar[k][1] = tempArray[k-1]+tempType
        }
        setActiveCard(i)
    }

    function onValueChange(){
        console.log("onValueChange")
    }

    if (!apiData)
        return <div className="App-header" >Loading ...</div>
    
    return  <div className="App" >
            <form className="form">
                <div className="radio">
                <label>
                    <input
                    type="radio"
                    value="Male"
                    checked={isC}
                    onChange={onValueChange}
                    onClick={()=> handleTempType("c")}
                    />
                    Celsius
                </label>
                </div>
                <div className="radio">
                <label>
                    <input
                    type="radio"
                    value="Female"
                    checked={isF}
                    onClick={()=> handleTempType("f")}
                    onChange={onValueChange}
                    />
                    Fahrenheit
                </label>
                </div>
            </form>
            <div className="arrows">
                <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                    <div onClick={() => handleCardDown()}>
                        <ImArrowLeft />
                    </div>
                </IconContext.Provider>
                <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                    <div onClick={() => handleCardUp()}>
                        <ImArrowRight />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="cardRow"> 
                {Data.map((day,i) => {
                    return(i + firstCard < cardNum && (
                            <Card className="card" key={i}>
                                <Card.Body className={i+firstCard === activeCard ? "cardActive":""} >
                                    <Card.Text>
                                        Temp:
                                    </Card.Text>
                                    <Card.Text>
                                        {(average[i+firstCard]).toString()}
                                    </Card.Text>
                                    <Card.Text>
                                        Date:
                                    </Card.Text>
                                    <Card.Text>
                                        {Data[i+firstCard].date}
                                    </Card.Text>
                                </Card.Body>
                            </Card> )
                    )
                })}
            </div>
    
            <div className="chart">
                <Chart
                    width={'1000px'}
                    height={'500px'}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={bar}
                />
            </div>
        </div>
    
}

export default Home;
