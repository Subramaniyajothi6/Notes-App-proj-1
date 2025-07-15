import { createBrowserRouter, RouterProvider } from "react-router"
import Homepage from "./Homepage"
import Trashnotes from "./Trashnotes"
import { useState } from "react"
import Archivenotes from "./Archivenotes"
// import CreateNote from "./CreateNote"

const App = () => {
 const [notes, setNotes] = useState([])
  

  const routes = [
    {
      path: "/",
      element: <Homepage notes={notes} setNotes={setNotes} />,
    
      
    }
    ,
    {
      path:'trash',
      element:<Trashnotes notes={notes} setNotes={setNotes} />
    }
    ,{
      path:'archived',
      element:<Archivenotes notes={notes} setNotes={setNotes} />
    }
    // {
    //   path: "/create",
    //   element: <CreateNote />,
    // },
    
  ]


  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,

    },
  })



  return (
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }} />
  )
}

export default App