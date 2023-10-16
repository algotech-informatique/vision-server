{
    db.getCollection("snmodels").find({ deleted: false, type: 'smartflow' }).forEach(
        (snmodel) => {
            let updated = false;

            snmodel.versions.forEach((version) => {
                const smartflow = version.view;
                smartflow.nodes.forEach((n) => {
                    if (n.type === 'SnServiceNode') {
                        const responseType = n.params.find((p) => p.key === 'responseType');
                        if (responseType && responseType.value === 'text') {
                            updated = true;
                            responseType.value = 'json';
                        }
                    }
                })
            });

            if (updated) {
                snmodel.updateDate = new Date();
                db.getCollection("snmodels").save(snmodel);
                print('success snmodel: ' + snmodel.key);
            }
        })
    print('done');
}