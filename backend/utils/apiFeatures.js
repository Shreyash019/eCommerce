class ApiFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    // Search feature
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            }
        } : {};
        console.log(keyword)
        this.query = this.query.find({...keyword})
        return this
    }

    // Filter
    filter(){
        // Creating copy of QueryStr Object
        const queryCopy = {...this.queryStr}
        // console.log(queryCopy)
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);
        
        console.log(queryCopy)

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        
        this.query = this.query.find(JSON.parse(queryStr));
        console.log(queryCopy)
        return this
    }

    // Price filter and Rating
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        // Skip(No of product we need to skip) like navigation 1st->0-5 then 2nd-> 6-10 .....
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip)
        
        return this;
    }
}

module.exports = ApiFeatures