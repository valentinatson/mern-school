const dataBase = require("../Config/mysql")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')




exports.signup = (req,res) => {
    console.log(req.body);
    

    let insertUserQuery = "INSERT INTO student(name_student,surname_student,email_student,password_student) VALUES (?,?,?,?)"

    bcrypt
    .hash(req.body.password, 5)
    .then((hash) => {
        dataBase.query(
            insertUserQuery,
            [req.body.name,req.body.surname,req.body.email, hash],  //zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
            (error, result)=>{
                if (error) {
                    res.status(401).json(error)
                }
                res.status(201).json({hash, id: result.insertId})
            }  
        ) 
        
        
        
    })
    .catch((error) => {
        res.status(500).json(error)
    })
    

}

exports.login = (req,res) => {
    console.log(req.body); 

    let selectUserQuery = "SELECT * from `student` WHERE email_student =? ";
    dataBase.query(selectUserQuery,[req.body.email], (error, result) => {  //zzzzzzzzzzzzzzzzzzzz
        //error? res.json(error) : res.status(200).json(result) 

        if(error){
            // query not executed due to server error
            res.status(500).json(error)
        } 
        if(result.length > 0){
            //user found
            bcrypt.compare(req.body.password,result[0].password_student)
            .then((valid) => { 
                if(valid){
                    //valid password
                    let accessToken = jwt.sign(
                        {student_id : result[0].id_student},"12345678",{expiresIn: "15h"}
                    )
                    //res.status(200).json("c'est parfait")
                    res.status(200).json({accessToken})
                }else{
                    //invalid password
                    res.status(401).json({error:"incorrect password"})
                }
            })
            .catch((error) => res.status(500).json(error))
        }else{
            //user not found
            res.status(401).json({error:"user not found"})
        }
    })
}