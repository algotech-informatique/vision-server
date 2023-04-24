{
        //clean 'finished' et 'canceled' workflowinstances pour liberer de l'espace sur dans la base
        db.getCollection("workflowinstances").deleteMany({state: { $in: ['finished', 'canceled'] }});
        print('done');
}