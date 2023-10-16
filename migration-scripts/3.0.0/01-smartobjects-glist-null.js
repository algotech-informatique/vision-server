{   
    function getModels() {
        let smartmodels = [];
        db.getCollection("smartmodels").find({ deleted: false }).forEach((sm) => {
            smartmodels.push(sm);
        })
        return smartmodels;
    }

    const models = getModels();
    const objects = db.getCollection("smartobjects").find({});
    const count = objects.count();
    var index = 0;
    objects.forEach(
        (so) => {
            const sm = models.find((sm) => sm.key === so.modelKey);
            if (sm) {
                sm.properties.forEach((prop) => {
                    if (prop.items) {
                        const val = so.properties[prop.key];
                        if (val === '') {
                            so.properties[prop.key] = null;
                        }
                    }
                });
                so.updateDate = new Date();
                db.getCollection("smartobjects").save(so);
            } else {
                print('model not find ' + so.uuid + ' : ' + so.modelKey);
            }
            index++;
            print(`${index}/${count}`);
        })
    print('done');
}