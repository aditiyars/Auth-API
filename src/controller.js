const bcrypt = require('bcrypt')
const saltRounds = 10;
const {MongoClient} = require('mongodb')
require('dotenv').config()

const client = new MongoClient(process.env.MONGODB_URI)
async function run(){await client.connect();}
run();

const db = client.db(process.env.DB)
const users = db.collection('users')

let data = {
    username : '',
    password : ''
}

module.exports = {
    getIndex: (req, res) => {
        res.render('index', {data})
    },
    getLogin: (req, res) => {
        res.render('login')
    }, 
    getRegister: (req, res) => {
        res.render('register')
    },
    getForgot: (req,res) =>{
        res.render('forgotPass')
    },
    createUser: async (req, res) => {
        const pass  = await bcrypt.hash(req.body.password, saltRounds)
        data = {
            username : req.body.username,
            password : pass
        }

        try{
            
            const isDuplicate = await users.find({
                'username' : data.username
            }).toArray()
            
            if(isDuplicate.length > 0){
                res.json({
                    statusCode : 201,
                    status : 'failed',
                    message : 'username already taken',
                })
            }else{
                await users.insertOne(data)
                res.json({
                    statusCode : 200,
                    status : 'success',
                    message : 'User successfully created',
                    data : { ...data}
                })
            }
        }catch(err){
            res.json({
                statusCode : 500,
                status : 'error',
                type : err.name,
                message : err.message
            })
        }

        // res.render('index', {data})
    },
    login: async(req, res) =>{
        const data = {
            username : req.body.username,
            password : req.body.password
        }

        const cekUser = await users.find({
            username : data.username
        }).toArray()

        if(cekUser.length > 0){
            const pass = await bcrypt.compare(data.password , cekUser[0].password, )
            if(pass){
                res.json({
                    message:'berhasil login',
                    data: cekUser
                })
            }else{
                res.json({
                    message:'password salah'
                })
            }
        }else{
            res.json({
                message:'username tidak ditemukan',
            })
        }

    },
    getUser : async (req, res) => {
        try{
            const data = {
                'username' : 'rama',
                'password' : '123'
            }

            const result = await users.find({}).toArray()
            
            res.json({
                statusCode : 200,
                status : 'success',
                message : 'berhasil mendapatkan user',
                data : result
            })
        }catch(err){
            res.json({
                statusCode : 500,
                status : 'error',
                type : err.name,
                message : err.message
            })
        }
    },
    forgot: async (req, res) => {
        const data = {
            username :req.body.username,
            password : req.body.password
        }

        const result = await users.find({
            username : data.username
        }).toArray()

        if(result.length > 0){

            const newPass = await bcrypt.hash(data.password, saltRounds)
            const update = await users.updateOne({username : data.username}, {$set:{password : newPass}})

            res.json({
                message:'berhasil update password'
            })
        }else{
            res.json({
                message : 'username tidak ditemukan',
                data : result
            })
        }
    },
    notFound:(req, res)=>{
        res.json({
            statusCode:404,
            status:'failed',
            message:'halaman tidak tersedia'
        })
        // res.render('404')
    }
}