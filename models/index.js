const Sequelize = require('sequelize');


const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"fsjstd-restapi.db"
  })

    const User=sequelize.define("User",{
      id:{
          type:Sequelize.INTEGER,
          autoIncreament:true,
          primaryKey:true
      },
      firstName:{
          type:Sequelize.STRING,
          allowNull:false,
          validate: {
            notNull: {
              
              msg: 'Please provide a value for "firstName"',
           }
        }
         },
      lastName:{
          type:Sequelize.STRING,
          allowNull:false,validate: {
            notNull: {
              
              msg: 'Please provide a value for "lastName"',
          }
        }
    },
      emailAddress:{
          type:Sequelize.STRING,
          allowNull:false,
          validate: {
            notNull: {
              // custom error message
              msg: 'Please provide a value for "emailAdress"',
          }
        }
    },
      password:{
          type:Sequelize.STRING,
          allowNull:false,
          validate: {
            notNull: {
    
              msg: 'Please provide a value for "password"',
          }
        }
    },
    });

    



// coures model

    const Courses= sequelize.define("Courses",{
      id:{
          type:Sequelize.INTEGER,
          autoIncreament:true,
          primaryKey:true
      },
      title:{
          type:Sequelize.STRING,
          notEmpty:true,
          allowNull:false,
          validate: {
            notNull: {
             
              msg: 'Please provide a value for "title"',
            }
      }},
      description:{
          type:Sequelize.TEXT,
          allowNull:false,
          validate: {
            notNull: {
            
              msg: 'Please provide a value for "description"',
           }
        }
     },
      estimatedTime:{
          type:Sequelize.STRING,
          allowNull:true,
    },
    materialsNeeded:{
        type:Sequelize.STRING,
      allowNull:true
  },

    });

User.hasMany(Courses,{foreignKey:"userId"})     
Courses.belongsTo(User)


models={
    Course:Courses,
    User,
    sequelize
};
module.exports= models


