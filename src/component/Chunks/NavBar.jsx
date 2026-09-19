import navbar from '../style/chunks/NavBar.module.css';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Cancel } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const NavBar = () =>{

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate("/school/register");
  }

  const navigateToLogin = () => {
    navigate("/school/login");
  }

  const navigateToService = () => {
    navigate("/services");
  }

  const navigateToAboutUs = () => {
    navigate("/about-us");
  }


   const navigateToContactUs = () => {
    navigate("/contact-us");
  }

  const toggleDrawer = (value) => () => {
    setOpen(value);
  };


  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>

      <ul className={[navbar["list"], navbar["drawer__list"], navbar[""]].join(' ')}>
        
        <li onClick={() => navigateToLogin()}  className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>  <span class={[navbar["badge"], navbar["badge--secondary"], navbar['list--badge']].join(' ')}>Login</span></a></li>
         
          <li onClick={() => navigateToService()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>Service</a></li>
          <li onClick={() => navigateToAboutUs()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>About Us</a></li>
          <li onClick={() => navigateToContactUs()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>Contact Us</a></li>
         
         
         
          <li className={navbar["nav__item"]}>
           
          <button onClick={() => navigateToRegister()} className={[navbar['btn'], navbar['btn--icon']].join(' ')}>
              <svg className={[navbar["icon"], navbar["icon--white"]].join(' ')}>
                  <use href="/images/sprite.svg#rocket"></use>
                </svg>
              Get Started
          </button>

          </li>
          
         
        </ul>
      
      </List>
    </Box>
  );






    return (
        
        <div className={[navbar['nav'], navbar['collapsible']].join(' ')}>
        <a className={navbar["logo__link"]} href="#"><img src="/images/logo.png" alt="miqwii logo"/></a>
      

      { open ?  

 (
      <IconButton onClick={toggleDrawer(false)} color="inherit">
 <div className={navbar["collapsible__icon"]}>
   <svg className={[navbar["icon"], navbar["icon--primary"], navbar["nav__toggler"], navbar[""]].join(' ')}>
   <Cancel sx={{ color: "#0e387a", fontSize: 30 }} />
   </svg>

  </div>
      </IconButton>
  ) :
        
     (  <IconButton onClick={toggleDrawer(true)} color="inherit">
         <svg className={[navbar["icon"], navbar["icon--primary"], navbar["nav__toggler"], navbar[""]].join(' ')}>
                  
                   <MenuIcon sx={{ color: "#0e387a", fontSize: 30 }} />
                
      </svg>  
      </IconButton>
     
    

       ) 

      }
      

         
      <Drawer sx={{ 
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(157, 152, 202, 0.3)", // Transparent backdrop
          },  
          }} 
       open={open}
       onClose={toggleDrawer(false)}>
         
        {DrawerList}
      </Drawer>
           
          <ul className={[navbar["list"], navbar["nav__list"], navbar[""]].join(' ')}>
        
  
        <li onClick={() => navigateToLogin()}  className={navbar["nav__item"]}><a style={{cursor: "pointer"}} >  <span class={[navbar["badge"], navbar["badge--secondary"], navbar['list--badge']].join(' ')}>Login</span></a></li>
         
          <li onClick={() => navigateToService()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}} >Service</a></li>
          <li onClick={() => navigateToAboutUs()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>About Us</a></li>
          <li onClick={() => navigateToContactUs()} className={navbar["nav__item"]}><a style={{cursor: "pointer"}}>Contact Us</a></li>
         
           
            <li className={navbar["nav__item"]}>
             
            <button onClick={() => navigateToRegister()} className={[navbar['btn'], navbar['btn--icon']].join(' ')}>
                <svg className={[navbar["icon"], navbar["icon--white"]].join(' ')}>
                    <use href="/images/sprite.svg#rocket"></use>
                  </svg>
                Get Started
            </button>

            </li>
            
           
          </ul>



          
    </div>
    );
    
    }
export default NavBar;

 