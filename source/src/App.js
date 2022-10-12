
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  //API KEY: AIzaSyAxttIzv3FOczRhMP3_ziRPr1Dsp94_rfg

  /*
  Using google places API to get the list of places of food places near the user's location
  */

  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [areaData, setAreaData] = useState([])
  const [distance, setDistance] = useState(1000)
  const [budget, setBudget] = useState(0)

  const APIKEY = "AIzaSyAxttIzv3FOczRhMP3_ziRPr1Dsp94_rfg";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${latitude},${longitude}&opennow&radius=${distance}&maxprice=${budget}&type=restaurant&key=${APIKEY}`;

  
  useEffect(()=>{
    if (navigator.geolocation) { // device can return its location
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

        });
    }else{
        setLatitude("1.360321")
        setLongitude("103.846733")
    }
  },[])

  // useEffect(()=>{
  //   if (latitude && longitude && distance&&APIKEY){
  //     console.log(url)
  //     fetchNearbyFood()

  //   }
  // },[latitude,longitude,APIKEY,distance])

  const fetchNearbyFood = async () => {
    // alert("fetching")
    const response = await fetch(url,{
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basicauth`,
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Origin':"http://localhost:3000",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        'Access-Control-Allow-Credentials': true,
        "Accept": "application/json"
      }
    });
    // alert("fetched")
    const data = await response.json();
    // alert(data["results"][0]);
    setAreaData(data.results)
  }

  const repeatedChar = (string,n) => {
    return string.repeat(n);
  }


  return (
    <div className="App" >
      <div className="container">
        <h1 className="title">What to Eat</h1>
        <h2 className="subtitle">Never go hungry again</h2>
        <p>This Web-App will use an API to get the nearby food places around you. For this to work, we will require you to turn on your location.</p>
        <div className="parameters">
          <h3>Filters</h3>
          <div className="subContainers">
            <h4>Distance</h4>
            <div className="distanceContainer">
              <button onClick={()=>{
                if (distance < 50000){
                  setDistance(distance+1000)
                }
              }}
              className="select"
              style={{marginRight:10,marginLeft:10}}
              >+</button>
              <h3>{distance}m</h3>
              <button onClick={()=>{
                if (distance > 1000){
                  setDistance(distance-1000)
                }
              }}
              className="select"
              style={{marginRight:10,marginLeft:10}}
              >-</button>
            </div>
          </div>

          <div className="subContainers">
            <h4>Budget</h4>
            <div className="distanceContainer">
              <button onClick={()=>{
                if (budget < 4){
                  setBudget(budget+1)
                }
              }}
              className="select"
              style={{marginRight:10,marginLeft:10}}
              >+</button>
              <h3>{repeatedChar("$",budget)}</h3>
              <button onClick={()=>{
                if (budget > 0){
                  setBudget(budget-1)
                }
              }}
              className="select"
              style={{marginRight:10,marginLeft:10}}
              >-</button>
            </div>
          </div>

          <button 
            className="submit" 
            onClick={fetchNearbyFood}
            style={{border:"none",padding:10,backgroundColor:"gray",color:"white",borderRadius:5,marginTop:20,minWidth:200,fontSize:17,fontWeight:"bold",boxShadow:"0px 2px 5px 0px rgba(0,0,0,0.5)"}}
          >
            Submit
          </button>
        </div>

        <div className="results">
        {areaData?areaData.map((item,index)=>{
          return(
            <button
              key={index}
              style={{
                border:"none",
                padding:10,
                backgroundColor:"white",
                color:"black",
              }}
              className="card"

              onClick={()=>{
                var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                if (isIOS){
                  window.location = (`https://maps.apple.com/?q=${item.geometry.location.lat},${item.geometry.location.lng}`)
                }else
                {
                  window.location = (`https://www.google.com/maps/search/?api=1&query=${item.geometry.location.lat},${item.geometry.location.lng}`)
                }
              }}
            >
                <h3>{item.name}</h3>
                <p>{item.vicinity}</p>
                <p>{repeatedChar("$",item.price_level)}</p>
                <h5>{item.add}</h5>
            </button>
          )
        }):null}
        </div>
      </div>
    </div>
  );
}

export default App;
