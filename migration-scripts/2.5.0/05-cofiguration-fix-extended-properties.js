{
    ["snmodels", "workflowmodels", "smartflowmodels", "applicationmodels"].forEach(
        (collection) => {
            db.getCollection(collection).find({ deleted: false }).forEach(
                (item) => {
                    
                    let str = JSON.stringify(item);
                    if (str.includes('$__')) {

                        str = str.split('$__').join('~__');
                        
                        const newItem = JSON.parse(str);
                        newItem.updateDate = new Date();
                        newItem._id = item._id;
                        db.getCollection(collection).save(newItem);
                        
                        print('success ' + collection + ' :' + newItem.uuid);
                    
                    }
                })
        }
    );
    print('done');
}