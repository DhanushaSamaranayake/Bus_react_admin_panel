import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { serverTimestamp, set ,ref} from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import{db,auth,storage} from "../../firebase";
import {uploadBytesResumable, getDownloadURL,ref as storageReff} from "firebase/storage";
import { useNavigate } from "react-router-dom";






const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per,setPerc] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name
      console.log(name);

      const storageRef = storageReff(storage,file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    setPerc(progress)
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
      default:
        break;
    }
  }, 
  (error) => {
    console.log(error);
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //console.log('File available at', downloadURL);
    setData((prev)=>({...prev, img:downloadURL}));
    });
  }
);
    };
    file && uploadFile();
  },[file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    
    setData({...data,[id]:value});
  };

  //console.log(data);

  const handleAdd = async (e) =>{
    e.preventDefault();
    try{  
      const { email, password, ...userData } = data;
      const res = await createUserWithEmailAndPassword(auth,data.email,data.password);
      //const hashedPassword = await bcrypt.hash(data.password,10);
      await set(ref(db, 'users/'+ res.user.uid), {
          ...userData,
          email:data.email,
          id:res.user.uid,
          timeStamp:serverTimestamp(),
        });
        navigate(-1);
    }catch (error){
      console.log(error);
    }

  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Driver</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput} />
                </div>
              ))}
              <button disabled={per !== null && per<100} type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
