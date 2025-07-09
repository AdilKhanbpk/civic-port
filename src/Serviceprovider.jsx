import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext.js";
import { supabase } from "./supabaseClient.js";
import './ServiceProvider.css';

const Serviceprovider = () => {
    const [Tehsil , setTehsil] = useState('')
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserTehsil = async () => {
            if (!user) return;

            try {
                // Fetch user profile from Supabase
                const { data: profile, error } = await supabase
                    .from('usersdb')
                    .select('tehsil')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (profile) {
                    setTehsil(profile.tehsil);
                    console.log('User tehsil:', profile.tehsil);
                }
            } catch (error) {
                console.error('Error fetching user tehsil:', error);
            }
        };

        fetchUserTehsil();
    }, [user, navigate]);


    // Remove old fetchProtectedData - no longer needed with Supabase Auth


    return(
        <div>
          <div className="serviceheading" style={{marginTop : '30px'}}><p>Service Providers</p></div>
            <div className="card">
          <div className="card1">
           <h1>TMA {Tehsil}</h1>
           <br />
           <h2>Tehsil Municipal Administration {Tehsil}</h2>
         </div>
         <div className="card2">
           <div className="card2-1">
             <p className="numberofrequests">00</p>
             <p className="resolved">Requests Resolved All times</p>
           </div>

           <div className="card2-2" style={{alignItems:'center', marginTop:'20px', justifyContent:'center' , display:'flex'}}>
            <div style={{marginBottom:'15px'}}>
            <Link to={'/newrequest'} >
                  <span style={{display:"flex" , paddingTop:'5px', justifyContent:'center',alignItems:'center', textDecoration:'none'}}>
                    <img src="plus.png" alt="" style={{width:'50px'}}/><h3 style={{textDecoration:'none' , margin:'5px'}}>New Report</h3></span>
            </Link>
            </div>
           </div>

         </div>
        </div>
        </div>
    )
}

export default Serviceprovider;