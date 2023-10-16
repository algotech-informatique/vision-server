{
    let smartflows = [];
    db.getCollection("snmodels").find({deleted: false, type: 'smartflow' }).forEach((sf) => {
        smartflows.push(sf);
    });

    function getWidgets(widgets) {
        let res = []
        widgets.forEach((w) => {
            res.push(w);
            if (w.group && w.group.widgets.length > 0) {
                const childs = getWidgets(w.group.widgets);
                childs.forEach((c) => {
                    res.push(c);
                });
            }
        });
        return res;
    }

    function getOutParam(node) {
        const flow = node.flows.find((f) => f.direction === 'out');
        if (flow && flow.params.length > 0) {
            return { params: flow.params, param: flow.params[0] };
        }

        if (node.params.length > 0) {
            const findOutParam = node.params.find((p) => p.direction === 'out');
            if (findOutParam) {
                return { params: node.params, param: findOutParam };
            }
        }

        return null;
    }

    function updateOutput(ev) {
        if (ev.type !== 'smartflow') {
            return ;
        }
        const snModel = smartflows.find((sf) => sf.key === ev.action);
        if (!snModel) {
            return ;
        }
        const version = snModel.versions.find((v) => v.uuid === snModel.publishedVersion);
        if (!version) {
            return ;
        }
        const smartflow = version.view;

        let type = '';
        let multiple = null;
        let requestNode = smartflow.nodes.filter((n) => n.type === 'SnRequestResultNode');

        const predicateCodeSuccess = (r) => {
            const codeValue = r.params.find((p) => p.key === 'code');
            if (!codeValue) {
                return false;
            }
            const code = +codeValue.value;
            if (!code) {
                return false;
            }
            return code >= 200 && code < 300;
        };
        if (requestNode.some(predicateCodeSuccess)) {
            requestNode = requestNode.filter(predicateCodeSuccess);
        }

        if (requestNode.length !== 0) {
            const rNode = requestNode[requestNode.length - 1];
            const param = getOutParam(rNode);
            type = param.param.types;
            multiple = (param.param.multiple);
        }
        print(ev.action + ' : ' + type);
        ev.smartflowResult = { type, multiple };
    }

    db.getCollection("snmodels").find({deleted: false, type: 'app'}).forEach(
        (snmodel) => {
            snmodel.versions.forEach((version) => {
                const app = version.view;
                const widgets = [...app.shared];

                for (const page of app.pages) {
                    for (const ev of page.events) {
                        // update output
                        for (const pipeEv of ev.pipe) {
                            this.updateOutput(pipeEv);
                        }
                    }
                    // update output
                    for (const ds of page.dataSources) {
                        this.updateOutput(ds);
                    }

                    // widgets
                    for (const widget of page.widgets) {
                        widgets.push(widget);
                    }
                }

                // widgets
                for (const widget of getWidgets(widgets)) {
                    // update output
                    const events = [...widget.events];
                    for (const rule of widget.rules) {
                        for (const ev of rule.events) {
                            events.push(ev);
                        }
                    }
                    for (const ev of events) {
                        for (const pipeEv of ev.pipe) {
                            this.updateOutput(pipeEv);
                        }
                    }
                }

            });

            snmodel.updateDate = new Date();
            db.getCollection("snmodels").save(snmodel);
            print('success snmodel: ' + snmodel.key);

        })
    print('done');
}