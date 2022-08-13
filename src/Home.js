import React, { useState } from 'react';
import { ImArrowRight, ImArrowLeft } from "react-icons/im"
import { IconContext } from "react-icons"
import { Card } from 'react-bootstrap';
import './App.css'
import Data from './data.json';
import { Chart } from "react-google-charts";
import { useEffect } from 'react';

export const Home = () => {

    const [isC, setIsC] = useState(true)
    const [tempType, setTempType] = useState('C')
    const [activeCard, setActiveCard] = useState(0)
    const [renderCards, setRenderCards] = useState([])
    const [average, setAverage] = useState()
    const [chartData, setChartData] = useState()

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
        handleChartData(activeCard, tempType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[Data])

    useEffect(() => {
        let renderedCards = [...Data]
        const startIndex = (activeCard - 2) <= 0 ? 0 : (activeCard - 2)
        const activeCardIndexList = renderCards.map(card => Data.indexOf(card))
        if (!activeCardIndexList.find(index => index === activeCard))
            setRenderCards(renderedCards.splice(startIndex, 3))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activeCard])

    function handleNext(){
        const newActiveCardIndex = ((activeCard+1) % Data.length)
        setActiveCard(newActiveCardIndex)
        handleChartData(newActiveCardIndex, tempType)
    }

    function handleBack(){
        const newActiveCardIndex = activeCard - 1 < 0 ? Data.length - 1 : activeCard - 1
        setActiveCard(newActiveCardIndex)
        handleChartData(newActiveCardIndex, tempType)
    }

    function handleTempType(){
        const isActiveTempTypeC = tempType === "C"
        const updatedType = isActiveTempTypeC ? "F" : "C"
        setIsC(!isActiveTempTypeC)
        setTempType(updatedType)
        handleChartData(activeCard, updatedType)
        setAverage(isActiveTempTypeC ? average.map(a => a * 9/5 + 32) : average.map(a => (a - 32) * 5/9))
    }

    function handleChartData(activeDayIndex, tempType){
        let tempChartData = [["00:00"], ["03:00"], ["06:00"], ["09:00"], ["12:00"], ["15:00"], ["18:00"],["21:00"]]
        let dayTempData = {...Data[activeDayIndex]}
        delete dayTempData.date
        let tempValueArray = Object.values(dayTempData)
        if (tempType === "F")
            tempValueArray = tempValueArray.map( temp =>  temp * 9/5 + 32)
        tempChartData = tempChartData.map( (time,index) => [...time, tempValueArray[index]+tempType])
        setChartData([...tempChartData])
        setActiveCard(activeDayIndex)
    }

    return  <div className="App" >
            <form className="form">
                <div className="radio">
                <label>
                    <input
                    type="radio"
                    value="C"
                    checked={isC}
                    onChange={()=>{}}
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
                    checked={!isC}
                    onClick={()=> handleTempType()}
                    onChange={()=>{}}
                    />
                    Fahrenheit
                </label>
                </div>
            </form>
            <div className="arrows">
                <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                    <div onClick={() => handleBack()}>
                        <ImArrowLeft />
                    </div>
                </IconContext.Provider>
                <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                    <div onClick={() => handleNext()}>
                        <ImArrowRight />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="cardRow"> 
                {renderCards.map((data) => {
                    const index = Data.indexOf(data)
                    return <Card className="card" key={index}>
                                <Card.Body className={ index === activeCard ? "cardActive":"" } >
                                    <Card.Text>
                                        Temp:
                                    </Card.Text>
                                    <Card.Text>
                                        {(average[index]).toString()}
                                    </Card.Text>
                                    <Card.Text>
                                        Date:
                                    </Card.Text>
                                    <Card.Text>
                                        {Data[index].date}
                                    </Card.Text>
                                </Card.Body>
                            </Card> 
                })}
            </div>
            {chartData &&
            <div className="chart">
                <Chart
                    width={'1000px'}
                    height={'500px'}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={[["Time","Temperature"], ...chartData]}
                />
            </div>}
        </div>
    
}

export default Home;
