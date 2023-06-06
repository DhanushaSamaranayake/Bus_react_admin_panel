import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { ref,onValue } from "firebase/database";
import { db} from "../../firebase";


const Widget = ({ type }) => {
  let data;

  const [userCount, setUserCount] = useState('');
  const [totalEarning, setTotalEarning] = useState('');

  useEffect(() => {
    let earningsRef;
    let userCountRef;
    if (type === "driver") {
      userCountRef = ref(db, "drivers/");
      
    } else if (type === "user") {
      userCountRef = ref(db, "users/");
    }else if(type === "earning"){
      earningsRef = ref(db, "drivers/");
    }else if(type === "active"){
      userCountRef = ref(db, "activeDrivers/");
    }
    if (userCountRef) {
      onValue(userCountRef, (snapshot) => {
        const users = snapshot.val();
        const count = users ? Object.keys(users).length : 0;
        setUserCount(count);
      });
    }
    if(earningsRef){
      onValue(earningsRef,(snapshot)=>{
        const drivers = snapshot.val();
        let totalEarning = 0;
        if(drivers){
          Object.keys(drivers).forEach((key)=>{
            
            totalEarning +=parseFloat(drivers[key].earnings);
          })
          setTotalEarning(totalEarning);
        }
      })
    }
  }, [type]);
  


  switch (type) {
    case "driver":
      data = {
        title: "DRIVERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <DirectionsBusOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "View all orders",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: " TOTAL EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "active":
      data = {
        title: "ACTIVE DRIVERS",
        isMoney: false,
        link: "See details",
        icon: (
          <OnlinePredictionIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "LKR"} {totalEarning} {userCount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
