import React, { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]); //for storing todo, array
  const [error, setError] = useState(""); //displaying errors
  const [editId, setEditId] = useState(2); 
  const [message, setMessage] = useState(""); //displaying messages

  //states for editing todo
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:3000";

  const handleSubmit = () => {
    
    setError("")
    //checking inputs with if condition
    if (title.trim() !== "" && description.trim() !== "") 
      {
        fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json " }, //for letting request to know it's a json data
        body: JSON.stringify({ title, description }), //converting json data to string
        })
        .then((res) => {
          if (res.ok) 
          {
            //add item to list because post request
            setTodos([...todos, { title, description }]);
            setTitle(""), setDescription(""),
            setMessage("Item added successfully")
            setTimeout(setMessage,3000)
          } 
          else 
          { 
            setError("Unable to create todo item");
          }
      }).catch(()=>{
        setError("unable to connect to server")
      })
    }
    else{
      alert("Please enter all fields to create a ToDo")
    }
  };


  const getItems=()=>{
    fetch(apiUrl+'/todos')
    .then((res)=>res.json())
    .then((res)=>{
      setTodos(res)
      console.log(res);
    })
  }


  useEffect(()=>{
    getItems()
  },[])


  const handleUpdate=()=>{                           //*******same code for handleSumbit*******//
    setError("")
    //checking inputs with if condition
    if (editTitle.trim() !== "" && editDescription.trim() !== "") 
      {
        fetch(apiUrl + "/todos/"+editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json " }, //for letting request to know it's a json data
        body: JSON.stringify({ title: editTitle, description: editDescription }), //converting json data to string
        })
        .then((res) => {
          if (res.ok) 
          {
            //update item to list
            const updatedTodos = todos.map((item)=>{
              if(item._id==editId){
                item.title=editTitle;
                item.description=editDescription
              }
              return item
            })
            setTodos(updatedTodos);
            setEditTitle(""), setEditDescription(""),
            setMessage("Item updated successfully")
            setTimeout(setMessage,3000)
            setEditId(2)
          } 
          else 
          { 
            setError("Unable to create todo item");
          }


      }).catch(()=>{
        setError("unable to connect to server")
      })
    }
    else{
      alert("Please enter all fields to create a ToDo")
    }
  }

  const handleEditTodo=(items)=>{
    setEditId(items._id); 
    setEditTitle(items.title); 
    setEditDescription(items.description)
  }

  const handleEditCancel=()=>{
    setEditId(2)
  }


  const handleDelete=(id)=>{
    if(window.confirm("Are you sure want to delete ToDo?")){
      fetch(apiUrl+'/todos/'+id,{
        method: 'DELETE'
      })
      .then(()=>{
        const updatedTodos= todos.filter((item)=>{item._id !== id})
        setTodos(updatedTodos)
      })
    }
    }
    


  return (
    <>
      <div className="row p-3 mt-3 mb-3 bg-success text-light">
        <h1>ToDo Project [MERN]</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-3">
          <input
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Title"
            type="text"
          />
          <input
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Description"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Add
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
        <ul className="list-group">
          {
            todos.map((items)=>
              
              <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column me-2">
              {
                editId == 2 || editId !== items._id ?<>
                <span className="fw-bold">{items.title}</span>
                <span className="">{items.description}</span>
                </>:<>
                <div className="form-group d-flex gap-3">
                    <input
                      className="form-control"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      placeholder="Title"
                      type="text"
                    />
                    <input
                      className="form-control"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      placeholder="Description"
                    />
                  </div>
                </>
              }
              
            </div>
            <div className="d-flex gap-2">
              { editId == 2 || editId !== items._id ? <button className="btn btn-warning" onClick={()=>handleEditTodo(items)}>Edit</button>: <button className="btn btn-success" onClick={handleUpdate}>Update</button>}
              { editId==2 || editId !== items._id ? <button className="btn btn-danger" onClick={()=>handleDelete(items._id)}>Delete</button> :
              <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
            </div>
          </li>
          )
          }
          
        </ul>
        </div>
        
      </div>
    </>
  );
};

export default Todo;
