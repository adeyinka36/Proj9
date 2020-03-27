const express = require('express');
const router= express.Router();
const models= require('../models');
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const { User }= models;
const { Course }= models;
const bodyParser = require('body-parser');


// authentication middlewear

const authenticate= async (req,res,next)=>{
   let  message = null
   const credentials= auth(req)

   if(credentials){
       let  gottenUsers =  await User.findAll();
       gottenUsers=gottenUsers.map(u=>u.toJSON());

       const foundUser = gottenUsers.find(u=>u.emailAddress===credentials.name);

        if(foundUser){
            const authenticated = bcrypt.compareSync(credentials.pass, foundUser.password);
        
            if(authenticated){
            req.currentUser = foundUser
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


// function for validating  e-mail with regular expression
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

// home route
// setup a friendly greeting for the root route
router.get('/',(req, res) => {
      
    
    res.json({
      message: 'Welcome to the REST API project!',
    });
  });

  
//   return currently authenticated user
  router.get('/users',authenticate,async (req,res)=>{
     
     user=req.currentUser
    res.status(200).json({id:user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress})
  });

  
  
 // Creates a user, sets the Location header to "/", and returns no content 
  router.post('/users',async(req,res,next)=>{
      const email=req.body.toJSON().emailAddress
      const emailValidationResult= validateEmail(email);
      let  dataBaseEmails= await User.findAll();
         dataBaseEmails= dataBaseEmails.toJSON()
         const doestEmailAlreadyExist= dataBaseEmails.find(e=>e.emailAddress===email)

if(emailValidationResult&&!doestEmailAlreadyExist){
      try{
          req.body.password=bcrypt.hashSync(req.body.password)
          const data=  await User.build(req.body)
          await data.save()
          console.log("sucess")
        res.status(201).json(req.body)
      }catch(error){
        if(error.name=== 'SequelizeValidationError'){
            const errors = error.errors.map(err => err.message);
            console.error('Validation errors: ', errors);
            res.status(400).json(errors)
        }
        throw error
      }
    }
    else{
        res.status(400).json({message:"email already exists in database or is invalid please check"})
    }
  });

  
  
  // Returns a list of courses
  router.get('/courses',authenticate,async (req,res)=>{
        let courses = await Course.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"]
            }
          }
        ]
      });
       courses = courses.map(c=>c.toJSON())
     
   res.status(200).json(courses)
  }) 

  
// Returns course including users that own course for that id
  router.get('/courses/:id',async (req,res)=>{
    let  course = await Course.findByPk(req.params.id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"]
            }
          }
        ]
      });
    course=course.toJSON()
    

    
   res.status(200).json(course)
  }) 

  //Creates a course, sets the Location header to the URL for the course, and returns no content
  router.post('/courses/',authenticate, async (req,res,next)=>{
     try{
         req.body.userId=req.currentUser.id
        let data = await Course.create(req.body)
        let dataId= req.currentUser.id
        
         
        res.status(201).json({location:`/api/courses/${dataId}`}).end()
        console.log(sucess)
     }catch(error){
         if(error.name==="SequelizeValidationError"){
             const errors = error.errors.map(err=>err.message)
             console.log(`there were the following validation errors : ${errors}`)
            return  res.status(400).json(errors)
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
        res.status(403).end()
        }
        else{
            res.status(403).end()
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
