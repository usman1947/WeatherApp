import React, { Component} from 'react';
import {ImArrowRight ,ImArrowLeft} from "react-icons/im"
import {IconContext} from "react-icons"
import {Card} from 'react-bootstrap';
import './App.css'
import Datas from './data.json';
import { Chart } from "react-google-charts";

const apidata = true;
var average = [0,0,0,0,0]
let temparray = []
var bar = [
            ["Time","Temprature"],
            ["00:00",20],
            ["03:00",23],
            ["06:00",24],
            ["09:00",25],
            ["12:00",27],
            ["15:00",22],
            ["18:00",23],
            ["21:00",20],

            ]
var temptype = "C"


export default class Home extends Component {

  constructor(props){
    super(props);
    this.state={
        'cardnum' : 3, 
        'firstcard':0,
        'isC':true,
        'isF':false,
        'showbar':false,
        'currenttemp':'C',
        'bartemp' : 'C',
        'activeCard':0
        }

    Datas.map((data,i) => {
        var adder = 0
        for (let [key, value] of Object.entries(data)){
            if (key!= "date"){

                adder = adder + value 
          }
        average[i] = adder/8
          
        }

    })

    this.handleBarShow(this.state.activeCard)

  }
    


    handleCardUp = () => {

        var cn = this.state.cardnum
        var fc = this.state.firstcard
        var ac = this.state.activeCard

        if (cn < 5){
            this.setState( {"cardnum" : cn + 1,"firstcard" : fc+ 1})
        }

        if(ac < 4){
            this.setState({activeCard:ac+1})
            this.handleBarShow(ac+1)

        }
      
    }

    handleCardDown = () => {

        var cn = this.state.cardnum
        var fc = this.state.firstcard
        var ac = this.state.activeCard

        if (this.state.cardnum > 3){
            this.setState( {"cardnum" : cn - 1,"firstcard" : fc- 1})
        }

        if(ac > 0){
            this.setState({activeCard:ac-1})
            this.handleBarShow(ac-1)

        }
        
      
    }



    handleTempType =(type) => {
        if(type == "f" && this.state.currenttemp !== "F"){
            for (let i = 0;i<5;i++){
                average[i] = average[i] * 9/5 + 32
            }

            temptype = "F"
            this.handleBarShow(this.state.activeCard)
            this.setState({'isC':false,'isF':true,'currenttemp':"F"})

        }
        else if(type == "c" && this.state.currenttemp !== "C"){
            for (let i = 0;i<5;i++){

                average[i] = (average[i] - 32) * 5/9
            }
        
            temptype = "C"
            this.handleBarShow(this.state.activeCard)
            this.setState({'isC':true,'isF':false,'currenttemp':"C"})
        }
    }

    handleBarShow=(i)=>{

        temparray = []
        for (let [key, value] of Object.entries(Datas[i])){
            if (key!= "date"){

                temparray.push(value) 
          }
        }

        if (temptype === "F"){
            for (let i = 0;i<8;i++){
                temparray[i] = temparray[i] * 9/5 + 32
            }
        }
        
        
        for(let k=1; k<9;k++){
             bar[k][1] = temparray[k-1]+temptype
        }
         
        this.setState({showbar:true,activeCard:i,bartemp:temptype})
}


    render() {

     
       if (!apidata){
           return (<div className="App-header" >Loading ...</div>)
       }
        
        
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
                        Celcius
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

                <div className="cardsrow"> 


                {Datas.map((day,i)=>{
                    
                    return(

                        i + this.state.firstcard < this.state.cardnum &&(
                            <Card className="card" key={i}>

                            <Card.Body className={i+this.state.firstcard == this.state.activeCard ? "cardactive":""} >

                                <Card.Text>
                                    Temp:
                                </Card.Text>

                                <Card.Text>
                                    {(average[i+this.state.firstcard]).toString()}
                                </Card.Text>


                                <Card.Text>
                                    Date:
                                </Card.Text>


                                <Card.Text>
                                    {Datas[i+this.state.firstcard].date}
                                </Card.Text>

                            </Card.Body>
                            </Card>
                        )
                        
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
                   
                    // For tests
                    rootProps={{ 'data-testid': '2' }}
                />

                </div>
                
            </div >
        )
    
}
}
