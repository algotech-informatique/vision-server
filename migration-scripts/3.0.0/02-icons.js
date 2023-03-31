{
    const iconsCount = db.getCollection("icons").find({}).count();
    const iconfilesCount = db.getCollection("icons.files").find({}).count();
    let i = 0;
    if (iconsCount === 0) {
     print('creating icons');
     db.getCollection("icons.files").aggregate([{$project : { _id: 0, filename: 1.0, tags: '$metadata.tags'}}]).forEach((icon) => {
         icon.tags = icon.tags.filter(tag => {
             return tag.trim() !== "";
         })
         icon.tags.push(icon.filename.split('.')[0]);
         db.getCollection("icons").save(icon);
         print(i++ + '/' + iconfilesCount);
     });
    }
   print('done');
}