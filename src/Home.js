import React, { useState } from 'react';
import { ImArrowRight, ImArrowLeft } from "react-icons/im"
import { IconContext } from "react-icons"
import { Card } from 'react-bootstrap';
import './App.css'
import Data from './data.json';
import { Chart } from "react-google-charts";
import { useEffect } from 'react';

export const Home = () => {

    const [cardNum, setCardNum] = useState(3)
    const [firstCard, setFirstCard] = useState(0)
    const [isC, setIsC] = useState(true)
    const [isF, setIsF] = useState(false)
    const [currentTemp, setCurrentTemp] = useState('C')
    const [tempType, setTempType] = useState('C')
    const [activeCard, setActiveCard] = useState(0)
    const [average, setAverage] = useState([0,0,0,0,0])
    const [chartData, setChartData] = useState([
        ["Time","Temperature"],
        ["00:00",20],
        ["03:00",23],
        ["06:00",24],
        ["09:00",25],
        ["12:00",27],
        ["15:00",22],
        ["18:00",23],
        ["21:00",20],

        ])

    useEffect(() => {
        let tempArray = []
        Data.forEach((data, i) => {
            let adder = 0
            for (let [key, value] of Object.entries(data)){
                if (key !== "date")
                    adder = adder + value 

            tempArray[i] = adder/8
            }
        })
        setAverage(tempArray)
        handleBarShow(activeCard, tempType)
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
            handleBarShow(ac+1, tempType)
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
            handleBarShow(ac-1, tempType)
        }
    }

    function handleTempType(){
        let tempArray = []
        if(currentTemp === "C"){
            tempArray = average.map(a => a * 9/5 + 32)
            setIsC(false)
            setIsF(true)
            setCurrentTemp("F")
            setTempType("F")
            handleBarShow(activeCard, "F")
        }
        else{
            
            tempArray = average.map(a => (a - 32) * 5/9)
            setIsC(true)
            setIsF(false)
            setCurrentTemp("C")
            setTempType("C")
            handleBarShow(activeCard, "C")
        }
        setAverage(tempArray)
    }

    function handleBarShow(i, tempType){
        let tempArray = []
        let tempChartData = chartData
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
            tempChartData[k][1] = tempArray[k-1]+tempType
        }
        setChartData([...tempChartData])
        setActiveCard(i)
    }

    function onValueChange(){
        console.log("onValueChange")
    }

    return  <div className="App" >
            <form className="form">
                <div className="radio">
                <label>
                    <input
                    type="radio"
                    value="C"
                    checked={isC}
                    onChange={onValueChange}
                    onClick={()=> handleTempType()}
                    />
                    Celsius
                </label>
                </div>
                <div className="radio">
                <label>
                    <input
                    type="radio"
                    value="F"
                    checked={isF}
                    onClick={()=> handleTempType()}
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
                    data={chartData}
                />
            </div>
        </div>
    
}

export default Home;
