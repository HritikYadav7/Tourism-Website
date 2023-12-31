class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = { ...this.queryString};
        const exculdedFields = ['page', 'sort', 'limit', 'fields'];
        exculdedFields.forEach(el => delete queryObj[el]);
        
        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            // sort('price ratingsAverage');
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    fieldsLimiting() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); 
        }
        else {
            this.query = this.query.select('-__v')
        }
        return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
        // if(req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if(skip >= numTours) 
        //         throw new Error('This page does not exist.');
        // }
    }
}

module.exports = APIFeatures;