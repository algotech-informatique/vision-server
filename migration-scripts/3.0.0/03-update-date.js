    {
        [
            "applicationmodels",
            "document",
            "genericlists",
            "smartflowmodels",
            "smartmodels",
            "snmodels",
            "smartobjects",
            "tags",
            "workflowmodels"
        ].forEach((collection) => {
            db.getCollection(collection).find({ $or: [{
                updateDate: { $type: "string"}
            }, {
                createdDate: { $type: "string"}
            }] }).forEach((item) => {

                item.updateDate = new Date(item.updateDate);
                item.createdDate = new Date(item.createdDate);

                db.getCollection(collection).save(item);
            });
        });
        print('done');
    }