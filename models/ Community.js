// Modullar classlar bilan xosil boladi
const BoArticleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const assert = require("assert");


class Community {
    constructor(){
        this.boArticleModel = BoArticleModel;
    }

    async createArticleData(member, data) {
        try {
            data.mb_id = shapeIntoMongooseObjectId(member._id);
            const new_article = await this.saveArticleData(data);
            return new_article;
        } catch (err) {
            throw err;
        }
    }

    async saveArticleData(data) {
        try {
            const article = new this.boArticleModel(data);
            return await article.save();
        } catch (mongo_err) {
            console.log(mongo_err)
            throw new Error(Definer.auth_err1)
        }
    };

    async getMemberArticlesData(member, mb_id, inquery) {
        try {
            const aiuth_mb_id = shapeIntoMongooseObjectId(member?._id);
            mb_id = shapeIntoMongooseObjectId(mb_id);
            const page = inquery['page'] ? inquery['page'] * 1 : 1;
            const limit = inquery['limit'] ? inquery['limit'] * 1 : 5;

            const result = await this.boArticleModel
                .aggregate([
                    { $match: { mb_id: mb_id, art_status: "active" } },
                    { $sort: { createdAt: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "members",
                            localField: "mb_id",
                            foreignField: "_id",
                            as: "member_data",
                        }
                    },
                    { $unwind: "$member_data" }
                    
                ])
            .exec();
           assert.ok(mb_id, Definer.article_err2);
            
            return result;
        } catch (err) {
            throw err;
        }
    }
    
    }


module.exports = Community;

