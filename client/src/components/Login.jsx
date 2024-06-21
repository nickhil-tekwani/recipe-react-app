import React from "react";
import { Button, FormControl, Input, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';


function Login() {
  const [gender, setGender] = React.useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleRegister = () => {
    alert('submitted')
  }

  const handleLogin = () => {
    alert('logged in')
  }

  return (
    <div className="contact">
      <div class="container">
        <div class="col align-items-center my-5">
          <div class="col-lg-5">
            <h1 class="font-weight-light">Login</h1>
            <FormControl> 
              <Input placeholder="Enter Username" id="user-login"> </Input>
              <Input placeholder="Enter Password" type="password" id="pass-login"> </Input>
              <Button onClick={() => handleLogin()} type="submit"> Login </Button>
            </FormControl>
          </div>
          <hr />
          <div class="col-lg-5">
            <h1 class="font-weight-light">Register</h1>
            <FormControl> 
                <Input placeholder="Enter Username" id="user-reg" required> </Input>
                <Select
                  labelId="gender-reg"
                  id="gender-reg"
                  value={gender}
                  label="Gender"
                  onChange={handleGenderChange}
                  required
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                  <MenuItem value={"Decline"}>Decline to Say</MenuItem>
                </Select>
                <Input placeholder="Enter Age" id="age-reg" type="number" required> </Input>
                <Input placeholder="Enter Location" id="loc-reg" required> </Input>
                <Input placeholder="Enter Password" type="password" id="pass-reg" required> </Input>
                <Input placeholder="ReEnter Password" type="password" id="pass2-reg" required> </Input>
                <Button onClick={() => handleRegister()} type="submit"> Register </Button>
            </FormControl>  
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
