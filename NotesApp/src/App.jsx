import { useState } from 'react'
import Home from './Homepage/Home'
import Login from './Homepage/login'
import Signup from './Homepage/Signup'
import Dash from './DashBoard/dash'
import Create from './DashBoard/Create'
import Save from './DashBoard/save'
import Profile from './DashBoard/profile'
import Favourite from './DashBoard/favourite'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'



function App() {
  const [count, setCount] = useState(0)
  const Router=createBrowserRouter([{
    path:'/',
    element:<div><Home/></div>
  },
  {
    path:'/login',
    element:<div><Login/></div>
  },
  {
    path:'/signup',
    element:<div><Signup/></div>
  },
  {
    path:'/dashboard',
    element:<div><Dash/></div>,
  children: [
      {
        path: 'create',
        element: <Create />
      },
      {
        path: 'save',
        element: <Save />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'favourite',
        element: <Favourite />
      },
    ]
  }
])

  return (
    <>
    <RouterProvider router={Router}></RouterProvider>
    </>
  )
}

export default App
