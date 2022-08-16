import React, { useState, useEffect } from 'react';
import { ImArrowRight, ImArrowLeft } from "react-icons/im"
import { IconContext } from "react-icons"
import { Card } from 'react-bootstrap';
import './App.css'
import Data from './data.json';
import { Chart } from "react-google-charts";
import { useMediaQuery } from 'react-responsive'

export const Home = () => {

    class TemperatureTypeEnum {
        static _C = "C";
        static _F = "F";
    }
    class CardDirectionEnum {
        static _NEXT = "Next";
        static _BACK = "Back";
    }
    const TimeStampsForTemperature = [["00:00"], ["03:00"], ["06:00"], ["09:00"], ["12:00"], ["15:00"], ["18:00"],["21:00"]]
    const [isC, setIsC] = useState(true)
    const [tempType, setTempType] = useState(TemperatureTypeEnum._C)
    const [activeCard, setActiveCard] = useState(0)
    const [renderCards, setRenderCards] = useState([])
    const [average, setAverage] = useState()
    const [chartData, setChartData] = useState()
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
    function getTempInF(temp){ return  temp * 9/5 + 32}
    function getTempInC(temp){ return  (temp - 32) * 5/9}

    useEffect(() => {
        setAverage(
            //calculating average temperature for each day
            Data.map(data => {
                let tempValueArray = getTemperatureArray(data)
                const sum = tempValueArray.reduce((partialSum, a) => partialSum + a, 0);
                return sum / tempValueArray.length
            })
        )
        handleChartData(activeCard, tempType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[Data])

    useEffect(() => {
        //only show one card if small screen
        if(isTabletOrMobile) 
            setRenderCards([Data[activeCard]])
        else {
            const indexOfRenderedCards = renderCards.map(card => Data.indexOf(card))
            //if active card is not rendered right now 
            if (!indexOfRenderedCards.find(index => index === activeCard)){
                let renderedCards = [...Data]
                //given there are only 3 card rendered,
                //finds the index of first rendered card based on active card
                //if active card is first card then first card to render index is 0
                //else first card to render index is active card - 2
                const firstRenderedCard = (activeCard - 2) <= 0 ? 0 : (activeCard - 2)
                //splice array at index of first rendered card
                setRenderCards([...renderedCards.splice(firstRenderedCard, 3)])
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activeCard, isTabletOrMobile])

    function handleBackAndNext(direction){
        let newActiveCardIndex
        if (direction === CardDirectionEnum._BACK){
            //if active card is first one, start from the end 
            newActiveCardIndex = activeCard - 1 < 0 ? Data.length - 1 : activeCard - 1
        } else {
            newActiveCardIndex = ((activeCard+1) % Data.length)
        }
        setActiveCard(newActiveCardIndex)
        handleChartData(newActiveCardIndex, tempType)
    }

    function handleTempType(){
        const isActiveTempTypeC = tempType === TemperatureTypeEnum._C
        const updatedType = isActiveTempTypeC ? TemperatureTypeEnum._F : TemperatureTypeEnum._C
        setIsC(!isActiveTempTypeC)
        setTempType(updatedType)
        handleChartData(activeCard, updatedType)
        setAverage(isActiveTempTypeC ? average.map(a => getTempInF(a)) : average.map(a => getTempInC(a)))
    }

    function handleChartData(activeDayIndex, tempType){
        let tempValueArray = getTemperatureArray(Data[activeDayIndex])
        if (tempType === TemperatureTypeEnum._F)
            tempValueArray = tempValueArray.map( temp =>  getTempInF(temp))
        //push temperature for each time stamp with type
        setChartData([...TimeStampsForTemperature.map((time, index) => [...time, tempValueArray[index]+tempType])])
        setActiveCard(activeDayIndex)
    }

    function getTemperatureArray(object){
        let dayTempData = {...object}
        delete dayTempData.date
        return Object.values(dayTempData)
    }

    const UserInputsComponent = () => {
        return  <>
                    <form className="form">
                        <div>
                            <label>
                                <input
                                type="radio"
                                value={TemperatureTypeEnum._C}
                                checked={isC}
                                onChange={()=>{}}
                                onClick={()=> handleTempType()}
                                />
                                Celsius
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                type="radio"
                                value={TemperatureTypeEnum._F}
                                checked={!isC}
                                onClick={()=> handleTempType()}
                                onChange={()=>{}}
                                />
                                Fahrenheit
                            </label>
                        </div>
                    </form>
                    <div className="arrows">
                        <IconContext.Provider value={{ style: {fontSize: isTabletOrMobile ? '50px' :' 100px', color: "#003153"}}}>
                            <div onClick={() => handleBackAndNext(CardDirectionEnum._BACK)}>
                                <ImArrowLeft />
                            </div>
                        </IconContext.Provider>
                        <IconContext.Provider value={{ style: {fontSize: isTabletOrMobile ? '50px' :' 100px', color: "#003153"}}}>
                            <div onClick={() => handleBackAndNext(CardDirectionEnum._NEXT)}>
                                <ImArrowRight />
                            </div>
                        </IconContext.Provider>
                    </div>
                </>
    }

    return  <div className="app">
            {!isTabletOrMobile &&
            <UserInputsComponent/>}
            <div className="cardRow"> 
                {renderCards.map((data) => {
                    const index = Data.indexOf(data)
                    return <Card className="card" key={index}>
                                <Card.Body className={ index === activeCard && "cardActive" } >
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
            <div className="chart-container">
                <Chart
                    chartType="Bar"
                    className="chart"
                    loader={<div>Loading Chart</div>}
                    data={[["Time","Temperature"], ...chartData]}
                />
            </div>}
            {isTabletOrMobile &&
            <UserInputsComponent/>}
        </div>
    
}

export default Home;
