const mongoose = require("mongoose");
const httpStatusCodes = require("http-status-codes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require("../models/models.index");

class AuthService {

    async signUp(request) {
        return new Promise(async (resolve, reject) => {
            try {
                const { email, password, firstname, lastname, role } = request.body;
                if(!email || !password){         
                    return resolve({ status: false, "message": "email and password are needed" })
                }
                            
                const duplicate = await User.findOne({ email: email }) 
                if(duplicate){              
                    return resolve({ status: false, "message": `user with email ${email} exists` });
                }

                const hashedPwd = await bcrypt.hash( password, 10 );
                
                const createUser = await User.create({
                    "email": email,
                    "role": role,
                    "hashPassword": hashedPwd,
                    firstname: firstname, 
                    lastname: lastname
                })

                return resolve({ status: true, "success": `new user ${email} created`});
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async login(request, response) {
        return new Promise(async (resolve, reject) => {
            try {
                const cookies = request.cookies;
                const { email, password } = request.body;
                if( !email || !password ){         
                    return response.status(400).json({ status: false, "message":"email and password are needed" })
                };
                
                const foundUser = await User.findOne({ email: email }).populate({ path: "role", select: "title" })
                if(!foundUser){           
                    return response.status(401).json({ status: false, "message":"user not found" });
                }
                
                const match = await bcrypt.compare( password, foundUser.hashPassword);
                if(match){
                                                
                    const accessToken = jwt.sign(
                        { "UserInfo":{
                                "email": foundUser.email,
                                "_id": foundUser._id                        
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: foundUser?.role?.title === "system" ? "30s" : '1d' }

                    );

                    const refreshToken = jwt.sign(
                        { "email": foundUser.email, "_id":foundUser._id },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn:'1s' }

                    );  

                    if (cookies?.jwt) {
                        response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
                    }

                    foundUser.refreshToken = refreshToken;
                    // uncomment for refresh
                    // const result = await foundUser.save();
                    
                    const userCopy = foundUser.toJSON()
                    delete userCopy.hashPassword
                    delete userCopy.refreshToken
                    delete userCopy.createdAt
                    delete userCopy.updatedAt

                    const updatedUser = await User.findOneAndUpdate({ _id: foundUser._id }, { "$set": { refreshToken: refreshToken } }, { new: true })
                    response.cookie( 'jwt', refreshToken, { httpOnly:true, sameSite:'none', secure:true, maxAge: 24*60*60*1000 } );
                    response.json({ status: true, accessToken, user: userCopy, message: "Logged in successfully!" });
                } 
                else{
                    return response.status(401).json({ status: false, "message":"Incorrect password" });
                }
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async refresh(request, response) {
        return new Promise(async (resolve, reject) => {
            try {
                const cookies = request.cookies;
                console.log("cookies",cookies)
                if(!cookies?.jwt){         
                    return response.status(401).json({"message":"unauthorised"})
                };
                console.log(cookies.jwt);
            
                const refreshToken = cookies.jwt;
                response.clearCookie('jwt',{ httpOnly:true, sameSite:'none', secure:true, maxAge:24*60*60*1000});
                                  // 
                const foundUser = await User.findOne({ refreshToken:refreshToken }).exec();
                console.log("foundUser", foundUser)
                if(!foundUser){   
                    jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET,
                        async (err,decoded)=>{
                            if(err) return response.status(403).json({"message":"unauthorised"});
                            const hackedUser = await User.findOne({ username: decoded.username }).exec();
                            hackedUser.refreshToken = '';
                            const result = await hackedUser.save();
                        }
                    )        
                    return response.status(403).json({"message":"unauthorised"});
                }
            
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    async (error,decoded)=>{
                        console.log("decoded", decoded)
                        if (error) {          
                            foundUser.refreshToken = '';
                            const result = await foundUser.save();
                        }
                        console.log("foundUser._id", foundUser._id.toString())
                        
                        console.log("foundUser._id !== decoded._id", foundUser._id.toString() !== decoded._id)
                        if(error || foundUser._id !== decoded._id){
                            return response.status(403).json({"message":"unauthorised"});
                        }
                        const role = foundUser.role;
                        const accessToken = jwt.sign(
                            { 
                                "UserInfo":{
                                    "_id":decoded._id,
                                    "email":decoded.email,
                                    "role":role
                                } 
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn:'1d'}
                        );
            
                        const newRefreshToken = jwt.sign(
                            { "email":foundUser.email, "_id": foundUser._id },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn:'30d' }
                        )
                        foundUser.refreshToken = newRefreshToken;
                        const result = await foundUser.save();
                        response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                        response.status(200).json({ accessToken, role });
                    }
                );
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async logout(request, response) {
        return new Promise(async (resolve, reject) => {
            try {
                const cookies = request.cookies
                if(!cookies?.jwt){         
                    return response.status(204).json({ status: false, "message":"unauthorised"})
                };
                const refreshToken = cookies.jwt

                // is the refresh token in DB
                
                const foundUser = await User.findOne({ refreshToken }).exec();
                if(!foundUser){           
                    response.clearCookie('jwt',{ httpOnly:true, sameSite:'none', secure:true, maxAge:24*60*60*1000})
                    return response.status(204).json({ status: false, "message":"unauthorised"});
                }
                // delete refresh token in the database
                foundUser.refreshToken = '';
                const result = await foundUser.save();
                console.log(result);

                response.clearCookie('jwt',{ httpOnly:true, sameSite:'none', secure:true, maxAge:24*60*60*1000}); // we also have to add secure:true  that makes serve only https
                response.status(204).json({ status: true, "logOut":result.username});  
            }
            catch(error) {
                return reject(error);
            }
        });
    }
}

module.exports = AuthService;