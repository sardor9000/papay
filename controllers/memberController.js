const Definer = require("../lib/mistake");
const Member = require("../models/Member");
const assert = require("assert");


let memberController = module.exports;
const jwt = require("jsonwebtoken")
memberController.signup = async (req, res) =>{
try{
    console.log('POST: cont/signup');
    const data = req.body,
    member = new Member(),
        new_member = await member.signupData(data);
    
        const token = memberController.createToken(new_member);

        res.cookie("access_token", token, { maxAge: 6 * 3600 * 1000, httpOnly: true, });



    res.json({state: 'succeed', data: new_member});
}catch(err){
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({state: 'fail', message: err.message});
}
};



memberController.login = async (req, res) =>{
    try{
        console.log('POST: cont/login');
        const data = req.body,
        member = new Member(),
            result = await member.loginData(data);
        
        console.log('result::', result);
        const token = memberController.createToken(result);
        console.log("token::",token);

        res.cookie("access_token", token, { maxAge: 6 * 3600 * 1000, httpOnly: true, });


        res.json({state: 'succeed', data: result});
    }catch(err){
        console.log(`ERROR, cont/login, ${err.message}`);
        res.json({state: 'fail', message: err.message});
    }
}

memberController.logout = (req, res) =>{
    console.log("GET cont.logout");
    res.send("logout sahifadasiz")
}

memberController.createToken = (result) => {
    try {
        const upload_data = {
            _id: result._id,
            mb_nick: result._id,
            my_type: result.mb_type
        };

        const token = jwt.sign(
            upload_data,
            process.env.SECRET_TOKEN,
            {expiresIn: "6h"},
        )
        assert.ok(token, Definer.auth_err2)
        return token
    } catch (err) {
        throw err
    }
}