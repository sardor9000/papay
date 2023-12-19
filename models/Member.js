// Modullar classlar bilan xosil boladi
const assert = require("assert");
const Definer = require("../lib/mistake");
const bcrypt = require('bcryptjs');
const { shapeIntoMongooseObjectId,
    lookup_auth_member_following } = require("../lib/config");
const View = require("./View");
const Like = require("./like");
const MemberModel = require("../schema/member.model");

class Member {
    constructor(){
        this.memberModel = MemberModel
    }

    async signupData(input) {
        try {
            // passwordni jibrish qilib o'zgartirdik
            const salt = await bcrypt.genSalt();
            input.mb_password = await bcrypt.hash(input.mb_password, salt)

            // schema modeldan instance olib uning save methodi orqli databesga saqladik
            const new_member = new this.memberModel(input); 

            let result;
            try{
                result = await new_member.save();
            }catch(mongo_err){
                console.log(mongo_err)
                throw new Error(Definer.mongo_validation_err1)
            }

            result.mb_password = ""
            return result;
        }catch(err){
            throw err;
        }
    }


    async loginData(input) {
        try{

        const member = await this.memberModel
        .findOne(
            {mb_nick: input.mb_nick}, {mb_nick: 1, mb_password: 1})
            .exec();
            console.log('member:', member);
            assert.ok(member, Definer.auth_err3);

            const isMatch = await bcrypt.compare(
                input.mb_password,
                member.mb_password
                );
            assert.ok(isMatch, Definer.auth_err4);

            return await this.memberModel
            .findOne({
                mb_nick: input.mb_nick
            })
            .exec();
        }catch(err){
         throw err;
        }
    }



    async getChosenMemberData(member, id) {
        try {
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id)
            // string kelgan malumotni objectga tenglaymiz
            id = shapeIntoMongooseObjectId(id);
            console.log("member::", member);

            let aggregateQuery = [
                { $match: { _id: id, mb_status: "ACTIVE" } },
                { $unset: "mb_password" }
            ];

            if (member) {
                // condition if not seen before
                await this.viewChosenItemByMember(member, id, "member");
                // todo: check auth member liked the chosen member
                aggregateQuery.push(lookup_auth_member_following(auth_mb_id, "members"));
            }
            const result = await this.memberModel 
                // pipeline 
                .aggregate(aggregateQuery)
                .exec();
            
            assert.ok(result, Definer.general_err2);
            return result[0]
       
        }catch(err){
         throw err;
        }
    }


    async viewChosenItemByMember(member, view_ref_id, group_type) {
        try {
            view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
            const mb_id = shapeIntoMongooseObjectId(member._id);
            const view = new View(mb_id);

            // validation needed
            const isValid = await view.validateChosenTarget(view_ref_id, group_type);
            console.log("isValid::", isValid)
            assert.ok(isValid, Definer.general_err2);

            // logged user has seen target before
            const doesExist = await view.checkViewExistance(view_ref_id);
            console.log('doesExit', doesExist);

            if (!doesExist) {
                const result = await view.insertMemberView(view_ref_id, group_type);
                assert.ok(result, Definer.general_err1);
            }

            return true;

        } catch (err) {
            throw err;
        }
    };


    async likeChosenItemByMember(member, like_ref_id, group_type) {
        try {
            like_ref_id = shapeIntoMongooseObjectId(like_ref_id);
            const mb_id = shapeIntoMongooseObjectId(member._id);

            const like = new Like(mb_id);
            const isValid = await like.validateTargetItem(like_ref_id, group_type);
            assert.ok(isValid, Definer.general_err2);

            const doesExist = await like.checkLikeExistance(like_ref_id);
            console.log("doesexist::", doesExist)
            
            let data = doesExist
            ? await like.removeMemberLike(like_ref_id, group_type)
            : await like.insertMemberLike(like_ref_id, group_type);
            assert.ok(data, Definer.general_err1);

            const result = {
                like_group: data.like_group,
                like_ref_id: data.like_ref_id,
                like_status: doesExist ? 0 : 1,
            };
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Member;

