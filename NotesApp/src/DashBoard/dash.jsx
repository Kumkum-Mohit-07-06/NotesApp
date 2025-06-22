import React from 'react'
import { Outlet} from 'react-router-dom';
import Create from './Create'
import Save from './save'
import Sidenav from './sideNav'
import "./dash.css"
const dash = () => {
  // const router = createBrowserRouter([
  //         {
  //             path:"/create",
  //             element:<div><Create/></div>
  //         }
  //     ])
  return (
   <div style={{ display: 'flex' }}>
      <Sidenav />
      <Outlet/>
 
      </div>
   
   
  )
}

export default dash