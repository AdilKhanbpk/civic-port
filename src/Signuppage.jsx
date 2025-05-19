import React, { useState  , useEffect} from 'react';
import Logo from './Components/Logo';
import './Signuppage.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; 
 
const Signuppage = () => {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Contact_Number: '',
    Password: '',
    Tehsil: '',
    Location: '',
  });

  const[tehsils , settehsils] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect( () => {

    const fetchtehsils =  async() => {
      try{
      const response = await axios.get('http://localhost:4000/api/gettehsils')
      console.log(response.data);
      settehsils(response.data)
      }catch(error){
         console.log('Error Fetching Tehsils');
      }
    };
   fetchtehsils();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/signup', formData);
      console.log('Signup Successful', response.data);

      // Store user email in localStorage
      // localStorage.setItem('userEmail', formData.Email);
      navigate('/signin'); // Redirect to the UserDashboard after successful signup

      // Reset form data
      setFormData({ 
        First_Name: '',
        Last_Name: '',
        Email: '',
        Contact_Number: '',
        Password: '',
        Tehsil: '',
        Location: '',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Email already exists');
      } else {
        alert('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <Logo /> */}
      {loading ? (
        <ClipLoader color="#00BFFF" loading={loading} size={50} />
      ) : (
        <div className="signup-container">
          <div className="inner-container2">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="name-group">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    name="First_Name"
                    value={formData.First_Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    name="Last_Name"
                    value={formData.Last_Name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-between' , width:'100%'}}>
              <div className="form-group" style={{width:'48%'}}>
                <label>Email</label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{width:'48%'}}>
                <label>Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="Contact Number"
                  name="Contact_Number"
                  value={formData.Contact_Number}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                /> 
              </div>
              <div className="tehsil">
                <label>Tehsil</label>
                <select
                  required
                  name="Tehsil"
                  value={formData.Tehsil}
                  onChange={handleChange}
                >
                  <option value="">Select Your Tehsil</option>
                  {tehsils.map((tehsil , index) => 
                    <option key={index} value={formData.tehsil}> {tehsil.tehsil} </option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  required
                  placeholder="Location"
                  name="Location"
                  value={formData.Location}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-button">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signuppage;
