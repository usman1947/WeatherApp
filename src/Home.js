import React, { Component} from 'react';
import {ImArrowRight ,ImArrowLeft} from "react-icons/im"
import {IconContext} from "react-icons"
import {Card} from 'react-bootstrap';
import './App.css'
import Data from './data.json';
import { Chart } from "react-google-charts";

const apiData = true;
var average = [0,0,0,0,0]
let tempArray = []

var bar = [
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
var tempType = "C"
export default class Home extends Component {

  constructor(props){
    super(props);
    this.state={
        'cardNum' : 3, 
        'firstCard':0,
        'isC':true,
        'isF':false,
        'showBar':false,
        'currentTemp':'C',
        'barTemp' : 'C',
        'activeCard':0
        }

    Data.forEach((data,i) => {
        var adder = 0
        for (let [key, value] of Object.entries(data)){
            if (key !== "date")
                adder = adder + value 
        average[i] = adder/8
        }
    })
    this.handleBarShow(this.state.activeCard)
  }

    handleCardUp = () => {
        var cn = this.state.cardNum
        var fc = this.state.firstCard
        var ac = this.state.activeCard

        if (cn < 5)
            this.setState( {"cardNum" : cn + 1,"firstCard" : fc+ 1})

        if(ac < 4){
            this.setState({activeCard:ac+1})
            this.handleBarShow(ac+1)
        }
    }

    handleCardDown = () => {
        var cn = this.state.cardNum
        var fc = this.state.firstCard
        var ac = this.state.activeCard

        if (this.state.cardNum > 3)
            this.setState( {"cardNum" : cn - 1,"firstCard" : fc- 1})

        if(ac > 0){
            this.setState({activeCard:ac-1})
            this.handleBarShow(ac-1)
        }
    }

    handleTempType =(type) => {
        if(type === "f" && this.state.currentTemp !== "F"){
            for (let i = 0; i < 5; i++){
                average[i] = average[i] * 9/5 + 32
            }
            tempType = "F"
            this.handleBarShow(this.state.activeCard)
            this.setState({'isC':false,'isF':true,'currentTemp':"F"})
        }
        else if(type === "c" && this.state.currentTemp !== "C"){
            for (let i = 0;i<5;i++){
                average[i] = (average[i] - 32) * 5/9
            }
            tempType = "C"
            this.handleBarShow(this.state.activeCard)
            this.setState({'isC':true,'isF':false,'currentTemp':"C"})
        }
    }

    handleBarShow=(i)=>{
        tempArray = []
        for (let [key, value] of Object.entries(Data[i])){
            if (key !== "date")
                tempArray.push(value) 
        }
        if (tempType === "F"){
            for (let i = 0;i<8;i++){
                tempArray[i] = tempArray[i] * 9/5 + 32
            }
        }
        for(let k=1; k<9;k++){
            bar[k][1] = tempArray[k-1]+tempType
        }
        this.setState({showBar:true,activeCard:i,barTemp:tempType})
    }


    render() {
     
        if (!apiData)
           return (<div className="App-header" >Loading ...</div>)
        
        return (

            <div className="App" >
                <form className="form">
                    <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Male"
                        checked={this.state.isC}
                        onChange={this.onValueChange}
                        onClick={()=> this.handleTempType("c")}
                        />
                        Celsius
                    </label>
                    </div>
                    <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Female"
                        checked={this.state.isF}
                        onClick={()=> this.handleTempType("f")}
                        onChange={this.onValueChange}
                        />
                        Fahrenheit
                    </label>
                    </div>
                </form>
                <div className="arrows">
                    <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                        <div onClick={() => this.handleCardDown()}>
                            <ImArrowLeft />
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ style: {fontSize: '100px', color: "#003153"}}}>
                        <div onClick={() => this.handleCardUp()}>
                            <ImArrowRight />
                        </div>
                    </IconContext.Provider>
                </div>
                <div className="cardRow"> 
                    {Data.map((day,i) => {
                        return(i + this.state.firstCard < this.state.cardNum && (
                                <Card className="card" key={i}>
                                    <Card.Body className={i+this.state.firstCard === this.state.activeCard ? "cardActive":""} >
                                        <Card.Text>
                                            Temp:
                                        </Card.Text>
                                        <Card.Text>
                                            {(average[i+this.state.firstCard]).toString()}
                                        </Card.Text>
                                        <Card.Text>
                                            Date:
                                        </Card.Text>
                                        <Card.Text>
                                            {Data[i+this.state.firstCard].date}
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
            </div >
        )
    }
}
