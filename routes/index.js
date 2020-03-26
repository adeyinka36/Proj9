const express = require('express');
const router= express.Router();
const models= require('../models');
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const { User }= models;
const { Course }= models;


// authentication middlewear

const authenticate= async (req,res,next)=>{
   let  message = null
   const credentials= auth(req)

   if(credentials){
       let  gottenUsers =  await User.findAll();
       gottenUsers=gottenUsers.map(u=>u.toJSON());

       const foundUser = gottenUsers.find(u=>u.emailAddress===credentials.name);

        if(foundUser){
            const authenticated = bcryptjs.compareSync(credentials.pass, verifiedUser.password);
        
            if(authenticated){
            req.currentUser = verifiedUser
            }
            else{
            message= "Incorrect password "
            }
        }else{
            message= "User not found"
        }
    

    }else{
        message="Plese provide credentials"
    }
  if(message){
      const err = new Error(message)
      next(err)
  }
  else{
      next()
  }

}


// home route
// setup a friendly greeting for the root route
router.get('/',(req, res) => {
      
    
    res.json({
      message: 'Welcome to the REST API project!',
    });
  });

  
  
  router.get('/users',authenticate,(req,res)=>{
     
    res.status(200).json(req.currentUser)
  });

  
  
  
  
  router.post('/users',async(req,res,next)=>{
           
      try{
          req.body.password=bcrypt.hashSync(req.body.password)
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

  
  
  
  router.get('/courses',authenticate,async (req,res)=>{
       const courses = await Course.findAll()
       courses = courses.map(c=>c.toJSON())
    // Returns a list of courses 
   res.status(200).json(courses)
  }) 

  router.get('/courses/:id',(req,res)=>{
   
    // Returns course including users that own course for that id
   res.status(200).json({})
  }) 

  //Creates a course, sets the Location header to the URL for the course, and returns no content
  router.post('/courses/',authenticate, async (req,res,next)=>{
     try{
        const data = await Course.build(req.body)
        const dataId = data.toJSON().id
        res.status(201).json({location:`/api/courses/${dataId}`})
        console.log(sucess)
     }catch(error){
         if(error.name==="SequelizeValidationError"){
             const errors = error.errors.map(err=>err.message)
             console.log(`there were the following validation errors : ${errors}`)
         }
         console.log(`this is not a validation error: ${error}`)
     }
    
  }) 


  //Updates a course and returns no content
  router.put('/courses/:id',authenticate, async (req,res)=>{
     if (currentUser.id===req.params.id){
      try{
        const data = await Course.findByPk(req.params.id)
        data.update(req.body)
        res.status(201).end()
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
}
else{
   res.status(403).end()
}
})


    // Deletes a course and returns no content
  router.delete('/course/:id',authenticate,async (req,res)=>{

    if (req.currentUser.id===req.params.id){
       const courseTodelete = await Course.findByPk(req.params.id)
      await courseTodelete.destroy()
  
    res.status(204).end()
}
 else{
     res.status(403)
 }
})


module.exports= router
