import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function Redirect(){

    const API_BASE_URL = "https://tinytag.onrender.com";
    const {shorturl} = useParams();
    const [validUrl, setValidUrl] = useState(true);

    useEffect(()=>{
        async function init(){
            try{
            const res = await axios.get(`${API_BASE_URL}/${shorturl}`);
            if(res.status === 200){
                setValidUrl(true);
                window.location.href = res.data;
            }
        }
        catch(err){
            setValidUrl(false);
            toast.error("Invalid Short URL");
        }
        }
        init();
    })

    return (
      <>
        <div className="text-white flex justify-center items-center mt-5 h-screen">
          {validUrl ? (
            <h2 className="text-2xl">Redirecting...</h2>
          ) : (
            <h2 className="text-2xl">Invalid Short URL</h2>
          )}
        </div>
      </>
    );
}

export default Redirect;