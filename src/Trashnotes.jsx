

import { useEffect } from "react";
import { Link } from "react-router";

const Trashnotes = ({ notes, setNotes }) => {

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    if (savedNotes.length > 0 && notes.length === 0) {
      setNotes(savedNotes);
    }
  }, [notes.length, setNotes]);

  const handleRestore = (id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, trashed: false } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    const trashedNotes = updatedNotes.filter(note => note.trashed);
    localStorage.setItem("trashed", JSON.stringify(trashedNotes));
  };

  const handlePermanentDelete = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);

    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    const trashedNotes = updatedNotes.filter(note => note.trashed);
    localStorage.setItem("trashed", JSON.stringify(trashedNotes));
  };

  const trashednotes = notes.filter((note) => note.trashed);

  console.log(trashednotes);

  return (
    <>
      <div className="bg-gray-800 h-screen text-white">
       <div className="container mx-auto">
         
        <div className="flex items-center  ">
          <h1 className="text-2xl font-medium text-center py-4 flex-2/3 ">Trashed Section</h1>
          <Link to={'/'}>
          <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mt-2 ">
              Home
          </button>
          </Link>

        </div>
        {
          trashednotes.length === 0 ? (
            <div className="bg-gray-600 h-screen flex justify-center items-center">
              <h1 className="text-2xl font-medium text-center py-2">No trashed notes</h1>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        xl:grid-cols-5 ">{
                      trashednotes.map((i) => {
              return (
                <div key={i.id} className="bg-gray-700 p-4 m-4 rounded-lg hover:scale-103 transition duration-300">
                  <h3 className="text-lg font-semibold">Title: {i.title}</h3>
                  <p className="text-gray-300 mb-4">Description: {i.description}</p>
                  <div className="flex gap-2">
                    {/* restore button */}
                    <button
                      onClick={() => handleRestore(i.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-2xl"
                    >
                      Restore
                    </button>
                    {/* permanent delete button */}
                    <button
                      onClick={() => handlePermanentDelete(i.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-2xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
              
              }
              
            </div>
    
          )
        }

       </div>
      </div>
    </>
  );
};

export default Trashnotes;