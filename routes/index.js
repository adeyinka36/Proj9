const express = require('express');
const router= express.Router();
const models= require('../models');
const { User }= models;
const { Course }= models;


// wrapper async await function
function wrapper(cb){
    return async (req,res,next)=>{
        try{
            await cb(req,res,next)
        }catch(error){
            console.log(error)
        }
    }
};


// home route
// setup a friendly greeting for the root route
router.get('/',wrapper(async (req, res) => {
    res.json({
      message: 'Welcome to the REST API project!',
    });
  }));

  router.get('/api/users',(req,res)=>{
    res.status(200).json({"result":"sucess"})
  });

  router.post('api/users',async(req,res,next)=>{
      try{
          const data=  await User.build(req.body)
          console.log(data)
        res.status(201).json(req.body)
      }catch(error){
        if(error.name= 'SequelizeValidationError'){
            const errors= error.errors.map(err=>err.message)
            console.error("validations error : "+ errors)
        }
        console.log(`this is not a validation error : ${error}`)
      }
  });

  router.get('/api/courses',(req,res)=>{
   
    // Returns a list of courses 
   res.status(200).json({})
  }) 

  router.get('/api/courses/:id',(req,res)=>{
   
    // Returns course including users that own course for that id
   res.status(200).json({})
  }) 

  router.post('/api/courses/', async (req,res,next)=>{
     try{
        const data = await Course.build(req.body)
        res.status(201).json(data)
        console.log(sucess)
     }catch(error){
         if(error.name==="SequelizeValidationError"){
             const errors = error.errors.map(err=>err.message)
             console.log(`there were the following validation errors : ${errors}`)
         }
         console.log(`this is not a validation error: ${error}`)
     }
    //Creates a course, sets the Location header to the URI for the course, and returns no content
  
  }) 

  router.put('api/courses/:id', async (req,res)=>{
      //Updates a course and returns no content
      try{
        const data = await Course.findByPk(req.params.id)
        
        res.status(201)
        console.log(sucess)
      
    }catch(error){
        if(error.name==="SequelizeValidataionError"){
            console.log(`we have this validation error ${error}`)
        res.status(404)
        }
        else{
            console.log(`this is is not a validation error ${error}`)
        }
      }
  })

  router.delete('api/course/:id',(req,res)=>{
      
    // Deletes a course and returns no content
    res.status(204)
  })
  








  module.exports=router