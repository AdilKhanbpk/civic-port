import React, { useState , useEffect } from "react";
import axios from "axios";
import './Adminsignup.css';
import Logo from "./Components/Logo";
import { useNavigate } from "react-router-dom";

const Adminsignup = () => {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    Tehsil: '',
    Secret_Key: ''
  });
  const [tehsils , settehsils] = useState([]);

  useEffect(() => {
    const fetchtehsils = async() => {
      try{
      const response = await axios.get('http://localhost:4000/api/gettehsils');
      settehsils(response.data)
    } catch(error){
         console.error('Error Fetching tehsils' , error);
         
    }
  }
fetchtehsils();
} , [])

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/adminsignup', formData);
      console.log('Signup Successful', response.data);

      if (response.status === 201) {
        navigate('/adminsignin');
      } else {
        alert('Signup failed');
      }
      setFormData({
        First_Name: '',
        Last_Name: '',
        Email: '',
        Password: '',
        Tehsil : '',
        Secret_Key: ''
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid Secret Key');
      } else if (error.response && error.response.status === 400) {
        alert('Email already exists');
      } else {
        alert('Admin Signup Failed');
      }
    }
  };

  return (
    <div>
      <Logo />
      <div className="signup-container3">
        <div className="inner-container3">
          <h2>Admin Signup</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-group">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="First_Name"
                  value={formData.First_Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="Last_Name"
                  value={formData.Last_Name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              /> 
            </div>
            <div className="tehsil">
              <label>Tehsil</label>
              <select
                name="Tehsil"
                value={formData.Tehsil}
                onChange={handleChange}
                required
              >
                <option value=''>Select Your Tehsil</option>
                {tehsils.map((tehsil , index) => 
                    <option key={index} value={formData.tehsil}>{tehsil.tehsil}</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="text"
                name="Secret_Key"
                value={formData.Secret_Key}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adminsignup;
