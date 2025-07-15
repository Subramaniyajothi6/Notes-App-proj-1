import { useEffect, useReducer, useState } from "react";
import { Link, Outlet } from "react-router";
import React, { lazy, Suspense } from "react";


const MdOutlinePushPin = lazy(() =>
  import("react-icons/md").then((module) => ({ default: module.MdOutlinePushPin }))
);

const Homepage = ({ notes, setNotes }) => {

  // const [open, setOpen] = useState(false)

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);



  const initialState = {
    title: '', description: '', tags: ''
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'title':
        return { ...state, title: action.payload };
      case 'description':
        return { ...state, description: action.payload }
      case 'tags':
        return { ...state, tags: action.payload }
      case 'reset':
        return { title: '', description: '', tags: '' }
    }

  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [editingId, setEditingId] = useState(null);
  const [searchquery, setSearchquery] = useState('')
  const [tagfilter, setTagfilter] = useState('');

  const handleEdit = (id) => {
    handleoverlay(id)
    const notetoedit = notes.find((i) => (i.id === id))
    if (notetoedit) {
      dispatch({ type: 'title', payload: notetoedit.title })
      dispatch({ type: 'description', payload: notetoedit.description })
      dispatch({ type: 'tags', payload: notetoedit.tags || '' })
      setEditingId(id)
    }
  }

  const [pinordercount, setpinordercount] = useState(1)

  const handlepin = (id) => {

    const updatednotes = notes.map((note) => {
      if (note.id === id) {
        if (!note.pinned) {
          return {
            ...note,
            pinned: true,
            pinorder: pinordercount
          }
        }
        else {
          return {
            ...note,
            pinned: false,
            pinorer: null
          }

        }

      }
      return note
    })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        if (a.pinned && b.pinned) return a.pinorder - b.pinorder

        return 0
      })


    if (notes.find(note => note.id === id && !note.pinned)) {
      setpinordercount(prev => prev + 1);
    }

    setNotes(updatednotes);
    return updatednotes;
  };

  const handleArchived = (id) => {
    const archivednotes = notes.map((note) => {
      return note.id === id ? { ...note, archived: true } : note
    })
    setNotes(archivednotes)
    localStorage.setItem("notes", JSON.stringify(archivednotes))
  }


  const handletrash = (id) => {
    if (notes.find((note) => note.id === id).archived) {
      let deletenote = notes.map((note) => {
        return note.id === id ? { ...note, archived: false, trashed: !note.trashed } : note
      })
      setNotes(deletenote)
      localStorage.setItem("notes", JSON.stringify(deletenote));
    }

    else {
      const updatedNotes = notes.map((note) => {
        if (note.id === id) {
          return { ...note, trashed: true };
        }
        return note;
      });

      const trashedNotes = updatedNotes.filter(note => note.trashed);


      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      localStorage.setItem("trashed", JSON.stringify(trashedNotes));
    }

  }


  const handleoverlay = () => {


    const overlay = document.getElementById("overlay");
    if (overlay.classList.contains("hidden")) {
      overlay.classList.remove("hidden")
      overlay.classList.add("flex")
      console.log("overlay flex");
    }
    else {
      overlay.classList.add("hidden")
      overlay.classList.remove("flex")
      console.log("overlay hidden");
    }

  }


  return (
    <>
      <div className="bg-gray-800 h-screen text-white relative ">
        <div className=" container mx-auto">
          {/* Headers */}
          <h1 className="text-3xl py-2 font-bold text-center ">Notes App</h1>

          <div className="flex border p-2 mt-4 justify-between flex-col md:flex-row items-center">

            <div className=" border-white flex  flex-col w-3/4 md:flex-row gap-3 md:gap-0 ">
              <input type="text" className=" mx-2 py-1 px-2 text-white border  w-8/9" placeholder="Search Note" value={searchquery} onChange={(e) => { return setSearchquery(e.target.value) }} />
              <input type="text" className=" mx-2 py-1 px-2 text-white border w-8/9 " placeholder="Search by tag" value={tagfilter} onChange={(e) => { return setTagfilter(e.target.value) }} />
            </div>


            <div className="flex w-59  gap-2  my-2">
              <button onClick={() => { handleoverlay() }} className="bg-green-600 py-1 px-2 rounded-md ">
                + Note
              </button>

              <Link to="/archived">
                <button className="bg-amber-600 hover:bg-amber-700 py-1 px-2 rounded-md ">Archived</button>
              </Link>
              <Link to={"/trash"}>
                <button className="bg-red-600 hover:bg-red-700 py-1 px-2 rounded-md ">Trash</button>
              </Link>

            </div>
          </div>

          {/* Over Lay To Create New Note */}
          <div id="overlay" className=" hidden justify-center items-center absolute bg-black/50 h-screen w-screen top-0 left-0 z-10 "  >
            <div className="bg-white p-4 w-90 sm:w-150 h-70 md:w-160  rounded-md">
              <form action='' onSubmit={(e) => {
                if (editingId) {
                  e.preventDefault();
                  const updatednotes = notes.map((note) => {

                    return (note.id === editingId ? { ...note, ...state, id: editingId } : note)
                  })
                  setNotes(prev => {

                    const updatednotes1 = [...prev, updatednotes];
                    localStorage.setItem('notes', JSON.stringify(updatednotes1))
                    return updatednotes
                  });
                  setEditingId(null);



                }
                else {
                  e.preventDefault(); const newnote = { ...state, id: Date.now(), pinned: false, archived: false, trashed: false, };
                  setNotes(prev => {

                    const updatednotes = [...prev, newnote];
                    localStorage.setItem('notes', JSON.stringify(updatednotes))
                    return updatednotes
                  })
                  console.log('clicked for saving inside the localstorage');

                }
                dispatch({ type: 'reset' })
              }} className="flex flex-col justify-center relative text-black" >
                <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 absolute top-0 right-0 rounded-md" onClick={handleoverlay} type="button">close</button>
                <h2 className="text-3xl">New Note</h2>
                <input type="text" className="text-black my-3 text-lg bg-gray-200 rounded-md px-2 py-0.5" placeholder="Title" value={state.title} onChange={(e) => { dispatch({ type: 'title', payload: e.target.value }) }} />
                <textarea className="bg-gray-200 text-md rounded-md px-2 py-0.5" name="Description" placeholder="Write Your Note Here" value={state.description}
                  onChange={(e) => { dispatch({ type: 'description', payload: e.target.value }) }}></textarea>
                <input type="text" className="text-black my-3 text-md bg-gray-200 rounded-md px-2 py-0.5" placeholder="Tags" value={state.tags} onChange={(e) => { dispatch({ type: 'tags', payload: e.target.value }) }} />

                <button className=" py-0.5 px-3 rounded-md mt-1 mx-auto text-md bg-blue-600 text-white" type="submit">save</button>
              </form>
            </div>
          </div>





          <div className="text-white grid bg-gray-800 gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        xl:grid-cols-5 py-10 mx-3 sm:mx-0 ">

            {
              notes.filter(i => !i.archived && !i.trashed).filter((i) => {
                const matchsearch =
                  (i.title.toLowerCase().includes(searchquery.toLowerCase()) ||
                    i.description.toLowerCase().includes(searchquery.toLowerCase())
                  )
                const matchtag = tagfilter && i.tags.toLowerCase().includes(tagfilter.toLowerCase())
                return matchsearch || matchtag
              }
              )
                .map((i) => {
                  return (
                    <div key={i.id} className=" bg-gray-700 font-medium rounded-md  gap-2 p-2 relative hover:scale-102 transition duration-300">
                      <h2>Title : {i.title}</h2>
                      <p>Description : {i.description}</p>
                      <p>Tag : {i.tags}</p>


                            <Suspense fallback={<span>📌</span> }
                            > <MdOutlinePushPin className="absolute top-1 right-1 text-2xl text-amber-600 opacity-80 hover:opacity-100 " onClick={() => { handlepin(i.id) }}></MdOutlinePushPin></Suspense>

                      <div className="flex  justify-between mt-2 ">
                        <button type="button" className="bg-purple-600 hover:bg-purple-700 py-1 px-2.5 rounded-2xl" onClick={() => { handleEdit(i.id) }} >Edit</button>
                        <button type="button" className="bg-amber-600 py-1 px-2.5 rounded-2xl hover:bg-amber-700  " onClick={() => {
                          handleArchived(i.id)
                          localStorage.setItem("archived", JSON.stringify(notes.filter(i => { return i.archived })))
                        }}>Archive </button>
                        <button type="button" className="bg-red-600 opacity-80 hover:opacity-100 hover:bg-red-700 py-1 px-2.5 rounded-2xl " onClick={() => { handletrash(i.id) }}>delete </button>
                      </div>
                    </div>
          )
                })

            }

        </div>








      </div>
    </div >

    </>
  )
}

export default Homepage