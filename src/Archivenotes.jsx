import { useEffect } from "react";
import { Link } from "react-router";

const Archivenotes = ({ notes, setNotes }) => {

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        if (savedNotes.length > 0 && notes.length === 0) {
            setNotes(savedNotes);
        }
    }, [notes.length, setNotes]);

    const handleArchived = (id) => {
        const archivednotes = notes.map((note) => {
            return note.id === id ? { ...note, archived: false } : note
        })
        setNotes(archivednotes)
        localStorage.setItem("notes", JSON.stringify(archivednotes))
    }

    const handletrash = (id) => {

        let deletenote = notes.map((note) => {
            return note.id === id ? { ...note, archived: false, trashed: !note.trashed } : note
        })
        setNotes(deletenote)
        localStorage.setItem("notes", JSON.stringify(deletenote));

    }
    const onlyarchived = notes.filter(i => i.archived && !i.trashed)
    return (
        <>
            <div className="bg-gray-800 h-screen text-white">
                <div className="container mx-auto">
                    <div className="flex justify-between items-baseline  ">
                        <h1 className="text-2xl font-medium text-center py-2 flex-2/3 ">Archived Section</h1>
                        <Link to="/"><button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mt-2 ">Back To Home</button></Link>

                    </div>

                    {onlyarchived.length === 0 ? (<div className="bg-gray-600 h-screen flex justify-center items-center"><h1 className="text-2xl font-medium text-center py-2">No Archived Notes</h1></div>)
                        :
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        xl:grid-cols-5 ">

                            {onlyarchived.map((i) => {
                                return (
                                    <div key={i.id} className=" bg-gray-700 p-4 m-4 rounded-lg shadow shadow-gray-500 hover:scale-103  transtion duration-300">

                                        <h3 className="text-lg font-semibold">Title : {i.title}</h3>
                                        <p className="text-gray-300 mb-4">Description : {i.description}</p>


                                        <div className="flex gap-2">

                                            <button onClick={() => { handleArchived(i.id) }}
                                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md">Unarchive</button>
                                            <button className="
                            bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md" onClick={() => { handletrash(i.id) }}
                                            >delelte</button>
                                        </div>


                                    </div>
                                )
                            })}
                        </div>

                    }
                </div>

            </div>
        

        </>
    )
}

export default Archivenotes