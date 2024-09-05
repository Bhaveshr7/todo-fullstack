//Using express and mongoose
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

//creating instance of express
const app=express();
app.use(express.json()) //to inform we are passing JSON data to express
app.use(cors())

//sample in-memory storage for todo items 
// let todos=[]

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/todo-mern-app')
.then(()=>{console.log('DB connected')})
.catch((err)=>{console.log(err)})

//creating schema
const todoSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String
})

//creating model
const todoModel=mongoose.model('Todo',todoSchema)

//create a new todo item
app.post('/todos',async (req, res)=>{

    const {title, description} = req.body
    // const newTodo={
    //     id: todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log(todos);
    
    try {

        const newTodo=new todoModel({title, description})
        await newTodo.save()
        res.status(201).json(newTodo)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }

})

//--------------------------------------------------------------------------------

app.get('/todos',async (req, res)=>{
    try {
        const todos=await todoModel.find()
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
    
})


//--------------------------------------------------------------------------------

app.put('/todos/:id',async (req,res)=>{

    try {
        const {title, description}=req.body
    const id=req.params.id
    const updatedTodo=await todoModel.findByIdAndUpdate(
        id,
        { title, description },
        { new : true}
    )

    if(!updatedTodo)
    {
        return res.status(404).json({message: "Todo not found"})
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }

})

//--------------------------------------------------------------------------------

app.delete('/todos/:id',async (req,res)=>{
    try {
        const id=req.params.id
    await todoModel.findByIdAndDelete(id)
    res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }

})

const port=3000;
app.listen(port,()=>{
    console.log("Server running in port:"+port);
})