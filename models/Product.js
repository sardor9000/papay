const assert = require("assert")
const { shapeIntoMongooseObjectId, lookup_auth_member_liked } = require("../lib/config");
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const Member = require("./Member");

class Product {
    constructor(){
        this.productModel = ProductModel;
    }


    async getAllProductsData(member, data) {
        try {
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

            // aggregationga kerak boladigan matching object yasaymiz
            let match = { product_status: "PROCESS" };
            if (data.restaurant_mb_id) {
                match['restaurant_mb_id'] = shapeIntoMongooseObjectId(
                    data.restaurant_mb_id
                );
                match['product_collection'] = data.product_collection;
            };
            
            
            const sort = data.order === 'product_price'
                ? { [data.order]: 1 } // pastdan tepaga
                : { [data.order]: -1 } // tepadan pastga 
                
        

            const result = await this.productModel
                .aggregate([
                    { $match: match },
                    { $sort: sort },
                    { $skip: (data.page * 1 -1) * data.limit }, // 1-pageni oladi 
                    {$limit: data.limit * 1 },  //
                    // todo: check auth member product likes
                lookup_auth_member_liked(auth_mb_id, "members")

                ])
                .exec();
            
            

            assert.ok(result, Definer.general_err1);
            return result;

        } catch(err){
            throw err;
        }
    };

                            // login bolgan member
    async getChosenProductData(member, id) {
        try {
            // req ni kim beryapti
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
            id = shapeIntoMongooseObjectId(id);

            if (member) {
                // Member service modelni ishlatamiz
                const member_obj = new Member();
                                                // kim,  nimani, 
               await member_obj.viewChosenItemByMember(member, id, "product")
            }

            const result = await this.productModel
                .aggregate([
                { $match: { _id: id, product_status: "PROCESS" } },
                    // todo: check auth member product likes
                lookup_auth_member_liked(auth_mb_id, "members")
                    
            ])
                .exec();
            
            assert.ok(result, Definer.general_err1);
            return result[0];
        } catch (err) {
            throw err
        }
    }



    async getAllProductsDataResto(member) {
        try{
            member._id = shapeIntoMongooseObjectId(member._id)
            const result = await this.productModel.find({
                restaurant_mb_id: member._id
            });
            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err
        }
    }




    async addNewProductData(data, member) {
        try{
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);

            const new_product = new this.productModel(data);
            const result = await new_product.save();

            assert.ok(result, Definer.product_err1);
            return result;
        } catch(err){
            throw err;
        }
    } 



    async updateChosenProductData(id, updated_data, mb_id) {
        try{
           id = shapeIntoMongooseObjectId(id);
           mb_id = shapeIntoMongooseObjectId(mb_id);

           const result = this.productModel.findOneAndUpdate(
            {_id: id, restaurant_mb_id: mb_id},
            updated_data,
            {
                runValidators: true, 
                lean: true,
                 returnDocument: "after"
            }
            ).exec();

            assert.ok(result, Definer.general_err1);
            return result;
        } catch(err){
            throw err;
        }
    } 
}




module.exports = Product;  