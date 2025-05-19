import React from "react";
import { useState } from "react";
import axios from "axios";
import './MyAdmin.css'

const MyAdmin = () =>{

    const [newtehsil , setnewtehsil] = useState('');
    const [message , setmessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setmessage('')
        
    try{
         const response = await axios.post('http://localhost:4000/api/addTehsil',{newtehsil});
         setmessage('Tehsil Added Successfully')
         setnewtehsil('');

    }catch(error){
      if(error.response && error.response.status === 400){
         setmessage('Tehsil Already Exists')
      }else{
        setmessage('A Broblem Occured while Adding tehsil')
      }
       
    }    
    }

    return(
        <div className="adminpage">
           <div className="admin">
            <h3>Add New Tehsil</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="tehsilname">Tehsil Name</label>
                <div className="input-container">
                  <input type="text" value={newtehsil} onChange={(e) => setnewtehsil(e.target.value)} required/>
                  <button type="submit">Add Tehsil</button>
                </div>
            </form>

            <p>{message}</p>
           </div>
        </div>
    )
}
export default MyAdmin;